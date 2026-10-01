export const PORTFOLIO_NAV = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/du-an", label: "Dự án" },
] as const;

export const PILLARS = [
  {
    key: "creator",
    name: "Creator",
    title: "Nội dung và kênh bán hàng chạy được",
    body: "Quảng cáo Facebook, ảnh, video, landing page, webapp và app, làm bằng công cụ AI và đi qua đủ các bước thiết kế, thi công, chỉnh sửa, vận hành.",
  },
  {
    key: "pm",
    name: "Product Manager",
    title: "Từ ý tưởng tới sản phẩm chạy thật",
    body: "Định nghĩa bài toán, chia thành từng vòng làm, đặt tiêu chí kiểm tra rõ ràng và điều phối nhiều công cụ AI cùng làm một sản phẩm.",
  },
  {
    key: "rd",
    name: "R&D",
    title: "Sản phẩm vật lý: decor, cây cảnh, cơ khí",
    body: "Nghiên cứu và làm mẫu thử các sản phẩm decor, cây cảnh, cơ khí. Mỗi phiên bản đều được ghi lại để biết đã thử gì và sửa gì.",
  },
] as const;

export const SERVICES = [
  {
    name: "Marketing Facebook",
    body: "Xây nội dung, chạy quảng cáo và theo dõi kết quả trên Facebook để cửa hàng có khách nhắn tin thật.",
    steps: ["Tìm hiểu khách hàng mục tiêu", "Làm nội dung và quảng cáo", "Đo kết quả, chỉnh hằng tuần"],
  },
  {
    name: "Ảnh",
    body: "Ảnh sản phẩm, ảnh thương hiệu, ảnh quảng cáo tạo và chỉnh bằng công cụ AI, giữ đồng nhất phong cách.",
    steps: ["Nhận brief và ảnh tham chiếu", "Tạo và chỉnh ảnh", "Giao file đúng kích thước từng kênh"],
  },
  {
    name: "Video",
    body: "Video ngắn và video quảng cáo có lồng tiếng, nhạc nền, đi từ kịch bản tới thành phẩm.",
    steps: ["Kịch bản và phân cảnh", "Dựng cảnh, lồng tiếng", "Xuất file theo từng nền tảng"],
  },
  {
    name: "Landing page",
    body: "Trang giới thiệu một sản phẩm hoặc dịch vụ, tải nhanh trên điện thoại, có chỗ để khách để lại thông tin.",
    steps: ["Chốt thông điệp và cấu trúc", "Thiết kế và lập trình", "Chạy thật và theo dõi"],
  },
  {
    name: "Webapp và App",
    body: "Ứng dụng web và ứng dụng cài được trên điện thoại cho công việc của bạn, từ thiết kế tới vận hành.",
    steps: ["Định nghĩa bài toán và tiêu chí", "Làm từng vòng, xem được ngay", "Vận hành và nâng cấp"],
  },
  {
    name: "Vận hành tự động",
    body: "Tự động hóa việc lặp đi lặp lại như nhắc việc, báo cáo, trả lời khách, đồng bộ dữ liệu.",
    steps: ["Vẽ lại quy trình hiện tại", "Dựng phần tự động", "Theo dõi và chỉnh khi thay đổi"],
  },
  {
    name: "R&D sản phẩm",
    body: "Nghiên cứu và làm mẫu thử sản phẩm vật lý về decor, cây cảnh và cơ khí.",
    steps: ["Ý tưởng và bản vẽ", "Làm mẫu thử", "Thử nghiệm, ghi lại từng phiên bản"],
  },
] as const;

export const AI_TOOLS = [
  { name: "Claude", role: "Viết, lập trình, điều phối công việc" },
  { name: "Gemini", role: "Ảnh, video, đọc và tổng hợp tài liệu" },
  { name: "GPT", role: "Ảnh, viết nội dung, tự động hóa" },
  { name: "ElevenLabs", role: "Giọng đọc, lồng tiếng, âm thanh" },
  { name: "Higgsfield", role: "Ảnh và video quảng cáo" },
] as const;

export const PRODUCT_GROUPS = [
  {
    key: "decor",
    name: "Decor",
    intro: "Đồ trang trí cho không gian sống và làm việc.",
    items: [
      { code: "RD-001", name: "Kệ treo tường mô-đun", status: "Đang làm mẫu", material: "Gỗ, thép sơn tĩnh điện", version: "v0.2" },
    ],
  },
  {
    key: "cay-canh",
    name: "Cây cảnh",
    intro: "Phụ kiện và giải pháp trưng bày cây cảnh, bonsai.",
    items: [
      { code: "RD-003", name: "Chậu bonsai xoay", status: "Đang thử nghiệm", material: "Nhôm, gốm", version: "v0.3" },
    ],
  },
  {
    key: "co-khi",
    name: "Cơ khí",
    intro: "Đồ gá, chi tiết và cơ cấu nhỏ làm từ kiến thức ngành cơ khí.",
    items: [
      { code: "RD-004", name: "Đồ gá khoan định vị", status: "Đã có bản vẽ", material: "Thép tấm", version: "v0.1" },
    ],
  },
] as const;

export const PROJECT_TYPES = ["Tất cả", "Marketing", "Ảnh", "Video", "Landing page", "Webapp", "App"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ProjectItem = {
  title: string;
  type: Exclude<ProjectType, "Tất cả">;
  body: string;
  sample: boolean;
  href?: string;
};

export const PROJECTS: ProjectItem[] = [
  {
    title: "Personal Hub",
    type: "Webapp",
    body: "Ứng dụng cài được trên điện thoại: cuộn xem bài theo từng màn hình, bình luận riêng 1-1, tặng quà, chat và thông báo thời gian thực cho chủ nội dung.",
    sample: false,
    href: "/",
  },
  { title: "Chiến dịch Facebook cho quán cà phê", type: "Marketing", body: "Nội dung, quảng cáo và báo cáo tuần cho một cửa hàng nhỏ.", sample: true },
  { title: "Bộ ảnh sản phẩm cây cảnh", type: "Ảnh", body: "Ảnh sản phẩm đồng nhất phong cách cho cửa hàng cây cảnh.", sample: true },
  { title: "Video quảng cáo 30 giây", type: "Video", body: "Kịch bản, dựng cảnh, lồng tiếng cho một homestay.", sample: true },
  { title: "Landing page giới thiệu dịch vụ", type: "Landing page", body: "Trang một màn hình tải nhanh, có form để khách để lại thông tin.", sample: true },
  { title: "App quản lý công việc cá nhân", type: "App", body: "Ứng dụng cài trên điện thoại để theo dõi việc hằng ngày.", sample: true },
];
