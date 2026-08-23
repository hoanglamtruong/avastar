import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu cho Personal Hub (AVASTAR)...");

  // Xóa dữ liệu cũ nếu có
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.postView.deleteMany();
  await prisma.gift.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postCard.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Tạo Users
  const owner = await prisma.user.create({
    data: {
      email: "zang@zeebee.vn",
      fullName: "Zangx (CEO & Founder)",
      passwordHash,
      role: "owner",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      phoneNumber: "0901234567",
    },
  });

  const memberVIP = await prisma.user.create({
    data: {
      email: "hoanglam@zeebee.vn",
      fullName: "Hoàng Lâm (VIP Member)",
      passwordHash,
      role: "member",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      phoneNumber: "0912345678",
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: "huonglan@zeebee.vn",
      fullName: "Hương Lan (Tech Lead)",
      passwordHash,
      role: "member",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      phoneNumber: "0987654321",
    },
  });

  const guest = await prisma.user.create({
    data: {
      email: "guest@zeebee.vn",
      fullName: "Khách Vãng Lai",
      passwordHash,
      role: "guest",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    },
  });

  console.log("✅ Đã tạo các tài khoản người dùng (Owner, VIP Members, Guest).");

  // 2. Tạo Posts & Cards
  // POST 1: STORE (Sản phẩm độc quyền)
  const postStore = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "store",
      caption: "Ra mắt Toolkit AI & Khóa Huấn Luyện Tự Động Hóa Độc Bản 2026. Sở hữu ngay tài sản số vĩnh viễn trên server riêng của bạn!",
      customMetadata: {
        tag: "STORE EXCLUSIVE",
        highlight: "HOT DEAL",
      },
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80",
            cardMetadata: { title: "AI Automation Master Toolkit 2026", badge: "Bộ Sản Phẩm Độc Bản" },
          },
          {
            orderIndex: 1,
            cardType: "store",
            cardMetadata: {
              productName: "Gói Bản Quyền Personal Hub & AI Bot Suite",
              price: 1990000,
              originalPrice: 4500000,
              stock: 24,
              features: [
                "100% Mã nguồn Next.js 15 PWA + Fullstack API",
                "Hạ tầng Self-Hosted trên Dell/VPS riêng",
                "Bình luận 1-1 bảo mật & Module Tặng Quà VIP",
                "Hỗ trợ cài đặt Zero-Downtime & Cloudflare SSL",
              ],
            },
          },
          {
            orderIndex: 2,
            cardType: "doc",
            docContent: `<h1>Chi Tiết Gói Giải Pháp Personal Hub AVASTAR</h1>
<p class="lead">Hệ thống không gian số độc bản dành cho KOLs, Chuyên gia và Doanh chủ muốn sở hữu 100% tệp khách hàng.</p>
<h2>1. Vì sao bạn cần Personal Hub?</h2>
<ul>
  <li><strong>Tự chủ dữ liệu:</strong> Không lo bị bóp reach, khóa nick hay đổi thuật toán trên các nền tảng mạng xã hội.</li>
  <li><strong>Trải nghiệm TikTok Snap mượt mà:</strong> Người xem đắm chìm trong nội dung cuộn dọc kết hợp vuốt đa thẻ nổi.</li>
  <li><strong>Doanh thu trực tiếp 100%:</strong> Bán tài liệu, khóa học, nhận quà tặng VIP và kết nối 1-1 mà không chịu hoa hồng trung gian 30%.</li>
</ul>
<h2>2. Cam kết hỗ trợ từ Zteam</h2>
<p>Bàn giao toàn bộ source code, docker-compose, chứng chỉ bảo mật và hướng dẫn vận hành 1-1.</p>`,
          },
        ],
      },
    },
  });

  // POST 2: EVENT (Sự kiện có countdown)
  const postEvent = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "event",
      caption: "Hội thảo Chiến Lược Công Nghệ: Tự Động Hóa Quy Trình Với Multi-Agent Systems & PWA.",
      customMetadata: {
        tag: "OFFLINE & ONLINE EVENT",
      },
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "video",
            mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41551-large.mp4",
            cardMetadata: { title: "Trailer Sự Kiện Công Nghệ 2026", poster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080&auto=format&fit=crop&q=80" },
          },
          {
            orderIndex: 1,
            cardType: "event",
            cardMetadata: {
              eventName: "AI Agentic Coding & Self-Hosted Infrastructure",
              eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              location: "Zangx Innovation Center, Tầng 12 Tòa Nhà Công Nghệ ZeeBee, TP.HCM",
              seatsLeft: 18,
              totalSeats: 50,
              speakers: ["Zangx (Founder)", "Hoàng Lâm (Architect)"],
            },
          },
          {
            orderIndex: 2,
            cardType: "doc",
            docContent: `<h1>Timeline & Nội Dung Chương Trình Hội Thảo</h1>
<h2>Phần 1: Kiến Trúc 3 Viewport & Virtualization 60 FPS</h2>
<p>Cách tối ưu bộ nhớ RAM trên thiết bị di động, render TikTok-like feed mượt mà trong DOM.</p>
<h2>Phần 2: Hệ Thống Giao Dịch & Bảo Mật 1-1</h2>
<p>Cơ chế lưu trữ bất biến (Strict Immutability), cách ly bình luận giữa các thành viên và phân luồng thông báo Realtime WebSocket.</p>
<h2>Phần 3: Q&A và Trao Quyền Triển Khai</h2>
<p>Tặng vé mời VIP và quyền truy cập sớm kho tài liệu kỹ thuật cao cấp.</p>`,
          },
        ],
      },
    },
  });

  // POST 3: DIARY (Nhật ký cá nhân)
  const postDiary = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "diary",
      caption: "Nhật ký người làm sản phẩm: Tại sao chúng tôi từ chối nút Thả Tim công cộng để bảo vệ sự kết nối chân thật?",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&auto=format&fit=crop&q=80",
            cardMetadata: { title: "Tư Duy Thiết Kế 1-1", badge: "Personal Diary" },
          },
          {
            orderIndex: 1,
            cardType: "doc",
            docContent: `<h1>Sức Mạnh Của Sự Riêng Tư: Tại Sao Không Có Nút Like Công Cộng?</h1>
<p class="lead">Khi số lượng like trở thành thước đo của giá trị, chúng ta bắt đầu sản xuất nội dung phục vụ thuật toán thay vì phục vụ con người.</p>
<blockquote>"Trong thế giới ồn ào của mạng xã hội, sự riêng tư 1-1 chính là thứ xa xỉ và giá trị nhất."</blockquote>
<h2>1. Bình luận riêng tư 1-1 tạo ra sự tin tưởng tuyệt đối</h2>
<p>Người đọc có thể thoải mái đặt những câu hỏi sâu sắc, chia sẻ những khó khăn cá nhân mà không sợ bị phán xét bởi đám đông. Member A và tôi trò chuyện riêng; Member B không nhìn thấy nội dung đó.</p>
<h2>2. Quà tặng VIP là lời cảm ơn thực chất</h2>
<p>Thay vì một nút bấm vô thưởng vô phạt, việc gửi một tách cà phê hay một món quà VIP thể hiện sự trân trọng chân thành đối với chất xám của tác giả.</p>
<p>Hãy xây dựng đế chế số của chính bạn, nơi bạn làm chủ 100% luật chơi.</p>`,
          },
        ],
      },
    },
  });

  // POST 4: JOB (Tuyển dụng)
  const postJob = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "job",
      caption: "Zteam tìm kiếm đồng đội: Tuyển dụng Senior Full-Stack AI Engineer & DevOps Lead.",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=80",
            cardMetadata: { title: "Gia Nhập Đội Ngũ Zteam", badge: "Hiring 2026" },
          },
          {
            orderIndex: 1,
            cardType: "job",
            cardMetadata: {
              jobTitle: "Senior Full-Stack AI Engineer",
              salary: "$2,000 - $3,500 / tháng (Gross)",
              location: "TP.HCM (Hybrid / Flexible)",
              experience: "3+ năm kinh nghiệm Next.js, Node.js, AI APIs",
              tags: ["Next.js 15", "TypeScript", "PostgreSQL", "Docker", "PWA"],
            },
          },
          {
            orderIndex: 2,
            cardType: "doc",
            docContent: `<h1>Quyền Lợi & Mô Tả Công Việc Cụ Thể</h1>
<h2>Quyền lợi:</h2>
<ul>
  <li>Lương thưởng cạnh tranh, xét duyệt tăng lương 6 tháng/lần.</li>
  <li>Trực tiếp tham gia thiết kế kiến trúc hệ điều hành thương mại AVASTAR.</li>
  <li>Được cấp trang thiết bị làm việc hiện đại (MacBook Pro / Dell Workstation).</li>
</ul>
<h2>Yêu cầu:</h2>
<ul>
  <li>Thành thạo TypeScript, React 19, Next.js App Router, Tailwind CSS.</li>
  <li>Kinh nghiệm xây dựng PWA, tối ưu hiệu năng 60 FPS, WebSockets/SSE.</li>
  <li>Tư duy làm sản phẩm sắc bén, kỷ luật và khả năng tự chủ cao.</li>
</ul>`,
          },
        ],
      },
    },
  });

  // POST 5: WORK (Quản lý tiến độ dự án)
  const postWork = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "work",
      caption: "Cập nhật tiến độ dự án Personal Hub (AVASTAR) - Trạng thái Sprint Q3/2026.",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "work",
            cardMetadata: {
              projectName: "AVASTAR Personal Hub PWA Engine",
              progress: 88,
              milestones: [
                { title: "Khởi tạo Kiến trúc Next.js PWA & 5 Tokens", status: "completed" },
                { title: "Virtualization 3 Viewport & Multi-Card", status: "completed" },
                { title: "Tích hợp 8 Loại Sub-page Cards", status: "completed" },
                { title: "Bình luận 1-1 Bất biến & Tặng Quà VIP", status: "completed" },
                { title: "Tối ưu hóa Lighthouse > 90 & Nginx Live", status: "in_progress" },
              ],
            },
          },
          {
            orderIndex: 1,
            cardType: "doc",
            docContent: `<h1>Báo Cáo Kỹ Thuật Dự Án AVASTAR</h1>
<p>Hệ thống đã hoàn thiện các tầng cốt lõi: DOM Engine 3 Viewport đạt ngưỡng phản hồi 60 FPS, Database PostgreSQL 7 bảng chuẩn DDL, và toàn bộ luồng tương tác 1-1 bảo mật.</p>`,
          },
        ],
      },
    },
  });

  // POST 6: DATING / CONNECT (Kết nối 1-1)
  const postConnect = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "dating",
      caption: "Cố vấn khởi nghiệp & Kết nối hợp tác đầu tư công nghệ số 1-1.",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1080&auto=format&fit=crop&q=80",
            cardMetadata: { title: "Không Gian Kết Nối Doanh Chủ", badge: "1-1 VIP Connect" },
          },
          {
            orderIndex: 1,
            cardType: "dating",
            cardMetadata: {
              targetAudience: "Doanh Chủ, Nhà Sáng Lập, Chuyên Gia",
              topics: ["Chiến lược số hóa độc bản", "Ứng dụng AI vào vận hành", "Xây dựng thương hiệu cá nhân bền vững"],
              availability: "Thứ Ba & Thứ Bảy hàng tuần",
            },
          },
        ],
      },
    },
  });

  // POST 7: TRAINING (Đào tạo)
  const postTraining = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "training",
      caption: "Chương trình đào tạo chuyên sâu: Tự xây dựng PWA và vận hành Microservices trên Server riêng.",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "training",
            cardMetadata: {
              courseTitle: "PWA & Self-Hosted Engineering 2026",
              duration: "4 Tuần (8 Buổi Trực Tuyến + Lab Thực Hành)",
              level: "Advanced Developer & Tech Lead",
              modules: [
                "Module 1: Thiết kế UI/UX Multi-Card Floating & DOM Virtualization",
                "Module 2: PostgreSQL DDL & Cơ chế Private Isolation 1-1",
                "Module 3: PWA Service Worker, Caching & Push Notifications",
                "Module 4: CI/CD, Docker Compose & Cloudflare Tunnel Zero-Downtime",
              ],
            },
          },
          {
            orderIndex: 1,
            cardType: "doc",
            docContent: `<h1>Giáo Trình Khóa Học</h1>
<p>Toàn bộ học viên được cấp máy chủ lab thực hành riêng và template mã nguồn hoàn chỉnh sẵn sàng kinh doanh.</p>`,
          },
        ],
      },
    },
  });

  // POST 8: SOP (Quy trình chuẩn)
  const postSOP = await prisma.post.create({
    data: {
      ownerId: owner.id,
      category: "sop",
      caption: "SOP Kỹ Thuật: Quy trình triển khai hệ thống Self-Hosted với Docker & Cloudflare Tunnel an toàn tuyệt đối.",
      cards: {
        create: [
          {
            orderIndex: 0,
            cardType: "sop",
            cardMetadata: {
              sopCode: "SOP-ENG-0823",
              sopTitle: "Zero-Downtime Deployment via Cloudflare Tunnel",
              estimatedTime: "15 phút",
              steps: [
                "Bước 1: Clone mã nguồn từ GitHub vào thư mục máy chủ Dell",
                "Bước 2: Cấu hình biến môi trường .env (DB, Port, JWT)",
                "Bước 3: Chạy Prisma migration & seed dữ liệu mẫu",
                "Bước 4: Khởi động container Docker trên port 8107",
                "Bước 5: Cập nhật Cloudflare Tunnel ingress và reload",
              ],
            },
          },
          {
            orderIndex: 1,
            cardType: "doc",
            docContent: `<h1>Tài Liệu Chi Tiết Về Lệnh & File Cấu Hình</h1>
<pre><code># Lệnh cập nhật tunnel
sudo systemctl restart cloudflared
# Lệnh kiểm tra trạng thái
docker compose ps
</code></pre>`,
          },
        ],
      },
    },
  });

  console.log("✅ Đã tạo đầy đủ 8 loại bài đăng và các thẻ đa nội dung.");

  // 3. Tạo mẫu Bình luận 1-1 (Private Commenting)
  await prisma.comment.create({
    data: {
      postId: postStore.id,
      memberId: memberVIP.id,
      senderRole: "member",
      content: "Chào anh Zangx, gói Toolkit AI có hỗ trợ cài đặt trực tiếp trên server riêng của công ty em không ạ?",
    },
  });

  await prisma.comment.create({
    data: {
      postId: postStore.id,
      memberId: memberVIP.id,
      senderRole: "owner",
      content: "Chào Hoàng Lâm! Hoàn toàn hỗ trợ nhé em. Zteam sẽ hỗ trợ cấu hình Docker và Cloudflare Tunnel trực tiếp qua Ultraviewer hoặc SSH.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: postEvent.id,
      memberId: member2.id,
      senderRole: "member",
      content: "Sự kiện có phát lại video quay màn hình chi tiết cho thành viên VIP không ạ?",
    },
  });

  await prisma.comment.create({
    data: {
      postId: postEvent.id,
      memberId: member2.id,
      senderRole: "owner",
      content: "Có nha Hương Lan, toàn bộ video 4K và slide bài giảng sẽ được cập nhật trong Box Doc của bài viết này ngay sau hội thảo!",
    },
  });

  // 4. Tạo mẫu Tặng Quà VIP
  await prisma.gift.create({
    data: {
      postId: postStore.id,
      senderId: memberVIP.id,
      giftType: "crown", // Vương miện
      giftValue: 500000,
      message: "Ủng hộ dự án Personal Hub tuyệt vời của Zteam!",
    },
  });

  await prisma.gift.create({
    data: {
      postId: postDiary.id,
      senderId: member2.id,
      giftType: "coffee", // Cà phê
      giftValue: 100000,
      message: "Cảm ơn bài viết rất truyền cảm hứng của anh!",
    },
  });

  // 5. Tạo mẫu View Logs (Owner Analytics)
  await prisma.postView.create({
    data: {
      postId: postStore.id,
      userId: memberVIP.id,
      ipAddress: "118.69.182.50",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
      watchDurationSeconds: 145,
      cardsViewed: [
        { cardIndex: 0, cardType: "image", durationSeconds: 20 },
        { cardIndex: 1, cardType: "store", durationSeconds: 65 },
        { cardIndex: 2, cardType: "doc", durationSeconds: 60 },
      ],
    },
  });

  await prisma.postView.create({
    data: {
      postId: postStore.id,
      userId: member2.id,
      ipAddress: "113.161.78.22",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      watchDurationSeconds: 92,
      cardsViewed: [
        { cardIndex: 0, cardType: "image", durationSeconds: 15 },
        { cardIndex: 1, cardType: "store", durationSeconds: 77 },
      ],
    },
  });

  // 6. Tạo mẫu Chatbox 1-1
  const conversation = await prisma.chatConversation.create({
    data: {
      memberId: memberVIP.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderId: memberVIP.id,
      content: "Chào anh Zangx, em muốn đăng ký tư vấn nâng cấp toàn bộ hệ thống bán hàng lên Personal Hub ạ.",
    },
  });

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderId: owner.id,
      content: "Chào em! Anh đã nhận được thông tin. Chiều mai 14h chúng ta gọi trao đổi trực tiếp qua link riêng nhé.",
    },
  });

  console.log("🎉 Nạp dữ liệu mẫu thành công 100%!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
