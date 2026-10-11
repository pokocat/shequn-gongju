import { describe, expect, it } from "vitest";
import {
  getCanonicalProjectName,
  getGroupRulesForProject,
  getProjectServiceAccounts,
  principalLeaderProjects,
  projectNamesMatch,
  resolveProjectId,
} from "../src/app/data/projectGroupRules";

describe("主理人公社项目标准化", () => {
  it("保留九个标准项目名称和稳定 ID", () => {
    expect(principalLeaderProjects).toHaveLength(9);
    expect(principalLeaderProjects.map(project => project.name)).toEqual([
      "V001 军师",
      "AI超级广告公司",
      "AI艺人孵化",
      "AI数字资产平台",
      "AI大健康",
      "AI知识付费",
      "AI教育",
      "AI明星艺人授权",
      "AI企业礼品采购",
    ]);
    expect(resolveProjectId("AI超级广告平台")).toBe("super-ad-company");
  });

  it("旧名称可以解析到标准名称并匹配项目规则", () => {
    expect(getCanonicalProjectName("AI教育平台")).toBe("AI教育");
    expect(projectNamesMatch("AI艺人孵化平台", "AI艺人孵化")).toBe(true);
    expect(getGroupRulesForProject("AI知识付费")).toHaveLength(4);
  });

  it("服务人员账号按项目别名和城市匹配", () => {
    expect(getProjectServiceAccounts("AI超级广告公司", "上海").map(account => account.id)).toEqual(["FLP002"]);
    expect(getProjectServiceAccounts("AI教育", "成都").map(account => account.id)).toEqual(["FLE002"]);
  });
});
