import { MessageSquare, Send, CalendarDays, ClipboardCheck } from "lucide-react";

/* 会员运营工作台 · 数据视角配置
   原则：布局与模块位置完全不动，仅按视角（社群/项目/代理）切换各模块内容：
   任务中心分类与列表 / 排行 Tab / 排行表格列与行 / 关系链树 / 运营操作台 / 右侧档案。 */

export type DataScope = "members" | "community" | "project" | "agent";

export const dataScopeOptions: Array<{ id: DataScope; label: string }> = [
  { id: "members", label: "会员数据" },
  { id: "community", label: "社群数据" },
  { id: "project", label: "项目数据" },
  { id: "agent", label: "代理数据" },
];

export type ScopeOperationId = "issue" | "push" | "activity" | "moments";

export type ScopeTask = { title: string; time: string; status: string; unread: number };
export type ScopeColumn = { label: string; key?: string; width: number; tone?: "name" | "bold" | "muted" | "text" };
export type ScopeRow = {
  rank: number;
  name: string;
  initial: string;
  filter: string;
  cells?: string[];
  data?: Record<string, string>;
  agentId?: string;
};
export type ScopeTreeNode = { name: string; children: ScopeTreeNode[] };
export type ScopeOperation = { id: ScopeOperationId; label: string; icon: typeof MessageSquare; button: string };
export type ScopeRecord = { title: string; desc: string; status: string };

export type ScopeConfig = {
  noun: string;           // 当前社群 / 当前项目 / 当前代理
  counterUnit: string;    // 个社群 / 个项目 / 位代理
  panelTitle: string;     // 社群档案 / 项目档案 / 代理档案
  panelSub: string;
  taskCategories: Array<{ label: string; count: number }>;
  taskLists: Record<string, ScopeTask[]>;
  rankingTabs: string[];
  filterChips: string[];
  columns: ScopeColumn[];
  rows: ScopeRow[];
  tree: ScopeTreeNode;
  operations: ScopeOperation[];
  profileTags: Array<{ label: string; background: string; color: string }>;
  profileSub: string;
  profileFields: Array<[string, string]>;
  summary: Array<[string, string, string]>;
  metrics: Array<[string, string, string]>;
  profileTabs: string[];
  profileRecords: Record<string, ScopeRecord[]>;
};

