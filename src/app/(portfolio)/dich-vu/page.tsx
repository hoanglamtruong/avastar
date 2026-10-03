import type { Metadata } from "next";
import { ServicesList } from "@/components/portfolio/ServicesList";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Dịch Vụ Số & AI Agents · ZANGX",
  description:
    "Marketing Facebook, sáng tạo ảnh & video, thiết kế webapp/app, tự động hóa quy trình với AI và R&D sản phẩm tại Xưởng Sáng Tạo Số ZANGX.",
};

export default function DichVuPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Dịch Vụ Số & AI Agents"
        title="Giải Pháp Tinh Gọn Cho Doanh Chủ & Chuyên Gia"
        intro="Bảy nhóm năng lực cốt lõi được thiết kế theo quy trình từng bước rõ ràng. Chúng tôi kết hợp tư duy sáng tạo con người với sức mạnh tự động hóa của AI để tối ưu chi phí và thời gian."
      />

      <ServicesList />

      <ZxCta
        title="Bạn muốn triển khai một dự án cụ thể?"
        body="ZANGX luôn sẵn sàng tư vấn và đồng hành xây dựng giải pháp từ ý tưởng sơ khởi tới sản phẩm vận hành hoàn chỉnh."
      />
    </>
  );
}
