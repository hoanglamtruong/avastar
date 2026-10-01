# PROGRESS LOG — Avastar (Personal Hub)
File dùng chung để Ccode/Gcode ghi tiến độ real-time. CHỈ APPEND, không xóa dòng cũ.
Định dạng: [HH:MM] [AGENT] [PHASE/TASK] [PASS✅/FAIL❌/IN_PROGRESS⏳] — mô tả ngắn

---
[10:33] [Gcode] [FIX 1-3] PASS✅ — Action bar spacing + swipe gesture + 55vh modal swipe-down, commit 62da91c
[--:--] [Ccode] [TASK 1] PASS✅ — CreatePostModal rewrite + FAB + POST API, commit 7594767
[12:54] [Ccode] [TASK 1] PASS✅ — CreatePostModal.tsx rewrite theo spec (metadata JSON cho subpage card), CreatePostFab.tsx mới, layout.tsx +2 dòng, route.ts giữ nguyên bản Gcode (đã đúng spec) — verified tsc clean + curl 401/200 + cleanup DB test row, commit 7594767, pushed origin/main
[13:13] [Gcode] [FIX A-B] IN_PROGRESS⏳ — bắt đầu Fix A (ẩn arrow mobile) và Fix B (BottomNav mobile + Card căn giữa)
[13:16] [Gcode] [FIX A] PASS✅ — Ẩn nút mũi tên đổi card trên mobile (<sm), giữ nguyên >=sm
[13:16] [Gcode] [FIX B] PASS✅ — Card căn giữa màn hình mobile, Action Bar chuyển thành BottomNav ngang cố định có safe-area
[13:18] [Ccode] [TASK 2] IN_PROGRESS⏳ — phát hiện project dùng output:standalone + Dockerfile chỉ copy server.js tự sinh, không có custom server. Đang chuyển sang custom server.ts (Next + Socket.IO cùng port 3000) để không cần mở port mới, kèm sửa Dockerfile/next.config/package.json
[17:14] [Ccode] [FILE HẠ TẦNG] ⚠️ ĐANG SỬA Dockerfile/next.config/package.json — TASK 2 chuyển sang custom server.ts (Socket.IO) thay vì next standalone. Gcode/agent khác KHÔNG chạy docker compose build cho đến khi thấy PASS✅
[18:52] [Ccode] [FILE HẠ TẦNG] PASS✅ — Dockerfile/next.config.ts/package.json đã ổn định với custom server.ts (Socket.IO cùng port, không mở port mới). Gcode có thể chạy docker compose build bình thường.
[18:52] [Ccode] [TASK 2] PASS✅ — Socket.IO server gắn vào cùng HTTP server (server.ts), emit sau khi ghi DB thành công tại 4 route: comments (new_comment), gifts (new_gift), subpage-actions (new_subpage_action), chat (new_chat_message). Không đổi logic cũ, không đụng page.tsx/modals của Gcode. Verified: tsc --noEmit clean, test script socket.io-client nhận đủ 4 events, dọn sạch data test trong DB. CHƯA làm client-listener (page.tsx) — chờ Gcode xong.
[20:21] [Gcode] [PHASE 0] PASS✅ — Nhận bàn giao toàn quyền, xác nhận môi trường Dell OptiPlex (ổ / còn 14GB/35GB, SSD 57GB), DB zavastar_postgres kết nối tốt, git status sạch. Bắt đầu TASK A (WebSocket client-listener).
[20:25] [Gcode] [TASK A] PASS✅ — WebSocket client-listener trong src/app/page.tsx: chỉ Owner kết nối Socket.IO, lắng nghe 4 event (new_comment, new_gift, new_subpage_action, new_chat_message), hiển thị toast thông báo discreet, dynamic chat badge real-time và reset khi mở ChatDrawer, disconnect khi unmount/logout. Member/guest không bao giờ kết nối/thấy thông báo.
[20:26] [Gcode] [TASK B] PASS✅ — Web Push Notifications: Prisma schema thêm model PushSubscription (db push an toàn), public/sw.js push+click event handler, API /api/push/subscribe (GET/POST/DELETE), push trigger tại 4 API routes (comments, gifts, subpage-actions, chat), PushNotificationPrompt component cho Owner bật thông báo.
[20:27] [Gcode] [TASK C] PASS✅ — PWA Icon Files: Tạo icon-192.png và icon-512.png (chuẩn PNG, màu thương hiệu #183A60, #0095CF, #FEC401) trong public/icons/. Lưu ý: icon tạm thời, cần Zangx duyệt lại thiết kế chính thức sau.
[20:40] [Gcode] [PHASE 4] PASS✅ — Docker container avastar build & deploy thành công (port 8107:3000), HTTP 200 cho homepage, icon-192, icon-512, và endpoint /api/push/subscribe trả về VAPID public key hợp lệ.

[01:05] [Ccode] [VÒNG 2 · PORTFOLIO] IN_PROGRESS⏳ — Thêm 4 trang /gioi-thieu /dich-vu /san-pham /du-an (route group (portfolio), file mới) + 1 nút "Hồ sơ ZANGX" trong header Hub. Sửa src/app/page.tsx đúng 1 chỗ: +1 import (Briefcase) và +1 <Link> cạnh nút "Giới Thiệu". Không đổi logic Hub, không đổi schema DB, không đụng Dockerfile/next.config/package.json.
[01:40] [Ccode] [VÒNG 2 · PORTFOLIO] PASS✅ — 4 trang /gioi-thieu /dich-vu /san-pham /du-an (static, chữ tiếng Việt, đúng 6 màu ZANGX, giới hạn trong route group (portfolio)) + nút "Hồ sơ ZANGX" trên header Hub. Hub "/" giữ nguyên chức năng; chỉ sửa page.tsx: +Briefcase import, +1 <Link>, và ẩn nhãn "PWA" ở màn ≤440px để header không tràn. Verified: tsc sạch, next build OK, 6 route HTTP 200, không tràn ngang ở 390px/1440px. CHƯA deploy (cần Dell). PR #1 đã merge main vào nhánh (xung đột duy nhất public/sw.js → lấy bản main).