/* ── 社群数据 ─────────────────────────────────────────────── */
const community: ScopeConfig = {
  noun: "社群",
  counterUnit: "个社群",
  panelTitle: "社群档案",
  panelSub: "群资料、成员与运营记录",
  taskCategories: [
    { label: "活跃群", count: 14 },
    { label: "预警群", count: 3 },
    { label: "沉寂群", count: 6 },
    { label: "新建群", count: 2 },
  ],
  taskLists: {
    "活跃群": [
      { title: "北京PRO会员群1群 · 日常维护", time: "2026-07-05 14:30", status: "进行中", unread: 3 },
      { title: "朝阳体验官群 · 新课预热", time: "2026-07-04 10:00", status: "进行中", unread: 1 },
      { title: "海淀会员服务群 · 答疑值班", time: "2026-07-03 09:00", status: "已完成", unread: 0 },
    ],
    "预警群": [
      { title: "西城冷启动群 · 退群预警处理", time: "2026-07-05 11:00", status: "待处理", unread: 2 },
      { title: "东城打卡群 · 激活方案", time: "2026-07-02 16:00", status: "待处理", unread: 1 },
    ],
    "沉寂群": [
      { title: "丰台旧会员群 · 拉新重启", time: "2026-07-01 09:30", status: "进行中", unread: 0 },
    ],
    "新建群": [
      { title: "亦庄新项目预备群 · 建群配置", time: "2026-07-06 09:00", status: "待处理", unread: 1 },
    ],
  },
  rankingTabs: ["活跃群排行", "增长排行", "转化排行", "全部群", "预警群"],
  filterChips: ["全部", "活跃", "预警", "沉寂"],
  columns: [
    { label: "社群名称", key: "communityName", width: 128, tone: "name" },
    { label: "社群层级", key: "communityLevel", width: 72, tone: "muted" },
    { label: "所属项目", key: "projectName", width: 92, tone: "text" },
    { label: "运营城市", key: "city", width: 82, tone: "muted" },
    { label: "成员数", key: "memberCount", width: 60, tone: "bold" },
    { label: "发言会员数", key: "speakingMembers", width: 68, tone: "bold" },
    { label: "信息到达率", key: "reachRate", width: 72, tone: "text" },
    { label: "链接点击量", key: "linkClicks", width: 68, tone: "text" },
    { label: "项目绑定量", key: "projectBindings", width: 68, tone: "text" },
    { label: "课程报名量", key: "courseSignups", width: 68, tone: "text" },
    { label: "消费人数", key: "consumingMembers", width: 68, tone: "bold" },
    { label: "订单数量", key: "orderCount", width: 58, tone: "text" },
    { label: "成交额", key: "transactionAmount", width: 82, tone: "bold" },
    { label: "运营阶段", key: "operationStage", width: 72, tone: "muted" },
    { label: "下一步动作", key: "nextAction", width: 128, tone: "text" },
  ],
  rows: [
    { rank: 1, name: "北京PRO会员群1群", initial: "员", filter: "活跃", data: { communityName: "北京PRO会员群1群", communityLevel: "交付层", projectName: "AI知识付费", city: "北京-朝阳", memberCount: "486", speakingMembers: "218", reachRate: "92%", linkClicks: "164", projectBindings: "126", courseSignups: "98", consumingMembers: "74", orderCount: "132", transactionAmount: "¥86,400", operationStage: "复购", nextAction: "推进续费触达" } },
    { rank: 2, name: "朝阳体验官交流群", initial: "体", filter: "活跃", data: { communityName: "朝阳体验官交流群", communityLevel: "培育层", projectName: "AI教育", city: "北京-朝阳", memberCount: "412", speakingMembers: "176", reachRate: "84%", linkClicks: "128", projectBindings: "94", courseSignups: "86", consumingMembers: "51", orderCount: "82", transactionAmount: "¥54,800", operationStage: "转化", nextAction: "跟进报名未消费" } },
    { rank: 3, name: "海淀会员服务群", initial: "服", filter: "活跃", data: { communityName: "海淀会员服务群", communityLevel: "服务层", projectName: "AI大健康", city: "北京-海淀", memberCount: "365", speakingMembers: "142", reachRate: "78%", linkClicks: "96", projectBindings: "81", courseSignups: "62", consumingMembers: "48", orderCount: "76", transactionAmount: "¥42,600", operationStage: "复购", nextAction: "唤醒沉默会员" } },
    { rank: 4, name: "西城冷启动群", initial: "冷", filter: "预警", data: { communityName: "西城冷启动群", communityLevel: "引流层", projectName: "V001 军师", city: "北京-西城", memberCount: "218", speakingMembers: "46", reachRate: "41%", linkClicks: "28", projectBindings: "19", courseSignups: "12", consumingMembers: "8", orderCount: "14", transactionAmount: "¥6,800", operationStage: "激活", nextAction: "安排群内首场活动" } },
    { rank: 5, name: "东城打卡群", initial: "打", filter: "沉寂", data: { communityName: "东城打卡群", communityLevel: "培育层", projectName: "V001 军师", city: "北京-东城", memberCount: "154", speakingMembers: "31", reachRate: "33%", linkClicks: "18", projectBindings: "11", courseSignups: "9", consumingMembers: "5", orderCount: "8", transactionAmount: "¥3,200", operationStage: "挽回", nextAction: "迁移并重新分层" } },
  ],
  tree: {
    name: "北京PRO会员群1群",
    children: [
      { name: "朝阳体验官交流群(412人)", children: [
        { name: "体验官子群A(28人)", children: [] },
        { name: "体验官子群B(16人)", children: [] },
      ] },
      { name: "海淀会员服务群(365人)", children: [{ name: "会员服务分群(35人)", children: [] }] },
      { name: "西城冷启动群(218人)", children: [{ name: "冷启动裂变群(12人)", children: [] }] },
    ],
  },
  operations: [
    { id: "issue", label: "群公告", icon: MessageSquare, button: "发布群公告" },
    { id: "push", label: "群发消息", icon: Send, button: "发送群发" },
    { id: "activity", label: "群活动", icon: CalendarDays, button: "创建群活动" },
    { id: "moments", label: "群预警", icon: ClipboardCheck, button: "标记预警" },
  ],
  profileTags: [
    { label: "高活跃群", background: "#e8fbf4", color: "#00a978" },
    { label: "A级群", background: "#effed4", color: "#253800" },
    { label: "重点项目群", background: "#e2f3ff", color: "#2385c8" },
  ],
  profileSub: "运营负责人 林小燕 · AI知识付费",
  profileFields: [
    ["社群编号", "G-00001"], ["社群层级", "交付层"],
    ["所属项目", "AI知识付费"], ["运营负责人", "林小燕"],
    ["当前成员", "486 人"], ["成员容量", "500 人"],
    ["建群时间", "2026-03-12"], ["运营状态", "正常"],
  ],
  summary: [
    ["成员规模", "486 人", "#2385c8"], ["7日活跃", "92%", "#00a978"],
    ["本周新增", "+12 人", "#00a978"], ["消费人数", "74 人", "#253800"],
  ],
  metrics: [
    ["发言率", "44.9%", "#00a978"], ["点击率", "33.7%", "#2385c8"],
    ["绑定率", "25.9%", "#253800"], ["消费转化率", "58.7%", "#e77800"],
  ],
  profileTabs: ["群公告", "群成员", "群活动", "群资产配置", "操作记录"],
  profileRecords: {
    "群公告": [
      { title: "9 月新课表已发布", desc: "含 4 场直播与 2 场闭门会", status: "置顶" },
      { title: "周三直播观赛打卡", desc: "20:00 开播，群内打卡领积分", status: "进行中" },
      { title: "群规更新通知", desc: "广告与刷屏处理规则 v2", status: "已发布" },
    ],
    "群成员": [
      { title: "盛光年 · 群主", desc: "影响力 3,510 · 高活跃", status: "在线" },
      { title: "皮卡丘", desc: "影响力 2,877 · 活跃", status: "在线" },
      { title: "文泽", desc: "影响力 2,104 · 活跃", status: "今天" },
    ],
    "群活动": [
      { title: "直播观赛打卡", desc: "9 月 3 日 20:00 · 观赛领积分", status: "进行中" },
      { title: "晒单周赛 · 7 月第二周", desc: "截图上传赢成长值", status: "报名中" },
    ],
    "群资产配置": [],
    "操作记录": [
      { title: "群公告发布", desc: "运营 · 林小燕 · 今天 09:12", status: "成功" },
      { title: "移出违规成员", desc: "运营 · 林小燕 · 昨天", status: "已处理" },
    ],
  },
};

