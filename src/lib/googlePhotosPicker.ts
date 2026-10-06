"use client";

// Tích hợp Google Photos Picker API — KHÔNG lưu credential nào trong code,
// chỉ đọc Client ID công khai từ NEXT_PUBLIC_GOOGLE_CLIENT_ID (an toàn để lộ,
// OAuth Client ID của web app không phải bí mật). Toàn bộ luồng chạy phía
// trình duyệt: xin access token qua Google Identity Services -> tạo phiên
// Picker -> mở tab cho Owner chọn ảnh/video trên chính giao diện Google ->
// polling tới khi chọn xong -> tải file thật về dưới dạng Blob (vẫn cần kèm
// access token vì baseUrl không công khai) -> component gọi nơi dùng tự
// upload Blob đó qua /api/upload sẵn có, không cần API lưu trữ riêng.

const PICKER_SCOPE = "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

let gisLoadPromise: Promise<void> | null = null;

function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.accounts?.oauth2) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;
  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không tải được Google Identity Services"));
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

function requestAccessToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    loadGoogleIdentityServices()
      .then(() => {
        const google = (window as any).google;
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: PICKER_SCOPE,
          callback: (resp: any) => {
            if (resp.error) reject(new Error(resp.error));
            else resolve(resp.access_token);
          },
        });
        tokenClient.requestAccessToken();
      })
      .catch(reject);
  });
}

function parseGoogleDuration(d?: string): number | null {
  if (!d) return null;
  const match = d.match(/^(\d+(?:\.\d+)?)s$/);
  return match ? parseFloat(match[1]) * 1000 : null;
}

async function createPickerSession(accessToken: string) {
  const res = await fetch("https://photospicker.googleapis.com/v1/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pickingConfig: { maxItemCount: "1" } }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Không tạo được phiên chọn ảnh Google (${res.status}) ${detail.slice(0, 200)}`);
  }
  return res.json();
}

async function pollSessionUntilReady(sessionId: string, accessToken: string, pollIntervalMs: number, timeoutMs: number) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`https://photospicker.googleapis.com/v1/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (data.mediaItemsSet) return data;
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  throw new Error("Hết thời gian chờ chọn ảnh trên Google Ảnh");
}

async function listPickedItems(sessionId: string, accessToken: string) {
  const res = await fetch(`https://photospicker.googleapis.com/v1/mediaItems?sessionId=${sessionId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Không lấy được danh sách ảnh đã chọn");
  const data = await res.json();
  return data.mediaItems || [];
}

export interface PickedGooglePhoto {
  blob: Blob;
  isVideo: boolean;
  mimeType: string;
}

// Trả về null nếu Owner đóng tab chọn ảnh mà không chọn gì
export async function pickFromGooglePhotos(clientId: string): Promise<PickedGooglePhoto | null> {
  const accessToken = await requestAccessToken(clientId);
  const session = await createPickerSession(accessToken);

  const pickerWindow = window.open(session.pickerUri, "_blank", "width=1000,height=800");
  const pollInterval = parseGoogleDuration(session.pollingConfig?.pollInterval) || 2000;
  const timeout = parseGoogleDuration(session.pollingConfig?.timeoutIn) || 180000;

  const finished = await pollSessionUntilReady(session.id, accessToken, pollInterval, timeout);
  pickerWindow?.close();
  if (!finished.mediaItemsSet) return null;

  const items = await listPickedItems(session.id, accessToken);
  if (items.length === 0) return null;

  const first = items[0];
  const baseUrl = first.mediaFile?.baseUrl;
  if (!baseUrl) throw new Error("Không tìm thấy URL của ảnh đã chọn");
  const isVideo = first.type === "VIDEO" || (first.mediaFile?.mimeType || "").startsWith("video/");
  const downloadUrl = `${baseUrl}${isVideo ? "=dv" : "=d"}`;

  const fileRes = await fetch(downloadUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!fileRes.ok) throw new Error("Không tải được nội dung đã chọn từ Google Ảnh");
  const blob = await fileRes.blob();
  return { blob, isVideo, mimeType: first.mediaFile?.mimeType || blob.type };
}
