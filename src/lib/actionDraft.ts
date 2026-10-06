import { CardType } from "@/lib/types";

// "Nút hành động" mà khách sẽ bấm trên 1 bài viết — tối đa 3 nút/bài. Mỗi nút
// ứng với 1 card thương mại (cardType) riêng, Owner cấu hình ĐỘC LẬP từng nút
// thay vì chọn 1 "hình thái" duy nhất cho cả bài như trước.
export type ActionKind = "package" | "request" | "reservation" | "membership" | "donate" | "auction" | "claim" | "apply";

export const MAX_ACTIONS = 3;

// Dùng chung 1 bộ field "phẳng" cho mọi loại nút — mỗi kind chỉ đọc/ghi đúng
// các field liên quan đến nó, tránh phải tạo 8 state-shape riêng biệt.
export interface ActionDraft {
  id: string;
  kind: ActionKind;
  title: string; // tên sản phẩm / tiêu đề yêu cầu / tên sự kiện / tên gói / tên vật phẩm / vị trí tuyển / tên quà tặng
  price: string;
  originalPrice: string;
  stock: string;
  features: string;
  scopeDescription: string;
  estimatedRange: string;
  dateTime: string;
  location: string;
  slotsTotal: string;
  slotsTaken: string;
  depositAmount: string;
  billingPeriod: "month" | "year" | "lifetime";
  benefits: string;
  goalMessage: string;
  startingPrice: string;
  minIncrement: string;
  endsAt: string;
  extLinkEnabled: boolean;
  extLinkLabel: string;
  extLinkUrl: string;
}

export function newActionDraft(kind: ActionKind = "package"): ActionDraft {
  return {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    title: "",
    price: "",
    originalPrice: "",
    stock: "",
    features: "",
    scopeDescription: "",
    estimatedRange: "",
    dateTime: "",
    location: "",
    slotsTotal: "",
    slotsTaken: "",
    depositAmount: "",
    billingPeriod: "month",
    benefits: "",
    goalMessage: "",
    startingPrice: "",
    minIncrement: "",
    endsAt: "",
    extLinkEnabled: false,
    extLinkLabel: "",
    extLinkUrl: "",
  };
}

const toNum = (v: string) => Math.max(0, parseInt(v.replace(/\D/g, "") || "0", 10));
const toList = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

// Dựng lại 1 ActionDraft từ card thương mại đã có (màn Sửa Bài Viết)
export function actionDraftFromCard(card: { cardType: CardType; cardMetadata?: any }): ActionDraft {
  const meta = card.cardMetadata || {};
  const kind = card.cardType as ActionKind;
  const draft = newActionDraft(kind);
  switch (kind) {
    case "package":
      draft.title = meta.productName || "";
      draft.price = meta.price !== undefined ? String(meta.price) : "";
      draft.originalPrice = meta.originalPrice ? String(meta.originalPrice) : "";
      draft.stock = meta.stock !== undefined ? String(meta.stock) : "";
      draft.features = (meta.features || []).join("\n");
      break;
    case "request":
    case "apply":
      draft.title = meta.title || "";
      draft.scopeDescription = meta.scopeDescription || "";
      draft.estimatedRange = meta.estimatedRange || "";
      break;
    case "reservation":
      draft.title = meta.title || "";
      draft.dateTime = meta.dateTime ? meta.dateTime.slice(0, 16) : "";
      draft.location = meta.location || "";
      draft.slotsTotal = meta.slotsTotal !== undefined ? String(meta.slotsTotal) : "";
      draft.slotsTaken = meta.slotsTaken !== undefined ? String(meta.slotsTaken) : "0";
      draft.depositAmount = meta.depositAmount !== undefined ? String(meta.depositAmount) : "";
      break;
    case "membership":
      draft.title = meta.planName || "";
      draft.price = meta.price !== undefined ? String(meta.price) : "";
      draft.billingPeriod = meta.billingPeriod || "month";
      draft.benefits = (meta.benefits || []).join("\n");
      break;
    case "donate":
      draft.goalMessage = meta.goalMessage || "";
      break;
    case "auction":
      draft.title = meta.itemName || "";
      draft.startingPrice = meta.startingPrice !== undefined ? String(meta.startingPrice) : "";
      draft.minIncrement = meta.minIncrement !== undefined ? String(meta.minIncrement) : "";
      draft.endsAt = meta.endsAt ? meta.endsAt.slice(0, 16) : "";
      break;
    case "claim":
      draft.title = meta.itemName || "";
      draft.stock = meta.stock !== undefined ? String(meta.stock) : "";
      draft.scopeDescription = meta.description || "";
      break;
  }
  draft.extLinkEnabled = !!meta.externalLink;
  draft.extLinkLabel = meta.externalLink?.label || "";
  draft.extLinkUrl = meta.externalLink?.url || "";
  return draft;
}