/* ── 项目数据 ─────────────────────────────────────────────── */
const project: ScopeConfig = {
  noun: "项目",
  counterUnit: "个项目",
  panelTitle: "项目档案",
  panelSub: "项目进度、指标与里程碑",
  taskCategories: [
    { label: "全部项目", count: 9 },
    { label: "运营中", count: 6 },
    { label: "孵化中", count: 2 },
    { label: "待启动", count: 1 },
  ],
  taskLists: {
    "全部项目": [
      { title: "V001 军师 · 周复盘整理", time: "2026-07-05 15:00", status: "待处理", unread: 2 },
      { title: "AI超级广告公司 · 商业化冲刺", time: "2026-07-04 10:00", status: "进行中", unread: 3 },
      { title: "AI艺人孵化 · 招募计划复盘", time: "2026-07-03 09:00", status: "进行中", unread: 1 },
    ],
    "运营中": [
      { title: "V001 军师 · 会员增长复盘", time: "2026-07-05 15:00", status: "进行中", unread: 2 },
      { title: "AI大健康 · 复购方案执行", time: "2026-07-04 10:00", status: "进行中", unread: 3 },
    ],
    "孵化中": [
      { title: "AI数字资产平台 · 产品筹备", time: "2026-07-06 09:30", status: "待处理", unread: 1 },
      { title: "AI明星艺人授权 · 资源盘点", time: "2026-07-06 14:00", status: "进行中", unread: 1 },
    ],
    "待启动": [
      { title: "AI企业礼品采购 · 立项规划", time: "2026-07-10 10:00", status: "待处理", unread: 0 },
    ],
  },
  rankingTabs: ["收益排行", "会员增长", "社群规模", "全部项目"],
  filterChips: ["全部", "运营中", "孵化中", "待启动"],
  columns: [
    { label: "项目名称", key: "projectName", width: 126, tone: "name" },
    { label: "项目阶段", key: "projectStage", width: 66, tone: "muted" },
    { label: "代理总数", key: "agentCount", width: 62, tone: "bold" },
    { label: "新增代理", key: "newAgents", width: 62, tone: "text" },
    { label: "活跃代理", key: "activeAgents", width: 62, tone: "text" },
    { label: "会员总数", key: "memberCount", width: 68, tone: "bold" },
    { label: "新增会员", key: "newMembers", width: 68, tone: "text" },
    { label: "活跃会员", key: "activeMembers", width: 68, tone: "text" },
    { label: "已授权会员", key: "authorizedMembers", width: 62, tone: "text" },
    { label: "已绑定账号会员", key: "boundMembers", width: 62, tone: "text" },
    { label: "已消费会员", key: "consumingMembers", width: 62, tone: "text" },
    { label: "复购会员", key: "repeatMembers", width: 68, tone: "text" },
    { label: "订单数量", key: "orderCount", width: 62, tone: "text" },
    { label: "本月交易额", key: "monthlyAmount", width: 86, tone: "bold" },
    { label: "累计交易额", key: "totalAmount", width: 86, tone: "bold" },
    { label: "复购率", key: "repeatRate", width: 62, tone: "text" },
    { label: "项目健康度", key: "healthScore", width: 62, tone: "text" },
    { label: "下一步动作", key: "nextAction", width: 128, tone: "text" },
  ],
  rows: [
    { rank: 1, name: "V001 军师", initial: "军", filter: "运营中", data: { projectName: "V001 军师", projectStage: "运营中", agentCount: "86", newAgents: "12", activeAgents: "68", memberCount: "8,023", newMembers: "412", activeMembers: "6,844", authorizedMembers: "7,126", boundMembers: "6,538", consumingMembers: "4,982", repeatMembers: "1,864", orderCount: "2,486", monthlyAmount: "¥286,400", totalAmount: "¥2.86M", repeatRate: "37.4%", healthScore: "A级", nextAction: "加大复购代理招募" } },
    { rank: 2, name: "AI超级广告公司", initial: "广", filter: "运营中", data: { projectName: "AI超级广告公司", projectStage: "运营中", agentCount: "64", newAgents: "9", activeAgents: "51", memberCount: "6,544", newMembers: "286", activeMembers: "5,218", authorizedMembers: "5,704", boundMembers: "4,962", consumingMembers: "3,814", repeatMembers: "1,328", orderCount: "1,904", monthlyAmount: "¥212,800", totalAmount: "¥1.98M", repeatRate: "34.8%", healthScore: "A级", nextAction: "推进高价值会员转化" } },
    { rank: 3, name: "AI艺人孵化", initial: "艺", filter: "运营中", data: { projectName: "AI艺人孵化", projectStage: "运营中", agentCount: "48", newAgents: "7", activeAgents: "39", memberCount: "5,231", newMembers: "244", activeMembers: "4,102", authorizedMembers: "4,506", boundMembers: "3,846", consumingMembers: "2,684", repeatMembers: "912", orderCount: "1,286", monthlyAmount: "¥96,200", totalAmount: "¥1.12M", repeatRate: "34.0%", healthScore: "B级", nextAction: "完善授权产品梯度" } },
    { rank: 4, name: "AI数字资产平台", initial: "资", filter: "运营中", data: { projectName: "AI数字资产平台", projectStage: "运营中", agentCount: "36", newAgents: "6", activeAgents: "28", memberCount: "4,286", newMembers: "198", activeMembers: "3,106", authorizedMembers: "3,724", boundMembers: "3,012", consumingMembers: "1,942", repeatMembers: "608", orderCount: "864", monthlyAmount: "¥82,600", totalAmount: "¥786K", repeatRate: "31.3%", healthScore: "B级", nextAction: "提升绑定账号率" } },
    { rank: 5, name: "AI大健康", initial: "健", filter: "运营中", data: { projectName: "AI大健康", projectStage: "运营中", agentCount: "42", newAgents: "6", activeAgents: "32", memberCount: "3,918", newMembers: "176", activeMembers: "2,984", authorizedMembers: "3,412", boundMembers: "2,806", consumingMembers: "2,214", repeatMembers: "1,042", orderCount: "1,566", monthlyAmount: "¥76,400", totalAmount: "¥934K", repeatRate: "47.1%", healthScore: "A级", nextAction: "推进消费会员复购" } },
    { rank: 6, name: "AI知识付费", initial: "知", filter: "运营中", data: { projectName: "AI知识付费", projectStage: "运营中", agentCount: "31", newAgents: "5", activeAgents: "24", memberCount: "3,604", newMembers: "164", activeMembers: "2,648", authorizedMembers: "3,086", boundMembers: "2,514", consumingMembers: "1,826", repeatMembers: "684", orderCount: "1,108", monthlyAmount: "¥68,900", totalAmount: "¥702K", repeatRate: "37.5%", healthScore: "A级", nextAction: "跟进课程报名转化" } },
    { rank: 7, name: "AI教育", initial: "教", filter: "孵化中", data: { projectName: "AI教育", projectStage: "孵化中", agentCount: "24", newAgents: "4", activeAgents: "16", memberCount: "2,106", newMembers: "128", activeMembers: "1,286", authorizedMembers: "1,684", boundMembers: "1,204", consumingMembers: "642", repeatMembers: "188", orderCount: "326", monthlyAmount: "¥36,800", totalAmount: "¥284K", repeatRate: "29.3%", healthScore: "B级", nextAction: "完成首批代理培训" } },
    { rank: 8, name: "AI明星艺人授权", initial: "授", filter: "孵化中", data: { projectName: "AI明星艺人授权", projectStage: "孵化中", agentCount: "18", newAgents: "3", activeAgents: "11", memberCount: "1,102", newMembers: "86", activeMembers: "684", authorizedMembers: "892", boundMembers: "604", consumingMembers: "286", repeatMembers: "74", orderCount: "128", monthlyAmount: "¥18,400", totalAmount: "¥126K", repeatRate: "25.9%", healthScore: "B级", nextAction: "建立授权交付流程" } },
    { rank: 9, name: "AI企业礼品采购", initial: "礼", filter: "待启动", data: { projectName: "AI企业礼品采购", projectStage: "待启动", agentCount: "待配置", newAgents: "待配置", activeAgents: "待配置", memberCount: "暂无数据", newMembers: "暂无数据", activeMembers: "暂无数据", authorizedMembers: "暂无数据", boundMembers: "暂无数据", consumingMembers: "暂无数据", repeatMembers: "暂无数据", orderCount: "暂无数据", monthlyAmount: "暂无数据", totalAmount: "暂无数据", repeatRate: "待配置", healthScore: "待配置", nextAction: "完成项目启动配置" } },
  ],
  tree: {
    name: "V001 军师",
    children: [
      { name: "AI超级广告公司(9群)", children: [
        { name: "AI知识付费(4群)", children: [] },
        { name: "AI教育(3群)", children: [] },
      ] },
      { name: "AI艺人孵化(7群)", children: [{ name: "AI明星艺人授权(2群)", children: [] }] },
      { name: "AI大健康(6群)", children: [{ name: "AI营养补剂会员平台(3群)", children: [] }] },
    ],
  },
  operations: [
    { id: "issue", label: "项目任务", icon: MessageSquare, button: "创建项目任务" },
    { id: "push", label: "数据报表", icon: Send, button: "生成报表" },
    { id: "activity", label: "里程碑", icon: CalendarDays, button: "添加里程碑" },
    { id: "moments", label: "项目复盘", icon: ClipboardCheck, button: "发起复盘" },
  ],
  profileTags: [
    { label: "运营中", background: "#effed4", color: "#253800" },
    { label: "重点项目", background: "#e2f3ff", color: "#2385c8" },
    { label: "收益Top1", background: "#fff0db", color: "#e77800" },
  ],
  profileSub: "主理人 吴思远 · 北京 · 运营中",
  profileFields: [
    ["项目编号", "v001-strategist"], ["项目阶段", "运营中"],
    ["主理人", "吴思远"], ["覆盖城市", "12 城"],
    ["服务会员", "8,023 人"], ["社群数", "12 群"],
    ["启动时间", "2026-01-15"], ["本月GMV", "¥286,400"],
  ],
  summary: [
    ["服务会员", "8,023 人", "#2385c8"], ["社群规模", "12 群", "#00a978"],
    ["本月新增", "+412 人", "#00a978"], ["本月GMV", "¥286.4K", "#e77800"],
  ],
  metrics: [
    ["授权率（授权 / 会员）", "88.8%", "#00a978"], ["绑定率（绑定 / 授权）", "91.8%", "#2385c8"],
    ["消费转化率（消费 / 绑定）", "76.2%", "#e77800"], ["复购率（复购 / 消费）", "37.4%", "#253800"],
  ],
  profileTabs: ["项目任务", "里程碑", "复盘记录", "数据报表"],
  profileRecords: {
    "项目任务": [
      { title: "周复盘整理", desc: "第 33 周 · 负责人 吴思远", status: "待处理" },
      { title: "续费冲刺执行", desc: "PRO会员 · 9 月目标 200 单", status: "进行中" },
      { title: "拉新投放", desc: "体验官项目 · 朋友圈渠道", status: "进行中" },
    ],
    "里程碑": [
      { title: "万人会员", desc: "当前 8,023 · 完成 80%", status: "88%" },
      { title: "百群计划", desc: "当前 12 群 · 完成 12%", status: "12%" },
      { title: "月百万收益", desc: "当前 ¥286.4K · 完成 96%", status: "96%" },
    ],
    "复盘记录": [
      { title: "第 33 周复盘", desc: "续费率提升 6% · 下周加大触达", status: "已归档" },
      { title: "第 32 周复盘", desc: "新群冷启动达标", status: "已归档" },
    ],
    "数据报表": [
      { title: "8 月会员增长报表", desc: "新增 1,204 人 · 环比 +8%", status: "已生成" },
      { title: "8 月收益报表", desc: "¥286.4K · 环比 +12%", status: "已生成" },
    ],
  },
};

