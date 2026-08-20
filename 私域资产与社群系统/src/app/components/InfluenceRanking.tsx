import { useState } from "react";
import { Search, QrCode, ChevronRight, TrendingUp, Clock, Send, Plus, X, Tags, Package, Truck, MessageSquare, CalendarDays, ClipboardCheck, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { getAvatar } from "./Avatar";

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

// ─── 模拟数据 ─────────────────────────────────────────────────
const taskCategories = [
  { label: "待处理的任务", count: 12, active: true },
  { label: "我发布的任务", count: 5 },
  { label: "朋友圈的任务", count: 28 },
  { label: "附近的任务", count: 7 },
];

const rankingTabs = ["待处理的任务", "全部任务", "我发布的任务", "回购任务", "关注任务", "收费任务"];
const profileTabs = ["待处理", "订单详情", "历史操作记录", "回访单"];
const orderStatusTabs = ["所有订单", "待付款", "待发货", "待收货", "已完成", "退款/换货"];
const operationTabs = [
  { id: "issue", label: "问题登记", icon: MessageSquare },
  { id: "push", label: "推送任务", icon: Send },
  { id: "activity", label: "活动运营", icon: CalendarDays },
  { id: "moments", label: "朋友圈", icon: ClipboardCheck },
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

const taskSideList = [
  { title: "蜂乐玛产品下午3点代发",  time: "2026-07-05 14:30", status: "进行中", unread: 3 },
  { title: "晒单截图任务-7月第二周",  time: "2026-07-04 10:00", status: "待处理", unread: 1 },
  { title: "朋友圈转发活动邀请",      time: "2026-07-03 09:00", status: "进行中", unread: 0 },
  { title: "评论互动任务-体验官群",   time: "2026-07-02 16:00", status: "已完成", unread: 0 },
  { title: "拉新任务-北京PRO群",      time: "2026-07-01 11:00", status: "进行中", unread: 2 },
];

const taskLists = {
  "待处理的任务": taskSideList,
  "我发布的任务": [
    { title: "PRO会员续费提醒", time: "2026-07-05 15:00", status: "进行中", unread: 2 },
    { title: "晒单截图任务-7月第二周", time: "2026-07-04 10:00", status: "待处理", unread: 1 },
  ],
  "朋友圈的任务": [
    { title: "朋友圈转发活动邀请", time: "2026-07-03 09:00", status: "进行中", unread: 0 },
    { title: "评论互动任务-体验官群", time: "2026-07-02 16:00", status: "已完成", unread: 0 },
  ],
  "附近的任务": [
    { title: "拉新任务-北京PRO群", time: "2026-07-01 11:00", status: "进行中", unread: 2 },
    { title: "北京朝阳线下活动", time: "2026-07-06 09:30", status: "待处理", unread: 1 },
  ],
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
const relationTree = {
  name: "皮卡丘", level: 1,
  children: [
    {
      name: "蜂乐玛产品下午3...", level: 2,
      children: [
        { name: "蜂乐玛产品下午3...", level: 3, children: [
          { name: "蜂乐玛产品(0人)", level: 4, children: [] },
          { name: "蜂乐玛体验(0人)", level: 4, children: [] },
        ] },
        { name: "梓几", level: 3, children: [
          { name: "梓几(0人)", level: 4, children: [] },
        ] },
      ]
    },
    { name: "海槽", level: 2, children: [{ name: "海槽(0人)", level: 4, children: [] }] },
  ]
};

function TreeNode({ node, depth = 0 }: { node: typeof relationTree; depth?: number }) {
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
        <div className="w-2 h-2 flex-shrink-0" style={{ background: depth === 0 ? S.accent : S.mutedLight, borderRadius: "50%" }} />
        <span className="text-xs font-mono" style={{ color: depth === 0 ? S.text : S.textSec }}>{node.name}</span>
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
  if (status === "已完成") return { bg: S.accent, color: "#000" };
  if (status === "进行中") return { bg: "#f0f0f0", color: "#333333" };
  return { bg: "#ffd600", color: "#000" };
};

// ─── 主组件 ───────────────────────────────────────────────────
export default function InfluenceRanking() {
  const [activeTab, setActiveTab] = useState(rankingTabs[0]);
  const [selectedUser, setSelectedUser] = useState(rankingData[0]);
  const [activeTaskCategory, setActiveTaskCategory] = useState(taskCategories[0].label);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [profileNotice, setProfileNotice] = useState("");
  const [memberTags, setMemberTags] = useState<Record<number, MemberTag[]>>(initialMemberTags);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState("全部");
  const [activeProfileTab, setActiveProfileTab] = useState(profileTabs[0]);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [isTaskPanelCollapsed, setIsTaskPanelCollapsed] = useState(false);
  const [activeOrderStatus, setActiveOrderStatus] = useState(orderStatusTabs[0]);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string | null>(null);
  const [orderSearchInput, setOrderSearchInput] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderDateRange, setOrderDateRange] = useState("全部日期");
  const [activeOperation, setActiveOperation] = useState<(typeof operationTabs)[number]["id"]>("issue");

  const showProfileNotice = (notice: string) => {
    setProfileNotice(notice);
    window.setTimeout(() => setProfileNotice(""), 2200);
  };

  const selectedTags = memberTags[selectedUser.rank] ?? defaultMemberTags;
  const visibleTaskList = taskLists[activeTaskCategory as keyof typeof taskLists] ?? taskSideList;
  const tagFilters = ["全部", ...Array.from(new Set(Object.values(memberTags).flat().map(tag => tag.label)))];
  const filteredRankingData = activeTagFilter === "全部"
    ? rankingData
    : rankingData.filter(user => (memberTags[user.rank] ?? []).some(tag => tag.label === activeTagFilter));
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
          {!isTaskPanelCollapsed && <div className="text-sm font-bold" style={{ color: S.text }}>任务中心</div>}
          <button type="button" title={isTaskPanelCollapsed ? "展开任务中心" : "收起任务中心"} aria-label={isTaskPanelCollapsed ? "展开任务中心" : "收起任务中心"} onClick={() => setIsTaskPanelCollapsed(value => !value)} className="w-6 h-6 flex items-center justify-center" style={{ color: S.muted }}>
            {isTaskPanelCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {!isTaskPanelCollapsed && <>
        {/* 任务分类 */}
        <div className="px-3 py-2 flex-shrink-0">
          {taskCategories.map((c, i) => (
            <button key={i} className="w-full flex items-center justify-between px-2 py-2 text-left mb-0.5 transition-all" style={{
              background: activeTaskCategory === c.label ? S.accentLight : "transparent",
              borderRadius: S.radiusSm,
              border: activeTaskCategory === c.label ? `1px solid ${S.accent}` : "1px solid transparent",
            }} onClick={() => { setActiveTaskCategory(c.label); setSelectedTaskIndex(0); if (c.label === "待处理的任务") { setActiveProfileTab("待处理"); setSelectedOrderNo(null); } }}>
              <span className="text-xs font-mono" style={{ color: activeTaskCategory === c.label ? S.text : S.muted }}>{c.label}</span>
              <span className="px-1.5 py-0.5 text-xs font-bold" style={{
                background: activeTaskCategory === c.label ? S.accent : "rgba(0,0,0,0.06)",
                color: activeTaskCategory === c.label ? "#000" : S.muted,
                borderRadius: S.radiusSm,
              }}>{c.count}</span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, margin: "0 12px" }} />

        {/* 任务列表 */}
        <div className="flex-1 overflow-auto px-3 py-2 space-y-1">
          {visibleTaskList.map((t, i) => (
            <div key={i} className="px-2 py-2.5 cursor-pointer transition-all" style={{
              background: selectedTaskIndex === i ? S.accentLight : S.surface,
              border: selectedTaskIndex === i ? `1px solid rgba(204,255,0,0.4)` : `1px solid ${S.border}`,
              borderRadius: S.radius,
            }} onClick={() => setSelectedTaskIndex(i)}>
              <div className="flex items-start justify-between gap-1">
                <span className="text-xs font-bold leading-tight font-mono" style={{ color: S.text }}>{t.title}</span>
                {t.unread > 0 && <span className="w-4 h-4 bg-red-500 text-white flex items-center justify-center flex-shrink-0" style={{ fontSize: "9px", borderRadius: "50%" }}>{t.unread}</span>}
              </div>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 排行榜 Tab */}
        <div className="flex items-center gap-1 px-4 pt-4 flex-shrink-0 flex-wrap">
          {rankingTabs.map(t => (
            <button key={t} className="px-3 py-1.5 text-xs transition-all font-bold" style={{
              background: activeTab === t ? "#0d0d0d" : S.surface,
              color: activeTab === t ? S.accent : S.muted,
              border: `1px solid ${activeTab === t ? "#0d0d0d" : S.border}`,
              borderRadius: S.radiusSm,
            }} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2 overflow-x-auto flex-shrink-0" aria-label="排行时间筛选">
          <span className="text-xs whitespace-nowrap" style={{ color: S.muted }}>排行时间</span>
          <select className="px-2.5 py-1.5 text-xs outline-none" defaultValue="本周" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }}>
            <option>今日排行</option>
            <option>本周排行</option>
            <option>本月排行</option>
            <option>总排行</option>
          </select>
          <select className="px-2.5 py-1.5 text-xs outline-none" defaultValue="全部年份" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>
            <option>全部年份</option>
            <option>2026</option>
            <option>2025</option>
          </select>
          <select className="px-2.5 py-1.5 text-xs outline-none" defaultValue="全部月份" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>
            <option>全部月份</option>
            <option>1 月</option>
            <option>2 月</option>
            <option>3 月</option>
            <option>4 月</option>
            <option>5 月</option>
            <option>6 月</option>
            <option>7 月</option>
          </select>
          <button onClick={() => showProfileNotice("排行筛选已应用")} className="px-2.5 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>应用筛选</button>
          <button onClick={() => showProfileNotice("排行筛选已重置")} className="px-2.5 py-1.5 text-xs" style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>重置</button>
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2 overflow-x-auto flex-shrink-0" aria-label="按画像标签筛选会员">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" style={{ color: S.textSec }}>
            <Tags size={13} style={{ color: "#6db100" }} />按画像筛选
          </span>
          {tagFilters.map(label => {
            const isActive = activeTagFilter === label;
            return (
              <button
                key={label}
                onClick={() => setActiveTagFilter(label)}
                className="px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
                style={{
                  background: isActive ? S.accent : S.surface,
                  color: isActive ? "#000" : S.muted,
                  border: `1px solid ${isActive ? S.accent : S.border}`,
                  borderRadius: "999px",
                }}
              >
                {label}
              </button>
            );
          })}
          <span className="ml-auto text-xs whitespace-nowrap" style={{ color: S.muted }}>{filteredRankingData.length} 位会员</span>
        </div>

        {/* 排行榜表格 */}
        <div className="mx-4 mt-3 overflow-x-auto overflow-y-hidden flex-shrink-0" aria-label="会员排行横向滚动表格" style={{
          background: S.surface,
          border: `1px solid ${S.border}`,
          borderRadius: S.radius,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          scrollbarWidth: "thin",
        }}>
          <div className="flex items-center px-3 py-2 text-xs font-bold font-mono" style={{ minWidth: 900, background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555555", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            {[["排名",44],["头像",44],["排名",44],["微信名",100],["性别",44],["城市",90],["职业",80],["进群",44],["待处理",64],["发布",54],["完成",54],["总用户",68],["影响力",68],["评分",64]].map(([l,w]) => (
              <div key={`h-${l}-${w}`} className="flex-shrink-0" style={{ width: w as number }}>{l}</div>
            ))}
          </div>
          {filteredRankingData.map((u, idx) => (
            <div key={u.rank} className="flex items-center px-3 py-2.5 cursor-pointer text-xs transition-all font-mono" style={{
              minWidth: 900,
              background: selectedUser.rank === u.rank ? S.accentLight : idx % 2 === 0 ? "#ffffff" : "#fafaf8",
              borderBottom: `1px solid ${S.border}`,
              borderLeft: selectedUser.rank === u.rank ? `3px solid ${S.accent}` : "3px solid transparent",
            }} onClick={() => setSelectedUser(u)}>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: u.rank <= 3 ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: u.rank <= 3 ? S.accent : S.textSec, borderRadius: S.radiusSm }}>{u.rank}</div>
              </div>
              <div className="flex-shrink-0" style={{ width: 44 }}>
                <img src={getAvatar(u.rank - 1)} alt={u.name} style={{ width: 28, height: 28, borderRadius: S.radiusSm, objectFit: "cover" }} />
              </div>
              <div className="flex-shrink-0 font-bold" style={{ width: 44, color: S.textSec }}>#{u.rank}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 100, color: S.text }}>{u.name}</div>
              <div className="flex-shrink-0" style={{ width: 44, color: S.textSec }}>{u.gender}</div>
              <div className="flex-shrink-0" style={{ width: 90, color: S.muted }}>{u.city}</div>
              <div className="flex-shrink-0" style={{ width: 80, color: S.muted }}>{u.job}</div>
              <div className="flex-shrink-0" style={{ width: 44, color: S.text }}>{u.inGroup}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 64, color: S.text }}>{u.pendingCount}</div>
              <div className="flex-shrink-0" style={{ width: 54, color: S.muted }}>{u.publishCount}</div>
              <div className="flex-shrink-0" style={{ width: 54, color: S.text }}>{u.completedCount}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 68, color: S.text }}>{u.totalUsers.toLocaleString()}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 68, color: S.text }}>{u.influence.toLocaleString()}</div>
              <div className="flex-shrink-0 font-bold" style={{ width: 64, color: S.text }}>{u.score.toLocaleString()}</div>
            </div>
          ))}
          {filteredRankingData.length === 0 && (
            <div className="px-3 py-8 text-center text-xs" style={{ color: S.muted }}>暂无匹配该标签的会员</div>
          )}
        </div>

        {/* 底部：关系链 + 朋友圈操作 */}
        <div className="flex gap-3 mx-4 mt-3 flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-4">
          {/* 关系链 */}
          <div className="p-4 overflow-auto flex-shrink-0" style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: S.radius,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            width: "min(52%, 560px)",
            minWidth: "320px",
            maxWidth: "calc(100% - 224px)",
            resize: "horizontal",
          }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: S.text }} />
              <span className="text-sm font-bold" style={{ color: S.text }}>关系链</span>
              <span className="text-xs font-mono" style={{ color: S.muted, fontSize: "10px" }}>拖拽右下角调整宽度</span>
              <div className="ml-auto flex items-center gap-2 px-2.5 py-1.5" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <Search size={11} style={{ color: S.muted }} />
                <input className="bg-transparent outline-none text-xs w-20 font-mono" style={{ color: S.textSec }} placeholder="搜索..." />
              </div>
            </div>
            <TreeNode node={relationTree} />
          </div>

          {/* 统一运营操作台 */}
          <div className="flex-1 min-w-[360px] p-4 flex flex-col gap-3 overflow-auto" style={{
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderRadius: S.radius,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold" style={{ color: S.text }}>运营操作台</div>
                <span className="text-xs" style={{ color: S.muted }}>针对 {selectedUser.name} 登记问题或发起运营动作</span>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold whitespace-nowrap" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: "999px" }}>当前会员</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist" aria-label="运营操作类型">
              {operationTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeOperation === tab.id;
                return <button key={tab.id} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveOperation(tab.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap" style={{ background: isActive ? "#0d0d0d" : "#f7f7f7", color: isActive ? S.accent : S.muted, border: `1px solid ${isActive ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><Icon size={12} />{tab.label}</button>;
              })}
            </div>

            {activeOperation === "issue" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>问题分类</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="售后问题" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>售后问题</option><option>产品咨询</option><option>社群服务</option><option>投诉建议</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>处理部门</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="会员运营部" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>会员运营部</option><option>客服部</option><option>社群运营部</option><option>财务部</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>优先级</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="重要" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>普通</option><option>重要</option><option>紧急</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>指派处理人</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="吴思远" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>吴思远</option><option>林小燕</option><option>客服组</option></select></div>
              </div>
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder={`登记 ${selectedUser.name} 的问题描述...`} />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f0f0ec", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>清空</button><button onClick={() => showProfileNotice(`已登记 ${selectedUser.name} 的问题并指派至会员运营部`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><ClipboardCheck size={11} className="inline mr-1" />登记并指派</button></div>
            </>}

            {activeOperation === "push" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>任务类型</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="会员触达" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>会员触达</option><option>服务提醒</option><option>回访任务</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>目标对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
              </div>
              <input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入任务标题..." />
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="填写推送内容或任务要求..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f0f0ec", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>取消</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建推送任务`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><Send size={11} className="inline mr-1" />创建推送任务</button></div>
            </>}

            {activeOperation === "activity" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>活动类型</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="课程活动" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>课程活动</option><option>线下沙龙</option><option>打卡挑战</option><option>会员福利</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>参与对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
              </div>
              <input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入活动名称..." />
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="填写活动说明、时间和报名要求..." />
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f0f0ec", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>取消</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建活动运营任务`)} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><CalendarDays size={11} className="inline mr-1" />创建活动任务</button></div>
            </>}

            {activeOperation === "moments" && <>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>发文字</label><input className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="输入朋友圈文案..." /></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>目标对象</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="当前会员" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>当前会员</option><option>所在社群</option><option>指定标签会员</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>推送平台</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="朋友圈" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>朋友圈</option><option>微信群</option><option>企业微信</option></select></div>
                <div><label className="block text-xs mb-1 font-mono" style={{ color: S.muted }}>时间提醒</label><select className="w-full px-2.5 py-1.5 text-xs outline-none font-mono" defaultValue="立即发布" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }}><option>立即发布</option><option>今天 18:00</option><option>明天 09:00</option></select></div>
              </div>
              <textarea className="w-full min-h-[72px] px-2.5 py-2 text-xs outline-none resize-y font-mono" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="补充本次朋友圈运营动作说明..." />
              <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="w-20 h-12 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.04)", border: `1px dashed rgba(0,0,0,0.10)`, borderRadius: S.radiusSm }}><span className="text-2xl" style={{ color: S.mutedLight }}>+</span></div><span className="text-xs" style={{ color: S.muted }}>添加图片（最多 9 张）</span></div>
              <div className="flex gap-2 mt-auto"><button className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#f0f0ec", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>清空</button><button onClick={() => showProfileNotice("朋友圈发布任务已创建")} className="flex-1 py-2 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, border: "none" }}><Send size={11} className="inline mr-1" />发布</button></div>
            </>}
          </div>
        </div>
      </div>

      {/* ── 右侧会员档案：资料、画像与权益在同一信息流中展示 ───── */}
      {!isProfileCollapsed ? <aside className="flex-shrink-0 overflow-auto transition-all duration-200" style={{ width: "clamp(292px, 22vw, 350px)", background: S.surface, borderLeft: `1px solid ${S.border}` }}>
        <div className="p-3.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold" style={{ color: S.text }}>会员档案</div>
              <div className="text-xs mt-0.5" style={{ color: S.muted }}>统一承载资料、画像与权益</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-1 text-xs font-bold" style={{ background: "#e8fbf4", color: "#00a978", borderRadius: "999px" }}>统一档案</span>
              <button type="button" title="收起会员档案栏" aria-label="收起会员档案栏" onClick={() => setIsProfileCollapsed(true)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                <PanelRightClose size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <img src={getAvatar(selectedUser.rank - 1)} alt={selectedUser.name} style={{ width: 44, height: 44, borderRadius: S.radiusSm, objectFit: "cover", flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold" style={{ color: S.text }}>{selectedUser.name}</div>
              <div className="text-xs mt-0.5 font-mono truncate" style={{ color: S.muted }}>{selectedUser.wechat} · {selectedUser.city}</div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {selectedTags.map(({ label, background, color }) => (
                  <span key={label} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold" style={{ background, color, borderRadius: "999px" }}>
                    {label}
                    {isEditingTags && (
                      <button type="button" title={`移除标签：${label}`} aria-label={`移除标签：${label}`} onClick={() => removeTag(label)} className="inline-flex items-center justify-center" style={{ color, lineHeight: 1 }}>
                        <X size={10} strokeWidth={2.5} />
                      </button>
                    )}
                  </span>
                ))}
                <button
                  title={isEditingTags ? "保存标签修改" : "编辑会员标签"}
                  onClick={() => {
                    setIsEditingTags(editing => !editing);
                    setTagDraft("");
                    if (isEditingTags) showProfileNotice("标签修改已保存");
                  }}
                  className="text-[10px] font-bold whitespace-nowrap"
                  style={{ color: "#6db100" }}
                >
                  {isEditingTags ? "完成" : "编辑"}
                </button>
              </div>
              {isEditingTags && (
                <form className="flex items-center gap-1.5 mt-1.5" onSubmit={event => { event.preventDefault(); addTag(); }}>
                  <input value={tagDraft} onChange={event => setTagDraft(event.target.value)} className="min-w-0 flex-1 px-2 py-1 text-[10px] outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="新增标签" />
                  <button type="submit" title="新增标签" aria-label="新增标签" className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}><Plus size={11} strokeWidth={2.5} /></button>
                </form>
              )}
            </div>
            <button title="查看会员二维码" aria-label="查看会员二维码" onClick={() => showProfileNotice(`已生成 ${selectedUser.name} 的会员二维码`)} className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.5)`, borderRadius: S.radiusSm }}>
              <QrCode size={17} style={{ color: "#0d0d0d" }} />
            </button>
          </div>
          {profileNotice && <div role="status" className="mt-3 px-2.5 py-2 text-xs font-bold" style={{ background: S.accentLight, color: S.text, borderLeft: `2px solid ${S.accent}` }}>{profileNotice}</div>}

          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${S.border}` }}>
            <div className="grid grid-cols-2 gap-x-5">
              {[
                ["会员编号", `U-${String(selectedUser.rank).padStart(5, "0")}`], ["微信号", selectedUser.wechat],
                ["会员等级", "尊享官"], ["入群状态", "已入群"],
                ["影响力", selectedUser.influence.toLocaleString()], ["评分", selectedUser.score.toLocaleString()],
                ["城市", selectedUser.city], ["推荐人", selectedUser.referrer],
              ].map(([label, value]) => (
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
            {[
              ["订单", "3 单", "#ff8a00"], ["所在群", "2 群", "#00a978"],
              ["影响力", selectedUser.influence.toLocaleString(), S.text], ["最近活跃", "今天", "#00a978"],
            ].map(([label, value, color]) => (
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
            <span className="text-xs" style={{ color: S.muted }}>基于画像标签计算</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 mt-3">
            {[["R 最近活跃", "2 天内", "#00a978"], ["F 购买频次", "近30天 3次", S.textSec], ["M 累计消费", "¥1,240", "#e77800"], ["RFM 分层", "冠军客户", "#7445d8"]].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between gap-2 py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <span className="text-xs" style={{ color: S.muted }}>{label}</span><span className="text-xs font-bold text-right" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-0 px-3.5 pt-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          {profileTabs.map(tab => (
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

        <section className="px-3.5 py-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
          {activeProfileTab === "待处理" && (
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
                <input value={orderSearchInput} onChange={event => setOrderSearchInput(event.target.value)} className="min-w-0 px-2 py-1.5 text-[10px] outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} placeholder="搜索订单号或商品" aria-label="搜索订单号或商品" />
                <button onClick={() => { setOrderQuery(orderSearchInput.trim()); showProfileNotice(orderSearchInput.trim() ? "已应用订单搜索" : "已显示全部订单"); }} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>查询</button>
              </div>
              <div className="flex items-center gap-1.5 pb-2">
                <select value={orderDateRange} onChange={event => setOrderDateRange(event.target.value)} aria-label="订单日期范围" className="min-w-0 flex-1 px-2 py-1.5 text-[10px] outline-none" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}><option>全部日期</option><option>近 7 天</option><option>近 30 天</option></select>
                <button onClick={() => { setOrderSearchInput(""); setOrderQuery(""); setOrderDateRange("全部日期"); setActiveOrderStatus("所有订单"); showProfileNotice("订单筛选已重置"); }} className="px-2 py-1.5 text-[10px] font-bold whitespace-nowrap" style={{ background: "#f7f7f7", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>重置</button>
              </div>
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div className="min-w-0"><span className="text-[10px] font-bold" style={{ color: S.text }}>{activeOrderStatus} · {visibleOrders.length} 笔</span><span className="block text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>当前会员：{selectedUser.name}</span></div>
                <span className="text-[10px] text-right" style={{ color: S.muted }}>按订单、包裹与商品处理</span>
              </div>
              {visibleOrders.map(order => (
                <article key={order.no} className="mb-2 overflow-hidden" style={{ background: "#ffffff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5" style={{ background: "#f7f7f7", borderBottom: `1px solid ${S.border}` }}>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold font-mono truncate" style={{ color: S.text }}>订单号：{order.no}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: S.muted }}>购买日期：{order.date}</div>
                    </div>
                    <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: order.status === "已完成" ? "#00a978" : "#e77800" }}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5" style={{ background: S.accentLight, borderBottom: `1px solid ${S.border}` }}>
                    <span className="text-[10px]" style={{ color: S.textSec }}>实收 <b style={{ color: "#e77800" }}>{order.amount}</b> · 优惠 {order.discount}</span>
                    <button onClick={() => { setSelectedOrderNo(order.no); setActiveProfileTab("订单详情"); }} className="text-[10px] font-bold whitespace-nowrap" style={{ color: "#6db100" }}>查看详情</button>
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
              {visibleOrders.length === 0 && <div className="px-3 py-5 text-center" style={{ background: "#f7f7f7", border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }}>
                <Package size={17} className="mx-auto mb-2" style={{ color: S.mutedLight }} />
                <div className="text-[11px] font-bold" style={{ color: S.textSec }}>暂无「{activeOrderStatus}」订单</div>
                <div className="text-[10px] mt-1 leading-relaxed" style={{ color: S.muted }}>可查看全部订单，或直接为该会员创建售后跟进。</div>
                <div className="flex justify-center gap-2 mt-3"><button onClick={() => { setActiveOrderStatus("所有订单"); setOrderQuery(""); setOrderSearchInput(""); }} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>查看全部</button><button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建售后跟进`)} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: "#ffffff", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>创建售后</button></div>
              </div>}
              <div className="flex items-center justify-center gap-1 pt-1 text-[10px]" style={{ color: S.muted }}><button className="px-1.5 py-1" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>‹</button><span className="px-1.5 py-1 font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>1</span><button className="px-1.5 py-1" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>›</button><span className="ml-1">共 {visibleOrders.length} 笔</span></div>
            </div>
          )}
          {activeProfileTab === "订单详情" && (selectedOrderNo ? (() => {
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
                <div className="px-2 py-1.5 text-[10px] font-bold" style={{ background: "#f7f7f7", color: S.textSec }}>商品明细 / 包裹 1</div>
                {order.items.map(item => <div key={`detail-${item.name}`} className="grid grid-cols-[1fr_auto] gap-2 px-2 py-1.5" style={{ borderTop: `1px solid ${S.border}` }}><div className="min-w-0"><div className="text-[10px] font-bold truncate" style={{ color: S.text }}>{item.name}</div><div className="text-[10px]" style={{ color: S.muted }}>{item.spec}</div></div><div className="text-right text-[10px]" style={{ color: S.textSec }}>{item.price} · {item.quantity}</div></div>)}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => showProfileNotice(`已为 ${selectedUser.name} 创建订单回访`)} className="flex-1 py-1.5 text-[10px] font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>发起回访</button>
                <button onClick={() => showProfileNotice("订单备注已打开")} className="flex-1 py-1.5 text-[10px] font-bold" style={{ background: "#f7f7f7", color: S.textSec, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>添加备注</button>
              </div>
            </div>;
          })() : memberOrders.map(order => (
            <button key={order.no} onClick={() => setSelectedOrderNo(order.no)} className="w-full flex items-center gap-2 py-2 text-left" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-1 min-w-0"><div className="text-xs font-bold truncate" style={{ color: S.text }}>{order.product}</div><div className="text-[11px] mt-0.5" style={{ color: S.muted }}>{order.no} · {order.date.slice(0, 10)}</div></div>
              <span className="text-xs font-bold" style={{ color: "#e77800" }}>{order.amount}</span>
            </button>
          )))}
          {activeProfileTab === "历史操作记录" && activityFeed.slice(0, 3).map(activity => (
            <div key={activity.id} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
              <Clock size={12} className="flex-shrink-0" style={{ color: "#6db100" }} />
              <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{activity.type}</div><div className="text-[11px] truncate" style={{ color: S.muted }}>{activity.content}</div></div>
              <span className="text-[11px]" style={{ color: S.muted }}>{activity.time.slice(5, 10)}</span>
            </div>
          ))}
          {activeProfileTab === "回访单" && [
            ["服务老师回访", "吴思远 · 上次回访 07-03", "跟进中"],
            ["会员续费提醒", "本月 25 日前完成", "待安排"],
          ].map(([label, detail, status]) => (
            <div key={label} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${S.border}` }}>
              <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: S.text }}>{label}</div><div className="text-[11px] mt-0.5 truncate" style={{ color: S.muted }}>{detail}</div></div>
              <span className="text-[11px] font-bold" style={{ color: status === "待安排" ? "#e77800" : "#00a978" }}>{status}</span>
            </div>
          ))}
        </section>

      </aside> : (
        <div className="w-9 flex-shrink-0 flex items-start justify-center pt-3" style={{ background: S.surface, borderLeft: `1px solid ${S.border}` }}>
          <button type="button" title="展开会员档案栏" aria-label="展开会员档案栏" onClick={() => setIsProfileCollapsed(false)} className="w-7 h-7 flex items-center justify-center" style={{ color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
            <PanelRightOpen size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
