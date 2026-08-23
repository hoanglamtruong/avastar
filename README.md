# Personal Hub (AVASTAR PWA)

Nền Tảng Không Gian Số Độc Bản Cho Chuyên Gia, KOLs & Doanh Chủ — Thuộc Hệ Sinh Thái AVASTAR (Zangx & Zteam).

## 🚀 Tính Năng Nổi Bật
- **Trải Nghiệm TikTok Snap Scroll (100vh):** Cuộn dọc Y-Axis kết hợp Carousel Ngang Đa Thẻ nổi (Floating Cards: Ảnh, Video, Box Doc không giới hạn, 8 loại Sub-pages).
- **Virtualization 3 Viewport (DOM Engine):** Chỉ render tối đa 3 viewport `[i-1, i, i+1]` trong DOM, đạt tốc độ phản hồi 60 FPS.
- **Bình Luận Riêng Tư 1-1:** Cách ly bình luận giữa các thành viên, dữ liệu bất biến không thể sửa/xóa.
- **Tặng Quà VIP (`#FEC401`):** Modal tặng quà với hiệu ứng Confetti toàn màn hình và WebSocket/Chat notification tức thì.
- **Owner View Analytics:** Báo cáo chi tiết lượt xem, danh tính Member và thời gian dừng lại tại từng thẻ nội dung.
- **8 Loại Sub-page Cards:** Store, Event (Countdown), Diary, Job, Work (Kanban), Connect (Dating 1-1), Training, SOP Guides.
- **PWA Ready:** Web App Manifest, Service Worker offline caching, Standalone mobile display.

## 🛠️ Cài Đặt & Khởi Chạy
```bash
# Cài đặt dependencies
npm install

# Đồng bộ PostgreSQL & nạp dữ liệu mẫu
npx prisma db push
npx tsx prisma/seed.ts

# Chạy Development
npm run dev

# Triển khai Docker
docker compose up -d --build
```