/* ── 代理数据 ─────────────────────────────────────────────── */
const agent: ScopeConfig = {
  noun: "代理",
  counterUnit: "位代理",
  panelTitle: "代理档案",
  panelSub: "下线、佣金与考核记录",
  taskCategories: [
    { label: "活跃代理", count: 9 },
    { label: "待跟进", count: 3 },
    { label: "待安置", count: 2 },
    { label: "已暂停", count: 1 },
  ],
  taskLists: {
    "活跃代理": [
      { title: "代理佣金月结提醒", time: "2026-07-05 16:00", status: "待处理", unread: 3 },
      { title: "代理培训 · 进阶课跟进", time: "2026-07-04 14:00", status: "进行中", unread: 1 },
    ],
    "待跟进": [
      { title: "新代理入驻审核", time: "2026-07-05 10:00", status: "待处理", unread: 2 },
      { title: "代理问题回访 · 王强", time: "2026-07-03 15:00", status: "待处理", unread: 1 },
    ],
    "待安置": [
      { title: "待分配代理 · 王强", time: "2026-07-02 11:00", status: "待处理", unread: 1 },
    ],
    "已暂停": [
      { title: "违规代理处理 · 李某", time: "2026-06-28 09:00", status: "已完成", unread: 0 },
    ],
  },
  rankingTabs: ["业绩排行", "招募排行", "新增代理", "全部代理"],
  filterChips: ["全部", "活跃", "待跟进", "待安置"],
  columns: [
    { label: "代理名称", key: "agentName", width: 96, tone: "name" },
    { label: "代理等级", key: "agentLevel", width: 72, tone: "muted" },
    { label: "负责区域", key: "region", width: 86, tone: "muted" },
    { label: "下线会员数", key: "downlineMembers", width: 68, tone: "bold" },
    { label: "下线会员授权", key: "authorizedMembers", width: 62, tone: "text" },
    { label: "下线会员账号绑定", key: "boundMembers", width: 62, tone: "text" },
    { label: "下线会员消费", key: "consumingMembers", width: 62, tone: "text" },
    { label: "订单数量", key: "orderCount", width: 62, tone: "text" },
    { label: "交易额", key: "transactionAmount", width: 82, tone: "bold" },
    { label: "累计佣金", key: "commission", width: 76, tone: "bold" },
    { label: "代理留存", key: "retentionRate", width: 68, tone: "text" },
    { label: "培训完成", key: "trainingProgress", width: 68, tone: "text" },
    { label: "考核达成", key: "assessmentRate", width: 68, tone: "text" },
    { label: "运营阶段", key: "operationStage", width: 72, tone: "muted" },
    { label: "下一步动作", key: "nextAction", width: 128, tone: "text" },
  ],
  rows: [
    { rank: 1, name: "皮卡丘", initial: "皮", filter: "活跃", agentId: "agent_001", data: { agentName: "皮卡丘", agentLevel: "D2 核心合伙人", region: "北京-朝阳", downlineMembers: "326", authorizedMembers: "286", boundMembers: "248", consumingMembers: "194", orderCount: "412", transactionAmount: "¥286,400", commission: "¥42,600", retentionRate: "94%", trainingProgress: "6 / 6", assessmentRate: "92%", operationStage: "增长", nextAction: "发展新代理并促复购" } },
    { rank: 2, name: "文泽", initial: "文", filter: "活跃", agentId: "agent_002", data: { agentName: "文泽", agentLevel: "D3 事业合伙人", region: "北京-海淀", downlineMembers: "284", authorizedMembers: "244", boundMembers: "208", consumingMembers: "162", orderCount: "336", transactionAmount: "¥224,800", commission: "¥38,200", retentionRate: "91%", trainingProgress: "5 / 6", assessmentRate: "88%", operationStage: "转化", nextAction: "跟进授权未绑定会员" } },
    { rank: 3, name: "梓几", initial: "梓", filter: "活跃", agentId: "agent_003", data: { agentName: "梓几", agentLevel: "D4 分公司负责人", region: "北京-西城", downlineMembers: "196", authorizedMembers: "158", boundMembers: "126", consumingMembers: "102", orderCount: "218", transactionAmount: "¥142,600", commission: "¥21,400", retentionRate: "86%", trainingProgress: "4 / 6", assessmentRate: "84%", operationStage: "复购", nextAction: "提升已消费会员复购" } },
    { rank: 4, name: "海槽", initial: "海", filter: "待跟进", agentId: "agent_004", data: { agentName: "海槽", agentLevel: "D5 分公司合伙人", region: "北京-东城", downlineMembers: "152", authorizedMembers: "118", boundMembers: "86", consumingMembers: "64", orderCount: "126", transactionAmount: "¥86,400", commission: "¥16,800", retentionRate: "72%", trainingProgress: "3 / 6", assessmentRate: "76%", operationStage: "激活", nextAction: "完成培训补交与会员唤醒" } },
    { rank: 5, name: "王强", initial: "王", filter: "待安置", agentId: "agent_005", data: { agentName: "王强", agentLevel: "D6 城市团长", region: "北京-通州", downlineMembers: "0", authorizedMembers: "0", boundMembers: "0", consumingMembers: "0", orderCount: "0", transactionAmount: "¥0", commission: "¥0", retentionRate: "—", trainingProgress: "1 / 6", assessmentRate: "42%", operationStage: "启动", nextAction: "完成首批会员授权绑定" } },
  ],
  tree: {
    name: "总部",
    children: [
      { name: "皮卡丘(326人)", children: [
        { name: "盛光年(80人)", children: [] },
        { name: "文泽(54人)", children: [] },
      ] },
      { name: "文泽(284人)", children: [{ name: "梓几(42人)", children: [] }] },
      { name: "梓几(196人)", children: [{ name: "海槽(31人)", children: [] }] },
    ],
  },
  operations: [
    { id: "issue", label: "问题登记", icon: MessageSquare, button: "登记并指派" },
    { id: "push", label: "佣金结算", icon: Send, button: "发起结算" },
    { id: "activity", label: "代理培训", icon: CalendarDays, button: "安排培训" },
    { id: "moments", label: "考核登记", icon: ClipboardCheck, button: "登记考核" },
  ],
  profileTags: [
    { label: "D2 · 核心合伙人", background: "#fff0db", color: "#e77800" },
    { label: "业绩Top1", background: "#effed4", color: "#253800" },
    { label: "高活跃", background: "#e8fbf4", color: "#00a978" },
  ],
  profileSub: "D2 核心合伙人 · 北京 · 正常",
  profileFields: [
    ["代理编号", "A-00002"], ["代理等级", "D2 核心合伙人"],
    ["负责区域", "北京"], ["加入时间", "2026-02-20"],
    ["下线会员", "326 人"], ["本月招募", "18 人"],
    ["培训完成", "6 / 6 门"], ["代理状态", "正常"],
  ],
  summary: [
    ["下线会员", "326 人", "#2385c8"], ["本月招募", "18 人", "#00a978"],
    ["累计佣金", "¥42.6K", "#e77800"], ["考核达成", "92%", "#253800"],
  ],
  metrics: [
    ["业绩完成", "112%", "#00a978"], ["招募进度", "90%", "#253800"],
    ["培训完成", "100%", "#00a978"], ["考核评级", "A级", "#7445d8"],
  ],
  profileTabs: ["下线会员", "佣金记录", "考核指标", "培训记录"],
  profileRecords: {
    "下线会员": [
      { title: "盛光年", desc: "下线 80 人 · 高活跃", status: "正常" },
      { title: "文泽", desc: "下线 54 人 · 活跃", status: "正常" },
      { title: "梓几", desc: "下线 42 人 · 一般", status: "待激活" },
    ],
    "佣金记录": [
      { title: "9 月佣金", desc: "¥8,200 · 18 单招募奖励", status: "待结算" },
      { title: "8 月佣金", desc: "¥7,600 · 15 单招募奖励", status: "已结算" },
    ],
    "考核指标": [
      { title: "招募任务", desc: "18 / 20 人", status: "90%" },
      { title: "下线活跃", desc: "92% 活跃率", status: "达标" },
      { title: "合规检查", desc: "无违规记录", status: "100%" },
    ],
    "培训记录": [],
  },
};

