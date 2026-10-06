import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitOwnerEvent } from "@/lib/socket";
import { sendPushNotificationToOwners } from "@/lib/push";

// CardOrder: ghi nhận đơn "Mua ngay" (package) / "Giữ chỗ" (reservation) /
// "Đăng ký thành viên" (membership) sau khi khách bấm "Tôi đã chuyển khoản" ở
// khung VietQR. Không xác thực tự động giao dịch ngân hàng — Owner đối soát
// thủ công qua /admin, giống đúng cách Donate đang vận hành.
export async function POST(request: NextRequest) {
  try {
    const { postId, postCardId, orderKind, itemName, amount, customerName, customerPhone, note } =
      await request.json();

    if (!postId || !postCardId || !orderKind || !itemName || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Thiếu thông tin đơn hàng" }, { status: 400 });
    }

    const order = await prisma.cardOrder.create({
      data: {
        postId,
        postCardId,
        orderKind,
        itemName,
        amount: Number(amount) || 0,
        customerName,
        customerPhone,
        note: note || null,
      },
    });

    const kindLabel =
      orderKind === "package" ? "ĐƠN MUA NGAY" : orderKind === "reservation" ? "GIỮ CHỖ" : "ĐĂNG KÝ THÀNH VIÊN";
    const notificationText = `🛒 [${kindLabel}]: ${customerName} - "${itemName}" (${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount) || 0)}) - SĐT: ${customerPhone}`;

    emitOwnerEvent("new_order", { orderId: order.id, postId, postCardId, orderKind, notificationText });
    sendPushNotificationToOwners({
      title: "Đơn hàng mới 🛒",
      body: notificationText,
      url: `/admin`,
    }).catch((err) => console.error("Push failed:", err));

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.cardOrder.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
