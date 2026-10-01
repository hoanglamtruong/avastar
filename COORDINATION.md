# COORDINATION RULES — Avastar (Personal Hub)
File quy tắc phối hợp giữa các Agent (Gcode/Ccode) chạy song song trên cùng 1 codebase.
MỌI Agent BẮT BUỘC đọc file này trước khi bắt đầu bất kỳ Brief nào.

---

## 1. PROGRESS.md — Bắt buộc ghi real-time

File: /home/zang/avastar/PROGRESS.md
Định dạng: [HH:MM] [AGENT] [PHASE/TASK] [PASS✅/FAIL❌/IN_PROGRESS⏳] — mô tả ngắn
· CHỈ APPEND, không xóa dòng cũ của agent khác
· Ghi khi BẮT ĐẦU (IN_PROGRESS⏳) lẫn khi XONG (PASS✅/FAIL❌)
· Commit cùng lúc với commit code của task đó

## 2. Phạm vi file theo Agent — do từng Brief quy định

Mỗi Brief sẽ liệt kê rõ "file cấm" (thuộc agent khác, không được đụng).
Danh sách này ĐỔI theo từng Brief — luôn đọc mục [1] của Brief đang nhận
để biết chính xác phạm vi hiện tại, KHÔNG suy đoán từ Brief cũ.

## 3. FILE HẠ TẦNG DÙNG CHUNG — luật khóa (lock protocol)

3 file sau LUÔN được xem là dùng chung, bất kể Brief nào đang chạy:
  · Dockerfile
  · next.config.* 
  · package.json

Trước khi bất kỳ Agent nào sửa 1 trong 3 file trên:
  BƯỚC 1 · Ghi ngay vào PROGRESS.md:
    [HH:MM] [AGENT] [FILE HẠ TẦNG] ⚠️ ĐANG SỬA Dockerfile/next.config/package.json
  BƯỚC 2 · Agent còn lại: đọc thấy dòng ⚠️ này → TUYỆT ĐỐI KHÔNG chạy
    "docker compose build" / "docker compose up -d --build" cho đến khi
    thấy dòng PASS✅ xác nhận file hạ tầng đã ổn định trở lại
  BƯỚC 3 · Agent đang sửa: xong thì ghi PASS✅ NGAY, không để trạng thái
    ⚠️ treo lâu hơn cần thiết

Nếu 2 Agent CÙNG LÚC cần sửa file hạ tầng → Agent nào ghi dòng ⚠️ trước
trong PROGRESS.md được ưu tiên làm trước, agent kia chờ.

## 4. Quy trình Build → Deploy

· Luôn theo thứ tự: sửa code → chạy dev/test tại chỗ → build → xác nhận
  container mới Up sạch → COMMIT (không commit trước khi build thật)
· KHÔNG được làm gián đoạn service đang live (site đang có tester thật)
· Nếu build fail sau khi agent khác vừa deploy → nghi ngờ đầu tiên là
  xung đột file hạ tầng, kiểm tra PROGRESS.md trước khi debug sâu

## 5. Khi phát hiện xung đột giữa chừng

· DỪNG ngay, KHÔNG tự ý ghi đè/xóa code của agent khác
· Ghi rõ vào PROGRESS.md: [AGENT] [CONFLICT] ⚠️ mô tả file/vấn đề
· Báo lại conversation, chờ Zangx/Cchat quyết định hướng xử lý

---
Cập nhật lần cuối: 2026-08-24
