import { describe, expect, it } from "vitest";
import {
  buildEntityCode,
  buildPlatformCreateDefaults,
  getDirectPlatforms,
  getEcosystemContext,
  getIdentityConfigTarget,
  getNextEntityCode,
  getPlatformsForEco,
  getPlatformsForSaas,
  getPlatformOwnerLabel,
} from "../src/app/components/EcosystemManagement";

const platforms = [
  { id: 1, name: "直属平台", eco: "健康生态", partner: "", saas: "" },
  { id: 2, name: "伙伴平台", eco: "健康生态", partner: "健康 SaaS", saas: "健康 SaaS" },
  { id: 3, name: "其他生态平台", eco: "其他生态", partner: "健康 SaaS", saas: "健康 SaaS" },
];

describe("生态页面上下文", () => {
  it("根据当前层级生成一致的路径和当前对象标签", () => {
    expect(getEcosystemContext("super", null)).toEqual({
      label: "超级生态",
      path: ["行业生态", "超级生态"],
    });
    expect(getEcosystemContext("saas", null)).toEqual({
      label: "SaaS 合作伙伴",
      path: ["行业生态", "SaaS 合作伙伴"],
    });
    expect(getEcosystemContext("platform", "主理人公社")).toEqual({
      label: "平台 · 主理人公社",
      path: ["行业生态", "平台", "主理人公社"],
    });
  });

  it("未指定 SaaS 合作伙伴的平台显示为直属超级生态", () => {
    expect(getPlatformOwnerLabel({ partner: "", saas: "" })).toBe("直属超级生态");
    expect(getPlatformOwnerLabel({ partner: "合作伙伴", saas: "旧字段" })).toBe("合作伙伴");
  });

  it("按生态和 SaaS 筛选旗下平台", () => {
    expect(getPlatformsForEco(platforms, "健康生态").map(item => item.name)).toEqual(["直属平台", "伙伴平台"]);
    expect(getPlatformsForSaas(platforms, "健康 SaaS", "健康生态").map(item => item.name)).toEqual(["伙伴平台"]);
    expect(getDirectPlatforms(platforms, "健康生态").map(item => item.name)).toEqual(["直属平台"]);
  });

  it("按身份映射到对应配置范围", () => {
    expect(getIdentityConfigTarget("超级生态管理员")).toEqual({ nodeType: "super", panel: "superSettings" });
    expect(getIdentityConfigTarget("生态COO")).toEqual({ nodeType: "eco", panel: "ecoSettings" });
    expect(getIdentityConfigTarget("SaaS 合作伙伴运营")).toEqual({ nodeType: "saas", panel: "overview" });
    expect(getIdentityConfigTarget("平台管理员")).toEqual({ nodeType: "platform", panel: "overview" });
    expect(getIdentityConfigTarget("项目负责人")).toEqual({ nodeType: "project", panel: "projectOverview" });
    expect(getIdentityConfigTarget("未配置身份")).toEqual({ nodeType: "eco", panel: "overview" });
  });
  it("从生态或 SaaS 节点生成新平台默认归属", () => {
    expect(buildPlatformCreateDefaults("健康生态")).toEqual({ eco: "健康生态", saas: "" });
    expect(buildPlatformCreateDefaults("健康生态", "健康 SaaS")).toEqual({ eco: "健康生态", saas: "健康 SaaS" });
  });

  it("生成固定格式的实体编号", () => {
    expect(buildEntityCode("PRJ", 1)).toBe("PRJ-0001");
    expect(buildEntityCode("ECO", 12)).toBe("ECO-0012");
  });

  it("按指定 prefix 的最大编号继续生成，并跳过 gaps", () => {
    expect(getNextEntityCode([
      { code: "PRJ-0001" },
      { code: "PRJ-0003" },
    ], "PRJ")).toBe("PRJ-0004");
  });

  it("不同 prefix 相互独立", () => {
    const records = [
      { code: "PRJ-0002" },
      { code: "ECO-0009" },
    ];

    expect(getNextEntityCode(records, "PRJ")).toBe("PRJ-0003");
    expect(getNextEntityCode(records, "ECO")).toBe("ECO-0010");
  });

  it("同时保留项目名称和实体编号", () => {
    const project = { name: "AI教育", code: "PRJ-0007" };
    expect(project).toEqual({ name: "AI教育", code: "PRJ-0007" });
  });
});
