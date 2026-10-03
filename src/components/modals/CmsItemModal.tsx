"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export type CmsSectionType = "projects" | "products" | "services";

interface CmsItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: CmsSectionType;
  item: any | null; // null for Create, object for Edit
  onSaved: () => void;
}

const PROJECT_TYPES = ["Marketing", "Ảnh", "Video", "Landing page", "Webapp", "App"];
const PRODUCT_GROUPS = [
  { key: "decor", name: "Decor" },
  { key: "cay-canh", name: "Cây cảnh" },
  { key: "co-khi", name: "Cơ khí" },
];

export function CmsItemModal({ isOpen, onClose, section, item, onSaved }: CmsItemModalProps) {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Project state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("Webapp");
  const [projectBody, setProjectBody] = useState("");
  const [projectSample, setProjectSample] = useState(false);
  const [projectHref, setProjectHref] = useState("");

  // Product state
  const [productGroup, setProductGroup] = useState("decor");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productStatus, setProductStatus] = useState("Đang thử nghiệm");
  const [productMaterial, setProductMaterial] = useState("Gỗ, thép");
  const [productVersion, setProductVersion] = useState("v0.1");

  // Service state
  const [serviceName, setServiceName] = useState("");
  const [serviceBody, setServiceBody] = useState("");
  const [serviceSteps, setServiceSteps] = useState("");

  const isEditing = Boolean(item?.id);

  useEffect(() => {
    if (section === "projects") {
      setProjectTitle(item?.title || "");
      setProjectType(item?.type || "Webapp");
      setProjectBody(item?.body || "");
      setProjectSample(Boolean(item?.sample));
      setProjectHref(item?.href || "");
    } else if (section === "products") {
      setProductGroup(item?.groupKey || "decor");
      setProductCode(item?.code || "");
      setProductName(item?.name || "");
      setProductStatus(item?.status || "Đang thử nghiệm");
      setProductMaterial(item?.material || "Gỗ, thép");
      setProductVersion(item?.version || "v0.1");
    } else if (section === "services") {
      setServiceName(item?.name || "");
      setServiceBody(item?.body || "");
      setServiceSteps(item?.steps ? item.steps.join("\n") : "Tìm hiểu nhu cầu\nThực thi thiết kế\nBàn giao");
    }
  }, [section, item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let payloadItem: any = {};
      if (section === "projects") {
        if (!projectTitle.trim()) {
          showToast("Vui lòng nhập tên dự án", "error");
          setIsSaving(false);
          return;
        }
        payloadItem = {
          title: projectTitle.trim(),
          type: projectType,
          body: projectBody.trim(),
          sample: projectSample,
          href: projectHref.trim(),
        };
      } else if (section === "products") {
        if (!productName.trim() || !productCode.trim()) {
          showToast("Vui lòng nhập mã và tên sản phẩm", "error");
          setIsSaving(false);
          return;
        }
        payloadItem = {
          groupKey: productGroup,
          code: productCode.trim().toUpperCase(),
          name: productName.trim(),
          status: productStatus.trim(),
          material: productMaterial.trim(),
          version: productVersion.trim(),
        };
      } else if (section === "services") {
        if (!serviceName.trim()) {
          showToast("Vui lòng nhập tên dịch vụ", "error");
          setIsSaving(false);
          return;
        }
        const stepsArray = serviceSteps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        payloadItem = {
          name: serviceName.trim(),
          body: serviceBody.trim(),
          steps: stepsArray.length > 0 ? stepsArray : ["Tiếp nhận", "Thực hiện", "Hoàn thành"],
        };
      }

      const method = isEditing ? "PUT" : "POST";
      const bodyPayload = isEditing
        ? { section, id: item.id, item: payloadItem }
        : { section, item: payloadItem };

      const res = await fetch("/api/admin/cms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        showToast(
          isEditing ? "Đã cập nhật dữ liệu thành công!" : "Đã tạo mục mới thành công!",
          "success"
        );
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.error || "Thao tác không thành công", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi lưu dữ liệu", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getTitle = () => {
    const action = isEditing ? "Chỉnh Sửa" : "Thêm Mới";
    if (section === "projects") return `${action} Dự Án`;
    if (section === "products") return `${action} Sản Phẩm R&D`;
    return `${action} Dịch Vụ Số`;
  };

  return (
    <div
      className="fixed inset-0 z-[1050] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-float-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] rounded-[28px] bg-[#07111F]/98 border border-[#C9AA72]/40 p-5 sm:p-6 shadow-2xl relative overflow-y-auto custom-slim-scroll flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-black text-white">{getTitle()}</h2>
          <p className="text-xs text-[#AEBCC5]">Quản lý thông tin hiển thị trên các trang chuyên đề ZANGX</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* 1. PROJECT FORM */}
          {section === "projects" && (
            <>
              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Tên / Tiêu đề dự án:</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Ví dụ: App quản lý xưởng..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Loại dự án:</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Loại thẻ:</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectSample}
                      onChange={(e) => setProjectSample(e.target.checked)}
                      className="rounded accent-[#C9AA72] w-4 h-4"
                    />
                    <span className="text-xs text-white">Dự án mẫu (Sample)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Đường dẫn liên kết (Href/URL):</label>
                <input
                  type="text"
                  value={projectHref}
                  onChange={(e) => setProjectHref(e.target.value)}
                  placeholder="Ví dụ: / hoặc https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Mô tả tóm tắt dự án:</label>
                <textarea
                  rows={3}
                  value={projectBody}
                  onChange={(e) => setProjectBody(e.target.value)}
                  placeholder="Nội dung giới thiệu dự án..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                />
              </div>
            </>
          )}

          {/* 2. PRODUCT FORM */}
          {section === "products" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Nhóm sản phẩm:</label>
                  <select
                    value={productGroup}
                    onChange={(e) => setProductGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white"
                  >
                    {PRODUCT_GROUPS.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#AEBCC5] mb-1">Mã định danh (Code):</label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="RD-001"
                    className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white uppercase focus:outline-none focus:border-[#C9AA72]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Tên sản phẩm:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Kệ treo tường mô-đun..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#AEBCC5] mb-1">Trạng thái:</label>
                  <input
                    type="text"
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value)}
                    placeholder="Đang thử nghiệm"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#AEBCC5] mb-1">Vật liệu:</label>
                  <input
                    type="text"
                    value={productMaterial}
                    onChange={(e) => setProductMaterial(e.target.value)}
                    placeholder="Gỗ, nhôm"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#AEBCC5] mb-1">Phiên bản:</label>
                  <input
                    type="text"
                    value={productVersion}
                    onChange={(e) => setProductVersion(e.target.value)}
                    placeholder="v0.1"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* 3. SERVICE FORM */}
          {section === "services" && (
            <>
              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Tên dịch vụ:</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Ví dụ: Thiết kế Webapp AI..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">Mô tả dịch vụ:</label>
                <textarea
                  rows={3}
                  value={serviceBody}
                  onChange={(e) => setServiceBody(e.target.value)}
                  placeholder="Mô tả lợi ích mang lại cho khách hàng..."
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#AEBCC5] mb-1">
                  Các bước quy trình thực hiện (Mỗi bước trên 1 dòng):
                </label>
                <textarea
                  rows={4}
                  value={serviceSteps}
                  onChange={(e) => setServiceSteps(e.target.value)}
                  placeholder="Bước 1: Tiếp nhận yêu cầu&#10;Bước 2: Thiết kế mẫu&#10;Bước 3: Lập trình và bàn giao"
                  className="w-full px-3 py-2 rounded-xl bg-[#102A43]/50 border border-white/15 text-white focus:outline-none focus:border-[#C9AA72]"
                />
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9AA72] to-[#8B6F3F] text-[#07111F] font-black flex items-center gap-1.5 shadow-lg hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Đang lưu..." : isEditing ? "Cập Nhật" : "Tạo Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
