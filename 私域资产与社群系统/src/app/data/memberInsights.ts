import type { MemberJoinedGroup } from "./memberProfileGroups";

export const HIGH_INFLUENCE_THRESHOLD = 3000;

type InsightTone = "success" | "default" | "accent" | "warning" | "muted";
type GroupServiceStatus = "未分配" | "未分配群" | "待入群" | "已入群" | "已退出" | "无法添加";

export type MemberInsightInput = {
  influence: number;
  level: string;
  groupStatus?: string;
  joinedGroups: MemberJoinedGroup[];
};

export type MemberInsight = {
  summary: Array<{
    label: "已入社群" | "影响力" | "会员等级" | "服务状态";
    value: string;
    tone: InsightTone;
  }>;
  segment: {
    label: "高潜力会员" | "已服务会员" | "待服务跟进";
    advice: string;
  };
  rfm: Array<{
    label: "R 最近活跃" | "F 购买频次" | "M 累计消费" | "RFM 分层";
    value: "待同步" | "待接入" | "暂不判定";
  }>;
};

const normalizeGroupStatus = (groupStatus?: string): GroupServiceStatus => {
  if (groupStatus === "已入群" || groupStatus === "待入群" || groupStatus === "已退出" || groupStatus === "无法添加") {
    return groupStatus;
  }

  return groupStatus === "未分配群" ? "未分配群" : "未分配";
};

const toneForGroupStatus = (groupStatus: GroupServiceStatus): InsightTone => {
  if (groupStatus === "已入群") return "success";
  if (groupStatus === "待入群") return "warning";
  return "muted";
};

export const getMemberInsights = ({
  influence,
  level,
  groupStatus,
  joinedGroups,
}: MemberInsightInput): MemberInsight => {
  const serviceStatus = normalizeGroupStatus(groupStatus);
  const isInGroup = serviceStatus === "已入群";
  const segment = !isInGroup
    ? { label: "待服务跟进" as const, advice: "建议优先完成入群与关系服务任务" }
    : influence >= HIGH_INFLUENCE_THRESHOLD
      ? { label: "高潜力会员" as const, advice: "建议优先回访并邀约参与活动" }
      : { label: "已服务会员" as const, advice: "建议持续内容触达并引导社群互动" };

  return {
    summary: [
      {
        label: "已入社群",
        value: `${joinedGroups.length} 个`,
        tone: joinedGroups.length > 0 ? "success" : "muted",
      },
      { label: "影响力", value: influence.toLocaleString(), tone: "default" },
      { label: "会员等级", value: level, tone: "accent" },
      { label: "服务状态", value: serviceStatus, tone: toneForGroupStatus(serviceStatus) },
    ],
    segment,
    rfm: [
      { label: "R 最近活跃", value: "待同步" },
      { label: "F 购买频次", value: "待接入" },
      { label: "M 累计消费", value: "待接入" },
      { label: "RFM 分层", value: "暂不判定" },
    ],
  };
};
