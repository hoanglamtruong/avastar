import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json({ error: "Chỉ Owner mới có quyền đăng bài" }, { status: 401 });
    }

    const { category, caption, cards } = await request.json();

    if (!category || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: "Thiếu category hoặc danh sách thẻ nội dung" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        ownerId: currentUser.id,
        category,
        caption: caption || null,
        cards: {
          create: cards.map((c: any, idx: number) => ({
            orderIndex: idx,
            cardType: c.cardType,
            mediaUrl: c.mediaUrl || null,
            docContent: c.docContent || null,
            cardMetadata: c.cardMetadata ?? {},
          })),
        },
      },
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
        cards: { orderBy: { orderIndex: "asc" } },
      },
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
