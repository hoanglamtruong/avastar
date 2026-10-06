import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const { file } = await params;
    const filePathSegment = file.join("/");

    // Ngăn chặn directory traversal
    const safePath = path.normalize(filePathSegment).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(process.cwd(), "public", "uploads", safePath);

    if (!existsSync(fullPath)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
