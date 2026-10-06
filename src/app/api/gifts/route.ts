import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { emitOwnerEvent } from "@/lib/socket";
import { sendPushNotificationToOwners } from "@/lib/push";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để tặng quà VIP" }, { status: 401 });
    }

    const { postId, giftType, giftValue, message } = await request.json();

    if (!postId || !giftType || !giftValue) {
      return NextResponse.json({ error: "Thông tin quà tặng không hợp lệ" }, { status: 400 });
    }

    const gift = await prisma.gift.create({
      data: {
        postId,
        senderId: currentUser.id,
        giftType,
        giftValue: Number(giftValue),
        message: message || "Đã gửi tặng món quà VIP!",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Trigger in-app notification in Chat
    let conv = await prisma.chatConversation.findUnique({ where: { memberId: currentUser.id } });
    if (!conv) {
      conv = await prisma.chatConversation.create({ data: { memberId: currentUser.id } });
    }

    await prisma.chatMessage.create({
      data: {
        conversationId: conv.id,
        senderId: currentUser.id,
        content: `🎁 [TẶNG QUÀ VIP]: ${currentUser.fullName} đã gửi tặng "${giftType}" trị giá ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(giftValue))}! Lời nhắn: "${message || "Chúc mừng!"}"`,
        isSystemEvent: true,
      },
    });

    emitOwnerEvent("new_gift", { gift, postId });
    const giftNotificationText = `🎁 [DONATE]: ${currentUser.fullName} đã gửi tặng "${giftType}" trị giá ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(giftValue))}!`;
    sendPushNotificationToOwners({
      title: "Tặng Quà VIP 👑",
      body: giftNotificationText,
      url: `/?postId=${postId}`,
    }).catch((err) => console.error("Push failed:", err));
    sendTelegramNotification(giftNotificationText).catch((err) => console.error("Telegram failed:", err));

    return NextResponse.json({ gift, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
