import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        cards: {
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: {
            comments: true,
            gifts: true,
            views: true,
          },
        },
        gifts: {
          select: {
            giftValue: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transformed = posts.map((post) => {
      const totalGiftValue = post.gifts.reduce(
        (sum, g) => sum + Number(g.giftValue || 0),
        0
      );
      const { gifts, ...rest } = post;
      return {
        ...rest,
        totalGiftValue,
      };
    });

    return NextResponse.json({ posts: transformed });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
