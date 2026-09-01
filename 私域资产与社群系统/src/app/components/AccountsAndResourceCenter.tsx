import { useState, useMemo, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Search, Plus, Upload, Download, ChevronDown, ChevronRight, ChevronLeft, User, Building2, Users, Phone, Share2, Mail,
  AlertTriangle, Shield, History, X, Check, Clock, ArrowRightLeft, Archive, Edit3, Trash2,
  Sparkles, Store, Link2, RefreshCw, Package, List, LayoutGrid, SlidersHorizontal, Eye, QrCode, MessageCircle,
} from "lucide-react";
import type { ResourceTool as Tool, CommunicationToolType, ToolHealthStatus, ToolRiskLevel, ResourceToolLog, Project } from "../data/communicationTools";
import { typeMeta, statusMeta, riskMeta, needsNurturing, initialProjects, PLATFORM_POOL_ID, projectStatusBadge, aggregateProject } from "../data/communicationTools";
import { useTools, useAccounts, useApprovals } from "../App";
import type { SystemAccount } from "../data/accountTypes";
import { createApproval } from "../data/approvalTypes";
import { getAvatar } from "./Avatar";
import { S, useThemeSingleton } from "../theme";

// ────────────────────────────────────────────────────────────────
// 色板：软蓝灰 SaaS 极简风（无黑框、无荧光黄），与微信账号管理统一。
// ────────────────────────────────────────────────────────────────
type LogAction = ResourceToolLog["action"];
type DetailTabKey = "general" | "ops" | "risk" | "log";
type BrowseMode = "list" | "cards";
type TopTabKey = CommunicationToolType | "all";
type StatusTabKey = "全部" | "使用中" | "异常" | "待交接" | "未使用" | "已停用";
type AssetViewDimension = "type" | "project" | "person";
type RegistrationMode = "single" | "batch";

const LIFECYCLE_STAGES: { key: string; label: string; hint: string }[] = [
  { key: "registered", label: "注册入库", hint: "已登记资产" },
  { key: "nurturing", label: "养号期", hint: "7天 / 风控门槛" },
  { key: "project", label: "分配到项目", hint: "已绑定项目" },
  { key: "person", label: "发放到人", hint: "可交接回收" },
  { key: "archived", label: "归档停用", hint: "保留审计记录" },
];

function lifecycleStagesForType(type: TopTabKey) {
  const needsNurture = type === "wechat" || type === "wecom" || type === "media";
  return LIFECYCLE_STAGES.map((stage, index) => index === 1 && !needsNurture
    ? { ...stage, label: "安全配置期", hint: "SSO / MFA / 恢复方式" }
    : stage);
}

function getLifecycleStageIndex(tool: Tool): number {
  if (tool.status === "archived" || tool.status === "disabled") return 4;
  if (tool.boundAccountId) return 3;
  if ((tool.boundProjectIds || []).length > 0) return 2;
  if (tool.status === "nurturing") return 1;
  return 0;
}

function getDimensionKey(tool: Tool, dimension: AssetViewDimension): string {
  if (dimension === "project") return tool.boundProjectIds?.[0] || "__idle__";
  if (dimension === "person") return tool.boundAccountId || "__unassigned__";
  return tool.type;
}

const PROJECT_LABEL_MAP: Record<string, string> = {
  p_beijing_pro: "北京PRO会员",
  p_shanghai_exp: "上海体验官",
  p_guangzhou_train: "广州代理培训",
  p_chengdu: "成都分站",
  p_shenzhen: "深圳代理",
  p_eco_invite: "生态招商",
  p_hangzhou_branch: "杭州分站",
};

const TOP_TABS: { key: TopTabKey; label: string; icon: typeof Users }[] = [
  { key: "all", label: "全部账号", icon: Building2 },
  { key: "wechat", label: "个人微信", icon: Users },
  { key: "wecom", label: "企业微信", icon: Building2 },
  { key: "phone", label: "手机号", icon: Phone },
  { key: "email", label: "邮箱", icon: Mail },
  { key: "media", label: "媒体账号", icon: Share2 },
  { key: "workspace", label: "协作与 AI", icon: Sparkles },
  { key: "developer", label: "开发与基础设施", icon: Package },
  { key: "business", label: "业务系统", icon: Store },
];

const STATUS_TABS: StatusTabKey[] = ["全部", "使用中", "异常", "待交接", "未使用", "已停用"];

// 状态 Tab → 工具底层 status 枚举集合（"未使用" 合并 not_enabled/nurturing/idle，"已停用" 合并 disabled/archived）
const STATUS_TO_ENUM: Record<StatusTabKey, ToolHealthStatus[]> = {
  "全部": [],
  "使用中": ["in_use"],
  "异常": ["abnormal"],
  "待交接": ["pending_transfer"],
  "未使用": ["not_enabled", "nurturing", "idle"],
  "已停用": ["disabled", "archived"],
};

const TYPE_ICON = {
  wecom: Building2,
  wechat: Users,
  phone: Phone,
  email: Mail,
  media: Share2,
  workspace: Sparkles,
  developer: Package,
  business: Store,
} as const;

const PAGE_SIZE = 10;

function projectName(ids: string[]): string {
  if (ids.length === 0) return "— 未分配 —";
  return ids.map(id => PROJECT_LABEL_MAP[id] || id).join(" / ");
}

// 列表模式列定义（参考 WeChatManagement 的 cols）
const COLS: { key: string; label: string; w: number }[] = [
  { key: "select", label: "", w: 36 },
  { key: "status", label: "使用状态", w: 84 },
  { key: "avatar", label: "头像", w: 60 },
  { key: "name", label: "工具 / 账号", w: 200 },
  { key: "identifier", label: "唯一标识", w: 150 },
  { key: "type", label: "类型", w: 84 },
  { key: "project", label: "归属项目", w: 140 },
  { key: "owner", label: "归属人", w: 120 },
  { key: "friendCount", label: "容量（好友/2000）", w: 140 },
  { key: "groups", label: "群/会话", w: 96 },
  { key: "sync", label: "同步状态", w: 104 },
  { key: "risk", label: "风控", w: 80 },
  { key: "lastActive", label: "最近活跃", w: 110 },
  { key: "action", label: "操作", w: 196 },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "select", "status", "avatar", "name", "identifier", "type", "project", "owner",
  "friendCount", "groups", "sync", "risk", "lastActive", "action",
];

// 容量计算（统一友好数 / 群 / 扫码指标）
function getToolCapacity(t: Tool) {
  const friendMax = t.type === "wecom" ? 50000 : t.type === "media" ? 100000 : t.type === "email" ? 1 : 2000;
  const friendCount = t.type === "wecom" ? (t.externalContactCount ?? t.friendCount) :
    t.type === "media" ? (t.fansCount ?? t.friendCount) : t.friendCount;
  const groupMax = t.type === "wecom" ? 2000 : t.type === "media" || t.type === "email" ? 0 : 20;
  const friendRate = Math.min(friendCount / friendMax, 1);
  const groupRate = groupMax > 0 ? Math.min(t.groupCount / groupMax, 1) : 0;
  const scanCount = t.scanCount ?? 0;
  return {
    friendCount, friendMax, friendRate,
    groupCount: t.groupCount, groupMax, groupRate,
    scanCount,
    isFriendRisk: friendRate >= 0.85,
    isGroupRisk: groupRate >= 0.8,
    isSyncRisk: t.status === "abnormal" || (!!t.lastActiveDate && t.lastActiveDate !== "—" && t.lastActiveDate < "2026-06-25"),
    isRisk: friendRate >= 0.85 || groupRate >= 0.8 || t.status === "abnormal",
  };
}

// 同步状态展示
function getSyncMeta(t: Tool, risk: ReturnType<typeof getToolCapacity>) {
  if (risk.isSyncRisk) return { label: "需核查", bg: "#fff7ed", color: "#c2410c" };
  if (t.status === "not_enabled" || t.status === "idle" || t.status === "nurturing") return { label: "未启用", bg: "#f1f5f9", color: "#888" };
  return { label: "正常", bg: "#f0fdf4", color: "#276749" };
}

// ─── 列表"主指标 / 次指标"列按类型语义化 ─────────────────────
// 表头标题：根据当前选中的账号类型，动态切换"好友数/群数"列的语义。
function metricMeta(type: TopTabKey): { primaryLabel: string; groupLabel: string } {
  switch (type) {
    case "wecom": return { primaryLabel: "外部联系人", groupLabel: "群数" };
    case "phone": return { primaryLabel: "绑定微信", groupLabel: "通话" };
    case "email": return { primaryLabel: "验证", groupLabel: "恢复邮箱" };
    case "media": return { primaryLabel: "粉丝", groupLabel: "7日涨粉" };
    case "workspace": return { primaryLabel: "席位", groupLabel: "用量" };
    case "developer": return { primaryLabel: "实例", groupLabel: "账单" };
    case "business": return { primaryLabel: "客户", groupLabel: "席位" };
    default: return { primaryLabel: "好友数", groupLabel: "群数" }; // wechat / all
  }
}

// 行内容：按类型取对应字段，返回主指标（数值+进度）与次指标（文本）。
type RowMetric = {
  primaryValue: number; primaryMax: number; primaryRate: number; primaryRisk: boolean;
  groupText: string;
};
function getRowMetric(t: Tool, type: TopTabKey, cap: ReturnType<typeof getToolCapacity>): RowMetric {
  switch (type) {
    case "phone": {
      const c = t.boundWechatCount ?? 0;
      return { primaryValue: c, primaryMax: 5, primaryRate: Math.min(c / 5, 1), primaryRisk: c >= 5, groupText: t.callRestriction || "—" };
    }
    case "email":
      return { primaryValue: t.emailVerified ? 1 : 0, primaryMax: 1, primaryRate: t.emailVerified ? 1 : 0, primaryRisk: false, groupText: t.recoveryEmail || "未配" };
    case "media":
      return { primaryValue: cap.friendCount, primaryMax: cap.friendMax, primaryRate: cap.friendRate, primaryRisk: cap.isFriendRisk, groupText: `+${t.fansGrowth7d ?? 0}` };
    case "workspace":
      return { primaryValue: t.friendCount, primaryMax: 20, primaryRate: Math.min(t.friendCount / 20, 1), primaryRisk: t.friendCount >= 20, groupText: `${t.todayAdded ?? 0} 次` };
    case "developer":
      return { primaryValue: t.friendCount, primaryMax: 10, primaryRate: Math.min(t.friendCount / 10, 1), primaryRisk: t.friendCount >= 10, groupText: t.planName ? "已出账" : "—" };
    case "business":
      return { primaryValue: t.friendCount, primaryMax: 200, primaryRate: Math.min(t.friendCount / 200, 1), primaryRisk: t.friendCount >= 200, groupText: `${t.groupCount ?? 0} 席` };
    default: // wechat / wecom / all —— 复用容量计算
      return { primaryValue: cap.friendCount, primaryMax: cap.friendMax, primaryRate: cap.friendRate, primaryRisk: cap.isFriendRisk, groupText: cap.groupMax > 0 ? `${cap.groupCount} / ${cap.groupMax}` : `${cap.groupCount}` };
  }
}

// ────────────────────────────────────────────────────────────────
// 通用 UI 子组件
// ────────────────────────────────────────────────────────────────
function BrowseModeToggle({ value, onChange, label }: { value: BrowseMode; onChange: (v: BrowseMode) => void; label: string }) {
  return (
    <div className="flex items-center p-0.5" aria-label={label} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
      <button type="button" title="列表浏览" aria-label="列表浏览" aria-pressed={value === "list"}
        className="w-8 h-7 flex items-center justify-center transition-all"
        style={{ background: value === "list" ? S.ink : "transparent", color: value === "list" ? S.accent : S.muted, borderRadius: "4px" }}
        onClick={() => onChange("list")}>
        <List size={15} />
      </button>
      <button type="button" title="卡片浏览" aria-label="卡片浏览" aria-pressed={value === "cards"}
        className="w-8 h-7 flex items-center justify-center transition-all"
        style={{ background: value === "cards" ? S.ink : "transparent", color: value === "cards" ? S.accent : S.muted, borderRadius: "4px" }}
        onClick={() => onChange("cards")}>
        <LayoutGrid size={15} />
      </button>
    </div>
  );
}

// 容量进度条四色分级：绿(0-60%) → 琥珀(60-80%) → 橙(80-95%) → 红(95-100%)
function tierColor(rate: number): string {
  if (rate >= 0.95) return "#dc2626"; // 红
  if (rate >= 0.80) return "#ea580c"; // 橙
  if (rate >= 0.60) return "#d97706"; // 琥珀
  return "#16a34a"; // 绿
}