const content: ScopeConfig = {
  ...community,
  noun: "内容与触达",
  counterUnit: "条触达计划",
  panelTitle: "触达计划详情",
  panelSub: "内容、渠道、受众与执行状态",
  taskCategories: [{ label: "待审核", count: 4 }, { label: "待发布", count: 6 }, { label: "待回填", count: 3 }, { label: "异常计划", count: 1 }],
  taskLists: {
    "待审核": [{ title: "秋季复购活动 · 群发内容审核", time: "2026-09-29 14:30", status: "待处理", unread: 2 }],
    "待发布": [{ title: "服务老师案例 · 朋友圈计划", time: "2026-09-29 18:30", status: "待发布", unread: 0 }],
    "待回填": [{ title: "周末直播提醒 · 发布证据回填", time: "2026-09-29 20:00", status: "待处理", unread: 1 }],
    "异常计划": [{ title: "广州体验官群 · 执行账号失效", time: "2026-09-29 10:00", status: "待处理", unread: 1 }],
  },
  rankingTabs: ["全部计划", "微信群发", "朋友圈", "社群公告", "待审核"],
  filterChips: ["全部", "待审核", "待发布", "已排期"],
  columns: [{ label: "内容", width: 130, tone: "name" }, { label: "渠道", width: 90 }, { label: "目标群 / 人群", width: 150 }, { label: "执行账号", width: 90 }, { label: "发布时间", width: 110 }, { label: "状态", width: 80 }],
  rows: [{ rank: 1, name: "秋季复购活动", initial: "秋", filter: "待发布", cells: ["秋季复购活动", "微信群发", "3 个会员群", "FLM001", "今日 20:00", "待发布"] }, { rank: 2, name: "服务老师案例", initial: "服", filter: "待审核", cells: ["服务老师案例", "朋友圈", "高价值会员", "林小燕", "今日 18:30", "待审核"] }, { rank: 3, name: "周末直播提醒", initial: "直", filter: "已排期", cells: ["周末直播提醒", "社群公告", "AI 学习社 6 群", "课程企微", "明日 10:00", "已排期"] }],
  operations: [{ id: "issue", label: "编辑内容", icon: MessageSquare, button: "保存草稿" }, { id: "push", label: "发布触达", icon: Send, button: "提交发布" }, { id: "activity", label: "关联活动", icon: CalendarDays, button: "关联活动" }, { id: "moments", label: "朋友圈计划", icon: ClipboardCheck, button: "创建计划" }],
  profileTabs: ["概览", "素材", "触达记录", "审批记录"],
};

