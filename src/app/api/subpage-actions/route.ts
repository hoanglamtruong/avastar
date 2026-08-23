import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { actionType, payload, postId } = await request.json();

    let notificationText = "";

    switch (actionType) {
      case "order_product":
        notificationText = `🛒 [ĐƠN HÀNG MỚI]: ${currentUser?.fullName || payload.name} vừa đặt mua sản phẩm: "${payload.productName}" (Giá: ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(payload.price)}) - SĐT: ${payload.phone}`;
        break;
      case "event_ticket":
        notificationText = `🎟️ [ĐĂNG KÝ VÉ SỰ KIỆN]: ${currentUser?.fullName || payload.name} đăng ký tham gia sự kiện: "${payload.eventName}" - Email: ${payload.email}, SĐT: ${payload.phone}`;
        break;
      case "submit_cv":
        notificationText = `💼 [ỨNG TUYỂN CÔNG VIỆC]: ${currentUser?.fullName || payload.name} nộp hồ sơ ứng tuyển vị trí: "${payload.jobTitle}" - SĐT: ${payload.phone}, Portfolio: ${payload.portfolio || "Không có"}`;
        break;
      case "connect_request":
        notificationText = `🤝 [LỜI MỜI KẾT NỐI 1-1]: ${currentUser?.fullName || payload.name} gửi lời mời kết nối riêng 1-1: "${payload.message}" - SĐT/Zalo: ${payload.phone}`;
        break;
      default:
        notificationText = `🔔 [TƯƠNG TÁC SUBPAGE]: ${currentUser?.fullName || "Khách"} vừa thực hiện hành động trên bài viết.`;
    }

    if (currentUser) {
      let conv = await prisma.chatConversation.findUnique({ where: { memberId: currentUser.id } });
      if (!conv) {
        conv = await prisma.chatConversation.create({ data: { memberId: currentUser.id } });
      }
      await prisma.chatMessage.create({
        data: {
          conversationId: conv.id,
          senderId: currentUser.id,
          content: notificationText,
          isSystemEvent: true,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Hành động đã được ghi nhận thành công!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
