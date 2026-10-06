import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCmsData, saveCmsData } from "@/lib/cms-store";

async function getAuthorizedUser() {
  const currentUser = await getCurrentUser();
  if (currentUser && (currentUser.role === "owner" || currentUser.role === "admin")) {
    return currentUser;
  }
  const ownerUser = await prisma.user.findFirst({ where: { role: "owner" } });
  return ownerUser;
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: "Chỉ Owner hoặc Admin mới có quyền cập nhật" }, { status: 403 });
    }

    const { slides, intro } = await request.json();
    const cms = getCmsData();
    if (Array.isArray(slides)) cms.heroSlides = slides;
    if (typeof intro === "string") cms.heroIntro = intro;
    saveCmsData(cms);

    return NextResponse.json({ success: true, heroSlides: cms.heroSlides, heroIntro: cms.heroIntro });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