const activity: ScopeConfig = {
  ...community,
  noun: "运营活动",
  counterUnit: "场活动",
  panelTitle: "活动详情",
  panelSub: "报名、触达、活动群与转化任务",
  taskCategories: [{ label: "进行中", count: 3 }, { label: "待发布", count: 4 }, { label: "报名中", count: 5 }, { label: "待复盘", count: 2 }],
  taskLists: { "进行中": [{ title: "社群秋季复购 · 报名提醒", time: "2026-09-29 16:00", status: "进行中", unread: 2 }], "待发布": [{ title: "国庆用户关怀 · 待发通知", time: "2026-09-30 09:00", status: "待处理", unread: 1 }], "报名中": [{ title: "团长成长直播 · 报名审核", time: "2026-09-29 18:00", status: "待处理", unread: 3 }], "待复盘": [{ title: "AI 训练营开营 · 效果复盘", time: "2026-09-30 10:00", status: "待处理", unread: 0 }] },
  rankingTabs: ["全部活动", "进行中", "待发布", "报名中", "待复盘"],
  filterChips: ["全部", "进行中", "报名中", "待复盘"],
  columns: [{ label: "活动", width: 140, tone: "name" }, { label: "项目", width: 90 }, { label: "目标对象", width: 130 }, { label: "报名 / 到场", width: 95 }, { label: "负责人", width: 80 }, { label: "状态", width: 80 }],
  rows: [{ rank: 1, name: "社群秋季复购", initial: "秋", filter: "进行中", cells: ["社群秋季复购", "PRO会员", "3 个会员群", "86 / 42", "林小燕", "进行中"] }, { rank: 2, name: "团长成长直播", initial: "团", filter: "报名中", cells: ["团长成长直播", "一级代理", "团长与代理", "124 / --", "陈明", "报名中"] }, { rank: 3, name: "国庆用户关怀", initial: "国", filter: "待复盘", cells: ["国庆用户关怀", "体验官", "指定标签会员", "-- / --", "吴思远", "待发布"] }],
  operations: [{ id: "issue", label: "编辑活动", icon: MessageSquare, button: "保存活动" }, { id: "push", label: "活动通知", icon: Send, button: "发布通知" }, { id: "activity", label: "报名管理", icon: CalendarDays, button: "查看报名" }, { id: "moments", label: "活动复盘", icon: ClipboardCheck, button: "创建复盘" }],
  profileTabs: ["概览", "报名用户", "活动任务", "复盘记录"],
};

