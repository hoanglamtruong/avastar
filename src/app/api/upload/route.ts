import { NextRequest, NextResponse } from "next/server";
import { writeFile, readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Chưa chọn tệp ảnh để tải lên" }, { status: 400 });
    }

    // Kiểm tra định dạng hợp lệ — ảnh hoặc video (slide đầu trang cần cả 2)
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
    const isVideo = validVideoTypes.includes(file.type);
    if (!isVideo && !validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Định dạng không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV." },
        { status: 400 }
      );
    }

    // Giới hạn: ảnh 15MB, video 40MB (dung lượng server có hạn)
    const maxSize = isVideo ? 40 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: isVideo ? "Kích thước video vượt quá 40MB." : "Kích thước ảnh vượt quá 15MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const fileName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Lỗi tải ảnh: " + (error?.message || "Lỗi máy chủ") },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const brandDir = path.join(process.cwd(), "public", "brand_assets");

    const items: Array<{
      url: string;
      name: string;
      category: "upload" | "brand";
      size?: number;
      createdAt?: number;
    }> = [];

    // 1. Quét tệp người dùng tải lên
    if (existsSync(uploadsDir)) {
      const files = await readdir(uploadsDir);
      for (const file of files) {
        if (!file.startsWith(".")) {
          try {
            const fileStat = await stat(path.join(uploadsDir, file));
            items.push({
              url: `/uploads/${file}`,
              name: file,
              category: "upload",
              size: fileStat.size,
              createdAt: fileStat.mtimeMs,
            });
          } catch {}
        }
      }
    }

    // 2. Quét kho tài sản thương hiệu ZANGX
    if (existsSync(brandDir)) {
      const brandFiles = await readdir(brandDir);
      for (const file of brandFiles) {
        if (file.endsWith(".svg") || file.endsWith(".png") || file.endsWith(".webp") || file.endsWith(".jpg")) {
          items.push({
            url: `/brand_assets/${file}`,
            name: file.replace(/[-_]/g, " ").replace(".svg", ""),
            category: "brand",
          });
        }
      }
    }

    // Sắp xếp: tải lên mới nhất trước
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, items: [] });
  }
}
