import { useMemo, useEffect, useState } from "react";
import { Search, QrCode, ChevronRight, TrendingUp, Clock, Send, Plus, X, Tags, Package, Truck, MessageSquare, CalendarDays, ClipboardCheck, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, PanelTopClose, PanelTopOpen, RefreshCw, GitBranch, Users, Store, ShieldCheck, Check, History } from "lucide-react";
import { getAvatar } from "./Avatar";
import { S, useThemeSingleton } from "../theme";
import { SCOPE_CONFIGS, dataScopeOptions, type DataScope, type ScopeOperationId, type ScopeRow, type ScopeTreeNode } from "./workbenchScopes";
import { businessIdentityLabels, memberLevelForRank, memberLevelOptions, platformRoleOptions } from "../data/levelConfig";
import { calculateMemberNetworkScope, getMemberNetworkViews, memberNetworkExample, type MemberNetworkRole } from "../data/memberNetworkScope";
import { agentTrainingRecords, agentTrainingStageMeta, trainingTaskStatusMeta, trainingTasks } from "../data/agentTraining";
import { getJoinedGroupsForMember } from "../data/memberProfileGroups";
import { useProjectContext } from "../App";
// ─── 模拟数据 ─────────────────────────────────────────────────
const taskCategories = [
  { label: "今日执行", count: 9 },
  { label: "全部待办", count: 12, active: true },
  { label: "客户关系", count: 3 },
  { label: "订单履约", count: 2 },
  { label: "服务工单", count: 2 },
  { label: "社群运营", count: 2 },
  { label: "结算审批", count: 1 },
  { label: "风险预警", count: 2 },
];

const profileTabs = ["概览", "订单", "官方账号任务", "运营记录", "回访"];
const orderStatusTabs = ["所有订单", "待付款", "待发货", "待收货", "已完成", "退款/换货"];
const operationTabs = [
  { id: "issue", label: "服务处置", icon: MessageSquare, button: "登记并指派" },
  { id: "push", label: "内容触达", icon: Send, button: "创建触达任务" },
  { id: "activity", label: "活动运营", icon: CalendarDays, button: "创建活动任务" },
  { id: "moments", label: "朋友圈计划", icon: ClipboardCheck, button: "创建计划" },
] as const;

const rankingData = [
  { rank: 1,  avatar: "盛", name: "盛光年", wechat: "THEv424",  gender: "男", city: "北京-朝阳", job: "工人-工地", inGroup: "是", pendingCount: 80, publishCount: 80, completedCount: 91, totalUsers: 8023, influence: 3510, score: 4858, referrer: "盛光年" },
  { rank: 2,  avatar: "皮", name: "皮卡丘", wechat: "imp11",    gender: "男", city: "北京-海淀", job: "工人-工地", inGroup: "是", pendingCount: 71, publishCount: 91, completedCount: 54, totalUsers: 6544, influence: 2877, score: 3918, referrer: "皮卡丘" },
  { rank: 3,  avatar: "文", name: "文泽",   wechat: "FLM001",  gender: "男", city: "北京-朝阳", job: "工人-工地", inGroup: "是", pendingCount: 47, publishCount: 21, completedCount: 84, totalUsers: 5231, influence: 2104, score: 2976, referrer: "皮卡丘" },
  { rank: 4,  avatar: "梓", name: "梓几",   wechat: "afs612",  gender: "男", city: "北京-西城", job: "工人-工地", inGroup: "是", pendingCount: 37, publishCount: 44, completedCount: 27, totalUsers: 4102, influence: 1754, score: 2341, referrer: "文泽" },
  { rank: 5,  avatar: "海", name: "海槽",   wechat: "125gfs",  gender: "男", city: "北京-东城", job: "工人-工地", inGroup: "是", pendingCount: 29, publishCount: 38, completedCount: 63, totalUsers: 3788, influence: 1432, score: 2109, referrer: "皮卡丘" },
];

type MemberTag = { label: string; background: string; color: string };

const defaultMemberTags: MemberTag[] = [
  { label: "高影响力", background: "#e2f3ff", color: "#2385c8" },
  { label: "PRO会员", background: "#effed4", color: "#253800" },
  { label: "高价值客户", background: "#fff0db", color: "#e77800" },
  { label: "潜在升级", background: "#efe6ff", color: "#7445d8" },
];

const tagColorOptions = [
  { background: "#e2f3ff", color: "#2385c8" },
  { background: "#effed4", color: "#253800" },
  { background: "#fff0db", color: "#e77800" },
  { background: "#efe6ff", color: "#7445d8" },
  { background: "#e8fbf4", color: "#00a978" },
];

const initialMemberTags: Record<number, MemberTag[]> = {
  1: defaultMemberTags,
  2: [
    { label: "高影响力", background: "#e2f3ff", color: "#2385c8" },
    { label: "PRO会员", background: "#effed4", color: "#253800" },
    { label: "复购关注", background: "#fff0db", color: "#e77800" },
  ],
  3: [
    { label: "潜在升级", background: "#efe6ff", color: "#7445d8" },
    { label: "活跃互动", background: "#e8fbf4", color: "#00a978" },
  ],
  4: [
    { label: "待回访", background: "#fff0db", color: "#e77800" },
    { label: "新会员", background: "#e2f3ff", color: "#2385c8" },
  ],
  5: [
    { label: "高价值客户", background: "#fff0db", color: "#e77800" },
    { label: "社群活跃", background: "#e8fbf4", color: "#00a978" },
  ],
};

type TaskEntry = { title: string; time: string; status: string; unread: number; source: string; action: string };
const taskSideList: TaskEntry[] = [
  { title: "盛光年 · 个微好友申请待确认", time: "2026-07-05 14:30", status: "待处理", unread: 1, source: "企微 SCRM", action: "确认关系" },
  { title: "ORD-202607-01842 · 待收货回访", time: "2026-07-05 13:00", status: "待处理", unread: 0, source: "商城订单", action: "发起回访" },
  { title: "售后工单 · 退款咨询待指派", time: "2026-07-05 11:20", status: "待处理", unread: 2, source: "客户服务", action: "指派处理" },
  { title: "北京 PRO 会员群 · 群公告待发布", time: "2026-07-05 10:00", status: "进行中", unread: 0, source: "社群运营", action: "发布公告" },
  { title: "团长佣金结算单 · 待负责人审批", time: "2026-07-05 09:30", status: "待处理", unread: 1, source: "佣金结算", action: "查看审批" },
];

const taskLists: Record<string, TaskEntry[]> = {
  "今日执行": [taskSideList[0], taskSideList[1], taskSideList[3], { title: "12 位会员 · 待入群分配", time: "2026-07-05 15:30", status: "待处理", unread: 0, source: "入群分配", action: "分配入群" }],
  "全部待办": taskSideList,
  "客户关系": [taskSideList[0], { title: "皮卡丘 · 企业微信待添加", time: "2026-07-05 12:10", status: "待处理", unread: 0, source: "企微 SCRM", action: "发起添加" }],
  "订单履约": [taskSideList[1], { title: "ORD-202607-01818 · 退款申请待处理", time: "2026-07-05 10:40", status: "待处理", unread: 1, source: "商城订单", action: "处理退款" }],
  "服务工单": [taskSideList[2], { title: "服务工单 · 课程咨询即将超时", time: "2026-07-05 09:50", status: "进行中", unread: 1, source: "客户服务", action: "催办" }],
  "社群运营": [taskSideList[3], { title: "朝阳体验官群 · 新成员待分配", time: "2026-07-05 09:20", status: "待处理", unread: 0, source: "社群运营", action: "分配服务官" }],
  "结算审批": [taskSideList[4]],
  "风险预警": [{ title: "梓几 · 个微添加失败需复核", time: "2026-07-05 08:50", status: "待处理", unread: 1, source: "企微 SCRM", action: "查看风险" }, { title: "西城冷启动群 · 活跃度低于阈值", time: "2026-07-05 08:30", status: "待处理", unread: 0, source: "社群运营", action: "创建激活任务" }],
};

const memberOrders = [
  {
    no: "ORD-202607-01842", date: "2026-07-03 12:10", amount: "¥2,480", discount: "¥500", status: "待收货", serviceStatus: "待回访",
    product: "续费 PRO 年卡", qty: "1 件", payment: "微信支付", source: "会员运营工作台", followUp: "服务老师：吴思远", logistics: "SF128346821484695215",
    items: [
      { name: "PRO 会员年卡", spec: "1 年权益", price: "¥2,480", quantity: "x1", tone: "#e8fbf4" },
      { name: "会员成长礼包", spec: "电子权益", price: "¥0", quantity: "x1", tone: "#effed4" },
    ],
  },
  {
    no: "ORD-202603-00419", date: "2026-03-15 10:30", amount: "¥2,980", discount: "¥0", status: "已完成", serviceStatus: "已回访",
    product: "PRO 会员年卡", qty: "1 件", payment: "微信支付", source: "会员小程序", followUp: "已完成首次回访", logistics: "电子权益已到账",
    items: [{ name: "PRO 会员年卡", spec: "1 年权益", price: "¥2,980", quantity: "x1", tone: "#e2f3ff" }],
  },
];

const activityFeed = [
  {
    id: "TX2024064487489275",
    time: "2021-06-21 22:51:02",
    type: "朋友圈发布",
    content: "刚打完球非常爽，明天继续！",
    images: 2,
    likes: 73,
    comments: 4,
    shares: 0,
  },
  {
    id: "TX2024064487489276",
    time: "2021-06-20 18:23:11",
    type: "任务完成",
    content: "完成晒单任务，已截图上传",
    images: 1,
    likes: 41,
    comments: 2,
    shares: 1,
  },
  {
    id: "TX2024064487489277",
    time: "2021-06-19 09:00:00",
    type: "朋友圈发布",
    content: "今天天气真好，出门运动！推荐大家也来试试这个健康生活方式",
    images: 3,
    likes: 126,
    comments: 8,
    shares: 5,
  },
];

// 关系树节点
type RelationNode = {
  name: string;
  level: number;
  memberName?: string;
  wechatId?: string;
  identity?: string;
  memberLevel?: string;
  avatarIndex?: number;
  children: RelationNode[];
};
const relationTree: RelationNode = {
  name: "皮卡丘", level: 1, memberName: "钱军", wechatId: "imp11", identity: "会员推荐人", memberLevel: "PRO会员", avatarIndex: 1,
  children: [
    {
      name: "盛光年", level: 2, memberName: "程涛", wechatId: "THEv424", identity: "群主", memberLevel: "PRO会员", avatarIndex: 0,
      children: [
        { name: "文泽", level: 3, memberName: "文泽", wechatId: "FLM001", identity: "服务老师", memberLevel: "体验官", avatarIndex: 2, children: [
          { name: "会员产品(0人)", level: 4, identity: "空分支", children: [] },
          { name: "会员体验(0人)", level: 4, identity: "空分支", children: [] },
        ] },
        { name: "梓几", level: 3, memberName: "许明", wechatId: "afs612", identity: "会员", memberLevel: "普通会员", avatarIndex: 3, children: [
          { name: "梓几(0人)", level: 4, identity: "空分支", children: [] },
        ] },
      ]
    },
    { name: "海槽", level: 2, memberName: "彭丽", wechatId: "125gfs", identity: "社群成员", memberLevel: "体验官", avatarIndex: 4, children: [{ name: "海槽(0人)", level: 4, identity: "空分支", children: [] }] },
  ]
};

