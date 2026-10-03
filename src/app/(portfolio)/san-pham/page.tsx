import type { Metadata } from "next";
import { ProductsList } from "@/components/portfolio/ProductsList";
import { ZxCta, ZxPageTitle } from "@/components/portfolio/ZxCta";

export const metadata: Metadata = {
  title: "Sản Phẩm R&D · ZANGX",
  description: "Nhật ký nghiên cứu và chế tác sản phẩm vật lý (Decor, Cây cảnh, Cơ khí) của Xưởng Sáng Tạo Số ZANGX.",
};

export default function SanPhamPage() {
  return (
    <>
      <ZxPageTitle
        eyebrow="Physical R&D Lab"
        title="Nhật Ký Chế Tác & Phát Triển Sản Phẩm"
        intro="Ba lĩnh vực R&amp;D trọng tâm: Đồ Decor mô-đun, Phụ kiện cây cảnh thông minh và Cơ cấu cơ khí chính xác. Mỗi thiết kế đều có mã định danh, vật liệu chế tạo và ghi lại nhật ký thử nghiệm từ bản vẽ CAD tới nguyên mẫu vật lý."
      />

      <ProductsList />

      <ZxCta
        title="Bạn có ý tưởng sản phẩm vật lý cần hiện thực hóa?"
        body="ZANGX hỗ trợ từ bản vẽ CAD 3D, thiết kế đồ gá cơ khí tới chế tạo mẫu thử nghiệm thực tế."
      />
    </>
  );
}
