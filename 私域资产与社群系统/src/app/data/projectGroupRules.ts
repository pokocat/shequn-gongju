export type AllocationMode = "轮巡分配" | "统一分配";

export type GroupTypeRule = {
  id: string;
  name: string;
  code: string;
  memberRoles: string[];
  capacity: number;
  cities: string[];
  allocationMode: AllocationMode;
  nameTemplate: string;
  enabled: boolean;
};

export type WechatAccount = {
  id: string;
  project: string;
  wechat: string;
  city: string;
  createdAt: string;
  service: string;
  enabled: boolean;
  groupCapacity: number;
};

export const regionCodes: Record<string, string> = {
  北京: "B", 吉林: "J", 上海: "H", 广州: "G", 深圳: "S", 成都: "C", 杭州: "Z", 武汉: "W", 南京: "N", 全国: "X",
};

export const projectGroupRules: Record<string, GroupTypeRule[]> = {
  "蜂乐码": [
    { id: "visitor", name: "游客", code: "FLM01", memberRoles: ["游客"], capacity: 500, cities: ["北京", "吉林", "上海", "广州"], allocationMode: "轮巡分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: true },
    { id: "experience", name: "体验官", code: "FLM02", memberRoles: ["体验官"], capacity: 500, cities: ["北京", "吉林", "上海", "广州"], allocationMode: "轮巡分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: true },
    { id: "vip", name: "VIP", code: "FLM03", memberRoles: ["VIP0", "VIP1", "VIP2", "VIP3", "VIP4"], capacity: 500, cities: ["北京", "吉林", "上海"], allocationMode: "统一分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: true },
    { id: "svip", name: "尊享官", code: "FLM04", memberRoles: ["SVIP0", "SVIP1", "SVIP2", "SVIP3", "SVIP4", "SVIP5"], capacity: 200, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: true },
  ],
};

export const wechatAccounts: WechatAccount[] = [
  { id: "FLM001", project: "蜂乐码", wechat: "FLM001", city: "北京", createdAt: "2026-01-08", service: "吴思远", enabled: true, groupCapacity: 20 },
  { id: "FLM002", project: "蜂乐码", wechat: "FLM002", city: "吉林", createdAt: "2026-02-14", service: "林小燕", enabled: true, groupCapacity: 20 },
  { id: "FLM003", project: "蜂乐码", wechat: "FLM003", city: "上海", createdAt: "2026-03-02", service: "刘刚", enabled: true, groupCapacity: 20 },
  { id: "FLM004", project: "蜂乐码", wechat: "FLM004", city: "广州", createdAt: "2026-03-18", service: "陈明", enabled: true, groupCapacity: 20 },
  { id: "FLP001", project: "蜂乐玛PRO会员", wechat: "FLP001", city: "北京", createdAt: "2026-01-06", service: "吴思远", enabled: true, groupCapacity: 20 },
  { id: "FLP002", project: "蜂乐玛PRO会员", wechat: "FLP002", city: "上海", createdAt: "2026-02-10", service: "林小燕", enabled: true, groupCapacity: 20 },
  { id: "FLE001", project: "蜂乐玛体验官", wechat: "FLE001", city: "广州", createdAt: "2026-01-21", service: "刘刚", enabled: true, groupCapacity: 20 },
  { id: "FLE002", project: "蜂乐玛体验官", wechat: "FLE002", city: "成都", createdAt: "2026-02-06", service: "陈明", enabled: true, groupCapacity: 20 },
];

export const defaultGroupTypeRules: GroupTypeRule[] = projectGroupRules["蜂乐码"];

export function buildGroupCode(typeCode: string, city: string, sequence: number) {
  const region = regionCodes[city] || "X";
  return `${typeCode.toUpperCase()}${region}${sequence}`;
}

export function buildGroupName(project: string, type: string, city: string, sequence: number) {
  return `${project}${type}${city}${sequence}群`;
}

export function pickWechatAccount(project: string, city: string, usedGroupCount: Record<string, number>) {
  const candidates = wechatAccounts
    .filter(account => account.project === project && account.enabled && (account.city === city || city === "全国"))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return candidates.find(account => (usedGroupCount[account.id] || 0) < account.groupCapacity) || null;
}
