import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function requireOwner() {
  const currentUser = await getCurrentUser();
  if (currentUser && (currentUser.role === "owner" || currentUser.role === "admin")) {
    return currentUser;
  }
  return null;
}

// Công khai: danh mục dùng để hiển thị lựa chọn khi đăng bài và lọc trên Hub
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    const withCounts = await Promise.all(
      categories.map(async (c) => ({
        ...c,
        postCount: await prisma.post.count({ where: { category: c.name } }),
      }))
    );
    return NextResponse.json({ success: true, categories: withCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tạo danh mục mới — Owner, hoặc khi đăng bài gõ tên danh mục chưa có
export async function POST(request: NextRequest) {
  try {
    const user = await requireOwner();
    if (!user) {
      return NextResponse.json({ error: "Chỉ Owner hoặc Admin mới có quyền tạo danh mục" }, { status: 403 });
    }
    const { name } = await request.json();
    const trimmed = (name || "").trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Tên danh mục không được để trống" }, { status: 400 });
    }
    const existing = await prisma.category.findFirst({
      where: { name: { equals: trimmed, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json({ success: true, category: existing });
    }
    const category = await prisma.category.create({ data: { name: trimmed } });
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Đổi tên danh mục — cập nhật luôn category của mọi bài đang dùng tên cũ
export async function PUT(request: NextRequest) {
  try {
    const user = await requireOwner();
    if (!user) {
      return NextResponse.json({ error: "Chỉ Owner hoặc Admin mới có quyền sửa danh mục" }, { status: 403 });
    }
    const { id, name } = await request.json();
    const trimmed = (name || "").trim();
    if (!id || !trimmed) {
      return NextResponse.json({ error: "Thiếu id hoặc tên danh mục mới" }, { status: 400 });
    }
    const current = await prisma.category.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });
    }
    const [category] = await prisma.$transaction([
      prisma.category.update({ where: { id }, data: { name: trimmed } }),
      prisma.post.updateMany({ where: { category: current.name }, data: { category: trimmed } }),
    ]);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa danh mục — chặn nếu đang có bài viết dùng, tránh bài bị "mồ côi" danh mục
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireOwner();
    if (!user) {
      return NextResponse.json({ error: "Chỉ Owner hoặc Admin mới có quyền xóa danh mục" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Thiếu id danh mục" }, { status: 400 });
    }
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });
    }
    const postCount = await prisma.post.count({ where: { category: category.name } });
    if (postCount > 0) {
      return NextResponse.json(
        { error: `Danh mục "${category.name}" đang được dùng bởi ${postCount} bài viết. Hãy đổi danh mục các bài đó trước khi xóa.` },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
