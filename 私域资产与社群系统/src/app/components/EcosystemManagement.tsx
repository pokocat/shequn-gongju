import { useEffect, useState } from "react";
import { ChevronRight, Globe, Layers, Zap, TrendingUp, Plus, Settings, ArrowRight, Package, LayoutDashboard, CheckCircle, X, Save, ShieldCheck, MessageSquare, Eye, EyeOff, Clock, Building2, Users, UsersRound, Workflow, SlidersHorizontal, AlertTriangle, Radio, Phone, UserPlus, Filter, Share2, ThumbsUp, ThumbsDown, Search, Download, ChevronDown, ChevronUp, Square, CheckSquare, History, MapPin, ArrowLeftRight, XCircle, Check, RotateCcw, Info, FileSpreadsheet, MoreHorizontal, Pencil, UserCheck, Activity } from "lucide-react";
import { getGroupRulesForProject, type GroupTypeRule } from "../data/projectGroupRules";
import { getCommunityScopeKey, registerScopeRules, saveScopeRules, useCommunityData } from "../data/communityDataStore";
import { useTools, useAccounts, useInvites, useApprovals, useProjectContext } from "../App";
import type { CommunicationTool } from "../data/communicationTools";
import type { IdentityRole, SystemAccount, ScopeTypeLabelMap, BindingStatus, AccountOperation } from "../data/accountTypes";
import { roleKeyMeta, buildScopeTypeLabelMap, mockAccounts as defaultAccounts, bindingStatusMeta, availableProjects } from "../data/accountTypes";
import type { InviteStatus, InviteRecord } from "../data/inviteRecords";
import { inviteStatusMeta } from "../data/inviteRecords";
import { createApproval } from "../data/approvalTypes";
import InviteDrawer from "./InviteDrawer";
import InviteReviewDrawer from "./InviteReviewDrawer";
import ProjectCommunitySystem from "./ProjectCommunitySystem";
import { S, useThemeSingleton } from "../theme";
import { memberLevelOptions } from "../data/levelConfig";
import ChannelFlow from "./ChannelFlow";
// ─── 四层架构定义（工厂函数，counts 动态联动） ────────────────
type TierCounts = { eco: number; saas: number; platforms: number; projects: number; users: number; groups: number };

export function getEcosystemContext(activeTier: string, activePlatformName: string | null) {
  const labels: Record<string, string> = {
    overview: "超级生态",
    super: "超级生态",
    eco: "生态",
    saas: "SaaS 合作伙伴",
    platform: "平台",
  };
  const tierLabel = labels[activeTier] ?? labels.overview;
  const path = activeTier === "super" || activeTier === "overview" ? ["行业生态", "超级生态"] : ["行业生态", tierLabel];
  if (activeTier === "platform" && activePlatformName) path.push(activePlatformName);
  return {
    label: activeTier === "platform" && activePlatformName ? `平台 · ${activePlatformName}` : tierLabel,
    path,
  };
}

export function getPlatformOwnerLabel(platform: { partner?: string; saas?: string }) {
  return platform.partner || platform.saas || "直属超级生态";
}

export function getPlatformsForEco<T extends { eco: string }>(platformList: T[], ecoName: string) {
  return platformList.filter(platform => platform.eco === ecoName);
}

export function getPlatformsForSaas<T extends { eco: string; saas?: string; partner?: string }>(platformList: T[], saasName: string, ecoName?: string) {
  return platformList.filter(platform =>
    (!ecoName || platform.eco === ecoName) &&
    (platform.saas === saasName || platform.partner === saasName)
  );
}

export function getDirectPlatforms<T extends { eco: string; saas?: string; partner?: string }>(platformList: T[], ecoName: string) {
  return getPlatformsForEco(platformList, ecoName).filter(platform => !platform.saas && !platform.partner);
}

export function buildPlatformCreateDefaults(eco: string, saas = "") {
  return { eco, saas };
}

type OrganizationCodeType = "super" | "eco" | "saas" | "platform" | "project";

const organizationCodePrefixes: Record<OrganizationCodeType, string> = {
  super: "SE",
  eco: "ECO",
  saas: "SAS",
  platform: "PLT",
  project: "PRJ",
};

const organizationCodeCounters: Record<OrganizationCodeType, number> = {
  super: 0,
  eco: 0,
  saas: 0,
  platform: 0,
  project: 0,
};

export function formatOrganizationCode(type: OrganizationCodeType, sequence: number) {
  return `${organizationCodePrefixes[type]}-${String(sequence).padStart(4, "0")}`;
}

export function getNextOrganizationCode(type: OrganizationCodeType, existingCodes: string[] = []) {
  const prefix = `${organizationCodePrefixes[type]}-`;
  const highestExisting = existingCodes.reduce((highest, code) => {
    if (!code.startsWith(prefix)) return highest;
    const sequence = Number(code.slice(prefix.length));
    return Number.isFinite(sequence) ? Math.max(highest, sequence) : highest;
  }, 0);
  organizationCodeCounters[type] = Math.max(organizationCodeCounters[type], highestExisting) + 1;
  return formatOrganizationCode(type, organizationCodeCounters[type]);
}

export const SUPER_ECOSYSTEM_CODE = formatOrganizationCode("super", 1);

function getCodeForNewRecord(type: Exclude<OrganizationCodeType, "super">, records: Array<{ code: string }>) {
  return getNextOrganizationCode(type, records.map(record => record.code));
}

function getIdentityAccounts(
  accounts: SystemAccount[],
  roleKeys: IdentityRole["roleKey"][],
  scopeType: IdentityRole["scopeType"],
  scopeId: string,
) {
  return accounts.filter(account => account.identities.some(identity => roleKeys.includes(identity.roleKey) && identity.scopeType === scopeType && identity.scopeIds.includes(scopeId)));
}

function getIdentityRoleLabel(roleKeys: IdentityRole["roleKey"][]) {
  return roleKeys.map(roleKey => roleKeyMeta[roleKey].label).join(" / ");
}

function buildTiers(c: TierCounts) {
  return [
    {
      id: "super",
      level: 1,
      label: "超级生态",
      icon: Zap,
      desc: "最顶层的生态体系，统一管理所有下属生态、SaaS 合作伙伴、平台和资源。拥有全局数据视角和最高权限。",
      role: "平台创始人 / 超级生态管理员",
      count: 1,
      metrics: [
        { label: "下属生态数", value: String(c.eco) },
        { label: "SaaS 合作伙伴数", value: String(c.saas) },
        { label: "平台数",    value: String(c.platforms) },
        { label: "项目总数",   value: String(c.projects) },
      ],
    },
    {
      id: "eco",
      level: 2,
      label: "生态",
      icon: Globe,
      desc: "按行业垂直划分的生态体系，如健康医药美业、宠物、知识付费、教育等。每个生态聚焦特定行业场景，下辖多个 SaaS 合作伙伴和资源池，形成行业闭环。",
      role: "生态负责人 / 联合创始人",
      count: c.eco,
      metrics: [
        { label: "下属 SaaS 合作伙伴", value: String(c.saas) },
        { label: "招募平台",    value: String(c.platforms) },
        { label: "生态会员",    value: c.users.toLocaleString() },
        { label: "月营收",      value: "¥84万" },
      ],
    },
    {
      id: "saas",
      level: 3,
      label: "SaaS 合作伙伴",
      icon: Package,
      desc: "生态下的 SaaS 合作伙伴，负责发展多个平台并提供能力与运营支持。",
      role: "SaaS 合作伙伴负责人 / SaaS 合作伙伴运营",
      count: c.saas,
      metrics: [
        { label: "旗下平台", value: String(c.platforms) },
        { label: "下辖项目", value: String(c.projects) },
        { label: "平台用户", value: c.users.toLocaleString() },
        { label: "运营群组", value: String(c.groups) },
      ],
    },
    {
      id: "platform",
      level: 4,
      label: "平台",
      icon: Building2,
      desc: "由 SaaS 合作伙伴发展的运营实体，每个平台管理下辖多个运营项目。拥有独立的运营团队、资源池和运营数据视角，获得上层合作伙伴的能力与运营支持。",
      role: "平台管理员 / 平台运营",
      count: c.platforms,
      metrics: [
        { label: "下辖项目数", value: String(c.projects) },
        { label: "平台总用户",  value: c.users.toLocaleString() },
        { label: "平台总群组",  value: String(c.groups) },
        { label: "平台总营收",  value: "¥84万" },
      ],
    },
  ];
}

// ─── 生态列表数据（按行业划分） ─────────────────────────────
type CompanyInfo = {
  name?: string; creditCode?: string; legalPerson?: string; contactName?: string;
  contactPhone?: string; region?: string; bankName?: string; bankAccount?: string;
};
const ecosystems = [
  { id: 1, code: "ECO-0001", name: "健康医药美业生态", desc: "大健康、医药、医美、美业综合生态，整合营养、运动、医疗、皮肤、美容多赛道", platforms: 4, projects: 10, members: 3870, revenue: "¥51万/月", status: "主力生态", company: { name: "健康美业（杭州）科技有限公司", creditCode: "91330108MA2HJKL12B", legalPerson: "陈宇航", contactName: "林清瑶", contactPhone: "13800000002", region: "浙江省/杭州市", bankName: "招商银行杭州分行", bankAccount: "6225 8817 1234 5678" } as CompanyInfo },
  { id: 2, code: "ECO-0002", name: "宠物生态",        desc: "宠物食品、用品、医疗、洗护、寄养等宠物全产业链私域生态",                       platforms: 1, projects: 3,  members: 900,  revenue: "¥2万/月",  status: "成长中", company: { name: "宠趣（上海）宠物产业有限公司", creditCode: "91310115MA1K9PQ34X", legalPerson: "周明", contactName: "刘倩", contactPhone: "13900000011", region: "上海市/浦东新区", bankName: "中国工商银行上海分行", bankAccount: "6222 0210 9876 5432" } as CompanyInfo },
  { id: 3, code: "ECO-0003", name: "知识付费生态",    desc: "在线课程、训练营、会员社群、咨询陪跑等知识付费闭环",                           platforms: 1, projects: 3,  members: 1500, revenue: "¥16万/月", status: "成长中", company: { name: "知学（北京）教育科技有限公司", creditCode: "91110108MA01ABCD56", legalPerson: "孙婉清", contactName: "李梦华", contactPhone: "13800000009", region: "北京市/海淀区", bankName: "中国建设银行北京分行", bankAccount: "6217 0010 0011 2233" } as CompanyInfo },
  { id: 4, code: "ECO-0004", name: "教育生态",        desc: "在线教育、实体培训、教研、家校互通等教育场景生态",                             platforms: 2, projects: 8,  members: 2050, revenue: "¥15万/月", status: "孵化中", company: { name: "育才（成都）教育服务有限公司", creditCode: "91510104MA6XYZ7890", legalPerson: "郑雨桐", contactName: "赵文轩", contactPhone: "13800000003", region: "四川省/成都市", bankName: "中国农业银行成都分行", bankAccount: "6228 4807 0055 6677" } as CompanyInfo },
  { id: 5, code: "ECO-0005", name: "OPC超级生态", desc: "主理人项目、数字内容与产业服务的综合运营生态", platforms: 1, projects: 9, members: 0, revenue: "待接入", status: "主力生态" },
];

// ─── SaaS 合作伙伴列表 ───────────────────────────────────────
const saasPlatforms = [
  { id: 1, code: "SAS-0001", name: "健康产业发展伙伴",    eco: "健康医药美业生态", desc: "负责发展健康产业相关平台，提供会员运营、账号资产、社群运营与项目管理能力。", platformCount: 2, projects: 4, users: 2200, groups: 30, status: "运营中", isCurrent: true  },
  { id: 2, code: "SAS-0002", name: "知识教育发展伙伴",    eco: "知识付费生态",     desc: "负责发展知识教育类平台，提供课程运营、学员互动、认证与权益支持。",                             platformCount: 1, projects: 3, users: 1500, groups: 18, status: "运营中", isCurrent: false },
  { id: 3, code: "SAS-0003", name: "代理渠道发展伙伴",    eco: "健康医药美业生态", desc: "负责发展代理分销类平台，提供代理招募、培训、佣金与权益管理支持。",                               platformCount: 1, projects: 3, users: 900,  groups: 14, status: "运营中", isCurrent: false },
  { id: 4, code: "SAS-0004", name: "教育学习发展伙伴",    eco: "教育生态",         desc: "负责发展教育学习类平台，提供学习路径、积分激励、学习报告与权益支持。",                           platformCount: 1, projects: 4, users: 1400, groups: 20, status: "测试中", isCurrent: false },
  { id: 5, code: "SAS-0005", name: "教育内容发展伙伴",    eco: "教育生态",         desc: "负责发展教育内容类平台，提供直播、回放管理与内容运营支持。",                                         platformCount: 1, projects: 4, users: 650,  groups: 9,  status: "开发中", isCurrent: false },
  { id: 6, code: "SAS-0006", name: "城市运营发展伙伴",    eco: "健康医药美业生态", desc: "负责发展城市运营类平台，提供城市站长招募、资源分配与区域运营支持。",                               platformCount: 1, projects: 3, users: 770,  groups: 16, status: "测试中", isCurrent: false },
  { id: 7, code: "SAS-0007", name: "宠物产业发展伙伴",    eco: "宠物生态",         desc: "负责发展宠物产业分销类平台，提供渠道分销、佣金计算与结算支持。",                           platformCount: 1, projects: 3, users: 900,  groups: 12, status: "运营中", isCurrent: false },
];

