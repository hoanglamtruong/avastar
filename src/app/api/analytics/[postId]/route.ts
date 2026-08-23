import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json({ error: "Chỉ Owner mới có quyền xem Analytics chi tiết" }, { status: 403 });
    }

    const { postId } = await params;

    const views = await prisma.postView.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: { viewedAt: "desc" },
    });

    const gifts = await prisma.gift.findMany({
      where: { postId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalViews = views.length;
    const totalDuration = views.reduce((sum, v) => sum + (v.watchDurationSeconds || 0), 0);
    const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;
    const totalGiftsValue = gifts.reduce((sum, g) => sum + Number(g.giftValue || 0), 0);

    return NextResponse.json({
      totalViews,
      totalDuration,
      avgDuration,
      totalGiftsValue,
      views,
      gifts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
