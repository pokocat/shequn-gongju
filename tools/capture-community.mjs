import { chromium } from "/Users/binbinchen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDir = new URL("../design-references/", import.meta.url);
await mkdir(fileURLToPath(outputDir), { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 });

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
const pcButton = page.getByRole("button", { name: "PC 后台", exact: true });
if (await pcButton.count() !== 1) throw new Error("PC 后台入口未找到");
await pcButton.click();
await page.getByRole("button", { name: "微信群管理", exact: true }).click();
await page.screenshot({ path: fileURLToPath(new URL("current-community.png", outputDir)), fullPage: true });
await page.screenshot({ path: fileURLToPath(new URL("prototype-mode-01-ops.png", outputDir)), fullPage: true });

await page.getByRole("button", { name: /看板显示/ }).click();
await page.screenshot({ path: fileURLToPath(new URL("prototype-mode-02-status.png", outputDir)), fullPage: true });

await page.getByRole("button", { name: /详情显示/ }).click();
await page.screenshot({ path: fileURLToPath(new URL("prototype-mode-03-detail.png", outputDir)), fullPage: true });

for (const [name, path] of [
  ["axure-community-main", "社群管理.html"],
  ["axure-community-detail", "社群管理_1.html"],
  ["axure-community-extra", "社群管理_2.html"],
]) {
  await page.goto(`http://127.0.0.1:8766/${encodeURIComponent(path)}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, outputDir)), fullPage: true });
}

await browser.close();
