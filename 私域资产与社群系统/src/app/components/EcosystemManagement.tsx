import { useEffect, useState } from "react";
import { ChevronRight, Globe, Layers, Zap, TrendingUp, Plus, Settings, ArrowRight, Package, LayoutDashboard, CheckCircle, X, Save, ShieldCheck, MessageSquare, Eye, EyeOff, Clock, Building2, UsersRound, Workflow, SlidersHorizontal, AlertTriangle, Radio, Phone, UserPlus, Filter, Share2, ThumbsUp, ThumbsDown, Search, Download, ChevronDown, ChevronUp, Square, CheckSquare, History, MapPin, ArrowLeftRight, XCircle, Check, RotateCcw, Info, FileSpreadsheet } from "lucide-react";
import { defaultGroupTypeRules, type GroupTypeRule } from "../data/projectGroupRules";
import { registerProjectRules, saveProjectRules, useCommunityData } from "../data/communityDataStore";
import { useTools, useAccounts, useInvites, useApprovals } from "../App";
import type { CommunicationTool } from "../data/communicationTools";
import type { IdentityRole, SystemAccount, ScopeTypeLabelMap, BindingStatus, AccountOperation } from "../data/accountTypes";
import { roleKeyMeta, buildScopeTypeLabelMap, mockAccounts as defaultAccounts, bindingStatusMeta, availableProjects } from "../data/accountTypes";
import type { InviteStatus, InviteRecord } from "../data/inviteRecords";
import { inviteStatusMeta } from "../data/inviteRecords";
import { createApproval } from "../data/approvalTypes";
import InviteDrawer from "./InviteDrawer";
import InviteReviewDrawer from "./InviteReviewDrawer";

const S = {
  bg: "#fafafa",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.06)",
  borderMed: "rgba(0,0,0,0.12)",
  accent: "#ccff00",
  accentLight: "rgba(204,255,0,0.08)",
  accentMid: "rgba(204,255,0,0.18)",
  text: "#111111",
  textSec: "#444444",
  muted: "#888888",
  mutedLight: "#bbbbbb",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

// ─── 四层架构定义（工厂函数，counts 动态联动） ────────────────
type TierCounts = { eco: number; saas: number; platforms: number; projects: number; users: number; groups: number };
function buildTiers(c: TierCounts) {
  return [
    {
      id: "super",
      level: 1,
      label: "超级生态",
      icon: Zap,
      desc: "最顶层的生态体系，统一管理所有下属生态、SaaS 系统、平台和资源。拥有全局数据视角和最高权限。",
      role: "平台创始人 / 超级管理员",
      count: 1,
      metrics: [
        { label: "下属生态数", value: String(c.eco) },
        { label: "SaaS 系统数", value: String(c.saas) },
        { label: "平台数",    value: String(c.platforms) },
        { label: "项目总数",   value: String(c.projects) },
      ],
    },
    {
      id: "eco",
      level: 2,
      label: "生态",
      icon: Globe,
      desc: "按行业垂直划分的生态体系，如健康医药美业、宠物、知识付费、教育等。每个生态聚焦特定行业场景，下辖多个SaaS 系统和资源池，形成行业闭环。",
      role: "生态负责人 / 联合创始人",
      count: c.eco,
      metrics: [
        { label: "下属SaaS 系统", value: String(c.saas) },
        { label: "招募平台",    value: String(c.platforms) },
        { label: "生态会员",    value: c.users.toLocaleString() },
        { label: "月营收",      value: "¥84万" },
      ],
    },
    {
      id: "saas",
      level: 3,
      label: "SaaS",
      icon: Package,
      desc: "生态下的SaaS 系统，可招募多个平台。作为平台的上一层系统，统一管理平台权益、账号资产、会员体系与资源调配，向平台下发能力与权益。",
      role: "SaaS 系统负责人 / SaaS 运营",
      count: c.saas,
      metrics: [
        { label: "招募平台数", value: String(c.platforms) },
        { label: "服务项目数", value: String(c.projects) },
        { label: "权益会员",   value: c.users.toLocaleString() },
        { label: "活跃群组",   value: String(c.groups) },
      ],
    },
    {
      id: "platform",
      level: 4,
      label: "平台",
      icon: Building2,
      desc: "由SaaS 系统招募的运营实体，每个平台管理下辖多个运营项目。拥有独立的运营团队、资源池和运营数据视角，通过上层SaaS 系统统一管控。",
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
  name: string; creditCode?: string; legalPerson?: string; contactName?: string;
  contactPhone?: string; region?: string; bankName?: string; bankAccount?: string;
};
const ecosystems = [
  { id: 1, name: "健康医药美业生态", desc: "大健康、医药、医美、美业综合生态，整合营养、运动、医疗、皮肤、美容多赛道", platforms: 4, projects: 10, members: 3870, revenue: "¥51万/月", status: "主力生态", company: { name: "健康美业（杭州）科技有限公司", creditCode: "91330108MA2HJKL12B", legalPerson: "陈宇航", contactName: "林清瑶", contactPhone: "13800000002", region: "浙江省/杭州市", bankName: "招商银行杭州分行", bankAccount: "6225 8817 1234 5678" } as CompanyInfo },
  { id: 2, name: "宠物生态",        desc: "宠物食品、用品、医疗、洗护、寄养等宠物全产业链私域生态",                       platforms: 1, projects: 3,  members: 900,  revenue: "¥2万/月",  status: "成长中", company: { name: "宠趣（上海）宠物产业有限公司", creditCode: "91310115MA1K9PQ34X", legalPerson: "周明", contactName: "刘倩", contactPhone: "13900000011", region: "上海市/浦东新区", bankName: "中国工商银行上海分行", bankAccount: "6222 0210 9876 5432" } as CompanyInfo },
  { id: 3, name: "知识付费生态",    desc: "在线课程、训练营、会员社群、咨询陪跑等知识付费闭环",                           platforms: 1, projects: 3,  members: 1500, revenue: "¥16万/月", status: "成长中", company: { name: "知学（北京）教育科技有限公司", creditCode: "91110108MA01ABCD56", legalPerson: "孙婉清", contactName: "李梦华", contactPhone: "13800000009", region: "北京市/海淀区", bankName: "中国建设银行北京分行", bankAccount: "6217 0010 0011 2233" } as CompanyInfo },
  { id: 4, name: "教育生态",        desc: "在线教育、实体培训、教研、家校互通等教育场景生态",                             platforms: 2, projects: 8,  members: 2050, revenue: "¥15万/月", status: "孵化中", company: { name: "育才（成都）教育服务有限公司", creditCode: "91510104MA6XYZ7890", legalPerson: "郑雨桐", contactName: "赵文轩", contactPhone: "13800000003", region: "四川省/成都市", bankName: "中国农业银行成都分行", bankAccount: "6228 4807 0055 6677" } as CompanyInfo },
];

// ─── SaaS 系统列表 ───────────────────────────────────────
const saasPlatforms = [
  { id: 1, name: "私域工具",    eco: "健康医药美业生态", desc: "私域账号资产 + 微信社群 + 用户服务 + 订单工单一体化SaaS 系统，向招募的平台和项目下发私域能力", platformCount: 2, projects: 4, users: 2200, groups: 30, status: "生产中", isCurrent: true  },
  { id: 2, name: "课程平台",    eco: "知识付费生态",     desc: "在线课程、学员互动、结业认证与课程权益下发系统，招募知识付费类平台",                             platformCount: 1, projects: 3, users: 1500, groups: 18, status: "生产中", isCurrent: false },
  { id: 3, name: "代理系统",    eco: "健康医药美业生态", desc: "代理招募、培训、分销佣金与代理权益管理系统，招募代理分销类平台",                               platformCount: 1, projects: 3, users: 900,  groups: 14, status: "生产中", isCurrent: false },
  { id: 4, name: "学习平台",    eco: "教育生态",         desc: "学习路径、积分激励、学习报告与学习权益下发系统，招募教育学习类平台",                           platformCount: 1, projects: 4, users: 1400, groups: 20, status: "测试中", isCurrent: false },
  { id: 5, name: "直播工具",    eco: "教育生态",         desc: "在线直播、回放管理与观看SaaS 系统，招募教育直播类平台",                                         platformCount: 1, projects: 4, users: 650,  groups: 9,  status: "开发中", isCurrent: false },
  { id: 6, name: "城市合伙人",  eco: "健康医药美业生态", desc: "城市站长招募、资源分配与区域合伙人SaaS 系统，招募城市运营类平台",                               platformCount: 1, projects: 3, users: 770,  groups: 16, status: "测试中", isCurrent: false },
  { id: 7, name: "分销系统",    eco: "宠物生态",         desc: "多级分销、佣金计算与实时结算的渠道SaaS 系统，招募宠物产业分销类平台",                           platformCount: 1, projects: 3, users: 900,  groups: 12, status: "生产中", isCurrent: false },
];

// ─── 平台列表数据 ─────────────────────────────────────────────
const platforms = [
  { id: 1, name: "健康运营平台", saas: "私域工具", eco: "健康医药美业生态", desc: "由私域工具SaaS 系统招募，承载会员、体验官、代理商等核心项目", projects: 4, users: 1600, groups: 25, teachers: 8, revenue: "¥36万/月", status: "生产中" },
  { id: 2, name: "健康课程平台", saas: "课程平台", eco: "知识付费生态",   desc: "由课程平台SaaS 系统招募，承载训练营、进阶班、认证课程等项目", projects: 3, users: 1500, groups: 18, teachers: 6, revenue: "¥16万/月", status: "生产中" },
  { id: 3, name: "代理分销平台", saas: "代理系统", eco: "健康医药美业生态", desc: "由代理系统SaaS 系统招募，代理招募、分销、佣金结算一体化平台",     projects: 3, users: 900, groups: 14, teachers: 4, revenue: "¥11万/月", status: "生产中" },
  { id: 4, name: "教育学习平台", saas: "学习平台", eco: "教育生态",       desc: "由学习平台SaaS 系统招募，在线学习、知识路径、学习报告等",       projects: 4, users: 1400, groups: 20, teachers: 5, revenue: "¥10万/月", status: "测试中" },
  { id: 5, name: "教育直播平台", saas: "直播工具", eco: "教育生态",       desc: "由直播工具SaaS 系统招募，承载直播公开课、大师课、教研直播",       projects: 4, users: 650, groups: 9, teachers: 3, revenue: "¥5万/月", status: "开发中" },
  { id: 6, name: "商业城市平台", saas: "城市合伙人", eco: "健康医药美业生态", desc: "由城市合伙人SaaS 系统招募，面向B端城市站长的区域运营平台", projects: 3, users: 770, groups: 16, teachers: 4, revenue: "¥4万/月", status: "测试中" },
  { id: 7, name: "宠物分销平台", saas: "分销系统", eco: "宠物生态",       desc: "由分销系统SaaS 系统招募，多级分销、渠道分润、实时结算一体化平台",   projects: 3, users: 900, groups: 12, teachers: 4, revenue: "¥2万/月", status: "生产中" },
  { id: 8, name: "品牌会员平台", saas: "私域工具", eco: "健康医药美业生态", desc: "由私域工具SaaS 系统招募，统一品牌会员体系、权益中心与积分商城", projects: 0, users: 0, groups: 5, teachers: 0, revenue: "孵化中", status: "孵化中" },
];

// ─── 项目列表（归属平台） ─────────────────────────────────────
type ProjectTier = { name: string; rule: string; group: string; service: string };
type ProjectRecord = {
  id: number; name: string; platform: string; saas: string; eco: string; users: number; groups: number; teacher: string; cities: string[]; revenue: string; status: string;
  enterpriseWx: string; enterpriseProjectCount: number; tiers: ProjectTier[];
  groupTypes: GroupTypeRule[];
  mechanism: { welcome: string; cadence: string; route: string; escalation: string };
  visibility: Record<string, boolean>;
};
const defaultTiers: ProjectTier[] = [
  { name: "普通会员", rule: "入群即享", group: "新客体验群", service: "48小时响应" },
  { name: "核心会员", rule: "累计消费 ¥1,000", group: "核心会员群", service: "24小时响应" },
  { name: "城市合伙人", rule: "完成认证", group: "城市合伙人群", service: "专属运营" },
];
const projects: ProjectRecord[] = [
  { id: 1,  name: "PRO会员",      platform: "健康运营平台", saas: "私域工具",   eco: "健康医药美业生态", users: 1023, groups: 12, teacher: "吴思远/林小燕", cities: ["北京","上海","深圳"],       revenue: "¥28万/月",   status: "主力项目", enterpriseWx: "健康企业微信", enterpriseProjectCount: 3, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "欢迎语 + 入群任务",         cadence: "每周 2 次", route: "按城市 + 会员等级分群", escalation: "异常自动通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 2,  name: "体验官",       platform: "健康运营平台", saas: "私域工具",   eco: "健康医药美业生态", users: 387,  groups: 8,  teacher: "刘刚/李梦华",   cities: ["广州","成都","杭州"],       revenue: "¥12万/月",   status: "增长中",   enterpriseWx: "健康企业微信", enterpriseProjectCount: 3, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "欢迎语 + 新人打卡",         cadence: "每周 3 次", route: "按城市分群",             escalation: "低活跃会员提醒客服" },     visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 3,  name: "代理商",       platform: "健康运营平台", saas: "私域工具",   eco: "健康医药美业生态", users: 134,  groups: 6,  teacher: "赵志远",        cities: ["全国"],                    revenue: "¥7万/月",    status: "稳定运营", enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "代理商欢迎流程",            cadence: "每周 1 次", route: "按代理等级分群",         escalation: "审批事项通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true,  "客服": false, "生态负责人": true  } },
  { id: 4,  name: "城市分站",     platform: "健康运营平台", saas: "私域工具",   eco: "健康医药美业生态", users: 79,   groups: 8,  teacher: "陈明/王芳",     cities: ["武汉","南京","西安"],       revenue: "¥4.6万/月",  status: "孵化中",   enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "城市站长欢迎流程",          cadence: "每周 1 次", route: "按城市 + 等级分群",      escalation: "跨城问题通知区域运营" },   visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 5,  name: "7日训练营",    platform: "健康课程平台", saas: "课程平台",   eco: "知识付费生态",     users: 450,  groups: 5,  teacher: "课程组",        cities: ["线上"],                    revenue: "¥6万/月",    status: "季节性",   enterpriseWx: "课程企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "训练营开营提醒",            cadence: "每日 1 次", route: "按课程期次分群",         escalation: "课程问题通知课程组" },     visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 6,  name: "进阶班认证",   platform: "健康课程平台", saas: "课程平台",   eco: "知识付费生态",     users: 650,  groups: 8,  teacher: "课程组/张讲师", cities: ["线上","北京","上海"],      revenue: "¥6万/月",    status: "增长中",   enterpriseWx: "课程企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "认证班欢迎 + 学习地图",    cadence: "每周 2 次", route: "按班次分群",             escalation: "考核异常通知课程组" },     visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 7,  name: "付费会员俱乐部", platform: "健康课程平台", saas: "课程平台", eco: "知识付费生态",     users: 400,  groups: 5,  teacher: "会员服务组",    cities: ["全国"],                    revenue: "¥4万/月",    status: "稳定运营", enterpriseWx: "课程企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "俱乐部会员欢迎礼包",       cadence: "每周 2 次", route: "按会员等级分群",         escalation: "投诉升级客服主管" },       visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": true  } },
  { id: 8,  name: "健康学院",     platform: "教育学习平台", saas: "学习平台",   eco: "教育生态",         users: 820,  groups: 10, teacher: "教研团队",      cities: ["线上"],                    revenue: "¥15万/月",   status: "主力项目", enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "学习路径欢迎语",           cadence: "每周 2 次", route: "按课程 + 会员等级分群",  escalation: "学习异常通知教研团队" },   visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": true  } },
  { id: 9,  name: "亲子教育课",   platform: "教育学习平台", saas: "学习平台",   eco: "教育生态",         users: 250,  groups: 4,  teacher: "亲子教研团",    cities: ["线上","广州","深圳"],      revenue: "¥3万/月",    status: "增长中",   enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "亲子课程欢迎 + 礼包",      cadence: "每周 2 次", route: "按孩子年龄段分群",       escalation: "家长反馈通知教研" },       visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 10, name: "成人兴趣班",   platform: "教育学习平台", saas: "学习平台",   eco: "教育生态",         users: 200,  groups: 3,  teacher: "兴趣课讲师",    cities: ["北京","上海","成都"],       revenue: "¥1.5万/月",  status: "稳定运营", enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "兴趣班欢迎流程",           cadence: "每周 1 次", route: "按兴趣方向分群",         escalation: "调课申请通知班主任" },     visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 11, name: "教师研修班",   platform: "教育学习平台", saas: "学习平台",   eco: "教育生态",         users: 130,  groups: 3,  teacher: "教研专家组",    cities: ["线上","杭州"],              revenue: "¥0.5万/月",  status: "孵化中",   enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "研修班入学欢迎",           cadence: "每周 1 次", route: "按研修专题分群",         escalation: "师资问题通知专家组" },     visibility: { "项目负责人": true, "区域运营": false, "客服": false, "生态负责人": true  } },
  { id: 12, name: "公开大师课",   platform: "教育直播平台", saas: "直播工具",   eco: "教育生态",         users: 250,  groups: 3,  teacher: "特邀讲师团",    cities: ["线上"],                    revenue: "¥2万/月",    status: "主力项目", enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "大师课开播提醒 + 资料",    cadence: "每月 2 次", route: "按讲座期次分群",         escalation: "直播异常通知技术组" },     visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": true  } },
  { id: 13, name: "教研直播会",   platform: "教育直播平台", saas: "直播工具",   eco: "教育生态",         users: 150,  groups: 2,  teacher: "教研团队",      cities: ["线上"],                    revenue: "¥1.2万/月",  status: "稳定运营", enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "教研直播开播提醒",         cadence: "每周 1 次", route: "按教研主题分群",         escalation: "内容争议通知教研主管" },   visibility: { "项目负责人": true, "区域运营": false, "客服": false, "生态负责人": false } },
  { id: 14, name: "家长讲座",     platform: "教育直播平台", saas: "直播工具",   eco: "教育生态",         users: 150,  groups: 2,  teacher: "教育顾问团",    cities: ["线上","全国"],              revenue: "¥1万/月",    status: "季节性",   enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "家长讲座预约提醒",         cadence: "每月 1 次", route: "按孩子学龄分群",         escalation: "投诉升级客服主管" },       visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 15, name: "年度盛典",     platform: "教育直播平台", saas: "直播工具",   eco: "教育生态",         users: 100,  groups: 2,  teacher: "活动组委会",    cities: ["线上"],                    revenue: "¥0.8万/月",  status: "孵化中",   enterpriseWx: "教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "年度盛典倒计时 + 议程",    cadence: "每年 1 次", route: "按VIP等级分群",           escalation: "重大问题通知总负责人" },   visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": true  } },
  { id: 16, name: "一级代理",     platform: "代理分销平台", saas: "代理系统",   eco: "健康医药美业生态", users: 300,  groups: 5,  teacher: "赵志远/区域经理", cities: ["全国"],                  revenue: "¥5万/月",    status: "主力项目", enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "一级代理授权欢迎流程",     cadence: "每周 1 次", route: "按区域分群",             escalation: "审批事项通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true,  "客服": false, "生态负责人": true  } },
  { id: 17, name: "二级代理",     platform: "代理分销平台", saas: "代理系统",   eco: "健康医药美业生态", users: 350,  groups: 5,  teacher: "区域主管",      cities: ["广州","成都","武汉"],       revenue: "¥3.5万/月",  status: "增长中",   enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "二级代理入驻欢迎",         cadence: "每周 1 次", route: "按城市分群",             escalation: "佣金异常通知财务" },       visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 18, name: "分销站长",     platform: "代理分销平台", saas: "代理系统",   eco: "健康医药美业生态", users: 250,  groups: 4,  teacher: "站长运营组",    cities: ["杭州","南京","西安"],       revenue: "¥2.5万/月",  status: "稳定运营", enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "分销站长开通欢迎",         cadence: "每周 2 次", route: "按站点分群",             escalation: "订单异常通知运营" },       visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 19, name: "城市运营中心", platform: "商业城市平台", saas: "城市合伙人", eco: "健康医药美业生态", users: 300,  groups: 6,  teacher: "陈明/王芳",     cities: ["武汉","南京","西安"],       revenue: "¥2万/月",    status: "主力项目", enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "城市中心入驻欢迎",         cadence: "每周 1 次", route: "按城市分群",             escalation: "跨城协作通知区域主管" },   visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 20, name: "区域服务站",   platform: "商业城市平台", saas: "城市合伙人", eco: "健康医药美业生态", users: 270,  groups: 5,  teacher: "区域站长",      cities: ["成都","重庆","郑州"],       revenue: "¥1.2万/月",  status: "增长中",   enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "区域服务站开通欢迎",       cadence: "每周 1 次", route: "按服务区域分群",         escalation: "服务投诉升级区域主管" },   visibility: { "项目负责人": true, "区域运营": true,  "客服": true,  "生态负责人": false } },
  { id: 21, name: "资源对接会",   platform: "商业城市平台", saas: "城市合伙人", eco: "健康医药美业生态", users: 200,  groups: 5,  teacher: "商务对接组",    cities: ["全国"],                    revenue: "¥0.8万/月",  status: "孵化中",   enterpriseWx: "商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "对接会报名确认提醒",       cadence: "每月 2 次", route: "按行业主题分群",         escalation: "对接纠纷通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true,  "客服": false, "生态负责人": true  } },
  { id: 22, name: "宠物用品商城", platform: "宠物分销平台", saas: "分销系统",   eco: "宠物生态",         users: 350,  groups: 4,  teacher: "商城运营组",    cities: ["全国"],                    revenue: "¥0.8万/月",  status: "增长中",   enterpriseWx: "宠物企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "商城会员欢迎 + 优惠券",    cadence: "每周 2 次", route: "按消费等级分群",         escalation: "售后问题升级主管" },       visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
  { id: 23, name: "宠物医疗会员", platform: "宠物分销平台", saas: "分销系统",   eco: "宠物生态",         users: 300,  groups: 4,  teacher: "宠物医师团",    cities: ["北京","上海","广州"],       revenue: "¥0.7万/月",  status: "稳定运营", enterpriseWx: "宠物企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "医疗会员激活欢迎",         cadence: "每月 1 次", route: "按城市 + 宠物品类分群",  escalation: "医疗投诉升级医师主管" },   visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": true  } },
  { id: 24, name: "洗护美容会员", platform: "宠物分销平台", saas: "分销系统",   eco: "宠物生态",         users: 250,  groups: 4,  teacher: "美容服务组",    cities: ["深圳","成都","杭州"],       revenue: "¥0.5万/月",  status: "孵化中",   enterpriseWx: "宠物企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "美容会员开通欢迎",         cadence: "每周 1 次", route: "按城市 + 会员等级分群",  escalation: "预约异常通知门店" },       visibility: { "项目负责人": true, "区域运营": false, "客服": true,  "生态负责人": false } },
];

