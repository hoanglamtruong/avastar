import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền truy cập trang quản trị" },
        { status: 403 }
      );
    }

    const [
      postsCount,
      viewsCount,
      commentsCount,
      conversationsCount,
      gifts,
      orders,
      leads,
      bids,
      cardTypeGroups,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.postView.count(),
      prisma.comment.count(),
      prisma.chatConversation.count(),
      prisma.gift.findMany({
        include: {
          sender: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
          post: { select: { id: true, caption: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.cardOrder.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.bid.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.postCard.groupBy({ by: ["cardType"], _count: { cardType: true } }),
    ]);

    const totalGiftSum = gifts.reduce((acc, g) => acc + Number(g.giftValue || 0), 0);
    const totalOrderSum = orders.reduce((acc, o) => acc + Number(o.amount || 0), 0);

    const cardTypeBreakdown = cardTypeGroups
      .map((g) => ({ cardType: g.cardType, count: g._count.cardType }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      stats: {
        postsCount,
        viewsCount,
        commentsCount,
        conversationsCount,
        totalGiftSum,
        ordersCount: orders.length,
        leadsCount: leads.length,
        bidsCount: bids.length,
        totalOrderSum,
      },
      cardTypeBreakdown,
      recentGifts: gifts,
      recentOrders: orders,
      recentLeads: leads,
      recentBids: bids,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
