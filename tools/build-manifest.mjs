import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const groups = [
  {
    id: "pc-backend",
    title: "PC端后台",
    type: "后台系统",
    dir: "extracted_packages/pc_backend",
  },
  {
    id: "backend-order-service-member",
    title: "后台运营：订单 / 客服 / 会员",
    type: "后台系统",
    dir: "source_materials/蜂乐玛/UI设计截图/2026-01-26_后台运营_订单客服会员",
  },
  {
    id: "backend-wechat-community",
    title: "后台运营：微信社群",
    type: "后台系统",
    dir: "source_materials/蜂乐玛/UI设计截图/2026-01-26_后台运营_微信社群",
  },
  {
    id: "miniapp-jinfu",
    title: "蜂乐玛金服小程序",
    type: "小程序",
    dir: "extracted_packages/miniapp_jinfu",
  },
  {
    id: "mall-order-cart",
    title: "商城小程序：会员 / 订单 / 购物车",
    type: "小程序",
    dir: "source_materials/蜂乐玛/UI设计截图/2025-11_商城前台_会员订单购物车",
  },
  {
    id: "mall-promotion",
    title: "商城小程序：会员推广",
    type: "小程序",
    dir: "source_materials/蜂乐玛/UI设计截图/2025-11_商城前台_会员推广",
  },
  {
    id: "group-prototypes",
    title: "群管理与群营销 Axure 原型",
    type: "可交互原型",
    prototypeLinks: [
      {
        title: "群管理后台",
        description: "包含社群管理、微信号管理、员工管理等后台页面。",
        path: "extracted_packages/group_management/群管理/index.html",
      },
      {
        title: "群营销工具小程序",
        description: "包含社群、数据分析、商品分享、我的等小程序页面。",
        path: "extracted_packages/group_marketing/群营销工具小程序/index.html",
      },
    ],
  },
];

const imageExts = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);

const systems = [];

for (const group of groups) {
  const system = { ...group };
  delete system.dir;

  if (group.dir) {
    const files = await collectFiles(path.join(root, group.dir));
    system.screens = files
      .filter((file) => imageExts.has(path.extname(file).toLowerCase()))
      .map((file) => {
        const relativePath = path.relative(root, file);
        return {
          title: cleanTitle(path.basename(file, path.extname(file))),
          path: relativePath,
          kind: inferKind(relativePath),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
  } else {
    system.screens = [];
  }

  systems.push(system);
}

await writeFile(
  path.join(root, "manifest.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), systems }, null, 2)}\n`,
);

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function cleanTitle(title) {
  return title
    .replace(/\s*副本(?:\s*副本)?/g, "")
    .replace(/\s*copy(?:\s*\(\d+\))?/gi, "")
    .replace(/\s*\(\d+\)$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferKind(filePath) {
  if (filePath.includes("pc_backend")) return "desktop";
  if (filePath.includes("后台运营") && /管理|回访单|操作台|活动通知|链接页面|客服信息/.test(filePath)) {
    return "desktop";
  }
  return "phone";
}
