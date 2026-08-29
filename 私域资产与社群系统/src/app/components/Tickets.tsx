import { useState, useMemo } from "react";
import { Search, Plus, Clock, CheckCircle, AlertTriangle, X, ChevronRight, User, ChevronLeft, MessageSquare, ArrowUp, FileText } from "lucide-react";

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

type TicketStatus = "待处理" | "进行中" | "已解决" | "已升级";
type Priority = "高" | "中" | "低";

interface FollowUp {
  id: number;
  time: string;
  author: string;
  content: string;
  kind: "create" | "assign" | "comment" | "resolve" | "escalate";
}

interface Ticket {
  id: number;
  no: string;
  type: string;
  user: string;
  phone: string;
  assignee: string;
  city: string;
  status: TicketStatus;
  priority: Priority;
  slaHours: number;
  slaTotal: number;
  created: string;
  desc: string;
  tags: string[];
  followUps: FollowUp[];
}

const initialTickets: Ticket[] = [
  {
    id: 1, no: "TK2026070501", type: "入群异常", user: "刘晓峰", phone: "138-9876-5432", assignee: "吴思远", city: "北京", status: "进行中", priority: "高", slaHours: 2, slaTotal: 4, created: "2026-07-05 08:00",
    desc: "用户扫码入群后显示群已满，备用群链接失效", tags: ["入群", "群码"],
    followUps: [
      { id: 1, time: "2026-07-05 08:00", author: "系统", content: "工单自动创建（来源：入群异常监控）", kind: "create" },
      { id: 2, time: "2026-07-05 08:15", author: "系统", content: "已分配给 吴思远（北京区域运营）", kind: "assign" },
      { id: 3, time: "2026-07-05 09:30", author: "吴思远", content: "已联系用户确认，备用群链接已重新生成，引导用户重新扫码入群", kind: "comment" },
    ],
  },
  {
    id: 2, no: "TK2026070502", type: "退款跟进", user: "王建国", phone: "158-0123-4569", assignee: "刘刚", city: "广州", status: "待处理", priority: "高", slaHours: 6, slaTotal: 8, created: "2026-07-04 14:00",
    desc: "用户申请退款，声称未使用任何服务，需核实订单记录", tags: ["退款", "争议"],
    followUps: [
      { id: 1, time: "2026-07-04 14:00", author: "系统", content: "工单创建（来源：订单退款审核）", kind: "create" },
    ],
  },
  {
    id: 3, no: "TK2026070503", type: "账号问题", user: "张晓红", phone: "139-0123-4568", assignee: "林小燕", city: "上海", status: "已解决", priority: "中", slaHours: 0, slaTotal: 12, created: "2026-07-03 10:00",
    desc: "用户无法登录小程序，已协助重置密码", tags: ["账号", "已解决"],
    followUps: [
      { id: 1, time: "2026-07-03 10:00", author: "系统", content: "工单创建", kind: "create" },
      { id: 2, time: "2026-07-03 10:30", author: "系统", content: "已分配给 林小燕", kind: "assign" },
      { id: 3, time: "2026-07-03 11:45", author: "林小燕", content: "通过手机号验证身份后重置密码，用户已重新登录", kind: "resolve" },
    ],
  },
  {
    id: 4, no: "TK2026070504", type: "服务回访", user: "陈美玲", phone: "137-0123-4570", assignee: "待分配", city: "成都", status: "待处理", priority: "低", slaHours: 12, slaTotal: 24, created: "2026-07-05 07:00",
    desc: "新用户入会 7 日回访，确认权益使用情况", tags: ["回访", "新用户"],
    followUps: [
      { id: 1, time: "2026-07-05 07:00", author: "系统", content: "自动创建（7 日回访计划）", kind: "create" },
    ],
  },
  {
    id: 5, no: "TK2026070505", type: "功能咨询", user: "赵志远", phone: "186-0123-4571", assignee: "待分配", city: "深圳", status: "待处理", priority: "中", slaHours: 8, slaTotal: 12, created: "2026-07-05 09:30",
    desc: "城市合伙人询问分销佣金结算规则及提现时间", tags: ["分销", "佣金"],
    followUps: [
      { id: 1, time: "2026-07-05 09:30", author: "系统", content: "工单创建", kind: "create" },
    ],
  },
  {
    id: 6, no: "TK2026070506", type: "内容投诉", user: "孙伟明", phone: "152-0123-4572", assignee: "林小燕", city: "上海", status: "进行中", priority: "中", slaHours: 4, slaTotal: 8, created: "2026-07-04 20:00",
    desc: "用户反映群内有其他用户发送广告，请求处理", tags: ["社群", "投诉"],
    followUps: [
      { id: 1, time: "2026-07-04 20:00", author: "系统", content: "工单创建", kind: "create" },
      { id: 2, time: "2026-07-04 20:20", author: "系统", content: "已分配给 林小燕", kind: "assign" },
      { id: 3, time: "2026-07-05 08:30", author: "林小燕", content: "已核实并清理违规成员3人，群公告已更新", kind: "comment" },
    ],
  },
  {
    id: 7, no: "TK2026070507", type: "技术故障", user: "钱美艳", phone: "186-6543-2109", assignee: "技术支持", city: "广州", status: "已解决", priority: "高", slaHours: 0, slaTotal: 2, created: "2026-07-04 18:00",
    desc: "支付页面报错，已修复并退还重复扣款", tags: ["支付", "技术"],
    followUps: [
      { id: 1, time: "2026-07-04 18:00", author: "系统", content: "工单创建（紧急）", kind: "create" },
      { id: 2, time: "2026-07-04 18:05", author: "系统", content: "已升级至 技术支持（自动升级：支付类故障）", kind: "escalate" },
      { id: 3, time: "2026-07-04 19:30", author: "技术支持", content: "已定位前端Bug并hotfix，重复扣款 ¥980 已原路退回", kind: "resolve" },
    ],
  },
];

