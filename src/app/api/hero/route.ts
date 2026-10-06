import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCmsData } from "@/lib/cms-store";

// Công khai: Hub chỉ có 1 chủ, nên avatar/slide lấy từ Owner + cms-data chung,
// không cần theo từng bài viết.
export async function GET() {
  try {
    const owner = await prisma.user.findFirst({ where: { role: "owner" } });
    const cms = getCmsData();
    return NextResponse.json({
      avatarUrl: owner?.avatarUrl || null,
      fullName: owner?.fullName || "ZANGX",
      slides: cms.heroSlides,
      intro: cms.heroIntro,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
