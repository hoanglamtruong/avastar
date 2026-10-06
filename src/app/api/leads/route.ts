import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitOwnerEvent } from "@/lib/socket";
import { sendPushNotificationToOwners } from "@/lib/push";

// Lead: form "Yêu cầu / Báo giá" và nút "Tham gia" câu lạc bộ — lưu bền vững,
// không còn phụ thuộc owner đang online mới nhận được (khác /api/subpage-actions cũ).
export async function POST(request: NextRequest) {
  try {
    const { postId, postCardId, leadType, name, phone, email, note } = await request.json();

    if (!postId || !leadType || !name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc (họ tên, số điện thoại)" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        postId,
        postCardId: postCardId || null,
        leadType,
        name,
        phone,
        email: email || null,
        note: note || null,
      },
    });

    const label = leadType === "club_join" ? "Yêu cầu tham gia Câu Lạc Bộ" : "Yêu cầu / Báo giá";
    const notificationText = `📩 [${label}]: ${name} - SĐT: ${phone}${note ? ` - Ghi chú: ${note}` : ""}`;

    emitOwnerEvent("new_lead", { leadId: lead.id, postId, postCardId, leadType, notificationText });
    sendPushNotificationToOwners({
      title: "Yêu cầu mới từ khách 📩",
      body: notificationText,
      url: `/admin`,
    }).catch((err) => console.error("Push failed:", err));

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
