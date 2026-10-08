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

    // Kiểm tra định dạng hợp lệ — ảnh, video, hoặc tài liệu/ứng dụng để khách tải về
    // (nút "Tải Xuống" trên thẻ Tài liệu/Ứng dụng)
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
    const validDocTypes = [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.android.package-archive", // .apk
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/x-rar-compressed",
      "application/vnd.rar",
      "application/x-7z-compressed",
      "text/plain",
      "application/octet-stream", // fallback MIME trình duyệt hay gán cho .apk/.exe/.dmg
    ];
    const isVideo = validVideoTypes.includes(file.type);
    const isDoc = validDocTypes.includes(file.type);
    if (!isVideo && !isDoc && !validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Định dạng không hợp lệ. Chấp nhận ảnh (JPG/PNG/WEBP/GIF/SVG), video (MP4/WEBM/MOV), hoặc tài liệu/ứng dụng (PDF/ZIP/APK/DOC/XLS/PPT...)." },
        { status: 400 }
      );
    }

    // Giới hạn: ảnh 15MB, video 40MB, tài liệu/ứng dụng 30MB (dung lượng server có hạn)
    const maxSize = isVideo ? 40 * 1024 * 1024 : isDoc ? 30 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: isVideo ? "Kích thước video vượt quá 40MB." : isDoc ? "Kích thước file vượt quá 30MB." : "Kích thước ảnh vượt quá 15MB." },
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
