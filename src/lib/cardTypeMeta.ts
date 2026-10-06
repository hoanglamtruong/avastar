import {
  FileText,
  Package,
  MessageCircleQuestion,
  CalendarClock,
  Crown,
  Heart,
  Gavel,
} from "lucide-react";
import type { ComponentType } from "react";
import type { CardType } from "@/lib/types";

export interface CardTypeMeta {
  label: string;
  ctaLabel: string;
  icon: ComponentType<{ className?: string }>;
  color: string; // text/border color class
}

// Nhãn hình thái giao dịch (cấp thẻ / card). Mỗi hình thái là 1 "đối tượng" —
// miễn phí hay thương mại chỉ khác ở giá (0 = miễn phí), KHÔNG phải loại
// khác nhau — xem getCtaLabel() để lấy đúng tên nút theo giá thật.
export const COMMERCE_CARD_META: Partial<Record<CardType, CardTypeMeta>> = {
  package: { label: "Đóng Gói", ctaLabel: "Mua Ngay", icon: Package, color: "text-[#C9AA72] border-[#C9AA72]/30" },
  request: { label: "Yêu Cầu / Báo Giá", ctaLabel: "Gửi Yêu Cầu", icon: MessageCircleQuestion, color: "text-[#38BDF8] border-[#38BDF8]/30" },
  reservation: { label: "Giữ Chỗ", ctaLabel: "Giữ Chỗ Ngay", icon: CalendarClock, color: "text-[#A8F238] border-[#A8F238]/30" },
  membership: { label: "Thành Viên", ctaLabel: "Đăng Ký Thành Viên", icon: Crown, color: "text-[#FCD34D] border-[#FCD34D]/30" },
  donate: { label: "Ủng Hộ", ctaLabel: "Ủng Hộ Qua QR", icon: Heart, color: "text-[#C9AA72] border-[#C9AA72]/30" },
  auction: { label: "Đấu Giá", ctaLabel: "Đặt Giá Ngay", icon: Gavel, color: "text-[#E879F9] border-[#E879F9]/30" },
};

// Danh sách hình thái dùng ở màn tạo bài — "content" = bài thường, không có
// thẻ nghiệp vụ (ảnh/video/tài liệu thuần, mặc định miễn phí vì chỉ là chia
// sẻ nội dung, không có giao dịch).
// Danh sách chọn ở màn tạo bài — đóng khung theo NÚT HÀNH ĐỘNG khách sẽ bấm
// (Mua Ngay/Tư Vấn/Đăng Ký/Thu Nạp...) thay vì theo tên kỹ thuật "hình
// thái" như trước — chọn đúng nút cần, hệ thống tự cấu hình đúng trường và
// luồng xử lý phía sau (dữ liệu/logic bên dưới không đổi, chỉ đổi khung
// nhìn cho Owner).
export const CARD_KIND_META: Record<"content" | CardType, { label: string; hint: string }> = {
  content: { label: "Chia Sẻ Nội Dung (không có nút bán)", hint: "Bài chia sẻ thường — ảnh/video/tài liệu, không bán gì." },
  image: { label: "Ảnh", hint: "" },
  video: { label: "Video", hint: "" },
  doc: { label: "Tài liệu", hint: "" },
  package: { label: "Mua Ngay", hint: "Khách bấm là mua luôn. Có giá cố định — để giá 0 = nút tự đổi thành \"Nhận Miễn Phí\"." },
  request: { label: "Tư Vấn / Báo Giá", hint: "Khách bấm để gửi yêu cầu — không chốt giá sẵn, bạn báo giá sau." },
  reservation: { label: "Đăng Ký / Giữ Chỗ", hint: "Khách bấm để đăng ký sự kiện/lớp học. Có thể miễn phí hoặc cần cọc — để cọc 0 = đăng ký miễn phí." },
  membership: { label: "Tham Gia Thành Viên", hint: "Khách bấm để đăng ký làm thành viên/câu lạc bộ. Có thể miễn phí hoặc thu phí định kỳ." },
  donate: { label: "Thu Nạp / Ủng Hộ", hint: "Khách bấm để ủng hộ, đóng góp cho bạn qua VietQR." },
  auction: { label: "Đấu Giá", hint: "Khách bấm để trả giá, cao nhất khi hết giờ thắng." },
};

const COMMERCE_TYPES: CardType[] = ["package", "request", "reservation", "membership", "donate", "auction"];

export function isCommerceCardType(t: CardType): boolean {
  return COMMERCE_TYPES.includes(t);
}

// Thẻ thương mại "chính" của 1 bài viết (card đầu tiên không phải ảnh/video/tài liệu)
export function findCommerceCard<T extends { cardType: CardType }>(cards: T[] | undefined): T | undefined {
  return cards?.find((c) => isCommerceCardType(c.cardType));
}

// Nhãn nút thật theo giá: package/reservation/membership có giá = 0 thì hiện
// nút "miễn phí" thay vì nhãn mua/đăng ký mặc định.
export function getCtaLabel(cardType: CardType, meta: any): string {
  const base = COMMERCE_CARD_META[cardType]?.ctaLabel || "Xem Thêm";
  if (cardType === "package" && !meta?.price) return "Nhận Miễn Phí";
  if (cardType === "reservation" && !meta?.depositAmount) return "Đăng Ký Miễn Phí";
  if (cardType === "membership" && !meta?.price) return "Tham Gia Miễn Phí";
  return base;
}

export function isFreeCommerceCard(cardType: CardType, meta: any): boolean {
  if (cardType === "package") return !meta?.price;
  if (cardType === "reservation") return !meta?.depositAmount;
  if (cardType === "membership") return !meta?.price;
  return false;
}
