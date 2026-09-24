export type RoleGroup = "company" | "agent";
export type PlatformRoleCode = "D1" | "D2" | "D3" | "D4" | "D5";
export type ConfigPermission = "view" | "edit" | "publish" | "rollback";
export type ApprovalMode = "platform_review" | "agent_first_review";
export type ConfigStatus = "draft" | "published" | "scheduled";

export type PresetRoleRules = {
  permissions: string[];
  ownershipRules: string[];
  recruitableRoleCodes: PlatformRoleCode[];
  configurable: boolean;
};

export type OperatingRoleParameters = {
  commissionRate: number;
  recruitmentLimit: number;
  approvalMode: ApprovalMode;
  upgradeThresholds: Record<string, number>;
  warningThresholds: Record<string, number>;
};

export type PlatformRole = {
  code: PlatformRoleCode;
  group: RoleGroup;
  name: string;
  description: string;
  parentCode?: PlatformRoleCode;
  preset: PresetRoleRules;
  operating: OperatingRoleParameters;
};

export type PlatformConfigVersion = {
  version: string;
  status: ConfigStatus;
  createdBy: string;
  createdAt: string;
  effectiveAt: string;
  affectedModules: string[];
  changeSummary: string;
  rollbackFrom?: string;
};

export type PlatformModeConfig = {
  mode: string;
  presetVersion: string;
  operatingVersion: string;
  effectiveAt: string;
  roles: PlatformRole[];
  permissions: Record<"platformAdmin" | PlatformRoleCode, ConfigPermission[]>;
  versions: PlatformConfigVersion[];
};

export const memberLevelOptions = ["游客", "体验官", "PRO会员", "VIP", "黑金"] as const;
export const agentLevelOptions = ["一级代理", "二级代理", "三级代理"] as const;

export const platformRoleOptions: PlatformRoleCode[] = ["D1", "D2", "D3", "D4", "D5"];

export const platformRoles: PlatformRole[] = [
  {
    code: "D1",
    group: "company",
    name: "创始人",
    description: "负责平台战略、核心规则和经营方向。",
    preset: {
      permissions: ["查看平台配置", "查看全局经营数据", "管理平台治理"],
      ownershipRules: ["平台规则归属公司", "可查看公司角色与代理角色全量规则"],
      recruitableRoleCodes: ["D2", "D3"],
      configurable: false,
    },
    operating: {
      commissionRate: 0,
      recruitmentLimit: 0,
      approvalMode: "platform_review",
      upgradeThresholds: {},
      warningThresholds: { pendingReview: 10, lowStock: 20, pendingFulfillment: 15 },
    },
  },
  {
    code: "D2",
    group: "company",
    name: "核心合伙人",
    description: "参与平台核心经营与业务协同。",
    parentCode: "D1",
    preset: {
      permissions: ["查看平台配置", "查看公司经营数据", "参与业务协同"],
      ownershipRules: ["遵循公司平台规则", "不改变代理与团长归属关系"],
      recruitableRoleCodes: ["D3"],
      configurable: false,
    },
    operating: {
      commissionRate: 0,
      recruitmentLimit: 0,
      approvalMode: "platform_review",
      upgradeThresholds: { performance: 80 },
      warningThresholds: { pendingReview: 10, lowStock: 20, pendingFulfillment: 15 },
    },
  },
  {
    code: "D3",
    group: "company",
    name: "事业合伙人",
    description: "负责事业单元的经营协同与业务发展。",
    parentCode: "D2",
    preset: {
      permissions: ["查看平台配置", "查看适用经营数据", "协同业务发展"],
      ownershipRules: ["遵循公司平台规则", "不改变代理与团长归属关系"],
      recruitableRoleCodes: ["D4"],
      configurable: false,
    },
    operating: {
      commissionRate: 0,
      recruitmentLimit: 0,
      approvalMode: "platform_review",
      upgradeThresholds: { performance: 80 },
      warningThresholds: { pendingReview: 10, lowStock: 20, pendingFulfillment: 15 },
    },
  },
  {
    code: "D4",
    group: "agent",
    name: "分公司负责人",
    description: "负责代理业务、库存经营和团长招募管理。",
    parentCode: "D3",
    preset: {
      permissions: ["查看自身业务规则", "招募团长", "管理库存与履约", "处理团长初审"],
      ownershipRules: ["团长直属归属代理", "代理库存负责订单发货与售后", "成交订单自动路由至上级代理库存"],
      recruitableRoleCodes: ["D5"],
      configurable: false,
    },
    operating: {
      commissionRate: 0.15,
      recruitmentLimit: 50,
      approvalMode: "agent_first_review",
      upgradeThresholds: { monthlyOrders: 100, activeCaptains: 20 },
      warningThresholds: { pendingReview: 5, lowStock: 20, pendingFulfillment: 10 },
    },
  },
  {
    code: "D5",
    group: "agent",
    name: "分公司合伙人",
    description: "负责授权范围内的团长协作与推广执行。",
    parentCode: "D4",
    preset: {
      permissions: ["查看自身适用规则", "协作团长推广", "查看订单履约状态"],
      ownershipRules: ["团长直属归属代理", "团长负责社群运营与成交", "团长获得销售佣金"],
      recruitableRoleCodes: [],
      configurable: false,
    },
    operating: {
      commissionRate: 0.1,
      recruitmentLimit: 20,
      approvalMode: "agent_first_review",
      upgradeThresholds: { monthlyOrders: 30, activeCaptains: 8 },
      warningThresholds: { pendingReview: 3, lowStock: 10, pendingFulfillment: 5 },
    },
  },
];

export const defaultPlatformModeConfig: PlatformModeConfig = {
  mode: "一人公司社群经营模式",
  presetVersion: "preset-1.0.0",
  operatingVersion: "ops-1.0.0",
  effectiveAt: "2026-09-23 00:00:00",
  roles: platformRoles,
  permissions: {
    platformAdmin: ["view", "edit", "publish", "rollback"],
    D1: ["view", "edit", "publish", "rollback"],
    D2: ["view"],
    D3: ["view"],
    D4: ["view"],
    D5: ["view"],
  },
  versions: [
    {
      version: "ops-1.0.0",
      status: "published",
      createdBy: "平台初始化",
      createdAt: "2026-09-23 00:00:00",
      effectiveAt: "2026-09-23 00:00:00",
      affectedModules: ["角色体系", "团长招募", "库存履约", "佣金结算"],
      changeSummary: "上线预置 D1-D5 角色规则与运营参数。",
    },
  ],
};

export const memberLevelForRank = (rank: number) =>
  memberLevelOptions[[2, 2, 1, 0, 1][rank - 1] ?? 0];

export const getPlatformRole = (code: PlatformRoleCode) =>
  platformRoles.find((role) => role.code === code) ?? platformRoles[0];

export const canConfigurePlatformMode = (
  identity: "platformAdmin" | PlatformRoleCode,
  hasD1ConfigPermission = false,
) => identity === "platformAdmin" || (identity === "D1" && hasD1ConfigPermission);

export const getRoleGroupLabel = (group: RoleGroup) =>
  group === "company" ? "公司角色" : "代理角色";
