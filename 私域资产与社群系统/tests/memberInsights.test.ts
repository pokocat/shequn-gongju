import { describe, expect, it } from "vitest";
import {
  HIGH_INFLUENCE_THRESHOLD,
  getMemberInsights,
} from "../src/app/data/memberInsights";

describe("会员资料经营洞察", () => {
  it("为已入群且高影响力会员提供可核验的经营摘要和跟进建议", () => {
    const insights = getMemberInsights({
      influence: HIGH_INFLUENCE_THRESHOLD,
      level: "PRO会员",
      groupStatus: "已入群",
      joinedGroups: [
        { name: "北京PRO会员群01", type: "PRO会员", status: "已入群" },
        { name: "主理人成长社群·北京", type: "主理人社群", status: "已入群" },
      ],
    });

    expect(insights.summary).toEqual([
      { label: "已入社群", value: "2 个", tone: "success" },
      { label: "影响力", value: "3,000", tone: "default" },
      { label: "会员等级", value: "PRO会员", tone: "accent" },
      { label: "服务状态", value: "已入群", tone: "success" },
    ]);
    expect(insights.segment).toEqual({
      label: "高潜力会员",
      advice: "建议优先回访并邀约参与活动",
    });
    expect(insights.rfm).toEqual([
      { label: "R 最近活跃", value: "待同步" },
      { label: "F 购买频次", value: "待接入" },
      { label: "M 累计消费", value: "待接入" },
      { label: "RFM 分层", value: "暂不判定" },
    ]);
  });

  it("将待入群会员标记为待服务跟进，且不虚构社群数量", () => {
    const insights = getMemberInsights({
      influence: 2877,
      level: "体验官",
      groupStatus: "待入群",
      joinedGroups: [],
    });

    expect(insights.summary[0]).toEqual({ label: "已入社群", value: "0 个", tone: "muted" });
    expect(insights.summary[3]).toEqual({ label: "服务状态", value: "待入群", tone: "warning" });
    expect(insights.segment).toEqual({
      label: "待服务跟进",
      advice: "建议优先完成入群与关系服务任务",
    });
  });

  it("将未提供邀请入群状态的会员显示为未分配", () => {
    const insights = getMemberInsights({
      influence: 1200,
      level: "游客",
      joinedGroups: [],
    });

    expect(insights.summary[3]).toEqual({ label: "服务状态", value: "未分配", tone: "muted" });
    expect(insights.segment.label).toBe("待服务跟进");
  });

  it("将已入群但影响力未达阈值的会员标记为已服务会员", () => {
    const insights = getMemberInsights({
      influence: HIGH_INFLUENCE_THRESHOLD - 1,
      level: "VIP",
      groupStatus: "已入群",
      joinedGroups: [{ name: "北京PRO会员群01", type: "PRO会员", status: "已入群" }],
    });

    expect(insights.segment).toEqual({
      label: "已服务会员",
      advice: "建议持续内容触达并引导社群互动",
    });
  });

  it("不会返回静态订单、消费金额或虚构的 RFM 人群结论", () => {
    const insights = getMemberInsights({
      influence: 3510,
      level: "PRO会员",
      groupStatus: "已入群",
      joinedGroups: [],
    });
    const displayedValues = [...insights.summary, ...insights.rfm].map(item => item.value);

    expect(displayedValues).not.toContain("3 单");
    expect(displayedValues).not.toContain("¥1,240");
    expect(displayedValues).not.toContain("冠军客户");
  });
});