function TreeNode({ node, depth = 0 }: { node: RelationNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  return (
    <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      <div
        className="flex items-center gap-1.5 py-1 cursor-pointer px-1"
        style={{
          background: depth === 0 ? S.accentLight : "transparent",
          borderRadius: S.radiusSm,
          borderLeft: depth === 0 ? `2px solid ${S.accent}` : "2px solid transparent",
        }}
        onClick={() => setOpen(v => !v)}
      >
        {hasChildren && (
          <ChevronRight size={12} style={{ color: S.muted, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
     )}
        {!hasChildren && <div style={{ width: 12 }} />}
        {node.memberName ? <div className="flex flex-col items-center gap-px flex-shrink-0"><img src={getAvatar(node.avatarIndex || 0)} alt={node.name} className="w-5 h-5" style={{ borderRadius: "50%", objectFit: "cover" }} />{node.memberLevel && <span className="px-0.5 text-[7px] leading-3 font-bold whitespace-nowrap" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: "999px" }}>{node.memberLevel}</span>}</div> : <div className="w-2 h-2 flex-shrink-0" style={{ background: depth === 0 ? S.accent : S.mutedLight, borderRadius: "50%" }} />}
        <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold" style={{ color: depth === 0 ? S.text : S.textSec }}>{node.name}</span>
          {node.memberName && node.memberName !== node.name && <span className="text-[10px]" style={{ color: S.muted }}>· {node.memberName}</span>}
          {node.identity && <span className="px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "#e8fbf4", color: "#008565", borderRadius: "999px" }}>{node.identity}</span>}
        </div>
      </div>
      {open && hasChildren && (
        <div style={{ borderLeft: `1px dashed ${S.border}`, marginLeft: 5 }}>
          {node.children.map((c, i) => <TreeNode key={i} node={c} depth={depth + 1} />)}
        </div>
      )}

    </div>
  );
}

const taskStatusStyle = (status: string) => {
  if (status === "已完成") return { bg: S.accent, color: S.onAccent };
  if (status === "进行中") return { bg: "#f1f5f9", color: "#475569" };
  return { bg: "#3b82f6", color: "#ffffff" };
};
const relationshipForRank = (rank: number) => [
  { personal: "已通过", enterprise: "已通过", group: "已入群", spend: "¥12,840", ai: "一致" },
  { personal: "已通过", enterprise: "待添加", group: "待入群", spend: "¥7,640", ai: "待确认" },
  { personal: "已申请", enterprise: "已通过", group: "已入群", spend: "¥3,200", ai: "一致" },
  { personal: "无法添加", enterprise: "未添加", group: "已退出", spend: "¥1,680", ai: "冲突" },
  { personal: "已通过", enterprise: "已通过", group: "已入群", spend: "¥890", ai: "一致" },
][rank - 1] || { personal: "未添加", enterprise: "未添加", group: "未分配群", spend: "¥0", ai: "待确认" };
type RelationshipRecord = ReturnType<typeof relationshipForRank>;
const groupStatusOptions = ["未分配群", "待入群", "已入群", "已退出"];

type ManualActionLog = { action: string; operator: string; at: string; status: string };
type ManualServiceAction = { count: number; status: "未操作" | "已操作" | "已完成"; operator: string; at: string; logs: ManualActionLog[] };
type RelationshipTaskType = "主动添加" | "引导添加" | "引导关注" | "邀请入群";
type RelationshipTaskStatus = "未添加" | "未关注" | "已申请" | "已通过" | "已拒绝" | "已拉黑" | "无法添加" | "未分配群" | "待入群" | "已入群" | "已退出";
type OfficialAccountTask = { id: string; label: string; taskType: RelationshipTaskType; objectiveStatus: RelationshipTaskStatus; aiStatus: "已同步" | "待核验" | "同步异常"; statusOptions: RelationshipTaskStatus[]; manual: ManualServiceAction };
type MemberServiceData = {
  accounts: OfficialAccountTask[];
  actions: Record<string, ManualServiceAction>;
  projects: Array<{ name: string; detail: string; status: string; source: string }>;
  ai: { status: "已完成" | "更新中" | "待更新"; checked: number; passed: number; pending: number; abnormal: number; updatedAt: string; device: string };
};
const emptyManualAction = (): ManualServiceAction => ({ count: 0, status: "未操作", operator: "—", at: "—", logs: [] });
const contactStatusOptions: RelationshipTaskStatus[] = ["未添加", "已申请", "已通过", "已拒绝", "已拉黑", "无法添加"];
const followStatusOptions: RelationshipTaskStatus[] = ["未关注", "已通过", "已拒绝", "已拉黑", "无法添加"];
const groupTaskStatusOptions: RelationshipTaskStatus[] = ["未分配群", "待入群", "已入群", "已退出", "无法添加"];
const normalizeTaskStatus = (status: RelationshipTaskStatus, options: RelationshipTaskStatus[]) => options.includes(status) ? status : options[0];
const memberServiceDataForRank = (rank: number): MemberServiceData => {
  const taskDefinitions: Array<{ label: string; taskType: RelationshipTaskType; statusOptions: RelationshipTaskStatus[] }> = [
    { label: "创始人个微", taskType: "主动添加", statusOptions: contactStatusOptions },
    { label: "服务官个微", taskType: "主动添加", statusOptions: contactStatusOptions },
    { label: "服务官企微", taskType: "引导添加", statusOptions: contactStatusOptions },
    { label: "素材号个微", taskType: "引导添加", statusOptions: contactStatusOptions },
    { label: "官方公众号", taskType: "引导关注", statusOptions: followStatusOptions },
    { label: "官方小程序", taskType: "引导关注", statusOptions: followStatusOptions },
    { label: "官方视频号", taskType: "引导关注", statusOptions: followStatusOptions },
    { label: "会员服务群", taskType: "邀请入群", statusOptions: groupTaskStatusOptions },
  ];
  const statusSeeds: RelationshipTaskStatus[] = ["已通过", "未添加", "已申请", "未关注", "无法添加", "已通过", "未关注", "待入群"];
  const accounts = taskDefinitions.map((definition, index) => ({
    id: `official-${index + 1}`,
    label: definition.label,
    taskType: definition.taskType,
    objectiveStatus: definition.taskType === "邀请入群"
      ? normalizeTaskStatus(relationshipForRank(rank).group, definition.statusOptions)
      : normalizeTaskStatus(statusSeeds[(rank + index) % statusSeeds.length] === "未关注" && definition.taskType !== "引导关注" ? "未添加" : statusSeeds[(rank + index) % statusSeeds.length], definition.statusOptions),
    aiStatus: index === 3 && rank % 2 === 0 ? "待核验" as const : index === 6 && rank === 4 ? "同步异常" as const : "已同步" as const,
    statusOptions: definition.statusOptions,
    manual: emptyManualAction(),
  }));
  const checked = accounts.filter(account => account.aiStatus !== "待核验").length;
  const passed = accounts.filter(account => account.objectiveStatus === "已通过" || account.objectiveStatus === "已入群").length;
  return {
    accounts,
    actions: { personal: emptyManualAction(), enterprise: emptyManualAction(), group: emptyManualAction() },
    projects: rank === 1
      ? [{ name: "PRO会员年卡", detail: "年度会员服务与专属权益", status: "生效中", source: "会员小程序" }, { name: "主理人社群", detail: "社群活动、课程与资料权益", status: "生效中", source: "社群小程序" }]
      : [{ name: "体验官计划", detail: "体验官内容与活动权益", status: "待使用", source: "主理人公社小程序" }],
    ai: { status: "已完成", checked, passed, pending: accounts.filter(account => account.aiStatus === "待核验").length, abnormal: accounts.filter(account => account.aiStatus === "同步异常").length, updatedAt: "今天 10:42", device: "AI手机-01" },
  };
};

const relationshipStatusOptions = ["未添加", "已申请", "已通过", "已拒绝", "已拉黑", "无法添加"];

type InfluenceEntityKind = "community" | "leader" | "agent";
type InfluenceRelationScope = "direct" | "development" | "recommendation";
type InfluenceEntity = {
  id: string;
  kind: InfluenceEntityKind;
  name: string;
  count: number;
  amount: string;
  description: string;
  scope: InfluenceRelationScope;
  aggregateOnly: boolean;
  parent?: string;
};

const influenceEntities: InfluenceEntity[] = [
  { id: "community-self", kind: "community", name: "我的社群", count: 12, amount: "8,023 人", description: "直接运营与服务的社群", scope: "direct", aggregateOnly: false },
  { id: "community-leader", kind: "community", name: "团长社群", count: 3, amount: "1,240 人", description: "当前团长直接运营的社群", scope: "direct", aggregateOnly: false },
  { id: "leader-direct", kind: "leader", name: "直属团长", count: 8, amount: "¥86,420", description: "直属团长推广成交贡献", scope: "direct", aggregateOnly: false, parent: "agent-self" },
  { id: "agent-self", kind: "agent", name: "当前代理", count: 1, amount: "¥128,600", description: "库存、履约与经营收益", scope: "direct", aggregateOnly: false },
  { id: "agent-child", kind: "agent", name: "发展代理", count: 2, amount: "¥64,800", description: "发展网络经营汇总", scope: "development", aggregateOnly: true },
  { id: "leader-child", kind: "leader", name: "发展网络团长", count: 5, amount: "¥42,180", description: "下属代理发展的团长聚合", scope: "development", aggregateOnly: true, parent: "agent-child" },
  { id: "community-child", kind: "community", name: "发展网络社群", count: 6, amount: "1,986 人", description: "下属团长社群聚合", scope: "development", aggregateOnly: true },
  { id: "member-recommended", kind: "community", name: "推荐网络", count: 12, amount: "4,210 人", description: "推荐人及其社群聚合", scope: "recommendation", aggregateOnly: true },
  { id: "leader-recommended", kind: "leader", name: "推荐团长", count: 4, amount: "¥31,600", description: "推荐链路团长聚合", scope: "recommendation", aggregateOnly: true },
];

const influenceKindMeta: Record<InfluenceEntityKind, { label: string; icon: typeof Users; color: string }> = {
  community: { label: "社群", icon: Users, color: "#2385c8" },
  leader: { label: "团长", icon: Store, color: "#00a978" },
  agent: { label: "代理", icon: ShieldCheck, color: "#d97706" },
};

const influenceScopeMeta: Record<InfluenceRelationScope, { label: string; description: string }> = {
  direct: { label: "直接运营", description: "可进入详情并执行允许的运营操作" },
  development: { label: "发展网络", description: "仅展示发展链路的只读聚合数据" },
  recommendation: { label: "推荐网络", description: "仅展示推荐链路的只读聚合数据" },
};

// ─── 主组件 ───────────────────────────────────────────────────
// dataScope：数据视角（会员/社群/项目/代理），切换器位于排行表格上方。
// 任务中心的基础任务（总任务）永远保留；非会员视角仅追加一个视角任务 Tab，可切换查看。
export default function InfluenceRanking() {
  useThemeSingleton();
  const { platform, project } = useProjectContext();
  const [dataScope, setDataScope] = useState<DataScope>("members");
  const isMemberScope = dataScope === "members";
  const isAgentScope = dataScope === "agent";
  const scopeCfg = isMemberScope ? null : SCOPE_CONFIGS[dataScope];
  // 任务中心数据源：basic = 基础任务（原 4 类，任何视角保留）；scope = 当前视角任务
  const [taskSource, setTaskSource] = useState<"basic" | "scope">("basic");
  const showScopeTaskTab = !isMemberScope;
  const activeCats = showScopeTaskTab && taskSource === "scope" ? scopeCfg!.taskCategories : taskCategories;
  const activeLists = showScopeTaskTab && taskSource === "scope" ? scopeCfg!.taskLists : taskLists;
  const opTabs: Array<{ id: ScopeOperationId; label: string; icon: typeof MessageSquare; button: string }> = isMemberScope ? [...operationTabs] : scopeCfg!.operations;
  const [selectedUser, setSelectedUser] = useState(rankingData[0]);
  const [selectedRow, setSelectedRow] = useState<ScopeRow | null>(null);
  const [activeTaskCategory, setActiveTaskCategory] = useState(taskCategories[0].label);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [activeTaskContext, setActiveTaskContext] = useState("全部待办");
  const [profileNotice, setProfileNotice] = useState("");
  const [memberTags, setMemberTags] = useState<Record<number, MemberTag[]>>(initialMemberTags);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
 const [activeTagFilter, setActiveTagFilter] = useState("全部");
  const [memberLevelFilter, setMemberLevelFilter] = useState("全部级别");
  const [agentLevelFilter, setAgentLevelFilter] = useState("全部身份");
  const [activeProfileTab, setActiveProfileTab] = useState(isMemberScope ? profileTabs[0] : scopeCfg!.profileTabs[0]);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [isPersonalQrOpen, setIsPersonalQrOpen] = useState(false);
  const [showProfileMore, setShowProfileMore] = useState(false);
 const [isTaskPanelCollapsed, setIsTaskPanelCollapsed] = useState(false);
  const [isRelationCollapsed, setIsRelationCollapsed] = useState(false);
  const [isOperationCollapsed, setIsOperationCollapsed] = useState(false);
  const [isDataScopeCollapsed, setIsDataScopeCollapsed] = useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [relationshipMember, setRelationshipMember] = useState<number | null>(null);
  const [relationshipDraft, setRelationshipDraft] = useState<RelationshipRecord | null>(null);
  const [relationshipOverrides, setRelationshipOverrides] = useState<Record<number, RelationshipRecord>>({});
  const [memberServiceOverrides, setMemberServiceOverrides] = useState<Record<number, MemberServiceData>>({});
  const [pendingRelationshipChanges, setPendingRelationshipChanges] = useState<Record<string, string>>({});
  const [activeLog, setActiveLog] = useState<{ name: string; label: string; key: string; rank: number } | null>(null);
  const [activeOrderStatus, setActiveOrderStatus] = useState(orderStatusTabs[0]);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string | null>(null);
  const [orderSearchInput, setOrderSearchInput] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderDateRange, setOrderDateRange] = useState("全部日期");
  const [activeOperation, setActiveOperation] = useState<(typeof operationTabs)[number]["id"]>("issue");
  const [tableSearch, setTableSearch] = useState("");
  const [editingGroupAsset, setEditingGroupAsset] = useState(false);
  const [groupAsset, setGroupAsset] = useState({
    wechat: "FLM001",
    serviceOfficer: "林小燕",
    capacity: "500",
    status: "正常",
  });
  const [influenceScope, setInfluenceScope] = useState<InfluenceRelationScope>("direct");
  const [selectedInfluenceId, setSelectedInfluenceId] = useState("community-self");
  const [operatorNotice, setOperatorNotice] = useState("");
  const influenceRole: MemberNetworkRole = isAgentScope ? "agent" : "leader";
  const memberNetworkScope = useMemo(
    () => calculateMemberNetworkScope(
      influenceRole === "agent" ? "agent-self" : "leader-direct",
      influenceRole,
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    ),
    [influenceRole],
  );
  const networkViews = useMemo(() => getMemberNetworkViews(memberNetworkScope), [memberNetworkScope]);
  const visibleInfluenceEntities = useMemo(
    () => influenceEntities.filter(entity => {
      const networkView = networkViews.find(view => view.scope === entity.scope);
      const isInNetwork = networkView?.entityIds.includes(entity.id) ?? false;
      if (!isInNetwork || entity.scope !== influenceScope) return false;
       if (influenceRole === "leader" && entity.kind === "agent") return false;
      return true;
    }),
    [influenceRole, influenceScope, networkViews],
  );
  const selectedInfluence = visibleInfluenceEntities.find(entity => entity.id === selectedInfluenceId)
    ?? visibleInfluenceEntities[0]
    ?? influenceEntities[0];
  const selectedInfluenceMeta = influenceKindMeta[selectedInfluence.kind];
  const setInfluenceSelection = (entity: InfluenceEntity) => {
    setSelectedInfluenceId(entity.id);
    setInfluenceScope(entity.scope);
    setOperatorNotice(entity.aggregateOnly ? `${entity.name}为只读聚合对象，已切换为查看模式` : `已选中${entity.name}，运营商表单已同步`);
  };
  useEffect(() => {
    if (!isPersonalQrOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPersonalQrOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isPersonalQrOpen]);

  useEffect(() => {
    setDataScope(project.includes("代理") ? "agent" : "members");
    setTableSearch("");
    setActiveTagFilter("全部");
    setMemberLevelFilter("全部级别");
    setAgentLevelFilter("全部身份");
    setSelectedRow(null);
    setSelectedTaskIndex(0);
    setIsTableCollapsed(false);
    setIsRelationCollapsed(false);
    setIsOperationCollapsed(false);
  }, [platform, project]);

  const showProfileNotice = (notice: string) => {
    setProfileNotice(notice);
    window.setTimeout(() => setProfileNotice(""), 2200);
  };

  const selectedTags = memberTags[selectedUser.rank] ?? defaultMemberTags;
  const memberServiceForUser = (rank: number) => memberServiceOverrides[rank] ?? memberServiceDataForRank(rank);
  const selectedMemberService = memberServiceForUser(selectedUser.rank);
  const selectedGroupTask = selectedMemberService.accounts.find(account => account.taskType === "邀请入群");
  const selectedJoinedGroups = selectedGroupTask?.objectiveStatus === "已入群"
    ? getJoinedGroupsForMember(selectedUser.rank)
    : [];
  const updateMemberService = (rank: number, update: (current: MemberServiceData) => MemberServiceData) => {
    setMemberServiceOverrides(current => {
      const existing = current[rank] ?? memberServiceDataForRank(rank);
      return { ...current, [rank]: update(existing) };
    });
  };
  const manualActionKeyForRelationship = (key: "personal" | "enterprise" | "group") => ({ personal: "official-1", enterprise: "official-3", group: "official-8" }[key]);
  const recordManualAction = (rank: number, key: string, actionLabel = "人工记录") => {
    const at = new Date().toLocaleString("zh-CN", { hour12: false });
    updateMemberService(rank, current => {
      const previous = current.actions[key] ?? current.accounts.find(account => account.id === key)?.manual ?? emptyManualAction();
      const previousLogs = previous.logs ?? [];
      const log: ManualActionLog = { action: actionLabel, operator: "当前服务人员", at, status: "已操作" };
      const next = { count: previous.count + 1, status: "已操作" as const, operator: log.operator, at, logs: [...previousLogs, log] };
      return {
        ...current,
        actions: { ...current.actions, [key]: next },
        accounts: current.accounts.map(account => account.id === key ? { ...account, manual: next } : account),
      };
    });
  };
  const updateAccountStatus = (rank: number, accountId: string, value: RelationshipTaskStatus) => {
    updateMemberService(rank, current => ({
      ...current,
      accounts: current.accounts.map(account => account.id === accountId ? { ...account, objectiveStatus: value } : account),
    }));
    showProfileNotice("关系状态已更新，等待 AI 同步核验");
  };
  const refreshMemberAiData = (rank: number) => {
    updateMemberService(rank, current => ({ ...current, ai: { ...current.ai, status: "更新中" } }));
    window.setTimeout(() => updateMemberService(rank, current => ({ ...current, ai: { ...current.ai, status: "已完成", updatedAt: "刚刚" } })), 900);
  };
  const relationshipForUser = (rank: number) => relationshipOverrides[rank] ?? relationshipForRank(rank);
  const updateRelationshipStatus = (rank: number, key: "personal" | "enterprise" | "group", value: string) => {
    setPendingRelationshipChanges(current => ({ ...current, [`${rank}:${key}`]: value }));
  };
  const confirmRelationshipStatus = (rank: number, key: "personal" | "enterprise" | "group") => {
    const pendingKey = `${rank}:${key}`;
    const value = pendingRelationshipChanges[pendingKey];
    if (!value) return;
    setRelationshipOverrides(current => ({ ...current, [rank]: { ...relationshipForUser(rank), [key]: value } }));
    setPendingRelationshipChanges(current => {
      const next = { ...current };
      delete next[pendingKey];
      return next;
    });
    showProfileNotice("关系状态已确认");
  };
  const statusValue = (rank: number, key: "personal" | "enterprise" | "group") => pendingRelationshipChanges[`${rank}:${key}`] ?? relationshipForUser(rank)[key];
  const statusLog = (name: string, label: string, key: string, rank: number) => setActiveLog({ name, label, key, rank });
  const activeListsRecord = activeLists as Record<string, typeof taskSideList>;
  const visibleTaskList = activeListsRecord[activeTaskCategory] ?? (taskSource === "scope" ? activeListsRecord[scopeCfg!.taskCategories[0].label] : taskSideList);
  const openTask = (task: TaskEntry, index: number) => {
    setSelectedTaskIndex(index);
    setActiveTaskContext(task.title);
    setIsOperationCollapsed(false);
    if (task.title.includes("个微") || task.title.includes("企业微信") || task.title.includes("添加失败")) {
      const user = task.title.includes("皮卡丘") ? rankingData[1] : task.title.includes("梓几") ? rankingData[3] : rankingData[0];
      setDataScope("members");
      setSelectedUser(user);
      setRelationshipMember(user.rank);
      setRelationshipDraft({ ...relationshipForUser(user.rank) });
      return;
    }
    if (task.title.includes("ORD-")) {
      setDataScope("members");
      setSelectedUser(rankingData[0]);
      setActiveProfileTab("订单");
      setSelectedOrderNo(memberOrders[0].no);
      showProfileNotice("已定位订单履约记录，可直接确认收货、售后或发起回访");
      return;
    }
    if (task.title.includes("工单")) {
      setDataScope("members");
      setSelectedUser(rankingData[0]);
      setActiveOperation("issue");
      showProfileNotice("已打开工单处理表单，可直接指派处理人");
      return;
    }
    if (task.title.includes("入群")) {
      setDataScope("members");
      setSelectedUser(rankingData[1]);
      setActiveOperation("push");
      showProfileNotice("已定位待入群会员，可直接创建入群触达、分配服务老师或写入回访任务");
      return;
    }
    if (task.title.includes("活动")) {
      setDataScope("project");
      setSelectedRow(SCOPE_CONFIGS.project.rows[0]);
      setActiveOperation("activity");
      showProfileNotice("已定位项目经营对象，可直接创建活动、下发任务或查看关联群与报名结果");
      return;
    }
    if (task.title.includes("群")) {
      setDataScope("community");
      setSelectedRow(SCOPE_CONFIGS.community.rows[0]);
      setActiveOperation("issue");
      showProfileNotice("已定位社群对象，可发布公告或创建群运营任务");
      return;
    }
    if (task.title.includes("佣金")) {
      setDataScope("agent");
      setSelectedRow(SCOPE_CONFIGS.agent.rows[0]);
      setActiveOperation("push");
      showProfileNotice("已定位结算对象，可查看审批与结算处理记录");
    }
  };
  // 操作台 / 档案的当前对象名：会员视角用选中会员，其余视角用选中行
  const targetName = isMemberScope ? selectedUser.name : (selectedRow?.name ?? "");
  const filteredScopeRows = !scopeCfg ? [] : (activeTagFilter === "全部" ? scopeCfg.rows : scopeCfg.rows.filter(r => r.filter === activeTagFilter))
    .filter(row => dataScope !== "agent" || agentLevelFilter === "全部身份" || row.cells[1] === agentLevelFilter)
    .filter(row => !tableSearch || row.cells.join(" ").includes(tableSearch));
  const scopeTableMinWidth = scopeCfg ? scopeCfg.columns.reduce((sum, c) => sum + c.width, 0) + 132 : 900;
  const selectedTrainingRecord = selectedRow?.agentId
    ? agentTrainingRecords.find(record => record.agentId === selectedRow.agentId)
    : undefined;
  const selectedTrainingTasks = selectedTrainingRecord
    ? trainingTasks.filter(task => task.agentId === selectedTrainingRecord.agentId)
    : [];
  const selectedAgentCells = selectedRow?.cells ?? [];
  const selectedAgentProfileSub = isAgentScope
    ? `${selectedAgentCells[1] ?? ""} · ${(selectedAgentCells[2] ?? "").split("-")[0] ?? ""}`
    : scopeCfg?.profileSub;
  const selectedAgentProfileFields = isAgentScope
    ? [
        ["代理编号", selectedRow?.agentId ? `A-${selectedRow.agentId.slice(-3)}` : "—"],
        ["业务身份", selectedAgentCells[1] ?? "—"],
        ["负责城市", selectedAgentCells[2] ?? "—"],
        ["加入时间", "2026-02-20"],
        ["下线会员", `${selectedAgentCells[3] ?? "0"} 人`],
        ["本月招募", `${selectedAgentCells[4] ?? "0"} 人`],
        ["累计佣金", selectedAgentCells[5] ?? "¥0"],
        ["代理状态", selectedAgentCells[7] ?? "—"],
      ] as Array<[string, string]>
    : scopeCfg?.profileFields ?? [];
  const selectedAgentSummary = isAgentScope
    ? [
        ["下线会员", `${selectedAgentCells[3] ?? "0"} 人`, "#2385c8"],
        ["本月招募", `${selectedAgentCells[4] ?? "0"} 人`, "#00a978"],
        ["累计佣金", selectedAgentCells[5] ?? "¥0", "#e77800"],
        ["活跃度", selectedAgentCells[7] === "待安置" ? "待安置" : "正常", "#253800"],
      ] as Array<[string, string, string]>
    : scopeCfg?.summary ?? [];
  const selectedAgentTags = isAgentScope
    ? [{ label: selectedAgentCells[1] ?? "代理", background: "#fff0db", color: "#e77800" }]
    : scopeCfg?.profileTags ?? [];
  // 切换数据视角：任务中心回落到基础任务，排行 Tab / 档案 Tab / 筛选按新视角重置
  const switchDataScope = (next: DataScope) => {
    if (next === dataScope) return;
    setDataScope(next);
    setTaskSource("basic");
    setActiveTaskCategory(taskCategories[0].label);
    setSelectedTaskIndex(0);
    setActiveTagFilter("全部");
    setAgentLevelFilter("全部身份");
    if (next === "members") {
      setActiveProfileTab(profileTabs[0]);
      setSelectedRow(null);
    } else {
      const cfg = SCOPE_CONFIGS[next];
      setActiveProfileTab(cfg.profileTabs[0]);
      setSelectedRow(cfg.rows[0]);
    }
  };
  const tagFilters = ["全部", ...Array.from(new Set(Object.values(memberTags).flat().map(tag => tag.label)))];
 const filteredRankingData = (activeTagFilter === "全部"
   ? rankingData
   : rankingData.filter(user => (memberTags[user.rank] ?? []).some(tag => tag.label === activeTagFilter)))
    .filter(user => memberLevelFilter === "全部级别" || memberLevelForRank(user.rank) === memberLevelFilter)
    .filter(user => !tableSearch || [user.name, user.wechat, user.city, user.job].join(" ").includes(tableSearch));
  const visibleOrders = memberOrders.filter(order => {
    const statusMatched = activeOrderStatus === "所有订单" || order.status === activeOrderStatus;
    const queryMatched = !orderQuery || order.no.includes(orderQuery) || order.product.includes(orderQuery);
    const dateMatched = orderDateRange === "全部日期" || (orderDateRange === "近 7 天" ? order.date.includes("07-") : true);
    return statusMatched && queryMatched && dateMatched;
  });
  const orderStatusCounts = Object.fromEntries(orderStatusTabs.map(status => [
    status,
    status === "所有订单" ? memberOrders.length : memberOrders.filter(order => order.status === status).length,
  ]));

  const addTag = () => {
    const label = tagDraft.trim();
    if (!label) return;
    if (selectedTags.some(tag => tag.label === label)) {
      showProfileNotice("该标签已存在");
      return;
    }
    const color = tagColorOptions[selectedTags.length % tagColorOptions.length];
    setMemberTags(current => ({
      ...current,
      [selectedUser.rank]: [...selectedTags, { label, ...color }],
    }));
    setTagDraft("");
    showProfileNotice(`已为 ${selectedUser.name} 添加「${label}」标签`);
  };

  const removeTag = (label: string) => {
    setMemberTags(current => ({
      ...current,
      [selectedUser.rank]: selectedTags.filter(tag => tag.label !== label),
    }));
    if (activeTagFilter === label) setActiveTagFilter("全部");
    showProfileNotice(`已移除「${label}」标签`);
  };

  return (
    <div className="h-full flex" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* ── 左侧任务列表 ───────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col transition-all duration-200" style={{ width: isTaskPanelCollapsed ? 40 : 224, background: S.surface, borderRight: `1px solid ${S.border}` }}>
        <div className={isTaskPanelCollapsed ? "px-1 py-3 flex items-center justify-center flex-shrink-0" : "px-4 py-3 flex items-center justify-between flex-shrink-0"} style={{ borderBottom: `1px solid ${S.border}` }}>
          {!isTaskPanelCollapsed && <div><div className="text-sm font-bold" style={{ color: S.text }}>统一待办</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>跨系统汇集，按对象直接处理</div></div>}
          <button type="button" title={isTaskPanelCollapsed ? "展开任务中心" : "收起任务中心"} aria-label={isTaskPanelCollapsed ? "展开任务中心" : "收起任务中心"} onClick={() => setIsTaskPanelCollapsed(value => !value)} className="w-6 h-6 flex items-center justify-center" style={{ color: S.muted }}>
            {isTaskPanelCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {!isTaskPanelCollapsed && <>
        {/* 任务来源：基础任务永远保留；非会员视角可切换查看对应视角的任务 */}
        {showScopeTaskTab && (
          <div className="flex items-center gap-0.5 px-3 pt-2.5 flex-shrink-0" role="tablist" aria-label="任务来源切换">
            <button type="button" role="tab" aria-selected={taskSource === "basic"} onClick={() => { setTaskSource("basic"); setActiveTaskCategory(taskCategories[0].label); setSelectedTaskIndex(0); }} className="flex-1 px-2 py-1.5 text-[11px] font-bold whitespace-nowrap" style={{ background: taskSource === "basic" ? "#1e293b" : "#f1f5f9", color: taskSource === "basic" ? S.accent : S.muted, border: `1px solid ${taskSource === "basic" ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}>统一待办</button>
            <button type="button" role="tab" aria-selected={taskSource === "scope"} onClick={() => { setTaskSource("scope"); setActiveTaskCategory(scopeCfg!.taskCategories[0].label); setSelectedTaskIndex(0); }} className="flex-1 px-2 py-1.5 text-[11px] font-bold whitespace-nowrap" style={{ background: taskSource === "scope" ? "#1e293b" : "#f1f5f9", color: taskSource === "scope" ? S.accent : S.muted, border: `1px solid ${taskSource === "scope" ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}>{scopeCfg!.noun}任务</button>
          </div>
        )}

        {/* 任务分类 */}
        <div className="px-3 py-2 flex-shrink-0">
          {activeCats.map((c, i) => (
            <button key={i} className="w-full flex items-center justify-between px-2 py-2 text-left mb-0.5 transition-all" style={{
              background: activeTaskCategory === c.label ? S.accentLight : "transparent",
              borderRadius: S.radiusSm,
              border: activeTaskCategory === c.label ? `1px solid ${S.accent}` : "1px solid transparent",
            }} onClick={() => { setActiveTaskCategory(c.label); setSelectedTaskIndex(0); setActiveTaskContext(c.label); if (isMemberScope && taskSource === "basic" && c.label === "全部待办") { setActiveProfileTab("概览"); setSelectedOrderNo(null); } }}>
              <span className="text-xs font-mono" style={{ color: activeTaskCategory === c.label ? S.text : S.muted }}>{c.label}</span>
              <span className="px-1.5 py-0.5 text-xs font-bold" style={{
                background: activeTaskCategory === c.label ? S.accent : "rgba(15,23,42,0.06)",
                color: activeTaskCategory === c.label ? S.onAccent : S.muted,
                borderRadius: S.radiusSm,
              }}>{c.count}</span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, margin: "0 12px" }} />

        {/* 任务列表 */}
        <div className="flex-1 overflow-auto px-3 py-2 space-y-1">
          {visibleTaskList.slice(0, 4).map((t, i) => (
            <div key={i} className="px-2 py-2.5 cursor-pointer transition-all" style={{
              background: selectedTaskIndex === i ? S.accentLight : S.surface,
              border: selectedTaskIndex === i ? `1px solid rgba(204,255,0,0.4)` : `1px solid ${S.border}`,
              borderRadius: S.radius,
            }} onClick={() => openTask(t, i)}>
              <div className="flex items-start justify-between gap-1">
                <span className="text-xs font-bold leading-tight font-mono" style={{ color: S.text }}>{t.title}</span>
                {t.unread > 0 && <span className="w-4 h-4 bg-red-500 text-white flex items-center justify-center flex-shrink-0" style={{ fontSize: "9px", borderRadius: "50%" }}>{t.unread}</span>}
              </div>
              <div className="flex items-center justify-between gap-2 mt-1"><span className="min-w-0 truncate text-[10px]" style={{ color: S.muted }}>{t.source ?? scopeCfg?.noun ?? "系统待办"}</span><span className="text-[10px] font-bold whitespace-nowrap" style={{ color: "#6db100" }}>{t.action ?? "查看处理"}</span></div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-mono" style={{ color: S.muted, fontSize: "10px" }}>{t.time.split(" ")[1]}</span>
                <span className="text-xs px-1.5 py-0.5 font-bold" style={{ background: taskStatusStyle(t.status).bg, color: taskStatusStyle(t.status).color, fontSize: "10px", borderRadius: S.radiusSm }}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
        </>}
      </div>

      {/* ── 中间区域 ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
        {/* 数据视角切换器：位于排行表格上方，切换列表展示的内容类型；窄容器下自动换行避免被右侧档案栏遮挡 */}
        <div className="flex items-center gap-1.5 px-4 pt-2 flex-shrink-0 flex-wrap" role="group" aria-label="数据视角切换">
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: S.textSec }}>处理对象</span>
          <button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setIsDataScopeCollapsed(value => !value)}>{isDataScopeCollapsed ? "展开" : "收起"}</button>
          {!isDataScopeCollapsed && <div className="flex items-center gap-0.5 p-0.5 min-w-0 flex-wrap" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            {dataScopeOptions.map(option => {
              const isActive = dataScope === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => switchDataScope(option.id)}
                  className="px-2 py-1 text-[10px] font-bold whitespace-nowrap transition-all"
                  style={{ background: isActive ? "#1e293b" : "transparent", color: isActive ? S.accent : S.muted, borderRadius: 4 }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>}
        </div>

        <div className="mx-4 mt-3 flex items-center gap-1.5 overflow-x-auto flex-shrink-0" aria-label="数据搜索与筛选">
          <div className="flex items-center gap-1.5 px-2 py-1 min-w-[170px]" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            <Search size={13} style={{ color: S.muted }} />
            <input value={tableSearch} onChange={event => setTableSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none text-xs" style={{ color: S.textSec }} placeholder={isMemberScope ? "搜索会员、微信号、城市…" : `搜索${scopeCfg?.noun || "数据"}…`} />
            {tableSearch && <button type="button" onClick={() => setTableSearch("")} aria-label="清空搜索"><X size={12} style={{ color: S.muted }} /></button>}
          </div>
          <div className="flex items-center overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <select aria-label="排行时间" className="px-2 py-1 text-xs outline-none" defaultValue="本周" style={{ background: "transparent", color: S.textSec, borderRight: `1px solid ${S.border}` }}>
            <option>今日排行</option>
            <option>本周排行</option>
            <option>本月排行</option>
            <option>总排行</option>
          </select>
         {isMemberScope && <><select aria-label="会员级别筛选" value={memberLevelFilter} onChange={event => setMemberLevelFilter(event.target.value)} className="px-2 py-1 text-xs outline-none" style={{ background: "transparent", color: S.textSec, borderRight: `1px solid ${S.border}` }}><option>全部级别</option>{memberLevelOptions.map(level => <option key={level}>{level}</option>)}</select><select aria-label="会员标签筛选" value={activeTagFilter} onChange={event => setActiveTagFilter(event.target.value)} className="px-2 py-1 text-xs outline-none" style={{ background: "transparent", color: S.textSec }}><option value="全部">全部标签</option>{tagFilters.filter(label => label !== "全部").map(label => <option key={label} value={label}>{label}</option>)}</select></>}
          {dataScope === "agent" && <select aria-label="身份筛选" value={agentLevelFilter} onChange={event => setAgentLevelFilter(event.target.value)} className="px-2 py-1 text-xs outline-none" style={{ background: "transparent", color: S.textSec }}><option>全部身份</option>{platformRoleOptions.map(code => <option key={code} value={businessIdentityLabels[code]}>{businessIdentityLabels[code]}</option>)}<option value={businessIdentityLabels.LEADER}>{businessIdentityLabels.LEADER}</option></select>}
          </div>
          <button type="button" title="重置筛选" aria-label="重置筛选" onClick={() => { setTableSearch(""); setActiveTagFilter("全部"); setMemberLevelFilter("全部级别"); setAgentLevelFilter("全部身份"); showProfileNotice("筛选已重置"); }} className="w-7 h-7 flex items-center justify-center" style={{ background: S.bg, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={13} /></button>
          {isMemberScope ? <span className="text-xs whitespace-nowrap" style={{ color: S.muted }}>{filteredRankingData.length} 位会员</span> : scopeCfg ? <><Tags size={13} style={{ color: "#6db100" }} />
            {scopeCfg.filterChips.map(label => {
              const isActive = activeTagFilter === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveTagFilter(label)}
                  className="px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? S.accent : S.surface,
                    color: isActive ? S.onAccent : S.muted,
                    border: `1px solid ${isActive ? S.accent : S.border}`,
                    borderRadius: "999px",
                  }}
                >
                  {label}
                </button>
              );
            })}
            <span className="text-xs whitespace-nowrap" style={{ color: S.muted }}>{filteredScopeRows.length} {scopeCfg.counterUnit}</span>
          </> : null}
        </div>

        {isTableCollapsed ? (
          <div className="mx-4 mt-3 h-9 flex items-center justify-end px-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <button type="button" title="展开数据列表" aria-label="展开数据列表" onClick={() => setIsTableCollapsed(false)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><PanelTopOpen size={14} /></button>
          </div>
        ) : <div className="relative mx-4 mt-3 min-w-[420px] min-h-[180px] h-[300px] max-w-full overflow-auto" style={{ resize: "both", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <button type="button" title="收起数据列表" aria-label="收起数据列表" onClick={() => setIsTableCollapsed(true)} className="absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><PanelTopClose size={14} /></button>
        {/* 排行榜表格：会员视角原样，其余视角按视角列定义渲染 */}
        {isMemberScope ? (
        <div className="overflow-x-auto" aria-label="会员排行横向滚动表格" style={{ scrollbarWidth: "thin" }}>
          <div className="flex items-center px-3 py-2 text-xs font-bold font-mono" style={{ minWidth: 1120, background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            {[["序号",44],["头像",44],["微信名",110],["会员级别",82],["城市",90],["创始人个微",124],["服务官企微",124],["入群状态",108],["累计消费",82],["影响会员数",82],["影响力",68],["评分",64],["操作",72]].map(([l,w], hi) => (
              <div key={`h-${hi}-${l}-${w}`} className="flex-shrink-0" style={{ width: w as number }}>{l}</div>
            ))}
          </div>
          {filteredRankingData.map((u, idx) => (
            <div key={u.rank} className="flex items-center px-3 py-2.5 cursor-pointer text-xs transition-all font-mono" style={{
              minWidth: 1120,
              background: selectedUser.rank === u.rank ? S.accentLight : idx % 2 === 0 ? "#ffffff" : "#fafaf8",
              borderBottom: `1px solid ${S.border}`,
              borderLeft: selectedUser.rank === u.rank ? `3px solid ${S.accent}` : "3px solid transparent",
            }} onClick={() => setSelectedUser(u)}>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: u.rank <= 3 ? "#1e293b" : "rgba(15,23,42,0.06)", color: u.rank <= 3 ? S.accent : S.textSec, borderRadius: S.radiusSm }}>{u.rank}</div>
              </div>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <img src={getAvatar(u.rank - 1)} alt={u.name} style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} />
              </div>
              <div className="flex-shrink-0 font-bold" style={{ width: 110, color: S.text }}>{u.name}</div>
              <div className="flex-shrink-0" style={{ width: 82 }}><span className="px-1.5 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: S.radiusSm }}>{memberLevelForRank(u.rank)}</span></div>
              <div className="flex-shrink-0" style={{ width: 90, color: S.muted }}>{u.city}</div>
              {([ ["personal", "创始人个微", 124], ["enterprise", "服务官企微", 124] ] as const).map(([key, label, width]) => { const pendingKey = `${u.rank}:${key}`; const value = statusValue(u.rank, key); const actionLabel = "添加"; const actionKey = manualActionKeyForRelationship(key); const action = memberServiceForUser(u.rank).actions[actionKey] ?? memberServiceForUser(u.rank).accounts.find(account => account.id === actionKey)?.manual ?? emptyManualAction(); return <div key={key} className="flex-shrink-0 flex items-center gap-0.5" style={{ width }}><button type="button" onClick={event => { event.stopPropagation(); recordManualAction(u.rank, actionKey, "添加动作"); }} className="relative px-1 py-0.5 text-[9px] font-bold whitespace-nowrap" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>{actionLabel}{action.count > 0 && <span aria-label={`已点击${action.count}次`} className="absolute -right-1.5 -top-1.5 min-w-3.5 h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold" style={{ background: "#dc2626", color: "#ffffff", border: "1px solid #ffffff", borderRadius: "999px", lineHeight: 1 }}>{action.count}</span>}</button><select aria-label={`${u.name} ${label}状态`} value={value} onChange={event => updateRelationshipStatus(u.rank, key, event.target.value)} className="min-w-0 flex-1 px-1 py-1 text-[10px] outline-none font-bold" style={{ background: "transparent", color: value === "无法添加" ? "#c2410c" : key === "personal" ? S.textSec : S.muted, border: 0, borderRadius: S.radiusSm }}>{relationshipStatusOptions.map(option => <option key={`${key}-${option}`} value={option}>{option}</option>)}</select>{pendingRelationshipChanges[pendingKey] && <button type="button" title="确认状态修改" aria-label={`${u.name} ${label}确认状态修改`} onClick={() => confirmRelationshipStatus(u.rank, key)} className="w-4 h-4 flex items-center justify-center" style={{ color: "#008565" }}><Check size={11} /></button>}<button type="button" title={`查看${label}操作日志`} aria-label={`${u.name} ${label}操作日志`} onClick={() => statusLog(u.name, label, actionKey, u.rank)} className="w-4 h-4 flex items-center justify-center" style={{ color: S.muted }}><History size={11} /></button></div>; })}
              <div className="flex-shrink-0" style={{ width: 108 }}>{(() => { const key = "group" as const; const actionKey = manualActionKeyForRelationship(key); const pendingKey = `${u.rank}:${key}`; const value = statusValue(u.rank, key); const action = memberServiceForUser(u.rank).actions[actionKey] ?? memberServiceForUser(u.rank).accounts.find(account => account.id === actionKey)?.manual ?? emptyManualAction(); return <div className="flex items-center gap-0.5"><button type="button" onClick={event => { event.stopPropagation(); recordManualAction(u.rank, actionKey, "邀请入群"); }} className="relative px-1 py-0.5 text-[9px] font-bold whitespace-nowrap" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>入群{action.count > 0 && <span aria-label={`已点击${action.count}次`} className="absolute -right-1.5 -top-1.5 min-w-3.5 h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold" style={{ background: "#dc2626", color: "#ffffff", border: "1px solid #ffffff", borderRadius: "999px", lineHeight: 1 }}>{action.count}</span>}</button><select aria-label={`${u.name} 入群状态`} value={value} onChange={event => updateRelationshipStatus(u.rank, key, event.target.value)} className="min-w-0 flex-1 px-1 py-1 text-[10px] outline-none font-bold" style={{ background: value === "已入群" ? "#e8fbf4" : "#fff0db", color: value === "已入群" ? "#008565" : "#c2410c", border: 0, borderRadius: S.radiusSm }}>{groupStatusOptions.map(option => <option key={option}>{option}</option>)}</select>{pendingRelationshipChanges[pendingKey] && <button type="button" title="确认状态修改" aria-label={`${u.name} 入群确认状态修改`} onClick={() => confirmRelationshipStatus(u.rank, key)} className="w-4 h-4 flex items-center justify-center" style={{ color: "#008565" }}><Check size={11} /></button>}<button type="button" title="查看入群操作日志" aria-label={`${u.name} 入群操作日志`} onClick={() => statusLog(u.name, "入群", actionKey, u.rank)} className="w-4 h-4 flex items-center justify-center" style={{ color: S.muted }}><History size={11} /></button></div>; })()}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 82, color: "#c2410c" }}>{relationshipForUser(u.rank).spend}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 82, color: S.text }}>{u.totalUsers.toLocaleString()}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 68, color: S.text }}>{u.influence.toLocaleString()}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 64, color: S.text }}>{u.score.toLocaleString()}</div>
              <div className="flex-shrink-0" style={{ width: 72 }}><button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }} onClick={event => { event.stopPropagation(); setRelationshipMember(u.rank); setRelationshipDraft({ ...relationshipForUser(u.rank) }); }}>处理关系</button></div>
            </div>
          ))}
          {filteredRankingData.length === 0 && (
            <div className="px-3 py-8 text-center text-xs" style={{ color: S.muted }}>暂无匹配该标签的会员</div>
          )}
        </div>
        ) : scopeCfg ? (
        <div className="overflow-x-auto" aria-label={`${scopeCfg.noun}排行横向滚动表格`} style={{ scrollbarWidth: "thin" }}>
          <div className="flex items-center px-3 py-2 text-xs font-bold font-mono" style={{ minWidth: scopeTableMinWidth, background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            <div className="flex-shrink-0" style={{ width: 44 }}>排名</div>
            <div className="flex-shrink-0" style={{ width: 44 }}>头像</div>
            {scopeCfg.columns.map(c => <div key={`h-${c.label}`} className="flex-shrink-0" style={{ width: c.width }}>{c.label}</div>)}
          </div>
          {filteredScopeRows.map((row, idx) => (
            <div key={row.rank} className="flex items-center px-3 py-2.5 cursor-pointer text-xs transition-all font-mono" style={{
              minWidth: scopeTableMinWidth,
              background: selectedRow?.rank === row.rank ? S.accentLight : idx % 2 === 0 ? "#ffffff" : "#fafaf8",
              borderBottom: `1px solid ${S.border}`,
              borderLeft: selectedRow?.rank === row.rank ? `3px solid ${S.accent}` : "3px solid transparent",
            }} onClick={() => setSelectedRow(row)}>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: row.rank <= 3 ? "#1e293b" : "rgba(15,23,42,0.06)", color: row.rank <= 3 ? S.accent : S.textSec, borderRadius: S.radiusSm }}>{row.rank}</div>
              </div>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <div className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ background: S.accentLight, border: "1px solid rgba(204,255,0,0.45)", color: "#5a6e00", borderRadius: S.radiusSm }}>{row.initial}</div>
              </div>
              {scopeCfg.columns.map((c, ci) => (
                <div key={`${row.rank}-${c.label}`} className="flex-shrink-0" style={{ width: c.width, color: c.tone === "muted" ? S.muted : c.tone === "name" || c.tone === "bold" ? S.text : S.textSec, fontWeight: c.tone === "name" || c.tone === "bold" ? 700 : 400 }}>{row.cells[ci]}</div>
              ))}
            </div>
          ))}
          {filteredScopeRows.length === 0 && (
            <div className="px-3 py-8 text-center text-xs" style={{ color: S.muted }}>暂无匹配该筛选的{scopeCfg.noun}</div>
          )}
        </div>
        ) : null}

        </div>}
        {/* 底部：关系链 + 朋友圈操作 */}
        <div className="flex flex-wrap xl:flex-nowrap items-stretch gap-3 mx-4 mt-3 flex-shrink-0 pb-5">
          {/* 关系链 */}
          {isRelationCollapsed ? <div className="w-9 flex-shrink-0 flex items-start justify-center pt-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><button type="button" title="展开关系链" aria-label="展开关系链" onClick={() => setIsRelationCollapsed(false)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><PanelLeftOpen size={14} /></button></div> : <div className="p-3 flex-none w-full xl:w-[34%]" style={{ minWidth: 280, maxWidth: "58%", minHeight: 220, resize: "horizontal", overflow: "auto", background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: S.text }} />
              <span className="text-sm font-bold whitespace-nowrap" style={{ color: S.text }}>关系链</span>
              <div className="flex items-center gap-1.5 px-2 py-1 min-w-0 flex-1" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Search size={11} style={{ color: S.muted }} /><input className="min-w-0 flex-1 bg-transparent outline-none text-xs" style={{ color: S.textSec }} placeholder="搜索" /></div>
              <button type="button" title="收起关系链" aria-label="收起关系链" onClick={() => setIsRelationCollapsed(true)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><PanelLeftClose size={14} /></button>
            </div>
            <div className="mt-3 max-h-[280px] overflow-auto"><TreeNode node={relationTree} /></div>
          </div>}

          {/* 统一运营操作台 */}
          <div className="flex-1 min-w-[360px] p-4 flex flex-col gap-3 overflow-auto" style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: S.radius,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold" style={{ color: S.text }}>统一业务操作台</div>
                <span className="text-xs" style={{ color: S.muted }}>{isAgentScope ? `针对 ${targetName} 配置佣金结算、培训与考核` : `针对 ${targetName} 处理客户关系、服务与运营动作`}</span>
                <span className="block mt-1 text-[10px] truncate" style={{ color: "#6db100" }}>当前待办 · {activeTaskContext}</span>
              </div>
              <div className="flex items-center gap-2"><span className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: "999px" }}>当前{isMemberScope ? "会员" : scopeCfg!.noun}</span><button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }} onClick={() => setIsOperationCollapsed(value => !value)}>{isOperationCollapsed ? "展开" : "收起"}</button></div>
            </div>
            {isOperationCollapsed ? <div className="px-2 py-2 text-xs" style={{ color: S.muted }}>操作台已收起，展开后可处理关系、创建工单、回访或发起运营动作。</div> : <>
            {isMemberScope && <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="当前客户快捷操作">
              <span className="text-[10px] whitespace-nowrap" style={{ color: S.muted }}>快捷处理</span>
              <button type="button" onClick={() => { setRelationshipMember(selectedUser.rank); setRelationshipDraft({ ...relationshipForUser(selectedUser.rank) }); }} className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.accentLight, color: S.textSec, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>处理关系</button>
              <button type="button" onClick={() => { setActiveOperation("issue"); showProfileNotice(`已切换到 ${selectedUser.name} 的工单处理`); }} className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>创建工单</button>
              <button type="button" onClick={() => { setActiveOperation("push"); showProfileNotice(`已为 ${selectedUser.name} 准备回访任务`); }} className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>发起回访</button>
              <button type="button" onClick={() => { setActiveProfileTab("订单"); showProfileNotice(`已打开 ${selectedUser.name} 的订单与履约记录`); }} className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>订单履约</button>
            </div>}
            <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist" aria-label="运营操作类型">
              {opTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeOperation === tab.id;
                return <button key={tab.id} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveOperation(tab.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap" style={{ background: isActive ? "#1e293b" : "#f1f5f9", color: isActive ? S.accent : S.muted, border: `1px solid ${isActive ? "#1e293b" : S.border}`, borderRadius: S.radiusSm }}><Icon size={12} />{tab.label}</button>;
              })}
            </div>

            {activeOperation === "issue" && (dataScope === "community" ? <>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>公告范围</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前社群" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前社群</option><option>同项目社群</option><option>指定标签社群</option></select></div><div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>发布时间</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="立即发布" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>立即发布</option><option>今天 18:00</option><option>明天 09:00</option></select></div></div>
              <input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder={`输入 ${targetName} 的公告标题...`} />
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="填写群公告内容、成员动作和截止时间..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>保存草稿</button><button onClick={() => showProfileNotice(`已为 ${targetName} 发布群公告并写入操作记录`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><MessageSquare size={11} className="inline mr-1" />发布群公告</button></div>
            </> : <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>问题分类</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="售后问题" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>售后问题</option><option>产品咨询</option><option>社群服务</option><option>投诉建议</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>处理部门</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="会员运营部" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>会员运营部</option><option>客服部</option><option>社群运营部</option><option>财务部</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>优先级</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="重要" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>普通</option><option>重要</option><option>紧急</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>指派处理人</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="吴思远" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>吴思远</option><option>林小燕</option><option>客服组</option></select></div>
              </div>
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder={`登记 ${targetName} 的问题描述...`} />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>清空</button><button onClick={() => showProfileNotice(`已登记 ${targetName} 的问题并指派至会员运营部`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><ClipboardCheck size={11} className="inline mr-1" />{opTabs[0].button}</button></div>
            </>) }

            {activeOperation === "push" && (isAgentScope ? <>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>结算周期</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="2026年9月" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>2026年9月</option><option>2026年8月</option></select></div><div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>结算方式</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="按订单结算" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>按订单结算</option><option>按佣金规则结算</option></select></div></div>
              <div className="grid grid-cols-2 gap-2"><div className="px-3 py-2" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>待结算金额</div><div className="text-base font-bold mt-1" style={{ color: "#c2410c" }}>¥3,200</div></div><div className="px-3 py-2" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>审批状态</div><div className="text-xs font-bold mt-1" style={{ color: S.text }}>待负责人审批</div></div></div>
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="补充结算说明或异常原因..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>保存草稿</button><button onClick={() => showProfileNotice(`已提交 ${targetName} 的结算审批，并写入操作日志`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><ClipboardCheck size={11} className="inline mr-1" />发起结算审批</button></div>
            </> : <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>任务类型</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="会员触达" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>会员触达</option><option>服务提醒</option><option>回访任务</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>目标对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
              </div>
              <input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入任务标题..." />
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="填写推送内容或任务要求..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>取消</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建推送任务`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><Send size={11} className="inline mr-1" />创建推送任务</button></div>
            </>) }

            {activeOperation === "activity" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>活动类型</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="课程活动" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>课程活动</option><option>线下沙龙</option><option>打卡挑战</option><option>会员福利</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>参与对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
              </div>
              <input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入活动名称..." />
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="填写活动说明、时间和报名要求..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>取消</button><button onClick={() => showProfileNotice(`已为 ${targetName} 创建活动运营任务`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><CalendarDays size={11} className="inline mr-1" />{opTabs[2].button}</button></div>
            </>}

            {activeOperation === "moments" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>发文字</label><input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入朋友圈文案..." /></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>目标对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>推送平台</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="朋友圈" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>朋友圈</option><option>微信群</option><option>企业微信</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>时间提醒</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="立即发布" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>立即发布</option><option>今天 18:00</option><option>明天 09:00</option></select></div>
              </div>
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="补充本次朋友圈运营动作说明..." />
              <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="w-20 h-12 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.04)", border: `1px dashed rgba(0,0,0,0.10)`, borderRadius: S.radiusSm }}><span className="text-2xl" style={{ color: S.mutedLight }}>+</span></div><span className="text-xs" style={{ color: S.muted }}>添加图片（最多 9 张）</span></div>
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>清空</button><button onClick={() => showProfileNotice("朋友圈发布任务已创建")} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><Send size={11} className="inline mr-1" />{opTabs[3].button}</button></div>
            </>}
            </>}
          </div>
        </div>
      </div>

      {/* ── 右侧会员档案：资料、画像与权益在同一信息流中展示 ───── */}
      {!isProfileCollapsed ? <aside className="flex-shrink-0 overflow-auto transition-all duration-200" style={{ width: "clamp(292px, 22vw, 350px)", background: S.surface, borderLeft: `1px solid ${S.border}` }}>
        {isMemberScope ? <>
        <div className="p-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-1" style={{ background: S.accent, borderRadius: "999px" }} />
              <div className="text-sm font-bold" style={{ color: S.text }}>个人资料</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" title="查看个微二维码" aria-label="查看个微二维码" onClick={() => setIsPersonalQrOpen(true)} className="w-7 h-7 flex items-center justify-center" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>
                <QrCode size={15} />
              </button>
              <button type="button" title="收起会员档案栏" aria-label="收起会员档案栏" onClick={() => setIsProfileCollapsed(true)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <PanelRightClose size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2.5 mt-2">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <img src={getAvatar(selectedUser.rank - 1)} alt={selectedUser.name} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover", border: `1px solid ${S.border}` }} />
              <span className="px-1.5 py-0.5 text-[9px] font-bold" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: "999px" }}>{memberLevelForRank(selectedUser.rank)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold truncate" style={{ color: S.text }}>{selectedUser.name}</div>
                <span className="text-[9px] whitespace-nowrap" style={{ color: S.muted }}>已入会</span>
              </div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>地区：{selectedUser.city}</div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>微信备注：10000{selectedUser.rank}－{memberLevelForRank(selectedUser.rank)}－{selectedUser.city}</div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {selectedTags.filter(tag => tag.label !== memberLevelForRank(selectedUser.rank)).map(({ label, background, color }) => (
                  <span key={label} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold" style={{ background, color, borderRadius: "999px" }}>
                    {label}
                    {isEditingTags && <button type="button" title={`移除标签：${label}`} aria-label={`移除标签：${label}`} onClick={() => removeTag(label)} className="inline-flex items-center justify-center" style={{ color, lineHeight: 1 }}><X size={10} strokeWidth={2.5} /></button>}
                  </span>
                ))}
                <button title={isEditingTags ? "保存标签修改" : "编辑会员标签"} onClick={() => { setIsEditingTags(editing => !editing); setTagDraft(""); if (isEditingTags) showProfileNotice("标签修改已保存"); }} className="text-[10px] font-bold whitespace-nowrap" style={{ color: "#6db100" }}>
                  {isEditingTags ? "完成" : "编辑"}
                </button>
              </div>
              {isEditingTags && <form className="flex items-center gap-1.5 mt-1.5" onSubmit={event => { event.preventDefault(); addTag(); }}>
                <input value={tagDraft} onChange={event => setTagDraft(event.target.value)} className="min-w-0 flex-1 px-2 py-1 text-[10px] outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="新增标签" />
                <button type="submit" title="新增标签" aria-label="新增标签" className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}><Plus size={11} strokeWidth={2.5} /></button>
              </form>}
            </div>
          </div>
          {profileNotice && <div role="status" className="mt-2 px-2 py-1.5 text-[10px] font-bold" style={{ background: S.accentLight, color: S.text, borderLeft: `2px solid ${S.accent}` }}>{profileNotice}</div>}
          <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${S.border}` }}>
            <div className="grid grid-cols-2 gap-x-4">
              {[
                ["微信号", selectedUser.wechat], ["手机号", "138****2341"],
                ["对应客服", "FLM002"], ["会员编号", `10000${selectedUser.rank}`],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 flex items-center justify-between gap-2 py-1" style={{ borderBottom: `1px solid ${S.border}` }}>
                  <span className="text-[10px]" style={{ color: S.muted }}>{label}</span>
                  <span className="text-[11px] font-bold truncate text-right" style={{ color: S.textSec }} title={value}>{value}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setShowProfileMore(value => !value)} className="mt-2 text-[10px] font-bold" style={{ color: S.primary }}>
              {showProfileMore ? "收起更多资料" : "更多资料"}
            </button>
            {showProfileMore && <div className="grid grid-cols-2 gap-x-4 mt-1.5">
              {[["出生年月", "1988-04-24"], ["身份证", "330511********990"], ["肤质", "混合型偏油性肌肤"]].map(([label, value]) => (
                <div key={label} className="min-w-0 flex items-center justify-between gap-2 py-1" style={{ borderBottom: `1px solid ${S.border}` }}>
                  <span className="text-[10px]" style={{ color: S.muted }}>{label}</span>
                  <span className="text-[10px] font-bold truncate text-right" style={{ color: S.textSec }} title={value}>{value}</span>
                </div>
              ))}
            </div>}
            <section className="mt-2 pt-2" style={{ borderTop: `1px solid ${S.border}` }}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: S.text }}>
                  <Users size={13} style={{ color: S.accent }} />
                  已加入社群
                </div>
                <span className="text-[10px]" style={{ color: S.muted }}>{selectedJoinedGroups.length} 个</span>
              </div>
              {selectedJoinedGroups.length > 0 ? (
                <div className="mt-1.5 space-y-1">
                  {selectedJoinedGroups.map(group => (
                    <div key={group.name} className="flex min-w-0 items-center gap-2 px-2 py-1.5" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>
                      <Users size={12} className="flex-shrink-0" style={{ color: "#5a6e00" }} />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-bold" style={{ color: S.textSec }} title={group.name}>{group.name}</span>
                      <span className="flex-shrink-0 text-[9px]" style={{ color: S.muted }}>{group.type}</span>
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "#e8fbf4", color: "#008565", borderRadius: "999px" }}>{group.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 px-2.5 py-2 text-[11px]" style={{ background: S.bg, color: S.muted, border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }}>
                  暂未加入社群
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="flex items-center gap-0 px-2.5 pt-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          {profileTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveProfileTab(tab)}
              className="flex-1 px-1 py-1.5 text-[10px] font-bold whitespace-nowrap transition-all"
              style={{
                color: activeProfileTab === tab ? S.text : S.muted,
                borderBottom: activeProfileTab === tab ? `2px solid ${S.accent}` : "2px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="px-3.5 py-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          {activeProfileTab === "概览" && (
            <div>
              <div className="grid grid-cols-3 gap-1 pb-2" style={{ borderBottom: `1px solid ${S.border}` }}>
                {orderStatusTabs.map(status => (
                  <button
                    key={status}
                    onClick={() => setActiveOrderStatus(status)}
                    className="min-w-0 px-1.5 py-1.5 text-[10px] font-bold truncate transition-all"
                    style={{ background: activeOrderStatus === status ? S.accentLight : "transparent", color: activeOrderStatus === status ? "#5a6e00" : S.muted, border: `1px solid ${activeOrderStatus === status ? "rgba(204,255,0,0.55)" : "transparent"}`, borderRadius: S.radiusSm }}
                  >
                    {status} <span style={{ opacity: 0.7 }}>({orderStatusCounts[status]})</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1.5 py-2">
                <input value={orderSearchInput} onChange={event => setOrderSearchInput(event.target.value)} className="min-w-0 px-2 py-1.5 text-[10px] outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="搜索订单号或商品" aria-label="搜索订单号或商品" />
                <button onClick={() => { setOrderQuery(orderSearchInput.trim()); showProfileNotice(orderSearchInput.trim() ? "已应用订单搜索" : "已显示全部订单"); }} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>查询</button>
              </div>
              <div className="flex items-center gap-1.5 pb-2">
                <select value={orderDateRange} onChange={event => setOrderDateRange(event.target.value)} aria-label="订单日期范围" className="min-w-0 flex-1 px-2 py-1.5 text-[10px] outline-none" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}><option>全部日期</option><option>近 7 天</option><option>近 30 天</option></select>
                <button onClick={() => { setOrderSearchInput(""); setOrderQuery(""); setOrderDateRange("全部日期"); setActiveOrderStatus("所有订单"); showProfileNotice("订单筛选已重置"); }} className="px-2 py-1.5 text-[10px] font-bold whitespace-nowrap" style={{ background: "#f1f5f9", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>重置</button>
              </div>
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div className="min-w-0"><span className="text-[10px] font-bold" style={{ color: S.text }}>{activeOrderStatus} · {visibleOrders.length} 笔</span><span className="block text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>当前会员：{selectedUser.name}</span></div>
                <span className="text-[10px] text-right" style={{ color: S.muted }}>按订单、包裹与商品处理</span>
              </div>
              {visibleOrders.map(order => (
                <article key={order.no} className="mb-2 overflow-hidden" style={{ background: "#ffffff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}` }}>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold font-mono truncate" style={{ color: S.text }}>订单号：{order.no}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: S.muted }}>购买日期：{order.date}</div>
                    </div>
                    <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: order.status === "已完成" ? "#00a978" : "#e77800" }}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5" style={{ background: S.accentLight, borderBottom: `1px solid ${S.border}` }}>
                    <span className="text-[10px]" style={{ color: S.textSec }}>实收 <b style={{ color: "#e77800" }}>{order.amount}</b> · 优惠 {order.discount}</span>
                    <button onClick={() => { setSelectedOrderNo(order.no); setActiveProfileTab("订单"); }} className="text-[10px] font-bold whitespace-nowrap" style={{ color: "#6db100" }}>查看详情</button>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <div className="flex items-center gap-1.5 min-w-0"><Truck size={12} style={{ color: "#6db100", flexShrink: 0 }} /><span className="text-[10px] font-bold" style={{ color: S.textSec }}>包裹 1</span><span className="text-[10px] truncate" style={{ color: S.muted }}>{order.logistics}</span></div>
                    <button onClick={() => showProfileNotice(order.status === "待收货" ? "已标记为待确认收货" : "订单状态已同步")} className="text-[10px] font-bold whitespace-nowrap" style={{ color: order.status === "待收货" ? "#6db100" : S.muted }}>{order.status === "待收货" ? "确认收货" : "交易成功"}</button>
                  </div>
                  {order.items.map(item => (
                    <div key={`${order.no}-${item.name}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
                      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: item.tone, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><Package size={13} style={{ color: S.textSec }} /></div>
                      <div className="min-w-0"><div className="text-[11px] font-bold truncate" style={{ color: S.text }}>{item.name}</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>{item.spec}</div></div>
                      <div className="text-right"><div className="text-[10px] font-bold" style={{ color: S.textSec }}>{item.price}</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>{item.quantity}</div></div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                    <span className="text-[10px] truncate" style={{ color: S.muted }}>服务状态：<b style={{ color: order.serviceStatus === "已回访" ? "#00a978" : "#e77800" }}>{order.serviceStatus}</b></span>
                    <div className="flex items-center gap-2 flex-shrink-0"><button onClick={() => showProfileNotice("售后单已创建")} className="text-[10px] font-bold" style={{ color: S.muted }}>售后/退款</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建订单回访`)} className="text-[10px] font-bold" style={{ color: "#6db100" }}>发起回访</button></div>
                  </div>
                </article>
              ))}
              {visibleOrders.length === 0 && <div className="px-3 py-5 text-center" style={{ background: "#f1f5f9", border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }}>
                <Package size={17} className="mx-auto mb-2" style={{ color: S.mutedLight }} />
                <div className="text-[11px] font-bold" style={{ color: S.textSec }}>暂无「{activeOrderStatus}」订单</div>
                <div className="text-[10px] mt-1 leading-relaxed" style={{ color: S.muted }}>可查看全部订单，或直接为该会员创建售后跟进。</div>
                <div className="flex justify-center gap-2 mt-3"><button onClick={() => { setActiveOrderStatus("所有订单"); setOrderQuery(""); setOrderSearchInput(""); }} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>查看全部</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建售后跟进`)} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: "#ffffff", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>创建售后</button></div>
              </div>}
              <div className="flex items-center justify-center gap-1 pt-1 text-[10px]" style={{ color: S.muted }}><button className="px-1.5 py-1" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>‹</button><span className="px-1.5 py-1 font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>1</span><button className="px-1.5 py-1" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>›</button><span className="ml-1">共 {visibleOrders.length} 笔</span></div>
            </div>
          )}
          {activeProfileTab === "订单" && (selectedOrderNo ? (() => {
            const order = memberOrders.find(item => item.no === selectedOrderNo) ?? memberOrders[0];
            return <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <button onClick={() => { setSelectedOrderNo(null); setActiveProfileTab("待处理"); }} className="text-[10px] font-bold" style={{ color: "#6db100" }}>返回订单列表</button>
                <span className="text-[10px] font-bold" style={{ color: order.status === "已完成" ? "#00a978" : "#e77800" }}>{order.status}</span>
              </div>
              <div className="px-2.5 py-2.5" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <div className="text-xs font-bold font-mono" style={{ color: S.text }}>{order.no}</div>
                <div className="text-sm font-bold mt-1" style={{ color: S.text }}>{order.product}</div>
                <div className="text-[10px] mt-1" style={{ color: S.muted }}>{order.qty} · {order.amount}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 mt-2">
                {[["下单时间", order.date], ["支付方式", order.payment], ["订单来源", order.source], ["服务跟进", order.followUp]].map(([label, value]) => (
                  <div key={label} className="py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="text-[11px] font-bold mt-0.5 truncate" style={{ color: S.textSec }}>{value}</div></div>
                ))}
              </div>
              <div className="mt-2 overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <div className="px-2 py-1.5 text-[10px] font-bold" style={{ background: "#f1f5f9", color: S.textSec }}>商品明细 / 包裹 1</div>
                {order.items.map(item => <div key={`detail-${item.name}`} className="grid grid-cols-[1fr_auto] gap-2 px-2 py-1.5" style={{ borderTop: `1px solid ${S.border}` }}><div className="min-w-0"><div className="text-[10px] font-bold truncate" style={{ color: S.text }}>{item.name}</div><div className="text-[10px]" style={{ color: S.muted }}>{item.spec}</div></div><div className="text-right text-[10px]" style={{ color: S.textSec }}>{item.price} · {item.quantity}</div></div>)}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建订单回访`)} className="flex-1 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>发起回访</button>
                <button onClick={() => showProfileNotice("订单备注已打开")} className="flex-1 py-1.5 text-[10px] font-bold" style={{ background: "#f1f5f9", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>添加备注</button>
              </div>
            </div>;
          })() : memberOrders.map(order => (
            <button key={order.no} onClick={() => setSelectedOrderNo(order.no)} className="w-full flex items-center gap-2 py-2 text-left" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-1 min-w-0"><div className="text-xs font-bold truncate" style={{ color: S.text }}>{order.product}</div><div className="text-[11px] mt-0.5" style={{ color: S.muted }}>{order.no} · {order.date.slice(0, 10)}</div></div>
              <span className="text-xs font-bold" style={{ color: "#e77800" }}>{order.amount}</span>
            </button>
          )))}
          {activeProfileTab === "运营记录" && activityFeed.slice(0, 3).map(activity => (
            <div key={activity.id} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
              <Clock size={12} className="flex-shrink-0" style={{ color: "#6db100" }} />
              <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{activity.type}</div><div className="text-[11px] truncate" style={{ color: S.muted }}>{activity.content}</div></div>
              <span className="text-[11px]" style={{ color: S.muted }}>{activity.time.slice(5, 10)}</span>
            </div>
          ))}
          {activeProfileTab === "回访" && [
            ["服务老师回访", "吴思远 · 上次回访 07-03", "跟进中"],
            ["会员续费提醒", "本月 25 日前完成", "待安排"],
          ].map(([label, detail, status]) => (
            <div key={label} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{label}</div><div className="text-[11px] mt-0.5 truncate" style={{ color: S.muted }}>{detail}</div></div>
              <span className="text-[11px] font-bold" style={{ color: status === "待安排" ? "#e77800" : "#00a978" }}>{status}</span>
            </div>
          ))}
          {activeProfileTab === "官方账号任务" && (
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold" style={{ color: S.text }}>官方账号任务关系表</div>
                  <div className="text-[9px] mt-0.5" style={{ color: S.muted }}>左侧为账号类型，右侧记录同步状态与人工服务动作</div>
                </div>
                <button
                  type="button"
                  onClick={() => refreshMemberAiData(selectedUser.rank)}
                  className="flex items-center gap-1 px-1.5 py-1 text-[9px] font-bold whitespace-nowrap"
                  style={{ background: "#f1f5f9", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}
                >
                  <RefreshCw size={10} />
                  更新 AI
                </button>
              </div>
              <div className="overflow-x-auto" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <div style={{ minWidth: 620 }}>
                  <div
                    className="grid items-center gap-2 px-2 py-1.5 text-[9px] font-bold"
                    style={{ gridTemplateColumns: "minmax(106px, 1.25fr) 72px 58px minmax(78px, 1fr) 58px 80px 68px", background: "#f1f5f9", color: S.muted, borderBottom: `1px solid ${S.border}` }}
                  >
                    <span>账号类型 / 账号名</span>
                    <span>任务类型</span>
                    <span>AI同步</span>
                    <span>关系状态</span>
                    <span>人工记录</span>
                    <span>最近操作</span>
                    <span>动作</span>
                  </div>
                  {selectedMemberService.accounts.map(account => {
                    const aiColor = account.aiStatus === "已同步" ? "#008565" : account.aiStatus === "待核验" ? "#d97706" : "#dc2626";
                    return (
                      <div
                        key={account.id}
                        className="grid items-center gap-2 px-2 py-2"
                        style={{ gridTemplateColumns: "minmax(106px, 1.25fr) 72px 58px minmax(78px, 1fr) 58px 80px 68px", borderBottom: `1px solid ${S.border}` }}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold truncate" style={{ color: S.text }} title={account.label}>{account.label}</div>
                          <div className="text-[9px] mt-0.5 truncate" style={{ color: S.muted }}>外部账号关系</div>
                        </div>
                        <span className="text-[9px] font-bold truncate" style={{ color: S.textSec }} title={account.taskType}>{account.taskType}</span>
                        <span className="text-[9px] font-bold truncate" style={{ color: aiColor }} title={account.aiStatus}>{account.aiStatus}</span>
                        <select
                          aria-label={`${account.label}关系状态`}
                          value={account.objectiveStatus}
                          onChange={event => updateAccountStatus(selectedUser.rank, account.id, event.target.value as RelationshipTaskStatus)}
                          className="min-w-0 w-full px-1 py-1 text-[9px] outline-none"
                          style={{ background: "#ffffff", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}
                        >
                          {account.statusOptions.map(option => <option key={`${account.id}-${option}`} value={option}>{option}</option>)}
                        </select>
                        <span className="text-[9px] font-bold truncate" style={{ color: account.manual.status === "未操作" ? S.muted : "#008565" }} title={`${account.manual.status}${account.manual.count > 0 ? ` · ${account.manual.count}次` : ""}`}>
                          {account.manual.status}{account.manual.count > 0 ? ` · ${account.manual.count}次` : ""}
                        </span>
                        <span className="text-[9px] truncate" style={{ color: account.manual.at === "—" ? S.muted : S.textSec }} title={account.manual.at === "—" ? "未记录" : `${account.manual.operator} · ${account.manual.at}`}>
                          {account.manual.at === "—" ? "未记录" : account.manual.at}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => recordManualAction(selectedUser.rank, account.id, account.taskType === "邀请入群" ? "邀请入群" : account.taskType.includes("关注") ? "关注动作" : "添加动作")}
                            className="relative flex-1 px-1 py-1 text-[9px] font-bold truncate"
                            style={{ background: S.accentLight, color: "#5a6e00", border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}
                            title={account.taskType}
                          >
                            {account.taskType === "邀请入群" ? "入群" : account.taskType.includes("关注") ? "关注" : "添加"}
                            {account.manual.count > 0 && <span aria-label={`已点击${account.manual.count}次`} className="absolute -right-1.5 -top-1.5 min-w-3.5 h-3.5 px-0.5 flex items-center justify-center text-[8px] font-bold" style={{ background: "#dc2626", color: "#ffffff", border: "1px solid #ffffff", borderRadius: "999px", lineHeight: 1 }}>{account.manual.count}</span>}
                          </button>
                          <button
                            type="button"
                            title={`查看${account.label}操作日志`}
                            aria-label={`查看${account.label}操作日志`}
                            onClick={() => statusLog(selectedUser.name, account.label, account.id, selectedUser.rank)}
                            className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                            style={{ color: S.muted }}
                          >
                            <History size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 text-[9px]" style={{ color: S.muted }}>
                <span>关系状态可人工录入，最终结果以 AI / 外部系统同步为准</span>
                <span className="whitespace-nowrap">最近同步：{selectedMemberService.ai.updatedAt}</span>
              </div>
            </div>
          )}
        </section>
        </> : scopeCfg ? (
        /* ── 其余视角档案：与会员档案同构（头部/字段/摘要/指标/Tab 记录），仅内容不同 ── */
        <>
          <div className="p-3.5" style={{ borderBottom: `1px solid ${S.border}` }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold" style={{ color: S.text }}>{scopeCfg.panelTitle}</div>
                <div className="text-xs mt-0.5" style={{ color: S.muted }}>{scopeCfg.panelSub}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 text-xs font-bold" style={{ background: "#e8fbf4", color: "#00a978", borderRadius: "999px" }}>统一档案</span>
                <button type="button" title="收起档案栏" aria-label="收起档案栏" onClick={() => setIsProfileCollapsed(true)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <PanelRightClose size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="w-11 h-11 flex items-center justify-center text-base font-bold flex-shrink-0" style={{ background: S.accentLight, border: "1px solid rgba(204,255,0,0.45)", color: "#5a6e00", borderRadius: S.radiusSm }}>{selectedRow?.initial}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold" style={{ color: S.text }}>{targetName}</div>
                <div className="text-xs mt-0.5 font-mono truncate" style={{ color: S.muted }}>{selectedAgentProfileSub}</div>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {selectedAgentTags.map(tag => (
                    <span key={tag.label} className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold" style={{ background: tag.background, color: tag.color, borderRadius: "999px" }}>{tag.label}</span>
                  ))}
                </div>
              </div>
              <button title="查看档案二维码" aria-label="查看档案二维码" onClick={() => showProfileNotice(`已生成 ${targetName} 的档案二维码`)} className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: S.accentLight, border: "1px solid rgba(204,255,0,0.5)", borderRadius: S.radiusSm }}>
                <QrCode size={17} style={{ color: "#1e293b" }} />
              </button>
            </div>
            {profileNotice && <div role="status" className="mt-3 px-2.5 py-2 text-xs font-bold" style={{ background: S.accentLight, color: S.text, borderLeft: `2px solid ${S.accent}` }}>{profileNotice}</div>}
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${S.border}` }}>
              <div className="grid grid-cols-2 gap-x-5">
                {selectedAgentProfileFields.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-2 py-1" style={{ borderBottom: `1px solid ${S.border}` }}>
                    <span className="text-xs" style={{ color: S.muted }}>{label}</span>
                    <span className="text-xs font-bold truncate text-right" style={{ color: S.textSec }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-3.5 py-3" style={{ borderBottom: `1px solid ${S.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: S.text }}>经营摘要</span>
              <span className="text-xs" style={{ color: S.muted }}>同步于 今天 10:42</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {selectedAgentSummary.map(([label, value, color]) => (
                <div key={label} className="min-w-0">
                  <div className="text-xs truncate" style={{ color: S.muted }}>{label}</div>
                  <div className="text-sm font-bold mt-1 truncate" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <section className="px-3.5 py-3" style={{ borderBottom: `1px solid ${S.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: S.text }}>分层指标</span>
              <span className="text-xs" style={{ color: S.muted }}>基于运营数据计算</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 mt-3">
              {scopeCfg.metrics.map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between gap-2 py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                  <span className="text-xs" style={{ color: S.muted }}>{label}</span><span className="text-xs font-bold text-right" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {isAgentScope && <section className="px-3.5 py-3" style={{ borderBottom: `1px solid ${S.border}` }}>
            {!selectedTrainingRecord ? (
              <div className="px-2.5 py-2 text-[10px] leading-relaxed" style={{ background: "#f8fafc", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                当前代理暂无培训记录
              </div>
            ) : <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold" style={{ color: S.text }}>培训总览</span>
                <span className="text-[10px]" style={{ color: selectedTrainingRecord.riskStatus === "high" ? "#c2410c" : selectedTrainingRecord.riskStatus === "attention" ? "#e77800" : "#008565" }}>{selectedTrainingRecord.riskStatus === "none" ? "进度正常" : selectedTrainingRecord.riskReason}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="px-2.5 py-2" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>当前阶段</div><div className="text-sm font-bold mt-1" style={{ color: S.text }}>{selectedTrainingRecord.currentStage} · {agentTrainingStageMeta[selectedTrainingRecord.currentStage].label}</div></div>
                <div className="px-2.5 py-2" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>阶段进度</div><div className="text-sm font-bold mt-1" style={{ color: "#2385c8" }}>{selectedTrainingRecord.stageProgress}%</div></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 mt-2">
                <div className="flex items-center justify-between py-1.5 text-[10px]" style={{ borderBottom: `1px solid ${S.border}` }}><span style={{ color: S.muted }}>课程完成</span><b style={{ color: S.textSec }}>{selectedTrainingRecord.courseProgress.completed}/{selectedTrainingRecord.courseProgress.total}</b></div>
                <div className="flex items-center justify-between py-1.5 text-[10px]" style={{ borderBottom: `1px solid ${S.border}` }}><span style={{ color: S.muted }}>实训通过</span><b style={{ color: S.textSec }}>{selectedTrainingRecord.practicalProgress.passed}/{selectedTrainingRecord.practicalProgress.total}</b></div>
              </div>
            </>}
          </section>}
          <div className="flex items-center gap-0 px-3.5 pt-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
            {scopeCfg.profileTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveProfileTab(tab)}
                className="flex-1 px-1 py-2 text-[11px] font-bold whitespace-nowrap transition-all"
                style={{
                  color: activeProfileTab === tab ? S.text : S.muted,
                  borderBottom: activeProfileTab === tab ? `2px solid ${S.accent}` : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <section className="px-3.5 py-2.5">
            {dataScope === "community" && activeProfileTab === "群资产配置" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div><div className="text-xs font-bold" style={{ color: S.text }}>群资产配置</div><div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>归属、容量与同步动作在运营档案内统一维护</div></div>
                  <button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: editingGroupAsset ? S.accentLight : "#1e293b", color: editingGroupAsset ? S.textSec : S.accent, border: `1px solid ${editingGroupAsset ? S.accentMid : "#1e293b"}`, borderRadius: S.radiusSm }} onClick={() => { if (editingGroupAsset) showProfileNotice("群资产配置已保存"); setEditingGroupAsset(value => !value); }}>{editingGroupAsset ? "保存配置" : "编辑配置"}</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["所属微信号", "wechat", ["FLM001", "FLM002", "FLM003"]],
                    ["专属服务官", "serviceOfficer", ["林小燕", "吴思远", "刘刚", "陈明"]],
                    ["群容量", "capacity", ["200", "500", "1000"]],
                    ["群状态", "status", ["正常", "待交接", "暂停运营"]],
                  ].map(([label, key, options]) => <label key={key} className="block"><span className="block mb-1 text-[10px]" style={{ color: S.muted }}>{label}</span><select disabled={!editingGroupAsset} value={groupAsset[key as keyof typeof groupAsset]} onChange={event => setGroupAsset(current => ({ ...current, [key]: event.target.value }))} className="w-full px-2 py-1.5 text-xs outline-none" style={{ background: editingGroupAsset ? S.bg : "#f8fafc", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>{(options as string[]).map(option => <option key={option}>{option}</option>)}</select></label>)}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold" style={{ background: S.accentLight, color: S.text, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }} onClick={() => showProfileNotice(`${targetName} 的群二维码更新任务已创建`)}><QrCode size={13} />更新群二维码</button>
                  <button type="button" className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => showProfileNotice(`${targetName} 正在同步成员名单`)}><RefreshCw size={13} />同步成员名单</button>
                  <button type="button" className="col-span-2 flex items-center justify-center gap-1.5 py-2 text-xs font-bold" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => showProfileNotice(`已为 ${targetName} 创建承接新群草稿`)}><GitBranch size={13} />创建承接新群</button>
                </div>
                <div className="px-2.5 py-2 text-[10px] leading-relaxed" style={{ background: "#fff8e8", color: "#9a5a00", border: "1px solid #f2d6a0", borderRadius: S.radiusSm }}>群满员或状态异常时，先创建承接新群；原群成员与运营记录仍保留在当前档案中。</div>
              </div>
            ) : dataScope === "agent" && activeProfileTab === "培训记录" ? (
              !selectedTrainingRecord ? (
                <div className="px-3 py-5 text-center text-[11px]" style={{ color: S.muted }}>当前代理暂无培训记录</div>
              ) : <div className="space-y-2">
                <div className="px-2.5 py-2 text-[10px] leading-relaxed" style={{ background: S.accentLight, color: S.textSec, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>{agentTrainingStageMeta[selectedTrainingRecord.currentStage].description}</div>
                {selectedTrainingTasks.map(task => {
                  const statusMeta = trainingTaskStatusMeta[task.status];
                  const statusColor = task.status === "passed" ? "#008565" : task.status === "overdue" ? "#c2410c" : task.status === "needs_revision" ? "#e77800" : "#2385c8";
                  return <div key={task.id} className="py-2" style={{ borderBottom: `1px solid ${S.border}` }}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{task.title}</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>{task.stage} · 截止 {task.dueAt}</div></div><span className="text-[10px] font-bold whitespace-nowrap" style={{ color: statusColor }}>{statusMeta.label}</span></div><div className="flex items-center justify-between mt-1.5"><span className="text-[10px] truncate" style={{ color: S.muted }}>{task.nextAction}</span><button type="button" onClick={() => showProfileNotice(`已打开培训任务：${task.title}`)} className="text-[10px] font-bold" style={{ color: "#6db100" }}>处理</button></div></div>;
                })}
                {selectedTrainingTasks.length === 0 && <div className="px-3 py-5 text-center text-[11px]" style={{ color: S.muted }}>暂无培训任务</div>}
              </div>
            ) : (
              <>
            {(scopeCfg.profileRecords[activeProfileTab] ?? []).map(record => (
              <div key={record.title} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
                <Clock size={12} className="flex-shrink-0" style={{ color: "#6db100" }} />
                <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{record.title}</div><div className="text-[11px] truncate" style={{ color: S.muted }}>{record.desc}</div></div>
                <span className="text-[11px] font-bold" style={{ color: record.status.includes("待") || record.status.includes("预警") ? "#e77800" : "#00a978" }}>{record.status}</span>
              </div>
            ))}
            {(scopeCfg.profileRecords[activeProfileTab] ?? []).length === 0 && (
              <div className="px-3 py-5 text-center text-[11px]" style={{ color: S.muted }}>暂无「{activeProfileTab}」记录</div>
            )}
              </>
            )}
          </section>
        </>
        ) : null}

      </aside> : (
        <div className="w-9 flex-shrink-0 flex items-start justify-center pt-3" style={{ background: S.surface, borderLeft: `1px solid ${S.border}` }}>
          <button type="button" title="展开会员档案栏" aria-label="展开会员档案栏" onClick={() => setIsProfileCollapsed(false)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            <PanelRightOpen size={14} />
          </button>
        </div>
      )}

      {isPersonalQrOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.42)" }} onMouseDown={event => { if (event.target === event.currentTarget) setIsPersonalQrOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="member-personal-qr-title" className="w-full max-w-[400px] overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg, boxShadow: "0 22px 68px rgba(15,23,42,0.28)" }}>
            <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="min-w-0"><div id="member-personal-qr-title" className="text-sm font-bold" style={{ color: S.text }}>个微二维码</div><div className="mt-1 text-[11px] truncate" style={{ color: S.muted }}>添加 {selectedUser.name} 的个人微信</div></div>
              <button type="button" title="关闭个微二维码" aria-label="关闭个微二维码" onClick={() => setIsPersonalQrOpen(false)} className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 px-3 py-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}>
                <img src={getAvatar(selectedUser.rank - 1)} alt={selectedUser.name} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover" }} />
                <div className="min-w-0"><div className="text-xs font-bold truncate" style={{ color: S.text }}>{selectedUser.name}</div><div className="mt-0.5 text-[11px] truncate" style={{ color: S.muted }}>微信号：{selectedUser.wechat} · {selectedUser.city}</div></div>
              </div>
              <div className="mx-auto my-5 grid h-60 w-60 place-items-center" style={{ background: "#ffffff", border: `10px solid #ffffff`, outline: `1px solid ${S.borderMed}`, borderRadius: S.radius, color: S.text }}>
                <QrCode size={176} strokeWidth={1.15} />
              </div>
              <div className="text-center text-xs font-bold" style={{ color: S.textSec }}>请使用微信扫一扫添加个微</div>
              <div className="mt-1 text-center text-[10px] leading-relaxed" style={{ color: S.muted }}>二维码由会员微信管理同步，失效后请重新打开查看。</div>
            </div>
            <div className="px-5 py-4" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" onClick={() => setIsPersonalQrOpen(false)} className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}>完成</button></div>
          </section>
        </div>
      )}

      {activeLog && (() => {
        const service = memberServiceForUser(activeLog.rank);
        const account = service.accounts.find(item => item.id === activeLog.key);
        const action = service.actions[activeLog.key] ?? account?.manual ?? emptyManualAction();
        const logs = action.logs ?? [];
        const currentStatus = account?.objectiveStatus
          ?? (activeLog.key === "personal" || activeLog.key === "enterprise" || activeLog.key === "group"
            ? statusValue(activeLog.rank, activeLog.key)
            : "未记录");
        return <>
          <button type="button" aria-label="关闭操作日志" onClick={() => setActiveLog(null)} className="fixed inset-0 z-[60]" style={{ background: "rgba(15,23,42,0.22)" }} />
          <section role="dialog" aria-modal="true" aria-label={`${activeLog.name} ${activeLog.label}操作日志`} className="fixed left-1/2 top-1/2 z-[70] w-[min(460px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 16px 40px rgba(15,23,42,0.18)" }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="min-w-0"><div className="text-sm font-bold truncate" style={{ color: S.text }}>{activeLog.label}操作日志</div><div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>{activeLog.name} · {service.ai.device}</div></div>
              <button type="button" title="关闭" aria-label="关闭" onClick={() => setActiveLog(null)} className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="px-2.5 py-2" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>当前关系</div><div className="text-xs font-bold mt-1" style={{ color: S.text }}>{currentStatus}</div></div>
                <div className="px-2.5 py-2" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>累计动作</div><div className="text-xs font-bold mt-1" style={{ color: S.text }}>{action.count} 次</div></div>
                <div className="px-2.5 py-2" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>AI同步</div><div className="text-xs font-bold mt-1" style={{ color: service.ai.status === "已完成" ? "#008565" : "#d97706" }}>{service.ai.status}</div></div>
              </div>
              <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold" style={{ color: S.text }}>完整人工记录</span><span className="text-[10px]" style={{ color: S.muted }}>当前状态：{action.status}</span></div>
              <div className="max-h-64 overflow-auto" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                {logs.length > 0 ? logs.map((log, index) => (
                   <div key={`${log.at}-${index}`} className="px-3 py-2.5" style={{ borderBottom: index < logs.length - 1 ? `1px solid ${S.border}` : "none" }}>
                    <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold" style={{ color: S.text }}>{log.action}</span><span className="text-[10px]" style={{ color: S.muted }}>{log.at}</span></div>
                    <div className="flex items-center justify-between gap-2 mt-1 text-[10px]" style={{ color: S.muted }}><span>操作人：{log.operator}</span><span>人工状态：{log.status}</span></div>
                  </div>
                )) : <div className="px-3 py-6 text-center text-[11px]" style={{ color: S.muted }}>暂无人工操作记录</div>}
              </div>
              <div className="mt-3 text-[10px] leading-relaxed" style={{ color: S.muted }}>关系状态由 AI / 外部系统同步确认，人工点击仅记录工作人员执行过的动作。</div>
            </div>
          </section>
        </>;
      })()}
      {relationshipMember !== null && relationshipDraft && (() => {
        const member = rankingData.find(item => item.rank === relationshipMember) ?? rankingData[0];
        const ai = relationshipForRank(relationshipMember);
        const hasConflict = relationshipDraft.personal !== ai.personal || relationshipDraft.enterprise !== ai.enterprise || relationshipDraft.group !== ai.group;
        return <>
          <button type="button" aria-label="关闭关系处理" onClick={() => { setRelationshipMember(null); setRelationshipDraft(null); }} className="fixed inset-0 z-40" style={{ background: "rgba(15,23,42,0.18)" }} />
          <aside className="fixed inset-y-0 right-0 z-50 w-[min(380px,92vw)] flex flex-col" style={{ background: S.surface, borderLeft: `1px solid ${S.border}`, boxShadow: "-8px 0 24px rgba(15,23,42,0.12)" }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${S.border}` }}><div><div className="text-sm font-bold" style={{ color: S.text }}>处理会员关系</div><div className="text-[10px] mt-0.5" style={{ color: S.muted }}>{member.name} · {member.wechat}</div></div><button type="button" title="关闭" aria-label="关闭" onClick={() => { setRelationshipMember(null); setRelationshipDraft(null); }} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><X size={14} /></button></div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2"><div className="px-3 py-2" style={{ background: S.accentLight, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>累计消费</div><div className="text-base font-bold mt-1" style={{ color: "#c2410c" }}>{relationshipDraft.spend}</div></div><div className="px-3 py-2" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>会员级别</div><div className="text-xs font-bold mt-1" style={{ color: S.text }}>{memberLevelForRank(member.rank)}</div></div></div>
              <div className="px-3 py-2 text-[10px] leading-relaxed" style={{ background: hasConflict ? "#fff7ed" : "#e8fbf4", color: hasConflict ? "#9a3412" : "#008565", border: `1px solid ${hasConflict ? "#fed7aa" : "#b7ead7"}`, borderRadius: S.radiusSm }}><b>AI 对比：</b>{hasConflict ? "检测到人工状态与 AI 识别不一致，请确认后保存。" : "人工状态与 AI 识别一致。"}<span className="block mt-1">AI 识别：个微 {ai.personal} · 企微 {ai.enterprise} · 入群 {ai.group}</span></div>
              <div className="grid grid-cols-3 gap-2">{([['个微好友', 'personal'], ['企微好友', 'enterprise'], ['入群状态', 'group'] ] as const).map(([label, key]) => { const value = relationshipDraft[key]; const action = memberServiceForUser(member.rank).actions[key]; return <div key={label} className="px-2.5 py-2" style={{ background: '#f8fafc', border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="text-xs font-bold mt-1 truncate" style={{ color: value === '已入群' || value === '已通过' ? '#008565' : '#c2410c' }}>{value}</div><button type="button" onClick={() => recordManualAction(member.rank, key)} className="mt-1 px-1.5 py-1 text-[9px] font-bold" style={{ background: S.accentLight, color: S.text, borderRadius: S.radiusSm }}>操作{action.count > 0 ? ` [${action.count}]` : ''}</button><div className="text-[9px] mt-1 truncate" style={{ color: S.muted }}>人工：{action.status} · {action.operator}</div><div className="text-[9px] truncate" style={{ color: S.muted }}>{action.at}</div></div>; })}</div>
              <section className="px-3 py-2" style={{ background: '#f8fafc', border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="flex items-center justify-between gap-2 mb-1.5"><span className="text-[10px] font-bold" style={{ color: S.text }}>官方账号服务任务</span><button type="button" onClick={() => refreshMemberAiData(member.rank)} className="text-[9px] font-bold" style={{ color: '#6db100' }}>更新 AI</button></div>{memberServiceForUser(member.rank).accounts.map(account => <div key={account.id} className="flex items-center gap-2 py-1" style={{ borderTop: `1px solid ${S.border}` }}><span className="flex-1 min-w-0 text-[10px] truncate" style={{ color: S.textSec }}>{account.label}</span><span className="text-[9px] font-bold" style={{ color: account.aiStatus === '已关注' ? '#008565' : account.aiStatus === '未关注' ? '#c2410c' : '#e77800' }}>{account.aiStatus}</span><button type="button" onClick={() => recordManualAction(member.rank, account.id, account.taskType === '邀请入群' ? '邀请入群' : account.taskType.includes('关注') ? '关注动作' : '添加动作')} className="px-1 py-0.5 text-[9px] font-bold" style={{ background: S.accentLight, color: S.text, borderRadius: S.radiusSm }}>{account.taskType === '邀请入群' ? '入群' : account.taskType.includes('关注') ? '关注' : '添加'}{account.manual.count > 0 ? ` [${account.manual.count}]` : ''}</button></div>)}</section>
              <div className="px-3 py-2 text-[10px] leading-relaxed" style={{ background: "#f8fafc", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>保存后会记录人工处理人和时间；AI 识别结果保留用于后续复核，不会覆盖人工状态。</div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${S.border}` }}><button type="button" onClick={() => { setRelationshipDraft({ ...ai }); showProfileNotice("已恢复 AI 识别状态"); }} className="flex-1 py-2 text-xs font-bold" style={{ background: "#f1f5f9", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>采用 AI 结果</button><button type="button" onClick={() => { setRelationshipOverrides(current => ({ ...current, [relationshipMember]: relationshipDraft })); setRelationshipMember(null); setRelationshipDraft(null); showProfileNotice(`已保存 ${member.name} 的关系状态`); }} className="flex-1 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>保存人工状态</button></div>
          </aside>
        </>;
      })()}
    </div>
  );
}