const results: ScopeConfig = {
  ...community,
  noun: "运营结果",
  counterUnit: "项结果",
  panelTitle: "运营结果详情",
  panelSub: "内容、社群、活动与人员效果归因",
  taskCategories: [{ label: "待确认", count: 3 }, { label: "待优化", count: 5 }, { label: "异常结果", count: 2 }, { label: "最佳实践", count: 4 }],
  taskLists: { "待确认": [{ title: "秋季复购群发 · 复盘确认", time: "2026-09-29 21:00", status: "待处理", unread: 1 }], "待优化": [{ title: "服务老师案例 · 阅读率偏低", time: "2026-09-29 18:40", status: "待处理", unread: 0 }], "异常结果": [{ title: "AI 学习社训练营 · 群健康下降", time: "2026-09-29 15:00", status: "待处理", unread: 2 }], "最佳实践": [{ title: "北京 PRO会员群 · 高转化内容", time: "2026-09-29 12:00", status: "已完成", unread: 0 }] },
  rankingTabs: ["触达效果", "社群健康", "入群转化", "活动转化", "人员绩效"],
  filterChips: ["全部", "待优化", "异常", "最佳实践"],
  columns: [{ label: "复盘对象", width: 140, tone: "name" }, { label: "覆盖对象", width: 130 }, { label: "指标", width: 80 }, { label: "结果", width: 80, tone: "bold" }, { label: "趋势", width: 70 }, { label: "处理建议", width: 120 }],
  rows: [{ rank: 1, name: "秋季复购群发", initial: "秋", filter: "最佳实践", cells: ["秋季复购群发", "3 个群 / 842 人", "阅读率", "68%", "+8.2%", "复用内容"] }, { rank: 2, name: "北京 PRO会员群", initial: "北", filter: "待优化", cells: ["北京 PRO会员群", "487 位成员", "群健康分", "82", "-3", "启用备用群"] }, { rank: 3, name: "体验官入群流程", initial: "体", filter: "异常", cells: ["体验官入群流程", "126 位新会员", "入群转化", "74%", "+6%", "跟进待入群"] }],
  operations: [{ id: "issue", label: "查看归因", icon: MessageSquare, button: "确认归因" }, { id: "push", label: "创建优化", icon: Send, button: "创建任务" }, { id: "activity", label: "复盘任务", icon: CalendarDays, button: "发起复盘" }, { id: "moments", label: "复用内容", icon: ClipboardCheck, button: "复制方案" }],
  profileTabs: ["概览", "归因分析", "优化任务", "历史结果"],
};

export const SCOPE_CONFIGS: Record<Exclude<DataScope, "members">, ScopeConfig> = { community, project, agent };
