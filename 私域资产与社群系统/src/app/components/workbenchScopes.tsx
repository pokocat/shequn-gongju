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
export type ScopeColumn = { label: string; width: number; tone?: "name" | "bold" | "muted" | "text" };
export type ScopeRow = { rank: number; name: string; initial: string; filter: string; cells: string[] };
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
    { label: "群名", width: 128, tone: "name" },
    { label: "群主", width: 70, tone: "text" },
    { label: "类型", width: 64, tone: "muted" },
    { label: "城市", width: 86, tone: "muted" },
    { label: "人数", width: 60, tone: "bold" },
    { label: "今日消息", width: 72, tone: "text" },
    { label: "活跃度", width: 64, tone: "bold" },
    { label: "进群率", width: 64, tone: "text" },
    { label: "状态", width: 54, tone: "muted" },
  ],
  rows: [
    { rank: 1, name: "北京PRO会员群1群", initial: "员", filter: "活跃", cells: ["北京PRO会员群1群", "盛光年", "会员群", "北京-朝阳", "486", "1,203", "92%", "96%", "正常"] },
    { rank: 2, name: "朝阳体验官交流群", initial: "体", filter: "活跃", cells: ["朝阳体验官交流群", "皮卡丘", "体验群", "北京-朝阳", "412", "856", "84%", "91%", "正常"] },
    { rank: 3, name: "海淀会员服务群", initial: "服", filter: "活跃", cells: ["海淀会员服务群", "文泽", "服务群", "北京-海淀", "365", "642", "78%", "88%", "正常"] },
    { rank: 4, name: "西城冷启动群", initial: "冷", filter: "预警", cells: ["西城冷启动群", "梓几", "冷启动", "北京-西城", "218", "96", "41%", "62%", "预警"] },
    { rank: 5, name: "东城打卡群", initial: "打", filter: "沉寂", cells: ["东城打卡群", "海槽", "打卡群", "北京-东城", "154", "45", "33%", "55%", "沉寂"] },
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
  profileSub: "群主 盛光年 · 会员群",
  profileFields: [
    ["群编号", "G-00001"], ["群类型", "会员群"],
    ["群主", "盛光年"], ["所属项目", "会员项目"],
    ["当前人数", "486"], ["群容量", "500"],
    ["建群时间", "2026-03-12"], ["群状态", "正常"],
  ],
  summary: [
    ["成员", "486 人", "#2385c8"], ["今日消息", "1,203", "#00a978"],
    ["本周新增", "+12 人", "#00a978"], ["活跃度", "92%", "#253800"],
  ],
  metrics: [
    ["活跃度", "92%", "#00a978"], ["进群率", "96%", "#00a978"],
    ["退群率", "1.2%", "#00a978"], ["群质量", "A级", "#7445d8"],
  ],
  profileTabs: ["群公告", "群成员", "群活动", "操作记录"],
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
    { label: "全部项目", count: 6 },
    { label: "运营中", count: 4 },
    { label: "孵化中", count: 1 },
    { label: "待启动", count: 1 },
  ],
  taskLists: {
    "全部项目": [
      { title: "会员项目 · 周复盘整理", time: "2026-07-05 15:00", status: "待处理", unread: 2 },
      { title: "PRO会员 · 续费冲刺", time: "2026-07-04 10:00", status: "进行中", unread: 3 },
      { title: "体验官项目 · 拉新投放", time: "2026-07-03 09:00", status: "进行中", unread: 1 },
    ],
    "运营中": [
      { title: "PRO会员 · 续费冲刺", time: "2026-07-04 10:00", status: "进行中", unread: 3 },
      { title: "体验官项目 · 拉新投放", time: "2026-07-03 09:00", status: "进行中", unread: 1 },
    ],
    "孵化中": [
      { title: "训练营项目 · 课程筹备", time: "2026-07-06 09:30", status: "待处理", unread: 1 },
    ],
    "待启动": [
      { title: "秋季新项目 · 立项规划", time: "2026-07-10 10:00", status: "待处理", unread: 0 },
    ],
  },
  rankingTabs: ["收益排行", "增长排行", "会员规模", "全部项目"],
  filterChips: ["全部", "运营中", "孵化中", "待启动"],
  columns: [
    { label: "项目名", width: 110, tone: "name" },
    { label: "状态", width: 60, tone: "muted" },
    { label: "会员数", width: 64, tone: "bold" },
    { label: "群数", width: 52, tone: "text" },
    { label: "本月收益", width: 84, tone: "bold" },
    { label: "转化率", width: 60, tone: "text" },
    { label: "负责人", width: 70, tone: "muted" },
    { label: "城市", width: 76, tone: "muted" },
  ],
  rows: [
    { rank: 1, name: "会员项目", initial: "会", filter: "运营中", cells: ["会员项目", "运营中", "8,023", "12", "¥286,400", "68%", "吴思远", "北京"] },
    { rank: 2, name: "PRO会员项目", initial: "P", filter: "运营中", cells: ["PRO会员项目", "运营中", "6,544", "9", "¥212,800", "62%", "林小燕", "北京"] },
    { rank: 3, name: "体验官项目", initial: "体", filter: "运营中", cells: ["体验官项目", "运营中", "5,231", "7", "¥96,200", "54%", "吴思远", "上海"] },
    { rank: 4, name: "训练营项目", initial: "训", filter: "孵化中", cells: ["训练营项目", "孵化中", "1,102", "3", "¥18,400", "38%", "林小燕", "广州"] },
    { rank: 5, name: "秋季新项目", initial: "秋", filter: "待启动", cells: ["秋季新项目", "待启动", "0", "0", "—", "—", "待定", "深圳"] },
  ],
  tree: {
    name: "会员项目",
    children: [
      { name: "北京PRO会员群1群(486人)", children: [
        { name: "会员(302人)", children: [] },
        { name: "体验官(118人)", children: [] },
      ] },
      { name: "朝阳体验官交流群(412人)", children: [{ name: "体验官(203人)", children: [] }] },
      { name: "海淀会员服务群(365人)", children: [{ name: "会员(210人)", children: [] }] },
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
  profileSub: "负责人 吴思远 · 北京",
  profileFields: [
    ["项目编号", "P-00001"], ["项目状态", "运营中"],
    ["负责人", "吴思远"], ["覆盖城市", "12 城"],
    ["会员数", "8,023"], ["社群数", "12 群"],
    ["启动时间", "2026-01-15"], ["本月收益", "¥286,400"],
  ],
  summary: [
    ["会员", "8,023 人", "#2385c8"], ["社群", "12 群", "#00a978"],
    ["本月新增", "+412 人", "#00a978"], ["本月收益", "¥286.4K", "#e77800"],
  ],
  metrics: [
    ["目标完成", "86%", "#00a978"], ["会员增长", "+5.2%", "#00a978"],
    ["转化率", "68%", "#253800"], ["健康度", "A", "#7445d8"],
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
    { label: "代理名", width: 96, tone: "name" },
    { label: "等级", width: 54, tone: "muted" },
    { label: "城市", width: 86, tone: "muted" },
    { label: "下线会员", width: 68, tone: "bold" },
    { label: "本月招募", width: 68, tone: "text" },
    { label: "累计佣金", width: 76, tone: "bold" },
    { label: "结算状态", width: 64, tone: "text" },
    { label: "状态", width: 54, tone: "muted" },
  ],
  rows: [
    { rank: 1, name: "皮卡丘", initial: "皮", filter: "活跃", cells: ["皮卡丘", "金牌", "北京-朝阳", "326", "18", "¥42,600", "已结算", "正常"] },
    { rank: 2, name: "文泽", initial: "文", filter: "活跃", cells: ["文泽", "金牌", "北京-海淀", "284", "15", "¥38,200", "已结算", "正常"] },
    { rank: 3, name: "梓几", initial: "梓", filter: "活跃", cells: ["梓几", "银牌", "北京-西城", "196", "11", "¥21,400", "待结算", "正常"] },
    { rank: 4, name: "海槽", initial: "海", filter: "待跟进", cells: ["海槽", "银牌", "北京-东城", "152", "9", "¥16,800", "已结算", "正常"] },
    { rank: 5, name: "王强", initial: "王", filter: "待安置", cells: ["王强", "新代理", "北京-通州", "0", "3", "¥0", "—", "待安置"] },
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
    { label: "金牌代理", background: "#fff0db", color: "#e77800" },
    { label: "业绩Top1", background: "#effed4", color: "#253800" },
    { label: "高活跃", background: "#e8fbf4", color: "#00a978" },
  ],
  profileSub: "金牌代理 · 北京",
  profileFields: [
    ["代理编号", "A-00002"], ["代理等级", "金牌"],
    ["负责城市", "北京"], ["加入时间", "2026-02-20"],
    ["下线会员", "326 人"], ["本月招募", "18 人"],
    ["累计佣金", "¥42,600"], ["代理状态", "正常"],
  ],
  summary: [
    ["下线会员", "326 人", "#2385c8"], ["本月招募", "18 人", "#00a978"],
    ["累计佣金", "¥42.6K", "#e77800"], ["活跃度", "高", "#253800"],
  ],
  metrics: [
    ["业绩完成", "112%", "#00a978"], ["招募进度", "90%", "#253800"],
    ["待结佣金", "¥3,200", "#e77800"], ["考核评级", "A级", "#7445d8"],
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
    "培训记录": [
      { title: "代理进阶课", desc: "9 月 1 日 · 已完成", status: "已完成" },
      { title: "首期新人培训", desc: "8 月 12 日 · 已完成", status: "已完成" },
    ],
  },
};

export const SCOPE_CONFIGS: Record<"community" | "project" | "agent", ScopeConfig> = { community, project, agent };
