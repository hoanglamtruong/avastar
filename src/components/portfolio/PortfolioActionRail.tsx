"use client";

import { useState } from "react";
import { ActionRail } from "@/components/ActionRail";

/**
 * Gắn ActionRail dùng chung vào layout portfolio (server component):
 * tự giữ trạng thái đóng/mở tại đây, Donate/Nhắn chủ điều hướng sang Hub
 * (?donate=1 / ?chat=1) vì trang portfolio không có activePost/ChatDrawer riêng.
 */
export function PortfolioActionRail() {
  const [open, setOpen] = useState(true);
  return (
    <ActionRail
      open={open}
      onOpenChange={setOpen}
      gift={{ href: "/?donate=1" }}
      chat={{ href: "/?chat=1" }}
    />
  );
}
