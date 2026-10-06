import {
  BookOpen,
  Film,
  Gift as GiftIconLucide,
  Users,
  Package,
  MessageCircleQuestion,
  CalendarClock,
  Crown,
  Heart,
  Gavel,
} from "lucide-react";
import type { ComponentType } from "react";
import type { CardType, FreeActivityTag, ContentCategory } from "@/lib/types";

export interface CardTypeMeta {
  label: string;
  ctaLabel: string;
  icon: ComponentType<{ className?: string }>;
  color: string; // text/border color class
}

// Nhãn hoạt động nhóm MIỄN PHÍ (cấp bài viết)
export const FREE_ACTIVITY_META: Record<FreeActivityTag, { label: string; icon: ComponentType<{ className?: string }> }> = {
  knowledge: { label: "Chia Sẻ Kiến Thức", icon: BookOpen },
  vblog: { label: "Vblog", icon: Film },
  giveaway: { label: "Quà Tặng Miễn Phí", icon: GiftIconLucide },
  club: { label: "Câu Lạc Bộ", icon: Users },
};

// Nhãn hình thái giao dịch nhóm THƯƠNG MẠI (cấp thẻ / card)
export const COMMERCE_CARD_META: Partial<Record<CardType, CardTypeMeta>> = {
  package: { label: "Đóng Gói", ctaLabel: "Mua Ngay", icon: Package, color: "text-[#C9AA72] border-[#C9AA72]/30" },
  request: { label: "Yêu Cầu / Báo Giá", ctaLabel: "Gửi Yêu Cầu", icon: MessageCircleQuestion, color: "text-[#38BDF8] border-[#38BDF8]/30" },
  reservation: { label: "Giữ Chỗ", ctaLabel: "Giữ Chỗ Ngay", icon: CalendarClock, color: "text-[#A8F238] border-[#A8F238]/30" },
  membership: { label: "Thành Viên", ctaLabel: "Đăng Ký Thành Viên", icon: Crown, color: "text-[#FCD34D] border-[#FCD34D]/30" },
  donate: { label: "Ủng Hộ", ctaLabel: "Ủng Hộ Qua QR", icon: Heart, color: "text-[#C9AA72] border-[#C9AA72]/30" },
  auction: { label: "Đấu Giá", ctaLabel: "Đặt Giá Ngay", icon: Gavel, color: "text-[#E879F9] border-[#E879F9]/30" },
};

export const CONTENT_CATEGORY_LABEL: Record<ContentCategory, string> = {
  physical: "Vật Lý",
  digital: "Kỹ Thuật Số",
  service: "Dịch Vụ",
  knowledge: "Kiến Thức",
};

const COMMERCE_TYPES: CardType[] = ["package", "request", "reservation", "membership", "donate", "auction"];

export function isCommerceCardType(t: CardType): boolean {
  return COMMERCE_TYPES.includes(t);
}

// Thẻ thương mại "chính" của 1 bài viết (card đầu tiên không phải ảnh/video/tài liệu)
export function findCommerceCard<T extends { cardType: CardType }>(cards: T[] | undefined): T | undefined {
  return cards?.find((c) => isCommerceCardType(c.cardType));
}
