export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
}

// Nhãn phân loại nội dung dùng chung cho mọi thẻ thương mại (chỉ để hiện icon/nhãn,
// KHÔNG quyết định form hay hành động — hình thái giao dịch (cardType) mới quyết định.
// Miễn phí hay thương mại giờ chỉ khác NHAU VỀ GIÁ (0 = miễn phí) trên cùng 1 hình
// thái, không phải 2 nhóm đối tượng khác nhau — xem cardTypeMeta.ts getCtaLabel().


// 'content' = bài chia sẻ thường, không có thẻ nghiệp vụ. Các giá trị legacy
// (knowledge/vblog/giveaway/club/diary/work/...) vẫn hiển thị được qua fallback,
// chỉ không còn chọn được khi tạo bài mới.
export type PostCategory = 'content' | 'general' | string;

// Hình thái giao dịch — quyết định form tạo + hành động của khách xem
export type CardType =
  | 'image'
  | 'video'
  | 'doc'
  | 'package'      // Mua Ngay: giá cố định
  | 'request'      // Tư Vấn / Báo Giá: không giá cố định
  | 'reservation'  // Đăng Ký: số suất có hạn, có thể đặt cọc
  | 'membership'   // Tham Gia Thành Viên: gói theo kỳ hạn
  | 'donate'       // Ủng Hộ: khách TỰ NGUYỆN cho qua VietQR
  | 'auction'      // Đấu Giá realtime
  | 'claim'        // Thu Nạp: khách NHẬN một thứ miễn phí (ngược hướng với donate)
  | 'apply'        // Ứng Tuyển: dành cho bài tuyển dụng
  | 'link';        // Liên Kết Ngoài: nút riêng mở 1 trang bên ngoài (Shopee, Facebook, Zalo...)

export interface PackageCardMeta {
  productName: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  features?: string[];
  contentCategory: string;
}

export interface RequestCardMeta {
  title: string;
  scopeDescription: string;
  contentCategory: string;
  estimatedRange?: string;
}

export interface ReservationCardMeta {
  title: string;
  dateTime?: string;
  location?: string;
  slotsTotal?: number;
  slotsTaken?: number;
  depositAmount?: number;
  contentCategory: string;
}

export interface MembershipCardMeta {
  planName: string;
  price: number;
  billingPeriod: 'month' | 'year' | 'lifetime';
  benefits?: string[];
  contentCategory: string;
}

export interface DonateCardMeta {
  goalMessage?: string;
}

export interface AuctionCardMeta {
  itemName: string;
  startingPrice: number;
  minIncrement: number;
  endsAt: string;
  contentCategory: string;
}

export interface ClaimCardMeta {
  itemName: string;
  stock?: number;
  description?: string;
  contentCategory: string;
}

export interface ApplyCardMeta {
  title: string;
  scopeDescription: string;
  estimatedRange?: string;
  contentCategory: string;
}

export interface LinkCardMeta {
  label: string;
  url: string;
}

export interface PostCardData {
  id: string;
  postId: string;
  orderIndex: number;
  cardType: CardType;
  mediaUrl?: string | null;
  docContent?: string | null;
  cardMetadata?: any;
  createdAt: string;
}

export interface CommentData {
  id: string;
  postId: string;
  memberId: string;
  senderRole: 'owner' | 'member';
  content: string;
  createdAt: string;
  member: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    role: UserRole;
  };
}

export interface GiftData {
  id: string;
  postId: string;
  senderId: string;
  giftType: string;
  giftValue: number;
  message?: string | null;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface PostData {
  id: string;
  ownerId: string;
  category: PostCategory;
  caption?: string | null;
  customMetadata?: any;
  isPublished: boolean;
  createdAt: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    role: UserRole;
  };
  cards: PostCardData[];
  _count?: {
    comments: number;
    gifts: number;
    views: number;
  };
  totalGiftValue?: number;
}