function CapacityMeter({ label, value, max, warning }: { label: string; value: number; max: number; warning: boolean }) {
  const rate = Math.min(value / max, 1);
  const barColor = tierColor(rate);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs" style={{ fontFamily: "monospace" }}>
        <span style={{ color: S.muted }}>{label}</span>
        <b style={{ color: warning ? "#c2410c" : S.text }}>{value.toLocaleString()} / {max.toLocaleString()}</b>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}>
        <div style={{ width: `${Math.max(rate * 100, value ? 4 : 0)}%`, height: "100%", background: barColor, borderRadius: 99, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

function BrowsePager({ page, totalPages, total, onPageChange }: { page: number; totalPages: number; total: number; onPageChange: (p: number) => void }) {
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  return (
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#f8fafc" }}>
      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>第 {start}–{end} 条，共 {total} 条</div>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="上一页" className="w-7 h-7 flex items-center justify-center transition-all"
          style={{ background: page === 1 ? S.bg : S.ink, color: page === 1 ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}
          onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
          <ChevronLeft size={13} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(item => (
          <button key={item} type="button" className="w-7 h-7 text-xs transition-all"
            style={{ background: page === item ? S.ink : S.surface, color: page === item ? S.accent : S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
            onClick={() => onPageChange(item)}>{item}</button>
        ))}
        <button type="button" aria-label="下一页" className="w-7 h-7 flex items-center justify-center transition-all"
          style={{ background: page === totalPages ? S.bg : S.ink, color: page === totalPages ? S.muted : S.accent, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          <ChevronRight size={13} />
        </button>
      </div>
      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>每页 {PAGE_SIZE} 条</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 主组件
// ────────────────────────────────────────────────────────────────
interface AccountsAndResourceCenterProps {
  initialTopTab?: TopTabKey;
  /** 由统一账号入口嵌入时隐藏重复的类型切换栏 */
  embedded?: boolean;
  /** 由统一账号入口控制查看维度时，隐藏组件内部维度控件 */
  controlledViewDimension?: AssetViewDimension;
  hideDimensionControls?: boolean;
  /** 平台子标签筛选，由统一资产入口控制 */
  platformFilter?: string | null;
  /** 多选平台子标签筛选，由统一资产入口控制 */
  platformFilters?: string[];
  /** 汇总视图允许纳入的资源类型 */
  toolTypes?: CommunicationToolType[];
  /** 将操作按钮渲染到统一资产入口的顶部操作区 */
  headerActionTargetId?: string;
  /** 将显示/导入/导出按钮渲染到筛选工具栏 */
  secondaryActionTargetId?: string;
}

function HeaderActionSlot({ targetId, children }: { targetId?: string; children: ReactNode }) {
  const target = targetId && typeof document !== "undefined" ? document.getElementById(targetId) : null;
  return target ? createPortal(children, target) : <>{children}</>;
}

export default function AccountsAndResourceCenter({
 initialTopTab = "wechat", embedded = false, controlledViewDimension, hideDimensionControls = false, platformFilter = null, platformFilters, toolTypes, headerActionTargetId, secondaryActionTargetId }: AccountsAndResourceCenterProps) {
  useThemeSingleton();
const { tools, setTools } = useTools();
  const { accounts, setAccounts } = useAccounts();
  const { approvals, setApprovals } = useApprovals();

  // 仅取 setAccounts 用于关闭告警；accounts 主体仍是只读消费
  void setAccounts;
  void approvals;

  const accountMap = useMemo(() => Object.fromEntries(accounts.map(a => [a.uid, a])), [accounts]);
  const accountNameById = (uid: string | null) => (uid ? accountMap[uid]?.name || uid : "—");

  // ── 顶部 Tab / 状态筛选 / 搜索 / 浏览模式 ──────────────────
  const [topTab, setTopTab] = useState<TopTabKey>(initialTopTab);
  const metricType: TopTabKey = toolTypes && toolTypes.length === 1 ? toolTypes[0] : topTab;
  const lifecycleStages = lifecycleStagesForType(topTab);
  const [statusFilter, setStatusFilter] = useState<StatusTabKey>("全部");
  const [search, setSearch] = useState("");
  const [browseMode, setBrowseMode] = useState<BrowseMode>("list");
  const [internalViewDimension, setInternalViewDimension] = useState<AssetViewDimension>("type");
  const viewDimension = controlledViewDimension ?? internalViewDimension;
  const [lifecycleFilter, setLifecycleFilter] = useState<number | null>(null);
  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [dimensionGroup, setDimensionGroup] = useState<string | null>(null);
  const [expandedDimensionGroup, setExpandedDimensionGroup] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("全部项目");
  const [cityFilter, setCityFilter] = useState("全部城市");
  const [departmentFilter, setDepartmentFilter] = useState("全部部门");
  const [serviceFilter, setServiceFilter] = useState("全部服务官");
  const [capacityFilter, setCapacityFilter] = useState<"全部" | "容量预警" | "同步异常">("全部");

  // ── 列可见性 ───────────────────────────────────────────────
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const isColumnVisible = (key: string) => visibleColumns.includes(key);
  const columnStyle = (key: string, style: React.CSSProperties): React.CSSProperties => ({ ...style, display: isColumnVisible(key) ? undefined : "none" });
  const visibleTableWidth = COLS.filter(c => isColumnVisible(c.key)).reduce((t, c) => t + c.w, 0);

  // ── 分页 / 选择 / 详情 ──────────────────────────────────────
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTabKey>("ops");

  // ── 按项目 / 按人 视图专用 state ─────────────────────────────
  const [activeProjectId, setActiveProjectId] = useState<string>(PLATFORM_POOL_ID);

  // ── 弹窗状态 ───────────────────────────────────────────────
  const [confirmAction, setConfirmAction] = useState<{ toolId: string; action: "disable" | "archive" | "send_nurture"; label: string } | null>(null);
  const [handoverDraft, setHandoverDraft] = useState<{ toolId: string; targetUid: string } | null>(null);
  const [newToolDrawer, setNewToolDrawer] = useState<null | { draft: Partial<Tool> & { mode: RegistrationMode; name?: string; identifier?: string; notes?: string }; step: 1 | 2 }>(null);
  const [toast, setToast] = useState("");

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 2400);
  };

  // ── 派生：项目/城市/部门/服务官 选项 ──────────────────────
  const projectOptions = useMemo(() => {
    const set = new Set<string>();
    tools.forEach(t => (t.boundProjectIds || []).forEach(p => set.add(p)));
    return ["全部项目", ...Array.from(set).map(id => PROJECT_LABEL_MAP[id] || id)];
  }, [tools]);

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    tools.forEach(t => {
      const c = (t as Tool & { city?: string }).city
        || (t.type === "wechat" ? (t as Tool & { city?: string }).city : "")
        || (t.type === "wecom" ? t.department?.replace(/服务中心$/, "") : "")
        || (t.type === "phone" ? (t as Tool & { city?: string }).city : "")
        || (t.type === "media" ? t.matrixGroup || "" : "");
      if (c) set.add(c);
    });
    return ["全部城市", ...Array.from(set)];
  }, [tools]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    tools.forEach(t => {
      const d = t.department || t.subsidiary || (t.type === "wecom" ? t.corpName : "");
      if (d) set.add(d);
    });
    return ["全部部门", ...Array.from(set)];
  }, [tools]);

  const serviceOptions = useMemo(() => {
    const set = new Set<string>();
    tools.forEach(t => {
      const o = t.boundAccountId ? accountNameById(t.boundAccountId) : "";
      if (o && o !== "—") set.add(o);
    });
    return ["全部服务官", ...Array.from(set)];
  }, [tools, accountMap]);

  // ── 一级过滤：topTab + status + search + 高级筛选 + 容量 ────
  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      if (toolTypes ? !toolTypes.includes(t.type) : topTab !== "all" && t.type !== topTab) return false;
      if (platformFilters?.length && !platformFilters.includes(t.platform || t.mediaPlatform || "")) return false;
      if (platformFilter && t.platform !== platformFilter && t.mediaPlatform !== platformFilter) return false;
      if (lifecycleFilter !== null && getLifecycleStageIndex(t) !== lifecycleFilter) return false;
      if (dimensionGroup && getDimensionKey(t, viewDimension) !== dimensionGroup) return false;
      const statusEnums = STATUS_TO_ENUM[statusFilter];
      if (statusEnums.length > 0 && !statusEnums.includes(t.status)) return false;
      if (projectFilter !== "全部项目") {
        const wantId = (Object.entries(PROJECT_LABEL_MAP).find(([, v]) => v === projectFilter)?.[0]) || projectFilter;
        if (!t.boundProjectIds.includes(wantId)) return false;
      }
      if (cityFilter !== "全部城市") {
        const c = (t as Tool & { city?: string }).city || t.department?.replace(/服务中心$/, "") || t.matrixGroup || "";
        if (c !== cityFilter) return false;
      }
      if (departmentFilter !== "全部部门") {
        const d = t.department || t.subsidiary || t.corpName || "";
        if (d !== departmentFilter) return false;
      }
      if (serviceFilter !== "全部服务官") {
        if (accountNameById(t.boundAccountId) !== serviceFilter) return false;
      }
      if (capacityFilter !== "全部") {
        const cap = getToolCapacity(t);
        if (capacityFilter === "容量预警" && !cap.isFriendRisk && !cap.isGroupRisk) return false;
        if (capacityFilter === "同步异常" && !cap.isSyncRisk) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [
          t.name, t.identifier, t.boundPhone || "", t.notes || "",
          accountNameById(t.boundAccountId), projectName(t.boundProjectIds),
          t.platform || "", t.corpName || "", t.nickname || "",
          t.mediaPlatform || "", t.certifiedSubject || "", t.matrixGroup || "",
          (t.contentTags || []).join(","),
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tools, topTab, toolTypes, platformFilter, platformFilters, statusFilter, projectFilter, cityFilter, departmentFilter, serviceFilter, capacityFilter, search, accountMap, lifecycleFilter, dimensionGroup, viewDimension]);

  // ── 状态 Tab 计数 ───────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const sameType = tools.filter(t => toolTypes ? toolTypes.includes(t.type) : topTab === "all" || t.type === topTab);
    const count = (pred: (t: Tool) => boolean) => sameType.filter(pred).length;
    return {
      "全部": sameType.length,
      "使用中": count(t => t.status === "in_use"),
      "异常": count(t => t.status === "abnormal"),
      "待交接": count(t => t.status === "pending_transfer"),
      "未使用": count(t => t.status === "not_enabled" || t.status === "nurturing" || t.status === "idle"),
      "已停用": count(t => t.status === "disabled" || t.status === "archived"),
    } as Record<StatusTabKey, number>;
  }, [tools, topTab, toolTypes]);

  const lifecycleCounts = useMemo(() => {
    const sameType = tools.filter(t => toolTypes ? toolTypes.includes(t.type) : topTab === "all" || t.type === topTab);
    return lifecycleStages.map((_, index) => sameType.filter(t => getLifecycleStageIndex(t) === index).length);
  }, [tools, topTab, toolTypes, lifecycleStages]);

  const dimensionGroups = useMemo(() => {
    const groups = new Map<string, Tool[]>();
    tools.filter(t => toolTypes ? toolTypes.includes(t.type) : topTab === "all" || t.type === topTab).forEach(tool => {
      const key = getDimensionKey(tool, viewDimension);
      groups.set(key, [...(groups.get(key) || []), tool]);
    });
    return Array.from(groups.entries())
      .map(([key, groupTools]) => ({ key, tools: groupTools }))
      .sort((a, b) => b.tools.length - a.tools.length);
  }, [tools, topTab, toolTypes, viewDimension]);

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedTools = filteredTools.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  // 最稳健：根据"实际显示给用户看的列表"推导指标语义类型
  // 优先级：① filteredTools/当前页全为同类型 → 取该类型；② metricType（由 toolTypes[0] 或 topTab 推断）
  const viewMetricType: TopTabKey = useMemo(() => {
    const pool = filteredTools.length > 0 ? filteredTools : pagedTools;
    if (pool.length > 0 && pool.every(t => t.type === pool[0].type)) return pool[0].type as TopTabKey;
    return metricType;
  }, [filteredTools, pagedTools, metricType]);

  // 默认选中一个工具给详情抽屉
  useEffect(() => {
    if (!selectedToolId && filteredTools.length > 0) {
      const pref = filteredTools.find(t => t.id === "dy_bj_01") || filteredTools[0];
      setSelectedToolId(pref.id);
    }
    if (selectedToolId && !filteredTools.find(t => t.id === selectedToolId) && filteredTools[0]) {
      setSelectedToolId(filteredTools[0].id);
    }
  }, [filteredTools, selectedToolId]);

  const selectedTool = useMemo(
    () => filteredTools.find(t => t.id === selectedToolId) || tools.find(t => t.id === selectedToolId) || null,
    [selectedToolId, filteredTools, tools],
  );

  const activeFilterCount =
    Number(projectFilter !== "全部项目") +
    Number(cityFilter !== "全部城市") +
    Number(departmentFilter !== "全部部门") +
    Number(serviceFilter !== "全部服务官") +
    Number(capacityFilter !== "全部");

  function clearAdvancedFilters() {
    setProjectFilter("全部项目");
    setCityFilter("全部城市");
    setDepartmentFilter("全部部门");
    setServiceFilter("全部服务官");
    setCapacityFilter("全部");
    setPage(1);
  }

  // ── 工具操作通用辅助函数：改状态 + 写日志 ─────────────────
  function mutateTool(id: string, patch: Partial<Tool>, logAction: LogAction, logSummary: string, actor = "当前用户") {
    setTools(prev => prev.map(t => t.id === id ? {
      ...t, ...patch,
      operationLogs: [
        { id: "l" + Date.now(), time: new Date().toISOString().replace("T", " ").slice(0, 16), actor, action: logAction, summary: logSummary },
        ...(t.operationLogs || []),
      ],
    } : t));
  }

  function doDisable() {
    if (!confirmAction) return;
    mutateTool(confirmAction.toolId, { status: "disabled", riskLevel: "normal" }, "停用", `操作：${confirmAction.label}`);
    showToast(`✅ ${confirmAction.label}成功`);
    setConfirmAction(null);
  }

  function doArchive() {
    if (!confirmAction) return;
    mutateTool(confirmAction.toolId, { status: "archived", boundAccountId: null, boundProjectIds: [] }, "归档", "停用并归档，归还到资产中心");
    showToast("✅ 已归档，归还到资产中心");
    setConfirmAction(null);
  }

  function doSendNurture() {
    if (!confirmAction) return;
    mutateTool(confirmAction.toolId, { status: "nurturing", boundAccountId: null, boundProjectIds: [] }, "送回养号", "释放归属人与项目，进入养号阶段");
    showToast("✅ 已送回养号池");
    setConfirmAction(null);
  }

  function confirmHandover() {
    if (!handoverDraft) return;
    const { toolId, targetUid } = handoverDraft;
    const tool = tools.find(t => t.id === toolId);
    const target = accounts.find(a => a.uid === targetUid);
    if (!tool || !target) return;
    const dup = approvals.find(a =>
      a.type === "tool_handover" && a.status !== "approved" && a.status !== "rejected"
      && (a.payload as any)?.toolId === toolId,
    );
    if (dup) {
      showToast("⚠️ 已存在进行中的交接审批单，请勿重复提交");
      setHandoverDraft(null);
      return;
    }
    const approval = createApproval("tool_handover", {
      title: `工具交接：${tool.name} → ${target.name}`,
      submitter: "当前用户",
      submitterUid: "current_admin",
      description: `工具 ${tool.name}（${tool.identifier}）申请由 ${accountNameById(tool.boundAccountId)} 交接给 ${target.name}（${targetUid}）`,
      detail: { 工具: tool.name, 标识: tool.identifier, 原持有人: accountNameById(tool.boundAccountId), 新持有人: target.name },
      payload: { toolId, fromAccountId: tool.boundAccountId, toAccountId: targetUid } as any,
    });
    setApprovals(prev => [approval, ...prev]);
    mutateTool(toolId, { status: "pending_transfer" }, "工具交接审批", `交接目标人：${target.name}(${targetUid})`, "当前用户");
    showToast("✅ 已推送工具交接审批单（3级流程）");
    setHandoverDraft(null);
  }

  function doExportFiltered() {
    const rowsCSV = filteredTools.map(t => [
      t.identifier, typeMeta[t.type].short, t.name, statusMeta[t.status].label, riskMeta[t.riskLevel].label,
      accountNameById(t.boundAccountId), projectName(t.boundProjectIds), t.boundPhone || t.platform || "",
      String(t.friendCount), String(t.groupCount), t.lastActiveDate, t.onboardDate || "", t.notes || "",
    ]);
    const headers = ["工具ID", "类型", "名称", "阶段", "风控", "归属人", "项目", "绑定号/平台", "好友/粉丝", "群数", "最后活跃", "入库日期", "备注"];
    const csv = [headers, ...rowsCSV].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `resource_tools_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast(`✅ 已导出 ${filteredTools.length} 条资源`);
  }

  function toggleRow(id: string) {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function runBulkAction(action: string) {
    if (!selectedRows.length) return;
    showToast(`✅ 已对 ${selectedRows.length} 条资源执行：${action}`);
    setSelectedRows([]);
  }

  function switchTopTab(k: TopTabKey) {
    setTopTab(k);
    setStatusFilter("全部");
    setLifecycleFilter(null);
    setDimensionGroup(null);
    setExpandedDimensionGroup(null);
    setPage(1);
    setSelectedToolId(null);
    setSelectedRows([]);
  }

  function switchStatusTab(s: StatusTabKey) {
    setStatusFilter(s);
    setPage(1);
    setSelectedToolId(null);
  }

  function switchDimension(dimension: AssetViewDimension) {
    setInternalViewDimension(dimension);
    setDimensionGroup(null);
    setExpandedDimensionGroup(null);
    setPage(1);
    setSelectedToolId(null);
  }

  function dimensionGroupLabel(key: string, dimension: AssetViewDimension) {
    if (dimension === "project") return key === "__idle__" ? "空闲号池" : (PROJECT_LABEL_MAP[key] || key);
    if (dimension === "person") return key === "__unassigned__" ? "未发放到人" : accountNameById(key);
    return typeMeta[key as CommunicationToolType]?.label || key;
  }

  // ─────────────────── 渲染 ─────────────────────────────────
  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "system-ui,-apple-system,'PingFang SC',sans-serif" }}>
      {/* ── 弹窗 ─────────────────────────────────────────────── */}
      {confirmAction && (
        <Modal title={`确认：${confirmAction.label}`} onClose={() => setConfirmAction(null)}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: S.textSec }}>
            工具 <b style={{ color: S.text }}>{tools.find(t => t.id === confirmAction.toolId)?.name}</b>{" "}
            <span style={{ fontFamily: "monospace", color: S.muted }}>({confirmAction.toolId})</span>
            <br />即将执行：<b style={{ color: S.danger }}>{confirmAction.label}</b>
            {confirmAction.action === "archive" && <div style={{ marginTop: 8, padding: "10px 12px", background: S.dangerBg, border: `1px solid #fecaca`, borderRadius: 7, color: S.danger, fontSize: 12, lineHeight: 1.7 }}>
              ⚠️ 归档会同时释放归属人和所有项目绑定，工具将从所有活跃列表移除但保留审计
            </div>}
            {confirmAction.action === "send_nurture" && <div style={{ marginTop: 8, padding: "10px 12px", background: S.warningBg, border: `1px solid #fde68a`, borderRadius: 7, color: S.warning, fontSize: 12, lineHeight: 1.7 }}>
              ⚠️ 送回养号会释放归属人与项目，重新养号7天后才可再分配
            </div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <button type="button" onClick={() => setConfirmAction(null)}
              style={{ padding: "7px 14px", border: `1px solid ${S.borderMed}`, borderRadius: 7, background: "#ffffff", fontSize: 13, cursor: "pointer", color: S.textSec }}>取消</button>
            <button type="button"
              onClick={confirmAction.action === "disable" ? doDisable : confirmAction.action === "archive" ? doArchive : doSendNurture}
              style={{ padding: "7px 15px", border: "none", borderRadius: 7,
                background: confirmAction.action === "disable" || confirmAction.action === "archive" ? S.danger : S.primary,
                color: "#ffffff", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }}>
              <Check size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 确认
            </button>
          </div>
        </Modal>
      )}

      {handoverDraft && (() => {
        const tool = tools.find(t => t.id === handoverDraft.toolId);
        return (
          <Modal title={`🔁 工具交接审批：${tool?.name || ""}`} onClose={() => setHandoverDraft(null)} width={440}>
            <div style={{ fontSize: 12, lineHeight: 1.9 }}>
              <div>当前归属人：<b>{accountNameById(tool?.boundAccountId || null)}</b></div>
              <div style={{ marginTop: 8 }}>交接目标人：
                <select value={handoverDraft.targetUid}
                  onChange={e => setHandoverDraft(d => d ? { ...d, targetUid: e.target.value } : null)}
                  style={{ marginLeft: 6, padding: "4px 6px", borderRadius: 5, border: `1px solid ${S.borderMed}` }}>
                  {accounts.filter(a => a.uid !== tool?.boundAccountId).map(a => (
                    <option key={a.uid} value={a.uid}>{a.name} ({a.identities.map(i => i.label).slice(0, 1).join(",")}) · uid:{a.uid}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 10, padding: "10px 12px", background: S.primaryLight, borderRadius: 7, border: `1px solid ${S.primaryMid}`, fontSize: 12, lineHeight: 1.75, color: S.textSec }}>
                ⓘ 交接为3级审批流程：负责人 → 上级负责人 → 生态COO/超级管理员终审；
                审核期间工具状态自动置为 <b style={{ color: S.primary }}>待交接</b>，终审通过后释放原归属人、状态回到空闲号池。
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button type="button" onClick={() => setHandoverDraft(null)}
                style={{ padding: "7px 14px", border: `1px solid ${S.borderMed}`, borderRadius: 7, background: "#ffffff", fontSize: 13, cursor: "pointer", color: S.textSec }}>取消</button>
              <button type="button" onClick={confirmHandover}
                style={{ padding: "7px 15px", border: "none", borderRadius: 7, background: S.primary, color: S.onPrimary, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 2px rgba(37,99,235,.15)" }}>
                <Check size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 推送审批单
              </button>
            </div>
          </Modal>
        );
      })()}

      {newToolDrawer && (
        <Modal title={`➕ 注册入库 · ${newToolDrawer.step === 1 ? "选择方式" : "填写资料"}`} onClose={() => setNewToolDrawer(null)} width={520}>
          <div style={{ fontSize: 12, lineHeight: 2 }}>
            <div>资源类型：
              <select style={{ marginLeft: 6, padding: "4px 6px", borderRadius: 5, border: `1px solid ${S.borderMed}` }}
                value={newToolDrawer.draft.type || "wechat"}
                onChange={e => setNewToolDrawer({ ...newToolDrawer, draft: { ...newToolDrawer.draft, type: e.target.value as CommunicationToolType } })}>
                <option value="wechat">个人微信（新手机号注册）</option>
                <option value="wecom">企业微信席位</option>
                <option value="phone">手机号卡</option>
                <option value="email">邮箱账号</option>
                <option value="media">媒体账号（抖音/小红书/公众号等）</option>
                <option value="workspace">协作与 AI（Figma/ChatGPT/Claude 等）</option>
                <option value="developer">开发与基础设施（GitHub/云服务等）</option>
                <option value="business">业务系统（SCRM/CRM/ERP 等）</option>
              </select>
            </div>
            <div style={{ marginTop: 12 }}>注册方式：
              <span style={{ display: "inline-flex", marginLeft: 8, gap: 6 }}>
                {([{ key: "single", label: "单个注册" }, { key: "batch", label: "批量导入" }] as const).map(option => <button key={option.key} type="button" onClick={() => setNewToolDrawer({ ...newToolDrawer, draft: { ...newToolDrawer.draft, mode: option.key } })} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${newToolDrawer.draft.mode === option.key ? S.ink : S.borderMed}`, background: newToolDrawer.draft.mode === option.key ? S.primaryLight : "#ffffff", color: S.textSec, cursor: "pointer" }}>{option.label}</button>)}
              </span>
            </div>
            <div style={{ marginTop: 6 }}>入库后状态：
              <span style={{ marginLeft: 6, padding: "2px 6px", background: statusMeta.not_enabled.badgeBg, color: statusMeta.not_enabled.badgeColor, borderRadius: 4, fontSize: 11, fontWeight: 700 }}>未启用</span>
              <span style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>
                {needsNurturing((newToolDrawer.draft.type || "wechat") as CommunicationToolType)
                  ? "后续点「送回养号」→「分配到项目」→「发放到人」逐步推进"
                  : "直接进入「分配到项目」→「发放到人」，无需养号"}
              </span>
            </div>
            <div style={{ marginTop: 8, padding: "10px 12px", background: S.primaryLight, borderRadius: 7, border: `1px solid ${S.primaryMid}`, fontSize: 12, color: S.textSec, lineHeight: 1.7 }}>
              💡 也可使用顶部「批量导入」支持：CSV 手机号段、企微席位 XML 备份、微信卡包批量注册、媒体矩阵账号批量接入。
            </div>
            {newToolDrawer.step === 2 && newToolDrawer.draft.mode === "single" && <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <label>账号名称 *<input value={newToolDrawer.draft.name || ""} onChange={e => setNewToolDrawer({ ...newToolDrawer, draft: { ...newToolDrawer.draft, name: e.target.value } })} placeholder="请输入账号名称" style={{ display: "block", width: "100%", marginTop: 4, padding: "7px 9px", border: `1px solid ${S.borderMed}`, borderRadius: 6 }} /></label>
              <label>账号唯一标识 *<input value={newToolDrawer.draft.identifier || ""} onChange={e => setNewToolDrawer({ ...newToolDrawer, draft: { ...newToolDrawer.draft, identifier: e.target.value } })} placeholder="请输入账号、手机号或邮箱" style={{ display: "block", width: "100%", marginTop: 4, padding: "7px 9px", border: `1px solid ${S.borderMed}`, borderRadius: 6 }} /></label>
            </div>}
            {newToolDrawer.step === 2 && newToolDrawer.draft.mode === "batch" && <div style={{ marginTop: 12, padding: "16px 12px", textAlign: "center", border: `1px dashed ${S.borderMed}`, borderRadius: 7, color: S.muted }}>上传 CSV / XLSX 模板，系统将校验必填字段、重复账号和格式。</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
            <button type="button" onClick={() => newToolDrawer.step === 1 ? setNewToolDrawer(null) : setNewToolDrawer({ ...newToolDrawer, step: 1 })}
              style={{ padding: "7px 14px", border: `1px solid ${S.borderMed}`, borderRadius: 7, background: "#ffffff", fontSize: 13, cursor: "pointer", color: S.textSec }}>{newToolDrawer.step === 1 ? "取消" : "上一步"}</button>
            <button type="button"
              onClick={() => {
                if (newToolDrawer.step === 1) { setNewToolDrawer({ ...newToolDrawer, step: 2 }); return; }
                const t = newToolDrawer.draft.type || "wechat";
                const id = "t_" + Date.now().toString().slice(-5);
                const identifier = newToolDrawer.draft.identifier || ((t === "wechat" ? "wx_" : t === "wecom" ? "corp_" : t === "phone" ? "phone_" : t === "email" ? "mail_" : t === "media" ? "media_" : t === "workspace" ? "work_" : t === "developer" ? "dev_" : "sys_") + "new_" + id.slice(-3));
                const newTool: Tool = {
                  id, type: t, identifier, name: newToolDrawer.draft.name || "新入库资源·" + id,
                  status: "not_enabled", riskLevel: "normal", boundAccountId: null, boundProjectIds: [],
                  dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0, lastActiveDate: "—",
                  onboardDate: new Date().toISOString().slice(0, 10),
                  operationLogs: [{ id: "l0", time: new Date().toISOString().replace("T", " ").slice(0, 16), actor: "当前用户", action: "注册入库", summary: "通过注册入库按钮创建" }],
                };
                setTools(prev => [newTool, ...prev]);
                setNewToolDrawer(null);
                setTopTab(t);
                setSelectedToolId(id);
                setPage(1);
                setStatusFilter("未使用");
                showToast("✅ 注册入库成功：已在『未启用』阶段");
              }}
              style={{ padding: "7px 15px", border: "none", borderRadius: 7, background: S.primary, color: S.onPrimary, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 2px rgba(37,99,235,.15)" }}>
              {newToolDrawer.step === 1 ? <><ChevronRight size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 下一步</> : <><Check size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 确定注册</>}
            </button>
          </div>
        </Modal>
      )}

      {/* ── 页头：标题 + 顶部 4 类型 Tab + 列管理 + 导出 + 注册入库 ─── */}
      <div className="flex items-center justify-between flex-shrink-0" style={embedded && headerActionTargetId ? { display: "contents" } : undefined}>
        {!embedded && <div>
          <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>配置中心</div>
          <h2 className="font-semibold mt-0.5" style={{ color: S.text, fontFamily: "monospace", letterSpacing: "0.02em" }}>
            账号资产中心
          </h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>统一管理个人微信、企业微信、手机号与媒体账号；个人微信保留完整微信管理流程</p>
        </div>}
        <HeaderActionSlot targetId={headerActionTargetId}>
        <div className={`flex gap-2 items-center ${embedded ? "ml-auto" : ""}`}>
          {!embedded && <div className="flex" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
            {TOP_TABS.map((tab, i) => {
              const Icon = tab.icon;
              const active = topTab === tab.key;
              return (
                <button key={tab.key} type="button" title={tab.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap"
                  style={{
                    background: active ? S.ink : "transparent",
                    color: active ? S.accent : S.muted,
                    fontFamily: "monospace",
                    borderRight: i < TOP_TABS.length - 1 ? `1px solid ${S.border}` : "none",
                  }}
                  onClick={() => switchTopTab(tab.key)}>
                  <Icon size={13} /> {tab.label}
                </button>
              );
            })}
          </div>}

          <HeaderActionSlot targetId={secondaryActionTargetId}>
          {/* 列可见性管理 */}
          <div className="relative">
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap"
              style={{ background: columnsOpen ? S.ink : S.surface, border: `1px solid ${columnsOpen ? S.ink : S.border}`, color: columnsOpen ? S.accent : S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}
              onClick={() => setColumnsOpen(v => !v)}>
              <Eye size={13} /> 显示内容
            </button>
            {columnsOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-72 p-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(15,23,42,.12)" }}>
                <div className="text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>列表显示字段</div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>
                  {COLS.filter(c => !["select", "action", "name", "identifier"].includes(c.key)).map(c => (
                    <label key={c.key} className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={isColumnVisible(c.key)}
                        onChange={e => setVisibleColumns(prev => e.target.checked ? Array.from(new Set([...prev, c.key])) : prev.filter(k => k !== c.key))} />
                      {c.label}
                    </label>
                  ))}
                </div>
                <button type="button" className="mt-3 w-full px-2 py-1.5 text-[10px] font-semibold"
                  style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm }}
                  onClick={() => setVisibleColumns(COLS.map(c => c.key))}>显示全部字段</button>
                <div className="mt-2 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>工具名/唯一标识始终展示；敏感字段在详情中脱敏。</div>
              </div>
            )}
          </div>

          <button type="button" onClick={doExportFiltered}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
            <Download size={13} /> 导出
          </button>
          <button type="button"
            onClick={() => showToast("📤 批量导入：已打开模板选择器（示例：上传 .csv / 批量手机号/企微席位）")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>
            <Upload size={13} /> 批量导入
          </button>
          </HeaderActionSlot>
          <button type="button"
            onClick={() => setNewToolDrawer({ step: 1, draft: { type: topTab === "all" ? "wechat" : topTab, mode: "single", status: "not_enabled", boundAccountId: null, boundProjectIds: [] } })}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold whitespace-nowrap"
            style={{ background: S.ink, color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>
            <Plus size={15} /> 注册入库
          </button>
        </div>
        </HeaderActionSlot>
      </div>

      {/* ── 查看维度与分组 ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {!hideDimensionControls && <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs font-semibold mr-1" style={{ color: S.text, fontFamily: "monospace" }}>查看维度</div>
          {(["type", "project", "person"] as AssetViewDimension[]).map(dimension => {
            const active = viewDimension === dimension;
            const labels: Record<AssetViewDimension, string> = { type: "按账号类型", project: "按项目", person: "按人" };
            const icons: Record<AssetViewDimension, typeof Users> = { type: Users, project: Building2, person: User };
            const Icon = icons[dimension];
            return <button key={dimension} type="button" aria-pressed={active} onClick={() => switchDimension(dimension)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all" style={{ background: active ? S.ink : S.surface, color: active ? S.accent : S.textSec, border: `1px solid ${active ? S.ink : S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }}><Icon size={13} />{labels[dimension]}</button>;
          })}
          {viewDimension !== "type" && <span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>点击分组卡片聚焦列表，展开按钮查看组内工具</span>}
        </div>}

        {viewDimension !== "type" && (
          <div className="grid grid-cols-4 gap-2">
            {dimensionGroups.map(group => {
              const active = dimensionGroup === group.key;
              const expanded = expandedDimensionGroup === group.key;
              return (
                <div key={group.key} className="px-3 py-2" style={{ background: active ? S.accentLight : S.surface, border: `1px solid ${active ? S.accent : S.border}`, borderRadius: S.radiusSm }}>
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { setDimensionGroup(active ? null : group.key); setPage(1); setSelectedToolId(null); }}>
                      <div className="text-xs font-semibold truncate" style={{ color: S.text, fontFamily: "monospace" }}>{dimensionGroupLabel(group.key, viewDimension)}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{group.tools.length} 个工具</div>
                    </button>
                    <button type="button" title={expanded ? "收起工具" : "展开工具"} aria-label={expanded ? "收起工具" : "展开工具"} aria-expanded={expanded} onClick={() => setExpandedDimensionGroup(expanded ? null : group.key)} className="w-6 h-6 grid place-items-center" style={{ color: S.muted, borderRadius: S.radiusSm }}><ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} /></button>
                  </div>
                  {expanded && <div className="mt-2 pt-2 space-y-1" style={{ borderTop: `1px solid ${S.border}` }}>{group.tools.slice(0, 4).map(tool => <button key={tool.id} type="button" className="w-full flex items-center justify-between gap-2 text-[10px] text-left" onClick={() => { setSelectedToolId(tool.id); setDetailTab("ops"); }}><span className="truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{tool.name}</span><span style={{ color: S.muted, fontFamily: "monospace" }}>{tool.identifier}</span></button>)}{group.tools.length > 4 && <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>还有 {group.tools.length - 4} 个，列表中查看</div>}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 第二行：状态筛选 Tab + 搜索 + 高级筛选 + 浏览模式 ─── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* 生命周期下拉与微信页保持一致 */}
        <div className="relative flex-shrink-0 order-2">
          <button type="button" aria-expanded={lifecycleOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all"
            style={{ background: lifecycleOpen || lifecycleFilter !== null ? S.ink : S.surface, color: lifecycleOpen || lifecycleFilter !== null ? S.accent : S.textSec, border: `1px solid ${lifecycleOpen || lifecycleFilter !== null ? S.ink : S.border}`, borderRadius: S.radius, fontFamily: "monospace" }}
            onClick={() => setLifecycleOpen(value => !value)}>
            <span style={{ width: 7, height: 7, background: lifecycleFilter === null ? S.mutedLight : lifecycleFilter === 1 ? S.warning : lifecycleFilter === 2 ? "#3b82f6" : lifecycleFilter === 3 ? "#6b8e00" : lifecycleFilter === 4 ? "#9ca3af" : S.mutedLight, borderRadius: 99 }} />
            生命周期{lifecycleFilter !== null ? ` · ${lifecycleStages[lifecycleFilter].label}` : ""}
            <ChevronDown size={12} style={{ transform: lifecycleOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {lifecycleOpen && <div className="absolute left-0 top-full z-30 mt-2 w-48 p-1" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
            {[null, 0, 1, 2, 3, 4].map(stageIndex => {
              const active = lifecycleFilter === stageIndex;
              const label = stageIndex === null ? "全部阶段" : lifecycleStages[stageIndex].label;
              const hint = stageIndex === null ? "显示全部生命周期阶段" : lifecycleStages[stageIndex].hint;
              const dot = stageIndex === null ? S.mutedLight : stageIndex === 1 ? S.warning : stageIndex === 2 ? "#3b82f6" : stageIndex === 3 ? "#6b8e00" : "#9ca3af";
              return <button key={stageIndex === null ? "all" : stageIndex} type="button" title={`${label}：${hint}`} aria-pressed={active}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-2 text-left text-xs"
                style={{ background: active ? S.accentLight : "transparent", color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                onClick={() => { setLifecycleFilter(stageIndex); setLifecycleOpen(false); setPage(1); setSelectedToolId(null); }}>
                <span className="flex items-center gap-2"><span style={{ width: 7, height: 7, background: dot, borderRadius: 99 }} />{label}</span>
                <b style={{ color: S.muted }}>{stageIndex === null ? lifecycleCounts.reduce((sum, count) => sum + count, 0) : lifecycleCounts[stageIndex]}</b>
              </button>;
            })}
          </div>}
        </div>
        {/* 状态筛选 Tab */}
        <div className="flex order-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
          {STATUS_TABS.map((s, i) => {
            const active = statusFilter === s;
            return (
              <button key={s} type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all"
                style={{
                  background: active ? S.ink : "transparent",
                  color: active ? S.accent : S.muted,
                  fontFamily: "monospace",
                  borderRight: i < STATUS_TABS.length - 1 ? `1px solid ${S.border}` : "none",
                }}
                onClick={() => switchStatusTab(s)}>
                {s}
                <span className="px-1.5 py-0.5"
                  style={{
                    background: active ? S.accent : S.bg,
                    color: active ? "#ffffff" : S.muted,
                    fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace",
                  }}>
                  {statusCounts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* 搜索 */}
        <div className="min-w-0 flex-1 flex items-center gap-2 px-3 py-2 order-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }}
            placeholder="搜索工具名 / 唯一标识 / 绑定号 / 平台 / 归属人 / 项目 / 认证主体…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); setSelectedToolId(null); }} />
          {search && <button type="button" title="清除搜索" onClick={() => setSearch("")}><X size={12} style={{ color: S.muted }} /></button>}
        </div>

        {/* 高级筛选 toggle */}
        <button type="button" className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap order-4"
          style={{
            background: filtersOpen || activeFilterCount ? S.ink : S.surface,
            border: `1px solid ${filtersOpen || activeFilterCount ? S.ink : S.border}`,
            color: filtersOpen || activeFilterCount ? S.accent : S.textSec,
            borderRadius: S.radius, fontFamily: "monospace",
          }}
          onClick={() => setFiltersOpen(v => !v)}>
          <SlidersHorizontal size={13} /><span className="text-xs">筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</span>
        </button>

        <div className="order-5"><BrowseModeToggle value={browseMode} onChange={setBrowseMode} label="资源浏览方式" /></div>
        {secondaryActionTargetId && <div id={secondaryActionTargetId} className="ml-auto flex items-center gap-2 flex-shrink-0 order-6" aria-label="账号资产操作" />}
      </div>

      {/* ── 高级筛选面板（可折叠） ─────────────────────────────── */}
      {filtersOpen && (
        <div className="flex items-end gap-3 p-3 flex-shrink-0 flex-wrap" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <label className="block">
            <span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>归属项目</span>
            <select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={projectFilter}
              onChange={e => { setProjectFilter(e.target.value); setPage(1); }}
              style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {projectOptions.map(p => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>城市</span>
            <select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={cityFilter}
              onChange={e => { setCityFilter(e.target.value); setPage(1); }}
              style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {cityOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>归属部门</span>
            <select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={departmentFilter}
              onChange={e => { setDepartmentFilter(e.target.value); setPage(1); }}
              style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {departmentOptions.map(d => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>服务官</span>
            <select className="min-w-28 px-2.5 py-2 text-xs outline-none" value={serviceFilter}
              onChange={e => { setServiceFilter(e.target.value); setPage(1); }}
              style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {serviceOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>容量与同步</span>
            <select className="min-w-36 px-2.5 py-2 text-xs outline-none" value={capacityFilter}
              onChange={e => { setCapacityFilter(e.target.value as "全部" | "容量预警" | "同步异常"); setPage(1); }}
              style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {["全部", "容量预警", "同步异常"].map(f => <option key={f}>{f}</option>)}
            </select>
          </label>
          <div className="mb-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>符合条件 <b style={{ color: S.text }}>{filteredTools.length}</b> 个资源</div>
          <button type="button" className="ml-auto px-3 py-2 text-xs"
            style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }}
            onClick={clearAdvancedFilters}>重置筛选</button>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toast && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0"
          style={{ background: S.primaryLight, border: `1px solid ${S.primaryMid}`, borderRadius: S.radius }}>
          <span className="text-xs font-medium" style={{ color: S.text, fontFamily: "monospace" }}>{toast}</span>
          <button type="button" title="关闭提示" onClick={() => setToast("")}><X size={13} style={{ color: S.muted }} /></button>
        </div>
      )}

      {/* ── 批量操作栏 ──────────────────────────────────────────── */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{ background: S.ink, color: S.accent, borderRadius: S.radius, fontFamily: "monospace" }}>
          <span className="text-xs font-bold">已选 {selectedRows.length} 个资源</span>
          <button type="button" className="px-2 py-1 text-xs" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm }}
            onClick={() => runBulkAction("批量交接")}>批量交接</button>
          {selectedRows.some(id => tools.find(t => t.id === id && needsNurturing(t.type))) && (
          <button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }}
            onClick={() => runBulkAction("送回养号")}>送回养号</button>
          )}
          <button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }}
            onClick={() => runBulkAction("标记风控关注")}>标记风控</button>
          <button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.text, borderRadius: S.radiusSm }}
            onClick={() => runBulkAction("停用并归档")}>停用归档</button>
          <button type="button" className="px-2 py-1 text-xs" style={{ background: S.surface, color: S.muted, borderRadius: S.radiusSm }}
            onClick={() => setSelectedRows([])}>取消选择</button>
        </div>
      )}

      {/* ── 主区域：按项目 → 双栏(左项目面板 + 右项目详情)；其他 → 列表+详情 ────── */}
      {viewDimension === "project" ? (
        <div className="flex gap-4 flex-1 min-h-0">
          {/* 左侧：项目面板 */}
          <ProjectPanel
            projects={initialProjects}
            tools={tools}
            activeId={activeProjectId}
            onSelect={pid => { setActiveProjectId(pid); setSelectedToolId(null); }}
          />
          {/* 右侧：项目详情 */}
          <div className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <ProjectDetail
              projectId={activeProjectId}
              projects={initialProjects}
              tools={tools}
              selectedToolId={selectedToolId}
              onSelectTool={id => { setSelectedToolId(id); setDetailTab("ops"); }}
              accountNameById={accountNameById}
            />
          </div>
        </div>
      ) : (
      <div className="flex gap-4 flex-1 min-h-0">
        {/* 左侧：列表 / 卡片 */}
        {browseMode === "cards" ? (
          <div className="flex-1 min-w-0 min-h-0 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <ResourceCards
              tools={pagedTools}
              selectedToolId={selectedToolId}
              onSelect={id => { setSelectedToolId(id); setDetailTab("ops"); }}
              onAction={showToast}
              onHandover={toolId => setHandoverDraft({ toolId, targetUid: accounts.find(a => a.uid !== tools.find(t => t.id === toolId)?.boundAccountId)?.uid || accounts[0]?.uid || "" })}
            />
            <BrowsePager page={safePage} totalPages={totalPages} total={filteredTools.length} onPageChange={setPage} />
          </div>
        ) : (
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f1f5f9" }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>
                  {TOP_TABS.find(t => t.key === topTab)?.label} 资源列表
                </div>
                <div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                  按类型展示专属字段；点击行查看完整详情
                </div>
              </div>
              <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 <b style={{ color: S.text }}>{filteredTools.length}</b> 条</div>
            </div>

            <div className="flex-1 overflow-auto">
              <div style={{ minWidth: Math.max(980, visibleTableWidth) }}>
                {/* 表头 */}
                <div className="flex items-center px-4 py-2.5 sticky top-0 z-10" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}` }}>
                  {COLS.map(c => (
                    <div key={c.key} className="flex-shrink-0 text-xs font-semibold"
                      style={columnStyle(c.key, { width: c.w, color: "#475569", fontFamily: "monospace" })}>
                      {c.key === "select" ? (
                        <input type="checkbox" aria-label="选择当前页"
                          checked={pagedTools.length > 0 && pagedTools.every(t => selectedRows.includes(t.id))}
                          onChange={e => setSelectedRows(e.target.checked ? Array.from(new Set([...selectedRows, ...pagedTools.map(t => t.id)])) : selectedRows.filter(id => !pagedTools.some(t => t.id === id)))} />
                      ) : c.key === "friendCount" ? metricMeta(viewMetricType).primaryLabel : c.key === "groups" ? metricMeta(viewMetricType).groupLabel : c.label}
                    </div>
                  ))}
                </div>

                {/* 行 */}
                {pagedTools.map(t => {
                  const isSelected = selectedToolId === t.id;
                  const cap = getToolCapacity(t);
                  const metric = getRowMetric(t, viewMetricType, cap);
                  const syncMeta = getSyncMeta(t, cap);
                  const sm = statusMeta[t.status];
                  const rm = riskMeta[t.riskLevel];
                  const tm = typeMeta[t.type];
                  const Icon = TYPE_ICON[t.type];
                  return (
                    <div key={t.id} role="button" tabIndex={0}
                      className="flex items-center w-full px-4 text-left cursor-pointer transition-all"
                      style={{
                        background: isSelected ? S.accentLight : S.surface,
                        borderBottom: `1px solid ${S.border}`,
                        borderLeft: isSelected ? `3px solid ${S.primary}` : "3px solid transparent",
                        paddingTop: 10, paddingBottom: 10,
                      }}
                      onClick={() => { setSelectedToolId(t.id); setDetailTab("ops"); }}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedToolId(t.id); setDetailTab("ops"); } }}>
                      <div className="flex-shrink-0 flex items-center justify-center" style={columnStyle("select", { width: 36 })}>
                        <input type="checkbox" aria-label={`选择 ${t.name}`} checked={selectedRows.includes(t.id)}
                          onClick={e => e.stopPropagation()} onChange={() => toggleRow(t.id)} />
                      </div>
                      <div className="flex-shrink-0" style={columnStyle("status", { width: 84 })}>
                        <span className="px-1.5 py-0.5 text-xs" style={{ background: sm.badgeBg, color: sm.badgeColor, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{sm.label}</span>
                      </div>
                      <div className="flex-shrink-0" style={columnStyle("avatar", { width: 60 })}>
                        {t.status === "not_enabled" || t.status === "idle" ? (
                          <div className="w-8 h-8 grid place-items-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm, color: S.muted }}><Icon size={14} /></div>
                        ) : (
                          <img src={getAvatar(parseInt(t.id.replace(/\D/g, "") || "0", 10) || 0)} alt={t.name} style={{ width: 32, height: 32, borderRadius: S.radiusSm, objectFit: "cover" }} />
                        )}
                      </div>
                      <div className="flex-shrink-0 min-w-0 whitespace-nowrap text-xs font-semibold" title={t.name} style={columnStyle("name", { width: 200, color: S.text, fontFamily: "monospace" })}>{t.name}</div>
                      <div className="flex-shrink-0 min-w-0 whitespace-nowrap text-xs" title={t.identifier} style={columnStyle("identifier", { width: 150, color: S.textSec, fontFamily: "monospace" })}>{t.identifier}</div>
                      <div className="flex-shrink-0 text-xs" style={columnStyle("type", { width: 84 })}>
                        <span className="px-1.5 py-0.5" style={{ background: tm.bg, color: tm.color, borderRadius: S.radiusSm, fontFamily: "monospace", fontSize: "10px" }}>{tm.short}</span>
                      </div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" title={projectName(t.boundProjectIds)} style={columnStyle("project", { width: 140, color: t.boundProjectIds.length ? S.primary : S.muted, fontFamily: "monospace" })}>
                        {projectName(t.boundProjectIds)}
                      </div>
                      <div className="flex-shrink-0 min-w-0 truncate text-xs" title={accountNameById(t.boundAccountId)} style={columnStyle("owner", { width: 120, color: S.textSec, fontFamily: "monospace" })}>
                        {t.boundAccountId ? accountNameById(t.boundAccountId) : <span style={{ color: S.muted }}>空闲</span>}
                      </div>
                      <div className="flex-shrink-0" style={columnStyle("friendCount", { width: 140 })}>
                        <b className="text-xs" style={{ color: metric.primaryRisk ? "#c2410c" : S.text, fontFamily: "monospace" }}>{metric.primaryValue.toLocaleString()}</b>
                        <span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}> / {metric.primaryMax.toLocaleString()}</span>
                        <div className="mt-1 h-1 overflow-hidden" style={{ background: "#eeeeea", borderRadius: 99 }}>
                          <div style={{ width: `${Math.max(metric.primaryRate * 100, metric.primaryValue ? 4 : 0)}%`, height: "100%", background: metric.primaryRisk ? "#f59e0b" : S.primary }} />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-xs" style={columnStyle("groups", { width: 96, color: S.textSec, fontFamily: "monospace" })}>
                        {metric.groupText}
                      </div>
                      <div className="flex-shrink-0" style={columnStyle("sync", { width: 104 })}>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs" style={{ background: syncMeta.bg, color: syncMeta.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                          {cap.isSyncRisk && <AlertTriangle size={10} />}{syncMeta.label}
                        </span>
                      </div>
                      <div className="flex-shrink-0 text-xs" style={columnStyle("risk", { width: 80, color: rm.color, fontFamily: "monospace", fontWeight: 700 })}>{rm.label}</div>
                      <div className="flex-shrink-0 text-xs" style={columnStyle("lastActive", { width: 110, color: S.muted, fontFamily: "monospace" })}>{t.lastActiveDate}</div>
                      <div className="flex-shrink-0 flex gap-1.5" style={columnStyle("action", { width: 196 })}
                        onClick={e => e.stopPropagation()}>
                        <button type="button" title="预览" className="px-2 py-1 text-xs font-semibold"
                          style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                          onClick={() => { setSelectedToolId(t.id); setDetailTab("general"); }}>
                          <Eye size={11} className="inline mr-0.5" />详情
                        </button>
                        <button type="button" title="交接" className="px-2 py-1 text-xs font-bold"
                          style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                          onClick={() => setHandoverDraft({ toolId: t.id, targetUid: accounts.find(a => a.uid !== t.boundAccountId)?.uid || accounts[0]?.uid || "" })}>
                          交接
                        </button>
                      </div>
                    </div>
                  );
                })}

                {pagedTools.length === 0 && (
                  <div className="py-16 text-center text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>
                    🤷‍♀️ 当前筛选下没有匹配的资源 · 试试清空筛选条件
                    <div style={{ marginTop: 12 }}>
                      <button type="button" onClick={() => { setSearch(""); setStatusFilter("全部"); clearAdvancedFilters(); }}
                        style={{ padding: "7px 16px", background: S.primary, color: S.onPrimary, fontWeight: 600, borderRadius: 7, border: "none", cursor: "pointer", boxShadow: "0 1px 2px rgba(37,99,235,.15)", fontSize: 12 }}>
                        清空筛选条件
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <BrowsePager page={safePage} totalPages={totalPages} total={filteredTools.length} onPageChange={setPage} />
          </div>
        )}

        {/* 右侧：详情面板 */}
        {selectedTool && (
          <DetailPanel
            key={selectedTool.id}
            tool={selectedTool}
            accountName={accountNameById(selectedTool.boundAccountId)}
            accountUid={selectedTool.boundAccountId}
            accounts={accounts}
            tab={detailTab}
            setTab={setDetailTab}
            onRequestHandover={toolId => setHandoverDraft({ toolId, targetUid: accounts[0]?.uid || "" })}
            onConfirmAction={(toolId, a, label) => setConfirmAction({ toolId, action: a, label })}
            onMutate={(patch, act, summary) => mutateTool(selectedTool.id, patch, act, summary)}
            onSwitchProject={() => showToast("🗺 切换项目：已弹出项目多选对话框（示例）")}
            onSwitchOwner={() => setHandoverDraft({ toolId: selectedTool.id, targetUid: accounts.find(a => a.uid !== selectedTool.boundAccountId)?.uid || accounts[0].uid })}
            onMediaMatrix={() => showToast("🔗 已打开矩阵配置面板：选择目标矩阵 + 关系（主号/子号）")}
            onMediaBiz={() => showToast("💼 已创建商单申请：进入审批中心『业务合作类』走审批")}
            onToast={showToast}
          />
        )}
        {!selectedTool && (
          <div className="w-[400px] flex-shrink-0 flex flex-col items-center justify-center text-center p-8"
            style={{ background: S.surface, border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusLg, color: S.muted }}>
            <Package size={32} style={{ marginBottom: 8, color: S.mutedLight }} />
            <div className="text-sm" style={{ color: S.muted, fontFamily: "monospace" }}>点击左侧任意资源行查看完整详情</div>
            <div className="text-xs mt-2" style={{ color: S.mutedLight, fontFamily: "monospace" }}>支持 通用 · 运营专属 · 风控 · 操作日志 4 Tab</div>
          </div>
        )}
      </div>
      )}

      {/* ── 全局弹窗层（共享） ──────────────────────────────────── */}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 卡片模式：3 列网格
// ────────────────────────────────────────────────────────────────
function ResourceCards({
  tools, selectedToolId, onSelect, onAction, onHandover,
}: {
  tools: Tool[];
  selectedToolId: string | null;
  onSelect: (id: string | null) => void;
  onAction: (msg: string) => void;
  onHandover: (toolId: string) => void;
}) {
  if (!tools.length) {
    return <div className="flex-1 grid place-items-center" style={{ color: S.muted, fontFamily: "monospace" }}>暂无匹配数据</div>;
  }
  return (
    <div className="flex-1 overflow-auto pr-1">
      <div className="grid grid-cols-3 gap-3 content-start pb-2">
        {tools.map(t => {
          const cap = getToolCapacity(t);
          const sm = statusMeta[t.status];
          const tm = typeMeta[t.type];
          const Icon = TYPE_ICON[t.type];
          const isSelected = selectedToolId === t.id;
          const isStock = t.status === "not_enabled" || t.status === "idle" || t.status === "nurturing";
          const metricThird = t.type === "media"
            ? [["粉丝", `${cap.friendCount >= 10000 ? (cap.friendCount / 10000).toFixed(1) + "w" : cap.friendCount.toLocaleString()}`], ["发布30d", String(t.publish30d ?? 0)], ["播放", (t.play30d ?? 0) >= 10000 ? `${((t.play30d ?? 0) / 10000).toFixed(1)}w` : String(t.play30d ?? 0)]]
            : t.type === "wecom"
              ? [["客户", cap.friendCount.toLocaleString()], ["群", String(t.groupCount)], ["消息7d", String(t.last7dMessageCount ?? 0)]]
              : t.type === "phone"
                ? [["运营商", t.carrier || "—"], ["实名", t.realNameStatus || "—"], ["绑微信", String(t.boundWechatCount ?? 0)]]
                : t.type === "email"
                  ? [["服务商", t.emailProvider || "—"], ["验证", t.emailVerified ? "已验证" : "待验证"], ["密保", t.emailSecurityConfigured ? "已配置" : "未配置"]]
                  : [["好友", `${cap.friendCount}/2000`], ["群", `${t.groupCount} 个`], ["扫码", String(cap.scanCount)]];
          return (
            <button key={t.id} type="button"
              onClick={() => onSelect(isSelected ? null : t.id)}
              className="p-4 text-left transition-all"
              style={{
                background: isSelected ? S.accentLight : S.surface,
                border: isSelected ? `1px solid ${S.primary}` : `1px solid ${S.border}`,
                borderRadius: S.radius,
                boxShadow: "0 1px 4px rgba(15,23,42,.05)",
              }}>
              <div className="flex items-start gap-3">
                {isStock ? (
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: "#f1f5f9", color: S.muted, borderRadius: S.radiusSm }}>
                    <Icon size={16} />
                  </div>
                ) : (
                  <img src={getAvatar(parseInt(t.id.replace(/\D/g, "") || "0", 10) || 0)} alt={t.name} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover" }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <b className="truncate text-sm" style={{ color: S.text, fontFamily: "monospace" }}>{t.name}</b>
                    <span className="px-1.5 py-0.5 text-xs font-medium" style={{ background: sm.badgeBg, color: sm.badgeColor, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{sm.label}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
                    {t.identifier} · {tm.short}
                  </div>
                </div>
              </div>

              {/* 容量进度条 */}
              {!isStock && (
                <div className="mt-3">
                  <CapacityMeter label={metricMeta(t.type).primaryLabel} value={cap.friendCount} max={cap.friendMax} warning={cap.isFriendRisk} />
                </div>
              )}

              {/* 3 格指标 */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {metricThird.map(([label, value]) => (
                  <div key={label as string} className="px-2 py-1.5 text-center" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                    <b className="block text-xs" style={{ color: S.text, fontFamily: "monospace" }}>{value}</b>
                    <small style={{ color: S.muted, fontSize: "10px", fontFamily: "monospace" }}>{label}</small>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 pt-2.5" style={{ borderTop: `1px solid ${S.border}` }}>
                <span className="truncate text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>
                  {t.boundProjectIds.length ? projectName(t.boundProjectIds) : "— 待分配 —"}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: S.muted, fontFamily: "monospace" }}>
                  {t.boundAccountId ? accountShortName(t.boundAccountId) : "空闲"}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-end gap-1.5 pt-2" style={{ borderTop: `1px solid ${S.border}` }}
                onClick={e => e.stopPropagation()}>
                <button type="button" className="px-2 py-1 text-xs" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                  onClick={() => onSelect(isSelected ? null : t.id)}>查看详情</button>
                <button type="button" className="px-2.5 py-1 text-xs font-bold" style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                  onClick={() => onHandover(t.id)}>交接</button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function accountShortName(uid: string): string {
  // 资源卡片右上角显示归属人短名，使用 mockAccounts 数据；
  // 这里通过同模块 import 难以避免循环，统一返回 uid 的最后 4 字符作为占位
  return uid.length > 8 ? uid.slice(-6) : uid;
}

// ────────────────────────────────────────────────────────────────
// 详情面板：4 Tab + 类型专属运营面板 + 动作按钮
// 视觉风格匹配 WeChatManagement（黑底 header + accent 蓝色 Tab）
// ────────────────────────────────────────────────────────────────
function DetailPanel({
  tool, accountName, accounts, tab, setTab,
  onRequestHandover, onConfirmAction, onMutate,
  onSwitchProject, onSwitchOwner,
  onMediaMatrix, onMediaBiz,
  accountUid, onToast,
}: {
  tool: Tool;
  accountName: string;
  accountUid: string | null;
  accounts: SystemAccount[];
  tab: DetailTabKey;
  setTab: (t: DetailTabKey) => void;
  onRequestHandover: (toolId: string) => void;
  onConfirmAction: (toolId: string, a: "disable" | "archive" | "send_nurture", label: string) => void;
  onMutate: (patch: Partial<Tool>, act: LogAction, summary: string) => void;
  onSwitchProject: () => void;
  onSwitchOwner: () => void;
  onMediaMatrix: () => void;
  onMediaBiz: () => void;
  onToast: (msg: string) => void;
}) {
  void accounts; void onToast;
  const tm = typeMeta[tool.type];
  const sm = statusMeta[tool.status];
  const rm = riskMeta[tool.riskLevel];
  const Icon = TYPE_ICON[tool.type];
  const cap = getToolCapacity(tool);
  const syncMeta = getSyncMeta(tool, cap);

  const tabs: { key: DetailTabKey; label: string; icon: React.ReactNode; title: string }[] = [
    { key: "general", label: "通用", icon: <Package size={12} />, title: "通用字段：阶段/归属/项目/活跃" },
    { key: "ops", label: tm.short + "·运营专属", icon: <Sparkles size={12} />, title: "按类型切换 4 套专属模板（微信/企微/手机/媒体）" },
    { key: "risk", label: "🛡 风控", icon: <Shield size={12} />, title: "风控等级 + 异常事件 + 登录设备" },
    { key: "log", label: "📜 操作日志", icon: <History size={12} />, title: "完整操作时间线" },
  ];

  return (
    <aside className="w-[400px] flex-shrink-0 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusLg }} aria-label="资源详情">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: "#f1f5f9" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>资源详情</div>
          <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>点击列表资源后查看与调度</div>
        </div>
        <button type="button" title="刷新" className="w-7 h-7 grid place-items-center" style={{ border: `1px solid ${S.border}`, background: S.surface, borderRadius: S.radiusSm }}
          onClick={() => onToast(`🔁 已刷新 ${tool.name} 的风控状态`)}><RefreshCw size={13} /></button>
      </div>

      {/* 资源身份卡 */}
      <div className="px-4 pt-3">
        <div className="flex items-start gap-3">
          {tool.status === "not_enabled" || tool.status === "idle" ? (
            <div className="w-12 h-12 grid place-items-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm, color: S.muted }}>
              <Icon size={18} />
            </div>
          ) : (
            <img src={getAvatar(parseInt(tool.id.replace(/\D/g, "") || "0", 10) || 0)} alt={tool.name} style={{ width: 48, height: 48, borderRadius: S.radiusSm, objectFit: "cover" }} />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5" style={{ background: tm.bg, color: tm.color, borderRadius: S.radiusSm, fontFamily: "monospace", fontSize: "10px" }}>
                <Icon size={11} className="inline mr-0.5" />{tm.label}
              </span>
              <b className="text-sm truncate" style={{ color: S.text, fontFamily: "monospace" }}>{tool.name}</b>
              <span className="px-1.5 py-0.5 text-xs" style={{ background: sm.badgeBg, color: sm.badgeColor, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{sm.label}</span>
            </div>
            <div className="mt-1 text-xs" style={{ color: S.textSec, fontFamily: "monospace" }}>{tool.identifier}</div>
            <div className="mt-0.5 text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>
              {tool.boundPhone && `📱 ${tool.boundPhone} · `}
              {tool.platform && `${tool.platform} · `}
              {tool.onboardDate && `入库 ${tool.onboardDate}`}
            </div>
          </div>
          <button type="button" title="查看二维码" className="w-9 h-9 grid place-items-center" style={{ background: S.accentLight, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, color: S.text }}
            onClick={() => onToast(`${tool.identifier} 的二维码查看入口已打开`)}><QrCode size={17} /></button>
        </div>
      </div>

      {/* Tabs（黑底 accent 蓝高亮，匹配 WeChatManagement） */}
      <div className="px-4 pt-3 flex gap-1 flex-shrink-0" role="tablist" aria-label="资源详情标签">
        {tabs.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} type="button" role="tab" aria-selected={active} title={t.title}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold"
              style={{
                background: active ? S.ink : "#f1f5f9",
                color: active ? S.accent : S.muted,
                border: `1px solid ${active ? S.ink : S.border}`,
                borderRadius: S.radiusSm,
                fontFamily: "monospace",
              }}>
              {t.icon}{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* 风险提示条 */}
        {(cap.isRisk || tool.status === "待交接" || tool.status === "pending_transfer" || tool.status === "abnormal") && (
          <div className="flex gap-2 p-3" style={{ background: "#fffaf0", border: "1px solid #fed7aa", borderRadius: S.radius }}>
            <AlertTriangle size={15} style={{ color: "#c2410c", flexShrink: 0, marginTop: 1 }} />
            <div className="text-xs leading-relaxed" style={{ color: "#9a3412", fontFamily: "monospace" }}>
              {tool.status === "pending_transfer" ? "资源待交接，请先指定接手服务人员。" :
                tool.status === "abnormal" ? "资源存在异常，请核查登录与同步状态。" :
                cap.isSyncRisk ? "资源近期未同步，请核查登录与企微绑定。" :
                cap.isFriendRisk ? `${metricMeta(tool.type).primaryLabel}接近上限，建议停止分配新用户。` :
                `${metricMeta(tool.type).groupLabel}接近上限，建议提前准备备用资源。`}
            </div>
          </div>
        )}

        {/* 归属信息（上移至容量摘要上方，与微信账号管理对齐） */}
        <div className="p-3" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radius }}>
          <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>
            <Link2 size={13} />归属信息
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["归属项目", projectName(tool.boundProjectIds)], ["归属人", accountName], ["账号类型", tm.label], ["归属岗位", tool.accountPosition || "—"], ["归属部门", tool.department || "—"], ["入库日期", tool.onboardDate || "—"]].map(([l, v]) => (
              <div key={l} className="min-w-0">
                <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{l}</div>
                <div className="mt-0.5 text-xs font-medium truncate" style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 容量 + 同步状态卡 */}
        <div className="space-y-3 p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
          <CapacityMeter label={metricMeta(tool.type).primaryLabel} value={cap.friendCount} max={cap.friendMax} warning={cap.isFriendRisk} />
          {cap.groupMax > 0 && <CapacityMeter label={metricMeta(tool.type).groupLabel} value={cap.groupCount} max={cap.groupMax} warning={cap.isGroupRisk} />}
          <div className="flex items-center justify-between pt-1 text-xs" style={{ borderTop: `1px solid ${S.border}`, fontFamily: "monospace" }}>
            <span style={{ color: S.muted }}>同步状态</span>
            <span className="px-1.5 py-0.5" style={{ background: syncMeta.bg, color: syncMeta.color, borderRadius: S.radiusSm }}>{syncMeta.label}</span>
          </div>
        </div>

        {tab === "general" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <Row k="状态阶段" v={<span style={{ padding: "1px 5px", background: sm.badgeBg, color: sm.badgeColor, borderRadius: 3, fontWeight: 700 }}>{sm.label}</span>} />
              <Row k="风控等级" v={<span style={{ color: rm.color, fontWeight: 700, background: rm.bg, padding: "1px 5px", borderRadius: 3 }}>{rm.label}</span>} />
              <Row k="归属人" v={<span style={{ fontWeight: 700, color: S.text }}>{accountName}{accountUid ? <span style={{ color: S.muted, marginLeft: 4, fontFamily: "monospace", fontSize: 10 }}>· {accountUid}</span> : ""}</span>} />
              <Row k="分配项目" v={<span style={{ color: S.primary, fontWeight: 700 }}>{projectName(tool.boundProjectIds)}</span>} />
              <Row k="好友/粉丝数" v={<span style={{ fontFamily: "monospace", color: S.text, fontWeight: 700 }}>{tool.friendCount.toLocaleString()}</span>} />
              <Row k="群/会话数" v={<span style={{ fontFamily: "monospace", color: S.text }}>{tool.groupCount}</span>} />
              <Row k="每日上限 / 今日已加" v={<span style={{ fontFamily: "monospace" }}>{tool.dailyAddLimit} / <b style={{ color: S.success }}>{tool.todayAdded}</b></span>} />
              <Row k="最后活跃" v={<span style={{ fontFamily: "monospace" }}>{tool.lastActiveDate}</span>} />
              <Row k="最后登录" v={<span style={{ fontFamily: "monospace" }}>{tool.lastLoginDate || "—"} <span style={{ color: S.muted, marginLeft: 4 }}>{tool.lastLoginDevice || ""}</span></span>} />
            </div>
            <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>生命周期进度</div>
                <span className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>阶段与运营状态分开记录</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {lifecycleStages.map((stage, index) => {
                  const current = getLifecycleStageIndex(tool);
                  const reached = index <= current;
                  return <div key={stage.key} className="flex items-center gap-1 flex-shrink-0"><span className="flex items-center gap-1 px-1.5 py-1 text-[10px]" style={{ background: index === current ? S.ink : reached ? S.accentLight : S.bg, color: index === current ? S.accent : reached ? S.text : S.muted, border: `1px solid ${index === current ? S.ink : reached ? S.accentMid : S.border}`, borderRadius: 999, fontFamily: "monospace" }}><span className="w-1.5 h-1.5" style={{ background: index === current ? S.accent : reached ? S.primaryDark : S.mutedLight, borderRadius: 99 }} />{stage.label}</span>{index < lifecycleStages.length - 1 && <ChevronRight size={10} style={{ color: S.mutedLight }} />}</div>;
                })}
              </div>
            </div>
            {tool.notes && (
              <div className="p-3 text-xs" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, color: S.muted, lineHeight: 1.6, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                📝 {tool.notes}
              </div>
            )}
          </div>
        )}

        {tab === "ops" && <OpsTemplate tool={tool} />}

        {tab === "risk" && (
          <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
            <div className="p-3" style={{ background: rm.bg, border: `1px solid ${rm.color}33`, borderRadius: S.radius }}>
              <div style={{ color: rm.color, fontWeight: 700 }}>风控等级：{rm.label}</div>
              <div className="mt-1" style={{ color: S.textSec }}>
                {tool.riskLevel === "normal" && "✅ 近30天无异常登录、无超限加粉、无投诉举报"}
                {tool.riskLevel === "warning" && "⚠️ 检测到 1-2 项需要关注的指标，请尽快介入"}
                {tool.riskLevel === "high" && "🚨 高危，建议立即暂停发放，进入人工复核（已自动打标签）"}
              </div>
            </div>
            <Row k="风险事件(近30天)" v={tool.riskLevel === "high" ? <span style={{ color: "#c53030", fontWeight: 700 }}>2 次 · 长期未登录 + 设备异常</span> : tool.riskLevel === "warning" ? <span style={{ color: "#c05621" }}>1 次 · 接近交接或风控阈值</span> : "0 次"} />
            <Row k="最近登录设备" v={<span style={{ fontFamily: "monospace", color: S.text }}>{tool.lastLoginDevice || "—"}</span>} />
            <Row k="最近登录IP(示例)" v={<span style={{ fontFamily: "monospace", color: S.text }}>{tool.type === "wechat" ? "221.220.12.88 北京" : tool.type === "media" ? "221.220.12.88 北京" : tool.type === "phone" ? "4G基站(移动·北京LAC-10032)" : "124.65.33.2 北京 企业专线"}</span>} />
            <Row k="是否开启安全守护" v={tool.type === "wechat" && tool.wechatPasswordConfigured ? <span style={{ color: S.success, fontWeight: 700 }}>✅ 微信/QQ/邮箱 三项密保已配置</span> : <span style={{ color: "#c05621" }}>部分安全项未完整配置（见运营Tab）</span>} />
          </div>
        )}

        {tab === "log" && (
          <div className="text-xs">
            {(tool.operationLogs || []).length === 0 ? (
              <div style={{ color: S.muted, padding: 20, textAlign: "center" }}>暂无操作日志（旧数据请以系统审批中心为准）</div>
            ) : (
              <div style={{ position: "relative", paddingLeft: 16 }}>
                <div style={{ position: "absolute", left: 5, top: 2, bottom: 2, width: 2, background: S.borderMed }} />
                {(tool.operationLogs || []).map(l => (
                  <div key={l.id} style={{ position: "relative", marginBottom: 10 }}>
                    <div style={{ position: "absolute", left: -14, top: 3, width: 10, height: 10, background: "#ffffff", border: `2px solid ${S.primary}`, borderRadius: "50%", boxShadow: `0 0 0 3px ${S.primaryLight}` }} />
                    <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>{l.time} · <span style={{ color: S.textSec }}>{l.actor}</span></div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{l.action}</div>
                    {l.summary && <div style={{ fontSize: 11, color: S.textSec, marginTop: 1 }}>{l.summary}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 动作按钮 */}
      <div className="p-3 grid grid-cols-2 gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}` }}>
        <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
          style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onSwitchProject()}>
          <Building2 size={12} /> 改项目
        </button>
        <button type="button" className="py-2 text-xs font-bold flex items-center justify-center gap-1"
          style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onRequestHandover(tool.id)}>
          <ArrowRightLeft size={12} /> 工具交接
        </button>
        <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
          style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onSwitchOwner()}>
          <User size={12} /> 改归属人
        </button>
        {needsNurturing(tool.type) && (
        <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
          style={{ background: S.warningBg, color: S.warning, border: `1px solid #fde68a`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onConfirmAction(tool.id, "send_nurture", "送回养号")}>
          <Clock size={12} /> 送回养号
        </button>
        )}
        <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
          style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onMutate({} as any, "编辑详情", "手动更新资料（示例）")}>
          <Edit3 size={12} /> 编辑详情
        </button>
        <button type="button" className="py-2 text-xs font-bold flex items-center justify-center gap-1"
          style={{ background: S.dangerBg, color: S.danger, border: `1px solid #fecaca`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onConfirmAction(tool.id, "disable", "立即停用")}>
          <Trash2 size={12} /> 停用
        </button>
        <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
          style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
          onClick={() => onConfirmAction(tool.id, "archive", "归档到资产库")}>
          <Archive size={12} /> 归档
        </button>
        {tool.type === "media" && (
          <>
            <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
              style={{ background: S.primaryLight, color: S.primary, border: `1px solid ${S.primaryMid}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
              onClick={onMediaMatrix}>
              <Link2 size={12} /> 加入矩阵
            </button>
            <button type="button" className="py-2 text-xs font-semibold flex items-center justify-center gap-1"
              style={{ background: S.primaryLight, color: S.primary, border: `1px solid ${S.primaryMid}`, borderRadius: S.radiusSm, fontFamily: "monospace" }}
              onClick={onMediaBiz}>
              <Store size={12} /> 申请商单
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────────
// 运营专属 4 套模板
// ────────────────────────────────────────────────────────────────
function OpsTemplate({ tool }: { tool: Tool }) {
  if (tool.type === "media") return <OpsMedia tool={tool} />;
  if (tool.type === "wechat") return <OpsWechat tool={tool} />;
  if (tool.type === "wecom") return <OpsWecom tool={tool} />;
  if (tool.type === "email") return <OpsEmail tool={tool} />;
  return <OpsPhone tool={tool} />;
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 mb-3">{children}</div>;
}
function KCard({ title, value, sub, color }: { title: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="px-2 py-2" style={{ background: color ? `${color}11` : "#f8fafc", border: `1px solid ${color || S.borderMed}`, borderRadius: S.radiusSm }}>
      <div style={{ fontSize: 9, color: S.muted, fontWeight: 700, fontFamily: "monospace" }}>{title}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: S.text, fontFamily: "monospace" }}>{typeof value === "number" ? value.toLocaleString() : value}</div>
      {sub && <div style={{ fontSize: 9, color: S.success, fontWeight: 700, fontFamily: "monospace" }}>{sub}</div>}
    </div>
  );
}

function OpsMedia({ tool }: { tool: Tool }) {
  const play = tool.play30d ?? 0;
  const pub = tool.publish30d ?? 0;
  const avg = pub > 0 ? Math.round(play / pub) : 0;
  return (
    <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
      <CardGrid>
        <KCard title="粉丝总数" value={tool.fansCount ?? tool.friendCount} sub={tool.fansGrowth7d ? `▲ 近7日 +${tool.fansGrowth7d}` : undefined} color="#ff6b35" />
        <KCard title="30日发布" value={pub} sub={(tool.last7Publish?.length || 0) + "条近7天"} color="#bef264" />
        <KCard title="30日播放" value={play >= 10000 ? (play / 10000).toFixed(1) + "w" : play} sub={avg ? `均 ${avg >= 10000 ? (avg / 10000).toFixed(1) + "w" : avg}/条` : undefined} color="#bfdbfe" />
      </CardGrid>
      <div className="grid grid-cols-2 gap-2">
        <Row k="平台认证" v={<>
          {tool.certifiedType && <span style={{ padding: "1px 6px", background: S.primary, color: S.onPrimary, borderRadius: 4, fontSize: 10, fontWeight: 600, marginRight: 4 }}>{tool.certifiedType}</span>}
          {tool.certifiedSubject || <span style={{ color: S.muted }}>未认证</span>}
        </>} />
        <Row k="创作者中心" v={tool.creatorLevel ? <b>L{tool.creatorLevel.replace(/^L/, "")}</b> : <span style={{ color: S.muted }}>未开通</span>} />
        <Row k="内容标签" v={(tool.contentTags || []).length ? (tool.contentTags || []).map(c => <span key={c} style={{ padding: "0 4px", background: "#f3f4f6", borderRadius: 3, marginRight: 2, fontSize: 10 }}>{c}</span>) : <span style={{ color: S.muted }}>—</span>} />
        <Row k="矩阵归属" v={tool.matrixGroup || <span style={{ color: S.muted }}>未加入</span>} />
        <Row k="MCN签约" v={<span style={{ fontWeight: 700, color: tool.mcnStatus?.startsWith("自营") ? S.success : S.text }}>{tool.mcnStatus || "未设置"}</span>} />
        <Row k="带货权限" v={(tool.commerceCapabilities || []).length ? (tool.commerceCapabilities || []).map(c => <span key={c} style={{ padding: "0 4px", background: "#ecfdf5", color: S.success, borderRadius: 3, marginRight: 2, fontSize: 10 }}>✓{c}</span>) : <span style={{ color: S.muted }}>未开通</span>} />
        <Row k="粉丝画像Top1" v={tool.fansProfileTop || "—"} />
        <Row k="入驻/养号完成" v={tool.nurturingCompletedDate || "—"} />
        <Row k="协同人员" v={tool.collaborators ? Object.entries(tool.collaborators).map(([k, v]) => <div key={k}><b>{k}:</b>{v}</div>) : <span style={{ color: S.muted }}>—</span>} />
        <Row k="本月商单机会" v={tool.commercialOpportunity ? (<>
          <span style={{ color: "#b45309", fontWeight: 700 }}>{tool.commercialOpportunity.pending} 个待对接</span>
          {tool.commercialOpportunity.estimatedCommissionYuan > 0 && <span style={{ marginLeft: 6, fontFamily: "monospace", color: S.success, fontWeight: 700 }}>佣金 ≈ ¥{tool.commercialOpportunity.estimatedCommissionYuan.toLocaleString()}</span>}
        </>) : <span style={{ color: S.muted }}>—</span>} />
      </div>
      {(tool.last7Publish?.length || 0) > 0 && (<>
        <hr style={{ border: "none", borderTop: `1px dashed ${S.borderMed}`, margin: "6px 0" }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: S.textSec, fontFamily: "monospace" }}>📅 近 {tool.last7Publish!.length} 条发布时间线</div>
        <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: "56px 1fr 70px", fontSize: 11, color: S.textSec }}>
          {tool.last7Publish!.map((p, i) => (
            <div key={i} style={{ display: "contents" }}>
              <span style={{ color: S.muted, fontFamily: "monospace" }}>{p.date}</span>
              <span style={{ color: S.text }}>
                <span style={{ padding: "1px 5px", background: p.contentType === "短视频" ? "#ff6b35" : p.contentType === "直播" ? S.success : p.contentType === "合集" ? "#8b5cf6" : "#4a90e2", color: "#ffffff", borderRadius: 4, fontSize: 9, fontWeight: 600, marginRight: 4 }}>{p.contentType}</span>
                {p.title}
              </span>
              <span style={{ textAlign: "right", fontWeight: 700, color: S.success, fontFamily: "monospace" }}>{p.playViews >= 10000 ? (p.playViews / 10000).toFixed(1) + "w" : p.playViews.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

function OpsWechat({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
      <CardGrid>
        <KCard title="好友数" value={tool.friendCount} sub={tool.last7dFriendsGrowth ? `▲7日 +${tool.last7dFriendsGrowth}` : undefined} color="#07c160" />
        <KCard title="近30天邀请新" value={tool.invitedNew30d ?? 0} sub={(tool.scanCount || 0) + " 次扫码"} color={S.success} />
        <KCard title="绑定群数" value={tool.groupCount} sub={tool.qrCodeBound ? "二维码已绑定" : "未绑定群码"} />
      </CardGrid>
      <div className="grid grid-cols-2 gap-2">
        <Row k="账号岗位" v={tool.accountPosition || <span style={{ color: S.muted }}>未定义</span>} />
        <Row k="性别/昵称" v={`${tool.gender || "—"} / ${tool.nickname || tool.name}`} />
        <Row k="绑定QQ" v={tool.qqNo || "—"} />
        <Row k="绑定邮箱" v={tool.boundEmail || "—"} />
        <Row k="实名认证" v={tool.idCardRealName || (tool.certified ? "实名(详情已登记)" : <span style={{ color: "#c53030" }}>未实名⚠️</span>)} />
        <Row k="微信密码" v={tool.wechatPasswordConfigured ? <span style={{ color: S.success, fontWeight: 700 }}>✅ 已配置</span> : <span style={{ color: "#c53030" }}>未配置</span>} />
        <Row k="QQ密保等级" v={tool.qqSecurityLevel || <span style={{ color: "#c05621" }}>未配置</span>} />
        <Row k="邮箱密保" v={tool.emailSecurityConfigured ? <span style={{ color: S.success }}>已配置</span> : <span style={{ color: "#c05621" }}>未配置</span>} />
        <Row k="银行卡绑定" v={tool.bankCardConfigured ? "已绑定" : "未绑定"} />
        <Row k="支付密码" v={tool.payPasswordConfigured ? "已配置" : <span style={{ color: "#c05621" }}>未配置</span>} />
      </div>
      {(tool.emergencyContacts || []).length > 0 && (<>
        <hr style={{ border: "none", borderTop: `1px dashed ${S.borderMed}`, margin: "6px 0" }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: S.textSec, fontFamily: "monospace" }}>🆘 紧急联系人</div>
        {(tool.emergencyContacts || []).map((e, i) => (
          <div key={i} style={{ padding: "4px 6px", background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 4, marginBottom: 3, fontSize: 11 }}>
            <b style={{ color: "#c53030" }}>{e.name}</b> {e.wechatId && <span style={{ fontFamily: "monospace", color: S.muted }}>· 微信:{e.wechatId}</span>} {e.phone && <span>· 📱{e.phone}</span>}
            <div style={{ fontSize: 10, color: S.textSec }}>{e.note}</div>
          </div>
        ))}
      </>)}
    </div>
  );
}

function OpsWecom({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
      <CardGrid>
        <KCard title="外部联系人" value={tool.externalContactCount ?? tool.friendCount} sub={(tool.last7dMessageCount || 0) + " 消息/7日"} color={S.textSec} />
        <KCard title="会话存档" value={tool.chatArchiveEnabled ? "开通" : "未开通"} sub={tool.chatArchiveEnabled ? "合规监控中" : "建议开通"} color={tool.chatArchiveEnabled ? S.success : S.warning} />
        <KCard title="所属群数" value={tool.groupCount} sub="含会话群/客户群" />
      </CardGrid>
      <div className="grid grid-cols-2 gap-2">
        <Row k="企业主体" v={<b>{tool.enterpriseName || tool.corpName || "—"}</b>} />
        <Row k="分公司/品牌" v={tool.subsidiary || "—"} />
        <Row k="所属部门" v={tool.department || "—"} />
        <Row k="席位等级" v="标准版（含微信客服、会话存档）" />
      </div>
    </div>
  );
}

function OpsPhone({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
      <CardGrid>
        <KCard title="运营商" value={tool.carrier || "未填"} />
        <KCard title="实名状态" value={tool.realNameStatus || "未实名"} sub={tool.realNameDate || ""} color={tool.realNameStatus === "已实名" ? "#bef264" : "#3b82f6"} />
        <KCard title="注册微信号" value={tool.boundWechatCount ?? 0} sub={`最多 5 个/号`} />
      </CardGrid>
      <div className="grid grid-cols-2 gap-2">
        <Row k="套餐" v={tool.planName || "—"} />
        <Row k="通话限制" v={tool.callRestriction || "无限制"} />
        <Row k="最后通话" v={tool.lastCallDate || "—"} />
        <Row k="绑定手机号" v={tool.boundPhone || "—"} />
      </div>
    </div>
  );
}

function OpsEmail({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-3 text-xs" style={{ lineHeight: 1.8 }}>
      <CardGrid>
        <KCard title="邮箱状态" value={tool.emailVerified ? "已验证" : "待验证"} color={tool.emailVerified ? "#7c3aed" : "#3b82f6"} />
        <KCard title="服务商" value={tool.emailProvider || "未设置"} />
        <KCard title="安全密保" value={tool.emailSecurityConfigured ? "已配置" : "未配置"} color={tool.emailSecurityConfigured ? "#bef264" : "#3b82f6"} />
      </CardGrid>
      <div className="grid grid-cols-2 gap-2">
        <Row k="邮箱地址" v={<span style={{ fontFamily: "monospace" }}>{tool.identifier}</span>} />
        <Row k="恢复邮箱" v={tool.recoveryEmail || "—"} />
        <Row k="归属项目" v={projectName(tool.boundProjectIds)} />
        <Row k="最近活跃" v={tool.lastActiveDate || "—"} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// UI helpers
// ────────────────────────────────────────────────────────────────
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</div>
      <div className="mt-0.5 text-xs font-medium" style={{ color: S.textSec, fontFamily: "monospace", wordBreak: "break-word" }}>{v}</div>
    </div>
  );
}

function Modal({ title, children, onClose, width = 400 }: { title: string; children: React.ReactNode; onClose: () => void; width?: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,.32)", backdropFilter: "blur(2px)" }}
      onClick={onClose}>
      <div className="flex flex-col overflow-hidden" style={{ width, maxWidth: "92vw", background: "#ffffff", borderRadius: S.radiusLg, border: `1px solid ${S.borderMed}`, boxShadow: "0 25px 50px -12px rgba(15,23,42,.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${S.border}`, background: "#f1f5f9" }}>
          <div className="font-semibold text-sm" style={{ color: S.text, fontFamily: "monospace" }}>{title}</div>
          <button type="button" onClick={onClose} title="关闭" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: S.textSec, borderRadius: 6 }}><X size={16} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ProjectPanel · 左侧项目导航面板（240px 固定宽度）
// ────────────────────────────────────────────────────────────────
function ProjectPanel({
  projects, tools, activeId, onSelect,
}: {
  projects: Project[];
  tools: Tool[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  // 聚合每个项目的账号数（用于 badge）
  const poolCount = tools.filter(t => !(t.boundProjectIds && t.boundProjectIds.length)).length;
  const projectCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of tools) {
      for (const pid of t.boundProjectIds || []) m[pid] = (m[pid] || 0) + 1;
    }
    return m;
  }, [tools]);

  const typeLabelShort = (type: string) => {
    const map: Record<string, string> = { wecom: "企微", wechat: "微信", phone: "手机", email: "邮箱", media: "媒体", workspace: "协作", developer: "开发", business: "业务" };
    return map[type] || type;
  };

  const renderTypeBreakdown = (pid: string) => {
    const projTools = tools.filter(t => t.boundProjectIds?.includes(pid));
    if (!projTools.length) return null;
    const breakdown: Record<string, number> = {};
    for (const t of projTools) breakdown[t.type] = (breakdown[t.type] || 0) + 1;
    const top = Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return (
      <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>
        {top.map(([k, v]) => `${typeLabelShort(k)}${v}`).join(" · ")}
      </div>
    );
  };

  // 项目状态 badge
  const renderStatusDot = (pid: string) => {
    const p = projects.find(x => x.id === pid);
    if (!p) return null;
    const sb = projectStatusBadge(p.status);
    return <span style={{ fontSize: 10, color: sb.color, background: sb.bg, padding: "1px 6px", borderRadius: 10, fontFamily: "monospace" }}>{sb.label}</span>;
  };

  const isActive = activeId === PLATFORM_POOL_ID;

  return (
    <div className="flex-shrink-0 flex flex-col" style={{ width: 240, background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden" }}>
      {/* 头部 */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${S.border}`, background: S.bg }}>
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>
          <Building2 size={14} style={{ color: S.primary }} />
          项目与号池
        </div>
        <div className="mt-0.5 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>PROJECT & POOL</div>
      </div>

      {/* 平台库存 */}
      <button type="button" onClick={() => onSelect(PLATFORM_POOL_ID)}
        className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-all"
        style={{
          background: isActive ? S.accentLight : "transparent",
          borderLeft: isActive ? `3px solid ${S.accent}` : "3px solid transparent",
          color: S.text, cursor: "pointer",
        }}>
        <Package size={14} style={{ color: isActive ? S.accent : S.muted }} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium flex items-center gap-1.5" style={{ fontFamily: "monospace" }}>
            平台库存
            <span style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>· {poolCount}</span>
          </div>
          <div className="text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>尚未授权给任何项目</div>
        </div>
        {isActive && <ChevronRight size={14} style={{ color: S.accent }} />}
      </button>

      <div style={{ height: 1, background: S.border, margin: "2px 12px" }} />

      {/* 项目列表 */}
      <div className="flex-1 overflow-auto py-1">
        {projects.map(p => {
          const active = activeId === p.id;
          const count = projectCounts[p.id] || 0;
          return (
            <button key={p.id} type="button" onClick={() => onSelect(p.id)}
              className="w-full text-left px-4 py-2.5 flex items-start gap-2 transition-all hover:brightness-95"
              style={{
                background: active ? S.accentLight : "transparent",
                borderLeft: active ? `3px solid ${S.accent}` : "3px solid transparent",
                color: S.text, cursor: "pointer",
              }}>
              <Building2 size={14} style={{ color: active ? S.accent : S.muted, flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-medium truncate" style={{ fontFamily: "monospace", color: active ? S.onPrimary : S.text }}>{p.name}</div>
                  {count > 0 && (
                    <span style={{ fontSize: 10, color: S.muted, fontFamily: "monospace", flexShrink: 0 }}>{count}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderStatusDot(p.id)}
                  {p.location && <span style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>{p.location}</span>}
                </div>
                {renderTypeBreakdown(p.id)}
              </div>
              {active && <ChevronRight size={14} style={{ color: S.accent, flexShrink: 0, marginTop: 2 }} />}
            </button>
          );
        })}
      </div>

      {/* 底部新建按钮 */}
      <div className="px-2 py-2" style={{ borderTop: `1px solid ${S.border}` }}>
        <button type="button"
          className="w-full px-3 py-2 flex items-center justify-center gap-1.5 rounded transition-all hover:brightness-95"
          style={{ background: S.accent, color: S.onPrimary, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "monospace" }}>
          <Plus size={14} /> 新建项目
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ProjectDetail · 右侧项目详情（P0 骨架版本）
// ────────────────────────────────────────────────────────────────
function ProjectDetail({
  projectId, projects, tools, selectedToolId, onSelectTool, accountNameById,
}: {
  projectId: string;
  projects: Project[];
  tools: Tool[];
  selectedToolId: string | null;
  onSelectTool: (id: string) => void;
  accountNameById: (uid?: string) => string;
}) {
  const agg = aggregateProject(projectId, tools);
  const project = projectId === PLATFORM_POOL_ID ? null : projects.find(p => p.id === projectId);

  const KPI_CARDS = [
    { label: "账号总数", value: agg.toolCount, icon: Package, color: S.primary },
    { label: "使用中", value: agg.inUse, icon: Check, color: "#07c160" },
    { label: "风险账号", value: agg.riskHigh + agg.riskWarning, icon: AlertTriangle, color: "#ff9500" },
    { label: "今日+好友", value: agg.todayAdded, icon: User, color: S.accent },
  ];

  const typeLabelShort = (type: string) => {
    const map: Record<string, string> = { wecom: "企业微信", wechat: "个人微信", phone: "手机号", email: "邮箱", media: "媒体账号", workspace: "协作/AI", developer: "开发/基础设施", business: "业务系统" };
    return map[type] || type;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── 顶部 Banner ───────────────────────────────────── */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}`, background: S.bg }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Building2 size={20} style={{ color: S.primary }} />
              <div>
                <div className="text-base font-semibold" style={{ color: S.text, fontFamily: "monospace" }}>
                  {project ? project.name : "📊 平台库存"}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>
                  {project
                    ? `${project.subtitle || ""}${project.location ? ` · ${project.location}` : ""}${project.short ? ` · ${project.short}` : ""}`
                    : "未授权给任何项目的账号 · 待分配"}
                </div>
              </div>
            </div>
            {project && (
              <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: S.textSec, fontFamily: "monospace" }}>
                {project.owner && <span>负责人：{project.owner}</span>}
                {project.budget && <span>预算：{project.budget}</span>}
                {project.createdAt && <span>创建：{project.createdAt}</span>}
                <span style={{
                  ...(() => { const sb = projectStatusBadge(project.status); return { color: sb.color, background: sb.bg, padding: "1px 8px", borderRadius: 10 }; })()
                }}>{projectStatusBadge(project.status).label}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" style={{ padding: "6px 14px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, fontSize: 12, fontFamily: "monospace", cursor: "pointer", color: S.text }}>
              <Edit3 size={13} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }} />编辑项目
            </button>
            <button type="button" style={{ padding: "6px 14px", background: S.accent, color: S.onPrimary, border: "none", borderRadius: 6, fontSize: 12, fontFamily: "monospace", cursor: "pointer", fontWeight: 500 }}>
              <Plus size={13} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }} />绑定账号
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI 概览 ────────────────────────────────────────── */}
      <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}` }}>
        <div className="grid grid-cols-4 gap-3">
          {KPI_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 8, padding: "10px 14px" }}>
              <div className="flex items-center gap-2">
                <Icon size={14} style={{ color }} />
                <span style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>{label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: S.text, fontFamily: "monospace", marginTop: 4 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* 类型分布 */}
        {Object.keys(agg.typeBreakdown).length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>能力覆盖：</span>
            {Object.entries(agg.typeBreakdown).sort((a, b) => b[1] - a[1]).map(([t, c]) => {
              const tm = typeMeta[t as CommunicationToolType];
              return (
                <span key={t} style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 10, fontFamily: "monospace",
                  background: tm ? `${tm.bg}33` : S.surface, color: tm ? tm.fg : S.textSec,
                }}>
                  {typeLabelShort(t)} × {c}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 项目账号列表 ────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto px-6 py-3">
        {agg.tools.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center" style={{ color: S.muted }}>
            <Package size={32} style={{ marginBottom: 8, color: S.mutedLight }} />
            <div style={{ fontSize: 13, fontFamily: "monospace" }}>
              {project ? "该项目暂未绑定任何账号" : "平台库存为空"}
            </div>
            <div style={{ fontSize: 11, marginTop: 4, fontFamily: "monospace" }}>
              {project ? "点击右上角『绑定账号』添加" : "将闲置账号分配给项目"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 8, overflow: "hidden" }}>
            {/* 表头 */}
            <div className="flex items-center px-3 py-2 text-[11px] font-semibold"
              style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.border}`, color: "#475569", fontFamily: "monospace" }}>
              <div style={{ width: 40 }} />
              <div className="flex-1">账号</div>
              <div style={{ width: 70 }}>类型</div>
              <div style={{ width: 70 }}>状态</div>
              <div style={{ width: 70 }}>负责人</div>
              <div style={{ width: 80 }}>今日+好友</div>
              <div style={{ width: 70 }}>风险</div>
            </div>
            {/* 行 */}
            {agg.tools.map(t => {
              const active = selectedToolId === t.id;
              const tm = typeMeta[t.type];
              const sm = statusMeta[t.status];
              const rm = riskMeta[t.riskLevel];
              return (
                <div key={t.id} role="button" tabIndex={0}
                  onClick={() => onSelectTool(t.id)}
                  className="flex items-center px-3 cursor-pointer transition-all"
                  style={{
                    background: active ? S.accentLight : "transparent",
                    borderBottom: `1px solid ${S.border}`,
                  }}>
                  {/* 头像 */}
                  <div style={{ width: 40, padding: "8px 4px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: tm?.bg || S.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {tm?.icon && <span style={{ color: tm.fg, fontSize: 14 }}>{tm.icon}</span>}
                    </div>
                  </div>
                  {/* 账号 */}
                  <div className="flex-1 py-2 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ fontFamily: "monospace", color: active ? S.onPrimary : S.text }}>{t.name}</div>
                    <div className="text-[10px] truncate" style={{ fontFamily: "monospace", color: S.muted }}>{t.identifier}</div>
                  </div>
                  {/* 类型 */}
                  <div style={{ width: 70, fontSize: 10, fontFamily: "monospace", color: S.textSec }}>
                    {typeLabelShort(t.type)}
                  </div>
                  {/* 状态 */}
                  <div style={{ width: 70 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", padding: "1px 6px", borderRadius: 10, color: sm?.fg, background: sm?.bg }}>{sm?.label}</span>
                  </div>
                  {/* 负责人 */}
                  <div style={{ width: 70, fontSize: 10, fontFamily: "monospace", color: S.textSec }}>
                    {accountNameById(t.boundAccountId)}
                  </div>
                  {/* 今日+ */}
                  <div style={{ width: 80, fontSize: 11, fontFamily: "monospace", color: t.todayAdded ? S.accent : S.muted }}>
                    {t.todayAdded ? `+${t.todayAdded}` : "—"}
                  </div>
                  {/* 风险 */}
                  <div style={{ width: 70 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", padding: "1px 6px", borderRadius: 10, color: rm?.fg, background: rm?.bg }}>{rm?.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
