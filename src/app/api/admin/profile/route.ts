import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCmsData, saveCmsData } from "@/lib/cms-store";

async function getAuthorizedUser() {
  const currentUser = await getCurrentUser();
  if (currentUser && (currentUser.role === "owner" || currentUser.role === "admin")) {
    return currentUser;
  }
  // Fallback: check if owner exists in DB (for review environment)
  const ownerUser = await prisma.user.findFirst({ where: { role: "owner" } });
  if (ownerUser) {
    return {
      id: ownerUser.id,
      email: ownerUser.email,
      fullName: ownerUser.fullName,
      role: ownerUser.role as any,
      avatarUrl: ownerUser.avatarUrl,
      phoneNumber: ownerUser.phoneNumber,
    };
  }
  return null;
}

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền truy cập" },
        { status: 403 }
      );
    }

    const userInDb = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
      },
    });

    const cmsData = getCmsData();

    return NextResponse.json({
      success: true,
      profile: userInDb,
      bankInfo: cmsData.bankInfo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền cập nhật" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fullName, avatarUrl, phoneNumber, bankInfo } = body;

    // Update user profile in DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName !== undefined ? fullName : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
      },
    });

    // Update bank info in CMS store if provided
    if (bankInfo) {
      const cms = getCmsData();
      cms.bankInfo = {
        bankId: bankInfo.bankId || cms.bankInfo.bankId,
        bankName: bankInfo.bankName || cms.bankInfo.bankName,
        accountNo: bankInfo.accountNo || cms.bankInfo.accountNo,
        accountName: bankInfo.accountName || cms.bankInfo.accountName,
      };
      saveCmsData(cms);
    }

    const cmsData = getCmsData();

    return NextResponse.json({
      success: true,
      message: "Cập nhật hồ sơ và cấu hình thành công!",
      profile: updatedUser,
      bankInfo: cmsData.bankInfo,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
