import fs from "fs";
import path from "path";
import { SERVICES, PRODUCT_GROUPS, PROJECTS } from "./portfolio-content";

export interface BankConfig {
  bankId: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  body: string;
  steps: string[];
}

export interface ProductItem {
  id: string;
  groupKey: string;
  code: string;
  name: string;
  status: string;
  material: string;
  version: string;
}

export interface ProductGroup {
  key: string;
  name: string;
  intro: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  type: string;
  body: string;
  sample: boolean;
  href?: string;
}

export interface CmsData {
  bankInfo: BankConfig;
  services: ServiceItem[];
  productGroups: ProductGroup[];
  products: ProductItem[];
  projects: ProjectItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cms-data.json");

function getDefaultData(): CmsData {
  const initialServices: ServiceItem[] = SERVICES.map((s, idx) => ({
    id: `srv-${idx + 1}`,
    name: s.name,
    body: s.body,
    steps: [...s.steps],
  }));

  const initialGroups: ProductGroup[] = PRODUCT_GROUPS.map((g) => ({
    key: g.key,
    name: g.name,
    intro: g.intro,
  }));

  const initialProducts: ProductItem[] = [];
  PRODUCT_GROUPS.forEach((g) => {
    g.items.forEach((it, idx) => {
      initialProducts.push({
        id: `prd-${g.key}-${idx + 1}`,
        groupKey: g.key,
        code: it.code,
        name: it.name,
        status: it.status,
        material: it.material,
        version: it.version,
      });
    });
  });

  const initialProjects: ProjectItem[] = PROJECTS.map((p, idx) => ({
    id: `prj-${idx + 1}`,
    title: p.title,
    type: p.type,
    body: p.body,
    sample: p.sample,
    href: p.href || "",
  }));

  return {
    bankInfo: {
      bankId: "MB",
      bankName: "MBBank (Ngân Hàng Quân Đội)",
      accountNo: "0901234567",
      accountName: "TRUONG HOANG LAM",
    },
    services: initialServices,
    productGroups: initialGroups,
    products: initialProducts,
    projects: initialProjects,
  };
}

export function getCmsData(): CmsData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const def = getDefaultData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(def, null, 2), "utf-8");
      return def;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading cms data:", error);
    return getDefaultData();
  }
}

export function saveCmsData(data: CmsData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing cms data:", error);
  }
}