const statusConfig: Record<TicketStatus, { bg: string; color: string }> = {
  "进行中": { bg: "#f0f0f0", color: "#333" },
  "待处理": { bg: "#fffbeb", color: "#b45309" },
  "已解决": { bg: "#f0fff4", color: "#276749" },
  "已升级": { bg: "#1a1a1a", color: S.accent },
};

const priorityConfig: Record<Priority, { color: string }> = {
  "高": { color: S.text },
  "中": { color: S.textSec },
  "低": { color: S.muted },
};

const followUpStyle: Record<FollowUp["kind"], { color: string; label: string }> = {
  create: { color: S.muted, label: "创建" },
  assign: { color: "#2563eb", label: "指派" },
  comment: { color: S.textSec, label: "跟进" },
  resolve: { color: "#276749", label: "解决" },
  escalate: { color: "#b45309", label: "升级" },
};

const PAGE_SIZE = 6;

const ASSIGNEE_POOL = ["吴思远", "刘刚", "林小燕", "技术支持", "客服-小雪"];

function SlaBar({ hours, total }: { hours: number; total: number }) {
  const remaining = total - hours;
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  const barBg = pct < 30 ? "#1a1a1a" : pct < 60 ? "#ffd600" : S.accent;
  const textColor = pct < 30 ? S.text : S.textSec;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 overflow-hidden" style={{ background: S.border, borderRadius: "99px" }}>
        <div className="h-full" style={{ width: `${pct}%`, background: barBg, borderRadius: "99px" }} />
      </div>
      <span className="text-xs flex-shrink-0 font-bold" style={{ color: textColor, fontFamily: "monospace" }}>{remaining}h</span>
    </div>
  );
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [statCardFilter, setStatCardFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState<number | null>(null);
  const [escalateOpen, setEscalateOpen] = useState<number | null>(null);
  const [followUpText, setFollowUpText] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [createForm, setCreateForm] = useState({
    type: "功能咨询",
    user: "",
    phone: "",
    city: "北京",
    priority: "中" as Priority,
    desc: "",
    assignee: "待分配",
  });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = useMemo(() => {
    const activeFilter = statCardFilter || statusFilter;
    return tickets.filter(t =>
      (activeFilter === "全部" || t.status === activeFilter || (activeFilter === "高优先" && t.priority === "高" && t.status !== "已解决")) &&
      (t.no.includes(search) || t.user.includes(search) || t.type.includes(search) || t.assignee.includes(search))
    );
  }, [tickets, search, statusFilter, statCardFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const detail = tickets.find(t => t.id === selected);

  const stats = [
    { label: "全部", count: tickets.length, filterVal: "全部" },
    { label: "待处理", count: tickets.filter(t => t.status === "待处理").length, filterVal: "待处理" },
    { label: "进行中", count: tickets.filter(t => t.status === "进行中").length, filterVal: "进行中" },
    { label: "已解决", count: tickets.filter(t => t.status === "已解决").length, filterVal: "已解决" },
    { label: "高优先", count: tickets.filter(t => t.priority === "高" && t.status !== "已解决").length, filterVal: "高优先" },
  ];

  function handleStatCardClick(filterVal: string) {
    if (statCardFilter === filterVal) {
      setStatCardFilter(null);
      setStatusFilter("全部");
    } else {
      setStatCardFilter(filterVal);
      setStatusFilter(filterVal);
    }
    setPage(1);
    setSelected(null);
  }

  function pushFollowUp(ticketId: number, fu: Omit<FollowUp, "id" | "time">) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const newFu: FollowUp = {
        id: (t.followUps[t.followUps.length - 1]?.id || 0) + 1,
        time: timeStr,
        ...fu,
      };
      return { ...t, followUps: [...t.followUps, newFu] };
    }));
  }

  function handleAssign(ticketId: number, assignee: string) {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const next: Ticket = { ...t, assignee, status: t.status === "待处理" ? "进行中" as TicketStatus : t.status };
      return next;
    }));
    pushFollowUp(ticketId, { author: "当前用户", content: `已指派给 ${assignee}`, kind: "assign" });
    showToast(`工单已指派给 ${assignee}`);
    setAssignOpen(null);
  }

  function handleResolve(ticketId: number) {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "已解决" as TicketStatus } : t));
    pushFollowUp(ticketId, { author: "当前用户", content: "工单已标记为已解决", kind: "resolve" });
    showToast("工单已标记为已解决");
  }

  function handleEscalate(ticketId: number) {
    if (!escalateReason.trim()) return;
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "已升级" as TicketStatus, priority: "高" as Priority, assignee: "技术支持" } : t));
    pushFollowUp(ticketId, { author: "当前用户", content: `升级至技术支持 · 原因：${escalateReason}`, kind: "escalate" });
    showToast("工单已升级，已转交技术支持");
    setEscalateOpen(null);
    setEscalateReason("");
  }

  function handleAddFollowUp(ticketId: number) {
    if (!followUpText.trim()) return;
    pushFollowUp(ticketId, { author: "当前用户", content: followUpText.trim(), kind: "comment" });
    setFollowUpText("");
    showToast("跟进记录已添加");
  }

  function handleCreateTicket() {
    if (!createForm.user.trim() || !createForm.desc.trim()) {
      showToast("请填写用户名和问题描述");
      return;
    }
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const newId = (tickets[tickets.length - 1]?.id || 0) + 1;
    const newNo = `TK${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${String(newId).padStart(4, "0")}`;
    const slaTotal = createForm.priority === "高" ? 4 : createForm.priority === "中" ? 12 : 24;
    const newTicket: Ticket = {
      id: newId,
      no: newNo,
      type: createForm.type,
      user: createForm.user.trim(),
      phone: createForm.phone.trim() || "未提供",
      assignee: createForm.assignee,
      city: createForm.city,
      status: createForm.assignee === "待分配" ? "待处理" : "进行中",
      priority: createForm.priority,
      slaHours: 0,
      slaTotal,
      created: timeStr,
      desc: createForm.desc.trim(),
      tags: [createForm.type, createForm.city],
      followUps: [{ id: 1, time: timeStr, author: "当前用户", content: `工单创建 · ${createForm.desc.slice(0, 30)}${createForm.desc.length > 30 ? "..." : ""}`, kind: "create" }],
    };
    if (createForm.assignee !== "待分配") {
      newTicket.followUps.push({ id: 2, time: timeStr, author: "当前用户", content: `已指派给 ${createForm.assignee}`, kind: "assign" });
    }
    setTickets(prev => [...prev, newTicket]);
    showToast(`工单 ${newNo} 已创建`);
    setCreateOpen(false);
    setCreateForm({ type: "功能咨询", user: "", phone: "", city: "北京", priority: "中", desc: "", assignee: "待分配" });
  }

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {/* Create Ticket Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setCreateOpen(false)}>
          <div className="w-[460px] p-5 flex flex-col gap-3" style={{ background: S.surface, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "10px", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-2">
                <Plus size={16} style={{ color: S.accent }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>新建工单</span>
              </div>
              <button onClick={() => setCreateOpen(false)}><X size={14} style={{ color: S.muted }} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>工单类型</label>
                <select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} value={createForm.type} onChange={e => setCreateForm({ ...createForm, type: e.target.value })}>
                  {["入群异常", "退款跟进", "账号问题", "服务回访", "功能咨询", "内容投诉", "技术故障"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>优先级</label>
                <select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} value={createForm.priority} onChange={e => setCreateForm({ ...createForm, priority: e.target.value as Priority })}>
                  {["低", "中", "高"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>用户名 *</label>
                <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm }} placeholder="请输入用户姓名" value={createForm.user} onChange={e => setCreateForm({ ...createForm, user: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>联系电话</label>
                <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm }} placeholder="可选" value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>城市</label>
                <input className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm }} value={createForm.city} onChange={e => setCreateForm({ ...createForm, city: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold" style={{ color: S.muted }}>指派处理人</label>
                <select className="w-full mt-1 px-3 py-2 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm }} value={createForm.assignee} onChange={e => setCreateForm({ ...createForm, assignee: e.target.value })}>
                  <option value="待分配">待分配</option>
                  {ASSIGNEE_POOL.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold" style={{ color: S.muted }}>问题描述 *</label>
              <textarea className="w-full mt-1 px-3 py-2 text-xs outline-none resize-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} rows={3} placeholder="详细描述用户遇到的问题..." value={createForm.desc} onChange={e => setCreateForm({ ...createForm, desc: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-1">
              <button className="flex-1 py-2 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, border: "none" }} onClick={handleCreateTicket}>创建工单</button>
              <button className="flex-1 py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius }} onClick={() => setCreateOpen(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setAssignOpen(null)}>
          <div className="w-80 p-5 flex flex-col gap-3" style={{ background: S.surface, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "10px", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-2">
                <User size={16} style={{ color: S.accent }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>指派处理人</span>
              </div>
              <button onClick={() => setAssignOpen(null)}><X size={14} style={{ color: S.muted }} /></button>
            </div>
            <div className="flex flex-col gap-1.5">
              {ASSIGNEE_POOL.map(a => (
                <button key={a} className="px-3 py-2 text-xs font-bold text-left transition-all" style={{ background: S.bg, border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm }} onClick={() => handleAssign(assignOpen, a)}>
                  <div className="flex items-center gap-2">
                    <User size={11} style={{ color: S.muted }} />
                    {a}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {escalateOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => { setEscalateOpen(null); setEscalateReason(""); }}>
          <div className="w-96 p-5 flex flex-col gap-3" style={{ background: S.surface, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "10px", borderBottom: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: "#b45309" }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>升级工单</span>
              </div>
              <button onClick={() => { setEscalateOpen(null); setEscalateReason(""); }}><X size={14} style={{ color: S.muted }} /></button>
            </div>
            <div className="px-3 py-2.5 text-xs" style={{ background: "#fff8e1", borderRadius: S.radiusSm, border: `1px solid #ffd600`, color: "#b45309" }}>
              升级后工单将转交技术支持，优先级自动提升为「高」
            </div>
            <div>
              <label className="text-xs font-bold" style={{ color: S.muted }}>升级原因（必填）</label>
              <textarea className="w-full mt-1 px-3 py-2 text-xs outline-none resize-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }} rows={3} placeholder="请说明升级原因..." value={escalateReason} onChange={e => setEscalateReason(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-1">
              <button className="flex-1 py-2 text-xs font-bold" style={{ background: "#b45309", color: "#fff", borderRadius: S.radius, border: "none", opacity: escalateReason.trim() ? 1 : 0.5 }} disabled={!escalateReason.trim()} onClick={() => handleEscalate(escalateOpen)}>确认升级</button>
              <button className="flex-1 py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius }} onClick={() => { setEscalateOpen(null); setEscalateReason(""); }}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>工单中心</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理咨询、售后、入群异常、退款跟进等工单</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setCreateOpen(true)}>
          <Plus size={13} /> 新建工单
        </button>
      </div>

      {/* Stat tabs - clickable */}
      <div className="flex gap-2 items-center">
        {stats.map(s => {
          const isActive = statCardFilter === s.filterVal;
          return (
            <button
              key={s.label}
              className="flex items-center gap-2 px-4 py-2.5 text-xs transition-all font-bold"
              style={{
                background: isActive ? "#1a1a1a" : S.surface,
                border: `1px solid ${isActive ? "#1a1a1a" : S.border}`,
                color: isActive ? S.accent : S.muted,
                borderRadius: S.radius,
                fontFamily: "monospace",
              }}
              onClick={() => handleStatCardClick(s.filterVal)}
            >
              <span>{s.label}</span>
              <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: isActive ? S.accent : "#f0f0ec", color: isActive ? "#000" : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                {s.count}
              </span>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs w-40" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索工单..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="grid text-xs px-4 py-2.5 flex-shrink-0" style={{ gridTemplateColumns: "130px 90px 80px 100px 70px 80px 90px 110px", background: "#f5f5f5", borderBottom: `1px solid ${S.borderMed}`, color: "#555555", fontFamily: "monospace", fontWeight: "bold", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
            <div>工单号</div>
            <div>类型</div>
            <div>用户</div>
            <div>处理人</div>
            <div>优先级</div>
            <div>状态</div>
            <div>SLA剩余</div>
            <div>操作</div>
          </div>
          <div className="overflow-auto flex-1">
            {paged.map(t => {
              const st = statusConfig[t.status];
              const pr = priorityConfig[t.priority];
              const isSelected = selected === t.id;
              return (
                <div
                  key={t.id}
                  className="grid items-center px-4 py-3 cursor-pointer transition-all"
                  style={{
                    gridTemplateColumns: "130px 90px 80px 100px 70px 80px 90px 110px",
                    background: isSelected ? "rgba(204,255,0,0.08)" : "transparent",
                    borderBottom: `1px solid ${S.border}`,
                    borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent",
                  }}
                  onClick={() => setSelected(isSelected ? null : t.id)}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: S.muted }}>{t.no}</span>
                  <span className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{t.type}</span>
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{t.user}</span>
                  <div className="flex items-center gap-1">
                    <User size={10} style={{ color: t.assignee === "待分配" ? S.text : S.muted }} />
                    <span className="text-xs font-bold" style={{ color: t.assignee === "待分配" ? S.text : S.muted, fontFamily: "monospace" }}>{t.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5" style={{ background: pr.color, borderRadius: "50%" }} />
                    <span className="text-xs font-bold" style={{ color: pr.color, fontFamily: "monospace" }}>{t.priority}</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold w-fit" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{t.status}</span>
                  {t.status !== "已解决" ? (
                    <SlaBar hours={t.slaHours} total={t.slaTotal} />
                  ) : (
                    <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>—</span>
                  )}
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    {t.status === "待处理" && (
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }} onClick={() => setAssignOpen(t.id)}>指派</button>
                    )}
                    {t.status === "进行中" && (
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }} onClick={() => handleResolve(t.id)}>完成</button>
                    )}
                    {(t.status === "待处理" || t.status === "进行中") && (
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: "#fff8e1", color: "#b45309", border: `1px solid #ffd600`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setEscalateOpen(t.id)}>
                        <ArrowUp size={10} className="inline mr-0.5" />升级
                      </button>
                    )}
                    <button className="px-2 py-1 text-xs flex items-center gap-0.5 font-bold" style={{ background: "#f0f0ec", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setSelected(t.id)}>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
            {paged.length === 0 && (
              <div className="py-12 text-center text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>暂无匹配工单</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#f5f5f5" }}>
              <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 {filtered.length} 条 · 第 {safePage} / {totalPages} 页</span>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 text-xs font-bold disabled:opacity-30" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                  <ChevronLeft size={12} className="inline" /> 上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className="px-2 py-1 text-xs font-bold" style={{ background: p === safePage ? "#0d0d0d" : S.surface, color: p === safePage ? S.accent : S.muted, border: `1px solid ${p === safePage ? "#0d0d0d" : S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="px-2.5 py-1 text-xs font-bold disabled:opacity-30" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                  下一页 <ChevronRight size={12} className="inline" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="w-[300px] flex-shrink-0 p-4 flex flex-col gap-3 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "10px", borderBottom: `1px solid ${S.border}` }}>
              <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>工单详情</div>
              <button onClick={() => setSelected(null)}><X size={14} style={{ color: S.muted }} /></button>
            </div>

            <div className="py-3 px-3" style={{ background: S.bg, borderRadius: S.radius, border: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold" style={{ color: S.text }}>{detail.no}</span>
                <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: statusConfig[detail.status].bg, color: statusConfig[detail.status].color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{detail.status}</span>
              </div>
              <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.type}</div>
              <div className="text-xs mt-1.5" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.desc}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {detail.tags.map(t => (
                  <span key={t} className="px-1.5 py-0.5 text-xs font-bold" style={{ background: "#f0f0ec", color: S.text, borderRadius: S.radiusSm, border: `1px solid ${S.border}`, fontFamily: "monospace" }}>{t}</span>
                ))}
              </div>
            </div>

            {detail.status !== "已解决" && detail.status !== "已升级" && (
              <div>
                <div className="text-xs mb-1.5 font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>SLA 剩余</div>
                <SlaBar hours={detail.slaHours} total={detail.slaTotal} />
              </div>
            )}

            <div className="flex flex-col">
              {[["用户", detail.user], ["联系方式", detail.phone], ["所在城市", detail.city], ["处理人", detail.assignee], ["优先级", detail.priority], ["创建时间", detail.created]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                  <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                  <span className="text-xs font-bold" style={{ color: k === "处理人" && v === "待分配" ? S.text : S.textSec, fontFamily: "monospace" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Follow-up timeline */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare size={12} style={{ color: S.muted }} />
                <span className="text-xs font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>跟进记录 · {detail.followUps.length}</span>
              </div>
              <div className="flex flex-col gap-2 pl-2" style={{ borderLeft: `2px solid ${S.border}` }}>
                {detail.followUps.map(fu => {
                  const fs = followUpStyle[fu.kind];
                  return (
                    <div key={fu.id} className="pl-3 relative">
                      <div className="absolute w-2 h-2 rounded-full" style={{ background: fs.color, left: "-7px", top: "4px" }} />
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold" style={{ color: fs.color, fontFamily: "monospace" }}>{fs.label}</span>
                        <span className="text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>{fu.time}</span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: S.textSec, fontFamily: "monospace" }}>
                        <span style={{ color: S.muted }}>{fu.author}: </span>{fu.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add follow-up */}
            <div>
              <textarea
                className="w-full px-3 py-2 text-xs outline-none resize-none"
                style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                rows={2}
                placeholder="添加跟进记录..."
                value={followUpText}
                onChange={e => setFollowUpText(e.target.value)}
              />
              <button className="w-full mt-1 py-1.5 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => handleAddFollowUp(detail.id)} disabled={!followUpText.trim()}>
                + 添加跟进记录
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              {detail.assignee === "待分配" && detail.status !== "已解决" && detail.status !== "已升级" && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setAssignOpen(detail.id)}>
                  <User size={12} className="inline mr-1" />指派处理人
                </button>
              )}
              {detail.status === "进行中" && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => handleResolve(detail.id)}>
                  <CheckCircle size={12} className="inline mr-1" />标记已解决
                </button>
              )}
              {(detail.status === "待处理" || detail.status === "进行中") && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: "#fff8e1", color: "#b45309", borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setEscalateOpen(detail.id)}>
                  <AlertTriangle size={12} className="inline mr-1" />升级处理
                </button>
              )}
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => showToast(`已生成工单报告 ${detail.no}`)}>
                <FileText size={12} className="inline mr-1" />导出工单报告
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