// Dựng card {cardType, cardMetadata} từ 1 ActionDraft — trả null + báo lỗi qua
// showToast nếu thiếu field bắt buộc của đúng loại nút đó.
export function buildCardFromAction(
  action: ActionDraft,
  selectedCategory: string,
  showToast: (msg: string, type: "error") => void
): { cardType: CardType; cardMetadata: any } | null {
  const extras = {
    externalLink: action.extLinkEnabled && action.extLinkUrl.trim() ? { label: action.extLinkLabel.trim() || "Xem thêm", url: action.extLinkUrl.trim() } : undefined,
  };

  switch (action.kind) {
    case "package": {
      if (!action.title.trim()) {
        showToast("Nhập tên sản phẩm cho nút Mua Ngay", "error");
        return null;
      }
      return {
        cardType: "package",
        cardMetadata: {
          productName: action.title.trim(),
          price: toNum(action.price),
          originalPrice: action.originalPrice ? toNum(action.originalPrice) : undefined,
          stock: action.stock ? toNum(action.stock) : undefined,
          features: toList(action.features),
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "request": {
      if (!action.title.trim()) {
        showToast("Nhập tiêu đề cho nút Tư Vấn / Báo Giá", "error");
        return null;
      }
      return {
        cardType: "request",
        cardMetadata: {
          title: action.title.trim(),
          scopeDescription: action.scopeDescription.trim(),
          estimatedRange: action.estimatedRange.trim() || undefined,
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "apply": {
      if (!action.title.trim()) {
        showToast("Nhập vị trí tuyển dụng cho nút Ứng Tuyển", "error");
        return null;
      }
      return {
        cardType: "apply",
        cardMetadata: {
          title: action.title.trim(),
          scopeDescription: action.scopeDescription.trim(),
          estimatedRange: action.estimatedRange.trim() || undefined,
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "reservation": {
      if (!action.title.trim()) {
        showToast("Nhập tên sự kiện/lớp học cho nút Đăng Ký", "error");
        return null;
      }
      return {
        cardType: "reservation",
        cardMetadata: {
          title: action.title.trim(),
          dateTime: action.dateTime || undefined,
          location: action.location.trim() || undefined,
          slotsTotal: action.slotsTotal ? toNum(action.slotsTotal) : undefined,
          slotsTaken: action.slotsTaken ? toNum(action.slotsTaken) : 0,
          depositAmount: action.depositAmount ? toNum(action.depositAmount) : 0,
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "membership": {
      if (!action.title.trim()) {
        showToast("Nhập tên gói cho nút Tham Gia Thành Viên", "error");
        return null;
      }
      return {
        cardType: "membership",
        cardMetadata: {
          planName: action.title.trim(),
          price: toNum(action.price),
          billingPeriod: action.billingPeriod,
          benefits: toList(action.benefits),
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "donate": {
      return {
        cardType: "donate",
        cardMetadata: { goalMessage: action.goalMessage.trim() || undefined, ...extras },
      };
    }
    case "auction": {
      if (!action.title.trim() || !action.endsAt) {
        showToast("Nhập tên vật phẩm và thời gian kết thúc cho nút Đấu Giá", "error");
        return null;
      }
      return {
        cardType: "auction",
        cardMetadata: {
          itemName: action.title.trim(),
          startingPrice: toNum(action.startingPrice),
          minIncrement: toNum(action.minIncrement) || 10000,
          endsAt: new Date(action.endsAt).toISOString(),
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
    case "claim": {
      if (!action.title.trim()) {
        showToast("Nhập tên quà tặng/ưu đãi cho nút Thu Nạp", "error");
        return null;
      }
      return {
        cardType: "claim",
        cardMetadata: {
          itemName: action.title.trim(),
          stock: action.stock ? toNum(action.stock) : undefined,
          description: action.scopeDescription.trim() || undefined,
          contentCategory: selectedCategory,
          ...extras,
        },
      };
    }
  }
}
