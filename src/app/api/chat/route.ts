import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetMemberId = searchParams.get("memberId");

    let memberId = currentUser.id;
    if ((currentUser.role === "owner" || currentUser.role === "admin") && targetMemberId) {
      memberId = targetMemberId;
    }

    let conversation = await prisma.chatConversation.findUnique({
      where: { memberId },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: { memberId },
        include: {
          member: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              email: true,
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  role: true,
                },
              },
            },
          },
        },
      });
    }

    // If Owner, also return all active conversations
    let allConversations: any[] = [];
    if (currentUser.role === "owner" || currentUser.role === "admin") {
      allConversations = await prisma.chatConversation.findMany({
        include: {
          member: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              email: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });
    }

    return NextResponse.json({
      conversation,
      allConversations,
      currentUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const { content, targetMemberId } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Tin nhắn không được để trống" }, { status: 400 });
    }

    let memberId = currentUser.id;
    if ((currentUser.role === "owner" || currentUser.role === "admin") && targetMemberId) {
      memberId = targetMemberId;
    }

    let conversation = await prisma.chatConversation.findUnique({
      where: { memberId },
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: { memberId },
      });
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: currentUser.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
