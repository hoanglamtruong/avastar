import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { CreatePostFab } from "@/components/CreatePostFab";

export const metadata: Metadata = {
  title: "Personal Hub - AVASTAR | Nền Tảng Không Gian Số Độc Bản",
  description: "Xóa bỏ sự phụ thuộc thuật toán MXH. Trải nghiệm TikTok snap scroll kết hợp Carousel đa thẻ nổi, bình luận bảo mật 1-1 và hệ thống tặng quà VIP.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AVASTAR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#183A60",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B1A2C] text-[#D4DBF5] antialiased overflow-hidden min-h-[100dvh]">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
          <CreatePostFab />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
