import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
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
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Bài đăng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền cập nhật bài viết" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { caption, category, cards } = body;

    await prisma.post.update({
      where: { id },
      data: {
        caption: caption !== undefined ? caption : undefined,
        category: category !== undefined ? category : undefined,
      },
    });

    if (Array.isArray(cards)) {
      await prisma.postCard.deleteMany({ where: { postId: id } });
      await prisma.postCard.createMany({
        data: cards.map((c: any, index: number) => ({
          postId: id,
          orderIndex: index,
          cardType: c.cardType || "image",
          mediaUrl: c.mediaUrl || null,
          docContent: c.docContent || null,
          cardMetadata: typeof c.cardMetadata === "object" ? c.cardMetadata : {},
        })),
      });
    }

    const fullPost = await prisma.post.findUnique({
      where: { id },
      include: {
        cards: { orderBy: { orderIndex: "asc" } },
        owner: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ success: true, post: fullPost });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền xóa bài viết" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa bài viết thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
