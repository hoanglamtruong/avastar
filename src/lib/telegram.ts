// Gửi thông báo Telegram cho Owner khi có hành động của khách (mua/đăng ký/
// đặt giá/donate/yêu cầu...). Đọc token + chat id từ biến môi trường, KHÔNG
// hardcode — nếu chưa cấu hình thì bỏ qua êm, không làm hỏng luồng chính
// (giống đúng cách sendPushNotificationToOwners đang làm).
//
// Cần CEO tự tạo Bot qua @BotFather (Human Node theo quy ước dự án) rồi set
// 2 biến môi trường trên container thật:
//   TELEGRAM_BOT_TOKEN   — token bot từ @BotFather
//   TELEGRAM_CHAT_ID     — chat id của Owner (nhắn /start cho bot rồi lấy id
//                          qua https://api.telegram.org/bot<TOKEN>/getUpdates)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[telegram] bỏ qua — chưa cấu hình TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[telegram] gửi thất bại:", res.status, body);
    }
  } catch (err) {
    console.error("[telegram] lỗi kết nối:", err);
  }
}

export function isTelegramConfigured(): boolean {
  return !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
}
