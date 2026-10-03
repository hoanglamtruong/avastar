import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getCmsData,
  saveCmsData,
  ProjectItem,
  ProductItem,
  ServiceItem,
} from "@/lib/cms-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";
    const data = getCmsData();

    if (section === "projects") {
      return NextResponse.json({ success: true, items: data.projects });
    }
    if (section === "products") {
      return NextResponse.json({ success: true, items: data.products, groups: data.productGroups });
    }
    if (section === "services") {
      return NextResponse.json({ success: true, items: data.services });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền tạo mục mới" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { section, item } = body;
    if (!section || !item) {
      return NextResponse.json({ error: "Thiếu thông tin section hoặc item" }, { status: 400 });
    }

    const data = getCmsData();
    const nowId = Date.now().toString(36);

    if (section === "projects") {
      const newItem: ProjectItem = {
        id: item.id || `prj-${nowId}`,
        title: item.title || "Dự án mới",
        type: item.type || "Webapp",
        body: item.body || "",
        sample: Boolean(item.sample),
        href: item.href || "",
      };
      data.projects.unshift(newItem);
      saveCmsData(data);
      return NextResponse.json({ success: true, item: newItem });
    }

    if (section === "products") {
      const newItem: ProductItem = {
        id: item.id || `prd-${nowId}`,
        groupKey: item.groupKey || "decor",
        code: item.code || `RD-${data.products.length + 1}`,
        name: item.name || "Sản phẩm mới",
        status: item.status || "Đang thử nghiệm",
        material: item.material || "Hợp kim, gỗ",
        version: item.version || "v0.1",
      };
      data.products.unshift(newItem);
      saveCmsData(data);
      return NextResponse.json({ success: true, item: newItem });
    }

    if (section === "services") {
      const newItem: ServiceItem = {
        id: item.id || `srv-${nowId}`,
        name: item.name || "Dịch vụ mới",
        body: item.body || "",
        steps: Array.isArray(item.steps) ? item.steps : ["Khảo sát nhu cầu", "Thực thi", "Bàn giao"],
      };
      data.services.push(newItem);
      saveCmsData(data);
      return NextResponse.json({ success: true, item: newItem });
    }

    return NextResponse.json({ error: "Phân loại section không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền cập nhật" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { section, id, item } = body;
    if (!section || !id || !item) {
      return NextResponse.json({ error: "Thiếu thông tin section, id hoặc item" }, { status: 400 });
    }

    const data = getCmsData();

    if (section === "projects") {
      const idx = data.projects.findIndex((p) => p.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Không tìm thấy dự án" }, { status: 404 });
      }
      data.projects[idx] = {
        ...data.projects[idx],
        ...item,
        id, // preserve id
      };
      saveCmsData(data);
      return NextResponse.json({ success: true, item: data.projects[idx] });
    }

    if (section === "products") {
      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
      }
      data.products[idx] = {
        ...data.products[idx],
        ...item,
        id,
      };
      saveCmsData(data);
      return NextResponse.json({ success: true, item: data.products[idx] });
    }

    if (section === "services") {
      const idx = data.services.findIndex((s) => s.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Không tìm thấy dịch vụ" }, { status: 404 });
      }
      data.services[idx] = {
        ...data.services[idx],
        ...item,
        id,
      };
      saveCmsData(data);
      return NextResponse.json({ success: true, item: data.services[idx] });
    }

    return NextResponse.json({ error: "Phân loại section không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
      return NextResponse.json(
        { error: "Chỉ Owner hoặc Admin mới có quyền xóa" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const id = searchParams.get("id");

    if (!section || !id) {
      return NextResponse.json({ error: "Thiếu thông tin section hoặc id" }, { status: 400 });
    }

    const data = getCmsData();

    if (section === "projects") {
      data.projects = data.projects.filter((p) => p.id !== id);
      saveCmsData(data);
      return NextResponse.json({ success: true, message: "Đã xóa dự án thành công" });
    }

    if (section === "products") {
      data.products = data.products.filter((p) => p.id !== id);
      saveCmsData(data);
      return NextResponse.json({ success: true, message: "Đã xóa sản phẩm thành công" });
    }

    if (section === "services") {
      data.services = data.services.filter((s) => s.id !== id);
      saveCmsData(data);
      return NextResponse.json({ success: true, message: "Đã xóa dịch vụ thành công" });
    }

    return NextResponse.json({ error: "Phân loại section không hợp lệ" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
