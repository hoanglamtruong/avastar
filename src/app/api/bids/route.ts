import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitOwnerEvent } from "@/lib/socket";
import { sendPushNotificationToOwners } from "@/lib/push";
import { sendTelegramNotification } from "@/lib/telegram";

// Đấu giá: Bid là bảng riêng (không nằm trong cardMetadata) vì cần đọc/ghi
// đồng thời an toàn khi nhiều người trả giá cùng lúc. Giá hiện tại = bid cao
// nhất; người thắng xác định khi hết giờ (endsAt trong cardMetadata của
// PostCard), không cần job nền — chỉ so sánh now() vs endsAt mỗi lần đọc.

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postCardId = searchParams.get("postCardId");
    if (!postCardId) {
      return NextResponse.json({ error: "Thiếu postCardId" }, { status: 400 });
    }
    const bids = await prisma.bid.findMany({
      where: { postCardId },
      orderBy: { amount: "desc" },
      take: 50,
    });
    return NextResponse.json({ bids, highest: bids[0] || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postCardId, bidderName, bidderPhone, amount } = await request.json();
    if (!postCardId || !bidderName || !bidderPhone || !amount) {
      return NextResponse.json({ error: "Thiếu thông tin đặt giá" }, { status: 400 });
    }

    const card = await prisma.postCard.findUnique({ where: { id: postCardId } });
    if (!card || card.cardType !== "auction") {
      return NextResponse.json({ error: "Phiên đấu giá không tồn tại" }, { status: 404 });
    }
    const meta = (card.cardMetadata as any) || {};
    if (meta.endsAt && new Date(meta.endsAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Phiên đấu giá đã kết thúc" }, { status: 400 });
    }

    const highest = await prisma.bid.findFirst({ where: { postCardId }, orderBy: { amount: "desc" } });
    const minNext = highest ? Number(highest.amount) + (Number(meta.minIncrement) || 0) : Number(meta.startingPrice) || 0;

    if (Number(amount) < minNext) {
      return NextResponse.json({ error: `Giá đặt phải từ ${minNext.toLocaleString("vi-VN")}đ trở lên` }, { status: 400 });
    }

    const bid = await prisma.bid.create({
      data: { postCardId, bidderName, bidderPhone, amount: Number(amount) },
    });

    const notificationText = `🔨 [ĐẤU GIÁ]: ${bidderName} vừa đặt giá ${Number(amount).toLocaleString("vi-VN")}đ cho "${meta.itemName || "vật phẩm"}"`;
    emitOwnerEvent("new_bid", { postCardId, amount: Number(amount), bidderName, createdAt: bid.createdAt });
    sendPushNotificationToOwners({
      title: "Có người đặt giá mới 🔨",
      body: notificationText,
      url: `/admin`,
    }).catch((err) => console.error("Push failed:", err));
    sendTelegramNotification(notificationText).catch((err) => console.error("Telegram failed:", err));

    return NextResponse.json({ success: true, bid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
