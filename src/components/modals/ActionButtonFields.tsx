"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { ActionDraft, ActionKind } from "@/lib/actionDraft";
import { CARD_KIND_META } from "@/lib/cardTypeMeta";
import { MediaPicker } from "@/components/ui/MediaPicker";

const ACTION_KIND_ORDER: ActionKind[] = ["package", "request", "reservation", "membership", "apply", "claim", "donate", "auction", "link", "download"];

interface ActionButtonFieldsProps {
  action: ActionDraft;
  index: number;
  onChange: (patch: Partial<ActionDraft>) => void;
  onRemove: () => void;
}

export function ActionButtonFields({ action, index, onChange, onRemove }: ActionButtonFieldsProps) {
  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#F4F0E8]/20 text-sm text-white placeholder:text-[#F4F0E8]/40 focus:outline-none focus:border-[#C9AA72]";
  const labelCls = "block text-xs font-semibold text-[#F4F0E8]/80 mb-1.5";
  const hintCls = "text-[11px] text-[#A8F238]/90 mt-1";

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-[#102A43]/60 border border-[#C9AA72]/20">
      <div className="flex items-center gap-2">
        <span className="shrink-0 w-6 h-6 rounded-full bg-[#C9AA72]/20 text-[#C9AA72] text-xs font-black flex items-center justify-center">{index + 1}</span>
        <select value={action.kind} onChange={(e) => onChange({ kind: e.target.value as ActionKind })} className={inputCls + " flex-1"}>
          {ACTION_KIND_ORDER.map((k) => (
            <option key={k} value={k}>
              {CARD_KIND_META[k].label}
            </option>
          ))}
        </select>
        <button type="button" onClick={onRemove} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition shrink-0" title="Xóa nút này">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[11px] text-[#F4F0E8]/50">{CARD_KIND_META[action.kind].hint}</p>

      {action.kind === "package" && (
        <>
          <div>
            <label className={labelCls}>Tên sản phẩm *</label>
            <input value={action.title} onChange={(e) => onChange({ title: e.target.value })} className={inputCls} placeholder="Áo khoác da thủ công..." />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Giá bán (đ)</label>
              <input value={action.price} onChange={(e) => onChange({ price: e.target.value })} className={inputCls} placeholder="1990000" inputMode="numeric" />
            </div>
            <div>
              <label className={labelCls}>Giá gốc (đ, để gạch)</label>
              <input value={action.originalPrice} onChange={(e) => onChange({ originalPrice: e.target.value })} className={inputCls} placeholder="2500000" inputMode="numeric" />
            </div>
          </div>
          <p className={hintCls}>Để trống hoặc nhập 0 = sản phẩm miễn phí, nút sẽ tự đổi thành "Nhận Miễn Phí".</p>
          <div>
            <label className={labelCls}>Tồn kho</label>
            <input value={action.stock} onChange={(e) => onChange({ stock: e.target.value })} className={inputCls} placeholder="20" inputMode="numeric" />
          </div>
          <div>
            <label className={labelCls}>Tính năng / điểm nổi bật (mỗi dòng 1 ý)</label>
            <textarea value={action.features} onChange={(e) => onChange({ features: e.target.value })} rows={3} className={inputCls} placeholder={"Da thật 100%\nBảo hành 2 năm"} />
          </div>
        </>
      )}

      {(action.kind === "request" || action.kind === "apply") && (
        <>
          <div>
            <label className={labelCls}>{action.kind === "apply" ? "Vị trí tuyển dụng *" : "Tiêu đề yêu cầu *"}</label>
            <input
              value={action.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputCls}
              placeholder={action.kind === "apply" ? "Senior Full-Stack Engineer" : "Thiết kế landing page theo yêu cầu"}
            />
          </div>
          <div>
            <label className={labelCls}>{action.kind === "apply" ? "Mô tả công việc & yêu cầu" : "Mô tả phạm vi công việc"}</label>
            <textarea
              value={action.scopeDescription}
              onChange={(e) => onChange({ scopeDescription: e.target.value })}
              rows={3}
              className={inputCls}
              placeholder={action.kind === "apply" ? "Yêu cầu kinh nghiệm, kỹ năng..." : "Khách gửi yêu cầu, bạn báo giá sau..."}
            />
          </div>
          <div>
            <label className={labelCls}>{action.kind === "apply" ? "Mức lương tham khảo" : "Khoảng giá tham khảo"} (không bắt buộc)</label>
            <input
              value={action.estimatedRange}
              onChange={(e) => onChange({ estimatedRange: e.target.value })}
              className={inputCls}
              placeholder={action.kind === "apply" ? "20 - 35 triệu đ" : "5 - 15 triệu đ"}
            />
          </div>
        </>
      )}

      {action.kind === "reservation" && (
        <>
          <div>
            <label className={labelCls}>Tên sự kiện / lớp học *</label>
            <input value={action.title} onChange={(e) => onChange({ title: e.target.value })} className={inputCls} placeholder="Workshop Thiết Kế Số" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Thời điểm</label>
              <input type="datetime-local" value={action.dateTime} onChange={(e) => onChange({ dateTime: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Địa điểm</label>
              <input value={action.location} onChange={(e) => onChange({ location: e.target.value })} className={inputCls} placeholder="TP.HCM" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Tổng số suất</label>
              <input value={action.slotsTotal} onChange={(e) => onChange({ slotsTotal: e.target.value })} className={inputCls} placeholder="30" inputMode="numeric" />
            </div>
            <div>
              <label className={labelCls}>Tiền cọc (đ)</label>
              <input value={action.depositAmount} onChange={(e) => onChange({ depositAmount: e.target.value })} className={inputCls} placeholder="0" inputMode="numeric" />
            </div>
          </div>
          <p className={hintCls}>Để trống hoặc nhập 0 = đăng ký miễn phí, nút sẽ tự đổi thành "Đăng Ký Miễn Phí".</p>
        </>
      )}

      {action.kind === "membership" && (
        <>
          <div>
            <label className={labelCls}>Tên gói *</label>
            <input value={action.title} onChange={(e) => onChange({ title: e.target.value })} className={inputCls} placeholder="Gói Thành Viên VIP" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Giá (đ)</label>
              <input value={action.price} onChange={(e) => onChange({ price: e.target.value })} className={inputCls} placeholder="299000" inputMode="numeric" />
            </div>
            <div>
              <label className={labelCls}>Kỳ hạn</label>
              <select value={action.billingPeriod} onChange={(e) => onChange({ billingPeriod: e.target.value as ActionDraft["billingPeriod"] })} className={inputCls}>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
                <option value="lifetime">Trọn đời</option>
              </select>
            </div>
          </div>
          <p className={hintCls}>Để trống hoặc nhập 0 = thành viên miễn phí (vd Câu lạc bộ), nút sẽ tự đổi thành "Tham Gia Miễn Phí".</p>
          <div>
            <label className={labelCls}>Quyền lợi (mỗi dòng 1 ý)</label>
            <textarea value={action.benefits} onChange={(e) => onChange({ benefits: e.target.value })} rows={3} className={inputCls} placeholder={"Ưu tiên hỗ trợ\nGiảm 10% mọi đơn hàng"} />
          </div>
        </>
      )}

      {action.kind === "claim" && (
        <>
          <div>
            <label className={labelCls}>Tên quà tặng / ưu đãi *</label>
            <input value={action.title} onChange={(e) => onChange({ title: e.target.value })} className={inputCls} placeholder="Ebook Hướng Dẫn Tự Động Hóa" />
          </div>
          <div>
            <label className={labelCls}>Mô tả ngắn (không bắt buộc)</label>
            <textarea value={action.scopeDescription} onChange={(e) => onChange({ scopeDescription: e.target.value })} rows={2} className={inputCls} placeholder="Khách để lại thông tin để nhận ngay..." />
          </div>
          <div>
            <label className={labelCls}>Số lượng (không bắt buộc)</label>
            <input value={action.stock} onChange={(e) => onChange({ stock: e.target.value })} className={inputCls} placeholder="100" inputMode="numeric" />
          </div>
        </>
      )}

      {action.kind === "donate" && (
        <>
          <div>
            <label className={labelCls}>Lời nhắn mục tiêu ủng hộ (không bắt buộc)</label>
            <textarea value={action.goalMessage} onChange={(e) => onChange({ goalMessage: e.target.value })} rows={2} className={inputCls} placeholder="Ủng hộ xưởng mua thêm thiết bị..." />
          </div>
          <p className="text-[11px] text-[#F4F0E8]/60">Dùng chung số tài khoản VietQR đã cấu hình ở nút Cài Đặt.</p>
        </>
      )}

      {action.kind === "auction" && (
        <>
          <div>
            <label className={labelCls}>Tên vật phẩm đấu giá *</label>
            <input value={action.title} onChange={(e) => onChange({ title: e.target.value })} className={inputCls} placeholder="Tác phẩm điêu khắc độc bản #01" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Giá khởi điểm (đ)</label>
              <input value={action.startingPrice} onChange={(e) => onChange({ startingPrice: e.target.value })} className={inputCls} placeholder="500000" inputMode="numeric" />
            </div>
            <div>
              <label className={labelCls}>Bước giá tối thiểu (đ)</label>
              <input value={action.minIncrement} onChange={(e) => onChange({ minIncrement: e.target.value })} className={inputCls} placeholder="50000" inputMode="numeric" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Thời điểm kết thúc *</label>
            <input type="datetime-local" value={action.endsAt} onChange={(e) => onChange({ endsAt: e.target.value })} className={inputCls} />
          </div>
        </>
      )}

      {action.kind === "link" && (
        <>
          <div>
            <label className={labelCls}>Nhãn nút *</label>
            <input value={action.linkLabel} onChange={(e) => onChange({ linkLabel: e.target.value })} className={inputCls} placeholder="Mua trên Shopee" />
          </div>
          <div>
            <label className={labelCls}>Đường dẫn *</label>
            <input value={action.linkUrl} onChange={(e) => onChange({ linkUrl: e.target.value })} className={inputCls} placeholder="https://..." />
          </div>
        </>
      )}

      {action.kind === "download" && (
        <>
          <div>
            <label className={labelCls}>Nhãn nút</label>
            <input value={action.linkLabel} onChange={(e) => onChange({ linkLabel: e.target.value })} className={inputCls} placeholder="Tải Về" />
          </div>
          <MediaPicker
            label="File để khách tải về *"
            value={action.linkUrl}
            onChange={(url) => onChange({ linkUrl: url })}
            placeholder="Tải file lên — PDF, ZIP, APK, DOC, XLS, PPT... (tối đa 30MB)"
            accept=".pdf,.zip,.apk,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rar,.7z,.exe,.dmg"
          />
        </>
      )}
    </div>
  );
}
