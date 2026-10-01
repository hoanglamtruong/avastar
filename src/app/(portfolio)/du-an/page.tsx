import type { Metadata } from "next";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Dự án · ZANGX",
  description: "Các dự án đã làm của ZANGX theo loại: marketing, ảnh, video, landing page, webapp, app.",
};

export default function DuAnPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Dự án"
        title="Những gì đã làm"
        intro="Lọc theo loại để xem từng dự án. Dự án thật được đánh dấu bằng liên kết mở. Các thẻ có ghi nội dung mẫu là chỗ chờ thay bằng dự án thật."
      />
      <ProjectGrid />
      <ZxCta title="Muốn có một dự án như vậy?" body="Kênh nhận yêu cầu đang được chuẩn bị. Quay lại sau hoặc xem trước phần dịch vụ." />
    </>
  );
}