// ─── 平台列表数据 ─────────────────────────────────────────────
const platforms = [
  { id: 1, code: "PLT-0001", name: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", desc: "聚域旗下主平台，承载 OPC 生态项目与平台运营", projects: 9, users: 0, groups: 0, teachers: 0, revenue: "待接入", status: "运营中", dataStatus: "待接入" },
];

// ─── 项目列表（归属平台） ─────────────────────────────────────
type ProjectTier = { name: string; rule: string; group: string; service: string; benefits?: string };
type ProjectRecord = {
  id: number; code: string; name: string; platform: string; partner: string; saas?: string; eco: string; users: number; groups: number; teacher: string; cities: string[]; revenue: string; status: string;
  enterpriseWx: string; enterpriseProjectCount: number; tiers: ProjectTier[];
  groupTypes: GroupTypeRule[];
  mechanism: { welcome: string; cadence: string; route: string; escalation: string };
  visibility: Record<string, boolean>;
};
const defaultTierRules = [
  ["游客", "注册或关注即可", "游客引流群", "基础响应"],
  ["体验官", "完成体验官报名", "体验官群", "48小时响应"],
  ["PRO会员", "购买 PRO 会员", "PRO会员群", "24小时响应"],
  ["VIP", "购买 VIP 会员", "VIP 私享群", "专属运营"],
  ["黑金", "邀请制或年度黑金资格", "黑金私董群", "专属顾问"],
] as const;
const defaultTiers: ProjectTier[] = memberLevelOptions.map((name, index) => {
  const configured = defaultTierRules.find(rule => rule[0] === name) || defaultTierRules[index];
  return { name, rule: configured[1], group: configured[2], service: configured[3], benefits: index <= 1 ? "新人资料包、基础活动资格" : index === 2 ? "会员专属课、社群优先服务、积分" : "专属活动、优先服务、定制权益" };
});
const projects: ProjectRecord[] = [
  { id: 1, code: "PRJ-0001", name: "V001 军师", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "正式项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("V001 军师"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 2, code: "PRJ-0002", name: "AI超级广告公司", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI超级广告公司"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 3, code: "PRJ-0003", name: "AI艺人孵化", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI艺人孵化"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 4, code: "PRJ-0004", name: "AI数字资产平台", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI数字资产平台"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 5, code: "PRJ-0005", name: "AI大健康", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI大健康"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 6, code: "PRJ-0006", name: "AI知识付费", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI知识付费"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 7, code: "PRJ-0007", name: "AI教育", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI教育"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 8, code: "PRJ-0008", name: "AI明星艺人授权", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "招商项目", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI明星艺人授权"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
  { id: 9, code: "PRJ-0009", name: "AI企业礼品采购", platform: "主理人公社", partner: "聚域", saas: "聚域", eco: "OPC超级生态", users: 0, groups: 0, teacher: "待配置", cities: ["全国"], revenue: "待接入", status: "规划中", enterpriseWx: "待配置", enterpriseProjectCount: 0, tiers: defaultTiers, groupTypes: getGroupRulesForProject("AI企业礼品采购"), mechanism: { welcome: "待配置", cadence: "待配置", route: "待配置", escalation: "待配置" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": true } },
];

const statusCfg: Record<string, { bg: string; color: string }> = {
  "主力项目": { bg: S.accent,            color: "#ffffff" },
  "主力生态": { bg: S.accent,            color: "#ffffff" },
  "增长中":   { bg: S.accent,            color: "#ffffff" },
  "成长中":   { bg: S.accentLight,       color: "#1e293b" },
  "稳定运营": { bg: "#f1f5f9",           color: "#475569" },
  "孵化中":   { bg: "#f1f5f9",           color: "#475569" },
  "季节性":   { bg: "#f1f5f9",           color: "#475569" },
  "生产中":   { bg: S.accent,            color: "#ffffff" },
  "测试中":   { bg: "#3b82f6",           color: "#ffffff" },
  "开发中":   { bg: "#f1f5f9",           color: "#475569" },
};

// ─── 架构流程图 ───────────────────────────────────────────────
function ArchitectureDiagram({ tiers, activeTier, onSelect }: { tiers: ReturnType<typeof buildTiers>; activeTier: string; onSelect: (id: string) => void }) {
  const objectTiers = tiers.filter(tier => tier.id !== "super");
  return (
    <div id="ecosystem-tier-navigation" className="min-w-0 max-w-full overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
      <div className="grid min-h-[52px] grid-cols-2 overflow-hidden sm:grid-cols-4" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <button type="button" aria-current="page" className="col-span-2 flex min-w-0 items-center gap-2.5 px-3 py-2.5 text-left sm:col-span-1" style={{ background: "#1e293b", color: S.accent, borderRight: `1px solid ${S.border}` }} onClick={() => onSelect("super")}>
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-[11px] font-bold" style={{ background: "rgba(204,255,0,0.16)", color: S.accent, borderRadius: S.radiusSm }}><Zap size={13} /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold">超级生态</span>
            <span className="mt-0.5 block truncate text-[10px] font-mono" style={{ color: "rgba(204,255,0,0.76)" }}>全局生态入口</span>
          </span>
          {activeTier === "super" && <Check size={14} className="flex-shrink-0" />}
        </button>
        {objectTiers.map((tier, index) => {
          const isActive = activeTier === tier.id;
          const Icon = tier.icon;
          return (
            <button key={tier.id} type="button" aria-pressed={isActive} className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 text-left transition-colors" style={{ background: isActive ? "#1e293b" : S.surface, color: isActive ? S.accent : S.text, borderRight: index < objectTiers.length - 1 ? `1px solid ${S.border}` : "none" }} onClick={() => onSelect(tier.id)}>
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-[11px] font-bold" style={{ background: isActive ? "rgba(204,255,0,0.16)" : "#f1f5f9", color: isActive ? S.accent : S.textSec, borderRadius: S.radiusSm }}><Icon size={13} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold">{tier.label}</span>
                <span className="mt-0.5 block truncate text-[10px] font-mono" style={{ color: isActive ? "rgba(204,255,0,0.76)" : S.muted }}>{tier.count} 个对象</span>
              </span>
              {isActive && <Check size={14} className="flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 超级生态视图 ─────────────────────────────────────────────
type CreateResourceKind = "ecosystem" | "saas" | "platform" | "project";

function getCreateResourceKinds(role: string): CreateResourceKind[] {
  if (role === "超级生态管理员") return ["ecosystem", "saas", "platform"];
  if (["生态负责人", "生态COO"].includes(role)) return ["saas", "platform"];
  if (["SaaS 合作伙伴负责人", "SaaS 合作伙伴运营"].includes(role)) return ["platform"];
  if (["平台管理员", "平台运营", "项目负责人", "区域运营"].includes(role)) return ["project"];
  return [];
}

const createResourceLabels: Record<CreateResourceKind, string> = {
  ecosystem: "新建生态",
  saas: "新建 SaaS 合作伙伴",
  platform: "新建平台",
  project: "新建项目",
};

function CreateResourceMenu({
  role,
  onSelect,
}: {
  role: string;
  onSelect: (kind: CreateResourceKind) => void;
}) {
  const [open, setOpen] = useState(false);
  const kinds = getCreateResourceKinds(role);
  if (kinds.length === 0) return null;
  return <div className="relative">
    <button type="button" aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-1 border px-2.5 py-1.5 text-xs font-bold" style={{ background: S.accentLight, color: S.textSec, borderColor: S.borderMed, borderRadius: S.radiusSm }} onClick={() => setOpen(value => !value)}><Plus size={12} />新建<ChevronDown size={12} /></button>
    {open && <div role="menu" className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded border p-1 shadow-lg" style={{ background: S.surface, borderColor: S.border }}>
      {kinds.map(kind => <button key={kind} type="button" role="menuitem" className="flex w-full items-center px-2.5 py-2 text-left text-xs font-bold" style={{ color: S.text }} onClick={() => { setOpen(false); onSelect(kind); }}>{createResourceLabels[kind]}</button>)}
    </div>}
  </div>;
}

type EcoItem = {
  id: number; code: string; name: string; desc: string; platforms: number; projects: number;
  members: number; revenue: string; status: string; company?: CompanyInfo;
};
type SaasItem = typeof saasPlatforms[number];
type PlatformItem = typeof platforms[number];
type WorkbenchPanel = "overview" | "accounts" | "billing" | "platforms" | "projects" | "reports" | "superSettings" | "ecoSettings" | "projectOverview" | "platformChannels" | "projectChannels" | "projectApps" | "projectCustomers" | "projectOrders" | "teamPermissions" | "projectReports";

export function getIdentityConfigTarget(role: string) {
  if (role === "超级生态管理员") {
    return { nodeType: "super" as const, panel: "superSettings" as WorkbenchPanel };
  }
  if (role === "生态负责人" || role === "生态COO") {
    return { nodeType: "eco" as const, panel: "ecoSettings" as WorkbenchPanel };
  }
  if (role === "SaaS 合作伙伴负责人" || role === "SaaS 合作伙伴运营") {
    return { nodeType: "saas" as const, panel: "overview" as WorkbenchPanel };
  }
  if (role === "平台管理员" || role === "平台运营") {
    return { nodeType: "platform" as const, panel: "overview" as WorkbenchPanel };
  }
  if (role === "项目负责人" || role === "区域运营" || role === "客服" || role === "老师") {
    return { nodeType: "project" as const, panel: "projectOverview" as WorkbenchPanel };
  }
  return { nodeType: "eco" as const, panel: "overview" as WorkbenchPanel };
}

function SuperView({
  ecoList, setEcoList, saasList, setSaasList, platformList, setPlatformList,
  accounts, setAccounts, subs, setSubs, bills, setBills,
  projectList, setProjectList, tools,
  role,
  onOpenPlatforms, onOpenProjects, onOpenReports,
}: {
  ecoList: EcoItem[]; setEcoList: React.Dispatch<React.SetStateAction<EcoItem[]>>;
  saasList: SaasItem[]; setSaasList: React.Dispatch<React.SetStateAction<SaasItem[]>>;
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  accounts: SystemAccount[]; setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>;
  subs: Subscription[]; setSubs: React.Dispatch<React.SetStateAction<Subscription[]>>;
  bills: BillRecord[]; setBills: React.Dispatch<React.SetStateAction<BillRecord[]>>;
  projectList: ProjectRecord[];
  setProjectList: React.Dispatch<React.SetStateAction<ProjectRecord[]>>;
  tools: CommunicationTool[];
  role: string;
  onOpenPlatforms: (ecoName: string) => void;
  onOpenProjects: (ecoName: string) => void;
  onOpenReports: () => void;
}) {
  const maskAccount = (acc?: string) => {
    if (!acc) return "—";
    const digits = acc.replace(/\s+/g, "");
    return digits.length >= 4 ? `尾号 ${digits.slice(-4)}` : acc;
  };
  const total = { ecosystems: ecoList.length, saas: saasList.length, platforms: platformList.length, projects: platformList.reduce((n, p) => n + p.projects, 0), users: platformList.reduce((n, p) => n + p.users, 0), revenue: "¥84万", groups: platformList.reduce((n, p) => n + p.groups, 0) };
  const [selected, setSelected] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(() => ecoList[0]?.id ?? null);
  const [superExpanded, setSuperExpanded] = useState(true);
  const [expandedSaas, setExpandedSaas] = useState<Set<number>>(() => new Set());
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(() => new Set());
  const [selectedNode, setSelectedNode] = useState<{ type: "super" | "eco" | "saas" | "platform" | "project" | "direct"; id: number }>(() => ({ type: "super", id: 0 }));
  const [editingAccountUid, setEditingAccountUid] = useState<string | null>(null);
  const [accountDraft, setAccountDraft] = useState({ name: "", email: "", phone: "" });
  const [createEcoOpen, setCreateEcoOpen] = useState(false);
  const [createPlatformOpen, setCreatePlatformOpen] = useState(false);
  const [platformCreateContext, setPlatformCreateContext] = useState<{ eco?: string; saas?: string } | null>(null);
  const [createSaasInline, setCreateSaasInline] = useState(false);
  const [toast, setToast] = useState("");
  const [activeWorkbenchPanel, setActiveWorkbenchPanel] = useState<WorkbenchPanel>("overview");
  const [teamTab, setTeamTab] = useState<"roles" | "resources">("roles");
  const [treeWidth, setTreeWidth] = useState(280);
  const [isResizingTree, setIsResizingTree] = useState(false);
  const selectedEco = ecoList.find(e => e.id === selected) ?? ecoList[0];
  const superIdentityAccounts = getIdentityAccounts(accounts, ["super_admin"], "global", "*");
  const [ecoDraft, setEcoDraft] = useState({ name: "", desc: "", status: "", companyName: "", legalPerson: "", contactName: "", contactPhone: "", region: "" });
  useEffect(() => {
    if (!isResizingTree) return;
    const handlePointerMove = (event: PointerEvent) => {
      const nextWidth = Math.min(420, Math.max(220, event.clientX - 24));
      setTreeWidth(nextWidth);
    };
    const stopResizing = () => setIsResizingTree(false);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingTree]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsResizingTree(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!selectedEco) return;
    setEcoDraft({
      name: selectedEco.name,
      desc: selectedEco.desc,
      status: selectedEco.status,
      companyName: selectedEco.company?.name || "",
      legalPerson: selectedEco.company?.legalPerson || "",
      contactName: selectedEco.company?.contactName || "",
      contactPhone: selectedEco.company?.contactPhone || "",
      region: selectedEco.company?.region || "",
    });
  }, [selectedEco]);
  const selectedProject = selectedNode.type === "project" ? projectList.find(project => project.id === selectedNode.id) : undefined;
          const isSuperSelected = selectedNode.type === "super";
  const { setApprovals } = useApprovals();
  const selectEco = (id: number) => {
    setSelected(id);
    setSelectedNode({ type: "eco", id });
    setExpanded(current => current === id ? null : id);
    setActiveWorkbenchPanel("overview");
    setEditingAccountUid(null);
    setCreateSaasInline(false);
  };
  const selectNode = (node: { type: "saas" | "platform" | "project" | "direct"; id: number }, ecoId: number) => {
    setSelected(ecoId);
    setSelectedNode(node);
    setExpanded(ecoId);
    setEditingAccountUid(null);
    setActiveWorkbenchPanel("overview");
    setCreateSaasInline(false);
  };
  const openPlatformCreate = (context: { eco?: string; saas?: string }) => {
    setPlatformCreateContext(context);
    setCreatePlatformOpen(true);
  };
  useEffect(() => {
    const target = getIdentityConfigTarget(role);
    const firstSaas = saasList[0];
    const firstPlatform = platformList[0];
    const firstProject = projectList[0];
    if (target.nodeType === "super") {
      setSelected(null);
      setSelectedNode({ type: "super", id: 0 });
    } else if (target.nodeType === "eco" && ecoList[0]) {
      setSelected(ecoList[0].id);
      setSelectedNode({ type: "eco", id: ecoList[0].id });
    } else if (target.nodeType === "saas" && firstSaas) {
      setSelected(firstSaas.eco ? ecoList.find(eco => eco.name === firstSaas.eco)?.id ?? ecoList[0]?.id ?? null : ecoList[0]?.id ?? null);
      setSelectedNode({ type: "saas", id: firstSaas.id });
    } else if (target.nodeType === "platform" && firstPlatform) {
      setSelected(ecoList.find(eco => eco.name === firstPlatform.eco)?.id ?? ecoList[0]?.id ?? null);
      setSelectedNode({ type: "platform", id: firstPlatform.id });
    } else if (target.nodeType === "project" && firstProject) {
      setSelected(ecoList.find(eco => eco.name === firstProject.eco)?.id ?? ecoList[0]?.id ?? null);
      setSelectedNode({ type: "project", id: firstProject.id });
    }
    setActiveWorkbenchPanel(target.panel);
  }, [role]);
  const openMyConfig = () => {
    const target = getIdentityConfigTarget(role);
    const firstSaas = saasList[0];
    const firstPlatform = platformList[0];
    const firstProject = projectList[0];
    const ecoId = target.nodeType === "super" ? null : target.nodeType === "saas" ? ecoList.find(eco => eco.name === firstSaas?.eco)?.id : target.nodeType === "platform" ? ecoList.find(eco => eco.name === firstPlatform?.eco)?.id : target.nodeType === "project" ? ecoList.find(eco => eco.name === firstProject?.eco)?.id : ecoList[0]?.id;
    setSelected(ecoId ?? null);
    if (target.nodeType === "super") setSelectedNode({ type: "super", id: 0 });
    if (target.nodeType === "eco") setSelectedNode({ type: "eco", id: ecoId ?? 0 });
    if (target.nodeType === "saas" && firstSaas) setSelectedNode({ type: "saas", id: firstSaas.id });
    if (target.nodeType === "platform" && firstPlatform) setSelectedNode({ type: "platform", id: firstPlatform.id });
    if (target.nodeType === "project" && firstProject) setSelectedNode({ type: "project", id: firstProject.id });
    setActiveWorkbenchPanel(target.panel);
  };
  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-3 lg:items-stretch" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
        <div className="min-w-0 lg:grid lg:gap-1" style={{ gridTemplateColumns: `minmax(220px, ${treeWidth}px) 4px minmax(0, 1fr)` }}>
          <section className="min-w-0 space-y-2 rounded p-3" aria-label="生态树" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <div className="mb-2 rounded" style={{ background: selectedNode.type === "super" ? S.accentLight : S.surface, border: `1px solid ${selectedNode.type === "super" ? "rgba(204,255,0,.55)" : S.border}` }}>
            <div className="flex min-w-0 flex-nowrap items-center gap-2 p-3">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { setSelected(null); setSelectedNode({ type: "super", id: 0 }); setActiveWorkbenchPanel("overview"); }} aria-expanded={superExpanded}>
                <span className="flex items-center gap-2"><Zap size={14} className="flex-shrink-0" style={{ color: S.accent }} /><span className="min-w-0"><span className="block truncate text-xs font-bold" style={{ color: S.text }}>超级生态</span><span className="mt-0.5 block truncate text-[10px] font-mono" style={{ color: S.muted }}>全局管理所有行业生态 · {ecoList.length} 个下属生态</span></span></span>
              </button>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <button type="button" title="超级生态配置" aria-label="配置超级生态" className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { setSelected(null); setSelectedNode({ type: "super", id: 0 }); setActiveWorkbenchPanel("superSettings"); }}><Settings size={13} /></button>
                <button type="button" title="查看旗下生态" aria-label="查看超级生态旗下生态" className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { setSelected(null); setSelectedNode({ type: "super", id: 0 }); setSuperExpanded(true); setActiveWorkbenchPanel("overview"); }}><LayoutDashboard size={13} /></button>
                <button type="button" title="新建生态" aria-label="在超级生态下新建生态" className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.accent, color: S.onPrimary }} onClick={() => setCreateEcoOpen(true)}><Plus size={13} /></button>
              </div>
              <button type="button" aria-label={`${superExpanded ? "收起" : "展开"}超级生态下属生态`} aria-expanded={superExpanded} className="flex h-7 w-7 flex-shrink-0 items-center justify-center" style={{ color: S.muted }} onClick={() => setSuperExpanded(current => !current)}><ChevronDown size={15} style={{ transform: superExpanded ? "rotate(180deg)" : "none" }} /></button>
            </div>
          </div>
          {superExpanded && <div className="space-y-1 pl-3" style={{ borderLeft: `1px solid ${S.borderMed}` }}>
          {ecoList.map(e => {
            const ecoSaas = saasList.filter(s => s.eco === e.name);
            const ecoPlatforms = platformList.filter(p => p.eco === e.name);
            const directPlatforms = ecoPlatforms.filter(p => !p.partner && !p.saas);
            const orphanPlatforms = ecoPlatforms.filter(platform => !ecoSaas.some(saas => platform.saas === saas.name || platform.partner === saas.name));
            const projectCount = ecoPlatforms.reduce((count, platform) => count + platform.projects, 0);
            const isSelected = selected === e.id;
            const isExpanded = expanded === e.id;
            const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => setter(current => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id); else next.add(id);
              return next;
            });
            const renderPlatform = (platform: PlatformItem, ecoId: number) => {
              const platformProjects = projectList.filter(project => project.platform === platform.name && project.eco === e.name);
              const platformSelected = selectedNode.type === "platform" && selectedNode.id === platform.id;
              const platformExpanded = expandedPlatforms.has(platform.id);
              return <div key={platform.id} className="relative ml-8 pl-4" style={{ borderLeft: `1px solid ${S.borderMed}` }}>
                <div className="relative flex min-w-0 items-center gap-2 py-1.5" style={{ borderTop: `1px solid ${S.borderMed}` }}>
                  <span className="absolute -left-[17px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full" style={{ background: platform.status === "运营中" ? "#22c55e" : "#ef4444", boxShadow: `0 0 0 2px ${S.surface}` }} />
                  <button type="button" className="min-w-0 flex-1 truncate text-left text-[11px] font-bold" style={{ color: platformSelected ? S.text : S.textSec }} onClick={() => selectNode({ type: "platform", id: platform.id }, ecoId)}>{platform.name}</button>
                  <div className="flex flex-shrink-0 items-center gap-1"><button type="button" title="平台配置" aria-label={`配置${platform.name}`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { selectNode({ type: "platform", id: platform.id }, ecoId); setActiveWorkbenchPanel("overview"); }}><Settings size={13} /></button><button type="button" title="渠道与流量配置" aria-label={`配置${platform.name}渠道与流量`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { selectNode({ type: "platform", id: platform.id }, ecoId); setActiveWorkbenchPanel("platformChannels"); }}><Share2 size={13} /></button><button type="button" title="查看项目" aria-label={`查看${platform.name}项目`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { selectNode({ type: "platform", id: platform.id }, ecoId); setActiveWorkbenchPanel("projects"); }}><LayoutDashboard size={13} /></button><button type="button" title="新建项目" aria-label={`为${platform.name}新建项目`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.accent, color: S.onPrimary }} onClick={() => setToast(`${platform.name}的新建项目入口暂未开放`)}><Plus size={13} /></button></div>
                  <button type="button" aria-label={`${platformExpanded ? "收起" : "展开"}${platform.name}项目`} aria-expanded={platformExpanded} className="flex h-5 w-5 flex-shrink-0 items-center justify-center" style={{ color: S.muted }} onClick={event => { event.stopPropagation(); toggleSet(setExpandedPlatforms, platform.id); }}><ChevronDown size={13} style={{ transform: platformExpanded ? "rotate(180deg)" : "none" }} /></button>
                </div>
                {platformExpanded && platformProjects.map(project => {
                  const projectSelected = selectedNode.type === "project" && selectedNode.id === project.id;
                  return <button key={project.id} type="button" className="relative ml-4 flex w-[calc(100%-1rem)] min-w-0 items-center gap-2 border-t py-1.5 pl-4 text-left" style={{ borderColor: S.borderMed, color: projectSelected ? S.text : S.textSec }} onClick={() => { selectNode({ type: "project", id: project.id }, ecoId); setActiveWorkbenchPanel("projectOverview"); }}><span className="absolute -left-[1px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full" style={{ background: projectSelected ? S.accent : S.borderMed }} /><span className="min-w-0 flex-1 truncate text-[10px]">{project.name}</span></button>;
                })}
              </div>;
            };
            return <div key={e.id} className="min-w-0 overflow-hidden" style={{ background: isSelected ? S.accentLight : S.surface, border: `1px solid ${isSelected ? "rgba(204,255,0,.55)" : S.border}`, borderRadius: S.radius }}>
              <div className="flex min-w-0 flex-nowrap items-center gap-2 p-3">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: isSelected ? S.accent : S.muted }} />
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => selectEco(e.id)} aria-expanded={isExpanded}><span className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-bold" style={{ color: S.text }}>{e.name}</span></span><span className="mt-0.5 block truncate text-[10px] font-mono" style={{ color: S.muted }}>{ecoSaas.length} SaaS · {ecoPlatforms.length || e.platforms} 平台 · {projectCount || e.projects} 项目</span></button>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <button type="button" title="生态配置" aria-label={`配置${e.name}`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { setSelectedNode({ type: "eco", id: e.id }); setSelected(e.id); setActiveWorkbenchPanel("ecoSettings"); }}><Settings size={13} /></button>
                  <button type="button" title="查看旗下平台" aria-label={`查看${e.name}旗下平台`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { setSelectedNode({ type: "eco", id: e.id }); setSelected(e.id); setActiveWorkbenchPanel("platforms"); }}><LayoutDashboard size={13} /></button>
                  <button type="button" title="新建旗下平台" aria-label={`为${e.name}新建平台`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.accent, color: S.onPrimary }} onClick={() => openPlatformCreate(buildPlatformCreateDefaults(e.name))}><Plus size={13} /></button>
                </div>
                <button type="button" aria-label={`${isExpanded ? "收起" : "展开"}${e.name}`} aria-expanded={isExpanded} className="flex h-7 w-7 flex-shrink-0 items-center justify-center" style={{ color: S.muted }} onClick={() => setExpanded(current => current === e.id ? null : e.id)}><ChevronDown size={15} style={{ transform: isExpanded ? "rotate(180deg)" : "none" }} /></button>
              </div>
              {isExpanded && <div className="space-y-1 border-t px-3 pb-3 pt-2" style={{ borderColor: S.border }}>
                {ecoSaas.map(saas => {
                  const saasSelected = selectedNode.type === "saas" && selectedNode.id === saas.id;
                  const saasExpanded = expandedSaas.has(saas.id);
                  const saasPlatforms = ecoPlatforms.filter(platform => platform.saas === saas.name || platform.partner === saas.name);
                  return <div key={saas.id} className="relative ml-3 pl-4" style={{ borderLeft: `1px solid ${S.borderMed}` }}><div className="relative flex min-w-0 flex-nowrap items-center gap-2 border-t py-2" style={{ borderColor: S.borderMed }}><span className="absolute -left-[17px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full" style={{ background: saas.status === "运营中" ? "#22c55e" : "#ef4444", boxShadow: `0 0 0 2px ${S.surface}` }} /><button type="button" className="min-w-0 flex-1 truncate text-left text-xs font-bold" style={{ color: saasSelected ? S.text : S.textSec }} onClick={() => selectNode({ type: "saas", id: saas.id }, e.id)}>{saas.name}</button><div className="flex flex-shrink-0 items-center gap-1"><button type="button" title="SaaS 配置" aria-label={`配置${saas.name}`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { selectNode({ type: "saas", id: saas.id }, e.id); setActiveWorkbenchPanel("overview"); }}><Settings size={13} /></button><button type="button" title="查看旗下平台" aria-label={`查看${saas.name}旗下平台`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.bg, color: S.text }} onClick={() => { selectNode({ type: "saas", id: saas.id }, e.id); setActiveWorkbenchPanel("platforms"); }}><LayoutDashboard size={13} /></button><button type="button" title="新建旗下平台" aria-label={`为${saas.name}新建平台`} className="flex h-7 w-7 items-center justify-center rounded" style={{ background: S.accent, color: S.onPrimary }} onClick={() => openPlatformCreate(buildPlatformCreateDefaults(e.name, saas.name))}><Plus size={13} /></button></div><button type="button" aria-label={`${saasExpanded ? "收起" : "展开"}${saas.name}平台`} aria-expanded={saasExpanded} className="flex h-5 w-5 flex-shrink-0 items-center justify-center" style={{ color: S.muted }} onClick={event => { event.stopPropagation(); toggleSet(setExpandedSaas, saas.id); }}><ChevronDown size={13} style={{ transform: saasExpanded ? "rotate(180deg)" : "none" }} /></button></div>{saasExpanded && saasPlatforms.map(platform => renderPlatform(platform, e.id))}</div>;
                })}
                {directPlatforms.length > 0 && <div className="relative ml-3 pl-4" style={{ borderLeft: `1px solid ${S.borderMed}` }}><div className="relative flex items-center gap-2 border-t py-2" style={{ borderColor: S.borderMed }}><span className="absolute -left-[17px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full" style={{ background: S.accent, boxShadow: `0 0 0 2px ${S.surface}` }} /><button type="button" className="min-w-0 flex-1 truncate text-left text-xs font-bold" style={{ color: S.text }} onClick={() => selectNode({ type: "direct", id: e.id }, e.id)}>直属超级生态</button><span className="flex-shrink-0 text-[10px] font-mono" style={{ color: S.muted }}>{directPlatforms.length} 个平台</span></div>{directPlatforms.map(platform => renderPlatform(platform, e.id))}</div>}
                {orphanPlatforms.map(platform => renderPlatform(platform, e.id))}
                {ecoSaas.length === 0 && directPlatforms.length === 0 && orphanPlatforms.length === 0 && <div className="ml-3 py-1 text-[10px] font-mono" style={{ color: S.muted }}>暂未配置二级对象</div>}
              </div>}
            </div>;
          })}
          </div>}
          </section>
          <div className="hidden items-stretch lg:flex" aria-hidden="true">
            <button type="button" aria-label="调整生态树宽度" title="拖动调整生态树宽度" className="h-full w-1 cursor-col-resize" onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setIsResizingTree(true); }} />
          </div>
           {!isSuperSelected && selectedEco ? (() => {
          const ecoSaas = saasList.filter(s => s.eco === selectedEco.name);
          const ecoPlatforms = platformList.filter(p => p.eco === selectedEco.name);
          const directPlatforms = ecoPlatforms.filter(p => !p.partner && !p.saas);
          const selectedSaas = selectedNode.type === "saas" ? saasList.find(s => s.id === selectedNode.id && s.eco === selectedEco.name) : undefined;
          const selectedPlatform = selectedNode.type === "platform" ? platformList.find(platform => platform.id === selectedNode.id && platform.eco === selectedEco.name) : undefined;
          const visibleProjects = projectList.filter(project => project.eco === selectedEco.name && (!selectedSaas || project.saas === selectedSaas.name || project.partner === selectedSaas.name) && (!selectedPlatform || project.platform === selectedPlatform.name));
          const projectCount = visibleProjects.length || ecoPlatforms.reduce((count, platform) => count + platform.projects, 0);
          const orphanPlatforms = ecoPlatforms.filter(platform => !ecoSaas.some(saas => platform.saas === saas.name || platform.partner === saas.name));
          const showDirect = selectedNode.type === "direct" && selectedNode.id === selectedEco.id;
          const panelTitle = selectedProject?.name || selectedPlatform?.name || selectedSaas?.name || (showDirect ? "直属超级生态" : selectedEco.name);
          const panelDesc = selectedProject ? `归属于 ${selectedProject.platform}，集中管理项目入口、流量来源和业务应用。` : selectedPlatform?.desc || selectedSaas?.desc || (showDirect ? "由超级生态管理员直接管理的平台集合，无需经过 SaaS 合作伙伴。" : selectedEco.desc);
          const identityConfig = isSuperSelected
            ? { roleKeys: ["super_admin"] as IdentityRole["roleKey"][], scopeType: "global" as const, scopeId: "*" }
            : selectedNode.type === "eco"
            ? { roleKeys: ["eco_leader", "eco_coo"] as IdentityRole["roleKey"][], scopeType: "eco" as const, scopeId: `eco-${selectedNode.id}` }
            : selectedNode.type === "saas"
              ? { roleKeys: ["saas_owner", "saas_op"] as IdentityRole["roleKey"][], scopeType: "saas" as const, scopeId: `saas-${selectedNode.id}` }
              : selectedNode.type === "platform"
                ? { roleKeys: ["platform_admin", "platform_op"] as IdentityRole["roleKey"][], scopeType: "platform" as const, scopeId: `platform-${selectedNode.id}` }
                : selectedNode.type === "project"
                  ? { roleKeys: ["project_owner", "regional_op", "service"] as IdentityRole["roleKey"][], scopeType: "project" as const, scopeId: `project-${selectedNode.id}` }
                  : { roleKeys: ["super_admin"] as IdentityRole["roleKey"][], scopeType: "global" as const, scopeId: "*" };
          const identityAccounts = getIdentityAccounts(accounts, identityConfig.roleKeys, identityConfig.scopeType, identityConfig.scopeId);
          const accountToEdit = accounts.find(account => account.uid === editingAccountUid);
          const saveAccount = () => {
            if (!accountToEdit || !accountDraft.name.trim() || !accountDraft.email.trim()) return;
            const now = new Date();
            const time = now.toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-");
            setAccounts(list => list.map(account => account.uid === accountToEdit.uid ? { ...account, name: accountDraft.name.trim(), email: accountDraft.email.trim(), phone: accountDraft.phone.trim(), operationLogs: [{ id: `edit-${Date.now()}`, type: "edit", actor: "超级生态管理员", time, summary: "在生态详情中更新账号信息" }, ...account.operationLogs] } : account));
            setEditingAccountUid(null);
            setToast("账号信息已保存");
          };
          const saveEcoSettings = () => {
            const previousName = selectedEco.name;
            const name = ecoDraft.name.trim();
            if (!name) {
              setToast("生态名称不能为空");
              return;
            }
            setEcoList(list => list.map(eco => eco.id === selectedEco.id ? {
              ...eco,
              name,
              desc: ecoDraft.desc.trim(),
              status: ecoDraft.status,
              company: {
                ...(eco.company || {}),
                name: ecoDraft.companyName.trim(),
                legalPerson: ecoDraft.legalPerson.trim(),
                contactName: ecoDraft.contactName.trim(),
                contactPhone: ecoDraft.contactPhone.trim(),
                region: ecoDraft.region.trim(),
              },
            } : eco));
            if (name !== previousName) {
              setSaasList(list => list.map(item => item.eco === previousName ? { ...item, eco: name } : item));
              setPlatformList(list => list.map(item => item.eco === previousName ? { ...item, eco: name } : item));
              setProjectList(list => list.map(item => item.eco === previousName ? { ...item, eco: name } : item));
            }
            setToast("生态配置已保存");
            setActiveWorkbenchPanel("overview");
          };
          const toggleAccountStatus = (account: SystemAccount) => {
            const nextStatus = account.status === "active" ? "disabled" : "active";
            const now = new Date();
            const time = now.toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-");
            setAccounts(list => list.map(item => item.uid === account.uid ? { ...item, status: nextStatus, operationLogs: [{ id: `${nextStatus}-${Date.now()}`, type: nextStatus === "active" ? "enable" : "disable", actor: "超级生态管理员", time, summary: `${nextStatus === "active" ? "启用" : "停用"}账号` }, ...item.operationLogs] } : item));
            setToast(nextStatus === "active" ? "账号已启用" : "账号已停用");
          };
          const PanelIcon = selectedProject ? Workflow : selectedPlatform ? Building2 : selectedSaas ? Package : showDirect ? Zap : Globe;
          const scopeLabel = selectedProject ? `项目 · ${selectedProject.platform}` : selectedPlatform ? `平台 · ${selectedPlatform.name}` : selectedSaas ? `SaaS 合作伙伴 · ${selectedSaas.name}` : showDirect ? "直属平台范围" : `生态 · ${selectedEco.name}`;
          const recentLogs = identityAccounts.flatMap(account => account.operationLogs || []).slice(0, 3);
          const statItems = selectedSaas
            ? [["旗下平台", selectedSaas.platformCount, LayoutDashboard], ["下辖项目", selectedSaas.projects, Workflow], ["系统用户", selectedSaas.users.toLocaleString(), UsersRound], ["活跃群组", selectedSaas.groups, MessageSquare]]
            : showDirect
              ? [["直属平台", directPlatforms.length, Building2], ["项目", directPlatforms.reduce((n, p) => n + p.projects, 0), Workflow], ["用户", directPlatforms.reduce((n, p) => n + p.users, 0).toLocaleString(), UsersRound], ["群组", directPlatforms.reduce((n, p) => n + p.groups, 0), MessageSquare]]
              : selectedPlatform
                ? [["下辖项目", selectedPlatform.projects, Workflow], ["平台用户", selectedPlatform.users.toLocaleString(), UsersRound], ["运营群组", selectedPlatform.groups, MessageSquare], ["月营收", selectedPlatform.revenue, TrendingUp]]
                : [["SaaS伙伴", ecoSaas.length, Package], ["平台", ecoPlatforms.length || selectedEco.platforms, Building2], ["项目", projectCount || selectedEco.projects, Workflow], ["生态会员", selectedEco.members.toLocaleString(), UsersRound]];
          return <section className="min-w-0 space-y-3 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }} aria-label="生态详情">
            <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-2.5"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}><PanelIcon size={17} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-base font-bold" style={{ color: S.text }}>{panelTitle}</span><span className="px-2 py-1 text-[10px] font-bold" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>当前作用域</span></div><div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono" style={{ color: S.muted }}><span className="font-bold" style={{ color: S.text }}>{scopeLabel}</span><span>·</span><span>{identityAccounts.length} 个身份账号</span></div><div className="mt-1 text-xs leading-relaxed" style={{ color: S.muted }}>{panelDesc}</div></div></div><button type="button" title="更多对象操作" aria-label="更多对象操作" className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded" style={{ color: S.muted, background: S.bg }} onClick={() => setToast(`${panelTitle}的更多操作暂未开放`)}><MoreHorizontal size={15} /></button></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{statItems.map(([label, value, Icon]) => <div key={label as string} className="flex min-w-0 items-center gap-2 px-2.5 py-2.5" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Icon size={14} style={{ color: S.accent }} /><div className="min-w-0"><div className="truncate text-sm font-bold" style={{ color: S.text }}>{value as string | number}</div><div className="truncate text-[10px] font-mono" style={{ color: S.muted }}>{label as string}</div></div></div>)}</div>
            <div className="flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: S.border }} aria-label="对象配置菜单">{selectedProject ? <>{[["projectOverview", "项目概览", LayoutDashboard], ["projectChannels", "渠道与流量", Share2], ["projectApps", "应用与小程序", Package], ["projectCustomers", "客户与权益", UsersRound], ["projectOrders", "订单与履约", Workflow], ["teamPermissions", "团队与权限", ShieldCheck], ["projectReports", "数据报表", TrendingUp]].map(([key, label, Icon]) => <button key={key as string} type="button" title={label as string} aria-label={label as string} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === key ? S.accent : S.bg, color: activeWorkbenchPanel === key ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel(key as WorkbenchPanel)}><Icon size={12} />{label as string}</button>)}</> : <><button type="button" title="账号管理" aria-label="账号管理" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "accounts" ? S.accent : S.bg, color: activeWorkbenchPanel === "accounts" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("accounts")}><UsersRound size={12} />账号管理</button>{selectedPlatform && <button type="button" title="渠道与流量配置" aria-label="渠道与流量配置" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "platformChannels" ? S.accent : S.bg, color: activeWorkbenchPanel === "platformChannels" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("platformChannels")}><Share2 size={12} />渠道与流量配置</button>}<button type="button" title="团队与权限" aria-label="团队与权限" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "teamPermissions" ? S.accent : S.bg, color: activeWorkbenchPanel === "teamPermissions" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => { setTeamTab("roles"); setActiveWorkbenchPanel("teamPermissions"); }}><ShieldCheck size={12} />团队与权限</button><button type="button" title="生态配置" aria-label="生态配置" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "ecoSettings" ? S.accent : S.bg, color: activeWorkbenchPanel === "ecoSettings" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("ecoSettings")}><Settings size={12} />生态配置</button><button type="button" title="商业与计费" aria-label="商业与计费" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "billing" ? S.accent : S.bg, color: activeWorkbenchPanel === "billing" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("billing")}><TrendingUp size={12} />商业与计费</button>{(selectedSaas || selectedEco) && <button type="button" title="查看旗下平台" aria-label="查看旗下平台" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "platforms" ? S.accent : S.bg, color: activeWorkbenchPanel === "platforms" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("platforms")}><LayoutDashboard size={12} />旗下平台</button>}{(selectedSaas || selectedPlatform || showDirect || selectedEco) && <button type="button" title="查看项目" aria-label="查看项目" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "projects" ? S.accent : "#1e293b", color: activeWorkbenchPanel === "projects" ? S.onPrimary : S.accent, border: `1px solid ${activeWorkbenchPanel === "projects" ? S.accent : "#1e293b"}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("projects")}><Workflow size={12} />项目列表</button>}{!selectedPlatform && getCreateResourceKinds(role).includes("saas") && <button type="button" title="新建 SaaS 合作伙伴" aria-label="新建 SaaS 合作伙伴" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: S.bg, color: S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setCreateSaasInline(true)}><Plus size={12} />新建 SaaS</button>}{selectedEco && <button type="button" title="查看数据报表" aria-label="查看数据报表" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "reports" ? S.accent : S.bg, color: activeWorkbenchPanel === "reports" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("reports")}><TrendingUp size={12} />数据报表</button>}</>}</div>
            {createSaasInline && <CreateSaasInlineForm ecoList={ecoList} defaultEco={selectedEco.name} onClose={() => setCreateSaasInline(false)} onCreate={data => {
              setSaasList(list => [...list, { id: Date.now(), code: getCodeForNewRecord("saas", list), ...data, platformCount: 0, projects: 0, users: 0, groups: 0, status: "孵化中", isCurrent: false }]);
              const approval = createApproval("saas_onboard", { title: `SaaS 合作伙伴入驻：${data.name}（${data.eco}）`, submitter: "超级生态管理员", description: `在${data.eco}下新建 SaaS 合作伙伴「${data.name}」，${data.desc || "无描述"}`, detail: { SaaS合作伙伴名称: data.name, 所属生态: data.eco, 描述: data.desc || "—" }, payload: { type: "saas_onboard", name: data.name, eco: data.eco, desc: data.desc } });
              setApprovals(prev => [approval, ...prev]);
              setCreateSaasInline(false);
              setToast("已创建并推送审批单");
            }} />}
            {activeWorkbenchPanel !== "overview" && <div className="space-y-3 rounded border p-3" style={{ borderColor: S.border, background: S.bg }} aria-label="当前工作区内容"><div className="flex items-center justify-between gap-2"><div className="text-xs font-bold" style={{ color: S.text }}>{activeWorkbenchPanel === "ecoSettings" ? "生态配置" : activeWorkbenchPanel === "platformChannels" ? "渠道与流量配置" : activeWorkbenchPanel === "projectOverview" ? "项目概览" : activeWorkbenchPanel === "projectChannels" ? "渠道与流量" : activeWorkbenchPanel === "projectApps" ? "应用与小程序" : activeWorkbenchPanel === "projectCustomers" ? "客户与权益" : activeWorkbenchPanel === "projectOrders" ? "订单与履约" : activeWorkbenchPanel === "teamPermissions" ? "团队与权限" : activeWorkbenchPanel === "projectReports" ? "数据报表" : activeWorkbenchPanel === "accounts" ? "账号管理" : activeWorkbenchPanel === "billing" ? "商业与计费" : activeWorkbenchPanel === "platforms" ? "旗下平台" : activeWorkbenchPanel === "projects" ? "项目列表" : "数据报表"}</div><button type="button" title="返回对象概览" aria-label="返回对象概览" className="px-2 py-1 text-[10px]" style={{ color: S.muted }} onClick={() => setActiveWorkbenchPanel("overview")}>返回概览</button></div>{activeWorkbenchPanel === "ecoSettings" && <div className="space-y-3"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>生态基本信息</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>配置生态名称、定位、状态和公司主体信息。</div></div><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>生态名称<input name="eco-name" aria-label="生态名称" value={ecoDraft.name} onChange={event => setEcoDraft(draft => ({ ...draft, name: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>生态状态<select name="eco-status" aria-label="生态状态" value={ecoDraft.status} onChange={event => setEcoDraft(draft => ({ ...draft, status: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal">{["运营中", "测试中", "开发中", ...(ecoDraft.status && !["运营中", "测试中", "开发中"].includes(ecoDraft.status) ? [ecoDraft.status] : [])].map(status => <option key={status}>{status}</option>)}</select></label></div><label className="block space-y-1 text-[10px] font-bold" style={{ color: S.text }}>生态简介<textarea name="eco-desc" aria-label="生态简介" value={ecoDraft.desc} onChange={event => setEcoDraft(draft => ({ ...draft, desc: event.target.value }))} className="mt-1 min-h-20 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><div className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="mb-2 text-xs font-bold" style={{ color: S.text }}>公司主体</div><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>公司名称<input name="eco-company-name" aria-label="公司名称" value={ecoDraft.companyName} onChange={event => setEcoDraft(draft => ({ ...draft, companyName: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>法人<input name="eco-legal-person" aria-label="法人" value={ecoDraft.legalPerson} onChange={event => setEcoDraft(draft => ({ ...draft, legalPerson: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>对接人<input name="eco-contact-name" aria-label="对接人" value={ecoDraft.contactName} onChange={event => setEcoDraft(draft => ({ ...draft, contactName: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><label className="space-y-1 text-[10px] font-bold" style={{ color: S.text }}>联系电话<input name="eco-contact-phone" aria-label="联系电话" value={ecoDraft.contactPhone} onChange={event => setEcoDraft(draft => ({ ...draft, contactPhone: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label><label className="space-y-1 text-[10px] font-bold sm:col-span-2" style={{ color: S.text }}>所在地区<input name="eco-region" aria-label="所在地区" value={ecoDraft.region} onChange={event => setEcoDraft(draft => ({ ...draft, region: event.target.value }))} className="mt-1 w-full rounded border px-2.5 py-2 text-xs font-normal" /></label></div></div><div className="flex justify-end gap-2"><button type="button" className="px-3 py-2 text-xs" style={{ color: S.muted }} onClick={() => setActiveWorkbenchPanel("overview")}>取消</button><button type="button" className="flex items-center gap-1 px-3 py-2 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={saveEcoSettings}><Save size={13} />保存生态配置</button></div></div>}{false && <div className="space-y-3"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>团队与权限</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前节点直接决定账号、角色、员工和服务资源的数据范围。</div><div className="mt-1 text-[10px] font-mono" style={{ color: S.accent }}>全局</div></div><div className="flex gap-1.5 border-b pb-2" style={{ borderColor: S.border }}><button type="button" className="px-2.5 py-1.5 text-[11px] font-bold" style={{ background: teamTab === "roles" ? S.accent : S.bg, color: teamTab === "roles" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setTeamTab("roles")}>角色与权限</button><button type="button" className="px-2.5 py-1.5 text-[11px] font-bold" style={{ background: teamTab === "resources" ? S.accent : S.bg, color: teamTab === "resources" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setTeamTab("resources")}>服务资源与员工</button></div>{teamTab === "roles" ? <div className="space-y-1.5"><div className="grid gap-2 sm:grid-cols-3">{[["作用域", "全局"], ["可见账号", superIdentityAccounts.length], ["权限状态", "正常"]].map(([label, value]) => <div key={label as string} className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{value as string | number}</div></div>)}</div>{superIdentityAccounts.map(account => <div key={account.uid} className="flex items-center justify-between rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{account.email} · 超级生态管理员</div></div><span className="text-[10px]" style={{ color: account.status === "active" ? S.accent : S.warning }}>{account.status === "active" ? "已启用" : "待处理"}</span></div>)}</div> : <div className="space-y-1.5">{tools.filter(tool => superIdentityAccounts.some(account => account.uid === tool.boundAccountId)).map(tool => <div key={tool.id} className="flex items-center justify-between rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{tool.name}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{tool.type} · 全局范围</div></div><span className="text-[10px]" style={{ color: tool.riskLevel === "normal" ? S.accent : S.warning }}>{tool.riskLevel === "normal" ? "正常" : "需关注"}</span></div>)}</div>}</div>}{activeWorkbenchPanel === "accounts" && <div className="space-y-2">{identityAccounts.length === 0 ? <div className="rounded px-3 py-3 text-[11px]" style={{ background: S.surface, color: S.muted }}>当前对象暂无身份账号，请通过当前对象的账号配置完成分配。</div> : identityAccounts.map(account => <div key={account.uid} className="flex flex-wrap items-center justify-between gap-2 rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{account.email} · {account.status === "active" ? "已启用" : "已停用"}</div></div><div className="flex gap-2"><button type="button" title="编辑账号" aria-label={`编辑${account.name}账号`} className="flex items-center gap-1 text-[10px] font-bold" style={{ color: S.text }} onClick={() => { setEditingAccountUid(account.uid); setAccountDraft({ name: account.name, email: account.email, phone: account.phone }); }}><Pencil size={12} />编辑</button><button type="button" title={account.status === "active" ? "停用账号" : "启用账号"} aria-label={`${account.status === "active" ? "停用" : "启用"}${account.name}账号`} className="flex items-center gap-1 text-[10px]" style={{ color: S.muted }} onClick={() => toggleAccountStatus(account)}>{account.status === "active" ? "停用" : "启用"}</button></div></div>)}</div>}{activeWorkbenchPanel === "billing" && (() => { const billingName = selectedPlatform?.name || selectedSaas?.name || selectedEco.name; const sub = subs.find(item => item.subscriberName === billingName); const bill = bills.find(item => item.payerName === billingName); return <div className="grid gap-2 sm:grid-cols-2"><div className="rounded px-3 py-2" style={{ background: S.surface }}><div className="text-[10px]" style={{ color: S.muted }}>当前套餐</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{sub?.planKey || "未配置套餐"}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>{sub ? `${sub.status} · 到期 ${sub.endAt}` : "暂无订阅记录"}</div></div><div className="rounded px-3 py-2" style={{ background: S.surface }}><div className="text-[10px]" style={{ color: S.muted }}>最近账单</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{bill ? `¥${bill.amountCny.toLocaleString()}` : "暂无账单"}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>{bill ? `${bill.status} · ${bill.dueAt}` : "当前对象暂无待处理账单"}</div></div></div>; })()}{activeWorkbenchPanel === "platformChannels" && selectedPlatform && <div className="space-y-3"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>{selectedPlatform.name} · 平台渠道配置</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前平台统一配置渠道账号、来源识别、流量归因和默认分配规则，供下属项目选择使用。</div></div><ChannelFlow mode="config" platformName={selectedPlatform.name} embedded /></div>}{activeWorkbenchPanel === "projectOverview" && selectedProject && <div className="grid gap-2 sm:grid-cols-2">{[["项目平台", selectedProject.platform], ["项目状态", selectedProject.status], ["覆盖地区", selectedProject.cities.join("、")], ["企业微信", selectedProject.enterpriseWx]].map(([label, value]) => <div key={label} className="rounded px-3 py-2" style={{ background: S.surface }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{value}</div></div>)}</div>}{activeWorkbenchPanel === "projectChannels" && selectedProject && <div className="space-y-2"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>项目渠道与流量</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>配置用户从哪里进入项目，以及进入后如何识别和分配。</div></div>{[["微信小店", "待绑定", "商品与会员入口"], ["抖音", "待绑定", "短视频与直播流量"], ["小红书", "待绑定", "内容种草入口"], ["公众号 / 视频号", "待绑定", "内容与私域承接"]].map(([name, status, desc]) => <div key={name} className="flex flex-wrap items-center justify-between gap-2 rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{name}</div><div className="text-[10px]" style={{ color: S.muted }}>{desc}</div></div><span className="px-2 py-1 text-[10px] font-bold" style={{ background: S.bg, color: S.muted, borderRadius: S.radiusSm }}>{status}</span></div>)}<div className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="text-xs font-bold" style={{ color: S.text }}>分配规则</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>按渠道、地区和会员身份分配到项目运营团队，当前规则待配置。</div></div></div>}{activeWorkbenchPanel === "projectApps" && selectedProject && <div className="space-y-2"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>项目应用与小程序</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>小程序是项目应用入口之一，也可以连接订单、会员和企业微信工具。</div></div>{[["会员小程序", "待连接", "会员注册、权益和服务入口"], ["活动报名小程序", "待连接", "活动发布与报名转化"], ["订单管理应用", "待连接", "订单、履约与售后协同"], ["企业微信助手", "待授权", "客户承接与运营提醒"]].map(([name, status, desc]) => <div key={name} className="flex flex-wrap items-center justify-between gap-2 rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{name}</div><div className="text-[10px]" style={{ color: S.muted }}>{desc}</div></div><button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: S.bg, color: S.text, borderRadius: S.radiusSm }} onClick={() => setToast(`${name}连接配置暂未开放`)}>{status}</button></div>)}</div>}{activeWorkbenchPanel === "projectCustomers" && selectedProject && <div className="grid gap-2 sm:grid-cols-3">{[["项目用户", selectedProject.users], ["会员层级", selectedProject.tiers.length], ["权益规则", "待配置"]].map(([label, value]) => <div key={label} className="rounded px-3 py-3" style={{ background: S.surface }}><div className="text-sm font-bold" style={{ color: S.text }}>{value}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>{label}</div></div>)}</div>}{activeWorkbenchPanel === "projectOrders" && selectedProject && <div className="grid gap-2 sm:grid-cols-3">{[["订单总数", "待接入"], ["履约状态", "待接入"], ["售后工单", "待接入"]].map(([label, value]) => <div key={label} className="rounded px-3 py-3" style={{ background: S.surface }}><div className="text-sm font-bold" style={{ color: S.text }}>{value}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>{label}</div></div>)}</div>}{activeWorkbenchPanel === "teamPermissions" && <div className="space-y-3"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>团队与权限</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前节点直接决定账号、角色、员工和服务资源的数据范围。</div><div className="mt-1 text-[10px] font-mono" style={{ color: S.accent }}>{selectedProject ? `项目 · ${selectedProject.name}` : selectedPlatform ? `平台 · ${selectedPlatform.name}` : selectedSaas ? `SaaS 合作伙伴 · ${selectedSaas.name}` : `行业生态 · ${selectedEco.name}`}</div></div><div className="flex gap-1.5 border-b pb-2" style={{ borderColor: S.border }}><button type="button" className="px-2.5 py-1.5 text-[11px] font-bold" style={{ background: teamTab === "roles" ? S.accent : S.bg, color: teamTab === "roles" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setTeamTab("roles")}>角色与权限</button><button type="button" className="px-2.5 py-1.5 text-[11px] font-bold" style={{ background: teamTab === "resources" ? S.accent : S.bg, color: teamTab === "resources" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setTeamTab("resources")}>服务资源与员工</button></div>{teamTab === "roles" && <div className="space-y-2"><div className="grid gap-2 sm:grid-cols-3">{[["作用域", selectedProject ? "项目" : selectedPlatform ? "平台" : selectedSaas ? "SaaS 合作伙伴" : "行业生态"], ["可见账号", identityAccounts.length], ["权限状态", identityAccounts.some(account => account.status !== "active") ? "存在待处理账号" : "正常"]].map(([label, value]) => <div key={label as string} className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{value as string | number}</div></div>)}</div><div className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="mb-2 text-xs font-bold" style={{ color: S.text }}>当前节点适用角色</div><div className="grid gap-1.5 sm:grid-cols-2">{identityConfig.roleKeys.map(roleKey => <div key={roleKey} className="flex items-center justify-between rounded px-2.5 py-2" style={{ background: S.bg }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{roleKeyMeta[roleKey].label}</div><div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>{roleKeyMeta[roleKey].summary}</div></div><span className="text-[10px] font-mono" style={{ color: S.accent }}>{identityConfig.scopeType === "global" ? "全局" : "当前范围"}</span></div>)}</div></div><div className="space-y-1.5">{identityAccounts.map(account => <div key={account.uid} className="flex items-center justify-between gap-2 rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{account.email} · {account.identities.filter(identity => identity.scopeIds.includes(identityConfig.scopeId) || identityConfig.scopeType === "global").map(identity => roleKeyMeta[identity.roleKey].label).join("、") || "已绑定身份"}</div></div><span className="text-[10px]" style={{ color: account.status === "active" ? S.accent : S.warning }}>{account.status === "active" ? "已启用" : "待处理"}</span></div>)}</div></div>}{teamTab === "resources" && <div className="space-y-2"><div className="grid gap-2 sm:grid-cols-3">{[["范围账号", identityAccounts.length], ["已绑定工具", tools.filter(tool => identityAccounts.some(account => account.uid === tool.boundAccountId) || (selectedProject && tool.boundProjectIds.includes(String(selectedProject.id)))).length], ["项目资源", visibleProjects.length]].map(([label, value]) => <div key={label as string} className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{value as string | number}</div></div>)}</div><div className="rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="mb-2 text-xs font-bold" style={{ color: S.text }}>员工与服务资源</div><div className="space-y-1.5">{identityAccounts.length === 0 ? <div className="text-[11px]" style={{ color: S.muted }}>当前范围暂无员工或账号。</div> : identityAccounts.map(account => { const accountTools = tools.filter(tool => tool.boundAccountId === account.uid); return <div key={account.uid} className="flex flex-wrap items-center justify-between gap-2 rounded px-2.5 py-2" style={{ background: S.bg }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>{account.phone || "未填写手机号"} · {accountTools.length} 个服务资源</div></div><span className="text-[10px] font-mono" style={{ color: S.muted }}>{account.projectIds.length ? `${account.projectIds.length} 个项目` : "未分配项目"}</span></div>; })}</div></div><div className="space-y-1.5">{tools.filter(tool => identityAccounts.some(account => account.uid === tool.boundAccountId) || (selectedProject && tool.boundProjectIds.includes(String(selectedProject.id)))).slice(0, 8).map(tool => <div key={tool.id} className="flex items-center justify-between gap-2 rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{tool.name}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{tool.type} · {tool.boundProjectIds.length} 个项目</div></div><span className="text-[10px]" style={{ color: tool.riskLevel === "normal" ? S.accent : S.warning }}>{tool.riskLevel === "normal" ? "正常" : "需关注"}</span></div>)}</div></div>}</div>}{activeWorkbenchPanel === "projectReports" && selectedProject && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[["项目用户", selectedProject.users], ["运营群组", selectedProject.groups], ["会员层级", selectedProject.tiers.length], ["覆盖城市", selectedProject.cities.length]].map(([label, value]) => <div key={label as string} className="rounded px-3 py-2" style={{ background: S.surface }}><div className="text-sm font-bold" style={{ color: S.text }}>{value}</div><div className="text-[10px]" style={{ color: S.muted }}>{label}</div></div>)}</div>}{activeWorkbenchPanel === "platforms" && (() => {
                const platformScope = selectedSaas
                  ? getPlatformsForSaas(ecoPlatforms, selectedSaas.name, selectedEco.name)
                  : getPlatformsForEco(ecoPlatforms, selectedEco.name);
                const scopeTitle = selectedSaas ? `${selectedSaas.name} · 旗下平台` : `${selectedEco.name} · 直属及旗下平台`;
                const createContext = selectedSaas
                  ? buildPlatformCreateDefaults(selectedEco.name, selectedSaas.name)
                  : buildPlatformCreateDefaults(selectedEco.name);
                return <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3 rounded px-3 py-3" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}>
                    <div className="min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{scopeTitle}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>{selectedSaas ? `所属生态：${selectedEco.name}` : "未挂载 SaaS 的平台由超级生态直接管理"}</div></div>
                    <button type="button" className="flex flex-shrink-0 items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => openPlatformCreate(createContext)}><Plus size={12} />新建旗下平台</button>
                  </div>
                  <div className="flex items-center justify-between"><span className="text-[10px] font-mono" style={{ color: S.muted }}>平台数量</span><span className="text-sm font-bold" style={{ color: S.text }}>{platformScope.length}</span></div>
                  {platformScope.length === 0 ? <div className="rounded px-3 py-4 text-center text-[11px]" style={{ background: S.surface, color: S.muted }}>当前范围暂无平台，可从上方新建旗下平台。</div> : <div className="space-y-2">{platformScope.map(platform => <div key={platform.id} className="flex flex-wrap items-center justify-between gap-2 rounded px-3 py-2.5" style={{ background: S.surface, border: `1px solid ${S.border}` }}><div className="min-w-0"><div className="truncate text-xs font-bold" style={{ color: S.text }}>{platform.name}</div><div className="mt-1 text-[10px] font-mono" style={{ color: S.muted }}>{getPlatformOwnerLabel(platform)} · {platform.projects} 个项目</div></div><div className="flex flex-shrink-0 items-center gap-2"><span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: statusCfg[platform.status]?.bg || S.bg, color: statusCfg[platform.status]?.color || S.textSec, borderRadius: S.radiusSm }}>{platform.status}</span><button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: S.bg, color: S.text, borderRadius: S.radiusSm }} onClick={() => { selectNode({ type: "platform", id: platform.id }, selectedEco.id); setActiveWorkbenchPanel("overview"); }}>配置</button></div></div>)}</div>}
                </div>;
              })()}{activeWorkbenchPanel === "projects" && <div className="space-y-1">{projects.filter(project => project.eco === selectedEco.name && (!selectedSaas || project.saas === selectedSaas.name || project.partner === selectedSaas.name) && (!selectedPlatform || project.platform === selectedPlatform.name)).map(project => <div key={project.id} className="flex items-center justify-between gap-3 rounded px-3 py-2" style={{ background: S.surface }}><div className="min-w-0"><span className="block truncate text-xs font-bold" style={{ color: S.text }}>{project.name}</span><span className="text-[10px] font-mono" style={{ color: S.muted }}>{project.platform}</span></div><span className="flex-shrink-0 text-[10px] font-mono" style={{ color: S.muted }}>{project.users.toLocaleString()} 用户 · {project.status}</span></div>)}</div>}{activeWorkbenchPanel === "reports" && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[["平台", ecoPlatforms.length], ["项目", projectCount], ["用户", ecoPlatforms.reduce((total, platform) => total + platform.users, 0).toLocaleString()], ["群组", ecoPlatforms.reduce((total, platform) => total + platform.groups, 0)]].map(([label, value]) => <div key={label as string} className="rounded px-3 py-2" style={{ background: S.surface }}><div className="text-sm font-bold" style={{ color: S.text }}>{value}</div><div className="text-[10px]" style={{ color: S.muted }}>{label}</div></div>)}</div>}</div>}
            <div className="space-y-2 border-t pt-3" style={{ borderColor: S.border }}><div className="flex items-center gap-2 text-xs font-bold" style={{ color: S.text }}><Building2 size={13} />{selectedPlatform ? "平台信息" : selectedSaas ? "合作范围" : showDirect ? "直属平台" : "公司主体"}</div>{selectedPlatform ? <div className="grid gap-y-1 text-[11px] font-mono sm:grid-cols-2"><div><span style={{ color: S.muted }}>所属生态：</span>{selectedPlatform.eco}</div><div><span style={{ color: S.muted }}>合作主体：</span>{getPlatformOwnerLabel(selectedPlatform)}</div><div><span style={{ color: S.muted }}>项目数量：</span>{selectedPlatform.projects} 个</div><div><span style={{ color: S.muted }}>数据状态：</span>{selectedPlatform.dataStatus || "待接入"}</div></div> : selectedSaas ? <div className="grid gap-y-1 text-[11px] font-mono sm:grid-cols-2"><div><span style={{ color: S.muted }}>所属生态：</span>{selectedSaas.eco}</div><div><span style={{ color: S.muted }}>合作状态：</span>{selectedSaas.status}</div><div><span style={{ color: S.muted }}>平台配额：</span>{selectedSaas.platformCount} 个</div><div><span style={{ color: S.muted }}>项目数量：</span>{selectedSaas.projects} 个</div></div> : showDirect ? <div className="space-y-1">{directPlatforms.map(platform => <div key={platform.id} className="flex items-center justify-between gap-2 rounded px-2.5 py-2" style={{ background: S.bg }}><span className="min-w-0 truncate text-xs font-bold" style={{ color: S.text }}>{platform.name}</span><span className="flex-shrink-0 text-[10px] font-mono" style={{ color: S.muted }}>{platform.projects} 项目 · {platform.status}</span></div>)}</div> : selectedEco.company ? <div className="grid gap-y-1 text-[11px] font-mono sm:grid-cols-2"><div><span style={{ color: S.muted }}>名称：</span>{selectedEco.company.name}</div><div><span style={{ color: S.muted }}>法人：</span>{selectedEco.company.legalPerson || "—"}</div><div><span style={{ color: S.muted }}>对接人：</span>{selectedEco.company.contactName || "—"}</div><div><span style={{ color: S.muted }}>所在地：</span>{selectedEco.company.region || "—"}</div></div> : <div className="text-[11px]" style={{ color: S.muted }}>未录入公司主体</div>}</div>
            <div className="space-y-2 border-t pt-3" style={{ borderColor: S.border }}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: S.text }}><History size={13} />运营记录</div><span className="text-[10px] font-mono" style={{ color: S.muted }}>{recentLogs.length ? `最近 ${recentLogs.length} 条` : "暂无记录"}</span></div>{recentLogs.length ? <div className="space-y-1.5">{recentLogs.map((log, index) => <div key={`${log.id}-${index}`} className="flex items-start justify-between gap-3 rounded px-2.5 py-2 text-[10px]" style={{ background: S.bg }}><span className="min-w-0" style={{ color: S.text }}>{log.summary}</span><span className="flex-shrink-0 font-mono" style={{ color: S.muted }}>{log.time}</span></div>)}</div> : <div className="rounded px-2.5 py-2 text-[10px]" style={{ background: S.bg, color: S.muted }}>当前对象暂无账号操作记录</div>}</div>
            <div className="flex items-start gap-2 border-t pt-3" style={{ borderColor: S.border }}><AlertTriangle size={13} className="mt-0.5 flex-shrink-0" style={{ color: S.warning }} /><div className="text-[10px] leading-relaxed" style={{ color: S.muted }}>{identityAccounts.length === 0 ? "当前对象尚未配置身份账号，请先完成账号配置。" : identityAccounts.some(account => account.status !== "active") ? "当前对象存在未启用账号，请检查账号状态。" : "当前对象账号状态正常，无待处理风险。"}</div></div>
            <div className="space-y-2 border-t pt-3" style={{ borderColor: S.border }}>
              <div className="flex items-center justify-between gap-2"><div><div className="text-xs font-bold" style={{ color: S.text }}>身份账号</div><div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>{getIdentityRoleLabel(identityConfig.roleKeys)} · 密码仅显示配置状态</div></div><span className="text-[10px] font-mono" style={{ color: S.muted }}>{identityAccounts.length} 个账号</span></div>
              {identityAccounts.length === 0 ? <div className="rounded px-3 py-3 text-[11px]" style={{ background: S.bg, color: S.muted }}>暂未配置账号</div> : identityAccounts.map(account => <div key={account.uid} className="flex flex-wrap items-center justify-between gap-2 rounded px-2.5 py-2" style={{ background: S.bg, border: `1px solid ${S.border}` }}>
                {editingAccountUid === account.uid ? <div className="space-y-2"><input aria-label="账号姓名" value={accountDraft.name} onChange={event => setAccountDraft(draft => ({ ...draft, name: event.target.value }))} className="w-full rounded border px-2 py-1.5 text-xs" placeholder="姓名" /><input aria-label="账号邮箱" value={accountDraft.email} onChange={event => setAccountDraft(draft => ({ ...draft, email: event.target.value }))} className="w-full rounded border px-2 py-1.5 text-xs" placeholder="邮箱" /><input aria-label="账号手机号" value={accountDraft.phone} onChange={event => setAccountDraft(draft => ({ ...draft, phone: event.target.value }))} className="w-full rounded border px-2 py-1.5 text-xs" placeholder="手机号" /><div className="flex gap-2"><button type="button" className="px-2.5 py-1.5 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={saveAccount}>保存</button><button type="button" className="px-2.5 py-1.5 text-xs" style={{ color: S.muted }} onClick={() => setEditingAccountUid(null)}>取消</button></div></div> : <><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="mt-0.5 truncate text-[10px] font-mono" style={{ color: S.muted }}>{account.email} · {account.phone || "未填写手机号"}</div></div><span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold" style={{ background: account.status === "active" ? S.accent : "#e2e8f0", color: account.status === "active" ? S.onPrimary : S.textSec, borderRadius: S.radiusSm }}>{account.status === "active" ? "启用" : account.status === "disabled" ? "停用" : "待激活"}</span></div><div className="text-[10px]" style={{ color: S.muted }}>{account.identities.find(identity => identity.roleKey === identityConfig.roleKeys[0])?.permissionSummary || account.identities.find(identity => identity.scopeIds.includes(identityConfig.scopeId))?.permissionSummary || "已配置身份权限"}</div><div className="flex flex-wrap gap-2"><button type="button" title="编辑账号" aria-label={`编辑${account.name}账号`} className="flex items-center gap-1 text-[11px] font-bold" style={{ color: S.text }} onClick={() => { setEditingAccountUid(account.uid); setAccountDraft({ name: account.name, email: account.email, phone: account.phone }); }}><Pencil size={12} />编辑账号</button><button type="button" title={account.status === "active" ? "停用账号" : "启用账号"} aria-label={`${account.status === "active" ? "停用" : "启用"}${account.name}账号`} className="flex items-center gap-1 text-[11px]" style={{ color: account.status === "active" ? S.muted : S.accent }} onClick={() => toggleAccountStatus(account)}>{account.status === "active" ? <XCircle size={12} /> : <UserCheck size={12} />}{account.status === "active" ? "停用账号" : "启用账号"}</button></div></>}
              </div>)}
            </div>
          </section>;
        })() : <section className="min-w-0 space-y-3 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }} aria-label="超级生态详情"><div className="flex items-start gap-2.5"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}><Zap size={17} /></span><div><div className="text-base font-bold" style={{ color: S.text }}>超级生态</div><div className="mt-1 text-[10px] font-mono" style={{ color: S.muted }}>全局 · {superIdentityAccounts.length} 个身份账号</div><div className="mt-1 text-xs leading-relaxed" style={{ color: S.muted }}>统一管理所有行业生态、SaaS 合作伙伴、平台和项目，配置仅作用于全局超级生态范围。</div></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[["行业生态", total.ecosystems, Globe], ["SaaS伙伴", total.saas, Package], ["平台", total.platforms, Building2], ["项目", total.projects, Workflow]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-2.5 py-2.5" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Icon size={14} style={{ color: S.accent }} /><div><div className="text-sm font-bold" style={{ color: S.text }}>{value as string | number}</div><div className="text-[10px] font-mono" style={{ color: S.muted }}>{label as string}</div></div></div>)}</div><div className="flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: S.border }}><button type="button" title="账号管理" aria-label="账号管理" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "accounts" ? S.accent : S.bg, color: activeWorkbenchPanel === "accounts" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("accounts")}><UsersRound size={12} />账号管理</button><button type="button" title="团队与权限" aria-label="团队与权限" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "teamPermissions" ? S.accent : S.bg, color: activeWorkbenchPanel === "teamPermissions" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => { setTeamTab("roles"); setActiveWorkbenchPanel("teamPermissions"); }}><ShieldCheck size={12} />团队与权限</button><button type="button" title="超级生态配置" aria-label="超级生态配置" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold" style={{ background: activeWorkbenchPanel === "superSettings" ? S.accent : S.bg, color: activeWorkbenchPanel === "superSettings" ? S.onPrimary : S.text, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setActiveWorkbenchPanel("superSettings")}><Settings size={12} />全局配置</button></div>{activeWorkbenchPanel === "superSettings" && <div className="space-y-3"><div className="rounded px-3 py-2" style={{ background: S.accentLight, border: `1px solid ${S.borderMed}` }}><div className="text-xs font-bold" style={{ color: S.text }}>超级生态全局配置</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>这里仅展示全局权限、数据范围和生态治理说明，不会修改任何普通生态配置。</div></div><div className="grid gap-2 sm:grid-cols-3">{[["账号范围", "global/*"], ["数据范围", "全部行业生态"], ["配置范围", "超级生态独立设置"]].map(([label, value]) => <div key={label} className="rounded px-3 py-2" style={{ background: S.bg }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="mt-1 text-xs font-bold" style={{ color: S.text }}>{value}</div></div>)}</div><div className="flex items-center justify-between rounded px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}` }}><span className="text-[10px]" style={{ color: S.muted }}>全局配置保存提示</span><button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => setToast("超级生态全局配置保存提示已记录")}><Save size={13} />保存提示</button></div></div>}{activeWorkbenchPanel === "accounts" && <div className="space-y-2">{superIdentityAccounts.length === 0 ? <div className="rounded px-3 py-3 text-[11px]" style={{ background: S.bg, color: S.muted }}>当前全局范围暂无身份账号。</div> : superIdentityAccounts.map(account => <div key={account.uid} className="rounded px-3 py-2" style={{ background: S.bg, border: `1px solid ${S.border}` }}><div className="text-xs font-bold" style={{ color: S.text }}>{account.name}</div><div className="mt-1 text-[10px] font-mono" style={{ color: S.muted }}>{account.email} · global/* · {account.status === "active" ? "已启用" : "已停用"}</div></div>)}</div>}</section>}
      </div>
      </div>
      {createPlatformOpen && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} defaultEco={platformCreateContext?.eco} defaultSaas={platformCreateContext?.saas} onClose={() => { setCreatePlatformOpen(false); setPlatformCreateContext(null); }} onCreate={({ name, saas, partner, eco, desc }) => {
        const ownerLabel = getPlatformOwnerLabel({ partner, saas });
        setPlatformList(list => [...list, { id: Date.now(), name, partner, saas, eco, desc: desc || "", projects: 0, users: 0, groups: 0, teachers: 0, revenue: "待接入", status: "孵化中", dataStatus: "待接入" }]);
        const approval = createApproval("platform_onboard", { title: `平台入驻：${name}（${ownerLabel}）`, submitter: "超级生态管理员", description: partner ? `在${partner} SaaS 合作伙伴下新建平台「${name}」，所属${eco}生态` : `由超级生态直接新建平台「${name}」，所属${eco}生态`, detail: { 平台名称: name, 所属合作伙伴: ownerLabel, 所属生态: eco, 描述: desc || "—" }, payload: { type: "platform_onboard", name, saas, eco, desc: desc || "" } });
        setApprovals(prev => [approval, ...prev]); setCreatePlatformOpen(false); setPlatformCreateContext(null); setActiveWorkbenchPanel("platforms"); setToast("平台已创建并推送审批单");
      }} />}
      {createEcoOpen && <CreateEcosystemDrawer onClose={() => setCreateEcoOpen(false)} onCreate={({ name, desc, tag, company, admin }) => {
        const now = new Date(); const pad = (n: number) => String(n).padStart(2, "0"); const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`; const endAt = `${now.getFullYear() + 1}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`; const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); const dueAt = `${dueDate.getFullYear()}-${pad(dueDate.getMonth() + 1)}-${pad(dueDate.getDate())}`; const createdAt = `${today} ${pad(now.getHours())}:${pad(now.getMinutes())}`; const newEcoId = Date.now();
        setEcoList(list => [...list, { id: newEcoId, name, desc: tag ? `${desc}（行业：${tag}）` : desc, platforms: 0, projects: 0, members: 0, revenue: "¥0/月", status: "孵化中", company }]); if (admin) setAccounts(list => [...list, { uid: `U${newEcoId}`, name: admin.name, email: admin.email, phone: admin.phone, status: "active", createdAt, identities: [{ roleKey: "eco_leader", scopeType: "eco", scopeIds: [`eco-${newEcoId}`], label: "生态负责人", permissionSummary: `${name}生态负责人` }], assignedToolIds: [] }]); setSubs(list => [...list, { id: `SUB-${newEcoId}`, subscriberType: "eco", subscriberName: name, planKey: "eco-starter", priceCny: 29800, cycle: "yearly", startAt: today, endAt, status: "pending", gmvShareRate: 0.05 }]); setBills(list => [...list, { id: `INV-${newEcoId}`, payerType: "eco", payerName: name, amountCny: 29800, items: ["生态·孵化版 年费"], status: "pending", dueAt }]); setCreateEcoOpen(false); setToast(admin ? "生态已创建，已生成生态负责人账号 + 入驻账单" : "生态已创建，可在详情中补充主体信息与负责人账号");
      }} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── 生态视图 ─────────────────────────────────────────────────
function EcoView({
  ecoList, saasList, setSaasList, platformList, setPlatformList, role,
}: {
  ecoList: EcoItem[];
  saasList: SaasItem[]; setSaasList: React.Dispatch<React.SetStateAction<SaasItem[]>>;
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  role: string;
}) {
  const [filterEco, setFilterEco] = useState<string>("全部生态");
  const [createSaasOpen, setCreateSaasOpen] = useState(false);
  const [createPlatformSaasId, setCreatePlatformSaasId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const currentSaas = saasList.find(p => p.id === createPlatformSaasId);
  const { setApprovals } = useApprovals();
  const filtered = filterEco === "全部生态" ? saasList : saasList.filter(p => p.eco === filterEco);
  const ecoOptions = ["全部生态", ...Array.from(new Set(saasList.map(p => p.eco)))];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><span className="text-sm font-bold" style={{ color: S.text }}>SaaS 合作伙伴 ({saasList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>生态下辖的 SaaS 合作伙伴，为招募的平台下发能力</div></div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
            {ecoOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <CreateResourceMenu role={role} onSelect={kind => {
            if (kind === "saas") setCreateSaasOpen(true);
            if (kind === "platform") setCreatePlatformSaasId(saasList[0]?.id ?? null);
          }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(p => (
          <div
            key={p.id}
            className="p-4 relative"
            style={{
              background: p.isCurrent ? S.accentLight : S.surface,
              border: p.isCurrent ? `2px solid rgba(204,255,0,0.5)` : `1px solid ${S.border}`,
              borderRadius: S.radius,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {p.isCurrent && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5" style={{ background: "#1e293b", borderRadius: S.radiusSm }}>
                <CheckCircle size={10} style={{ color: S.accent }} />
                <span style={{ color: S.accent, fontSize: "10px", fontFamily: "monospace" }}>当前合作伙伴</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
                {p.name[0]}
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: S.text }}>{p.name}</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold" style={{ background: "#f1f5f9", color: "#475569", borderRadius: S.radiusSm }}>{p.eco}</span>
              </div>
            </div>
            <div className="text-xs mb-3 font-mono" style={{ color: S.muted }}>{p.desc}</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[["服务平台", p.platformCount], ["服务项目", p.projects], ["系统用户", p.users.toLocaleString()], ["活跃群组", p.groups]].map(([l, v]) => (
                <div key={l as string} className="px-2 py-1.5 text-center" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="flex items-center gap-1 px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => setCreatePlatformSaasId(p.id)}><Plus size={10} /> 开平台</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {createSaasOpen && <CreateSaasDrawer ecoList={ecoList} onClose={() => setCreateSaasOpen(false)} onCreate={({ name, eco, desc }) => {
        setSaasList(list => [...list, { id: Date.now(), name, eco, desc, platformCount: 0, projects: 0, users: 0, groups: 0, status: "孵化中", isCurrent: false }]);
        const approval = createApproval("saas_onboard", {
          title: `SaaS 合作伙伴入驻：${name}（${eco}）`,
          submitter: "生态运营",
          description: `在${eco}下新建 SaaS 合作伙伴「${name}」，${desc || "无描述"}`,
          detail: { SaaS合作伙伴名称: name, 所属生态: eco, 描述: desc || "—" },
          payload: { type: "saas_onboard", name, eco, desc },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreateSaasOpen(false);
      }} />}
      {createPlatformSaasId !== null && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} defaultSaas={currentSaas?.name} defaultEco={currentSaas?.eco} onClose={() => setCreatePlatformSaasId(null)} onCreate={({ name, saas, partner, eco, desc }) => {
        setPlatformList(list => [...list, { id: Date.now(), name, partner, saas, eco, desc: desc || "", projects: 0, users: 0, groups: 0, teachers: 0, revenue: "孵化中", status: "孵化中" }]);
        const ownerLabel = getPlatformOwnerLabel({ partner, saas });
        const approval = createApproval("platform_onboard", {
          title: `平台入驻：${name}（${ownerLabel}）`,
          submitter: "生态运营",
          description: partner ? `在${partner} SaaS 合作伙伴下新建平台「${name}」，所属${eco}生态` : `由超级生态直接新建平台「${name}」，所属${eco}生态`,
          detail: { 平台名称: name, 所属合作伙伴: ownerLabel, 所属生态: eco, 描述: desc || "—" },
          payload: { type: "platform_onboard", name, saas, eco, desc },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreatePlatformSaasId(null);
        setToast("已创建并推送审批单");
      }} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── SaaS 合作伙伴视图 ───────────────────────────────────
function SaasView({
  ecoList, saasList, platformList, setPlatformList, role, setActiveTier, setActivePlatformId, setActivePlatformName,
}: {
  ecoList: EcoItem[];
  saasList: SaasItem[];
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  role: string;
  setActiveTier?: (t: string) => void;
  setActivePlatformId: (id: number) => void;
  setActivePlatformName: (name: string) => void;
}) {
  const [filterEco, setFilterEco] = useState<string>("全部生态");
  const [filterPartner, setFilterPartner] = useState<string>("全部 SaaS 合作伙伴");
  const [createPlatformOpen, setCreatePlatformOpen] = useState(false);
  const { setApprovals } = useApprovals();
  const ecoOptions = ["全部生态", ...Array.from(new Set(platformList.map(p => p.eco)))];
  const partnerOptions = ["全部 SaaS 合作伙伴", ...Array.from(new Set(platformList.map(p => getPlatformOwnerLabel(p))))];
  const filtered = platformList.filter(p => (filterEco === "全部生态" || p.eco === filterEco) && (filterPartner === "全部 SaaS 合作伙伴" || getPlatformOwnerLabel(p) === filterPartner));
  const totalProjects = filtered.reduce((n, p) => n + p.projects, 0);
  const totalUsers = filtered.reduce((n, p) => n + p.users, 0);
  const totalGroups = filtered.reduce((n, p) => n + p.groups, 0);
  const totalTeachers = filtered.reduce((n, p) => n + p.teachers, 0);
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2"><span className="text-sm font-bold" style={{ color: S.text }}>旗下平台</span><span className="text-xs font-mono" style={{ color: S.muted }}>({filtered.length})</span></div>
          <div className="mt-1 text-xs" style={{ color: S.muted }}>当前筛选范围内的平台经营汇总</div>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:flex-nowrap">
          <select className="w-full min-w-0 px-3 py-1.5 text-xs font-bold sm:w-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
            {ecoOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="w-full min-w-0 px-3 py-1.5 text-xs font-bold sm:w-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterPartner} onChange={e => setFilterPartner(e.target.value)}>
            {partnerOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <CreateResourceMenu role={role} onSelect={kind => { if (kind === "platform") setCreatePlatformOpen(true); }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[["下辖项目", totalProjects, LayoutDashboard], ["平台用户", totalUsers.toLocaleString(), Eye], ["运营群组", totalGroups, MessageSquare], ["服务人员", totalTeachers, UsersRound]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as string | number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}
      </div>
      <div className="space-y-2">
        {filtered.map((pf, idx) => (
          <div
            key={pf.id}
            className="flex flex-col gap-3 p-4 transition-all xl:flex-row xl:items-center xl:gap-4"
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: S.radius,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex min-w-0 items-center gap-3 xl:w-[300px] xl:flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius }}>
                {pf.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: S.text }}>{pf.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: statusCfg[pf.status]?.bg, color: statusCfg[pf.status]?.color, borderRadius: S.radiusSm }}>{pf.status}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#f1f5f9", color: "#475569", borderRadius: S.radiusSm }}>{getPlatformOwnerLabel(pf)}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#f1f5f9", color: "#475569", borderRadius: S.radiusSm }}>{pf.eco}</span>
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 xl:flex-1 xl:grid-cols-5 xl:gap-3">
              {[["下辖项目", pf.projects], ["平台用户", pf.users.toLocaleString()], ["运营群组", pf.groups], ["服务人员", `${pf.teachers} 人`], ["月营收", pf.revenue]].map(([l, v]) => (
                <div key={l as string} className="px-3 py-2 text-center" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="w-full xl:w-auto xl:flex-shrink-0">
              <button type="button" className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => { setActivePlatformId(pf.id); setActivePlatformName(pf.name); setActiveTier && setActiveTier("platform"); }}>进入平台</button>
            </div>
          </div>
        ))}
      </div>
      {createPlatformOpen && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} onClose={() => setCreatePlatformOpen(false)} onCreate={({ name, saas, partner, eco, desc }) => {
        setPlatformList(list => [...list, { id: Date.now(), name, partner, saas, eco, desc: desc || "", projects: 0, users: 0, groups: 0, teachers: 0, revenue: "孵化中", status: "孵化中" }]);
        const ownerLabel = getPlatformOwnerLabel({ partner, saas });
        const approval = createApproval("platform_onboard", {
          title: `平台入驻：${name}（${ownerLabel}）`,
          submitter: "SaaS 合作伙伴负责人",
          description: partner ? `在${partner} SaaS 合作伙伴下新建平台「${name}」，所属${eco}生态` : `由超级生态直接新建平台「${name}」，所属${eco}生态`,
          detail: { 平台名称: name, 所属合作伙伴: ownerLabel, 所属生态: eco, 描述: desc || "—" },
          payload: { type: "platform_onboard", name, saas, eco, desc: desc || "" },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreatePlatformOpen(false);
      }} />}
    </div>
  );
}

// ─── 项目/平台视图 ────────────────────────────────────────────
const fieldStyle = { background: "#ffffff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, padding: "8px 10px", fontSize: 12, width: "100%" };
const roleNames = ["超级生态管理员", "生态负责人", "生态COO", "SaaS 合作伙伴负责人", "SaaS 合作伙伴运营", "平台管理员", "平台运营", "项目负责人", "区域运营", "客服", "老师"];
const projectVisibilityRoles = ["生态负责人", "SaaS 合作伙伴负责人", "平台管理员", "项目负责人", "区域运营", "客服", "老师"];

const groupRuleRoleOptions = ["游客", "体验官", "VIP0", "VIP1", "VIP2", "VIP3", "VIP4", "SVIP0", "SVIP1", "SVIP2", "SVIP3", "SVIP4", "SVIP5", "普通会员", "核心会员", "城市运营发展伙伴"];
const groupRuleCityOptions = ["北京", "吉林", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "全国"];
type ProjectTab = "overview" | "tiers" | "groupRules" | "community" | "mechanism" | "visibility";

function GroupRulesEditor({ project, updateDraft }: { project: ProjectRecord; updateDraft: (updater: (current: ProjectRecord) => ProjectRecord) => void }) {
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});
  const updateRule = (idx: number, patch: Partial<GroupTypeRule>) => updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx ? { ...rule, ...patch } : rule) }));
  const toggleListValue = (idx: number, key: "cities" | "memberRoles", value: string) => updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx ? { ...rule, [key]: rule[key].includes(value) ? rule[key].filter(item => item !== value) : [...rule[key], value] } : rule) }));
  const addRole = (idx: number) => {
    const value = (roleDraft[String(idx)] || "").trim();
    if (!value) return;
    updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx && !rule.memberRoles.includes(value) ? { ...rule, memberRoles: [...rule.memberRoles.filter(role => role !== "待配置身份"), value] } : rule) }));
    setRoleDraft(current => ({ ...current, [idx]: "" }));
  };
  return <div className="space-y-2"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目群类型规则</div><p className="text-xs mt-1 leading-relaxed" style={{ color: S.muted }}>群类型启用后才能建群。地区与会员身份均可多选；群类型代码、地区代码和序号由系统生成并保持只读。</p></div>{project.groupTypes.map((rule, idx) => <div key={rule.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="px-2 py-1 text-xs font-bold" style={{ background: rule.enabled ? "#1e293b" : "#f1f5f9", color: rule.enabled ? S.accent : S.muted, borderRadius: S.radiusSm }}>{rule.code}</span><input value={rule.name} style={{ ...fieldStyle, width: 132, padding: "5px 7px" }} onChange={e => updateRule(idx, { name: e.target.value })} /></div><label className="flex items-center gap-1 text-xs font-bold" style={{ color: rule.enabled ? "#276749" : S.muted }}><input type="checkbox" checked={rule.enabled} onChange={e => updateRule(idx, { enabled: e.target.checked })} />启用</label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs" style={{ color: S.muted }}>默认群容量<input type="number" min="1" value={rule.capacity} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { capacity: Number(e.target.value) })} /></label><label className="text-xs" style={{ color: S.muted }}>分配方式<select value={rule.allocationMode} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { allocationMode: e.target.value as GroupTypeRule["allocationMode"] })}><option>轮巡分配</option><option>统一分配</option></select></label></div><div><div className="text-xs font-bold mb-1.5">匹配会员身份 <span className="font-normal" style={{ color: S.muted }}>可多选</span></div><div className="flex flex-wrap gap-1.5">{groupRuleRoleOptions.map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.memberRoles.includes(role) ? "#1e293b" : "#f1f5f9", color: rule.memberRoles.includes(role) ? S.accent : S.muted, border: `1px solid ${rule.memberRoles.includes(role) ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.memberRoles.includes(role)} onChange={() => toggleListValue(idx, "memberRoles", role)} />{role}</label>)}<input className="px-2 py-1 text-[10px] outline-none" style={{ ...fieldStyle, width: 116, padding: "5px 7px" }} placeholder="新增身份，回车" value={roleDraft[String(idx)] || ""} onChange={e => setRoleDraft(current => ({ ...current, [idx]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRole(idx); } }} /></div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前：{rule.memberRoles.length ? rule.memberRoles.join("、") : "未选择身份"}</div></div><div><div className="text-xs font-bold mb-1.5">管理地区 <span className="font-normal" style={{ color: S.muted }}>可多选，取消勾选即不参与建群</span></div><div className="flex flex-wrap gap-1.5">{groupRuleCityOptions.map(city => <label key={city} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.cities.includes(city) ? "#1e293b" : "#f1f5f9", color: rule.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${rule.cities.includes(city) ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.cities.includes(city)} onChange={() => toggleListValue(idx, "cities", city)} />{city}</label>)}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>已选地区：{rule.cities.length ? rule.cities.join("、") : "未选择地区，无法建群"}</div></div><div className="text-[10px] font-mono" style={{ color: S.muted }}>群名模板：<span style={{ color: S.text }}>{rule.nameTemplate}</span> · 编号只读：{rule.code} + 地区代码 + 序号</div></div>)}<button type="button" className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => updateDraft(current => ({ ...current, groupTypes: [...current.groupTypes, { id: `custom-${Date.now()}`, name: "新群类型", code: `FL${String(current.groupTypes.length + 1).padStart(2, "0")}`, memberRoles: [], capacity: 500, cities: ["北京"], allocationMode: "轮巡分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: false }] }))}><Plus size={13} className="inline mr-1" />新增群类型规则</button></div>;
}

function ProjectDrawer({ project, onClose, onSave }: { project: ProjectRecord; onClose: () => void; onSave: (p: ProjectRecord) => void }) {
  const [draft, setDraft] = useState<ProjectRecord>(project);
  const [tab, setTab] = useState<ProjectTab>("overview");
  const updateDraft = (updater: (current: ProjectRecord) => ProjectRecord) => setDraft(updater);
  const updateMechanism = (key: keyof ProjectRecord["mechanism"], value: string) => setDraft(d => ({ ...d, mechanism: { ...d.mechanism, [key]: value } }));
  const updateTier = (idx: number, key: keyof ProjectTier, value: string) => setDraft(d => ({ ...d, tiers: d.tiers.map((t, i) => i === idx ? { ...t, [key]: value } : t) }));
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.16)" }} onClick={onClose}>
      <aside className={`h-full w-full overflow-auto ${tab === "community" ? "max-w-[960px]" : "max-w-[520px]"}`} style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between px-5 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div><div className="text-base font-bold">项目配置 · {draft.name}</div><div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>项目数据、会员等级与社群规则独立隔离</div></div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="flex gap-1 p-4 pb-2">
          {([["overview", "概览", LayoutDashboard], ["tiers", "客户与权益", UsersRound], ["groupRules", "群类型规则", SlidersHorizontal], ["community", "社群体系", Users], ["mechanism", "社群机制", Workflow], ["visibility", "可见范围", Eye]] as [ProjectTab, string, any][]).map(([id, label, Icon]) => <button key={id} type="button" className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold" style={{ background: tab === id ? "#1e293b" : S.surface, color: tab === id ? S.accent : S.muted, border: `1px solid ${tab === id ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }} onClick={() => setTab(id)}><Icon size={13} />{label}</button>)}
        </div>
        <div className="p-4 space-y-3">
          {tab === "overview" && <>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>所属平台</div><div className="text-sm font-bold mt-1">{draft.platform}</div><div className="text-xs mt-1" style={{ color: S.muted }}>SaaS 合作伙伴</div></div>
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>所属合作伙伴 / 生态</div><div className="text-sm font-bold mt-1">{getPlatformOwnerLabel(draft)}</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.eco}</div></div>
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>当前运营数据</div><div className="text-sm font-bold mt-1">{draft.users.toLocaleString()} 用户 · {draft.groups} 群</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.revenue}</div></div>
            </div>
            <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Building2 size={16} />企业微信归属</div><div className="text-sm font-bold mt-2">{draft.enterpriseWx}</div><div className="text-xs mt-1" style={{ color: S.muted }}>同一企业已承载 {draft.enterpriseProjectCount} 个项目 · 项目数据按项目隔离</div><button type="button" className="mt-3 px-3 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setTab("visibility")}>管理项目范围</button></div>
            <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={16} />运营基线</div><span className="text-xs font-mono" style={{ color: S.muted }}>{draft.tiers.length} 个会员等级</span></div><div className="flex flex-wrap gap-2 mt-3">{draft.tiers.map(t => <span key={t.name} className="px-2 py-1 text-xs font-bold" style={{ background: S.accentLight, borderRadius: S.radiusSm }}>{t.name}</span>)}</div><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><div style={{ color: S.muted }}>入群流程 <b style={{ color: S.text }}>{draft.mechanism.welcome}</b></div><div style={{ color: S.muted }}>运营频次 <b style={{ color: S.text }}>{draft.mechanism.cadence}</b></div></div></div>
          </>}
          {tab === "tiers" && <div className="space-y-2">{draft.tiers.map((tier, idx) => <div key={idx} className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold px-2 py-1" style={{ background: idx === 0 ? "#f1f5f9" : S.accent, borderRadius: S.radiusSm }}>等级 {idx + 1}</span><button type="button" className="text-xs" style={{ color: "#888" }} onClick={() => setDraft(d => ({ ...d, tiers: d.tiers.filter((_, i) => i !== idx) }))}>移除</button></div><div className="grid grid-cols-2 gap-2"><input value={tier.name} style={fieldStyle} onChange={e => updateTier(idx, "name", e.target.value)} placeholder="等级名称" /><input value={tier.rule} style={fieldStyle} onChange={e => updateTier(idx, "rule", e.target.value)} placeholder="升级条件" /><input value={tier.group} style={fieldStyle} onChange={e => updateTier(idx, "group", e.target.value)} placeholder="对应社群" /><input value={tier.service} style={fieldStyle} onChange={e => updateTier(idx, "service", e.target.value)} placeholder="服务 SLA" /></div></div>)}<button type="button" className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setDraft(d => ({ ...d, tiers: [...d.tiers, { name: "新会员等级", rule: "待配置", group: "待配置社群", service: "待配置" }] }))}><Plus size={13} className="inline mr-1" />新增会员等级</button></div>}
          {tab === "tiers" && <><div className="p-3 text-xs leading-relaxed" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><b>项目权益规则源</b>：客户等级、获取条件和权益包只在项目中配置；小程序、商城和外部系统仅做展示、核销与数据映射。</div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">等级权益包</div>{draft.tiers.map((tier, idx) => <label key={`benefit-${tier.name}-${idx}`} className="block mb-2 text-[10px]" style={{ color: S.muted }}>{tier.name}<input className="mt-1" value={tier.benefits} style={{ ...fieldStyle, padding: "6px 8px", fontSize: 11 }} onChange={e => updateTier(idx, "benefits", e.target.value)} placeholder="权益包" /></label>)}</div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold">已连接应用的权益映射</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>配置哪些端展示或核销本项目权益，不重复定义会员等级。</div><div className="flex flex-wrap gap-1.5 mt-2">{["主理人公社小程序", "企业微信 SCRM", "订单系统"].map(app => <span key={app} className="px-2 py-1 text-[10px]" style={{ background: "#f1f5f9", color: S.textSec, borderRadius: S.radiusSm }}>{app} · 已映射</span>)}</div></div></>}
          {tab === "groupRules" && <GroupRulesEditor project={draft} updateDraft={updateDraft} />}
          {tab === "community" && <ProjectCommunitySystem platform={draft.platform} scope="project" project={draft.name} rules={draft.groupTypes} onGoRules={() => setTab("groupRules")} />}
          {tab === "mechanism" && <div className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={16} />社群运营机制</div><p className="text-xs" style={{ color: S.muted }}>规则绑定当前项目，会员等级变化后自动路由到对应社群。</p>{([ ["welcome", "入群与欢迎流程"], ["cadence", "内容运营频次"], ["route", "分群路由规则"], ["escalation", "异常升级路径"]] as [keyof ProjectRecord["mechanism"], string][]).map(([key, label]) => <label key={key} className="block text-xs font-bold">{label}<input className="mt-1" value={draft.mechanism[key]} style={fieldStyle} onChange={e => updateMechanism(key, e.target.value)} /></label>)}</div>}
          {tab === "visibility" && <div className="space-y-3"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} />身份可见范围</div><p className="text-xs mt-1" style={{ color: S.muted }}>控制谁可以进入该项目并查看项目、企业微信和社群运营数据。勾选后对应角色可在其工作台看到本项目。</p></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2" style={{ color: S.textSec }}>项目相关身份（7 档）</div>{projectVisibilityRoles.map(role => <label key={role} className="flex items-center justify-between py-2 text-xs font-bold" style={{ borderBottom: `1px solid ${S.border}` }}><span className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, fontSize: 10 }}>{role[0]}</span>{role}</span><input type="checkbox" checked={!!draft.visibility[role]} onChange={e => setDraft(d => ({ ...d, visibility: { ...d.visibility, [role]: e.target.checked } }))} /></label>)}</div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">其他角色（全局/生态/SaaS/平台运营层）</div><div className="flex flex-wrap gap-1.5">{roleNames.filter(r => !projectVisibilityRoles.includes(r)).map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: !!draft.visibility[role] ? "#1e293b" : "#f1f5f9", color: !!draft.visibility[role] ? S.accent : S.muted, border: `1px solid ${!!draft.visibility[role] ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={!!draft.visibility[role]} onChange={e => setDraft(d => ({ ...d, visibility: { ...d.visibility, [role]: e.target.checked } }))} />{role}</label>)}</div></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">企业微信下的项目</div><div className="flex items-center gap-2 flex-wrap">{["PRO会员", "体验官", "代理商"].map(name => <span key={name} className={name === draft.name ? "px-2 py-1 text-xs font-bold" : "px-2 py-1 text-xs"} style={{ background: name === draft.name ? "#1e293b" : "#f1f5f9", color: name === draft.name ? S.accent : S.muted, borderRadius: S.radiusSm }}>{name}</span>)}</div></div></div>}
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => { onSave(draft); onClose(); }}><Save size={13} />保存项目配置</button></div>
      </aside>
    </div>
  );
}

function CreateProjectDrawer({ ecoList, saasList, platformList, defaultPlatform, platformLocked = false, onClose, onCreate }: {
  ecoList: EcoItem[]; saasList: SaasItem[]; platformList: PlatformItem[];
  defaultPlatform?: string; platformLocked?: boolean; onClose: () => void; onCreate: (p: ProjectRecord) => void;
}) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState(defaultPlatform || (platformList[0]?.name ?? "主理人公社"));
  const [enterpriseWx, setEnterpriseWx] = useState("健康企业微信");
  const firstPlatform = platformList.find(p => p.name === platform);
  const [eco, setEco] = useState(firstPlatform?.eco || (ecoList[0]?.name ?? "健康医药美业生态"));
  const [partner, setPartner] = useState(firstPlatform ? getPlatformOwnerLabel(firstPlatform) : "直属超级生态");
  const [saas, setSaas] = useState(firstPlatform?.saas ?? "");
  const [creatorRole, setCreatorRole] = useState("项目负责人");
  const canCreate = name.trim().length > 1 && platform.trim().length > 0;
  const platformNameOptions = platformList.map(p => p.name);
  const ecoOptions = ecoList.map(e => e.name);
  const saasOptions = ["直属超级生态", ...saasList.filter(s => eco ? s.eco === eco : true).map(s => s.name)];
  const filteredPlatformOptions = platformList.filter(p => (!partner || getPlatformOwnerLabel(p) === partner) && (!eco || p.eco === eco)).map(p => p.name);
  const onPlatformChange = (next: string) => {
    setPlatform(next);
    const linked = platformList.find(p => p.name === next);
    if (linked) { setPartner(getPlatformOwnerLabel(linked)); setSaas(linked.saas ?? ""); setEco(linked.eco); }
  };
  return <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}><aside className="h-full w-full max-w-[460px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}><div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}><div><div className="text-base font-bold">接入新项目</div><div className="text-xs mt-1" style={{ color: S.muted }}>创建后继续配置会员等级和社群机制</div></div><button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button></div><div className="p-5 space-y-4"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目归属关系</div><p className="text-xs mt-1" style={{ color: S.muted }}>生态 → 超级生态或 SaaS 合作伙伴 → 平台 → 项目：项目归属到具体平台下，平台可以由超级生态直接创建，也可以由 SaaS 合作伙伴创建；一个企业微信可以承载多个项目，项目数据、会员等级和社群规则独立隔离。</p></div><label className="block text-xs font-bold">项目名称<input className="mt-1" value={name} placeholder="例如：PRO会员" style={fieldStyle} onChange={e => setName(e.target.value)} /></label><label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label><label className="block text-xs font-bold">SaaS 合作伙伴<select className="mt-1" value={partner} style={fieldStyle} onChange={e => { const next = e.target.value; setPartner(next); setSaas(next === "直属超级生态" ? "" : next); }}>{saasOptions.map(n => <option key={n}>{n}</option>)}</select></label><label className="block text-xs font-bold">所属平台<select className="mt-1" value={platform} disabled={platformLocked} style={{ ...fieldStyle, opacity: platformLocked ? 0.7 : 1 }} onChange={e => onPlatformChange(e.target.value)}>{(filteredPlatformOptions.length ? filteredPlatformOptions : platformNameOptions).map(n => <option key={n}>{n}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>{platformLocked ? "平台身份只能在当前平台下新建项目" : "项目必须归属到某个平台下，平台可以由超级生态直属创建或由 SaaS 合作伙伴创建"}</span></label><label className="block text-xs font-bold">企业微信归属<input className="mt-1" value={enterpriseWx} placeholder="选择企业微信" style={fieldStyle} onChange={e => setEnterpriseWx(e.target.value)} /></label><label className="block text-xs font-bold">创建身份<select className="mt-1" value={creatorRole} style={fieldStyle} onChange={e => setCreatorRole(e.target.value)}>{roleNames.map(role => <option key={role}>{role}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>创建身份决定默认项目范围，后续可在“可见范围”中继续收敛。</span></label><div className="grid grid-cols-2 gap-2"><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认会员等级</div><div className="text-sm font-bold mt-1">3 个</div></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认可见身份</div><div className="text-sm font-bold mt-1">负责人 / 运营 / 客服</div></div></div></div><div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#1e293b" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ id: Date.now(), name, platform, partner, saas, eco, users: 0, groups: 0, teacher: "待分配", cities: ["待配置"], revenue: "待核算", status: "孵化中", enterpriseWx, enterpriseProjectCount: 1, tiers: defaultTiers.map(t => ({ ...t })), groupTypes: [], mechanism: { welcome: "欢迎语 + 入群任务", cadence: "每周 1 次", route: "按城市 + 会员等级分群", escalation: "异常通知项目负责人" }, visibility: { "超级管理员": true, "生态负责人": creatorRole === "生态负责人" || true, "生态COO": false, "合作伙伴负责人": creatorRole === "合作伙伴负责人", "合作伙伴运营": false, "平台管理员": creatorRole === "平台管理员", "平台运营": false, "项目负责人": creatorRole === "项目负责人" || true, "区域运营": creatorRole === "区域运营" || true, "客服": creatorRole === "客服" || true, "老师": false } })}>创建项目</button></div></aside></div>;
}

// ─── 新建抽屉与 Toast ─────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed top-5 left-1/2 z-[60] px-4 py-2.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transform: "translateX(-50%)" }}>{message}</div>
  );
}

function CreateEcosystemDrawer({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; desc: string; tag: string; company: CompanyInfo; admin?: { name: string; phone: string; email: string; password: string } }) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [creditCode, setCreditCode] = useState("");
  const [legalPerson, setLegalPerson] = useState("");
  const [legalPhone, setLegalPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("Eco@2026");
  const canCreate = name.trim().length > 0;
  const submit = () => {
    if (!canCreate) return;
    onCreate({
      name: name.trim(), desc: desc.trim(), tag: tag.trim(),
      company: { name: companyName.trim() || undefined, creditCode: creditCode.trim() || undefined, legalPerson: legalPerson.trim() || undefined, contactName: contactName.trim() || undefined, contactPhone: contactPhone.trim() || undefined, region: region.trim() || undefined, bankName: bankName.trim() || undefined, bankAccount: bankAccount.trim() || undefined },
      admin: adminName.trim() && adminPhone.trim() ? { name: adminName.trim(), phone: adminPhone.trim(), email: adminEmail.trim(), password: adminPassword.trim() } : undefined,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[560px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div>
            <div className="text-base font-bold">新建生态</div>
            <div className="text-xs mt-1" style={{ color: S.muted }}>在超级生态下创建行业生态，创建后可继续完善主体信息与负责人账号</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />所属超级生态</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>当前创建位置：超级生态。创建后可在生态详情中补充 SaaS 合作伙伴、平台和项目。</p>
          </div>
          <label className="block text-xs font-bold">生态名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康医药美业生态" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">生态描述<input className="mt-1" value={desc} placeholder="例如：大健康、医药、医美、美业综合生态" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
          <label className="block text-xs font-bold">行业标签<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={tag} placeholder="例如：大健康 / 医美 / 宠物 / 教育" style={fieldStyle} onChange={e => setTag(e.target.value)} /></label>

          <div className="space-y-3" style={{ borderTop: `1px solid ${S.border}`, paddingTop: 12 }}>
            <div><div className="text-sm font-bold">主体信息 <span className="text-[10px] font-normal" style={{ color: S.muted }}>可选，创建后补充</span></div><p className="text-xs mt-1" style={{ color: S.muted }}>用于签约、分润结算与发票开具。</p></div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold">公司名称<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={companyName} placeholder="例如：健康美业（杭州）科技有限公司" style={fieldStyle} onChange={e => setCompanyName(e.target.value)} /></label>
              <label className="block text-xs font-bold">统一社会信用代码<input className="mt-1" value={creditCode} placeholder="18 位信用代码" style={fieldStyle} onChange={e => setCreditCode(e.target.value)} /></label>
              <label className="block text-xs font-bold">法人姓名<input className="mt-1" value={legalPerson} placeholder="法人姓名" style={fieldStyle} onChange={e => setLegalPerson(e.target.value)} /></label>
              <label className="block text-xs font-bold">法人手机号<input className="mt-1" value={legalPhone} placeholder="11 位手机号" style={fieldStyle} onChange={e => setLegalPhone(e.target.value)} /></label>
              <label className="block text-xs font-bold">对接人姓名<input className="mt-1" value={contactName} placeholder="日常对接人" style={fieldStyle} onChange={e => setContactName(e.target.value)} /></label>
              <label className="block text-xs font-bold">对接人手机号<input className="mt-1" value={contactPhone} placeholder="11 位手机号" style={fieldStyle} onChange={e => setContactPhone(e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">公司所在地<input className="mt-1" value={region} placeholder="省/市，例如：浙江省/杭州市" style={fieldStyle} onChange={e => setRegion(e.target.value)} /></label>
              <label className="block text-xs font-bold">开户行<span className="font-normal" style={{ color: S.muted }}>（分润结算用，可后补）</span><input className="mt-1" value={bankName} placeholder="例如：招商银行杭州分行" style={fieldStyle} onChange={e => setBankName(e.target.value)} /></label>
              <label className="block text-xs font-bold">银行账号<span className="font-normal" style={{ color: S.muted }}>（分润结算用，可后补）</span><input className="mt-1" value={bankAccount} placeholder="银行账号" style={fieldStyle} onChange={e => setBankAccount(e.target.value)} /></label>
            </div>
          </div>

          <div className="space-y-3" style={{ borderTop: `1px solid ${S.border}`, paddingTop: 12 }}>
            <div><div className="text-sm font-bold">负责人账号 <span className="text-[10px] font-normal" style={{ color: S.muted }}>可选，创建后配置</span></div><p className="text-xs mt-1" style={{ color: S.muted }}>如填写，将创建生态负责人登录账号；也可以稍后在团队与权限中配置。</p></div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold">负责人姓名<input className="mt-1" value={adminName} placeholder="例如：林清瑶" style={fieldStyle} onChange={e => setAdminName(e.target.value)} /></label>
              <label className="block text-xs font-bold">登录手机号<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={adminPhone} placeholder="11 位手机号，作为 UID" style={fieldStyle} onChange={e => setAdminPhone(e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">登录邮箱<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={adminEmail} placeholder="name@company.com" style={fieldStyle} onChange={e => setAdminEmail(e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">初始密码<span className="font-normal" style={{ color: S.muted }}>（账号创建后可自行修改）</span><input className="mt-1" value={adminPassword} style={fieldStyle} onChange={e => setAdminPassword(e.target.value)} /></label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#1e293b" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={submit}>创建生态</button>
        </div>
      </aside>
    </div>
  );
}

function CreateSaasInlineForm({ ecoList, defaultEco, onClose, onCreate }: { ecoList: EcoItem[]; defaultEco?: string; onClose: () => void; onCreate: (data: { name: string; eco: string; desc: string }) => void }) {
  const [name, setName] = useState("");
  const [eco, setEco] = useState(defaultEco || ecoList[0]?.name || ecosystems[0].name);
  const [desc, setDesc] = useState("");
  const canCreate = name.trim().length > 0;
  const ecoOptions = Array.from(new Set(ecoList.map(e => e.name)));
  return (
    <div className="space-y-3 rounded border p-3" style={{ background: S.bg, borderColor: S.border }} aria-label="新建 SaaS 合作伙伴">
      <div className="flex items-start justify-between gap-2">
        <div><div className="text-xs font-bold" style={{ color: S.text }}>新建 SaaS 合作伙伴</div><div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>在当前生态详情中新增 SaaS 合作伙伴</div></div>
        <button type="button" title="取消新建 SaaS" aria-label="取消新建 SaaS" className="p-1" style={{ color: S.muted }} onClick={onClose}><X size={14} /></button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-[11px] font-bold" style={{ color: S.text }}>SaaS 合作伙伴名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康产业发展伙伴" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-[11px] font-bold" style={{ color: S.text }}>所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label>
      </div>
      <label className="block text-[11px] font-bold" style={{ color: S.text }}>描述<input className="mt-1" value={desc} placeholder="例如：负责发展相关平台并提供运营支持" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
      <div className="flex justify-end gap-2">
        <button type="button" className="px-2.5 py-1.5 text-[11px]" style={{ color: S.muted }} onClick={onClose}>取消</button>
        <button type="button" className="px-2.5 py-1.5 text-[11px] font-bold" disabled={!canCreate} style={{ background: canCreate ? "#1e293b" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ name: name.trim(), eco, desc: desc.trim() })}>创建 SaaS 合作伙伴</button>
      </div>
    </div>
  );
}

function CreateSaasDrawer({ ecoList, defaultEco, onClose, onCreate }: { ecoList: EcoItem[]; defaultEco?: string; onClose: () => void; onCreate: (data: { name: string; eco: string; desc: string }) => void }) {
  const [name, setName] = useState("");
  const [eco, setEco] = useState(defaultEco || ecoList[0]?.name || ecosystems[0].name);
  const [desc, setDesc] = useState("");
  const canCreate = name.trim().length > 0;
  const ecoOptions = Array.from(new Set(ecoList.map(e => e.name)));
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[460px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div>
            <div className="text-base font-bold">新建 SaaS 合作伙伴</div>
            <div className="text-xs mt-1" style={{ color: S.muted }}>在生态下开 SaaS 合作伙伴，招募平台并下发能力与权益</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />SaaS 合作伙伴归属关系</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>生态 → SaaS 合作伙伴 → 平台 → 项目：SaaS 合作伙伴归属到某个生态，可招募多个平台并下发能力与权益。</p>
          </div>
          <label className="block text-xs font-bold">SaaS 合作伙伴名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康产业发展伙伴" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">描述<input className="mt-1" value={desc} placeholder="例如：负责发展健康产业相关平台并提供运营支持" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#1e293b" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ name: name.trim(), eco, desc: desc.trim() })}>创建 SaaS 合作伙伴</button>
        </div>
      </aside>
    </div>
  );
}

function CreatePlatformDrawer({ saasList, ecoList, defaultSaas, defaultEco, onClose, onCreate }: { saasList: SaasItem[]; ecoList: EcoItem[]; defaultSaas?: string; defaultEco?: string; onClose: () => void; onCreate: (data: { name: string; partner?: string; saas?: string; eco: string; desc: string }) => void }) {
  const initialSaas = defaultSaas || "";
  const [name, setName] = useState("");
  const [partner, setPartner] = useState(initialSaas);
  const [saas, setSaas] = useState(initialSaas);
  const [eco, setEco] = useState(defaultEco || saasList.find(s => s.name === initialSaas)?.eco || ecoList[0]?.name || ecosystems[0].name);
  const [desc, setDesc] = useState("");
  const canCreate = name.trim().length > 0;
  const saasOptions = saasList.map(s => s.name);
  const ecoOptions = Array.from(new Set(ecoList.map(e => e.name)));
  const onSaasChange = (next: string) => {
    setSaas(next);
    const linked = saasList.find(s => s.name === next)?.eco;
    if (linked) setEco(linked);
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[460px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div>
            <div className="text-base font-bold">新建平台</div>
            <div className="text-xs mt-1" style={{ color: S.muted }}>可由超级生态或 SaaS 合作伙伴创建的运营实体，下辖多个项目</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />平台归属关系</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>超级生态 / SaaS 合作伙伴 → 平台 → 项目：平台可以由超级生态直接创建，也可以归属某个 SaaS 合作伙伴。</p>
          </div>
          <label className="block text-xs font-bold">平台名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康运营平台" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">所属 SaaS 合作伙伴<select className="mt-1" value={partner} style={fieldStyle} onChange={e => { const next = e.target.value; setPartner(next); setSaas(next); onSaasChange(next); }}><option value="">直属超级生态</option>{saasOptions.map(n => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">描述<input className="mt-1" value={desc} placeholder="例如：由超级生态直接创建的运营平台" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#1e293b" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ name: name.trim(), partner, saas, eco, desc: desc.trim() })}>创建平台</button>
        </div>
      </aside>
    </div>
  );
}

// ─── 平台下的项目列表 ─────────────────────────────────────────
function ProjectList({
  projectList, setProjectList, ecoList, saasList, platformList, platformName, platformId, onEnterProject, onBack,
}: {
  projectList: ProjectItem[]; setProjectList: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  ecoList: EcoItem[]; saasList: SaasItem[]; platformList: PlatformItem[];
  platformName: string; platformId: number;
  onEnterProject: (name: string) => void;
  onBack: () => void;
}) {
  const platform = platformList.find(pf => pf.id === platformId) || platformList.find(pf => pf.name === platformName);
  const filteredProjects = projectList.filter(p => p.platform === platformName);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [configProject, setConfigProject] = useState<ProjectRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { rulesByScope } = useCommunityData();
  useEffect(() => { filteredProjects.forEach(project => registerScopeRules(project.platform, "project", project.name, project.groupTypes)); }, [platformName, filteredProjects]);
  const saveProject = (next: ProjectRecord) => { setProjectList(list => list.map(p => p.id === next.id ? next : p)); saveScopeRules(next.platform, "project", next.name, next.groupTypes); };
  const projectScopeRules = (project: ProjectRecord) => rulesByScope[getCommunityScopeKey(project.platform, "project", project.name)] ?? project.groupTypes;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={onBack}>← 返回平台列表</button>
          <div>
            <div className="text-sm font-bold" style={{ color: S.text }}>{platformName} · 项目工作台 <span style={{ color: S.muted, fontWeight: "normal" }}>({filteredProjects.length})</span></div>
            <div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>所属合作伙伴：{getPlatformOwnerLabel({ partner: platform?.partner, saas: platform?.saas })} · 所属生态：{platform?.eco}</div>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateOpen(true)}><Plus size={12} /> 接入新项目</button>
      </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[["可见项目", filteredProjects.length, Eye], ["企业微信", new Set(filteredProjects.map(p => p.enterpriseWx)).size, Building2], ["会员等级", filteredProjects.reduce((n, p) => n + p.tiers.length, 0), UsersRound], ["运营群组", filteredProjects.reduce((n, p) => n + p.groups, 0), MessageSquare]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}</div>
    <div className="p-3 flex items-start gap-2" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.3)`, borderRadius: S.radius }}><Building2 size={16} /><div className="text-xs leading-relaxed"><b>平台与项目关系</b>：平台可以由超级生态直接创建，也可以由上层 SaaS 合作伙伴创建，下辖多个运营项目；项目是权限和运营数据隔离的最小单元。进入项目后，成员、会员等级、社群和报表只展示当前身份有权访问的范围。</div></div>
    <div className="hidden lg:block overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="min-w-[1260px]">
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
          {([["项目名称",190],["企业微信归属",170],["用户/群组",100],["服务老师",120],["覆盖城市",150],["状态",90],["操作",100]] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
        </div>
        {filteredProjects.length === 0 ? (
          <div className="px-4 py-10 text-center text-xs" style={{ color: S.muted }}>该平台下暂无项目，点击右上角「接入新项目」开始创建。</div>
        ) : filteredProjects.map((p, idx) => (
          <div key={p.id} role="button" tabIndex={0} className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono" style={{ background: selectedId === p.id ? S.accentLight : idx % 2 === 0 ? "#ffffff" : "#fafaf8", borderBottom: `1px solid ${S.border}`, borderLeft: selectedId === p.id ? `3px solid ${S.accent}` : "3px solid transparent" }} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSelectedId(selectedId === p.id ? null : p.id); } }}>
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 190 }}><div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{p.name[3] ?? p.name[0]}</div><span className="font-bold">{p.name}</span></div>
            <div className="flex-shrink-0" style={{ width: 170 }}><div className="font-bold">{p.enterpriseWx}</div><div className="text-[10px]" style={{ color: S.muted }}>同企业 {p.enterpriseProjectCount} 个项目</div></div>
            <div className="flex-shrink-0" style={{ width: 100 }}><b>{p.users.toLocaleString()}</b><span style={{ color: S.muted }}> / {p.groups} 群</span></div><div className="flex-shrink-0" style={{ width: 120, color: S.muted }}>{p.teacher}</div>
            <div className="flex-shrink-0" style={{ width: 150 }}><div className="flex flex-wrap gap-1">{p.cities.map(c => <span key={c} className="px-1.5 py-0.5 font-bold" style={{ background: "#1e293b", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm }}>{c}</span>)}</div></div>
            <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span></div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 100 }} onClick={e => e.stopPropagation()}><button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => { setSelectedId(p.id); onEnterProject(p.name); setConfigProject({ ...p, groupTypes: projectScopeRules(p) }); }}>进入</button><button type="button" className="px-1.5 py-1" title="配置项目" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={() => { setConfigProject({ ...p, groupTypes: projectScopeRules(p) }); }}><Settings size={11} /></button></div>
          </div>
        ))}
      </div>
    </div>
    <div data-section="projects" className="lg:hidden space-y-2">
      {filteredProjects.length === 0 ? (
        <div className="p-6 text-center text-xs" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, color: S.muted }}>该平台下暂无项目，点击右上角「接入新项目」开始创建。</div>
      ) : filteredProjects.map(p => (
        <article key={p.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0"><div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{p.name[3] ?? p.name[0]}</div><div className="min-w-0"><div className="text-sm font-bold truncate">{p.name}</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>{p.enterpriseWx} · {p.teacher}</div></div></div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold flex-shrink-0" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs"><div><div className="font-bold">{p.users.toLocaleString()}</div><div style={{ color: S.muted }}>用户</div></div><div><div className="font-bold">{p.groups}</div><div style={{ color: S.muted }}>群组</div></div><div><div className="font-bold">{p.cities.join("、")}</div><div style={{ color: S.muted }}>覆盖城市</div></div></div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => { setSelectedId(p.id); onEnterProject(p.name); setConfigProject({ ...p, groupTypes: projectScopeRules(p) }); }}>进入项目</button><button type="button" className="px-3 py-2 text-xs font-bold" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={() => setConfigProject({ ...p, groupTypes: projectScopeRules(p) })}>配置</button></div>
        </article>
      ))}
    </div>
    {configProject && <ProjectDrawer project={configProject} onClose={() => setConfigProject(null)} onSave={saveProject} />}
    {createOpen && <CreateProjectDrawer ecoList={ecoList} saasList={saasList} platformList={platformList} defaultPlatform={platformName} onClose={() => setCreateOpen(false)} onCreate={p => { registerScopeRules(p.platform, "project", p.name, p.groupTypes); setProjectList(list => [p, ...list]); setCreateOpen(false); setConfigProject(p); }} />}
    </div>
  );
}

function PlatformGroupRulesEditor({ platform, rules, onChange }: { platform: string; rules: GroupTypeRule[]; onChange: (rules: GroupTypeRule[]) => void }) {
  const updateRule = (idx: number, patch: Partial<GroupTypeRule>) => onChange(rules.map((rule, index) => index === idx ? { ...rule, ...patch } : rule));
  const toggleListValue = (idx: number, key: "cities" | "memberRoles", value: string) => onChange(rules.map((rule, index) => index === idx ? { ...rule, [key]: rule[key].includes(value) ? rule[key].filter(item => item !== value) : [...rule[key], value] } : rule));
  return <div className="space-y-2"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />平台群类型规则</div><p className="text-xs mt-1 leading-relaxed" style={{ color: S.muted }}>平台级规则只作用于「{platform}」平台社群，不会覆盖任何项目的社群规则。</p></div>{rules.map((rule, idx) => <div key={rule.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="px-2 py-1 text-xs font-bold" style={{ background: rule.enabled ? "#1e293b" : "#f1f5f9", color: rule.enabled ? S.accent : S.muted, borderRadius: S.radiusSm }}>{rule.code}</span><input value={rule.name} style={{ ...fieldStyle, width: 132, padding: "5px 7px" }} onChange={e => updateRule(idx, { name: e.target.value })} /></div><label className="flex items-center gap-1 text-xs font-bold" style={{ color: rule.enabled ? "#276749" : S.muted }}><input type="checkbox" checked={rule.enabled} onChange={e => updateRule(idx, { enabled: e.target.checked })} />启用</label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs" style={{ color: S.muted }}>默认群容量<input type="number" min="1" value={rule.capacity} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { capacity: Number(e.target.value) })} /></label><label className="text-xs" style={{ color: S.muted }}>分配方式<select value={rule.allocationMode} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { allocationMode: e.target.value as GroupTypeRule["allocationMode"] })}><option>轮巡分配</option><option>统一分配</option></select></label></div><div><div className="text-xs font-bold mb-1.5">匹配会员身份</div><div className="flex flex-wrap gap-1.5">{groupRuleRoleOptions.map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.memberRoles.includes(role) ? "#1e293b" : "#f1f5f9", color: rule.memberRoles.includes(role) ? S.accent : S.muted, border: `1px solid ${rule.memberRoles.includes(role) ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.memberRoles.includes(role)} onChange={() => toggleListValue(idx, "memberRoles", role)} />{role}</label>)}</div></div><div><div className="text-xs font-bold mb-1.5">管理地区</div><div className="flex flex-wrap gap-1.5">{groupRuleCityOptions.map(city => <label key={city} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.cities.includes(city) ? "#1e293b" : "#f1f5f9", color: rule.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${rule.cities.includes(city) ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.cities.includes(city)} onChange={() => toggleListValue(idx, "cities", city)} />{city}</label>)}</div></div></div>)}<button type="button" className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => onChange([...rules, { id: `custom-${Date.now()}`, name: "新群类型", code: `PL${String(rules.length + 1).padStart(2, "0")}`, memberRoles: [], capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: `{project}·{type}·{seq}群`, enabled: false }])}><Plus size={13} className="inline mr-1" />新增平台群类型规则</button></div>;
}

function PlatformConfigDrawer({
  platform,
  onClose,
  onSave,
}: {
  platform: PlatformItem;
  onClose: () => void;
  onSave: (platform: PlatformItem) => void;
}) {
  const [draft, setDraft] = useState(platform);
  const { rulesByScope } = useCommunityData();
  const platformRulesKey = getCommunityScopeKey(platform.name, "platform");
  const [groupRules, setGroupRules] = useState<GroupTypeRule[]>(() => rulesByScope[platformRulesKey] ?? []);
  useEffect(() => {
    setGroupRules(rulesByScope[platformRulesKey] ?? []);
  }, [platformRulesKey, rulesByScope]);
  const fieldStyle = { width: "100%", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, padding: "8px 10px", fontSize: 12, background: S.surface, color: S.text };
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[520px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div><div className="text-sm font-bold" style={{ color: S.text }}>平台配置</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.name}</div></div>
          <button type="button" aria-label="关闭平台配置" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 text-xs leading-relaxed" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.3)`, borderRadius: S.radiusSm }}><b>归属关系</b><div className="mt-1" style={{ color: S.textSec }}>SaaS 合作伙伴：{getPlatformOwnerLabel(draft)} · 所属生态：{draft.eco}</div></div>
          <label className="block text-xs font-bold">平台名称<input className="mt-1" style={fieldStyle} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="block text-xs font-bold">平台描述<textarea className="mt-1" rows={4} style={{ ...fieldStyle, resize: "vertical" }} value={draft.desc} onChange={e => setDraft({ ...draft, desc: e.target.value })} /></label>
          <label className="block text-xs font-bold">平台状态<select className="mt-1" style={fieldStyle} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}><option>运营中</option><option>生产中</option><option>孵化中</option><option>暂停运营</option><option>已归档</option></select></label>
          <label className="block text-xs font-bold">数据接入状态<select className="mt-1" style={fieldStyle} value={draft.dataStatus ?? "待接入"} onChange={e => setDraft({ ...draft, dataStatus: e.target.value })}><option>待接入</option><option>接入中</option><option>已接入</option><option>异常</option></select></label>
          <PlatformGroupRulesEditor platform={draft.name} rules={groupRules} onChange={setGroupRules} />
          <div className="grid grid-cols-2 gap-3 text-xs"><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>下辖项目</div><b className="text-base">{draft.projects}</b></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>平台用户</div><b className="text-base">{draft.users.toLocaleString()}</b></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>运营群组</div><b className="text-base">{draft.groups}</b></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>平台状态</div><b className="text-base">{draft.status}</b></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>数据接入</div><b className="text-base">{draft.dataStatus ?? "待接入"}</b></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div style={{ color: S.muted }}>月营收</div><b className="text-base">{draft.revenue}</b></div></div>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => { saveScopeRules(draft.name, "platform", undefined, groupRules); onSave(draft); onClose(); }}><Save size={13} className="inline mr-1" />保存平台配置</button></div>
      </aside>
    </div>
  );
}

// ─── 第 4 层：平台视图（平台列表 → 进入平台 → 项目列表） ─────
function PlatformView({
  platformList, setPlatformList, ecoList, saasList, projectList, setProjectList, role, onEnterPlatform, ecoFilter,
}: {
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>; ecoList: EcoItem[]; saasList: SaasItem[];
  projectList: ProjectItem[]; setProjectList: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  role: string;
  onEnterPlatform: (id: number, name: string) => void;
  ecoFilter?: string;
}) {
  const [filterEco, setFilterEco] = useState<string>(ecoFilter || "全部生态");
  useEffect(() => {
    setFilterEco(ecoFilter || "全部生态");
  }, [ecoFilter]);
  const [createPlatformOpen, setCreatePlatformOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [configPlatform, setConfigPlatform] = useState<PlatformItem | null>(null);
  const [communityPlatform, setCommunityPlatform] = useState<string>(platformList[0]?.name || "");
  const isPlatformScopedRole = ["平台管理员", "平台运营", "项目负责人", "区域运营"].includes(role);
  const currentPlatformName = isPlatformScopedRole ? platformList[0]?.name : communityPlatform;
  useEffect(() => {
    const nextPlatform = isPlatformScopedRole ? platformList[0]?.name || "" : communityPlatform;
    if (nextPlatform !== communityPlatform && (!communityPlatform || !platformList.some(platform => platform.name === communityPlatform) || isPlatformScopedRole)) {
      setCommunityPlatform(nextPlatform);
    }
  }, [communityPlatform, isPlatformScopedRole, platformList]);
  const { rulesByScope } = useCommunityData();
  const { setApprovals } = useApprovals();

  const filtered = filterEco === "全部生态" ? platformList : platformList.filter(p => p.eco === filterEco);
  const ecoOptions = ["全部生态", ...Array.from(new Set(platformList.map(p => p.eco)))];
  const totalProjects = platformList.reduce((n, p) => n + p.projects, 0);
  const totalUsers = platformList.reduce((n, p) => n + p.users, 0);
  const totalGroups = platformList.reduce((n, p) => n + p.groups, 0);
  const revenueLabel = platformList.length === 1 ? platformList[0]?.revenue ?? "待接入" : "待汇总";
  const scrollToSection = (section: string) => {
    const target = Array.from(document.querySelectorAll<HTMLElement>(`[data-section="${section}"]`)).find(element => element.offsetParent !== null);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <div id="platform-overview" data-section="overview" className="space-y-3">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div><span className="text-sm font-bold" style={{ color: S.text }}>平台工作台</span><div className="text-xs mt-1" style={{ color: S.muted }}>当前可管理 {platformList.length} 个平台 · 按平台聚合项目、社群与运营配置</div></div>
      <div className="flex flex-wrap gap-2">
        <select className="flex-1 px-3 py-1.5 text-xs font-bold sm:flex-none" aria-label="筛选所属生态" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
          {ecoOptions.map(o => <option key={o}>{o}</option>)}
        </select>
        <CreateResourceMenu role={role} onSelect={kind => {
          if (kind === "platform") setCreatePlatformOpen(true);
          if (kind === "project" && filtered.length > 0 && currentPlatformName) setCreateProjectOpen(true);
        }} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {[['运营项目', totalProjects, LayoutDashboard], ['平台用户', totalUsers.toLocaleString(), Eye], ['平台群组', totalGroups, MessageSquare], ['本月营收', revenueLabel, TrendingUp]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2.5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Icon size={15} style={{ color: S.primary }} /><div className="min-w-0"><div className="truncate text-sm font-bold">{value as string | number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="平台工作台导航">
      {[
        ["平台总览", LayoutDashboard, () => scrollToSection("overview")],
        ["项目运营", Package, () => scrollToSection("projects")],
        ["平台级社群", MessageSquare, () => scrollToSection("community")],
        ["平台配置", Settings, () => setConfigPlatform(platformList.find(platform => platform.name === communityPlatform) || platformList[0] || null)],
      ].map(([label, Icon, action]) => (
        <button key={label as string} type="button" className="flex items-center gap-2 px-3 py-2 text-left text-xs font-bold transition-colors" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={action as () => void}>
          <Icon size={14} style={{ color: S.primary }} />
          <span className="truncate">{label as string}</span>
          <ChevronRight size={12} className="ml-auto flex-shrink-0" style={{ color: S.mutedLight }} />
        </button>
      ))}
    </div>
    <div data-section="community" className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between gap-3">
        <div><div className="text-sm font-bold">平台级社群工作台</div><div className="text-xs mt-1" style={{ color: S.muted }}>当前平台：{communityPlatform} · 平台 Scope 独立管理社群规则与群组</div></div>
        <select className="px-2.5 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} value={communityPlatform} onChange={event => setCommunityPlatform(event.target.value)}>
          {platformList.map(platform => <option key={platform.id} value={platform.name}>{platform.name}</option>)}
        </select>
      </div>
      <ProjectCommunitySystem
        platform={communityPlatform}
        scope="platform"
        rules={rulesByScope[getCommunityScopeKey(communityPlatform, "platform")] ?? []}
        onGoRules={() => setConfigPlatform(platformList.find(platform => platform.name === communityPlatform) || null)}
      />
    </div>
    <div id="platform-projects" data-section="projects" className="hidden lg:block overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
          {([["平台名称",220],["SaaS 合作伙伴",150],["所属生态",130],["下辖项目/用户/群组",200],["服务老师",100],["月营收",110],["状态",90],["操作",140]] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
        </div>
        {filtered.map((pf, idx) => (
          <div key={pf.id} role="button" tabIndex={0} className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono" style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }} onClick={() => onEnterPlatform(pf.id, pf.name)} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onEnterPlatform(pf.id, pf.name); } }}>
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 220 }}><div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{pf.name[3] ?? pf.name[0]}</div><span className="font-bold">{pf.name}</span></div>
            <div className="flex-shrink-0" style={{ width: 150, color: S.muted }}>{getPlatformOwnerLabel(pf)}</div>
            <div className="flex-shrink-0" style={{ width: 130, color: S.muted }}>{pf.eco}</div>
            <div className="flex-shrink-0" style={{ width: 200 }}><span className="font-bold">{pf.projects}</span><span style={{ color: S.muted }}> 项目 / </span><span className="font-bold">{pf.users.toLocaleString()}</span><span style={{ color: S.muted }}> 用户 / </span><span className="font-bold">{pf.groups}</span><span style={{ color: S.muted }}> 群</span></div>
            <div className="flex-shrink-0" style={{ width: 100, color: S.text }}>{pf.teachers} 人</div>
            <div className="flex-shrink-0 font-bold" style={{ width: 110, color: S.text }}>{pf.revenue}</div>
            <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[pf.status]?.bg, color: statusCfg[pf.status]?.color, borderRadius: S.radiusSm }}>{pf.status}</span></div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 140 }} onClick={e => e.stopPropagation()}>
              <button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => onEnterPlatform(pf.id, pf.name)}>进入平台</button>
              <button type="button" className="px-1.5 py-1" title="平台配置" aria-label={`配置平台 ${pf.name}`} style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={() => setConfigPlatform(pf)}><Settings size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    <div data-section="projects" className="lg:hidden space-y-2">
      {filtered.map(pf => (
        <article key={pf.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
          <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 min-w-0"><div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{pf.name[3] ?? pf.name[0]}</div><div className="min-w-0"><div className="text-sm font-bold truncate">{pf.name}</div><div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>{getPlatformOwnerLabel(pf)} · {pf.eco}</div></div></div><span className="px-1.5 py-0.5 text-[10px] font-bold flex-shrink-0" style={{ background: statusCfg[pf.status]?.bg, color: statusCfg[pf.status]?.color, borderRadius: S.radiusSm }}>{pf.status}</span></div>
          <div className="grid grid-cols-3 gap-2 text-xs"><div><div className="font-bold">{pf.projects}</div><div style={{ color: S.muted }}>项目</div></div><div><div className="font-bold">{pf.users.toLocaleString()}</div><div style={{ color: S.muted }}>用户</div></div><div><div className="font-bold">{pf.groups}</div><div style={{ color: S.muted }}>群组</div></div></div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => onEnterPlatform(pf.id, pf.name)}>进入平台</button><button type="button" className="px-3 py-2 text-xs font-bold" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={() => setConfigPlatform(pf)}>配置</button></div>
        </article>
      ))}
    </div>
    {createPlatformOpen && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} onClose={() => setCreatePlatformOpen(false)} onCreate={({ name, saas, partner, eco, desc }) => {
      setPlatformList(list => [...list, { id: Date.now(), name, partner, saas, eco, desc, projects: 0, users: 0, groups: 0, teachers: 0, revenue: "待接入", status: "孵化中", dataStatus: "待接入" }]);
        const ownerLabel = getPlatformOwnerLabel({ partner, saas });
        const approval = createApproval("platform_onboard", {
          title: `平台入驻：${name}（${ownerLabel}）`,
          submitter: "平台管理员",
          description: partner ? `在${partner} SaaS 合作伙伴下新建平台「${name}」，所属${eco}生态` : `由超级生态直接新建平台「${name}」，所属${eco}生态`,
          detail: { 平台名称: name, 所属合作伙伴: ownerLabel, 所属生态: eco, 描述: desc || "—" },
        payload: { type: "platform_onboard", name, saas, eco, desc: desc || "" },
      });
      setApprovals(prev => [approval, ...prev]);
      setCreatePlatformOpen(false);
    }} />}
    {createProjectOpen && currentPlatformName && <CreateProjectDrawer ecoList={ecoList} saasList={saasList} platformList={platformList} defaultPlatform={currentPlatformName} platformLocked={isPlatformScopedRole} onClose={() => setCreateProjectOpen(false)} onCreate={p => { registerScopeRules(p.platform, "project", p.name, p.groupTypes); setProjectList(list => [p, ...list]); setCreateProjectOpen(false); setToast(`项目「${p.name}」已创建`); }} />}
    {configPlatform && <PlatformConfigDrawer platform={configPlatform} onClose={() => setConfigPlatform(null)} onSave={next => setPlatformList(list => list.map(item => item.id === next.id ? next : item))} />}
  </div>;
}

// ─── 商业与计费：类型定义 ─────────────────────────────────────
type PricingTier = "super" | "eco" | "saas" | "platform" | "project" | "addon";
type PricingPlan = {
  tier: PricingTier;
  key: string;
  name: string;
  priceCnyYear: number;
  quota: {
    platforms?: number;
    projects?: number;
    users?: number;
    groups?: number;
    teachers?: number;
    apiCalls?: number;
  };
  features: string[];
  highlight?: boolean;
};
type Subscription = {
  id: string;
  subscriberType: PricingTier;
  subscriberName: string;
  planKey: string;
  priceCny: number;
  cycle: "yearly" | "monthly" | "once";
  startAt: string;
  endAt: string;
  status: "active" | "expiring" | "expired" | "pending";
  gmvShareRate?: number;
};
type BillRecord = {
  id: string;
  payerType: PricingTier;
  payerName: string;
  amountCny: number;
  items: string[];
  status: "paid" | "pending" | "overdue";
  dueAt: string;
};
type GmvShare = {
  id: string;
  fromTier: PricingTier;
  fromName: string;
  toTier: PricingTier;
  toName: string;
  amountCny: number;
  gmv: number;
  rate: number;
  period: string;
};

// ─── 商业与计费：Mock 定价方案 ─────────────────────────────────
const pricingPlans: PricingPlan[] = [
  { tier: "super", key: "super-foundation", name: "超级态·基础版", priceCnyYear: 0,
    quota: { platforms: 999, projects: 9999, users: 999999, groups: 99999, teachers: 999, apiCalls: 9999999 },
    features: ["全局数据看板", "多租户隔离管控", "跨生态统一账号", "全层级分润配置", "私有化部署可选", "7×24 专属技术支持"],
    highlight: true },
  { tier: "eco", key: "eco-starter", name: "生态·孵化版", priceCnyYear: 29800,
    quota: { platforms: 5, projects: 30, users: 50000, groups: 500, teachers: 20, apiCalls: 500000 },
    features: ["单行业生态席位", "下辖 5 个 SaaS 招募名额", "基础分润链路", "生态运营数据看板", "标准技术支持"] },
  { tier: "eco", key: "eco-growth", name: "生态·成长版", priceCnyYear: 98000,
    quota: { platforms: 20, projects: 150, users: 200000, groups: 3000, teachers: 80, apiCalls: 2000000 },
    features: ["下辖 20 个 SaaS 招募名额", "二级分润链路", "多 SaaS 资源池调配", "生态行业顾问 1v1", "季度运营复盘"],
    highlight: true },
  { tier: "eco", key: "eco-flagship", name: "生态·旗舰版", priceCnyYear: 298000,
    quota: { platforms: 100, projects: 1000, users: 1000000, groups: 20000, teachers: 500, apiCalls: 10000000 },
    features: [" SaaS 招募不限量", "三级分润链路", "独立数据中台部署", "专属客户成功团队", "联合品牌活动支持"] },
  { tier: "saas", key: "saas-basic", name: "SaaS·基础版", priceCnyYear: 19800,
    quota: { platforms: 3, projects: 20, users: 20000, groups: 300, teachers: 10, apiCalls: 300000 },
    features: ["招募 3 个平台", "20 个运营项目", "基础私域社群能力", "标准 API 接入", "工单支持"] },
  { tier: "saas", key: "saas-standard", name: "SaaS·标准版", priceCnyYear: 59800,
    quota: { platforms: 10, projects: 80, users: 100000, groups: 1500, teachers: 40, apiCalls: 1200000 },
    features: ["招募 10 个平台", "会员等级体系", "自动化运营工具", "二级分润能力", "专属客户经理"],
    highlight: true },
  { tier: "saas", key: "saas-flagship", name: "SaaS·旗舰版", priceCnyYear: 168000,
    quota: { platforms: 50, projects: 500, users: 500000, groups: 10000, teachers: 200, apiCalls: 6000000 },
    features: ["招募 50 个平台", "三级分润结算", "数据大屏定制", "独立部署选项", "季度业务复盘"] },
  { tier: "saas", key: "saas-private", name: "SaaS·私有化", priceCnyYear: 498000,
    quota: { platforms: 999, projects: 9999, users: 999999, groups: 99999, teachers: 999, apiCalls: 9999999 },
    features: ["独立服务器部署", "全量代码交付", "定制化开发支持", "数据本地加密", "专属运维团队"] },
  { tier: "platform", key: "platform-operator", name: "平台·运营版", priceCnyYear: 5980,
    quota: { projects: 10, users: 10000, groups: 200, teachers: 5, apiCalls: 100000 },
    features: ["10 个运营项目", "企业微信接入", "社群自动化工具", "基础数据看板", "在线客服支持"] },
  { tier: "platform", key: "platform-brand", name: "平台·品牌版", priceCnyYear: 19800,
    quota: { projects: 50, users: 80000, groups: 1000, teachers: 30, apiCalls: 800000 },
    features: ["50 个运营项目", "多级会员体系", "分销与分润结算", "品牌定制能力", "专属运营顾问"],
    highlight: true },
  { tier: "project", key: "project-basic", name: "项目·基础版", priceCnyYear: 999,
    quota: { users: 2000, groups: 20, teachers: 2, apiCalls: 30000 },
    features: ["单项目席位", "社群管理工具", "会员等级 3 级", "基础数据统计", "工单支持"] },
  { tier: "project", key: "project-standard", name: "项目·标准版", priceCnyYear: 3999,
    quota: { users: 10000, groups: 80, teachers: 8, apiCalls: 150000 },
    features: ["社群自动化运营", "会员等级 8 级", "分群路由规则", "运营 SOP 模板", "在线客服支持"],
    highlight: true },
  { tier: "project", key: "project-flagship", name: "项目·旗舰版", priceCnyYear: 9999,
    quota: { users: 50000, groups: 300, teachers: 20, apiCalls: 600000 },
    features: ["高级分润链路", "数据大屏接入", "企业微信深度集成", "专属客户经理", "定制功能优先"] },
  { tier: "addon", key: "addon-data", name: "增值·数据中台", priceCnyYear: 49800,
    quota: { apiCalls: 5000000 }, features: ["跨项目数据汇总", "自定义数据大屏", "BI 报表导出", "数据仓库对接"] },
  { tier: "addon", key: "addon-ai", name: "增值·AI 助理", priceCnyYear: 29800,
    quota: { apiCalls: 2000000 }, features: ["AI 话术生成", "智能客服机器人", "内容审核辅助", "用户画像标签"] },
  { tier: "addon", key: "addon-settlement", name: "增值·分润结算", priceCnyYear: 39800,
    quota: {}, features: ["多级分润引擎", "实时结算流水", "税务合规支持", "财务对账系统"] },
  { tier: "addon", key: "addon-training", name: "增值·运营陪跑", priceCnyYear: 88000,
    quota: { teachers: 10 }, features: ["专属运营顾问", "季度线下培训", "SOP 体系搭建", "行业资源对接"] },
  { tier: "addon", key: "addon-security", name: "增值·安全合规", priceCnyYear: 58000,
    quota: {}, features: ["等级保护测评", "数据加密增强", "安全审计日志", "合规咨询支持"] },
];

// ─── 商业与计费：Mock 订阅记录 ─────────────────────────────────
const subscriptions: Subscription[] = [
  { id: "SUB-001", subscriberType: "eco", subscriberName: "健康医药美业生态", planKey: "eco-flagship", priceCny: 298000, cycle: "yearly", startAt: "2026-01-15", endAt: "2027-01-14", status: "active", gmvShareRate: 0.12 },
  { id: "SUB-002", subscriberType: "eco", subscriberName: "知识付费生态", planKey: "eco-growth", priceCny: 98000, cycle: "yearly", startAt: "2026-03-01", endAt: "2027-02-28", status: "active", gmvShareRate: 0.08 },
  { id: "SUB-003", subscriberType: "eco", subscriberName: "宠物生态", planKey: "eco-starter", priceCny: 29800, cycle: "yearly", startAt: "2026-04-10", endAt: "2027-04-09", status: "active", gmvShareRate: 0.05 },
  { id: "SUB-004", subscriberType: "eco", subscriberName: "教育生态", planKey: "eco-growth", priceCny: 98000, cycle: "yearly", startAt: "2025-12-01", endAt: "2026-11-30", status: "expiring", gmvShareRate: 0.08 },
  { id: "SUB-005", subscriberType: "saas", subscriberName: "健康产业发展伙伴", planKey: "saas-flagship", priceCny: 168000, cycle: "yearly", startAt: "2026-02-20", endAt: "2027-02-19", status: "active", gmvShareRate: 0.10 },
  { id: "SUB-006", subscriberType: "saas", subscriberName: "知识教育发展伙伴", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2026-01-10", endAt: "2027-01-09", status: "active", gmvShareRate: 0.07 },
  { id: "SUB-007", subscriberType: "saas", subscriberName: "代理渠道发展伙伴", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2026-03-15", endAt: "2027-03-14", status: "active", gmvShareRate: 0.07 },
  { id: "SUB-008", subscriberType: "saas", subscriberName: "教育学习发展伙伴", planKey: "saas-basic", priceCny: 19800, cycle: "yearly", startAt: "2025-11-20", endAt: "2026-11-19", status: "expiring", gmvShareRate: 0.05 },
  { id: "SUB-009", subscriberType: "saas", subscriberName: "教育内容发展伙伴", planKey: "saas-basic", priceCny: 19800, cycle: "yearly", startAt: "2026-05-01", endAt: "2027-04-30", status: "pending" },
  { id: "SUB-010", subscriberType: "saas", subscriberName: "城市运营发展伙伴", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2025-09-01", endAt: "2026-08-31", status: "expired", gmvShareRate: 0.07 },
  { id: "SUB-011", subscriberType: "platform", subscriberName: "健康运营平台", planKey: "platform-brand", priceCny: 19800, cycle: "yearly", startAt: "2026-01-20", endAt: "2027-01-19", status: "active", gmvShareRate: 0.05 },
  { id: "SUB-012", subscriberType: "platform", subscriberName: "健康课程平台", planKey: "platform-brand", priceCny: 19800, cycle: "yearly", startAt: "2026-02-10", endAt: "2027-02-09", status: "active", gmvShareRate: 0.05 },
  { id: "SUB-013", subscriberType: "platform", subscriberName: "代理分销平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2026-03-25", endAt: "2027-03-24", status: "active" },
  { id: "SUB-014", subscriberType: "platform", subscriberName: "教育学习平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2025-12-15", endAt: "2026-12-14", status: "expiring" },
  { id: "SUB-015", subscriberType: "platform", subscriberName: "教育直播平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2026-04-01", endAt: "2027-03-31", status: "active" },
  { id: "SUB-016", subscriberType: "project", subscriberName: "PRO会员", planKey: "project-flagship", priceCny: 9999, cycle: "yearly", startAt: "2026-01-05", endAt: "2027-01-04", status: "active" },
  { id: "SUB-017", subscriberType: "project", subscriberName: "体验官", planKey: "project-standard", priceCny: 3999, cycle: "yearly", startAt: "2026-02-15", endAt: "2027-02-14", status: "active" },
  { id: "SUB-018", subscriberType: "project", subscriberName: "7日训练营", planKey: "project-basic", priceCny: 999, cycle: "once", startAt: "2026-06-01", endAt: "2099-12-31", status: "active" },
  { id: "SUB-019", subscriberType: "addon", subscriberName: "健康产业发展伙伴·数据中台", planKey: "addon-data", priceCny: 49800, cycle: "yearly", startAt: "2026-03-01", endAt: "2027-02-28", status: "active" },
  { id: "SUB-020", subscriberType: "addon", subscriberName: "健康医药美业·分润结算", planKey: "addon-settlement", priceCny: 39800, cycle: "yearly", startAt: "2026-04-15", endAt: "2027-04-14", status: "active" },
];

// ─── 商业与计费：Mock 账单记录 ─────────────────────────────────
const billRecords: BillRecord[] = [
  { id: "INV-2026-0801", payerType: "eco", payerName: "健康医药美业生态", amountCny: 298000, items: ["生态·旗舰版 年费"], status: "paid", dueAt: "2026-01-15" },
  { id: "INV-2026-0802", payerType: "eco", payerName: "知识付费生态", amountCny: 98000, items: ["生态·成长版 年费"], status: "paid", dueAt: "2026-03-01" },
  { id: "INV-2026-0803", payerType: "saas", payerName: "健康产业发展伙伴", amountCny: 168000, items: ["SaaS·旗舰版 年费"], status: "paid", dueAt: "2026-02-20" },
  { id: "INV-2026-0804", payerType: "saas", payerName: "知识教育发展伙伴", amountCny: 59800, items: ["SaaS·标准版 年费"], status: "paid", dueAt: "2026-01-10" },
  { id: "INV-2026-0805", payerType: "eco", payerName: "教育生态", amountCny: 98000, items: ["生态·成长版 续费"], status: "pending", dueAt: "2026-11-30" },
  { id: "INV-2026-0806", payerType: "saas", payerName: "教育学习发展伙伴", amountCny: 19800, items: ["SaaS·基础版 续费"], status: "pending", dueAt: "2026-11-19" },
  { id: "INV-2026-0807", payerType: "platform", payerName: "教育学习平台", amountCny: 5980, items: ["平台·运营版 续费"], status: "pending", dueAt: "2026-12-14" },
  { id: "INV-2026-0808", payerType: "saas", payerName: "城市运营发展伙伴", amountCny: 59800, items: ["SaaS·标准版 欠费"], status: "overdue", dueAt: "2026-08-31" },
  { id: "INV-2026-0809", payerType: "saas", payerName: "教育内容发展伙伴", amountCny: 19800, items: ["SaaS·基础版 首年"], status: "pending", dueAt: "2026-05-01" },
  { id: "INV-2026-0810", payerType: "platform", payerName: "健康运营平台", amountCny: 19800, items: ["平台·品牌版 年费"], status: "paid", dueAt: "2026-01-20" },
  { id: "INV-2026-0811", payerType: "project", payerName: "PRO会员", amountCny: 9999, items: ["项目·旗舰版 年费"], status: "paid", dueAt: "2026-01-05" },
  { id: "INV-2026-0812", payerType: "addon", payerName: "健康产业发展伙伴·数据中台", amountCny: 49800, items: ["增值·数据中台 年费"], status: "paid", dueAt: "2026-03-01" },
  { id: "INV-2026-0813", payerType: "addon", payerName: "健康医药美业·分润结算", amountCny: 39800, items: ["增值·分润结算 年费"], status: "paid", dueAt: "2026-04-15" },
  { id: "INV-2026-0814", payerType: "eco", payerName: "宠物生态", amountCny: 29800, items: ["生态·孵化版 年费"], status: "paid", dueAt: "2026-04-10" },
  { id: "INV-2026-0815", payerType: "project", payerName: "7日训练营", amountCny: 999, items: ["项目·基础版 一次性"], status: "paid", dueAt: "2026-06-01" },
];

// ─── 商业与计费：Mock 分润流水 ─────────────────────────────────
const gmvShares: GmvShare[] = [
  { id: "SH-001", fromTier: "project", fromName: "PRO会员", toTier: "platform", toName: "健康运营平台", amountCny: 28000, gmv: 280000, rate: 0.10, period: "2026-08" },
  { id: "SH-002", fromTier: "platform", fromName: "健康运营平台", toTier: "saas", toName: "健康产业发展伙伴", amountCny: 42000, gmv: 420000, rate: 0.10, period: "2026-08" },
  { id: "SH-003", fromTier: "saas", fromName: "健康产业发展伙伴", toTier: "eco", toName: "健康医药美业生态", amountCny: 50400, gmv: 504000, rate: 0.10, period: "2026-08" },
  { id: "SH-004", fromTier: "eco", fromName: "健康医药美业生态", toTier: "super", toName: "超级生态", amountCny: 60480, gmv: 504000, rate: 0.12, period: "2026-08" },
  { id: "SH-005", fromTier: "project", fromName: "体验官", toTier: "platform", toName: "健康运营平台", amountCny: 12000, gmv: 120000, rate: 0.10, period: "2026-08" },
  { id: "SH-006", fromTier: "project", fromName: "7日训练营", toTier: "platform", toName: "健康课程平台", amountCny: 6000, gmv: 60000, rate: 0.10, period: "2026-08" },
  { id: "SH-007", fromTier: "platform", fromName: "健康课程平台", toTier: "saas", toName: "知识教育发展伙伴", amountCny: 11200, gmv: 160000, rate: 0.07, period: "2026-08" },
  { id: "SH-008", fromTier: "saas", fromName: "知识教育发展伙伴", toTier: "eco", toName: "知识付费生态", amountCny: 12800, gmv: 160000, rate: 0.08, period: "2026-08" },
  { id: "SH-009", fromTier: "project", fromName: "健康学院", toTier: "platform", toName: "教育学习平台", amountCny: 15000, gmv: 150000, rate: 0.10, period: "2026-07" },
  { id: "SH-010", fromTier: "platform", fromName: "教育学习平台", toTier: "saas", toName: "教育学习发展伙伴", amountCny: 8000, gmv: 160000, rate: 0.05, period: "2026-07" },
  { id: "SH-011", fromTier: "saas", fromName: "教育学习发展伙伴", toTier: "eco", toName: "教育生态", amountCny: 12800, gmv: 160000, rate: 0.08, period: "2026-07" },
  { id: "SH-012", fromTier: "project", fromName: "代理商", toTier: "platform", toName: "代理分销平台", amountCny: 7000, gmv: 70000, rate: 0.10, period: "2026-08" },
  { id: "SH-013", fromTier: "platform", fromName: "代理分销平台", toTier: "saas", toName: "代理渠道发展伙伴", amountCny: 7700, gmv: 110000, rate: 0.07, period: "2026-08" },
  { id: "SH-014", fromTier: "saas", fromName: "代理渠道发展伙伴", toTier: "eco", toName: "健康医药美业生态", amountCny: 13200, gmv: 110000, rate: 0.12, period: "2026-08" },
  { id: "SH-015", fromTier: "project", fromName: "宠物用品商城", toTier: "platform", toName: "宠物分销平台", amountCny: 800, gmv: 8000, rate: 0.10, period: "2026-08" },
  { id: "SH-016", fromTier: "platform", fromName: "宠物分销平台", toTier: "saas", toName: "宠物产业发展伙伴", amountCny: 1200, gmv: 24000, rate: 0.05, period: "2026-08" },
  { id: "SH-017", fromTier: "eco", fromName: "知识付费生态", toTier: "super", toName: "超级生态", amountCny: 19200, gmv: 240000, rate: 0.08, period: "2026-07" },
  { id: "SH-018", fromTier: "eco", fromName: "教育生态", toTier: "super", toName: "超级生态", amountCny: 19200, gmv: 240000, rate: 0.08, period: "2026-08" },
];

// ─── 商业与计费：组件辅助 ─────────────────────────────────────
const tierLabels: Record<PricingTier, string> = {
  super: "超级态", eco: "生态", saas: "SaaS 合作伙伴", platform: "平台", project: "项目", addon: "增值包",
};
const tierIcons: Record<PricingTier, any> = {
  super: Zap, eco: Globe, saas: Package, platform: Building2, project: LayoutDashboard, addon: Layers,
};
const planMap: Record<string, PricingPlan> = {};
pricingPlans.forEach(p => { planMap[p.key] = p; });
const subStatusCfg: Record<Subscription["status"], { bg: string; color: string; label: string }> = {
  active:   { bg: "rgba(34,197,94,0.12)",  color: "#16a34a", label: "生效中" },
  expiring: { bg: "rgba(234,179,8,0.15)",  color: "#ca8a04", label: "即将到期" },
  expired:  { bg: "rgba(239,68,68,0.12)",  color: "#dc2626", label: "已过期" },
  pending:  { bg: "rgba(107,114,128,0.12)", color: "#6b7280", label: "待开通" },
};
const billStatusCfg: Record<BillRecord["status"], { bg: string; color: string; label: string }> = {
  paid:    { bg: "rgba(34,197,94,0.12)",  color: "#16a34a", label: "已支付" },
  pending: { bg: "rgba(234,179,8,0.15)",  color: "#ca8a04", label: "待支付" },
  overdue: { bg: "rgba(239,68,68,0.12)",  color: "#dc2626", label: "已逾期" },
};
function fmtCny(n: number) { return "¥" + n.toLocaleString("zh-CN"); }
function findPlan(key: string) { return planMap[key]; }

// ─── 商业与计费：定价方案卡片 ─────────────────────────────────
function PricingCard({ plan }: { plan: PricingPlan }) {
  const Icon = tierIcons[plan.tier];
  const { setApprovals } = useApprovals();
  const [done, setDone] = useState(false);
  function handleSubscribe() {
    const subscriberName = `${tierLabels[plan.tier]}·新订阅方`;
    const approval = createApproval("subscription_open", {
      title: `订阅开通：${plan.name}（${subscriberName}）`,
      submitter: "商业运营",
      description: `申请为${subscriberName}开通「${plan.name}」，年费 ${plan.priceCnyYear === 0 ? "免费" : fmtCny(plan.priceCnyYear)}`,
      detail: {
        套餐: plan.name,
        订阅方: subscriberName,
        年费: plan.priceCnyYear === 0 ? "免费" : fmtCny(plan.priceCnyYear),
        周期: plan.priceCnyYear === 0 ? "一次性" : "年付",
      },
      payload: {
        type: "subscription_open",
        planKey: plan.key,
        planName: plan.name,
        subscriberName,
        priceCny: plan.priceCnyYear,
        cycle: plan.priceCnyYear === 0 ? "once" : "yearly",
      },
    });
    setApprovals(prev => [approval, ...prev]);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <div className="p-4 relative flex flex-col" style={{
      background: plan.highlight ? "#1e293b" : S.surface,
      border: plan.highlight ? `2px solid ${S.accent}` : `1px solid ${S.border}`,
      borderRadius: S.radius, boxShadow: plan.highlight ? "0 6px 24px rgba(204,255,0,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {plan.highlight && (
        <div className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accent, color: "#1e293b", borderRadius: S.radiusSm }}>
          推荐方案
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{
          background: plan.highlight ? S.accent : "#1e293b",
          color: plan.highlight ? "#1e293b" : S.accent, borderRadius: S.radiusSm,
        }}><Icon size={14} /></div>
        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5" style={{
          background: plan.highlight ? "rgba(255,255,255,0.1)" : S.accentLight,
          color: plan.highlight ? S.accent : "#1e293b", borderRadius: S.radiusSm,
        }}>{tierLabels[plan.tier]}</span>
      </div>
      <div className="text-sm font-bold mb-0.5" style={{ color: plan.highlight ? "#ffffff" : S.text }}>{plan.name}</div>
      <div className="mb-3">
        <span className="text-xl font-bold" style={{ color: plan.highlight ? S.accent : S.text }}>
          {plan.priceCnyYear === 0 ? "免费" : fmtCny(plan.priceCnyYear)}
        </span>
        {plan.priceCnyYear > 0 && <span className="text-xs font-mono ml-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : S.muted }}>/年</span>}
      </div>
      <div className="space-y-1 mb-3 p-2" style={{ background: plan.highlight ? "rgba(255,255,255,0.05)" : "#f1f5f9", borderRadius: S.radiusSm }}>
        {Object.entries(plan.quota).length === 0 ? (
          <div className="text-[10px] font-mono" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : S.muted }}>按服务包计</div>
        ) : Object.entries(plan.quota).map(([k, v]) => {
          const label: Record<string, string> = { platforms: "平台", projects: "项目", users: "用户", groups: "群组", teachers: "老师", apiCalls: "API 调用" };
          return (
            <div key={k} className="flex justify-between text-[10px] font-mono">
              <span style={{ color: plan.highlight ? "rgba(255,255,255,0.55)" : S.muted }}>{label[k]}</span>
              <span className="font-bold" style={{ color: plan.highlight ? "#ffffff" : S.text }}>
                {typeof v === "number" && v >= 999999 ? "不限" : typeof v === "number" ? v.toLocaleString() : v}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex-1 space-y-1 mb-3">
        {plan.features.map(f => (
          <div key={f} className="flex items-start gap-1.5 text-[10px] font-mono" style={{ color: plan.highlight ? "rgba(255,255,255,0.75)" : S.textSec }}>
            <CheckCircle size={11} className="flex-shrink-0 mt-0.5" style={{ color: plan.highlight ? S.accent : "#16a34a" }} />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleSubscribe} className="w-full py-2 text-xs font-bold" style={{
        background: done ? "#16a34a" : (plan.highlight ? S.accent : "#1e293b"),
        color: done ? "#ffffff" : (plan.highlight ? "#1e293b" : S.accent), borderRadius: S.radiusSm,
      }}>
        {done ? "已推送审批单 ✓" : (plan.priceCnyYear === 0 ? "立即激活" : "立即订阅")}
      </button>
    </div>
  );
}

// ─── 商业与计费：定价方案页 ────────────────────────────────────
function PricingSection() {
  const tiersOrder: PricingTier[] = ["super", "eco", "saas", "platform", "project", "addon"];
  return (
    <div className="space-y-6">
      {tiersOrder.map(tier => {
        const list = pricingPlans.filter(p => p.tier === tier);
        if (list.length === 0) return null;
        const Icon = tierIcons[tier];
        const cols = list.length >= 4 ? 4 : list.length >= 3 ? 3 : list.length === 2 ? 2 : 1;
        return (
          <div key={tier} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
                <Icon size={14} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: S.text }}>{tierLabels[tier]}方案</div>
                <div className="text-[10px] font-mono" style={{ color: S.muted }}>共 {list.length} 个方案</div>
              </div>
            </div>
            <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {list.map(p => <PricingCard key={p.key} plan={p} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 商业与计费：订阅管理页 ────────────────────────────────────
function SubscriptionSection({ subs }: { subs: Subscription[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Subscription["status"]>("all");
  const filtered = subs.filter(s => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search && !(s.subscriberName.includes(search) || s.planKey.includes(search) || s.id.includes(search))) return false;
    return true;
  });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            className="px-3 py-1.5 text-xs font-bold outline-none"
            style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, width: 260 }}
            placeholder="搜索订阅方 / 方案 / 单号"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-1.5 text-xs font-bold"
            style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.text, borderRadius: S.radiusSm }}
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
          >
            {([["all", "全部状态"], ["active", "生效中"], ["expiring", "即将到期"], ["expired", "已过期"], ["pending", "待开通"]] as [any, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          {(["active", "expiring", "expired", "pending"] as Subscription["status"][]).map(st => (
            <span key={st} className="px-2 py-1 text-[10px] font-bold font-mono" style={{ background: subStatusCfg[st].bg, color: subStatusCfg[st].color, borderRadius: S.radiusSm }}>
              {subStatusCfg[st].label} {subs.filter(s => s.status === st).length}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="min-w-[1200px]">
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
            {([["订阅单号",120],["订阅方",180],["层级",80],["方案",170],["金额",100],["周期",80],["有效期",210],["状态",100],["分润比例",90]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {filtered.map((s, idx) => {
            const plan = findPlan(s.planKey);
            return (
              <div key={s.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
                <div className="flex-shrink-0 font-bold" style={{width:120, color: S.textSec}}>{s.id}</div>
                <div className="flex-shrink-0 flex items-center gap-2" style={{width:180}}>
                  <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
                    {s.subscriberName[0]}
                  </div>
                  <span className="font-bold" style={{color:S.text}}>{s.subscriberName}</span>
                </div>
                <div className="flex-shrink-0" style={{width:80}}>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#1e293b", borderRadius: S.radiusSm}}>{tierLabels[s.subscriberType]}</span>
                </div>
                <div className="flex-shrink-0" style={{width:170, color:S.text}}>{plan?.name ?? s.planKey}</div>
                <div className="flex-shrink-0 font-bold" style={{width:100, color:S.text}}>{fmtCny(s.priceCny)}</div>
                <div className="flex-shrink-0" style={{width:80, color:S.muted}}>{{yearly:"年付", monthly:"月付", once:"一次性"}[s.cycle]}</div>
                <div className="flex-shrink-0" style={{width:210, color:S.textSec}}>{s.startAt} → {s.endAt === "2099-12-31" ? "永久" : s.endAt}</div>
                <div className="flex-shrink-0" style={{width:100}}>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: subStatusCfg[s.status].bg, color: subStatusCfg[s.status].color, borderRadius: S.radiusSm }}>
                    {subStatusCfg[s.status].label}
                  </span>
                </div>
                <div className="flex-shrink-0 font-bold" style={{width:90, color:S.text}}>{s.gmvShareRate ? `${(s.gmvShareRate * 100).toFixed(0)}%` : "—"}</div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-xs" style={{color:S.muted}}>暂无匹配的订阅记录</div>}
        </div>
      </div>
    </div>
  );
}

// ─── 商业与计费：分润流向简化图 ────────────────────────────────
function ShareFlowDiagram() {
  const tiers: { id: PricingTier; label: string; Icon: any; amount: string }[] = [
    { id: "project",  label: "项目",  Icon: LayoutDashboard, amount: "¥84.0 万 GMV" },
    { id: "platform", label: "平台",  Icon: Building2,       amount: "¥8.4 万分润" },
    { id: "saas",     label: "SaaS",  Icon: Package,         amount: "¥12.6 万分润" },
    { id: "eco",      label: "生态",  Icon: Globe,           amount: "¥16.9 万分润" },
    { id: "super",    label: "超级态", Icon: Zap,            amount: "¥24.3 万分润" },
  ];
  return (
    <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} style={{ color: "#1e293b" }} />
        <span className="text-sm font-bold" style={{ color: S.text }}>分润流向 · 五级链路</span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: S.muted }}>2026-08 月度汇总</span>
      </div>
      <div className="flex items-stretch gap-0">
        {tiers.map((t, idx) => (
          <div key={t.id} className="flex-1 flex items-center gap-2">
            <div className="flex-1 p-3" style={{
              background: t.id === "super" ? "#1e293b" : S.accentLight,
              border: `1px solid ${t.id === "super" ? S.accent : "rgba(204,255,0,0.3)"}`,
              borderRadius: S.radius,
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 flex items-center justify-center" style={{
                  background: t.id === "super" ? S.accent : "#1e293b",
                  color: t.id === "super" ? "#1e293b" : S.accent, borderRadius: "4px",
                }}><t.Icon size={11} /></div>
                <span className="text-[11px] font-bold" style={{ color: t.id === "super" ? S.accent : S.text }}>{t.label}</span>
              </div>
              <div className="text-base font-bold" style={{ color: t.id === "super" ? "#ffffff" : S.text }}>{t.amount}</div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: t.id === "super" ? "rgba(255,255,255,0.5)" : S.muted }}>
                {t.id === "project" ? "GMV 总额" : `抽取 比例 ${["10%","5%","7%","8%","12%"][idx-1]}`}
              </div>
            </div>
            {idx < tiers.length - 1 && (
              <div className="flex items-center flex-shrink-0 px-1">
                <ArrowRight size={18} style={{ color: S.muted }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 商业与计费：分润看板页 ────────────────────────────────────
function ShareSection() {
  const totalGmv = gmvShares.filter(g => g.period === "2026-08" && g.toTier === "super").reduce((n, g) => n + g.gmv, 0) + 420000;
  const totalReceivable = gmvShares.reduce((n, g) => n + g.amountCny, 0);
  const settled = Math.floor(totalReceivable * 0.72);
  const pending = totalReceivable - settled;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "本月总 GMV", value: fmtCny(totalGmv), sub: "同比 +24.6%", Icon: TrendingUp, accent: true },
          { label: "应收分润",   value: fmtCny(totalReceivable), sub: `共 ${gmvShares.length} 条链路`, Icon: Layers, accent: false },
          { label: "已结算",     value: fmtCny(settled), sub: "结算率 72%", Icon: CheckCircle, accent: false },
          { label: "待结算",     value: fmtCny(pending), sub: "预计 9/5 出账", Icon: Package, accent: false },
        ].map(c => (
          <div key={c.label} className="p-4" style={{
            background: c.accent ? "#1e293b" : S.surface,
            border: c.accent ? `2px solid ${S.accent}` : `1px solid ${S.border}`,
            borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center" style={{
                background: c.accent ? S.accent : "#1e293b",
                color: c.accent ? "#1e293b" : S.accent, borderRadius: S.radiusSm,
              }}><c.Icon size={14} /></div>
              <span className="text-xs" style={{ color: c.accent ? "rgba(255,255,255,0.7)" : S.muted }}>{c.label}</span>
            </div>
            <div className="text-xl font-bold mb-0.5" style={{ color: c.accent ? S.accent : S.text }}>{c.value}</div>
            <div className="text-[10px] font-mono" style={{ color: c.accent ? "rgba(255,255,255,0.5)" : S.muted }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <ShareFlowDiagram />
      <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="min-w-[1100px]">
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
            {([["流水号",90],["账期",80],["出账方",170],["出账层级",90],["→",20],["分润方",170],["分润层级",90],["分润比例",90],["GMV",100],["分润金额",110]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {gmvShares.map((g, idx) => (
            <div key={g.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-shrink-0" style={{width:90, color:S.textSec}}>{g.id}</div>
              <div className="flex-shrink-0" style={{width:80}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#1e293b", borderRadius: S.radiusSm}}>{g.period}</span>
              </div>
              <div className="flex-shrink-0" style={{width:170, color:S.text}}>{g.fromName}</div>
              <div className="flex-shrink-0" style={{width:90}}>
                <span className="px-1.5 py-0.5 text-[10px]" style={{background:"#f1f5f9", color:S.textSec, borderRadius: S.radiusSm}}>{tierLabels[g.fromTier]}</span>
              </div>
              <div className="flex-shrink-0 flex justify-center" style={{width:20, color:S.muted}}><ArrowRight size={12} /></div>
              <div className="flex-shrink-0" style={{width:170, color:S.text, fontWeight:"bold"}}>{g.toName}</div>
              <div className="flex-shrink-0" style={{width:90}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background:"#1e293b", color:S.accent, borderRadius: S.radiusSm}}>{tierLabels[g.toTier]}</span>
              </div>
              <div className="flex-shrink-0 font-bold" style={{width:90, color:S.text}}>{(g.rate * 100).toFixed(0)}%</div>
              <div className="flex-shrink-0" style={{width:100, color:S.textSec}}>{fmtCny(g.gmv)}</div>
              <div className="flex-shrink-0 font-bold" style={{width:110, color:"#16a34a"}}>{fmtCny(g.amountCny)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 商业与计费：账单中心页 ────────────────────────────────────
function BillingSection({ bills }: { bills: BillRecord[] }) {
  const expiring = bills.filter(b => b.status === "pending").length;
  const overdue = bills.filter(b => b.status === "overdue").length;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
              <CheckCircle size={12} />
            </div>
            <span className="text-xs" style={{ color: S.muted }}>已支付账单</span>
          </div>
          <div className="text-xl font-bold" style={{ color: S.text }}>{bills.filter(b => b.status === "paid").length} 张</div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: "#16a34a" }}>
            累计 {fmtCny(bills.filter(b => b.status === "paid").reduce((n, b) => n + b.amountCny, 0))}
          </div>
        </div>
        <div className="p-4" style={{ background: "rgba(234,179,8,0.08)", border: `1px solid rgba(234,179,8,0.25)`, borderRadius: S.radius }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#eab308", color: "#1e293b", borderRadius: S.radiusSm }}>
              <Package size={12} />
            </div>
            <span className="text-xs font-bold" style={{ color: "#a16207" }}>即将到期 · 提醒</span>
          </div>
          <div className="text-xl font-bold" style={{ color: "#854d0e" }}>{expiring} 张待支付</div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: "#a16207" }}>
            合计 {fmtCny(bills.filter(b => b.status === "pending").reduce((n, b) => n + b.amountCny, 0))}
          </div>
        </div>
        <div className="p-4" style={{ background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.25)`, borderRadius: S.radius }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#ef4444", color: "#ffffff", borderRadius: S.radiusSm }}>
              <X size={12} />
            </div>
            <span className="text-xs font-bold" style={{ color: "#b91c1c" }}>已逾期 · 欠费</span>
          </div>
          <div className="text-xl font-bold" style={{ color: "#991b1b" }}>{overdue} 张逾期</div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: "#b91c1c" }}>
            合计 {fmtCny(bills.filter(b => b.status === "overdue").reduce((n, b) => n + b.amountCny, 0))}
          </div>
        </div>
      </div>
      <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="min-w-[1000px]">
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
            {([["账单号",140],["付款方",180],["层级",80],["账单项目",220],["金额",110],["到期日",110],["状态",100]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {bills.map((b, idx) => (
            <div key={b.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#ffffff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-shrink-0 font-bold" style={{width:140, color:S.textSec}}>{b.id}</div>
              <div className="flex-shrink-0 flex items-center gap-2" style={{width:180}}>
                <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>
                  {b.payerName[0]}
                </div>
                <span className="font-bold" style={{color:S.text}}>{b.payerName}</span>
              </div>
              <div className="flex-shrink-0" style={{width:80}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#1e293b", borderRadius: S.radiusSm}}>{tierLabels[b.payerType]}</span>
              </div>
              <div className="flex-shrink-0" style={{width:220, color:S.textSec}}>{b.items.join("、")}</div>
              <div className="flex-shrink-0 font-bold" style={{width:110, color:S.text}}>{fmtCny(b.amountCny)}</div>
              <div className="flex-shrink-0" style={{width:110, color:S.textSec}}>{b.dueAt}</div>
              <div className="flex-shrink-0" style={{width:100}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: billStatusCfg[b.status].bg, color: billStatusCfg[b.status].color, borderRadius: S.radiusSm }}>
                  {billStatusCfg[b.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 商业与计费：主 Tab 组件 ───────────────────────────────────
type CommercialSubTab = "pricing" | "subscriptions" | "shares" | "billing";
function CommercialTab({ subs, bills }: { subs: Subscription[]; bills: BillRecord[] }) {
  const [tab, setTab] = useState<CommercialSubTab>("pricing");
  const subTabs: [CommercialSubTab, string, any][] = [
    ["pricing", "定价方案", Package],
    ["subscriptions", "订阅管理", Building2],
    ["shares", "分润看板", TrendingUp],
    ["billing", "账单中心", Layers],
  ];
  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: "linear-gradient(135deg,#1e293b 0%,#1e293b 100%)", borderRadius: S.radiusLg, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: S.accent, color: "#1e293b", borderRadius: S.radius }}>
                <Zap size={18} />
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: "#ffffff" }}>商业与计费</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  五级分层定价 · 订阅全生命周期管理 · GMV 分润链路 · 账单结算中心
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[`${pricingPlans.length} 个定价方案`, `${subs.length} 条订阅`, `${bills.length} 张账单`, `${gmvShares.length} 条分润流水`].map(t => (
                <span key={t} className="px-2.5 py-1 text-[10px] font-bold font-mono" style={{ background: S.accent, color: "#1e293b", borderRadius: S.radiusSm }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {[
              { l: "本月 GMV", v: "¥126.4 万", s: "+24.6%" },
              { l: "应收分润", v: "¥35.2 万", s: "72% 已结算" },
              { l: "累计订阅", v: `${subs.filter(s => s.status === "active").length} 份`, s: `${subs.filter(s => s.status === "expiring").length} 份到期` },
            ].map(c => (
              <div key={c.l} className="px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: S.radius }}>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{c.l}</div>
                <div className="text-lg font-bold mt-0.5" style={{ color: S.accent }}>{c.v}</div>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{c.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1 p-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        {subTabs.map(([id, label, Icon]) => (
          <button key={id} type="button" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-all" style={{
            background: tab === id ? "#1e293b" : "transparent",
            color: tab === id ? S.accent : S.muted,
            borderRadius: S.radiusSm,
          }} onClick={() => setTab(id)}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>
      <div>
        {tab === "pricing" && <PricingSection />}
        {tab === "subscriptions" && <SubscriptionSection subs={subs} />}
        {tab === "shares" && <ShareSection />}
        {tab === "billing" && <BillingSection bills={bills} />}
      </div>
    </div>
  );
}

// ─── 账号管理抽屉（新建/编辑） ──────────────────────────────────
const scopeTypeLabelMap: ScopeTypeLabelMap = buildScopeTypeLabelMap(ecosystems, saasPlatforms, platforms, projects);

function AccountDrawer({ initial, onClose, onSave, projectList }: { initial?: SystemAccount; onClose: () => void; onSave: (acc: SystemAccount) => void; projectList: ProjectItem[] }) {
  const { tools, setTools } = useTools();
  const emptyAcc = (): SystemAccount => ({
    uid: `U${100000 + Math.floor(Math.random() * 900000)}`,
    name: "", email: "", phone: "", status: "pending", bindingStatus: "idle", createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    identities: [], assignedToolIds: [], projectIds: [],
  });
  const cloneAcc = (src: SystemAccount): SystemAccount => ({
    ...src,
    identities: src.identities.map(i => ({ ...i, scopeIds: [...i.scopeIds] })),
    assignedToolIds: [...src.assignedToolIds],
    projectIds: [...src.projectIds],
  });
  const [draft, setDraft] = useState<SystemAccount>(initial ? cloneAcc(initial) : emptyAcc());
  const update = <K extends keyof SystemAccount>(key: K, val: SystemAccount[K]) => setDraft(d => ({ ...d, [key]: val }));

  const addIdentity = () => {
    const defaultKey: IdentityRole["roleKey"] = "project_owner";
    const meta = roleKeyMeta[defaultKey];
    setDraft(d => ({ ...d, identities: [...d.identities, { roleKey: defaultKey, scopeType: meta.defaultScope, scopeIds: [], label: meta.label, permissionSummary: meta.summary }] }));
  };
  const updateIdentity = (idx: number, patch: Partial<IdentityRole>) => setDraft(d => ({
    ...d, identities: d.identities.map((i, k) => k === idx ? { ...i, ...patch, label: patch.roleKey ? roleKeyMeta[patch.roleKey].label : i.label, permissionSummary: patch.roleKey ? roleKeyMeta[patch.roleKey].summary : i.permissionSummary, scopeType: patch.roleKey ? roleKeyMeta[patch.roleKey].defaultScope : i.scopeType, scopeIds: patch.roleKey ? [] : i.scopeIds } : i),
  }));
  const toggleScopeId = (idx: number, scopeId: string) => setDraft(d => ({
    ...d, identities: d.identities.map((i, k) => k === idx ? { ...i, scopeIds: i.scopeIds.includes(scopeId) ? i.scopeIds.filter(s => s !== scopeId) : [...i.scopeIds, scopeId] } : i),
  }));
  const removeIdentity = (idx: number) => setDraft(d => ({ ...d, identities: d.identities.filter((_, k) => k !== idx) }));

  const availableTools = tools.filter(t => !t.boundAccountId || t.boundAccountId === draft.uid);
  const assignedTools = tools.filter(t => draft.assignedToolIds.includes(t.id));

  const toggleTool = (toolId: string) => {
    setDraft(d => ({
      ...d,
      assignedToolIds: d.assignedToolIds.includes(toolId)
        ? d.assignedToolIds.filter(id => id !== toolId)
        : [...d.assignedToolIds, toolId],
    }));
  };

  const [feishu, setFeishu] = useState("");
  const canSave = draft.name.trim().length > 0;

  const handleSave = () => {
    const oldAssignedIds = initial ? initial.assignedToolIds : [];
    const removedIds = oldAssignedIds.filter(id => !draft.assignedToolIds.includes(id));
    const addedIds = draft.assignedToolIds.filter(id => !oldAssignedIds.includes(id));

    setTools(list => list.map(t => {
      if (removedIds.includes(t.id)) {
        return { ...t, boundAccountId: null, status: "idle" as const };
      }
      if (addedIds.includes(t.id)) {
        return { ...t, boundAccountId: draft.uid, status: "in_use" as const };
      }
      return t;
    }));

    onSave(draft);
    onClose();
  };

  const toolTypeIcon = { wecom: Building2, wechat: UsersRound, phone: Phone, media: Radio };
  const toolTypeLabel: Record<string, string> = { wecom: "企业微信", wechat: "个人微信", phone: "手机号", media: "媒体账号" };
  const toolTypeColor: Record<string, string> = { wecom: "#1e293b", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[620px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between px-5 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div>
            <div className="text-base font-bold flex items-center gap-2"><UsersRound size={16} />{initial ? "编辑账号" : "新建账号"} · {draft.uid}</div>
            <div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>从通讯工具池选择工具分配给此账号</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={16} />基本信息</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold">姓名<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={draft.name} style={fieldStyle} placeholder="例如：张三" onChange={e => update("name", e.target.value)} /></label>
              <label className="block text-xs font-bold">手机号<input className="mt-1" value={draft.phone} style={fieldStyle} placeholder="11 位手机号" onChange={e => update("phone", e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">邮箱<input className="mt-1" value={draft.email} style={fieldStyle} placeholder="name@company.com" onChange={e => update("email", e.target.value)} /></label>
              <label className="block text-xs font-bold">账号状态<select className="mt-1" value={draft.status} style={fieldStyle} onChange={e => update("status", e.target.value as SystemAccount["status"])}><option value="active">正常 active</option><option value="disabled">停用 disabled</option><option value="pending">待激活 pending</option></select></label>
              <label className="block text-xs font-bold">领用状态<span className="font-normal" style={{ color: S.muted }}>（工具/资源领用状态）</span>
                <div className="mt-1 grid grid-cols-4 gap-1.5">
                  {(Object.keys(bindingStatusMeta) as BindingStatus[]).map(s => (
                    <button key={s} type="button" onClick={() => update("bindingStatus", s)} className="py-1.5 text-[10px] font-bold" style={{
                      background: draft.bindingStatus === s ? bindingStatusMeta[s].bg : "#fafaf8",
                      color: draft.bindingStatus === s ? bindingStatusMeta[s].color : S.textSec,
                      border: `1px solid ${draft.bindingStatus === s ? "#1e293b" : S.border}`,
                      borderRadius: S.radiusSm,
                    }}>{bindingStatusMeta[s].label}</button>
                  ))}
                </div>
              </label>
              <label className="block text-xs font-bold col-span-2">飞书账号<span className="font-normal" style={{ color: S.muted }}>（可选，单独绑定）</span><input className="mt-1" value={feishu} style={fieldStyle} placeholder="xxx@feishu.cn" onChange={e => setFeishu(e.target.value)} /></label>
            </div>
          </div>

          <div className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold"><UsersRound size={14} />项目分配<span className="font-normal text-xs font-mono" style={{ color: S.muted }}>（此账号负责的项目集合，{draft.projectIds.length} 个）</span></div>
            </div>
            {projectList.length === 0 ? (
              <div className="text-xs font-mono" style={{ color: S.muted }}>暂无项目可分配，请先在架构视图创建项目。</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-auto p-1" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                {projectList.map(p => {
                  const pid = String(p.id);
                  const checked = draft.projectIds.includes(pid);
                  return (
                    <label key={pid} className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer" style={{
                      background: checked ? S.accentLight : "transparent",
                      border: `1px solid ${checked ? "rgba(204,255,0,0.4)" : "transparent"}`,
                      borderRadius: S.radiusSm,
                    }}>
                      <input type="checkbox" checked={checked} onChange={() => {
                        setDraft(d => ({
                          ...d,
                          projectIds: checked ? d.projectIds.filter(x => x !== pid) : [...d.projectIds, pid],
                        }));
                      }} />
                      <span className="font-bold" style={{ color: checked ? "#1e293b" : S.textSec }}>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-4 flex-1" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
                <div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} />身份绑定（可多条）</div>
                <p className="text-xs mt-1" style={{ color: S.muted }}>一个账号可拥有多身份；每个身份绑定具体范围（生态/SaaS/平台/项目/城市或全局）。</p>
              </div>
              <button type="button" className="flex items-center gap-1 px-3 py-2 text-xs font-bold ml-3 self-end" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={addIdentity}><Plus size={12} />新增身份</button>
            </div>
            {draft.identities.length === 0 && <div className="p-4 text-center text-xs font-mono" style={{ background: S.surface, border: `1px dashed ${S.borderMed}`, borderRadius: S.radius, color: S.muted }}>该账号暂无身份绑定，点击右上角「新增身份」开始添加</div>}
            {draft.identities.map((ident, idx) => {
              const scopeCfg = scopeTypeLabelMap[ident.scopeType];
              return (
                <div key={idx} className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <select value={ident.roleKey} style={{ ...fieldStyle, width: 150, padding: "6px 8px", fontSize: 12 }} onChange={e => updateIdentity(idx, { roleKey: e.target.value as IdentityRole["roleKey"] })}>
                        {(Object.keys(roleKeyMeta) as IdentityRole["roleKey"][]).map(k => <option key={k} value={k}>{roleKeyMeta[k].label}</option>)}
                      </select>
                      <select value={ident.scopeType} style={{ ...fieldStyle, width: 110, padding: "6px 8px", fontSize: 12 }} onChange={e => updateIdentity(idx, { scopeType: e.target.value as IdentityRole["scopeType"] })}>
                        {(["global","eco","saas","platform","project","city"] as IdentityRole["scopeType"][]).map(s => <option key={s} value={s}>{scopeTypeLabelMap[s].label}</option>)}
                      </select>
                      <span className="px-2 py-1 text-[10px] font-bold font-mono" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>{scopeCfg.label} · {ident.scopeIds.length} 已选</span>
                    </div>
                    <button type="button" className="text-[10px] font-mono px-2 py-1" style={{ color: "#a22", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => removeIdentity(idx)}>移除</button>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold mb-1.5 font-mono" style={{ color: S.textSec }}>选择 {scopeCfg.label} 范围（多选）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {scopeCfg.options.map(opt => {
                        const on = ident.scopeIds.includes(opt.id);
                        return <label key={opt.id} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: on ? "#1e293b" : "#f1f5f9", color: on ? S.accent : S.muted, border: `1px solid ${on ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}>
                          <input className="sr-only" type="checkbox" checked={on} onChange={() => toggleScopeId(idx, opt.id)} />{opt.name}
                        </label>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold mb-1 font-mono" style={{ color: S.textSec }}>权限说明摘要</div>
                    <input className="text-[11px]" value={ident.permissionSummary} style={{ ...fieldStyle, padding: "5px 8px" }} onChange={e => updateIdentity(idx, { permissionSummary: e.target.value })} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold"><Radio size={16} />通讯工具分配 <span className="font-normal text-xs font-mono" style={{ color: S.muted }}>({draft.assignedToolIds.length})</span></div>
              <span className="text-[10px] font-mono" style={{ color: S.muted }}>从工具池选择，保存后自动同步领用状态</span>
            </div>

            {assignedTools.length > 0 && (
              <div className="p-3 space-y-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                <div className="text-[10px] font-bold font-mono" style={{ color: S.textSec }}>已分配工具</div>
                {assignedTools.map(t => {
                  const TI = toolTypeIcon[t.type];
                  return (
                    <div key={t.id} className="flex items-center gap-2 p-2" style={{ background: "#fafaf8", borderRadius: S.radiusSm }}>
                      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: toolTypeColor[t.type], borderRadius: S.radiusSm }}>
                        <TI size={12} style={{ color: "#ffffff" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{t.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: S.muted }}>{toolTypeLabel[t.type]} · {t.identifier}</div>
                      </div>
                      {t.boundProjectIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {t.boundProjectIds.slice(0, 2).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#1e293b", borderRadius: S.radiusSm }}>{pid}</span>)}
                        </div>
                      )}
                      <button type="button" className="text-[10px] px-2 py-1" style={{ color: "#a22", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => toggleTool(t.id)}>移除</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-3 space-y-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
              <div className="text-[10px] font-bold font-mono flex items-center justify-between" style={{ color: S.textSec }}>
                <span>工具池（可分配）</span>
                <span style={{ color: S.muted }}>共 {availableTools.length} 个</span>
              </div>
              {availableTools.length === 0 && <div className="text-xs font-mono text-center py-3" style={{ color: S.muted }}>暂无可分配的工具</div>}
              <div className="grid grid-cols-2 gap-2">
                {availableTools.map(t => {
                  const selected = draft.assignedToolIds.includes(t.id);
                  const TI = toolTypeIcon[t.type];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTool(t.id)}
                      className="flex items-center gap-2 p-2 text-left transition-all"
                      style={{
                        background: selected ? "#1e293b" : "#fafaf8",
                        border: `1px solid ${selected ? "#1e293b" : S.border}`,
                        borderRadius: S.radiusSm,
                        color: selected ? S.accent : S.text,
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: toolTypeColor[t.type], borderRadius: 4 }}>
                        <TI size={10} style={{ color: "#ffffff" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold truncate">{t.name}</div>
                        <div className="text-[9px] font-mono truncate" style={{ color: selected ? S.accent : S.muted }}>{toolTypeLabel[t.type]} · {t.identifier}</div>
                      </div>
                      {selected && <CheckCircle size={12} style={{ color: S.accent, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={!canSave} style={{ background: canSave ? "#1e293b" : "#ddd", color: canSave ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={handleSave}><Save size={13} />{initial ? "保存账号" : "创建账号"}</button>
        </div>
      </aside>
    </div>
  );
}

// ─── 账号管理主 Tab ────────────────────────────────────────────
const toolStatusChip: Record<string, { label: string; bg: string; color: string }> = {
  idle:            { label: "空闲",   bg: "#f1f5f9", color: "#475569" },
  in_use:          { label: "使用中", bg: S.accent,  color: "#ffffff" },
  pending_transfer:{ label: "待交接", bg: "#3b82f6", color: "#ffffff" },
  abnormal:        { label: "异常",   bg: "#ff6b6b", color: "#ffffff" },
};

type AccSortKey = "name" | "createdAt" | "toolCount";
type AccSortDir = "asc" | "desc";

const _currentActorName = "陈宇航"; // 当前操作人（仅mock场景）

function _buildOpLog(type: AccountOperation["type"], summary: string, details?: Record<string, any>, actor: string = _currentActorName): AccountOperation {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date();
  const time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, type, actor, time, summary, details };
}

function _withOpLog(acc: SystemAccount, log: AccountOperation): SystemAccount {
  const prev = Array.isArray(acc.operationLogs) ? acc.operationLogs : [];
  return { ...acc, operationLogs: [log, ...prev] };
}

function _csvEscape(s: string | number | undefined | null): string {
  const v = s == null ? "" : String(s);
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

const scopeTypeLabelZh: Record<IdentityRole["scopeType"], string> = {
  global: "全局", eco: "生态", saas: "SaaS 合作伙伴", platform: "平台", project: "项目", city: "城市",
};

function AccountManagerTab({ accounts, setAccounts, projectList }: { accounts: SystemAccount[]; setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>; projectList: ProjectRecord[] }) {
  const { tools, setTools } = useTools();
  const { invites, setInvites } = useInvites();

  const [subTab, setSubTab] = useState<"accounts" | "invites">("accounts");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SystemAccount["status"]>("all");
  const [roleFilter, setRoleFilter] = useState<string>("全部身份");
  const [toolStatusFilter, setToolStatusFilter] = useState<"all" | string>("all");
  const [bindFilter, setBindFilter] = useState<"all" | BindingStatus>("all");
  const [statCardPreset, setStatCardPreset] = useState<string | null>(null); // 统计卡点击高亮

  const [editing, setEditing] = useState<SystemAccount | null>(null);
  const [creating, setCreating] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewing, setReviewing] = useState<InviteRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState<SystemAccount | null>(null);
  const [quickAssignToolOpen, setQuickAssignToolOpen] = useState<SystemAccount | null>(null);
  const [batchAction, setBatchAction] = useState<null | "assignProject" | "assignTools">(null);
  const [batchTargetId, setBatchTargetId] = useState<string[]>([]);
  const [batchSelection, setBatchSelection] = useState<string[]>([]); // uid[]

  const [sortKey, setSortKey] = useState<AccSortKey>("createdAt");
  const [sortDir, setSortDir] = useState<AccSortDir>("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [inviteStatusFilter, setInviteStatusFilter] = useState<"all" | InviteStatus>("all");
  const [inviteKeyword, setInviteKeyword] = useState("");
  const [toast, setToast] = useState("");

  const statusChip: Record<SystemAccount["status"], { label: string; bg: string; color: string }> = {
    active:   { label: "正常",   bg: S.accent,     color: "#ffffff" },
    disabled: { label: "停用",   bg: "#f1f5f9",    color: "#475569" },
    pending:  { label: "待激活", bg: "#3b82f6",    color: "#ffffff" },
  };

  const allRoleLabels = Array.from(new Set(accounts.flatMap(a => a.identities.map(i => i.label))));
  const roleOptions = ["全部身份", ...allRoleLabels];

  const toolMap = Object.fromEntries(tools.map(t => [t.id, t]));
  const projectId2Name: Record<string, string> = Object.fromEntries(projectList.map(p => [String(p.id), p.name]));
  availableProjects.forEach(p => { projectId2Name[p.id] = p.name; });
  const inviteProjectName = Object.fromEntries(availableProjects.map(p => [p.id, p.name]));

  const accountsWithTools = accounts.map(a => {
    const assignedTools = a.assignedToolIds.map(id => toolMap[id]).filter(Boolean);
    const toolStatuses = assignedTools.map(t => t.status);
    const toolCount = assignedTools.length;
    return { account: a, assignedTools, toolStatuses, toolCount };
  });

  let filtered = accountsWithTools.filter(({ account: a, toolStatuses }) => {
    const matchK = !keyword || a.name.includes(keyword) || a.email.includes(keyword) || a.phone.includes(keyword) || a.uid.includes(keyword);
    const matchS = statusFilter === "all" || a.status === statusFilter;
    const matchR = roleFilter === "全部身份" || a.identities.some(i => i.label === roleFilter);
    const matchT = toolStatusFilter === "all" || toolStatuses.includes(toolStatusFilter);
    const matchB = bindFilter === "all" || a.bindingStatus === bindFilter;
    return matchK && matchS && matchR && matchT && matchB;
  });

  // 排序
  filtered.sort((x, y) => {
    let cmp = 0;
    if (sortKey === "name") cmp = x.account.name.localeCompare(y.account.name, "zh-CN");
    else if (sortKey === "createdAt") cmp = x.account.createdAt.localeCompare(y.account.createdAt);
    else if (sortKey === "toolCount") cmp = x.toolCount - y.toolCount;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // 分页
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // 邀请记录过滤
  const filteredInvites = invites.filter(inv => {
    const matchS = inviteStatusFilter === "all" || inv.status === inviteStatusFilter;
    const matchK = !inviteKeyword ||
      inv.inviteeName.includes(inviteKeyword) ||
      inv.inviteePhone.includes(inviteKeyword) ||
      inv.inviteeEmail.includes(inviteKeyword) ||
      inv.inviteCode.toLowerCase().includes(inviteKeyword.toLowerCase()) ||
      (inv.inviterName && inv.inviterName.includes(inviteKeyword));
    return matchS && matchK;
  });

  const save = (acc: SystemAccount) => {
    setAccounts(list => {
      const exists = list.find(x => x.uid === acc.uid);
      if (exists) {
        const changed = [];
        if (JSON.stringify(exists.identities) !== JSON.stringify(acc.identities)) changed.push("身份权限");
        if (JSON.stringify(exists.projectIds) !== JSON.stringify(acc.projectIds)) changed.push("项目分配");
        if (JSON.stringify(exists.assignedToolIds) !== JSON.stringify(acc.assignedToolIds)) changed.push("工具分配");
        if (exists.name !== acc.name || exists.email !== acc.email || exists.phone !== acc.phone) changed.push("基本信息");
        const summary = changed.length ? `编辑账号：${changed.join("、")}` : "编辑账号";
        const updated = _withOpLog(acc, _buildOpLog("edit", summary, { changed }));
        return list.map(x => x.uid === acc.uid ? updated : x);
      } else {
        const newAcc = _withOpLog(acc, _buildOpLog("create", "新建账号并保存"));
        return [newAcc, ...list];
      }
    });
    setToast(editing ? "账号已保存" : "账号已创建");
  };

  const setStatus = (uid: string, next: SystemAccount["status"], confirm = false) => {
    const acc = accounts.find(a => a.uid === uid);
    if (!acc) return;
    if (next === "disabled" && confirm) {
      if (!window.confirm(`确定停用账号「${acc.name}」吗？\n停用后该账号将无法登录，已分配的通讯工具不会被解绑（如需解绑请单独处理）。`)) return;
    }
    setAccounts(list => list.map(a => {
      if (a.uid !== uid) return a;
      const updated = { ...a, status: next };
      return _withOpLog(updated, _buildOpLog(
        next === "active" ? "enable" : "disable",
        next === "active" ? "启用账号" : "停用账号",
      ));
    }));
    setToast(next === "active" ? "已启用账号" : "已停用账号");
  };

  const totalTools = accounts.reduce((n, a) => n + a.assignedToolIds.length, 0);
  const idleTools = tools.filter(t => t.status === "idle" && !t.boundAccountId).length;
  const inUseTools = tools.filter(t => t.status === "in_use").length;
  const abnormalTools = tools.filter(t => t.status === "abnormal").length;
  const pendingTools = tools.filter(t => t.status === "pending_transfer").length;
  const wecomTools = tools.filter(t => t.type === "wecom").length;
  const wechatTools = tools.filter(t => t.type === "wechat").length;
  const totalProjects = new Set(accounts.flatMap(a => a.projectIds)).size;
  const bindInUse = accounts.filter(a => a.bindingStatus === "in_use").length;
  const bindIdle = accounts.filter(a => a.bindingStatus === "idle").length;
  const bindPending = accounts.filter(a => a.bindingStatus === "pending_transfer").length;
  const bindAbnormal = accounts.filter(a => a.bindingStatus === "abnormal").length;

  // 邀请统计
  const invPending = invites.filter(i => i.status === "pending").length;
  const invSubmitted = invites.filter(i => i.status === "submitted").length;
  const invApproved = invites.filter(i => i.status === "approved").length;
  const invRejected = invites.filter(i => i.status === "rejected").length;

  const toolTypeIconMap: Record<string, any> = { wecom: Building2, wechat: UsersRound, phone: Phone, media: Radio };

  function openReview(inv: InviteRecord) {
    setReviewing(inv);
    setReviewOpen(true);
  }

  function resendInvite(inv: InviteRecord) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newExpireAt = `${future.getFullYear()}-${pad(future.getMonth() + 1)}-${pad(future.getDate())} ${pad(future.getHours())}:${pad(future.getMinutes())}`;
    setInvites(prev => prev.map(i => i.id === inv.id
      ? { ...i, status: (i.status === "expired" || i.status === "rejected") ? "pending" as InviteStatus : i.status, expireAt: newExpireAt, resendCount: (i as any).resendCount != null ? ((i as any).resendCount as number) + 1 : 1 }
      : i));
    setToast(`已重置邀请有效期至 ${newExpireAt}，并重新发送邀请给 ${inv.inviteeName}`);
  }

  function revokeInvite(inv: InviteRecord) {
    if (!confirm(`确定撤销 ${inv.inviteeName} 的邀请码？链接将立即失效（mock 状态：变更为已过期）。`)) return;
    setInvites(prev => prev.map(i => i.id === inv.id ? { ...i, status: "expired" } : i));
    setToast("邀请已撤销");
  }

  function toggleSort(k: AccSortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
    setPage(1);
  }

  function applyStatCard(preset: { sf?: typeof statusFilter; bf?: typeof bindFilter; tsf?: string; rf?: string } & { label: string }) {
    if (preset.sf != null) setStatusFilter(preset.sf);
    if (preset.bf != null) setBindFilter(preset.bf);
    if (preset.tsf != null) setToolStatusFilter(preset.tsf);
    if (preset.rf != null) setRoleFilter(preset.rf);
    setKeyword("");
    setPage(1);
    setStatCardPreset(preset.label);
    setSubTab("accounts");
    setToast(`已按统计卡「${preset.label}」过滤列表`);
  }

  function toggleRow(uid: string) {
    setBatchSelection(prev => prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]);
  }
  function toggleAllVisibleRows() {
    const visibleUids = pagedRows.map(r => r.account.uid);
    const allOn = visibleUids.every(u => batchSelection.includes(u));
    if (allOn) setBatchSelection(prev => prev.filter(u => !visibleUids.includes(u)));
    else setBatchSelection(prev => Array.from(new Set([...prev, ...visibleUids])));
  }

  function batchSetStatus(next: "active" | "disabled") {
    if (batchSelection.length === 0) return;
    if (next === "disabled" && !window.confirm(`确定停用选中的 ${batchSelection.length} 个账号？`)) return;
    setAccounts(list => list.map(a => {
      if (!batchSelection.includes(a.uid)) return a;
      if (a.status === next) return a;
      return _withOpLog({ ...a, status: next }, _buildOpLog(next === "active" ? "enable" : "disable", next === "active" ? "批量启用账号" : "批量停用账号", { via: "batch" }));
    }));
    setToast(next === "active" ? `已批量启用 ${batchSelection.length} 个账号` : `已批量停用 ${batchSelection.length} 个账号`);
    setBatchSelection([]);
  }

  function batchAssignProjects(pids: string[]) {
    if (batchSelection.length === 0) return;
    setAccounts(list => list.map(a => {
      if (!batchSelection.includes(a.uid)) return a;
      const merged = Array.from(new Set([...a.projectIds, ...pids]));
      return _withOpLog({ ...a, projectIds: merged }, _buildOpLog("assign_projects", `批量分配 ${pids.length} 个项目`, { via: "batch", projectIds: pids }));
    }));
    setToast(`已给 ${batchSelection.length} 个账号追加分配 ${pids.length} 个项目`);
    setBatchSelection([]);
    setBatchAction(null);
  }

  function batchAssignTools(tids: string[]) {
    if (batchSelection.length === 0) return;
    if (tools && setTools) {
      setTools((prev: CommunicationTool[]) => prev.map(t => tids.includes(t.id) ? ({ ...t, boundAccountId: batchSelection[0], status: t.status === "idle" ? "in_use" as const : t.status }) : t));
    }
    setAccounts(list => list.map(a => {
      if (!batchSelection.includes(a.uid)) return a;
      const merged = Array.from(new Set([...a.assignedToolIds, ...tids]));
      return _withOpLog({ ...a, assignedToolIds: merged }, _buildOpLog("assign_tools", `批量分配 ${tids.length} 个通讯工具`, { via: "batch", toolIds: tids }));
    }));
    setToast(`已给 ${batchSelection.length} 个账号追加分配 ${tids.length} 个工具`);
    setBatchSelection([]);
    setBatchAction(null);
  }

  function quickAssignToolsToSingle(a: SystemAccount, tids: string[]) {
    if (tools && setTools) {
      setTools((prev: CommunicationTool[]) => prev.map(t => tids.includes(t.id) ? ({ ...t, boundAccountId: a.uid, status: t.status === "idle" ? "in_use" as const : t.status }) : t));
    }
    setAccounts(list => list.map(x => {
      if (x.uid !== a.uid) return x;
      const merged = Array.from(new Set([...x.assignedToolIds, ...tids]));
      return _withOpLog({ ...x, assignedToolIds: merged }, _buildOpLog("assign_tools", `快速分配 ${tids.length} 个通讯工具`, { toolIds: tids }));
    }));
    setQuickAssignToolOpen(null);
    setToast(`已给「${a.name}」分配 ${tids.length} 个工具`);
  }

  function exportCsv() {
    if (filtered.length === 0) { setToast("当前无数据可导出"); return; }
    const header = ["UID", "姓名", "邮箱", "手机号", "账号状态", "领用状态", "身份标签", "覆盖项目数", "分配工具数", "创建时间"];
    const rows = filtered.map(r => {
      const a = r.account;
      return [
        a.uid, a.name, a.email, a.phone,
        statusChip[a.status].label,
        bindingStatusMeta[a.bindingStatus].label,
        a.identities.map(i => `${i.label}(${scopeTypeLabelZh[i.scopeType]})`).join(" / "),
        a.projectIds.length,
        r.toolCount,
        a.createdAt,
      ];
    });
    const csv = [header, ...rows].map(r => r.map(_csvEscape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const name = `账号列表_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setToast(`已导出 ${filtered.length} 条账号记录（${name}）`);
  }

  const statCardHighlight = (label: string) => statCardPreset === label;
  const statCardStyle = (on: boolean) => on
    ? { boxShadow: "0 0 0 2px #1e293b inset, 0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", transition: "box-shadow .2s" }
    : { boxShadow: "0 1px 4px rgba(0,0,0,0.05)", cursor: "pointer", transition: "box-shadow .2s" };

  // 批量选择对应的账号列表（用于批量操作头部显示）
  const batchAccounts = accounts.filter(a => batchSelection.includes(a.uid));
  const visibleUids = pagedRows.map(r => r.account.uid);
  const allVisibleChecked = visibleUids.length > 0 && visibleUids.every(u => batchSelection.includes(u));
  const someVisibleChecked = visibleUids.some(u => batchSelection.includes(u)) && !allVisibleChecked;

  const opTypeMeta: Record<AccountOperation["type"], { label: string; bg: string; icon: any; color: string }> = {
    create:            { label: "创建",   bg: "#3b82f6", icon: Plus,         color: "#ffffff" },
    edit:              { label: "编辑",   bg: "#e0e7ff", icon: Settings,     color: "#2b3ba0" },
    enable:            { label: "启用",   bg: "#d1fae5", icon: CheckCircle,  color: "#065f46" },
    disable:           { label: "停用",   bg: "#fee2e2", icon: XCircle,      color: "#991b1b" },
    assign_tools:      { label: "分配工具",bg: "#fef3c7", icon: Radio,        color: "#92400e" },
    assign_projects:   { label: "分配项目",bg: "#dbeafe", icon: Building2,    color: "#1e3a8a" },
    change_identities: { label: "调整身份",bg: "#ede9fe", icon: ShieldCheck,  color: "#4c1d95" },
    invite_approved:   { label: "邀请通过",bg: "#d1fae5", icon: ThumbsUp,     color: "#065f46" },
  };

  const scopeColor: Record<IdentityRole["scopeType"], string> = {
    global: "#1e293b", eco: "#7c3aed", saas: "#2563eb", platform: "#0891b2", project: "#059669", city: "#d97706",
  };

  return (
    <div className="space-y-4">
      {/* 子 Tab 切换 */}
      <div
        className="flex items-center gap-1 p-1"
        style={{ background: "#ffffff", border: `1px solid ${S.border}`, borderRadius: S.radius }}
      >
        <button
          onClick={() => setSubTab("accounts")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold transition-all relative"
          style={{
            background: subTab === "accounts" ? "#1e293b" : "transparent",
            color: subTab === "accounts" ? S.accent : S.textSec,
            borderRadius: S.radiusSm,
          }}
        >
          <UsersRound size={14} />
          账号管理
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full" style={{
            background: subTab === "accounts" ? S.accent : S.accentLight,
            color: S.onAccent,
          }}>{accounts.length}</span>
        </button>
        <button
          onClick={() => setSubTab("invites")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold transition-all relative"
          style={{
            background: subTab === "invites" ? "#1e293b" : "transparent",
            color: subTab === "invites" ? S.accent : S.textSec,
            borderRadius: S.radiusSm,
          }}
        >
          <UserPlus size={14} />
          邀请审核
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full" style={{
            background: subTab === "invites" ? S.accent : S.accentLight,
            color: S.onAccent,
          }}>{invSubmitted > 0 ? `${invites.length} · 待审${invSubmitted}` : invites.length}</span>
        </button>
      </div>

      {subTab === "accounts" ? (
        <>
          {/* 第一排统计卡（总览） */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "账号总数", value: accounts.length, Icon: UsersRound, onClick: () => applyStatCard({ label: "账号总数" }) },
              { label: "正常启用", value: accounts.filter(a => a.status === "active").length, Icon: ShieldCheck, onClick: () => applyStatCard({ label: "正常启用", sf: "active" }) },
              { label: "分配工具", value: totalTools, Icon: Radio, onClick: () => applyStatCard({ label: "分配工具", tsf: "in_use" }) },
              { label: "覆盖项目", value: totalProjects, Icon: Building2, onClick: () => applyStatCard({ label: "覆盖项目" }) },
            ].map(s => (
              <button key={s.label} type="button" className="text-left px-3 py-3 flex items-center gap-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, ...statCardStyle(statCardHighlight(s.label)) }} onClick={s.onClick}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "#1e293b", borderRadius: S.radiusSm }}><s.Icon size={14} style={{ color: S.accent }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono" style={{ color: S.muted }}>{s.label}</div>
                  <div className="text-base font-bold mt-0.5" style={{ color: S.text }}>{s.value}</div>
                </div>
                <ChevronRight size={12} style={{ color: S.mutedLight }} />
              </button>
            ))}
          </div>

          {/* 第二排统计卡（领用分档） */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "领用·使用中", value: bindInUse, bg: S.accent, color: S.onAccent, Icon: Eye, preset: { bf: "in_use" as BindingStatus } },
              { label: "领用·空闲", value: bindIdle, bg: "#f1f5f9", color: "#475569", Icon: EyeOff, preset: { bf: "idle" as BindingStatus } },
              { label: "领用·待交接", value: bindPending, bg: "#3b82f6", color: "#ffffff", Icon: Clock, preset: { bf: "pending_transfer" as BindingStatus } },
              { label: "领用·异常", value: bindAbnormal, bg: "#ff6b6b", color: "#ffffff", Icon: AlertTriangle, preset: { bf: "abnormal" as BindingStatus } },
            ].map(s => (
              <button key={s.label} type="button" className="text-left px-3 py-2.5 flex items-center gap-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, ...statCardStyle(statCardHighlight(s.label)) }} onClick={() => applyStatCard({ label: s.label, ...s.preset })}>
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: s.bg, borderRadius: S.radiusSm }}><s.Icon size={12} style={{ color: s.color }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono" style={{ color: S.muted }}>{s.label}</div>
                  <div className="text-base font-bold" style={{ color: s.bg === "#ff6b6b" ? s.bg : S.text }}>{s.value}</div>
                </div>
                <ChevronRight size={12} style={{ color: S.mutedLight }} />
              </button>
            ))}
          </div>

          {/* 筛选 + 操作工具栏 */}
          <div className="p-4 flex items-center justify-between gap-4 flex-wrap" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <div className="relative flex-1 max-w-[320px]">
                <input
                  value={keyword}
                  onChange={e => { setKeyword(e.target.value); setPage(1); }}
                  placeholder="搜索姓名 / 邮箱 / 手机 / UID"
                  className="pl-9 pr-3 py-2 text-xs w-full font-mono outline-none"
                  style={{ background: "#fafaf8", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }}
                />
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: S.muted }} />
              </div>
              <select className="px-3 py-2 text-xs font-bold font-mono" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); setStatCardPreset(null); }}>
                <option value="all">全部状态</option>
                <option value="active">● 正常</option>
                <option value="pending">◐ 待激活</option>
                <option value="disabled">○ 已停用</option>
              </select>
              <select className="px-3 py-2 text-xs font-bold font-mono" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={bindFilter} onChange={e => { setBindFilter(e.target.value as any); setPage(1); setStatCardPreset(null); }}>
                <option value="all">全部领用状态</option>
                {(Object.keys(bindingStatusMeta) as BindingStatus[]).map(s => (
                  <option key={s} value={s}>● {bindingStatusMeta[s].label}</option>
                ))}
              </select>
              <select className="px-3 py-2 text-xs font-bold font-mono" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); setStatCardPreset(null); }}>
                {roleOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select className="px-3 py-2 text-xs font-bold font-mono" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={toolStatusFilter} onChange={e => { setToolStatusFilter(e.target.value as any); setPage(1); setStatCardPreset(null); }}>
                <option value="all">全部工具状态</option>
                <option value="in_use">● 使用中</option>
                <option value="idle">○ 空闲</option>
                <option value="pending_transfer">◐ 待交接</option>
                <option value="abnormal">⚠ 异常</option>
              </select>
              {(keyword || statusFilter !== "all" || roleFilter !== "全部身份" || bindFilter !== "all" || toolStatusFilter !== "all" || statCardPreset) && (
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}
                  onClick={() => { setKeyword(""); setStatusFilter("all"); setRoleFilter("全部身份"); setBindFilter("all"); setToolStatusFilter("all"); setStatCardPreset(null); setPage(1); }}>
                  <RotateCcw size={11} />重置筛选
                </button>
              )}
              <span className="text-xs font-mono" style={{ color: S.muted }}>共 <b style={{ color: S.text }}>{totalFiltered}</b> 条 · 第 {safePage}/{totalPages} 页</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#ffffff", color: "#1e293b", borderRadius: S.radiusSm, border: "1px solid #1e293b" }} onClick={() => setInviteOpen(true)}><UserPlus size={12} />邀请注册</button>
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#ffffff", color: "#1e293b", borderRadius: S.radiusSm, border: "1px solid #1e293b" }} onClick={exportCsv}><Download size={12} />导出CSV</button>
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreating(true)}><Plus size={12} />新建账号</button>
            </div>
          </div>

          {/* 表格 + 分页 */}
          <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="min-w-[1860px]">
              <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono sticky top-0 z-10" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
                <div className="flex-shrink-0 pr-2" style={{ width: 40 }}>
                  <button type="button" onClick={toggleAllVisibleRows} style={{ color: someVisibleChecked ? "#999" : "#1e293b", display: "inline-flex", alignItems: "center" }} title="勾选本页全部">
                    {allVisibleChecked ? <CheckSquare size={14} style={{ color: "#1e293b" }} /> : someVisibleChecked ? <CheckSquare size={14} style={{ color: "#bbb" }} /> : <Square size={14} />}
                  </button>
                </div>
                {([
                  { label: "姓名", w: 160, sort: "name" as AccSortKey | null },
                  { label: "邮箱", w: 160, sort: null },
                  { label: "手机号", w: 120, sort: null },
                  { label: "身份标签", w: 240, sort: null },
                  { label: "分配项目", w: 220, sort: null },
                  { label: "分配通讯工具", w: 300, sort: "toolCount" as AccSortKey | null },
                  { label: "工具状态", w: 100, sort: null },
                  { label: "领用状态", w: 100, sort: null },
                  { label: "账号状态", w: 90, sort: null },
                  { label: "创建时间", w: 130, sort: "createdAt" as AccSortKey | null },
                  { label: "操作", w: 200, sort: null },
                ]).map(col => {
                  const isSorted = col.sort && sortKey === col.sort;
                  return (
                    <div
                      key={col.label}
                      className={`flex-shrink-0 select-none flex items-center gap-1 ${col.sort ? "cursor-pointer hover:underline" : ""}`}
                      style={{ width: col.w }}
                      onClick={() => col.sort && toggleSort(col.sort)}
                    >
                      {col.label}
                      {col.sort && (
                        isSorted
                          ? (sortDir === "asc" ? <ChevronUp size={12} style={{ color: "#1e293b" }} /> : <ChevronDown size={12} style={{ color: "#1e293b" }} />)
                          : <ChevronDown size={12} style={{ color: "#ccc" }} />
                      )}
                    </div>
                  );
                })}
              </div>
              {pagedRows.length === 0 ? (
                <div className="px-4 py-12 text-center text-xs font-mono" style={{ color: S.muted }}>没有匹配的账号，调整筛选条件或点击「新建账号」。</div>
              ) : pagedRows.map(({ account: a, assignedTools, toolStatuses }, idx) => {
                const primaryToolStatus = toolStatuses.length > 0 ? toolStatuses[0] : "idle";
                const bindMeta = bindingStatusMeta[a.bindingStatus];
                const checked = batchSelection.includes(a.uid);
                const typeColors: Record<string, string> = { wecom: "#1e293b", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                return (
                  <div key={a.uid} className="flex items-start px-4 py-3 text-xs font-mono" style={{ background: checked ? "rgba(204,255,0,0.05)" : (idx % 2 === 0 ? "#ffffff" : "#fafaf8"), borderBottom: `1px solid ${S.border}`, transition: "background .15s" }}>
                    <div className="flex-shrink-0 pr-2 pt-0.5" style={{ width: 40 }}>
                      <button type="button" onClick={() => toggleRow(a.uid)}>
                        {checked ? <CheckSquare size={14} style={{ color: "#1e293b" }} /> : <Square size={14} style={{ color: S.mutedLight }} />}
                      </button>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 160 }}>
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{a.name[0] || "?"}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: S.text }}>{a.name || "<未填>"}</div>
                        <div className="text-[10px] truncate" style={{ color: S.muted }}>{a.uid}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 truncate" style={{ width: 160, color: S.textSec }} title={a.email || ""}>{a.email || "—"}</div>
                    <div className="flex-shrink-0 truncate" style={{ width: 120, color: S.textSec }}>{a.phone || "—"}</div>
                    {/* 身份标签：带层级可视化 */}
                    <div className="flex-shrink-0 flex flex-col gap-1" style={{ width: 240 }}>
                      {a.identities.length === 0 && <span className="px-1.5 py-0.5 text-[10px]" style={{ color: S.muted }}>未分配身份</span>}
                      {a.identities.map((i, k) => (
                        <div key={k} className="flex items-center gap-1 flex-wrap">
                          <span className="px-1 py-0.5 text-[9px] font-bold inline-flex items-center gap-0.5" style={{ background: scopeColor[i.scopeType], color: "#ffffff", borderRadius: S.radiusSm }} title={`作用域：${scopeTypeLabelZh[i.scopeType]}`}>
                            <MapPin size={8} />{scopeTypeLabelZh[i.scopeType]}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold" title={i.permissionSummary} style={{ background: S.accentLight, color: "#1e293b", border: `1px solid rgba(204,255,0,0.35)`, borderRadius: S.radiusSm }}>
                            {i.label}
                          </span>
                          {i.scopeType !== "global" && i.scopeIds.length > 0 && (
                            <span className="text-[9px] font-mono" style={{ color: S.muted }} title={i.scopeIds.join(" / ")}>
                              ×{i.scopeIds.length}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex-shrink-0 flex flex-wrap gap-1 content-start" style={{ width: 220 }}>
                      {a.projectIds.length === 0 && <span className="px-1.5 py-0.5 text-[10px]" style={{ color: S.muted }}>未分配项目</span>}
                      {a.projectIds.slice(0, 4).map(pid => (
                        <span key={pid} className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} title={projectId2Name[pid] || pid}>
                          {projectId2Name[pid] || projectList.find(p => String(p.id) === pid || p.id === pid)?.name || pid}
                        </span>
                      ))}
                      {a.projectIds.length > 4 && <span className="text-[9px] px-1" style={{ color: S.muted }}>+{a.projectIds.length - 4}</span>}
                    </div>
                    <div className="flex-shrink-0" style={{ width: 300 }}>
                      {assignedTools.length === 0 ? (
                        <span className="px-2 py-0.5 text-[10px]" style={{ color: S.muted }}>未分配工具</span>
                      ) : (
                        <div className="space-y-1">
                          {assignedTools.slice(0, 3).map((t, k) => {
                            const TI = toolTypeIconMap[t.type];
                            return (
                              <div key={k} className="flex flex-wrap gap-1 items-center">
                                <span className="px-1 py-0.5 text-[9px] font-bold inline-flex items-center gap-1" style={{ background: typeColors[t.type] || "#1e293b", color: "#ffffff", borderRadius: S.radiusSm }}>
                                  <TI size={8} />{t.name}
                                </span>
                                <span className="px-1 py-0.5 text-[9px] font-bold" style={{ background: toolStatusChip[t.status].bg, color: toolStatusChip[t.status].color, borderRadius: S.radiusSm }}>{toolStatusChip[t.status].label}</span>
                                {t.boundProjectIds.length > 0 && t.boundProjectIds.slice(0, 2).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#1e293b", borderRadius: S.radiusSm }}>{projectId2Name[pid] || pid}</span>)}
                                {t.boundProjectIds.length > 2 && <span className="text-[9px]" style={{ color: S.muted }}>+{t.boundProjectIds.length - 2}</span>}
                              </div>
                            );
                          })}
                          {assignedTools.length > 3 && <div className="text-[9px]" style={{ color: S.muted }}>还有 {assignedTools.length - 3} 个工具…</div>}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0" style={{ width: 100 }}>
                      <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: toolStatusChip[primaryToolStatus].bg, color: toolStatusChip[primaryToolStatus].color, borderRadius: S.radiusSm }}>{toolStatusChip[primaryToolStatus].label}</span>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 100 }}>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: bindMeta.bg,
                          color: bindMeta.color,
                          border: `1px solid ${bindMeta.color}55`,
                          borderRadius: S.radiusSm,
                        }}
                      >{bindMeta.label}</span>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 90 }}>
                      <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: statusChip[a.status].bg, color: statusChip[a.status].color, borderRadius: S.radiusSm }}>{statusChip[a.status].label}</span>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 130, color: S.textSec }}>{a.createdAt}</div>
                    <div className="flex-shrink-0 flex items-center gap-1 flex-wrap" style={{ width: 200 }}>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => setDetailOpen(a)}><Eye size={11} />详情</button>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => setEditing(a)}><Settings size={11} />编辑</button>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => setQuickAssignToolOpen(a)} title="快速分配工具"><ArrowLeftRight size={11} /></button>
                      {a.status !== "active" && <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setStatus(a.uid, "active")}>启用</button>}
                      {a.status === "active" && <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", color: "#991b1b", border: "1px solid #991b1b", borderRadius: S.radiusSm }} onClick={() => setStatus(a.uid, "disabled", true)}>停用</button>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分页 + 批量操作栏 */}
            <div className="sticky bottom-0 flex items-center justify-between px-4 py-3 gap-4 flex-wrap" style={{ background: "#fcfcfc", borderTop: `1px solid ${S.border}`, borderRadius: `0 0 ${S.radius} ${S.radius}` }}>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div style={{ color: S.muted }}>
                  已选中 <b style={{ color: "#1e293b" }}>{batchSelection.length}</b> 项
                  {batchSelection.length > 0 && (
                    <button className="ml-2 underline" style={{ color: S.muted }} onClick={() => setBatchSelection([])}>清空</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? S.accent : "#f1f5f9", color: batchSelection.length ? "#ffffff" : "#999", borderRadius: S.radiusSm }}
                    onClick={() => batchSetStatus("active")}
                  ><CheckCircle size={11} />批量启用</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#ffffff" : "#f1f5f9", color: batchSelection.length ? "#991b1b" : "#999", border: `1px solid ${batchSelection.length ? "#991b1b" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => batchSetStatus("disabled")}
                  ><XCircle size={11} />批量停用</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#ffffff" : "#f1f5f9", color: batchSelection.length ? "#1e293b" : "#999", border: `1px solid ${batchSelection.length ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => { setBatchAction("assignProject"); setBatchTargetId([]); }}
                  ><Building2 size={11} />批量分配项目</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#ffffff" : "#f1f5f9", color: batchSelection.length ? "#1e293b" : "#999", border: `1px solid ${batchSelection.length ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => { setBatchAction("assignTools"); setBatchTargetId([]); }}
                  ><Radio size={11} />批量分配工具</button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button type="button" disabled={safePage <= 1} className="px-2.5 py-1.5 font-bold" style={{ background: safePage > 1 ? "#ffffff" : "#f1f5f9", color: safePage > 1 ? S.text : "#999", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</button>
                <div style={{ color: S.text }}>第 <b>{safePage}</b> / {totalPages} 页</div>
                <button type="button" disabled={safePage >= totalPages} className="px-2.5 py-1.5 font-bold" style={{ background: safePage < totalPages ? "#ffffff" : "#f1f5f9", color: safePage < totalPages ? S.text : "#999", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>下一页</button>
                <select className="px-2 py-1.5 text-[11px] font-bold" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={safePage} onChange={e => setPage(Number(e.target.value))}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <option key={p} value={p}>跳转到第 {p} 页</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
            <ShieldCheck size={18} style={{ color: "#1e293b", marginTop: 1, flexShrink: 0 }} />
            <div>
              <div className="text-sm font-bold mb-1">账号 · 工具池 · 项目分配 <span className="ml-2 text-[10px] font-mono font-normal" style={{ color: S.muted }}>Tip: 统计卡可点击跳转对应筛选 · 表头姓名/工具数/创建时间可排序</span></div>
              <p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>通讯工具（企微/个人微信/手机号/媒体账号）独立管理在「通讯工具中心」的工具池中。账号编辑时从工具池选择分配，保存后自动同步工具的领用状态。一个工具同一时间只能被一个账号领用，但可跨多个项目使用。如需新成员加入，点击「邀请注册」发送带邀请码的链接，对方填写后回到本页「邀请审核」Tab 完成审核，通过后将自动创建系统账号。</p>
            </div>
          </div>
        </>
      ) : (
        // ================= 邀请审核子 Tab =================
        <>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "邀请总数", value: invites.length, Icon: Share2, bg: "#1e293b", color: S.accent },
              { label: "待填写", value: invPending, Icon: Clock, bg: "#ffffff", color: "#ffffff" },
              { label: "待审核", value: invSubmitted, Icon: AlertTriangle, bg: "#3b82f6", color: "#ffffff" },
              { label: "已通过 / 已驳回", value: `${invApproved} / ${invRejected}`, Icon: ThumbsUp, bg: "#ffffff", color: "#ffffff" },
            ].map((s: any) => (
              <div key={s.label} className="px-3 py-3 flex items-center gap-2" style={{ background: s.bg || S.surface, border: `1px solid ${s.bg === "#1e293b" ? "#1e293b" : S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: s.bg === "#1e293b" ? "#ffffff" : S.accentLight, borderRadius: S.radiusSm }}>
                  <s.Icon size={14} style={{ color: s.bg === "#1e293b" ? S.accent : "#1e293b" }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono" style={{ color: s.bg === "#1e293b" ? "rgba(255,255,255,0.7)" : S.muted }}>{s.label}</div>
                  <div className="text-base font-bold mt-0.5" style={{ color: s.bg === "#1e293b" ? "#ffffff" : S.text }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex items-center justify-between gap-4 flex-wrap" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <div className="relative flex-1 max-w-[320px]">
                <input
                  value={inviteKeyword}
                  onChange={e => setInviteKeyword(e.target.value)}
                  placeholder="搜索姓名 / 手机 / 邮箱 / 邀请码 / 邀请人"
                  className="pl-9 pr-3 py-2 text-xs w-full font-mono outline-none"
                  style={{ background: "#fafaf8", border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }}
                />
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: S.muted }} />
              </div>
              <select className="px-3 py-2 text-xs font-bold font-mono" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={inviteStatusFilter} onChange={e => setInviteStatusFilter(e.target.value as any)}>
                <option value="all">全部邀请状态</option>
                <option value="pending">待填写</option>
                <option value="submitted">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
                <option value="expired">已过期</option>
              </select>
              <button
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
                style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}
                onClick={() => { setInviteKeyword(""); setInviteStatusFilter("all"); }}
              >
                <Filter size={11} />重置筛选
              </button>
              <span className="text-xs font-mono" style={{ color: S.muted }}>共 <b style={{ color: S.text }}>{filteredInvites.length}</b> 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setInviteOpen(true)}><UserPlus size={12} />新建邀请</button>
            </div>
          </div>

          <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="min-w-[1300px]">
              <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569" }}>
                {([
                  ["被邀请人", 170], ["手机 / 邮箱", 200], ["邀请码", 120],
                  ["建议身份 / 项目", 260], ["邀请状态", 120],
                  ["邀请人 / 时间", 180], ["有效期至 / 重发次数", 160], ["操作", 200],
                ] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
              </div>
              {filteredInvites.length === 0 ? (
                <div className="px-4 py-12 text-center text-xs font-mono" style={{ color: S.muted }}>暂无邀请记录，点击「新建邀请」开始生成第一条邀请码 / 链接。</div>
              ) : filteredInvites.map((inv, idx) => {
                const sMeta = inviteStatusMeta[inv.status];
                const resendCount = (inv as any).resendCount as number | undefined;
                return (
                  <div
                    key={inv.id}
                    className="flex items-start px-4 py-3 text-xs font-mono"
                    style={{
                      background: idx % 2 === 0 ? "#ffffff" : "#fafaf8",
                      borderBottom: `1px solid ${S.border}`,
                      boxShadow: inv.status === "submitted" ? "inset 2px 0 0 #1e293b" : undefined,
                    }}
                  >
                    <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 170 }}>
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#3b82f6", color: "#ffffff", borderRadius: S.radiusSm }}>
                        {inv.inviteeName?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: S.text }}>{inv.inviteeName}</div>
                        <div className="text-[10px]" style={{ color: S.muted }}>{inv.id}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 200, color: S.textSec }}>
                      <div>📱 {inv.inviteePhone}</div>
                      <div className="text-[10px] truncate" style={{ color: S.muted }}>✉ {inv.inviteeEmail}</div>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 120 }}>
                      <div className="inline-flex items-center px-2 py-1 font-bold" style={{ fontFamily: "ui-monospace, Menlo, monospace", background: S.surfaceSoft, border: `1px solid ${S.border}`, color: S.text, borderRadius: S.radiusSm, letterSpacing: 1 }}>
                        {inv.inviteCode}
                      </div>
                    </div>
                    <div className="flex-shrink-0 space-y-1" style={{ width: 260 }}>
                      <div className="flex flex-wrap gap-1">
                        {inv.suggestedIdentities.length === 0 && <span className="px-1.5 py-0.5 text-[10px]" style={{ color: S.muted }}>未指定身份</span>}
                        {inv.suggestedIdentities.map((i, k) => (
                          <span key={k} className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: "#1e293b", border: `1px solid rgba(204,255,0,0.35)`, borderRadius: S.radiusSm }}>{i.label}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {inv.suggestedProjectIds.length === 0 && <span className="px-1.5 py-0.5 text-[10px]" style={{ color: S.muted }}>未指定项目</span>}
                        {inv.suggestedProjectIds.map(pid => (
                          <span key={pid} className="px-1.5 py-0.5 text-[10px]" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>
                            {inviteProjectName[pid] || pid}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 120 }}>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: sMeta.bg, color: sMeta.color, border: `1px solid ${sMeta.color}55` }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sMeta.dot }} />
                        {sMeta.label}
                      </span>
                      {inv.submittedAt && inv.status === "submitted" && (<div className="text-[10px] mt-1" style={{ color: S.muted }}>于 {inv.submittedAt} 提交</div>)}
                      {inv.reviewedAt && (inv.status === "approved" || inv.status === "rejected") && (<div className="text-[10px] mt-1" style={{ color: S.muted }}>{inv.reviewedBy} 于 {inv.reviewedAt}</div>)}
                    </div>
                    <div className="flex-shrink-0" style={{ width: 180, color: S.textSec }}>
                      <div>🧑 {inv.inviterName || inv.inviterUid}</div>
                      <div className="text-[10px]" style={{ color: S.muted }}>{inv.createdAt}</div>
                    </div>
                    <div className="flex-shrink-0" style={{ width: 160, color: S.textSec }}>
                      <div>⏳ {inv.expireAt}</div>
                      <div className="text-[10px]" style={{ color: S.muted }}>
                        {inv.status === "expired" ? "邀请链接已失效" : "邀请链接有效中"}
                        {resendCount != null && resendCount > 0 && <span className="ml-1 px-1" style={{ background: S.accentLight, color: S.onPrimary, borderRadius: 3 }}>重发 {resendCount}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center flex-wrap gap-1.5" style={{ width: 200 }}>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm }} onClick={() => openReview(inv)}>
                        <Eye size={11} /> 查看
                      </button>
                      {inv.status === "submitted" && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => openReview(inv)}>
                          <CheckCircle size={11} /> 审核
                        </button>
                      )}
                      {(inv.status === "pending" || inv.status === "expired" || inv.status === "rejected") && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={() => resendInvite(inv)} title="重置有效期为 7 天后">
                          <RotateCcw size={11} /> 重发
                        </button>
                      )}
                      {(inv.status === "pending" || inv.status === "submitted") && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", border: "1px solid #c00", color: "#c00", borderRadius: S.radiusSm }} onClick={() => revokeInvite(inv)}>
                          撤销
                        </button>
                      )}
                      {inv.status === "rejected" && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#ffffff", border: "1px solid #1e293b", color: "#1e293b", borderRadius: S.radiusSm }} onClick={() => {
                          setInvites(prev => prev.map(i => i.id === inv.id ? { ...i, status: "pending", rejectReason: undefined, reviewedBy: undefined, reviewedByUid: undefined, reviewedAt: undefined } : i));
                          setToast("已退回邀请为待填写，申请人可重新提交");
                        }}>
                          重新邀请
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {invites.some(i => i.status === "submitted") && (
            <div className="p-4 flex items-start gap-4" style={{ background: "rgba(255, 214, 0, 0.15)", border: "1px solid rgba(255,214,0,0.4)", borderRadius: S.radius }}>
              <AlertTriangle size={18} style={{ color: "#a05200", marginTop: 1, flexShrink: 0 }} />
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: "#a05200" }}>
                  待审核邀请提示（{invSubmitted} 条）
                </div>
                <p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>
                  点击「审核」可调整建议身份、分配项目和初始领用状态；通过后将自动在本页「账号管理」中生成系统账号；驳回请务必填写原因，系统将自动通过邮件通知申请人。
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawers */}
      {editing && <AccountDrawer initial={editing} onClose={() => setEditing(null)} onSave={a => { save(a); setEditing(null); }} projectList={projectList} />}
      {creating && <AccountDrawer onClose={() => setCreating(false)} onSave={a => { save(a); setCreating(false); }} projectList={projectList} />}
      <InviteDrawer open={inviteOpen} onClose={() => setInviteOpen(false)} />
      {reviewing && (
        <InviteReviewDrawer
          open={reviewOpen}
          onClose={() => { setReviewOpen(false); setReviewing(null); }}
          invite={reviewing}
        />
      )}

      {/* 详情抽屉 */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setDetailOpen(null)}>
          <aside className="w-[560px] max-w-full h-full flex flex-col animate-[slideIn_.2s_ease-out]" style={{ background: "#ffffff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex items-center justify-center font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius }}>{detailOpen.name[0] || "?"}</div>
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">{detailOpen.name}</div>
                  <div className="text-[11px] font-mono" style={{ color: S.muted }}>{detailOpen.uid} · 创建于 {detailOpen.createdAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: statusChip[detailOpen.status].bg, color: statusChip[detailOpen.status].color, borderRadius: S.radiusSm }}>{statusChip[detailOpen.status].label}</span>
                <button onClick={() => setDetailOpen(null)} className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5 space-y-5 text-xs" style={{ fontFamily: "monospace" }}>
              <section className="space-y-2">
                <div className="text-[10px] font-bold" style={{ color: S.muted }}>基本信息</div>
                <div className="grid grid-cols-2 gap-3 p-3" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div><div className="text-[10px]" style={{ color: S.muted }}>邮箱</div><div className="font-bold mt-0.5" style={{ color: S.text }}>{detailOpen.email || "—"}</div></div>
                  <div><div className="text-[10px]" style={{ color: S.muted }}>手机号</div><div className="font-bold mt-0.5" style={{ color: S.text }}>{detailOpen.phone || "—"}</div></div>
                  <div><div className="text-[10px]" style={{ color: S.muted }}>领用状态</div><div className="mt-0.5"><span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: bindingStatusMeta[detailOpen.bindingStatus].bg, color: bindingStatusMeta[detailOpen.bindingStatus].color, borderRadius: S.radiusSm }}>{bindingStatusMeta[detailOpen.bindingStatus].label}</span></div></div>
                  <div><div className="text-[10px]" style={{ color: S.muted }}>创建时间</div><div className="font-bold mt-0.5" style={{ color: S.text }}>{detailOpen.createdAt}</div></div>
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: S.muted }}>
                  <ShieldCheck size={11} />身份与权限（共 {detailOpen.identities.length} 个）
                </div>
                <div className="space-y-2">
                  {detailOpen.identities.length === 0 && <div className="p-3 text-[10px]" style={{ color: S.muted, background: S.surfaceSoft, borderRadius: S.radiusSm }}>尚未分配任何身份</div>}
                  {detailOpen.identities.map((i, k) => {
                    const scopeNames = i.scopeType === "global" ? ["全部范围"] : i.scopeIds.map(sid => {
                      const opt = availableProjects.find(p => p.id === sid);
                      if (opt) return opt.name;
                      return sid;
                    });
                    return (
                      <div key={k} className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="px-1.5 py-0.5 text-[9px] font-bold inline-flex items-center gap-0.5" style={{ background: scopeColor[i.scopeType], color: "#ffffff", borderRadius: S.radiusSm }}>
                            <MapPin size={8} />{scopeTypeLabelZh[i.scopeType]}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: "#1e293b", borderRadius: S.radiusSm }}>{i.label}</span>
                          <span className="text-[10px]" style={{ color: S.muted }}>permission: {i.permissionSummary}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {scopeNames.map(n => (
                            <span key={n} className="px-1.5 py-0.5 text-[9px]" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>{n}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: S.muted }}>
                  <Building2 size={11} />覆盖项目（共 {detailOpen.projectIds.length} 个）
                </div>
                <div className="flex flex-wrap gap-1.5 p-3" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  {detailOpen.projectIds.length === 0 && <span className="text-[10px]" style={{ color: S.muted }}>未分配任何项目</span>}
                  {detailOpen.projectIds.map(pid => {
                    const nm = projectId2Name[pid] || projectList.find(p => String(p.id) === pid || p.id === pid)?.name || pid;
                    return <span key={pid} className="px-2 py-0.5 text-[10px] font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>{nm}</span>;
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: S.muted }}>
                  <Radio size={11} />分配通讯工具（共 {detailOpen.assignedToolIds.length} 个）
                </div>
                <div className="space-y-2">
                  {detailOpen.assignedToolIds.length === 0 && <div className="p-3 text-[10px]" style={{ color: S.muted, background: S.surfaceSoft, borderRadius: S.radiusSm }}>尚未分配通讯工具</div>}
                  {detailOpen.assignedToolIds.map((tid, k) => {
                    const t = toolMap[tid];
                    if (!t) return null;
                    const TI = toolTypeIconMap[t.type];
                    const typeColors: Record<string, string> = { wecom: "#1e293b", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                    return (
                      <div key={tid} className="flex items-center gap-2 p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: typeColors[t.type] || "#1e293b", borderRadius: S.radiusSm }}>
                          <TI size={12} style={{ color: "#ffffff" }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold" style={{ color: S.text }}>{t.name}</div>
                          <div className="text-[10px]" style={{ color: S.muted }}>{t.identifier} · 所属 {t.type}</div>
                          {t.boundProjectIds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.boundProjectIds.slice(0, 4).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#1e293b", borderRadius: 3 }}>{projectId2Name[pid] || pid}</span>)}
                              {t.boundProjectIds.length > 4 && <span className="text-[9px]" style={{ color: S.muted }}>+{t.boundProjectIds.length - 4}</span>}
                            </div>
                          )}
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: toolStatusChip[t.status].bg, color: toolStatusChip[t.status].color, borderRadius: S.radiusSm }}>{toolStatusChip[t.status].label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: S.muted }}>
                  <History size={11} />操作日志时间线（共 {detailOpen.operationLogs?.length ?? 0} 条）
                </div>
                <div className="relative p-3 space-y-3" style={{ background: S.surfaceSoft, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  {(!detailOpen.operationLogs || detailOpen.operationLogs.length === 0) && <div className="text-[10px]" style={{ color: S.muted }}>暂无操作记录</div>}
                  {detailOpen.operationLogs?.map((op, k) => {
                    const meta = opTypeMeta[op.type] || { label: op.type, bg: "#eee", icon: Info, color: "#333" };
                    const Icon = meta.icon;
                    const last = k === detailOpen.operationLogs.length - 1;
                    return (
                      <div key={op.id} className="relative flex gap-3 pb-3" style={{ paddingLeft: 28 }}>
                        <div className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center rounded-full" style={{ background: meta.bg, color: meta.color }}>
                          <Icon size={11} />
                        </div>
                        {!last && <div className="absolute left-[11px] top-6 bottom-[-12px] w-px" style={{ background: S.border }} />}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 text-[9px] font-bold" style={{ background: meta.bg, color: meta.color, borderRadius: 3 }}>{meta.label}</span>
                            <span className="font-bold" style={{ color: S.text }}>{op.summary}</span>
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ color: S.muted }}>
                            <span>{op.actor}</span> · <span>{op.time}</span>
                            {op.details && Object.keys(op.details).length > 0 && <span className="ml-2" title={JSON.stringify(op.details)}>· 含详情</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
            <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#ffffff", borderTop: `1px solid ${S.border}` }}>
              <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setDetailOpen(null)}>关闭</button>
              <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }} onClick={() => { const a = detailOpen; setDetailOpen(null); setEditing(a); }}><Settings size={13} />前往编辑</button>
            </div>
          </aside>
        </div>
      )}

      {/* 快速分配工具抽屉 / 批量分配工具抽屉（共用） */}
      {(quickAssignToolOpen || batchAction === "assignTools") && (() => {
        const isBatch = batchAction === "assignTools";
        const targetName = isBatch ? `${batchAccounts.length} 个账号` : (quickAssignToolOpen?.name || "");
        const title = isBatch ? `批量分配工具：${targetName}` : `快速分配工具给 ${targetName}`;
        const availablePool = tools.filter(t => !t.boundAccountId || t.status === "idle" || (!isBatch && t.boundAccountId === quickAssignToolOpen?.uid));
        const [local, setLocal] = useState<string[]>([]);
        return (
          <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => { isBatch ? setBatchAction(null) : setQuickAssignToolOpen(null); }}>
            <aside className="w-[520px] max-w-full h-full flex flex-col" style={{ background: "#ffffff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">{title}</div>
                  <div className="text-[11px] font-mono mt-0.5" style={{ color: S.muted }}>当前可选 {availablePool.length} 个闲置工具 · 已选 {local.length}</div>
                </div>
                <button onClick={() => { isBatch ? setBatchAction(null) : setQuickAssignToolOpen(null); }} className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-auto p-5 space-y-2 text-xs" style={{ fontFamily: "monospace" }}>
                {availablePool.length === 0 && <div className="p-4 text-center text-[11px]" style={{ color: S.muted }}>工具池暂无可用工具，请到「通讯工具中心」先新增工具。</div>}
                {availablePool.map(t => {
                  const TI = toolTypeIconMap[t.type];
                  const typeColors: Record<string, string> = { wecom: "#1e293b", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                  const checked = local.includes(t.id);
                  return (
                    <button key={t.id} type="button" className="w-full text-left flex items-center gap-3 p-3" style={{ background: checked ? S.accentLight : S.surface, border: `1px solid ${checked ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}
                      onClick={() => setLocal(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: typeColors[t.type] || "#1e293b", borderRadius: S.radiusSm }}>
                        <TI size={12} style={{ color: "#ffffff" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: S.text }}>{t.name}</div>
                        <div className="text-[10px] truncate" style={{ color: S.muted }}>{t.identifier}</div>
                      </div>
                      {checked ? <CheckSquare size={16} style={{ color: "#1e293b" }} /> : <Square size={16} style={{ color: S.mutedLight }} />}
                    </button>
                  );
                })}
              </div>
              <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#ffffff", borderTop: `1px solid ${S.border}` }}>
                <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => { isBatch ? setBatchAction(null) : setQuickAssignToolOpen(null); }}>取消</button>
                <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={local.length === 0} style={{ background: local.length ? "#1e293b" : "#ddd", color: local.length ? S.accent : "#888", borderRadius: S.radiusSm }}
                  onClick={() => {
                    if (isBatch) batchAssignTools(local);
                    else if (quickAssignToolOpen) quickAssignToolsToSingle(quickAssignToolOpen, local);
                  }}>
                  <ArrowLeftRight size={13} />分配 {local.length} 个工具
                </button>
              </div>
            </aside>
          </div>
        );
      })()}

      {/* 批量分配项目抽屉 */}
      {batchAction === "assignProject" && (() => {
        const [local, setLocal] = useState<string[]>([]);
        const projectOptions = [...projectList.map(p => ({ id: String(p.id), name: p.name, type: "项目" })), ...availableProjects.map(p => ({ id: p.id, name: p.name, type: "项目选项" }))];
        const merged = Array.from(new Map(projectOptions.map(o => [o.id, o])).values());
        return (
          <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setBatchAction(null)}>
            <aside className="w-[520px] max-w-full h-full flex flex-col" style={{ background: "#ffffff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">批量分配项目：{batchAccounts.length} 个账号</div>
                  <div className="text-[11px] font-mono mt-0.5" style={{ color: S.muted }}>共 {merged.length} 个候选 · 已选 {local.length}</div>
                </div>
                <button onClick={() => setBatchAction(null)} className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-auto p-5 space-y-2 text-xs" style={{ fontFamily: "monospace" }}>
                {merged.map(p => {
                  const checked = local.includes(p.id);
                  return (
                    <button key={p.id} type="button" className="w-full text-left flex items-center gap-3 p-3" style={{ background: checked ? S.accentLight : S.surface, border: `1px solid ${checked ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}
                      onClick={() => setLocal(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "#1e293b", borderRadius: S.radiusSm }}>
                        <Building2 size={12} style={{ color: S.accent }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: S.text }}>{p.name}</div>
                        <div className="text-[10px] truncate" style={{ color: S.muted }}>{p.id}</div>
                      </div>
                      {checked ? <CheckSquare size={16} style={{ color: "#1e293b" }} /> : <Square size={16} style={{ color: S.mutedLight }} />}
                    </button>
                  );
                })}
              </div>
              <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#ffffff", borderTop: `1px solid ${S.border}` }}>
                <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setBatchAction(null)}>取消</button>
                <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={local.length === 0} style={{ background: local.length ? "#1e293b" : "#ddd", color: local.length ? S.accent : "#888", borderRadius: S.radiusSm }}
                  onClick={() => batchAssignProjects(local)}>
                  <Building2 size={13} />分配 {local.length} 个项目（追加）
                </button>
              </div>
            </aside>
          </div>
        );
      })()}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
type MainTab = "architecture" | "accounts" | "commercial";
const mockCurrentAccounts: { name: string; role: string; avatar: string }[] = [
  { name: "孙悦",  role: "超级生态管理员", avatar: "孙" },
  { name: "李昊",  role: "生态负责人", avatar: "李" },
  { name: "周敏",  role: "生态COO", avatar: "周" },
  { name: "钱程",  role: "SaaS 合作伙伴负责人", avatar: "钱" },
  { name: "吴倩",  role: "SaaS 合作伙伴运营", avatar: "吴" },
  { name: "郑宇",  role: "平台管理员", avatar: "郑" },
  { name: "冯雪",  role: "平台运营", avatar: "冯" },
  { name: "王磊",  role: "项目负责人", avatar: "王" },
  { name: "陈静",  role: "区域运营", avatar: "陈" },
  { name: "杨丽",  role: "客服", avatar: "杨" },
  { name: "林峰",  role: "老师", avatar: "林" },
];
export default function EcosystemManagement() {
  useThemeSingleton();
  const { accounts, setAccounts } = useAccounts();
  const { tools, setTools } = useTools();
  const { platformMode, projectMode } = useProjectContext();
  const [activeTier, setActiveTier] = useState("super");
  const [ecoList, setEcoList] = useState<EcoItem[]>(() => ecosystems.map(e => ({ ...e })));
  const [saasList, setSaasList] = useState<SaasItem[]>(() => saasPlatforms.map(p => ({ ...p })));
  const [platformList, setPlatformList] = useState<PlatformItem[]>(() => platforms.map(p => ({ ...p })));
  const [projectList, setProjectList] = useState<ProjectItem[]>(() => projects.map(p => ({ ...p })));
  const [subs, setSubs] = useState<Subscription[]>(() => subscriptions.map(s => ({ ...s })));
  const [bills, setBills] = useState<BillRecord[]>(() => billRecords.map(b => ({ ...b })));
  const [activePlatformId, setActivePlatformId] = useState<number | null>(null);
  const [activePlatformName, setActivePlatformName] = useState<string | null>(null);
  const [ecosystemFilter, setEcosystemFilter] = useState<string | undefined>(undefined);
  const [mainTab, setMainTab] = useState<MainTab>("architecture");
  // 当前登录身份（联动：按身份过滤生态/SaaS/平台/项目的可见性；仅作为演示态）
  const [currentRole, setCurrentRole] = useState<string>("超级生态管理员");
  const currentUser = mockCurrentAccounts.find(u => u.role === currentRole) ?? mockCurrentAccounts[0];
  const roleTier: Record<string, string> = {
    "超级生态管理员": "super",
    "生态负责人": "eco",
    "生态COO": "eco",
    "SaaS 合作伙伴负责人": "saas",
    "SaaS 合作伙伴运营": "saas",
    "平台管理员": "platform",
    "平台运营": "platform",
    "项目负责人": "platform",
    "区域运营": "platform",
    "客服": "platform",
    "老师": "platform",
  };
  useEffect(() => {
    const nextTier = roleTier[currentRole] ?? "super";
    setActiveTier(nextTier);
    setActivePlatformId(null);
    setActivePlatformName(null);
    setMainTab("architecture");
  }, [currentRole]);
  // 超级态：全量可见；生态层仅当 visibility/生态相关身份才能看到某个生态；这里做简化：按身份过滤项目列表 + 平台列表；生态/SaaS/超级态不变
  const scopedProjects = projectList.filter(p => {
    if (["超级生态管理员", "生态COO", "SaaS 合作伙伴负责人", "SaaS 合作伙伴运营"].includes(currentRole)) return true;
    if (currentRole === "生态负责人") return !!p.visibility["生态负责人"];
    if (currentRole === "平台管理员") return !!p.visibility["平台管理员"];
    if (currentRole === "平台运营") return !!p.visibility["平台运营"];
    return !!p.visibility[currentRole];
  });
  const scopedPlatforms = platformList.filter(pf => {
    if (["超级生态管理员", "生态COO", "SaaS 合作伙伴负责人", "SaaS 合作伙伴运营", "生态负责人"].includes(currentRole)) return true;
    const roleKeyByLabel: Record<string, IdentityRole["roleKey"]> = {
      "平台管理员": "platform_admin",
      "平台运营": "platform_op",
      "项目负责人": "project_owner",
      "区域运营": "regional_op",
    };
    const roleKey = roleKeyByLabel[currentRole];
    const scopedAccount = roleKey
      ? accounts.find(account => account.identities.some(identity => identity.roleKey === roleKey && identity.scopeIds.length > 0))
      : undefined;
    const identity = scopedAccount?.identities.find(item => item.roleKey === roleKey);
    if (identity?.scopeType === "platform") {
      return identity.scopeIds.includes(`platform-${pf.id}`);
    }
    const scopedProjectIds = identity?.scopeType === "project" ? identity.scopeIds : [];
    if (scopedProjectIds.length > 0) {
      return scopedProjects.some(project => scopedProjectIds.includes(`project-${project.id}`) && project.platform === pf.name);
    }
    const pfProjects = scopedProjects.filter(p => p.platform === pf.name);
    return pfProjects.length > 0;
  });
  const scopedEcos = ecoList.filter(eco => {
    if (["超级生态管理员", "生态COO", "SaaS 合作伙伴负责人", "SaaS 合作伙伴运营"].includes(currentRole)) return true;
    if (currentRole === "生态负责人") return true; // 模拟：生态负责人看全部（真实需按 uid 绑定）
    return scopedProjects.some(p => p.eco === eco.name);
  });
  const scopedSaas = saasList.filter(s => {
    if (["超级生态管理员", "生态COO", "SaaS 合作伙伴负责人", "SaaS 合作伙伴运营", "生态负责人"].includes(currentRole)) return true;
    return scopedProjects.some(p => p.saas === s.name);
  });
  const counts: TierCounts = {
    eco: scopedEcos.length,
    saas: scopedSaas.length,
    platforms: scopedPlatforms.length,
    projects: scopedProjects.length,
    users: scopedPlatforms.reduce((n, p) => n + p.users, 0),
    groups: scopedPlatforms.reduce((n, p) => n + p.groups, 0),
  };
  const tiers = buildTiers(counts);
  const tier = tiers.find(t => t.id === activeTier)!;

  return (
    <div className="p-6 h-full flex flex-col gap-5 overflow-auto" style={{ background: S.bg, fontFamily: "monospace" }}>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2"><span className="text-sm font-bold" style={{ color: S.text }}>{getEcosystemContext(activeTier, activePlatformName).label}</span><span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: S.textSec, borderRadius: S.radiusSm }}>{currentRole}</span></div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-mono" style={{ color: S.muted }}>
            {getEcosystemContext(activeTier, activePlatformName).path.map((segment, index) => <span key={`${segment}-${index}`} className="flex items-center gap-1.5"><span style={{ color: index === getEcosystemContext(activeTier, activePlatformName).path.length - 1 ? S.text : S.muted }}>{segment}</span>{index < getEcosystemContext(activeTier, activePlatformName).path.length - 1 && <ChevronRight size={12} style={{ color: S.muted }} />}</span>)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radiusSm }}>
            <div className="flex h-6 w-6 items-center justify-center text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>{currentUser.avatar}</div>
            <select aria-label="切换身份" className="max-w-[128px] bg-transparent text-[10px] font-bold outline-none" style={{ color: S.text }} value={currentRole} onChange={e => setCurrentRole(e.target.value)}>{mockCurrentAccounts.map(u => <option key={u.role}>{u.role}</option>)}</select>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {mainTab === "accounts" && <AccountManagerTab accounts={accounts} setAccounts={setAccounts} projectList={projectList} />}
        {mainTab === "commercial" && <CommercialTab subs={subs} bills={bills} />}
        {mainTab === "architecture" && <>
          {activeTier === "super" && <SuperView role={currentRole} ecoList={ecoList} setEcoList={setEcoList} saasList={saasList} setSaasList={setSaasList} platformList={platformList} setPlatformList={setPlatformList} projectList={projectList} setProjectList={setProjectList} tools={tools} accounts={accounts} setAccounts={setAccounts} subs={subs} setSubs={setSubs} bills={bills} setBills={setBills} onOpenPlatforms={ecoName => { setEcosystemFilter(ecoName); setActiveTier("platform"); setActivePlatformId(null); setActivePlatformName(null); }} onOpenProjects={ecoName => { setEcosystemFilter(ecoName); setActiveTier("platform"); setActivePlatformId(null); setActivePlatformName(null); }} onOpenReports={() => { const url = new URL(window.location.href); url.searchParams.set("module", "reports"); window.history.pushState({}, "", url); window.dispatchEvent(new PopStateEvent("popstate")); }} />}
          {activeTier === "eco" && <EcoView role={currentRole} ecoList={ecoList} saasList={saasList} setSaasList={setSaasList} platformList={platformList} setPlatformList={setPlatformList} />}
           {activeTier === "saas" && <SaasView role={currentRole} ecoList={ecoList} saasList={saasList} platformList={platformList} setPlatformList={setPlatformList} setActiveTier={setActiveTier} setActivePlatformId={setActivePlatformId} setActivePlatformName={setActivePlatformName} />}
          {activeTier === "platform" && (activePlatformId !== null && activePlatformName !== null ? <ProjectList projectList={projectList} setProjectList={setProjectList} ecoList={ecoList} saasList={saasList} platformList={platformList} platformName={activePlatformName} platformId={activePlatformId} onEnterProject={name => projectMode(activePlatformName, name)} onBack={() => { platformMode(); setActivePlatformId(null); setActivePlatformName(null); }} /> : <PlatformView role={currentRole} platformList={scopedPlatforms} setPlatformList={setPlatformList} ecoList={ecoList} saasList={saasList} projectList={projectList} setProjectList={setProjectList} onEnterPlatform={(id, name) => { setEcosystemFilter(undefined); setActiveTier("platform"); setActivePlatformId(id); setActivePlatformName(name); }} ecoFilter={ecosystemFilter} />)}
        </>}
      </div>

    </div>
  );
}
