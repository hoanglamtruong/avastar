export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
}

export type PostCategory =
  | 'store'
  | 'event'
  | 'diary'
  | 'job'
  | 'work'
  | 'dating'
  | 'training'
  | 'sop'
  | 'general';

export type CardType =
  | 'image'
  | 'video'
  | 'doc'
  | 'store'
  | 'event'
  | 'job'
  | 'work'
  | 'dating'
  | 'training'
  | 'sop';

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