const statusCfg: Record<string, { bg: string; color: string }> = {
  "主力项目": { bg: S.accent,            color: "#000" },
  "主力生态": { bg: S.accent,            color: "#000" },
  "增长中":   { bg: S.accent,            color: "#000" },
  "成长中":   { bg: S.accentLight,       color: "#0d0d0d" },
  "稳定运营": { bg: "#f0f0ec",           color: "#555" },
  "孵化中":   { bg: "#f0f0ec",           color: "#555" },
  "季节性":   { bg: "#f0f0ec",           color: "#555" },
  "生产中":   { bg: S.accent,            color: "#000" },
  "测试中":   { bg: "#ffd600",           color: "#000" },
  "开发中":   { bg: "#f0f0ec",           color: "#555" },
};

// ─── 架构流程图 ───────────────────────────────────────────────
function ArchitectureDiagram({ tiers, activeTier, onSelect }: { tiers: ReturnType<typeof buildTiers>; activeTier: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-stretch gap-0 overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {tiers.map((t, idx) => {
        const Icon = t.icon;
        const isActive = activeTier === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className="flex-1 flex flex-col items-start gap-3 p-5 transition-all relative"
            style={{
              background: isActive ? S.accentLight : S.surface,
              borderRight: idx < 3 ? `1px solid ${S.border}` : "none",
              borderRadius: 0,
              borderBottom: isActive ? `3px solid ${S.accent}` : "3px solid transparent",
            }}
            onClick={() => onSelect(t.id)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: isActive ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: isActive ? S.accent : S.textSec, borderRadius: S.radiusSm }}>
                {t.level}
              </div>
              {idx < 3 && <ArrowRight size={14} className="ml-auto" style={{ color: S.muted }} />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={18} style={{ color: isActive ? "#0d0d0d" : S.muted }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>{t.label}</span>
              </div>
              <p className="text-xs leading-relaxed font-mono" style={{ color: S.muted }}>{t.desc.slice(0, 48)}...</p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: isActive ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: isActive ? S.accent : S.textSec, borderRadius: S.radiusSm }}>
                {t.count} 个
              </span>
              <span className="text-xs font-mono" style={{ color: S.muted }}>当前</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── 超级生态视图 ─────────────────────────────────────────────
type EcoItem = {
  id: number; name: string; desc: string; platforms: number; projects: number;
  members: number; revenue: string; status: string; company?: CompanyInfo;
};
type SaasItem = typeof saasPlatforms[number];
type PlatformItem = typeof platforms[number];
type ProjectItem = ProjectRecord;
function SuperView({
  ecoList, setEcoList, saasList, setSaasList,
  accounts, setAccounts, subs, setSubs, bills, setBills,
}: {
  ecoList: EcoItem[]; setEcoList: React.Dispatch<React.SetStateAction<EcoItem[]>>;
  saasList: SaasItem[]; setSaasList: React.Dispatch<React.SetStateAction<SaasItem[]>>;
  accounts: SystemAccount[]; setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>;
  subs: Subscription[]; setSubs: React.Dispatch<React.SetStateAction<Subscription[]>>;
  bills: BillRecord[]; setBills: React.Dispatch<React.SetStateAction<BillRecord[]>>;
}) {
  const maskAccount = (acc?: string) => {
    if (!acc) return "—";
    const digits = acc.replace(/\s+/g, "");
    return digits.length >= 4 ? `尾号 ${digits.slice(-4)}` : acc;
  };
  const total = { ecosystems: ecoList.length, saas: saasList.length, platforms: 0, projects: 0, users: 0, revenue: "¥84万", groups: 0 };
  const [selected, setSelected] = useState<number | null>(null);
  const [createEcoOpen, setCreateEcoOpen] = useState(false);
  const [createSaasEcoId, setCreateSaasEcoId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const currentEco = ecoList.find(e => e.id === createSaasEcoId);
  const { setApprovals } = useApprovals();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-3">
        {[
          { label: "下属生态", value: total.ecosystems },
          { label: "SaaS 系统", value: total.saas },
          { label: "招募平台", value: total.platforms },
          { label: "运营项目", value: total.projects },
          { label: "全局用户", value: total.users.toLocaleString() },
          { label: "全局群组", value: total.groups },
          { label: "总月营收", value: total.revenue },
        ].map(s => (
          <div key={s.label} className="px-3 py-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-xs font-mono" style={{ color: S.muted }}>{s.label}</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: S.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: "#0d0d0d" }} />
          <span className="text-sm font-bold" style={{ color: S.text }}>超级生态</span>
          <span className="px-2 py-0.5 text-xs font-bold ml-2" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>最高层级</span>
        </div>
        <p className="text-xs leading-relaxed mb-4 font-mono" style={{ color: S.textSec }}>
          超级生态是整个体系的最顶层。统一管理旗下所有生态、SaaS 系统、平台和具体项目。拥有全局数据视角、最高级权限、多租户管控和生态资源调配能力。
          每个下属生态按行业划分，下辖多个SaaS 系统，SaaS 系统招募平台并下发能力与权益。
        </p>
        <div className="flex gap-2 flex-wrap">
          {["全局数据看板", "跨生态权限管理", "多租户隔离", "统一账号资产", "生态营收汇总"].map(t => (
            <span key={t} className="px-2.5 py-1 text-xs font-bold font-mono" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.3)` }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div><span className="text-sm font-bold" style={{ color: S.text }}>旗下生态 ({ecoList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>超级生态下辖的行业垂直生态，每个生态下辖多个 SaaS 系统与资源池</div></div>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateEcoOpen(true)}>
            <Plus size={12} /> 新建生态
          </button>
        </div>
        {ecoList.map(e => (
          <div
            key={e.id}
            role="button"
            tabIndex={0}
            className="p-4 cursor-pointer transition-all"
            style={{
              background: selected === e.id ? S.accentLight : S.surface,
              border: `1px solid ${S.border}`,
              borderLeft: selected === e.id ? `3px solid ${S.accent}` : `3px solid transparent`,
              borderRadius: S.radius,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onClick={() => setSelected(selected === e.id ? null : e.id)}
            onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSelected(selected === e.id ? null : e.id); } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }}>
                {e.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: S.text }}>{e.name}</span>
                  <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusCfg[e.status]?.bg, color: statusCfg[e.status]?.color, borderRadius: S.radiusSm }}>{e.status}</span>
                </div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>{e.desc}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center flex-shrink-0">
                {[["下属SaaS 系统", e.platforms], ["招募平台", e.projects], ["生态会员", e.members.toLocaleString()], ["月营收", e.revenue]].map(([l, v]) => (
                  <div key={l as string} className="px-3 py-1.5" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                    <div className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</div>
                    <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                  </div>
                ))}
              </div>
              <ChevronRight size={16} style={{ color: S.muted, transform: selected === e.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </div>

            {selected === e.id && (
              <div className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${S.border}` }}>
                <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="flex items-center gap-2 text-xs font-bold mb-2"><Building2 size={13} />公司主体信息</div>
                  {e.company ? (
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[11px] font-mono">
                      <div><span style={{ color: S.muted }}>公司名称：</span><span style={{ color: S.text }}>{e.company.name}</span></div>
                      <div><span style={{ color: S.muted }}>信用代码：</span><span style={{ color: S.textSec }}>{e.company.creditCode || "—"}</span></div>
                      <div><span style={{ color: S.muted }}>法人：</span><span style={{ color: S.textSec }}>{e.company.legalPerson || "—"}</span></div>
                      <div><span style={{ color: S.muted }}>对接人：</span><span style={{ color: S.textSec }}>{e.company.contactName || "—"}{e.company.contactPhone ? ` · ${e.company.contactPhone}` : ""}</span></div>
                      <div><span style={{ color: S.muted }}>所在地：</span><span style={{ color: S.textSec }}>{e.company.region || "—"}</span></div>
                      <div><span style={{ color: S.muted }}>开户行：</span><span style={{ color: S.textSec }}>{e.company.bankName ? `${e.company.bankName}（${maskAccount(e.company.bankAccount)}）` : "—"}</span></div>
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono" style={{ color: S.muted }}>未录入公司主体</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateSaasEcoId(e.id)}><Plus size={12} /> 新建 SaaS 系统</button>
                  {["查看平台", "项目列表", "数据报表"].map(a => (
                    <button key={a} type="button" className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>{a}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {createEcoOpen && <CreateEcosystemDrawer onClose={() => setCreateEcoOpen(false)} onCreate={({ name, desc, tag, company, admin }) => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const endAt = `${now.getFullYear() + 1}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const dueAt = `${dueDate.getFullYear()}-${pad(dueDate.getMonth() + 1)}-${pad(dueDate.getDate())}`;
        const createdAt = `${today} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const newEcoId = Date.now();
        setEcoList(list => [...list, { id: newEcoId, name, desc: tag ? `${desc}（行业：${tag}）` : desc, platforms: 0, projects: 0, members: 0, revenue: "¥0/月", status: "孵化中", company }]);
        setAccounts(list => [...list, {
          uid: `U${newEcoId}`,
          name: admin.name, email: admin.email, phone: admin.phone, status: "active", createdAt,
          identities: [{ roleKey: "eco_leader", scopeType: "eco", scopeIds: [`eco-${newEcoId}`], label: "生态负责人", permissionSummary: `${name}生态负责人` }],
          assignedToolIds: [],
        }]);
        setSubs(list => [...list, { id: `SUB-${newEcoId}`, subscriberType: "eco", subscriberName: name, planKey: "eco-starter", priceCny: 29800, cycle: "yearly", startAt: today, endAt, status: "pending", gmvShareRate: 0.05 }]);
        setBills(list => [...list, { id: `INV-${newEcoId}`, payerType: "eco", payerName: name, amountCny: 29800, items: ["生态·孵化版 年费"], status: "pending", dueAt }]);
        setCreateEcoOpen(false);
        setToast("生态已创建，已生成生态负责人账号 + 入驻账单");
      }} />}
      {createSaasEcoId !== null && <CreateSaasDrawer ecoList={ecoList} defaultEco={currentEco?.name} onClose={() => setCreateSaasEcoId(null)} onCreate={data => {
        setSaasList(list => [...list, { id: Date.now(), ...data, platformCount: 0, projects: 0, users: 0, groups: 0, status: "孵化中", isCurrent: false }]);
        const approval = createApproval("saas_onboard", {
          title: `SaaS 入驻：${data.name}（${data.eco}）`,
          submitter: "超级管理员",
          description: `在${data.eco}下新建 SaaS 系统「${data.name}」，${data.desc || "无描述"}`,
          detail: { SaaS名称: data.name, 所属生态: data.eco, 描述: data.desc || "—" },
          payload: { type: "saas_onboard", name: data.name, eco: data.eco, desc: data.desc },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreateSaasEcoId(null);
        setToast("已创建并推送审批单");
      }} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── 生态视图 ─────────────────────────────────────────────────
function EcoView({
  ecoList, saasList, setSaasList, platformList, setPlatformList,
}: {
  ecoList: EcoItem[];
  saasList: SaasItem[]; setSaasList: React.Dispatch<React.SetStateAction<SaasItem[]>>;
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
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
        <div><span className="text-sm font-bold" style={{ color: S.text }}>SaaS 系统 ({saasList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>生态下辖的 SaaS 系统，为招募的平台下发能力</div></div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
            {ecoOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateSaasOpen(true)}>
            <Plus size={12} /> 新建 SaaS 系统
          </button>
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
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5" style={{ background: "#0d0d0d", borderRadius: S.radiusSm }}>
                <CheckCircle size={10} style={{ color: S.accent }} />
                <span style={{ color: S.accent, fontSize: "10px", fontFamily: "monospace" }}>当前系统</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
                {p.name[0]}
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: S.text }}>{p.name}</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold" style={{ background: "#f0f0f0", color: "#555", borderRadius: S.radiusSm }}>{p.eco}</span>
              </div>
            </div>
            <div className="text-xs mb-3 font-mono" style={{ color: S.muted }}>{p.desc}</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[["服务平台", p.platformCount], ["服务项目", p.projects], ["系统用户", p.users.toLocaleString()], ["活跃群组", p.groups]].map(([l, v]) => (
                <div key={l as string} className="px-2 py-1.5 text-center" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="flex items-center gap-1 px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => setCreatePlatformSaasId(p.id)}><Plus size={10} /> 开平台</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {createSaasOpen && <CreateSaasDrawer ecoList={ecoList} onClose={() => setCreateSaasOpen(false)} onCreate={({ name, eco, desc }) => {
        setSaasList(list => [...list, { id: Date.now(), name, eco, desc, platformCount: 0, projects: 0, users: 0, groups: 0, status: "孵化中", isCurrent: false }]);
        const approval = createApproval("saas_onboard", {
          title: `SaaS 入驻：${name}（${eco}）`,
          submitter: "生态运营",
          description: `在${eco}下新建 SaaS 系统「${name}」，${desc || "无描述"}`,
          detail: { SaaS名称: name, 所属生态: eco, 描述: desc || "—" },
          payload: { type: "saas_onboard", name, eco, desc },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreateSaasOpen(false);
      }} />}
      {createPlatformSaasId !== null && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} defaultSaas={currentSaas?.name} defaultEco={currentSaas?.eco} onClose={() => setCreatePlatformSaasId(null)} onCreate={data => {
        setPlatformList(list => [...list, { id: Date.now(), ...data, projects: 0, users: 0, groups: 0, teachers: 0, revenue: "孵化中", status: "孵化中" }]);
        const approval = createApproval("platform_onboard", {
          title: `平台入驻：${data.name}（${data.saas}）`,
          submitter: "生态运营",
          description: `在${data.saas} SaaS 下新建平台「${data.name}」，所属${data.eco}生态`,
          detail: { 平台名称: data.name, 所属SaaS: data.saas, 所属生态: data.eco, 描述: data.desc || "—" },
          payload: { type: "platform_onboard", name: data.name, saas: data.saas, eco: data.eco, desc: data.desc },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreatePlatformSaasId(null);
        setToast("已创建并推送审批单");
      }} />}
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── SaaS 系统视图 ───────────────────────────────────────
function SaasView({
  ecoList, saasList, platformList, setPlatformList, setActiveTier, setActivePlatformId, setActivePlatformName,
}: {
  ecoList: EcoItem[];
  saasList: SaasItem[];
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  setActiveTier?: (t: string) => void;
  setActivePlatformId: (id: number) => void;
  setActivePlatformName: (name: string) => void;
}) {
  const [filterEco, setFilterEco] = useState<string>("全部生态");
  const [filterSaas, setFilterSaas] = useState<string>("全部 SaaS");
  const [createPlatformOpen, setCreatePlatformOpen] = useState(false);
  const { setApprovals } = useApprovals();
  const ecoOptions = ["全部生态", ...Array.from(new Set(platformList.map(p => p.eco)))];
  const saasOptions = ["全部 SaaS", ...Array.from(new Set(platformList.map(p => p.saas)))];
  const filtered = platformList.filter(p => (filterEco === "全部生态" || p.eco === filterEco) && (filterSaas === "全部 SaaS" || p.saas === filterSaas));
  const totalProjects = filtered.reduce((n, p) => n + p.projects, 0);
  const totalUsers = filtered.reduce((n, p) => n + p.users, 0);
  const totalGroups = filtered.reduce((n, p) => n + p.groups, 0);
  const totalTeachers = filtered.reduce((n, p) => n + p.teachers, 0);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><span className="text-sm font-bold" style={{ color: S.text }}>旗下平台 ({platformList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>由 SaaS 系统招募的平台实体，每个平台下辖多个运营项目</div></div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
            {ecoOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterSaas} onChange={e => setFilterSaas(e.target.value)}>
            {saasOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreatePlatformOpen(true)}><Plus size={12} /> 新建平台</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[["下辖项目", totalProjects, LayoutDashboard], ["平台用户", totalUsers.toLocaleString(), Eye], ["运营群组", totalGroups, MessageSquare], ["服务老师", totalTeachers, UsersRound]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as string | number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}
      </div>
      <div className="space-y-2">
        {filtered.map((pf, idx) => (
          <div
            key={pf.id}
            className="p-4 flex items-center gap-4 transition-all"
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: S.radius,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 300 }}>
              <div className="w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }}>
                {pf.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: S.text }}>{pf.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: statusCfg[pf.status]?.bg, color: statusCfg[pf.status]?.color, borderRadius: S.radiusSm }}>{pf.status}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#f0f0f0", color: "#555", borderRadius: S.radiusSm }}>{pf.saas}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#f0f0f0", color: "#555", borderRadius: S.radiusSm }}>{pf.eco}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-3">
              {[["下辖项目", pf.projects], ["平台用户", pf.users.toLocaleString()], ["运营群组", pf.groups], ["服务老师", `${pf.teachers} 人`], ["月营收", pf.revenue]].map(([l, v]) => (
                <div key={l as string} className="px-3 py-2 text-center" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="flex-shrink-0">
              <button type="button" className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => { setActivePlatformId(pf.id); setActivePlatformName(pf.name); setActiveTier && setActiveTier("platform"); }}>进入平台</button>
            </div>
          </div>
        ))}
      </div>
      {createPlatformOpen && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} onClose={() => setCreatePlatformOpen(false)} onCreate={({ name, saas, eco, desc }) => {
        setPlatformList(list => [...list, { id: Date.now(), name, saas, eco, desc: desc || "", projects: 0, users: 0, groups: 0, teachers: 0, revenue: "孵化中", status: "孵化中" }]);
        const approval = createApproval("platform_onboard", {
          title: `平台入驻：${name}（${saas}）`,
          submitter: "SaaS 负责人",
          description: `在${saas} SaaS 下新建平台「${name}」，所属${eco}生态`,
          detail: { 平台名称: name, 所属SaaS: saas, 所属生态: eco, 描述: desc || "—" },
          payload: { type: "platform_onboard", name, saas, eco, desc: desc || "" },
        });
        setApprovals(prev => [approval, ...prev]);
        setCreatePlatformOpen(false);
      }} />}
    </div>
  );
}

// ─── 项目/平台视图 ────────────────────────────────────────────
const fieldStyle = { background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, padding: "8px 10px", fontSize: 12, width: "100%" };
const roleNames = ["超级管理员", "生态负责人", "生态COO", "SaaS负责人", "SaaS运营", "平台管理员", "平台运营", "项目负责人", "区域运营", "客服", "老师"];
const projectVisibilityRoles = ["生态负责人", "SaaS负责人", "平台管理员", "项目负责人", "区域运营", "客服", "老师"];

const groupRuleRoleOptions = ["游客", "体验官", "VIP0", "VIP1", "VIP2", "VIP3", "VIP4", "SVIP0", "SVIP1", "SVIP2", "SVIP3", "SVIP4", "SVIP5", "普通会员", "核心会员", "城市合伙人"];
const groupRuleCityOptions = ["北京", "吉林", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "全国"];
type ProjectTab = "overview" | "tiers" | "groupRules" | "mechanism" | "visibility";

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
  return <div className="space-y-2"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目群类型规则</div><p className="text-xs mt-1 leading-relaxed" style={{ color: S.muted }}>群类型启用后才能建群。地区与会员身份均可多选；群类型代码、地区代码和序号由系统生成并保持只读。</p></div>{project.groupTypes.map((rule, idx) => <div key={rule.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="px-2 py-1 text-xs font-bold" style={{ background: rule.enabled ? "#0d0d0d" : "#f0f0f0", color: rule.enabled ? S.accent : S.muted, borderRadius: S.radiusSm }}>{rule.code}</span><input value={rule.name} style={{ ...fieldStyle, width: 132, padding: "5px 7px" }} onChange={e => updateRule(idx, { name: e.target.value })} /></div><label className="flex items-center gap-1 text-xs font-bold" style={{ color: rule.enabled ? "#276749" : S.muted }}><input type="checkbox" checked={rule.enabled} onChange={e => updateRule(idx, { enabled: e.target.checked })} />启用</label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs" style={{ color: S.muted }}>默认群容量<input type="number" min="1" value={rule.capacity} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { capacity: Number(e.target.value) })} /></label><label className="text-xs" style={{ color: S.muted }}>分配方式<select value={rule.allocationMode} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { allocationMode: e.target.value as GroupTypeRule["allocationMode"] })}><option>轮巡分配</option><option>统一分配</option></select></label></div><div><div className="text-xs font-bold mb-1.5">匹配会员身份 <span className="font-normal" style={{ color: S.muted }}>可多选</span></div><div className="flex flex-wrap gap-1.5">{groupRuleRoleOptions.map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.memberRoles.includes(role) ? "#0d0d0d" : "#f7f7f7", color: rule.memberRoles.includes(role) ? S.accent : S.muted, border: `1px solid ${rule.memberRoles.includes(role) ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.memberRoles.includes(role)} onChange={() => toggleListValue(idx, "memberRoles", role)} />{role}</label>)}<input className="px-2 py-1 text-[10px] outline-none" style={{ ...fieldStyle, width: 116, padding: "5px 7px" }} placeholder="新增身份，回车" value={roleDraft[String(idx)] || ""} onChange={e => setRoleDraft(current => ({ ...current, [idx]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRole(idx); } }} /></div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前：{rule.memberRoles.length ? rule.memberRoles.join("、") : "未选择身份"}</div></div><div><div className="text-xs font-bold mb-1.5">管理地区 <span className="font-normal" style={{ color: S.muted }}>可多选，取消勾选即不参与建群</span></div><div className="flex flex-wrap gap-1.5">{groupRuleCityOptions.map(city => <label key={city} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.cities.includes(city) ? "#0d0d0d" : "#f7f7f7", color: rule.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${rule.cities.includes(city) ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.cities.includes(city)} onChange={() => toggleListValue(idx, "cities", city)} />{city}</label>)}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>已选地区：{rule.cities.length ? rule.cities.join("、") : "未选择地区，无法建群"}</div></div><div className="text-[10px] font-mono" style={{ color: S.muted }}>群名模板：<span style={{ color: S.text }}>{rule.nameTemplate}</span> · 编号只读：{rule.code} + 地区代码 + 序号</div></div>)}<button type="button" className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => updateDraft(current => ({ ...current, groupTypes: [...current.groupTypes, { id: `custom-${Date.now()}`, name: "新群类型", code: `FL${String(current.groupTypes.length + 1).padStart(2, "0")}`, memberRoles: [], capacity: 500, cities: ["北京"], allocationMode: "轮巡分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: false }] }))}><Plus size={13} className="inline mr-1" />新增群类型规则</button></div>;
}

function ProjectDrawer({ project, onClose, onSave }: { project: ProjectRecord; onClose: () => void; onSave: (p: ProjectRecord) => void }) {
  const [draft, setDraft] = useState<ProjectRecord>(project);
  const [tab, setTab] = useState<ProjectTab>("overview");
  const updateDraft = (updater: (current: ProjectRecord) => ProjectRecord) => setDraft(updater);
  const updateMechanism = (key: keyof ProjectRecord["mechanism"], value: string) => setDraft(d => ({ ...d, mechanism: { ...d.mechanism, [key]: value } }));
  const updateTier = (idx: number, key: keyof ProjectTier, value: string) => setDraft(d => ({ ...d, tiers: d.tiers.map((t, i) => i === idx ? { ...t, [key]: value } : t) }));
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[520px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between px-5 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div><div className="text-base font-bold">项目配置 · {draft.name}</div><div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>项目数据、会员等级与社群规则独立隔离</div></div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="flex gap-1 p-4 pb-2">
          {([["overview", "概览", LayoutDashboard], ["tiers", "会员等级", UsersRound], ["groupRules", "群类型规则", SlidersHorizontal], ["mechanism", "社群机制", Workflow], ["visibility", "可见范围", Eye]] as [ProjectTab, string, any][]).map(([id, label, Icon]) => <button key={id} type="button" className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold" style={{ background: tab === id ? "#0d0d0d" : S.surface, color: tab === id ? S.accent : S.muted, border: `1px solid ${tab === id ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }} onClick={() => setTab(id)}><Icon size={13} />{label}</button>)}
        </div>
        <div className="p-4 space-y-3">
          {tab === "overview" && <>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>所属平台</div><div className="text-sm font-bold mt-1">{draft.platform}</div><div className="text-xs mt-1" style={{ color: S.muted }}>SaaS 使用方</div></div>
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>所属 SaaS / 生态</div><div className="text-sm font-bold mt-1">{draft.saas}</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.eco}</div></div>
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>当前运营数据</div><div className="text-sm font-bold mt-1">{draft.users.toLocaleString()} 用户 · {draft.groups} 群</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.revenue}</div></div>
            </div>
            <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Building2 size={16} />企业微信归属</div><div className="text-sm font-bold mt-2">{draft.enterpriseWx}</div><div className="text-xs mt-1" style={{ color: S.muted }}>同一企业已承载 {draft.enterpriseProjectCount} 个项目 · 项目数据按项目隔离</div><button type="button" className="mt-3 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setTab("visibility")}>管理项目范围</button></div>
            <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={16} />运营基线</div><span className="text-xs font-mono" style={{ color: S.muted }}>{draft.tiers.length} 个会员等级</span></div><div className="flex flex-wrap gap-2 mt-3">{draft.tiers.map(t => <span key={t.name} className="px-2 py-1 text-xs font-bold" style={{ background: S.accentLight, borderRadius: S.radiusSm }}>{t.name}</span>)}</div><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><div style={{ color: S.muted }}>入群流程 <b style={{ color: S.text }}>{draft.mechanism.welcome}</b></div><div style={{ color: S.muted }}>运营频次 <b style={{ color: S.text }}>{draft.mechanism.cadence}</b></div></div></div>
          </>}
          {tab === "tiers" && <div className="space-y-2">{draft.tiers.map((tier, idx) => <div key={idx} className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold px-2 py-1" style={{ background: idx === 0 ? "#f0f0f0" : S.accent, borderRadius: S.radiusSm }}>等级 {idx + 1}</span><button type="button" className="text-xs" style={{ color: "#888" }} onClick={() => setDraft(d => ({ ...d, tiers: d.tiers.filter((_, i) => i !== idx) }))}>移除</button></div><div className="grid grid-cols-2 gap-2"><input value={tier.name} style={fieldStyle} onChange={e => updateTier(idx, "name", e.target.value)} placeholder="等级名称" /><input value={tier.rule} style={fieldStyle} onChange={e => updateTier(idx, "rule", e.target.value)} placeholder="升级条件" /><input value={tier.group} style={fieldStyle} onChange={e => updateTier(idx, "group", e.target.value)} placeholder="对应社群" /><input value={tier.service} style={fieldStyle} onChange={e => updateTier(idx, "service", e.target.value)} placeholder="服务 SLA" /></div></div>)}<button type="button" className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setDraft(d => ({ ...d, tiers: [...d.tiers, { name: "新会员等级", rule: "待配置", group: "待配置社群", service: "待配置" }] }))}><Plus size={13} className="inline mr-1" />新增会员等级</button></div>}
          {tab === "groupRules" && <GroupRulesEditor project={draft} updateDraft={updateDraft} />}
          {tab === "mechanism" && <div className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={16} />社群运营机制</div><p className="text-xs" style={{ color: S.muted }}>规则绑定当前项目，会员等级变化后自动路由到对应社群。</p>{([ ["welcome", "入群与欢迎流程"], ["cadence", "内容运营频次"], ["route", "分群路由规则"], ["escalation", "异常升级路径"]] as [keyof ProjectRecord["mechanism"], string][]).map(([key, label]) => <label key={key} className="block text-xs font-bold">{label}<input className="mt-1" value={draft.mechanism[key]} style={fieldStyle} onChange={e => updateMechanism(key, e.target.value)} /></label>)}</div>}
          {tab === "visibility" && <div className="space-y-3"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} />身份可见范围</div><p className="text-xs mt-1" style={{ color: S.muted }}>控制谁可以进入该项目并查看项目、企业微信和社群运营数据。勾选后对应角色可在其工作台看到本项目。</p></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2" style={{ color: S.textSec }}>项目相关身份（7 档）</div>{projectVisibilityRoles.map(role => <label key={role} className="flex items-center justify-between py-2 text-xs font-bold" style={{ borderBottom: `1px solid ${S.border}` }}><span className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontSize: 10 }}>{role[0]}</span>{role}</span><input type="checkbox" checked={!!draft.visibility[role]} onChange={e => setDraft(d => ({ ...d, visibility: { ...d.visibility, [role]: e.target.checked } }))} /></label>)}</div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">其他角色（全局/生态/SaaS/平台运营层）</div><div className="flex flex-wrap gap-1.5">{roleNames.filter(r => !projectVisibilityRoles.includes(r)).map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: !!draft.visibility[role] ? "#0d0d0d" : "#f7f7f7", color: !!draft.visibility[role] ? S.accent : S.muted, border: `1px solid ${!!draft.visibility[role] ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={!!draft.visibility[role]} onChange={e => setDraft(d => ({ ...d, visibility: { ...d.visibility, [role]: e.target.checked } }))} />{role}</label>)}</div></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">企业微信下的项目</div><div className="flex items-center gap-2 flex-wrap">{["PRO会员", "体验官", "代理商"].map(name => <span key={name} className={name === draft.name ? "px-2 py-1 text-xs font-bold" : "px-2 py-1 text-xs"} style={{ background: name === draft.name ? "#0d0d0d" : "#f5f5f5", color: name === draft.name ? S.accent : S.muted, borderRadius: S.radiusSm }}>{name}</span>)}</div></div></div>}
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => { onSave(draft); onClose(); }}><Save size={13} />保存项目配置</button></div>
      </aside>
    </div>
  );
}

function CreateProjectDrawer({ ecoList, saasList, platformList, defaultPlatform, onClose, onCreate }: {
  ecoList: EcoItem[]; saasList: SaasItem[]; platformList: PlatformItem[];
  defaultPlatform?: string; onClose: () => void; onCreate: (p: ProjectRecord) => void;
}) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState(defaultPlatform || (platformList[0]?.name ?? "健康运营平台"));
  const [enterpriseWx, setEnterpriseWx] = useState("健康企业微信");
  const firstPlatform = platformList.find(p => p.name === platform);
  const [eco, setEco] = useState(firstPlatform?.eco || (ecoList[0]?.name ?? "健康医药美业生态"));
  const [saas, setSaas] = useState(firstPlatform?.saas || (saasList[0]?.name ?? "私域工具"));
  const [creatorRole, setCreatorRole] = useState("项目负责人");
  const canCreate = name.trim().length > 1 && platform.trim().length > 0;
  const platformNameOptions = platformList.map(p => p.name);
  const ecoOptions = ecoList.map(e => e.name);
  const saasOptions = saasList.filter(s => eco ? s.eco === eco : true).map(s => s.name);
  const filteredPlatformOptions = platformList.filter(p => (!saas || p.saas === saas) && (!eco || p.eco === eco)).map(p => p.name);
  const onPlatformChange = (next: string) => {
    setPlatform(next);
    const linked = platformList.find(p => p.name === next);
    if (linked) { setSaas(linked.saas); setEco(linked.eco); }
  };
  return <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}><aside className="h-full w-full max-w-[460px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}><div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}><div><div className="text-base font-bold">接入新项目</div><div className="text-xs mt-1" style={{ color: S.muted }}>创建后继续配置会员等级和社群机制</div></div><button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button></div><div className="p-5 space-y-4"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目归属关系</div><p className="text-xs mt-1" style={{ color: S.muted }}>生态 → SaaS 系统 → 平台 → 项目：项目归属到具体平台下，平台由 SaaS 系统招募；一个企业微信可以承载多个项目，项目数据、会员等级和社群规则独立隔离。</p></div><label className="block text-xs font-bold">项目名称<input className="mt-1" value={name} placeholder="例如：PRO会员" style={fieldStyle} onChange={e => setName(e.target.value)} /></label><label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label><label className="block text-xs font-bold">SaaS 系统<select className="mt-1" value={saas} style={fieldStyle} onChange={e => setSaas(e.target.value)}>{saasOptions.map(n => <option key={n}>{n}</option>)}</select></label><label className="block text-xs font-bold">所属平台<select className="mt-1" value={platform} style={fieldStyle} onChange={e => onPlatformChange(e.target.value)}>{(filteredPlatformOptions.length ? filteredPlatformOptions : platformNameOptions).map(n => <option key={n}>{n}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>项目必须归属到某个平台下，平台由SaaS 系统招募</span></label><label className="block text-xs font-bold">企业微信归属<input className="mt-1" value={enterpriseWx} placeholder="选择企业微信" style={fieldStyle} onChange={e => setEnterpriseWx(e.target.value)} /></label><label className="block text-xs font-bold">创建身份<select className="mt-1" value={creatorRole} style={fieldStyle} onChange={e => setCreatorRole(e.target.value)}>{roleNames.map(role => <option key={role}>{role}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>创建身份决定默认项目范围，后续可在“可见范围”中继续收敛。</span></label><div className="grid grid-cols-2 gap-2"><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认会员等级</div><div className="text-sm font-bold mt-1">3 个</div></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认可见身份</div><div className="text-sm font-bold mt-1">负责人 / 运营 / 客服</div></div></div></div><div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#0d0d0d" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ id: Date.now(), name, platform, saas, eco, users: 0, groups: 0, teacher: "待分配", cities: ["待配置"], revenue: "待核算", status: "孵化中", enterpriseWx, enterpriseProjectCount: 1, tiers: defaultTiers.map(t => ({ ...t })), groupTypes: [], mechanism: { welcome: "欢迎语 + 入群任务", cadence: "每周 1 次", route: "按城市 + 会员等级分群", escalation: "异常通知项目负责人" }, visibility: { "超级管理员": true, "生态负责人": creatorRole === "生态负责人" || true, "生态COO": false, "SaaS负责人": creatorRole === "SaaS负责人", "SaaS运营": false, "平台管理员": creatorRole === "平台管理员", "平台运营": false, "项目负责人": creatorRole === "项目负责人" || true, "区域运营": creatorRole === "区域运营" || true, "客服": creatorRole === "客服" || true, "老师": false } })}>创建项目</button></div></aside></div>;
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
    <div className="fixed top-5 left-1/2 z-[60] px-4 py-2.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transform: "translateX(-50%)" }}>{message}</div>
  );
}

function CreateEcosystemDrawer({ onClose, onCreate }: { onClose: () => void; onCreate: (data: { name: string; desc: string; tag: string; company: CompanyInfo; admin: { name: string; phone: string; email: string; password: string } }) => void }) {
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
  const canCreate = name.trim().length > 0 && companyName.trim().length > 0 && adminName.trim().length > 0 && adminPhone.trim().length > 0;
  const submit = () => {
    if (!canCreate) return;
    onCreate({
      name: name.trim(), desc: desc.trim(), tag: tag.trim(),
      company: { name: companyName.trim(), creditCode: creditCode.trim() || undefined, legalPerson: legalPerson.trim() || undefined, contactName: contactName.trim() || undefined, contactPhone: contactPhone.trim() || undefined, region: region.trim() || undefined, bankName: bankName.trim() || undefined, bankAccount: bankAccount.trim() || undefined },
      admin: { name: adminName.trim(), phone: adminPhone.trim(), email: adminEmail.trim(), password: adminPassword.trim() },
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[560px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div>
            <div className="text-base font-bold">新建生态</div>
            <div className="text-xs mt-1" style={{ color: S.muted }}>在超级生态下开生态，按行业垂直划分 · 同步录入公司主体与生态负责人主账号</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />生态归属关系</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>新建生态归属到超级生态下，下辖多个 SaaS 系统与平台，形成行业闭环。</p>
          </div>
          <label className="block text-xs font-bold">生态名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康医药美业生态" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">生态描述<input className="mt-1" value={desc} placeholder="例如：大健康、医药、医美、美业综合生态" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
          <label className="block text-xs font-bold">行业标签<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={tag} placeholder="例如：大健康 / 医美 / 宠物 / 教育" style={fieldStyle} onChange={e => setTag(e.target.value)} /></label>

          <div className="p-4 space-y-3" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />公司主体信息</div>
            <p className="text-xs -mt-1" style={{ color: S.muted }}>录入生态归属的公司主体，用于签约、分润结算与发票开具。</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold">公司名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={companyName} placeholder="例如：健康美业（杭州）科技有限公司" style={fieldStyle} onChange={e => setCompanyName(e.target.value)} /></label>
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

          <div className="p-4 space-y-3" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />生态负责人主账号</div>
            <p className="text-xs -mt-1" style={{ color: S.muted }}>提交后将自动生成生态负责人系统账号，绑定到当前生态范围。</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold">负责人姓名<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={adminName} placeholder="例如：林清瑶" style={fieldStyle} onChange={e => setAdminName(e.target.value)} /></label>
              <label className="block text-xs font-bold">登录手机号<span style={{ color: "#c00" }}> *</span><span className="font-normal" style={{ color: S.muted }}>（将作为登录账号）</span><input className="mt-1" value={adminPhone} placeholder="11 位手机号，作为 UID" style={fieldStyle} onChange={e => setAdminPhone(e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">登录邮箱<span className="font-normal" style={{ color: S.muted }}>（可选）</span><input className="mt-1" value={adminEmail} placeholder="name@company.com" style={fieldStyle} onChange={e => setAdminEmail(e.target.value)} /></label>
              <label className="block text-xs font-bold col-span-2">初始密码<span className="font-normal" style={{ color: S.muted }}>（账号创建后可自行修改）</span><input className="mt-1" value={adminPassword} style={fieldStyle} onChange={e => setAdminPassword(e.target.value)} /></label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#0d0d0d" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={submit}>创建生态并生成账号</button>
        </div>
      </aside>
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
            <div className="text-base font-bold">新建 SaaS 系统</div>
            <div className="text-xs mt-1" style={{ color: S.muted }}>在生态下开 SaaS，招募平台并下发能力与权益</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />SaaS 归属关系</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>生态 → SaaS 系统 → 平台 → 项目：SaaS 系统归属到某个生态，可招募多个平台并下发能力与权益。</p>
          </div>
          <label className="block text-xs font-bold">SaaS 系统名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：私域工具" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">描述<input className="mt-1" value={desc} placeholder="例如：私域账号资产+微信社群一体化 SaaS 系统" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#0d0d0d" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ name: name.trim(), eco, desc: desc.trim() })}>创建 SaaS 系统</button>
        </div>
      </aside>
    </div>
  );
}

function CreatePlatformDrawer({ saasList, ecoList, defaultSaas, defaultEco, onClose, onCreate }: { saasList: SaasItem[]; ecoList: EcoItem[]; defaultSaas?: string; defaultEco?: string; onClose: () => void; onCreate: (data: { name: string; saas: string; eco: string; desc: string }) => void }) {
  const initialSaas = defaultSaas || saasList[0]?.name || saasPlatforms[0].name;
  const [name, setName] = useState("");
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
            <div className="text-xs mt-1" style={{ color: S.muted }}>由 SaaS 系统招募的运营实体，下辖多个项目</div>
          </div>
          <button type="button" className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}>
            <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />平台归属关系</div>
            <p className="text-xs mt-1" style={{ color: S.muted }}>SaaS 系统 → 平台 → 项目：平台由 SaaS 系统招募，下辖多个运营项目，拥有独立运营团队与资源池。</p>
          </div>
          <label className="block text-xs font-bold">平台名称<span style={{ color: "#c00" }}> *</span><input className="mt-1" value={name} placeholder="例如：健康运营平台" style={fieldStyle} onChange={e => setName(e.target.value)} /></label>
          <label className="block text-xs font-bold">所属 SaaS 系统<select className="mt-1" value={saas} style={fieldStyle} onChange={e => onSaasChange(e.target.value)}>{saasOptions.map(n => <option key={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">所属生态<select className="mt-1" value={eco} style={fieldStyle} onChange={e => setEco(e.target.value)}>{ecoOptions.map(n => <option key={n}>{n}</option>)}</select></label>
          <label className="block text-xs font-bold">描述<input className="mt-1" value={desc} placeholder="例如：由 SaaS 系统招募的运营平台" style={fieldStyle} onChange={e => setDesc(e.target.value)} /></label>
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}>
          <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button>
          <button type="button" className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#0d0d0d" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ name: name.trim(), saas, eco, desc: desc.trim() })}>创建平台</button>
        </div>
      </aside>
    </div>
  );
}

// ─── 平台下的项目列表 ─────────────────────────────────────────
function ProjectList({
  projectList, setProjectList, ecoList, saasList, platformList, platformName, platformId, onBack,
}: {
  projectList: ProjectItem[]; setProjectList: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  ecoList: EcoItem[]; saasList: SaasItem[]; platformList: PlatformItem[];
  platformName: string; platformId: number;
  onBack: () => void;
}) {
  const platform = platformList.find(pf => pf.id === platformId) || platformList.find(pf => pf.name === platformName);
  const filteredProjects = projectList.filter(p => p.platform === platformName);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [configProject, setConfigProject] = useState<ProjectRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { rulesByProject } = useCommunityData();
  useEffect(() => { filteredProjects.forEach(project => registerProjectRules(project.name, project.groupTypes)); }, [platformName, filteredProjects.length]);
  const saveProject = (next: ProjectRecord) => { setProjectList(list => list.map(p => p.id === next.id ? next : p)); saveProjectRules(next.name, next.groupTypes); };
  return <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button type="button" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={onBack}>← 返回平台列表</button>
        <div>
          <div className="text-sm font-bold" style={{ color: S.text }}>{platformName} · 项目工作台 <span style={{ color: S.muted, fontWeight: "normal" }}>({filteredProjects.length})</span></div>
          <div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>所属 SaaS：{platform?.saas} · 所属生态：{platform?.eco}</div>
        </div>
      </div>
      <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateOpen(true)}><Plus size={12} /> 接入新项目</button>
    </div>
    <div className="grid grid-cols-4 gap-2">{[["可见项目", filteredProjects.length, Eye], ["企业微信", new Set(filteredProjects.map(p => p.enterpriseWx)).size, Building2], ["会员等级", filteredProjects.reduce((n, p) => n + p.tiers.length, 0), UsersRound], ["运营群组", filteredProjects.reduce((n, p) => n + p.groups, 0), MessageSquare]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}</div>
    <div className="p-3 flex items-start gap-2" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.3)`, borderRadius: S.radius }}><Building2 size={16} /><div className="text-xs leading-relaxed"><b>平台与项目关系</b>：平台由上层SaaS 系统招募，下辖多个运营项目；项目是权限和运营数据隔离的最小单元。进入项目后，成员、会员等级、社群和报表只展示当前身份有权访问的范围。</div></div>
    <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="min-w-[1260px]">
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
          {([["项目名称",190],["企业微信归属",170],["用户/群组",100],["服务老师",120],["覆盖城市",150],["状态",90],["操作",100]] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
        </div>
        {filteredProjects.length === 0 ? (
          <div className="px-4 py-10 text-center text-xs" style={{ color: S.muted }}>该平台下暂无项目，点击右上角「接入新项目」开始创建。</div>
        ) : filteredProjects.map((p, idx) => (
          <div key={p.id} role="button" tabIndex={0} className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono" style={{ background: selectedId === p.id ? S.accentLight : idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}`, borderLeft: selectedId === p.id ? `3px solid ${S.accent}` : "3px solid transparent" }} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSelectedId(selectedId === p.id ? null : p.id); } }}>
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 190 }}><div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>{p.name[3] ?? p.name[0]}</div><span className="font-bold">{p.name}</span></div>
            <div className="flex-shrink-0" style={{ width: 170 }}><div className="font-bold">{p.enterpriseWx}</div><div className="text-[10px]" style={{ color: S.muted }}>同企业 {p.enterpriseProjectCount} 个项目</div></div>
            <div className="flex-shrink-0" style={{ width: 100 }}><b>{p.users.toLocaleString()}</b><span style={{ color: S.muted }}> / {p.groups} 群</span></div><div className="flex-shrink-0" style={{ width: 120, color: S.muted }}>{p.teacher}</div>
            <div className="flex-shrink-0" style={{ width: 150 }}><div className="flex flex-wrap gap-1">{p.cities.map(c => <span key={c} className="px-1.5 py-0.5 font-bold" style={{ background: "#0d0d0d", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm }}>{c}</span>)}</div></div>
            <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span></div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 100 }} onClick={e => e.stopPropagation()}><button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => { setSelectedId(p.id); setConfigProject({ ...p, groupTypes: rulesByProject[p.name] ?? p.groupTypes }); }}>进入</button><button type="button" className="px-1.5 py-1" title="配置项目" style={{ background: "#f7f7f7", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={() => { setConfigProject({ ...p, groupTypes: rulesByProject[p.name] ?? p.groupTypes }); }}><Settings size={11} /></button></div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}><LayoutDashboard size={18} style={{ color: "#0d0d0d", marginTop: 1, flexShrink: 0 }} /><div><div className="text-sm font-bold mb-1">项目是权限和运营隔离的最小单元</div><p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>平台管理员可在本平台下创建项目；项目负责人可配置自己负责的项目；区域运营、客服按可见范围进入项目。企业微信负责账号承载，项目负责会员等级、社群规则和运营数据。</p></div></div>
    {configProject && <ProjectDrawer project={configProject} onClose={() => setConfigProject(null)} onSave={saveProject} />}
    {createOpen && <CreateProjectDrawer ecoList={ecoList} saasList={saasList} platformList={platformList} defaultPlatform={platformName} onClose={() => setCreateOpen(false)} onCreate={p => { registerProjectRules(p.name, p.groupTypes); setProjectList(list => [p, ...list]); setCreateOpen(false); setConfigProject(p); }} />}
  </div>;
}

// ─── 第 4 层：平台视图（平台列表 → 进入平台 → 项目列表） ─────
function PlatformView({
  platformList, setPlatformList, ecoList, saasList, projectList, setProjectList, onEnterPlatform,
}: {
  platformList: PlatformItem[]; setPlatformList: React.Dispatch<React.SetStateAction<PlatformItem[]>>;
  ecoList: EcoItem[]; saasList: SaasItem[];
  projectList: ProjectItem[]; setProjectList: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  onEnterPlatform: (id: number, name: string) => void;
}) {
  const [filterEco, setFilterEco] = useState<string>("全部生态");
  const [createPlatformOpen, setCreatePlatformOpen] = useState(false);
  const { setApprovals } = useApprovals();

  const filtered = filterEco === "全部生态" ? platformList : platformList.filter(p => p.eco === filterEco);
  const ecoOptions = ["全部生态", ...Array.from(new Set(platformList.map(p => p.eco)))];
  const totalProjects = platformList.reduce((n, p) => n + p.projects, 0);
  const totalUsers = platformList.reduce((n, p) => n + p.users, 0);
  const totalGroups = platformList.reduce((n, p) => n + p.groups, 0);
  const totalTeachers = platformList.reduce((n, p) => n + p.teachers, 0);

  return <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div><span className="text-sm font-bold" style={{ color: S.text }}>平台工作台 ({platformList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>由SaaS 系统招募的运营实体，每个平台下辖多个运营项目</div></div>
      <div className="flex gap-2">
        <select className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={filterEco} onChange={e => setFilterEco(e.target.value)}>
          {ecoOptions.map(o => <option key={o}>{o}</option>)}
        </select>
        <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreatePlatformOpen(true)}><Plus size={12} /> 新建平台</button>
      </div>
    </div>
    <div className="grid grid-cols-5 gap-2">
      {[["可见平台", platformList.length, Building2], ["下辖项目", totalProjects, LayoutDashboard], ["服务老师", totalTeachers, UsersRound], ["平台用户", totalUsers.toLocaleString(), Eye], ["运营群组", totalGroups, MessageSquare]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as string | number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}
    </div>
    <div className="p-3 flex items-start gap-2" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.3)`, borderRadius: S.radius }}><Layers size={16} /><div className="text-xs leading-relaxed"><b>平台与SaaS 系统关系</b>：SaaS 系统招募平台并下发能力与权益；一个SaaS 系统可招募多个平台，一个平台下辖多个项目。平台聚合多个项目的运营团队、资源池和汇总视角。</div></div>
    <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="min-w-[1180px]">
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
          {([["平台名称",220],["SaaS 系统",150],["所属生态",130],["下辖项目/用户/群组",200],["服务老师",100],["月营收",110],["状态",90],["操作",140]] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
        </div>
        {filtered.map((pf, idx) => (
          <div key={pf.id} role="button" tabIndex={0} className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono" style={{ background: idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }} onClick={() => onEnterPlatform(pf.id, pf.name)} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onEnterPlatform(pf.id, pf.name); } }}>
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 220 }}><div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>{pf.name[3] ?? pf.name[0]}</div><span className="font-bold">{pf.name}</span></div>
            <div className="flex-shrink-0" style={{ width: 150, color: S.muted }}>{pf.saas}</div>
            <div className="flex-shrink-0" style={{ width: 130, color: S.muted }}>{pf.eco}</div>
            <div className="flex-shrink-0" style={{ width: 200 }}><span className="font-bold">{pf.projects}</span><span style={{ color: S.muted }}> 项目 / </span><span className="font-bold">{pf.users.toLocaleString()}</span><span style={{ color: S.muted }}> 用户 / </span><span className="font-bold">{pf.groups}</span><span style={{ color: S.muted }}> 群</span></div>
            <div className="flex-shrink-0" style={{ width: 100, color: S.text }}>{pf.teachers} 人</div>
            <div className="flex-shrink-0 font-bold" style={{ width: 110, color: S.text }}>{pf.revenue}</div>
            <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[pf.status]?.bg, color: statusCfg[pf.status]?.color, borderRadius: S.radiusSm }}>{pf.status}</span></div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 140 }} onClick={e => e.stopPropagation()}>
              <button type="button" className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => onEnterPlatform(pf.id, pf.name)}>进入平台</button>
              <button type="button" className="px-1.5 py-1" title="平台配置" style={{ background: "#f7f7f7", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}><Settings size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}><Building2 size={18} style={{ color: "#0d0d0d", marginTop: 1, flexShrink: 0 }} /><div><div className="text-sm font-bold mb-1">平台由SaaS 系统招募，下辖多个项目</div><p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>每个平台由平台管理员负责，在同一个SaaS 系统下拥有独立的运营团队和独立的项目隔离。项目是权限与运营数据隔离的最小单元，可单独配置会员等级、社群规则和可见范围。</p></div></div>
    {createPlatformOpen && <CreatePlatformDrawer saasList={saasList} ecoList={ecoList} onClose={() => setCreatePlatformOpen(false)} onCreate={({ name, saas, eco, desc }) => {
      setPlatformList(list => [...list, { id: Date.now(), name, saas, eco, desc, projects: 0, users: 0, groups: 0, teachers: 0, revenue: "孵化中", status: "孵化中" }]);
      const approval = createApproval("platform_onboard", {
        title: `平台入驻：${name}（${saas}）`,
        submitter: "平台管理员",
        description: `在${saas} SaaS 下新建平台「${name}」，所属${eco}生态`,
        detail: { 平台名称: name, 所属SaaS: saas, 所属生态: eco, 描述: desc || "—" },
        payload: { type: "platform_onboard", name, saas, eco, desc: desc || "" },
      });
      setApprovals(prev => [approval, ...prev]);
      setCreatePlatformOpen(false);
    }} />}
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
  { id: "SUB-005", subscriberType: "saas", subscriberName: "私域工具", planKey: "saas-flagship", priceCny: 168000, cycle: "yearly", startAt: "2026-02-20", endAt: "2027-02-19", status: "active", gmvShareRate: 0.10 },
  { id: "SUB-006", subscriberType: "saas", subscriberName: "课程平台", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2026-01-10", endAt: "2027-01-09", status: "active", gmvShareRate: 0.07 },
  { id: "SUB-007", subscriberType: "saas", subscriberName: "代理系统", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2026-03-15", endAt: "2027-03-14", status: "active", gmvShareRate: 0.07 },
  { id: "SUB-008", subscriberType: "saas", subscriberName: "学习平台", planKey: "saas-basic", priceCny: 19800, cycle: "yearly", startAt: "2025-11-20", endAt: "2026-11-19", status: "expiring", gmvShareRate: 0.05 },
  { id: "SUB-009", subscriberType: "saas", subscriberName: "直播工具", planKey: "saas-basic", priceCny: 19800, cycle: "yearly", startAt: "2026-05-01", endAt: "2027-04-30", status: "pending" },
  { id: "SUB-010", subscriberType: "saas", subscriberName: "城市合伙人", planKey: "saas-standard", priceCny: 59800, cycle: "yearly", startAt: "2025-09-01", endAt: "2026-08-31", status: "expired", gmvShareRate: 0.07 },
  { id: "SUB-011", subscriberType: "platform", subscriberName: "健康运营平台", planKey: "platform-brand", priceCny: 19800, cycle: "yearly", startAt: "2026-01-20", endAt: "2027-01-19", status: "active", gmvShareRate: 0.05 },
  { id: "SUB-012", subscriberType: "platform", subscriberName: "健康课程平台", planKey: "platform-brand", priceCny: 19800, cycle: "yearly", startAt: "2026-02-10", endAt: "2027-02-09", status: "active", gmvShareRate: 0.05 },
  { id: "SUB-013", subscriberType: "platform", subscriberName: "代理分销平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2026-03-25", endAt: "2027-03-24", status: "active" },
  { id: "SUB-014", subscriberType: "platform", subscriberName: "教育学习平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2025-12-15", endAt: "2026-12-14", status: "expiring" },
  { id: "SUB-015", subscriberType: "platform", subscriberName: "教育直播平台", planKey: "platform-operator", priceCny: 5980, cycle: "yearly", startAt: "2026-04-01", endAt: "2027-03-31", status: "active" },
  { id: "SUB-016", subscriberType: "project", subscriberName: "PRO会员", planKey: "project-flagship", priceCny: 9999, cycle: "yearly", startAt: "2026-01-05", endAt: "2027-01-04", status: "active" },
  { id: "SUB-017", subscriberType: "project", subscriberName: "体验官", planKey: "project-standard", priceCny: 3999, cycle: "yearly", startAt: "2026-02-15", endAt: "2027-02-14", status: "active" },
  { id: "SUB-018", subscriberType: "project", subscriberName: "7日训练营", planKey: "project-basic", priceCny: 999, cycle: "once", startAt: "2026-06-01", endAt: "2099-12-31", status: "active" },
  { id: "SUB-019", subscriberType: "addon", subscriberName: "私域工具·数据中台", planKey: "addon-data", priceCny: 49800, cycle: "yearly", startAt: "2026-03-01", endAt: "2027-02-28", status: "active" },
  { id: "SUB-020", subscriberType: "addon", subscriberName: "健康医药美业·分润结算", planKey: "addon-settlement", priceCny: 39800, cycle: "yearly", startAt: "2026-04-15", endAt: "2027-04-14", status: "active" },
];

// ─── 商业与计费：Mock 账单记录 ─────────────────────────────────
const billRecords: BillRecord[] = [
  { id: "INV-2026-0801", payerType: "eco", payerName: "健康医药美业生态", amountCny: 298000, items: ["生态·旗舰版 年费"], status: "paid", dueAt: "2026-01-15" },
  { id: "INV-2026-0802", payerType: "eco", payerName: "知识付费生态", amountCny: 98000, items: ["生态·成长版 年费"], status: "paid", dueAt: "2026-03-01" },
  { id: "INV-2026-0803", payerType: "saas", payerName: "私域工具", amountCny: 168000, items: ["SaaS·旗舰版 年费"], status: "paid", dueAt: "2026-02-20" },
  { id: "INV-2026-0804", payerType: "saas", payerName: "课程平台", amountCny: 59800, items: ["SaaS·标准版 年费"], status: "paid", dueAt: "2026-01-10" },
  { id: "INV-2026-0805", payerType: "eco", payerName: "教育生态", amountCny: 98000, items: ["生态·成长版 续费"], status: "pending", dueAt: "2026-11-30" },
  { id: "INV-2026-0806", payerType: "saas", payerName: "学习平台", amountCny: 19800, items: ["SaaS·基础版 续费"], status: "pending", dueAt: "2026-11-19" },
  { id: "INV-2026-0807", payerType: "platform", payerName: "教育学习平台", amountCny: 5980, items: ["平台·运营版 续费"], status: "pending", dueAt: "2026-12-14" },
  { id: "INV-2026-0808", payerType: "saas", payerName: "城市合伙人", amountCny: 59800, items: ["SaaS·标准版 欠费"], status: "overdue", dueAt: "2026-08-31" },
  { id: "INV-2026-0809", payerType: "saas", payerName: "直播工具", amountCny: 19800, items: ["SaaS·基础版 首年"], status: "pending", dueAt: "2026-05-01" },
  { id: "INV-2026-0810", payerType: "platform", payerName: "健康运营平台", amountCny: 19800, items: ["平台·品牌版 年费"], status: "paid", dueAt: "2026-01-20" },
  { id: "INV-2026-0811", payerType: "project", payerName: "PRO会员", amountCny: 9999, items: ["项目·旗舰版 年费"], status: "paid", dueAt: "2026-01-05" },
  { id: "INV-2026-0812", payerType: "addon", payerName: "私域工具·数据中台", amountCny: 49800, items: ["增值·数据中台 年费"], status: "paid", dueAt: "2026-03-01" },
  { id: "INV-2026-0813", payerType: "addon", payerName: "健康医药美业·分润结算", amountCny: 39800, items: ["增值·分润结算 年费"], status: "paid", dueAt: "2026-04-15" },
  { id: "INV-2026-0814", payerType: "eco", payerName: "宠物生态", amountCny: 29800, items: ["生态·孵化版 年费"], status: "paid", dueAt: "2026-04-10" },
  { id: "INV-2026-0815", payerType: "project", payerName: "7日训练营", amountCny: 999, items: ["项目·基础版 一次性"], status: "paid", dueAt: "2026-06-01" },
];

// ─── 商业与计费：Mock 分润流水 ─────────────────────────────────
const gmvShares: GmvShare[] = [
  { id: "SH-001", fromTier: "project", fromName: "PRO会员", toTier: "platform", toName: "健康运营平台", amountCny: 28000, gmv: 280000, rate: 0.10, period: "2026-08" },
  { id: "SH-002", fromTier: "platform", fromName: "健康运营平台", toTier: "saas", toName: "私域工具", amountCny: 42000, gmv: 420000, rate: 0.10, period: "2026-08" },
  { id: "SH-003", fromTier: "saas", fromName: "私域工具", toTier: "eco", toName: "健康医药美业生态", amountCny: 50400, gmv: 504000, rate: 0.10, period: "2026-08" },
  { id: "SH-004", fromTier: "eco", fromName: "健康医药美业生态", toTier: "super", toName: "超级生态", amountCny: 60480, gmv: 504000, rate: 0.12, period: "2026-08" },
  { id: "SH-005", fromTier: "project", fromName: "体验官", toTier: "platform", toName: "健康运营平台", amountCny: 12000, gmv: 120000, rate: 0.10, period: "2026-08" },
  { id: "SH-006", fromTier: "project", fromName: "7日训练营", toTier: "platform", toName: "健康课程平台", amountCny: 6000, gmv: 60000, rate: 0.10, period: "2026-08" },
  { id: "SH-007", fromTier: "platform", fromName: "健康课程平台", toTier: "saas", toName: "课程平台", amountCny: 11200, gmv: 160000, rate: 0.07, period: "2026-08" },
  { id: "SH-008", fromTier: "saas", fromName: "课程平台", toTier: "eco", toName: "知识付费生态", amountCny: 12800, gmv: 160000, rate: 0.08, period: "2026-08" },
  { id: "SH-009", fromTier: "project", fromName: "健康学院", toTier: "platform", toName: "教育学习平台", amountCny: 15000, gmv: 150000, rate: 0.10, period: "2026-07" },
  { id: "SH-010", fromTier: "platform", fromName: "教育学习平台", toTier: "saas", toName: "学习平台", amountCny: 8000, gmv: 160000, rate: 0.05, period: "2026-07" },
  { id: "SH-011", fromTier: "saas", fromName: "学习平台", toTier: "eco", toName: "教育生态", amountCny: 12800, gmv: 160000, rate: 0.08, period: "2026-07" },
  { id: "SH-012", fromTier: "project", fromName: "代理商", toTier: "platform", toName: "代理分销平台", amountCny: 7000, gmv: 70000, rate: 0.10, period: "2026-08" },
  { id: "SH-013", fromTier: "platform", fromName: "代理分销平台", toTier: "saas", toName: "代理系统", amountCny: 7700, gmv: 110000, rate: 0.07, period: "2026-08" },
  { id: "SH-014", fromTier: "saas", fromName: "代理系统", toTier: "eco", toName: "健康医药美业生态", amountCny: 13200, gmv: 110000, rate: 0.12, period: "2026-08" },
  { id: "SH-015", fromTier: "project", fromName: "宠物用品商城", toTier: "platform", toName: "宠物分销平台", amountCny: 800, gmv: 8000, rate: 0.10, period: "2026-08" },
  { id: "SH-016", fromTier: "platform", fromName: "宠物分销平台", toTier: "saas", toName: "分销系统", amountCny: 1200, gmv: 24000, rate: 0.05, period: "2026-08" },
  { id: "SH-017", fromTier: "eco", fromName: "知识付费生态", toTier: "super", toName: "超级生态", amountCny: 19200, gmv: 240000, rate: 0.08, period: "2026-07" },
  { id: "SH-018", fromTier: "eco", fromName: "教育生态", toTier: "super", toName: "超级生态", amountCny: 19200, gmv: 240000, rate: 0.08, period: "2026-08" },
];

// ─── 商业与计费：组件辅助 ─────────────────────────────────────
const tierLabels: Record<PricingTier, string> = {
  super: "超级态", eco: "生态", saas: "SaaS", platform: "平台", project: "项目", addon: "增值包",
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
      background: plan.highlight ? "#0d0d0d" : S.surface,
      border: plan.highlight ? `2px solid ${S.accent}` : `1px solid ${S.border}`,
      borderRadius: S.radius, boxShadow: plan.highlight ? "0 6px 24px rgba(204,255,0,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {plan.highlight && (
        <div className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accent, color: "#0d0d0d", borderRadius: S.radiusSm }}>
          推荐方案
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{
          background: plan.highlight ? S.accent : "#0d0d0d",
          color: plan.highlight ? "#0d0d0d" : S.accent, borderRadius: S.radiusSm,
        }}><Icon size={14} /></div>
        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5" style={{
          background: plan.highlight ? "rgba(255,255,255,0.1)" : S.accentLight,
          color: plan.highlight ? S.accent : "#0d0d0d", borderRadius: S.radiusSm,
        }}>{tierLabels[plan.tier]}</span>
      </div>
      <div className="text-sm font-bold mb-0.5" style={{ color: plan.highlight ? "#fff" : S.text }}>{plan.name}</div>
      <div className="mb-3">
        <span className="text-xl font-bold" style={{ color: plan.highlight ? S.accent : S.text }}>
          {plan.priceCnyYear === 0 ? "免费" : fmtCny(plan.priceCnyYear)}
        </span>
        {plan.priceCnyYear > 0 && <span className="text-xs font-mono ml-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : S.muted }}>/年</span>}
      </div>
      <div className="space-y-1 mb-3 p-2" style={{ background: plan.highlight ? "rgba(255,255,255,0.05)" : "#f7f7f7", borderRadius: S.radiusSm }}>
        {Object.entries(plan.quota).length === 0 ? (
          <div className="text-[10px] font-mono" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : S.muted }}>按服务包计</div>
        ) : Object.entries(plan.quota).map(([k, v]) => {
          const label: Record<string, string> = { platforms: "平台", projects: "项目", users: "用户", groups: "群组", teachers: "老师", apiCalls: "API 调用" };
          return (
            <div key={k} className="flex justify-between text-[10px] font-mono">
              <span style={{ color: plan.highlight ? "rgba(255,255,255,0.55)" : S.muted }}>{label[k]}</span>
              <span className="font-bold" style={{ color: plan.highlight ? "#fff" : S.text }}>
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
        background: done ? "#16a34a" : (plan.highlight ? S.accent : "#0d0d0d"),
        color: done ? "#fff" : (plan.highlight ? "#0d0d0d" : S.accent), borderRadius: S.radiusSm,
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
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
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
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
            {([["订阅单号",120],["订阅方",180],["层级",80],["方案",170],["金额",100],["周期",80],["有效期",210],["状态",100],["分润比例",90]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {filtered.map((s, idx) => {
            const plan = findPlan(s.planKey);
            return (
              <div key={s.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
                <div className="flex-shrink-0 font-bold" style={{width:120, color: S.textSec}}>{s.id}</div>
                <div className="flex-shrink-0 flex items-center gap-2" style={{width:180}}>
                  <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
                    {s.subscriberName[0]}
                  </div>
                  <span className="font-bold" style={{color:S.text}}>{s.subscriberName}</span>
                </div>
                <div className="flex-shrink-0" style={{width:80}}>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#0d0d0d", borderRadius: S.radiusSm}}>{tierLabels[s.subscriberType]}</span>
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
        <TrendingUp size={16} style={{ color: "#0d0d0d" }} />
        <span className="text-sm font-bold" style={{ color: S.text }}>分润流向 · 五级链路</span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: S.muted }}>2026-08 月度汇总</span>
      </div>
      <div className="flex items-stretch gap-0">
        {tiers.map((t, idx) => (
          <div key={t.id} className="flex-1 flex items-center gap-2">
            <div className="flex-1 p-3" style={{
              background: t.id === "super" ? "#0d0d0d" : S.accentLight,
              border: `1px solid ${t.id === "super" ? S.accent : "rgba(204,255,0,0.3)"}`,
              borderRadius: S.radius,
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 flex items-center justify-center" style={{
                  background: t.id === "super" ? S.accent : "#0d0d0d",
                  color: t.id === "super" ? "#0d0d0d" : S.accent, borderRadius: "4px",
                }}><t.Icon size={11} /></div>
                <span className="text-[11px] font-bold" style={{ color: t.id === "super" ? S.accent : S.text }}>{t.label}</span>
              </div>
              <div className="text-base font-bold" style={{ color: t.id === "super" ? "#fff" : S.text }}>{t.amount}</div>
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
            background: c.accent ? "#0d0d0d" : S.surface,
            border: c.accent ? `2px solid ${S.accent}` : `1px solid ${S.border}`,
            borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center" style={{
                background: c.accent ? S.accent : "#0d0d0d",
                color: c.accent ? "#0d0d0d" : S.accent, borderRadius: S.radiusSm,
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
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
            {([["流水号",90],["账期",80],["出账方",170],["出账层级",90],["→",20],["分润方",170],["分润层级",90],["分润比例",90],["GMV",100],["分润金额",110]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {gmvShares.map((g, idx) => (
            <div key={g.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-shrink-0" style={{width:90, color:S.textSec}}>{g.id}</div>
              <div className="flex-shrink-0" style={{width:80}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#0d0d0d", borderRadius: S.radiusSm}}>{g.period}</span>
              </div>
              <div className="flex-shrink-0" style={{width:170, color:S.text}}>{g.fromName}</div>
              <div className="flex-shrink-0" style={{width:90}}>
                <span className="px-1.5 py-0.5 text-[10px]" style={{background:"#f0f0f0", color:S.textSec, borderRadius: S.radiusSm}}>{tierLabels[g.fromTier]}</span>
              </div>
              <div className="flex-shrink-0 flex justify-center" style={{width:20, color:S.muted}}><ArrowRight size={12} /></div>
              <div className="flex-shrink-0" style={{width:170, color:S.text, fontWeight:"bold"}}>{g.toName}</div>
              <div className="flex-shrink-0" style={{width:90}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background:"#0d0d0d", color:S.accent, borderRadius: S.radiusSm}}>{tierLabels[g.toTier]}</span>
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
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
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
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#eab308", color: "#0d0d0d", borderRadius: S.radiusSm }}>
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
            <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#ef4444", color: "#fff", borderRadius: S.radiusSm }}>
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
          <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
            {([["账单号",140],["付款方",180],["层级",80],["账单项目",220],["金额",110],["到期日",110],["状态",100]] as [string,number][]).map(([l,w]) => <div key={l} className="flex-shrink-0" style={{width:w}}>{l}</div>)}
          </div>
          {bills.map((b, idx) => (
            <div key={b.id} className="flex items-center px-4 py-3 text-xs font-mono" style={{ background: idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-shrink-0 font-bold" style={{width:140, color:S.textSec}}>{b.id}</div>
              <div className="flex-shrink-0 flex items-center gap-2" style={{width:180}}>
                <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
                  {b.payerName[0]}
                </div>
                <span className="font-bold" style={{color:S.text}}>{b.payerName}</span>
              </div>
              <div className="flex-shrink-0" style={{width:80}}>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{background: S.accentLight, color:"#0d0d0d", borderRadius: S.radiusSm}}>{tierLabels[b.payerType]}</span>
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
      <div className="p-5" style={{ background: "linear-gradient(135deg,#0d0d0d 0%,#1a1a1a 100%)", borderRadius: S.radiusLg, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: S.accent, color: "#0d0d0d", borderRadius: S.radius }}>
                <Zap size={18} />
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: "#fff" }}>商业与计费</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  五级分层定价 · 订阅全生命周期管理 · GMV 分润链路 · 账单结算中心
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[`${pricingPlans.length} 个定价方案`, `${subs.length} 条订阅`, `${bills.length} 张账单`, `${gmvShares.length} 条分润流水`].map(t => (
                <span key={t} className="px-2.5 py-1 text-[10px] font-bold font-mono" style={{ background: S.accent, color: "#0d0d0d", borderRadius: S.radiusSm }}>{t}</span>
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
            background: tab === id ? "#0d0d0d" : "transparent",
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
  const toolTypeColor: Record<string, string> = { wecom: "#0d0d0d", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };

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
                      border: `1px solid ${draft.bindingStatus === s ? "#0d0d0d" : S.border}`,
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
                      <span className="font-bold" style={{ color: checked ? "#0d0d0d" : S.textSec }}>{p.name}</span>
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
              <button type="button" className="flex items-center gap-1 px-3 py-2 text-xs font-bold ml-3 self-end" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={addIdentity}><Plus size={12} />新增身份</button>
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
                      <span className="px-2 py-1 text-[10px] font-bold font-mono" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>{scopeCfg.label} · {ident.scopeIds.length} 已选</span>
                    </div>
                    <button type="button" className="text-[10px] font-mono px-2 py-1" style={{ color: "#a22", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => removeIdentity(idx)}>移除</button>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold mb-1.5 font-mono" style={{ color: S.textSec }}>选择 {scopeCfg.label} 范围（多选）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {scopeCfg.options.map(opt => {
                        const on = ident.scopeIds.includes(opt.id);
                        return <label key={opt.id} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: on ? "#0d0d0d" : "#f7f7f7", color: on ? S.accent : S.muted, border: `1px solid ${on ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}>
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
                        <TI size={12} style={{ color: "#fff" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{t.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: S.muted }}>{toolTypeLabel[t.type]} · {t.identifier}</div>
                      </div>
                      {t.boundProjectIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {t.boundProjectIds.slice(0, 2).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: S.radiusSm }}>{pid}</span>)}
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
                        background: selected ? "#0d0d0d" : "#fafaf8",
                        border: `1px solid ${selected ? "#0d0d0d" : S.border}`,
                        borderRadius: S.radiusSm,
                        color: selected ? S.accent : S.text,
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: toolTypeColor[t.type], borderRadius: 4 }}>
                        <TI size={10} style={{ color: "#fff" }} />
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
          <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={!canSave} style={{ background: canSave ? "#0d0d0d" : "#ddd", color: canSave ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={handleSave}><Save size={13} />{initial ? "保存账号" : "创建账号"}</button>
        </div>
      </aside>
    </div>
  );
}

// ─── 账号管理主 Tab ────────────────────────────────────────────
const toolStatusChip: Record<string, { label: string; bg: string; color: string }> = {
  idle:            { label: "空闲",   bg: "#f0f0f0", color: "#555" },
  in_use:          { label: "使用中", bg: S.accent,  color: "#000" },
  pending_transfer:{ label: "待交接", bg: "#ffd600", color: "#000" },
  abnormal:        { label: "异常",   bg: "#ff6b6b", color: "#fff" },
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
  global: "全局", eco: "生态", saas: "SaaS", platform: "平台", project: "项目", city: "城市",
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
    active:   { label: "正常",   bg: S.accent,     color: "#000" },
    disabled: { label: "停用",   bg: "#f0f0f0",    color: "#555" },
    pending:  { label: "待激活", bg: "#ffd600",    color: "#000" },
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
    ? { boxShadow: "0 0 0 2px #0d0d0d inset, 0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", transition: "box-shadow .2s" }
    : { boxShadow: "0 1px 4px rgba(0,0,0,0.05)", cursor: "pointer", transition: "box-shadow .2s" };

  // 批量选择对应的账号列表（用于批量操作头部显示）
  const batchAccounts = accounts.filter(a => batchSelection.includes(a.uid));
  const visibleUids = pagedRows.map(r => r.account.uid);
  const allVisibleChecked = visibleUids.length > 0 && visibleUids.every(u => batchSelection.includes(u));
  const someVisibleChecked = visibleUids.some(u => batchSelection.includes(u)) && !allVisibleChecked;

  const opTypeMeta: Record<AccountOperation["type"], { label: string; bg: string; icon: any; color: string }> = {
    create:            { label: "创建",   bg: "#ccff00", icon: Plus,         color: "#000" },
    edit:              { label: "编辑",   bg: "#e0e7ff", icon: Settings,     color: "#2b3ba0" },
    enable:            { label: "启用",   bg: "#d1fae5", icon: CheckCircle,  color: "#065f46" },
    disable:           { label: "停用",   bg: "#fee2e2", icon: XCircle,      color: "#991b1b" },
    assign_tools:      { label: "分配工具",bg: "#fef3c7", icon: Radio,        color: "#92400e" },
    assign_projects:   { label: "分配项目",bg: "#dbeafe", icon: Building2,    color: "#1e3a8a" },
    change_identities: { label: "调整身份",bg: "#ede9fe", icon: ShieldCheck,  color: "#4c1d95" },
    invite_approved:   { label: "邀请通过",bg: "#d1fae5", icon: ThumbsUp,     color: "#065f46" },
  };

  const scopeColor: Record<IdentityRole["scopeType"], string> = {
    global: "#0d0d0d", eco: "#7c3aed", saas: "#2563eb", platform: "#0891b2", project: "#059669", city: "#d97706",
  };

  return (
    <div className="space-y-4">
      {/* 子 Tab 切换 */}
      <div
        className="flex items-center gap-1 p-1"
        style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: S.radius }}
      >
        <button
          onClick={() => setSubTab("accounts")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold transition-all relative"
          style={{
            background: subTab === "accounts" ? "#0d0d0d" : "transparent",
            color: subTab === "accounts" ? S.accent : S.textSec,
            borderRadius: S.radiusSm,
          }}
        >
          <UsersRound size={14} />
          账号管理
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full" style={{
            background: subTab === "accounts" ? S.accent : S.accentLight,
            color: "#000",
          }}>{accounts.length}</span>
        </button>
        <button
          onClick={() => setSubTab("invites")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold transition-all relative"
          style={{
            background: subTab === "invites" ? "#0d0d0d" : "transparent",
            color: subTab === "invites" ? S.accent : S.textSec,
            borderRadius: S.radiusSm,
          }}
        >
          <UserPlus size={14} />
          邀请审核
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full" style={{
            background: subTab === "invites" ? S.accent : S.accentLight,
            color: "#000",
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
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "#0d0d0d", borderRadius: S.radiusSm }}><s.Icon size={14} style={{ color: S.accent }} /></div>
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
              { label: "领用·使用中", value: bindInUse, bg: S.accent, color: "#000", Icon: Eye, preset: { bf: "in_use" as BindingStatus } },
              { label: "领用·空闲", value: bindIdle, bg: "#f0f0f0", color: "#555", Icon: EyeOff, preset: { bf: "idle" as BindingStatus } },
              { label: "领用·待交接", value: bindPending, bg: "#ffd600", color: "#000", Icon: Clock, preset: { bf: "pending_transfer" as BindingStatus } },
              { label: "领用·异常", value: bindAbnormal, bg: "#ff6b6b", color: "#fff", Icon: AlertTriangle, preset: { bf: "abnormal" as BindingStatus } },
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
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#fff", color: "#0d0d0d", borderRadius: S.radiusSm, border: "1px solid #0d0d0d" }} onClick={() => setInviteOpen(true)}><UserPlus size={12} />邀请注册</button>
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#fff", color: "#0d0d0d", borderRadius: S.radiusSm, border: "1px solid #0d0d0d" }} onClick={exportCsv}><Download size={12} />导出CSV</button>
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreating(true)}><Plus size={12} />新建账号</button>
            </div>
          </div>

          {/* 表格 + 分页 */}
          <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="min-w-[1860px]">
              <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono sticky top-0 z-10" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
                <div className="flex-shrink-0 pr-2" style={{ width: 40 }}>
                  <button type="button" onClick={toggleAllVisibleRows} style={{ color: someVisibleChecked ? "#999" : "#0d0d0d", display: "inline-flex", alignItems: "center" }} title="勾选本页全部">
                    {allVisibleChecked ? <CheckSquare size={14} style={{ color: "#0d0d0d" }} /> : someVisibleChecked ? <CheckSquare size={14} style={{ color: "#bbb" }} /> : <Square size={14} />}
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
                          ? (sortDir === "asc" ? <ChevronUp size={12} style={{ color: "#0d0d0d" }} /> : <ChevronDown size={12} style={{ color: "#0d0d0d" }} />)
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
                const typeColors: Record<string, string> = { wecom: "#0d0d0d", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                return (
                  <div key={a.uid} className="flex items-start px-4 py-3 text-xs font-mono" style={{ background: checked ? "rgba(204,255,0,0.05)" : (idx % 2 === 0 ? "#fff" : "#fafaf8"), borderBottom: `1px solid ${S.border}`, transition: "background .15s" }}>
                    <div className="flex-shrink-0 pr-2 pt-0.5" style={{ width: 40 }}>
                      <button type="button" onClick={() => toggleRow(a.uid)}>
                        {checked ? <CheckSquare size={14} style={{ color: "#0d0d0d" }} /> : <Square size={14} style={{ color: S.mutedLight }} />}
                      </button>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 160 }}>
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>{a.name[0] || "?"}</div>
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
                          <span className="px-1 py-0.5 text-[9px] font-bold inline-flex items-center gap-0.5" style={{ background: scopeColor[i.scopeType], color: "#fff", borderRadius: S.radiusSm }} title={`作用域：${scopeTypeLabelZh[i.scopeType]}`}>
                            <MapPin size={8} />{scopeTypeLabelZh[i.scopeType]}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold" title={i.permissionSummary} style={{ background: S.accentLight, color: "#0d0d0d", border: `1px solid rgba(204,255,0,0.35)`, borderRadius: S.radiusSm }}>
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
                                <span className="px-1 py-0.5 text-[9px] font-bold inline-flex items-center gap-1" style={{ background: typeColors[t.type] || "#0d0d0d", color: "#fff", borderRadius: S.radiusSm }}>
                                  <TI size={8} />{t.name}
                                </span>
                                <span className="px-1 py-0.5 text-[9px] font-bold" style={{ background: toolStatusChip[t.status].bg, color: toolStatusChip[t.status].color, borderRadius: S.radiusSm }}>{toolStatusChip[t.status].label}</span>
                                {t.boundProjectIds.length > 0 && t.boundProjectIds.slice(0, 2).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: S.radiusSm }}>{projectId2Name[pid] || pid}</span>)}
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
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => setDetailOpen(a)}><Eye size={11} />详情</button>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => setEditing(a)}><Settings size={11} />编辑</button>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text }} onClick={() => setQuickAssignToolOpen(a)} title="快速分配工具"><ArrowLeftRight size={11} /></button>
                      {a.status !== "active" && <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setStatus(a.uid, "active")}>启用</button>}
                      {a.status === "active" && <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", color: "#991b1b", border: "1px solid #991b1b", borderRadius: S.radiusSm }} onClick={() => setStatus(a.uid, "disabled", true)}>停用</button>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分页 + 批量操作栏 */}
            <div className="sticky bottom-0 flex items-center justify-between px-4 py-3 gap-4 flex-wrap" style={{ background: "#fcfcfc", borderTop: `1px solid ${S.border}`, borderRadius: `0 0 ${S.radius} ${S.radius}` }}>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div style={{ color: S.muted }}>
                  已选中 <b style={{ color: "#0d0d0d" }}>{batchSelection.length}</b> 项
                  {batchSelection.length > 0 && (
                    <button className="ml-2 underline" style={{ color: S.muted }} onClick={() => setBatchSelection([])}>清空</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? S.accent : "#f0f0f0", color: batchSelection.length ? "#000" : "#999", borderRadius: S.radiusSm }}
                    onClick={() => batchSetStatus("active")}
                  ><CheckCircle size={11} />批量启用</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#fff" : "#f0f0f0", color: batchSelection.length ? "#991b1b" : "#999", border: `1px solid ${batchSelection.length ? "#991b1b" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => batchSetStatus("disabled")}
                  ><XCircle size={11} />批量停用</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#fff" : "#f0f0f0", color: batchSelection.length ? "#0d0d0d" : "#999", border: `1px solid ${batchSelection.length ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => { setBatchAction("assignProject"); setBatchTargetId([]); }}
                  ><Building2 size={11} />批量分配项目</button>
                  <button
                    type="button"
                    disabled={batchSelection.length === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold"
                    style={{ background: batchSelection.length ? "#fff" : "#f0f0f0", color: batchSelection.length ? "#0d0d0d" : "#999", border: `1px solid ${batchSelection.length ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}
                    onClick={() => { setBatchAction("assignTools"); setBatchTargetId([]); }}
                  ><Radio size={11} />批量分配工具</button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button type="button" disabled={safePage <= 1} className="px-2.5 py-1.5 font-bold" style={{ background: safePage > 1 ? "#fff" : "#f0f0f0", color: safePage > 1 ? S.text : "#999", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</button>
                <div style={{ color: S.text }}>第 <b>{safePage}</b> / {totalPages} 页</div>
                <button type="button" disabled={safePage >= totalPages} className="px-2.5 py-1.5 font-bold" style={{ background: safePage < totalPages ? "#fff" : "#f0f0f0", color: safePage < totalPages ? S.text : "#999", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>下一页</button>
                <select className="px-2 py-1.5 text-[11px] font-bold" style={{ background: "#fafaf8", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }} value={safePage} onChange={e => setPage(Number(e.target.value))}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <option key={p} value={p}>跳转到第 {p} 页</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
            <ShieldCheck size={18} style={{ color: "#0d0d0d", marginTop: 1, flexShrink: 0 }} />
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
              { label: "邀请总数", value: invites.length, Icon: Share2, bg: "#0d0d0d", color: S.accent },
              { label: "待填写", value: invPending, Icon: Clock, bg: "#fff", color: "#000" },
              { label: "待审核", value: invSubmitted, Icon: AlertTriangle, bg: "#ccff00", color: "#000" },
              { label: "已通过 / 已驳回", value: `${invApproved} / ${invRejected}`, Icon: ThumbsUp, bg: "#fff", color: "#000" },
            ].map((s: any) => (
              <div key={s.label} className="px-3 py-3 flex items-center gap-2" style={{ background: s.bg || S.surface, border: `1px solid ${s.bg === "#0d0d0d" ? "#0d0d0d" : S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: s.bg === "#0d0d0d" ? "#000" : S.accentLight, borderRadius: S.radiusSm }}>
                  <s.Icon size={14} style={{ color: s.bg === "#0d0d0d" ? S.accent : "#0d0d0d" }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono" style={{ color: s.bg === "#0d0d0d" ? "rgba(255,255,255,0.7)" : S.muted }}>{s.label}</div>
                  <div className="text-base font-bold mt-0.5" style={{ color: s.bg === "#0d0d0d" ? "#fff" : S.text }}>{s.value}</div>
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
              <button type="button" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setInviteOpen(true)}><UserPlus size={12} />新建邀请</button>
            </div>
          </div>

          <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="min-w-[1300px]">
              <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
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
                      background: idx % 2 === 0 ? "#fff" : "#fafaf8",
                      borderBottom: `1px solid ${S.border}`,
                      boxShadow: inv.status === "submitted" ? "inset 2px 0 0 #0d0d0d" : undefined,
                    }}
                  >
                    <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 170 }}>
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#ccff00", color: "#000", borderRadius: S.radiusSm }}>
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
                      <div className="inline-flex items-center px-2 py-1 font-bold" style={{ fontFamily: "ui-monospace, Menlo, monospace", background: S.surfaceSoft, border: `1px solid ${S.border}`, color: "#000", borderRadius: S.radiusSm, letterSpacing: 1 }}>
                        {inv.inviteCode}
                      </div>
                    </div>
                    <div className="flex-shrink-0 space-y-1" style={{ width: 260 }}>
                      <div className="flex flex-wrap gap-1">
                        {inv.suggestedIdentities.length === 0 && <span className="px-1.5 py-0.5 text-[10px]" style={{ color: S.muted }}>未指定身份</span>}
                        {inv.suggestedIdentities.map((i, k) => (
                          <span key={k} className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: "#0d0d0d", border: `1px solid rgba(204,255,0,0.35)`, borderRadius: S.radiusSm }}>{i.label}</span>
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
                        {resendCount != null && resendCount > 0 && <span className="ml-1 px-1" style={{ background: S.accentLight, color: "#000", borderRadius: 3 }}>重发 {resendCount}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center flex-wrap gap-1.5" style={{ width: 200 }}>
                      <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm }} onClick={() => openReview(inv)}>
                        <Eye size={11} /> 查看
                      </button>
                      {inv.status === "submitted" && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => openReview(inv)}>
                          <CheckCircle size={11} /> 审核
                        </button>
                      )}
                      {(inv.status === "pending" || inv.status === "expired" || inv.status === "rejected") && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => resendInvite(inv)} title="重置有效期为 7 天后">
                          <RotateCcw size={11} /> 重发
                        </button>
                      )}
                      {(inv.status === "pending" || inv.status === "submitted") && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", border: "1px solid #c00", color: "#c00", borderRadius: S.radiusSm }} onClick={() => revokeInvite(inv)}>
                          撤销
                        </button>
                      )}
                      {inv.status === "rejected" && (
                        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold" style={{ background: "#fff", border: "1px solid #0d0d0d", color: "#0d0d0d", borderRadius: S.radiusSm }} onClick={() => {
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
          <aside className="w-[560px] max-w-full h-full flex flex-col animate-[slideIn_.2s_ease-out]" style={{ background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex items-center justify-center font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }}>{detailOpen.name[0] || "?"}</div>
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
                          <span className="px-1.5 py-0.5 text-[9px] font-bold inline-flex items-center gap-0.5" style={{ background: scopeColor[i.scopeType], color: "#fff", borderRadius: S.radiusSm }}>
                            <MapPin size={8} />{scopeTypeLabelZh[i.scopeType]}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: S.radiusSm }}>{i.label}</span>
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
                    const typeColors: Record<string, string> = { wecom: "#0d0d0d", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                    return (
                      <div key={tid} className="flex items-center gap-2 p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: typeColors[t.type] || "#0d0d0d", borderRadius: S.radiusSm }}>
                          <TI size={12} style={{ color: "#fff" }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold" style={{ color: S.text }}>{t.name}</div>
                          <div className="text-[10px]" style={{ color: S.muted }}>{t.identifier} · 所属 {t.type}</div>
                          {t.boundProjectIds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.boundProjectIds.slice(0, 4).map(pid => <span key={pid} className="px-1 py-0.5 text-[9px]" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: 3 }}>{projectId2Name[pid] || pid}</span>)}
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
            <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#fff", borderTop: `1px solid ${S.border}` }}>
              <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setDetailOpen(null)}>关闭</button>
              <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={() => { const a = detailOpen; setDetailOpen(null); setEditing(a); }}><Settings size={13} />前往编辑</button>
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
            <aside className="w-[520px] max-w-full h-full flex flex-col" style={{ background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
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
                  const typeColors: Record<string, string> = { wecom: "#0d0d0d", wechat: "#07c160", phone: "#4a90e2", media: "#ff6b35" };
                  const checked = local.includes(t.id);
                  return (
                    <button key={t.id} type="button" className="w-full text-left flex items-center gap-3 p-3" style={{ background: checked ? S.accentLight : S.surface, border: `1px solid ${checked ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}
                      onClick={() => setLocal(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: typeColors[t.type] || "#0d0d0d", borderRadius: S.radiusSm }}>
                        <TI size={12} style={{ color: "#fff" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: S.text }}>{t.name}</div>
                        <div className="text-[10px] truncate" style={{ color: S.muted }}>{t.identifier}</div>
                      </div>
                      {checked ? <CheckSquare size={16} style={{ color: "#0d0d0d" }} /> : <Square size={16} style={{ color: S.mutedLight }} />}
                    </button>
                  );
                })}
              </div>
              <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#fff", borderTop: `1px solid ${S.border}` }}>
                <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => { isBatch ? setBatchAction(null) : setQuickAssignToolOpen(null); }}>取消</button>
                <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={local.length === 0} style={{ background: local.length ? "#0d0d0d" : "#ddd", color: local.length ? S.accent : "#888", borderRadius: S.radiusSm }}
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
            <aside className="w-[520px] max-w-full h-full flex flex-col" style={{ background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }} onClick={e => e.stopPropagation()}>
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
                    <button key={p.id} type="button" className="w-full text-left flex items-center gap-3 p-3" style={{ background: checked ? S.accentLight : S.surface, border: `1px solid ${checked ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}
                      onClick={() => setLocal(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "#0d0d0d", borderRadius: S.radiusSm }}>
                        <Building2 size={12} style={{ color: S.accent }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate" style={{ color: S.text }}>{p.name}</div>
                        <div className="text-[10px] truncate" style={{ color: S.muted }}>{p.id}</div>
                      </div>
                      {checked ? <CheckSquare size={16} style={{ color: "#0d0d0d" }} /> : <Square size={16} style={{ color: S.mutedLight }} />}
                    </button>
                  );
                })}
              </div>
              <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: "#fff", borderTop: `1px solid ${S.border}` }}>
                <button type="button" className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setBatchAction(null)}>取消</button>
                <button type="button" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" disabled={local.length === 0} style={{ background: local.length ? "#0d0d0d" : "#ddd", color: local.length ? S.accent : "#888", borderRadius: S.radiusSm }}
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
  { name: "孙悦",  role: "超级管理员", avatar: "孙" },
  { name: "李昊",  role: "生态负责人", avatar: "李" },
  { name: "周敏",  role: "生态COO", avatar: "周" },
  { name: "钱程",  role: "SaaS负责人", avatar: "钱" },
  { name: "吴倩",  role: "SaaS运营", avatar: "吴" },
  { name: "郑宇",  role: "平台管理员", avatar: "郑" },
  { name: "冯雪",  role: "平台运营", avatar: "冯" },
  { name: "王磊",  role: "项目负责人", avatar: "王" },
  { name: "陈静",  role: "区域运营", avatar: "陈" },
  { name: "杨丽",  role: "客服", avatar: "杨" },
  { name: "林峰",  role: "老师", avatar: "林" },
];
export default function EcosystemManagement() {
  const { accounts, setAccounts } = useAccounts();
  const [activeTier, setActiveTier] = useState("super");
  const [ecoList, setEcoList] = useState<EcoItem[]>(() => ecosystems.map(e => ({ ...e })));
  const [saasList, setSaasList] = useState<SaasItem[]>(() => saasPlatforms.map(p => ({ ...p })));
  const [platformList, setPlatformList] = useState<PlatformItem[]>(() => platforms.map(p => ({ ...p })));
  const [projectList, setProjectList] = useState<ProjectItem[]>(() => projects.map(p => ({ ...p })));
  const [subs, setSubs] = useState<Subscription[]>(() => subscriptions.map(s => ({ ...s })));
  const [bills, setBills] = useState<BillRecord[]>(() => billRecords.map(b => ({ ...b })));
  const [activePlatformId, setActivePlatformId] = useState<number | null>(null);
  const [activePlatformName, setActivePlatformName] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<MainTab>("architecture");
  // 当前登录身份（联动：按身份过滤生态/SaaS/平台/项目的可见性；仅作为演示态）
  const [currentRole, setCurrentRole] = useState<string>("超级管理员");
  const currentUser = mockCurrentAccounts.find(u => u.role === currentRole) ?? mockCurrentAccounts[0];
  // 超级态：全量可见；生态层仅当 visibility/生态相关身份才能看到某个生态；这里做简化：按身份过滤项目列表 + 平台列表；生态/SaaS/超级态不变
  const scopedProjects = projectList.filter(p => {
    if (["超级管理员", "生态COO", "SaaS负责人", "SaaS运营"].includes(currentRole)) return true;
    if (currentRole === "生态负责人") return !!p.visibility["生态负责人"] || true; // 生态负责人看旗下生态所有项目
    if (currentRole === "平台管理员") return !!p.visibility["平台管理员"] || true; // 平台管理员看旗下平台所有项目
    if (currentRole === "平台运营") return !!p.visibility["平台运营"] || true;
    return !!p.visibility[currentRole];
  });
  const scopedPlatforms = platformList.filter(pf => {
    if (["超级管理员", "生态COO", "SaaS负责人", "SaaS运营", "生态负责人", "平台管理员", "平台运营"].includes(currentRole)) return true;
    const pfProjects = scopedProjects.filter(p => p.platform === pf.name);
    return pfProjects.length > 0;
  });
  const scopedEcos = ecoList.filter(eco => {
    if (["超级管理员", "生态COO", "SaaS负责人", "SaaS运营"].includes(currentRole)) return true;
    if (currentRole === "生态负责人") return true; // 模拟：生态负责人看全部（真实需按 uid 绑定）
    return scopedProjects.some(p => p.eco === eco.name);
  });
  const scopedSaas = saasList.filter(s => {
    if (["超级管理员", "生态COO", "SaaS负责人", "SaaS运营", "生态负责人"].includes(currentRole)) return true;
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
      {/* 页头 */}
      <div className="flex items-start justify-between flex-shrink-0 gap-4 flex-wrap">
        <div>
          <h2 className="font-bold" style={{ color: S.text, letterSpacing: "0.05em" }}>生态架构管理</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>
            四层生态架构：超级生态 → 生态 → SaaS 系统 → 平台，每个 SaaS 系统招募多个平台，每个平台下辖多个运营项目；当前系统属于 SaaS 层，为招募的平台和项目下发私域社群能力
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            <div className="w-2 h-2" style={{ background: S.accent, borderRadius: "50%" }} />
            <span className="text-xs font-mono" style={{ color: S.muted }}>当前：</span>
            <span className="text-xs font-bold font-mono" style={{ color: S.text }}>SaaS 系统 · 私域工具</span>
          </div>
          {/* 当前登录身份选择器（权限联动演示） */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radiusSm }}>
            <div className="w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>{currentUser.avatar}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold" style={{ color: S.text }}>{currentUser.name}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: "3px" }}>{currentRole}</span>
              </div>
              <label className="flex items-center gap-1 mt-0.5" style={{ color: S.muted, fontSize: "10px" }}>
                切换身份
                <select
                  className="px-1 py-0.5 outline-none"
                  style={{ background: "transparent", border: "none", color: S.text, fontSize: "10px", fontFamily: "monospace", fontWeight: 700, cursor: "pointer" }}
                  value={currentRole}
                  onChange={e => setCurrentRole(e.target.value)}
                >
                  {mockCurrentAccounts.map(u => <option key={u.role}>{u.role}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 四层架构图 */}
      <ArchitectureDiagram tiers={tiers} activeTier={activeTier} onSelect={(id) => { setActiveTier(id); if (id !== "platform") { setActivePlatformId(null); setActivePlatformName(null); } }} />

      {/* 当前层级说明条 */}
      <div className="flex items-center gap-4 px-4 py-3 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
        <tier.icon size={16} style={{ color: "#0d0d0d", flexShrink: 0 }} />
        <div className="flex-1">
          <span className="text-sm font-bold" style={{ color: S.text }}>第 {tier.level} 层：{tier.label}</span>
          <span className="text-xs ml-3 font-mono" style={{ color: S.muted }}>{tier.desc}</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {tier.metrics.map(m => (
            <div key={m.label} className="text-center">
              <div className="text-sm font-bold" style={{ color: S.text }}>{m.value}</div>
              <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 px-3 py-1.5 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
          {tier.role}
        </div>
      </div>

      {/* 横排主 Tab：架构视图 / 账号管理 / 商业与计费（层级说明条下方、层级内容上方） */}
      <div className="flex gap-1 p-1 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {([
          ["architecture", "架构视图", Layers, "四层架构总览、生态、SaaS、平台、项目管理"],
          ["accounts",     "账号管理", UsersRound, "系统账号、身份绑定、企微/微信号绑定管理"],
          ["commercial",   "商业与计费", TrendingUp, "四级收费方案、订阅管理、分润看板、账单中心"],
        ] as [MainTab, string, any, string][]).map(([id, label, Icon, hint]) => (
          <button
            key={id}
            type="button"
            title={hint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all relative"
            style={{
              background: mainTab === id ? "#0d0d0d" : "transparent",
              color: mainTab === id ? S.accent : S.textSec,
              borderRadius: S.radiusSm,
            }}
            onClick={() => setMainTab(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
            {mainTab === id && <span className="absolute right-2 bottom-2 w-1.5 h-1.5" style={{ background: S.accent, borderRadius: "50%" }} />}
          </button>
        ))}
      </div>

      {/* Tab 内容区 */}
      <div className="flex-1">
        {mainTab === "accounts" && <AccountManagerTab accounts={accounts} setAccounts={setAccounts} projectList={projectList} />}
        {mainTab === "commercial" && <CommercialTab subs={subs} bills={bills} />}
        {mainTab === "architecture" && (<>
          {activeTier === "super"    && <SuperView ecoList={ecoList} setEcoList={setEcoList} saasList={saasList} setSaasList={setSaasList} accounts={accounts} setAccounts={setAccounts} subs={subs} setSubs={setSubs} bills={bills} setBills={setBills} />}
          {activeTier === "eco"      && <EcoView ecoList={ecoList} saasList={saasList} setSaasList={setSaasList} platformList={platformList} setPlatformList={setPlatformList} />}
          {activeTier === "saas"     && <SaasView ecoList={ecoList} saasList={saasList} platformList={platformList} setPlatformList={setPlatformList} setActiveTier={setActiveTier} setActivePlatformId={(id) => setActivePlatformId(id)} setActivePlatformName={(n) => setActivePlatformName(n)} />}
          {activeTier === "platform" && (
            activePlatformId !== null && activePlatformName !== null ? (
              <ProjectList
                projectList={projectList} setProjectList={setProjectList}
                ecoList={ecoList} saasList={saasList} platformList={platformList}
                platformName={activePlatformName} platformId={activePlatformId}
                onBack={() => { setActivePlatformId(null); setActivePlatformName(null); }}
              />
            ) : (
              <PlatformView
                platformList={platformList} setPlatformList={setPlatformList}
                ecoList={ecoList} saasList={saasList}
                projectList={projectList} setProjectList={setProjectList}
                onEnterPlatform={(id, name) => { setActivePlatformId(id); setActivePlatformName(name); }}
              />
            )
          )}
        </>)}
      </div>
    </div>
  );
}
