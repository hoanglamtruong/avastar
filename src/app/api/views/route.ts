import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { postId, watchDurationSeconds, cardsViewed } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Thiếu postId" }, { status: 400 });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    const view = await prisma.postView.create({
      data: {
        postId,
        userId: currentUser ? currentUser.id : null,
        ipAddress,
        userAgent,
        watchDurationSeconds: Number(watchDurationSeconds || 0),
        cardsViewed: cardsViewed || [],
      },
    });

    return NextResponse.json({ success: true, viewId: view.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
