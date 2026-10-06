import { describe, expect, it } from "vitest";
import { calculateRatioMetric, calculateScopeMetrics } from "../src/app/data/workbenchMetrics";

describe("workbench metrics", () => {
  it("distinguishes pending, no-data, zero, and calculated values", () => {
    expect(calculateRatioMetric("授权率", "待配置", "待配置", "#000").state).toBe("pending");
    expect(calculateRatioMetric("授权率", "暂无数据", "10", "#000").state).toBe("no-data");
    expect(calculateRatioMetric("授权率", "0", "10", "#000")).toMatchObject({ value: "0.0%", state: "zero" });
    expect(calculateRatioMetric("授权率", "5", "10", "#000")).toMatchObject({ value: "50.0%", state: "value" });
  });

  it("uses effective reach as the community click denominator", () => {
    const [speaking, click] = calculateScopeMetrics("community", {
      speakingMembers: "20",
      memberCount: "100",
      linkClicks: "10",
      effectiveReachMembers: "40",
      projectBindings: "10",
      consumingMembers: "5",
    });
    expect(speaking.value).toBe("20.0%");
    expect(click.value).toBe("25.0%");
  });

  it("keeps unconfigured project metrics from becoming zero", () => {
    const metrics = calculateScopeMetrics("project", {
      memberCount: "暂无数据",
      authorizedMembers: "暂无数据",
      boundMembers: "暂无数据",
      consumingMembers: "暂无数据",
      repeatMembers: "待配置",
    });
    expect(metrics.every(metric => ["no-data", "pending"].includes(metric.state))).toBe(true);
  });
});
