import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { emitOwnerEvent } from "@/lib/socket";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const memberIdQuery = searchParams.get("memberId");

    if (!postId) {
      return NextResponse.json({ error: "Thiếu postId" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ comments: [], isGuest: true });
    }

    let whereClause: any = { postId };

    if (currentUser.role === "owner" || currentUser.role === "admin") {
      // Owner can view threads by specific member or all
      if (memberIdQuery) {
        whereClause.memberId = memberIdQuery;
      }
    } else {
      // Member can ONLY view their own 1-1 exchange with Owner
      whereClause.memberId = currentUser.id;
    }
    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // If Owner, also get distinct active member threads for this post
    let threads: any[] = [];
    if (currentUser.role === "owner" || currentUser.role === "admin") {
      const distinctMembers = await prisma.comment.findMany({
        where: { postId },
        select: {
          memberId: true,
          member: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
        distinct: ["memberId"],
      });
      threads = distinctMembers.map((d) => d.member);
    }

    return NextResponse.json({ comments, threads, currentUserRole: currentUser.role });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vui lòng đăng ký / đăng nhập để bình luận 1-1" }, { status: 401 });
    }

    const { postId, content, targetMemberId } = await request.json();

    if (!postId || !content || !content.trim()) {
      return NextResponse.json({ error: "Nội dung bình luận không được để trống" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Bài đăng không tồn tại" }, { status: 404 });
    }

    let memberId = currentUser.id;
    let senderRole: "owner" | "member" = "member";

    if (currentUser.role === "owner" || currentUser.role === "admin") {
      senderRole = "owner";
      if (targetMemberId) {
        memberId = targetMemberId;
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        memberId,
        senderRole,
        content: content.trim(),
      },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    // Ping to Chat / Notification event for Owner if from Member
    if (senderRole === "member") {
      let conv = await prisma.chatConversation.findUnique({ where: { memberId } });
      if (!conv) {
        conv = await prisma.chatConversation.create({ data: { memberId } });
      }
      await prisma.chatMessage.create({
        data: {
          conversationId: conv.id,
          senderId: currentUser.id,
          content: `[Bình luận 1-1 trên bài viết]: "${content.trim().substring(0, 100)}..."`,
          isSystemEvent: true,
        },
      });
    }

    emitOwnerEvent("new_comment", { comment, postId });

    return NextResponse.json({ comment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
