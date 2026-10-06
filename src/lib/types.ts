export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
}

// Nhóm MIỄN PHÍ: nhãn hoạt động ở cấp bài viết (không giao dịch)
export type FreeActivityTag = 'knowledge' | 'vblog' | 'giveaway' | 'club';

// Nhãn phân loại nội dung dùng chung cho mọi thẻ thương mại (chỉ để hiện icon/nhãn,
// KHÔNG quyết định form hay hành động — hình thái giao dịch (cardType) mới quyết định)
export type ContentCategory = 'physical' | 'digital' | 'service' | 'knowledge';

export type PostCategory = FreeActivityTag | ContentCategory | 'general';

// Hình thái giao dịch — quyết định form tạo + hành động của khách xem
export type CardType =
  | 'image'
  | 'video'
  | 'doc'
  | 'package'      // Đóng gói: giá cố định, mua ngay
  | 'request'      // Yêu cầu / báo giá: không giá cố định
  | 'reservation'  // Giữ chỗ: số suất có hạn, có thể đặt cọc
  | 'membership'   // Đăng ký thành viên: gói theo kỳ hạn
  | 'donate'       // Ủng hộ qua VietQR (dùng chung cấu hình ngân hàng ở admin)
  | 'auction';     // Đấu giá realtime

// Trường mở rộng dùng chung cho mọi loại thẻ thương mại: nút liên kết ra
// ngoài (vd Shopee, Facebook, Zalo OA...) và mã QR dẫn thẳng về thẻ này.
export interface CommerceCardExtras {
  externalLink?: { label: string; url: string };
  qrEnabled?: boolean;
}

export interface PackageCardMeta extends CommerceCardExtras {
  productName: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  features?: string[];
  contentCategory: ContentCategory;
}

export interface RequestCardMeta extends CommerceCardExtras {
  title: string;
  scopeDescription: string;
  contentCategory: ContentCategory;
  estimatedRange?: string;
}

export interface ReservationCardMeta extends CommerceCardExtras {
  title: string;
  dateTime?: string;
  location?: string;
  slotsTotal?: number;
  slotsTaken?: number;
  depositAmount?: number;
  contentCategory: ContentCategory;
}

export interface MembershipCardMeta extends CommerceCardExtras {
  planName: string;
  price: number;
  billingPeriod: 'month' | 'year' | 'lifetime';
  benefits?: string[];
  contentCategory: ContentCategory;
}

export interface DonateCardMeta extends CommerceCardExtras {
  goalMessage?: string;
}

export interface AuctionCardMeta extends CommerceCardExtras {
  itemName: string;
  startingPrice: number;
  minIncrement: number;
  endsAt: string;
  contentCategory: ContentCategory;
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
