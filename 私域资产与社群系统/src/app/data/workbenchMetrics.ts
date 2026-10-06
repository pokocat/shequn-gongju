export type MetricState = "configured" | "no-data" | "zero" | "value" | "pending";

export type MetricResult = {
  label: string;
  value: string;
  state: MetricState;
  numerator?: number;
  denominator?: number;
  color: string;
};

export const parseMetricNumber = (value: string | number | undefined): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value || value === "—") return null;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const isPendingMetric = (value: string | number | undefined) => value === "待配置";
const isNoDataMetric = (value: string | number | undefined) => value === "暂无数据" || value === "—" || value === undefined;

export const calculateRatioMetric = (
  label: string,
  numeratorValue: string | number | undefined,
  denominatorValue: string | number | undefined,
  color: string,
): MetricResult => {
  if (isPendingMetric(numeratorValue) || isPendingMetric(denominatorValue)) {
    return { label, value: "待配置", state: "pending", color };
  }
  if (isNoDataMetric(numeratorValue) || isNoDataMetric(denominatorValue)) {
    return { label, value: "暂无数据", state: "no-data", color };
  }
  const numerator = parseMetricNumber(numeratorValue);
  const denominator = parseMetricNumber(denominatorValue);
  if (numerator === null || denominator === null) return { label, value: "暂无数据", state: "no-data", color };
  if (denominator === 0) return { label, value: numerator === 0 ? "0%" : "暂无数据", state: numerator === 0 ? "zero" : "no-data", numerator, denominator, color };
  return { label, value: `${((numerator / denominator) * 100).toFixed(1)}%`, state: numerator === 0 ? "zero" : "value", numerator, denominator, color };
};

const effectiveReachMembers = (data: Record<string, string>) => {
  if (data.effectiveReachMembers !== undefined) return data.effectiveReachMembers;
  const members = parseMetricNumber(data.memberCount);
  const reachRate = parseMetricNumber(data.reachRate);
  if (members === null || reachRate === null) return undefined;
  return String(Math.round(members * reachRate / 100));
};

export const calculateScopeMetrics = (
  scope: "community" | "project",
  data: Record<string, string>,
): MetricResult[] => {
  if (scope === "community") {
    return [
      calculateRatioMetric("发言率", data.speakingMembers, data.memberCount, "#00a978"),
      calculateRatioMetric("点击率", data.linkClicks, effectiveReachMembers(data), "#2385c8"),
      calculateRatioMetric("绑定率", data.projectBindings, data.memberCount, "#253800"),
      calculateRatioMetric("消费转化率", data.consumingMembers, data.projectBindings, "#e77800"),
    ];
  }
  return [
    calculateRatioMetric("授权率", data.authorizedMembers, data.memberCount, "#00a978"),
    calculateRatioMetric("绑定率", data.boundMembers, data.authorizedMembers, "#2385c8"),
    calculateRatioMetric("消费转化率", data.consumingMembers, data.boundMembers, "#e77800"),
    calculateRatioMetric("复购率", data.repeatMembers, data.consumingMembers, "#7445d8"),
  ];
};
