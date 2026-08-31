import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, AlertTriangle, CheckCircle, Clock, X, CreditCard, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
type OrderStatus = "已完成" | "待确认" | "退款申请" | "审核中" | "退款完成" | "退款已拒";

interface Order {
  id: number;
  no: string;
  user: string;
  phone: string;
  product: string;
  amount: number;
  status: OrderStatus;
  city: string;
  date: string;
  risk: "normal" | "high" | "warning";
  channel: string;
  refundReason?: string;
  refundRejectReason?: string;
}

const initialOrders: Order[] = [
  { id: 1, no: "ORD2026070501", user: "李云天", phone: "138-0123-4567", product: "续费PRO会员年卡", amount: 2480, status: "已完成", city: "北京", date: "2026-07-05 09:12", risk: "normal", channel: "微信支付" },
  { id: 2, no: "ORD2026070502", user: "张晓红", phone: "139-0123-4568", product: "体验营报名费", amount: 980, status: "待确认", city: "上海", date: "2026-07-05 10:30", risk: "normal", channel: "支付宝" },
  { id: 3, no: "ORD2026070503", user: "王建国", phone: "158-0123-4569", product: "代理授权费", amount: 4800, status: "退款申请", city: "广州", date: "2026-07-04 14:23", risk: "high", channel: "微信支付", refundReason: "个人原因，未使用服务" },
  { id: 4, no: "ORD2026070504", user: "陈美玲", phone: "137-0123-4570", product: "基础会员月卡", amount: 298, status: "已完成", city: "成都", date: "2026-07-04 16:45", risk: "normal", channel: "微信支付" },
  { id: 5, no: "ORD2026070505", user: "赵志远", phone: "186-0123-4571", product: "城市合伙人费", amount: 9800, status: "审核中", city: "深圳", date: "2026-07-03 11:00", risk: "warning", channel: "银行转账" },
  { id: 6, no: "ORD2026070506", user: "孙伟明", phone: "152-0123-4572", product: "PRO会员季卡", amount: 880, status: "已完成", city: "上海", date: "2026-07-03 08:20", risk: "normal", channel: "微信支付" },
  { id: 7, no: "ORD2026070507", user: "刘晓峰", phone: "138-9876-5432", product: "代理授权费", amount: 4800, status: "退款完成", city: "北京", date: "2026-07-02 15:30", risk: "normal", channel: "微信支付" },
  { id: 8, no: "ORD2026070508", user: "钱美艳", phone: "186-6543-2109", product: "体验营", amount: 980, status: "待确认", city: "广州", date: "2026-07-02 19:00", risk: "normal", channel: "支付宝" },
  { id: 9, no: "ORD2026070509", user: "周楷瑞", phone: "135-2233-4455", product: "PRO会员年卡", amount: 2480, status: "已完成", city: "杭州", date: "2026-07-01 10:15", risk: "normal", channel: "微信支付" },
  { id: 10, no: "ORD2026070510", user: "吴思远", phone: "136-3344-5566", product: "城市合伙人费", amount: 9800, status: "审核中", city: "成都", date: "2026-07-01 14:30", risk: "warning", channel: "银行转账" },
  { id: 11, no: "ORD2026070511", user: "林小燕", phone: "137-4455-6677", product: "体验营报名费", amount: 980, status: "已完成", city: "北京", date: "2026-06-30 09:00", risk: "normal", channel: "支付宝" },
  { id: 12, no: "ORD2026070512", user: "赵敏", phone: "138-5566-7788", product: "基础会员季卡", amount: 780, status: "退款申请", city: "深圳", date: "2026-06-30 16:20", risk: "normal", channel: "微信支付", refundReason: "服务不符预期" },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  "已完成": { bg: S.accent, color: "#ffffff", label: "已完成" },
  "待确认": { bg: "#3b82f6", color: "#ffffff", label: "待确认" },
  "退款申请": { bg: "#1e293b", color: S.accent, label: "退款申请" },
  "审核中": { bg: "#f1f5f9", color: "#475569", label: "审核中" },
  "退款完成": { bg: "#f1f5f9", color: "#475569", label: "退款完成" },
  "退款已拒": { bg: "#fff0f0", color: "#cc0000", label: "退款已拒" },
};

const PAGE_SIZE = 8;

export default function Orders() {
  useThemeSingleton();
const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [statCardFilter, setStatCardFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "refund">("list");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{ orderId: number; action: "approve" | "reject" | "confirm" } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = useMemo(() => {
    const activeFilter = statCardFilter || statusFilter;
    return orders.filter(o =>
      (activeFilter === "全部状态" || o.status === activeFilter) &&
      (o.user.includes(search) || o.no.includes(search) || o.product.includes(search) || o.city.includes(search))
    );
  }, [orders, search, statusFilter, statCardFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const refundQueue = orders.filter(o => o.status === "退款申请" || o.status === "审核中");
  const detail = orders.find(o => o.id === selected);
  const totalRevenue = orders.filter(o => o.status === "已完成").reduce((s, o) => s + o.amount, 0);

  const stats = [
    { label: "今日营收", value: `¥${totalRevenue.toLocaleString()}`, filterVal: null },
    { label: "订单总数", value: orders.length, filterVal: "全部状态" },
    { label: "待确认", value: orders.filter(o => o.status === "待确认").length, filterVal: "待确认" },
    { label: "退款申请", value: orders.filter(o => o.status === "退款申请").length, filterVal: "退款申请" },
    { label: "审核中", value: orders.filter(o => o.status === "审核中").length, filterVal: "审核中" },
  ];

  function handleStatCardClick(filterVal: string | null) {
    if (statCardFilter === filterVal) {
      setStatCardFilter(null);
    } else {
      setStatCardFilter(filterVal);
      setStatusFilter("全部状态");
    }
    setPage(1);
    setSelected(null);
  }

  function handleConfirmAction() {
    if (!confirmAction) return;
    const { orderId, action } = confirmAction;
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      if (action === "approve") return { ...o, status: "退款完成" as OrderStatus };
      if (action === "reject") return { ...o, status: "退款已拒" as OrderStatus, refundRejectReason: rejectReason || "未提供拒绝原因" };
      if (action === "confirm") return { ...o, status: "已完成" as OrderStatus };
      return o;
    }));
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const actionText = action === "approve" ? `退款已批准，¥${order.amount.toLocaleString()}已原路退回` : action === "reject" ? "退款已拒绝" : "订单已确认收款";
      showToast(actionText);
    }
    setConfirmAction(null);
    setRejectReason("");
  }

  function handleExport() {
    const headers = ["订单号", "用户", "手机", "产品", "金额", "状态", "城市", "渠道", "下单时间"];
    const rows = filtered.map(o => [o.no, o.user, o.phone, o.product, o.amount, o.status, o.city, o.channel, o.date]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已导出 ${filtered.length} 条订单`);
  }

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => { setConfirmAction(null); setRejectReason(""); }}>
          <div className="w-96 p-5 flex flex-col gap-3" style={{ background: S.surface, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2" style={{ paddingBottom: "10px", borderBottom: `1px solid ${S.border}` }}>
              <AlertTriangle size={16} style={{ color: confirmAction.action === "approve" ? S.accent : "#cc0000" }} />
              <span className="text-sm font-bold" style={{ color: S.text }}>
                {confirmAction.action === "approve" ? "确认批准退款？" : confirmAction.action === "reject" ? "确认拒绝退款？" : "确认收款？"}
              </span>
              <button onClick={() => { setConfirmAction(null); setRejectReason(""); }} className="ml-auto"><X size={14} style={{ color: S.muted }} /></button>
            </div>
            {(() => {
              const o = orders.find(x => x.id === confirmAction.orderId);
              if (!o) return null;
              return (
                <>
                  <div className="px-3 py-2.5" style={{ background: S.bg, borderRadius: S.radius, border: `1px solid ${S.border}` }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold" style={{ color: S.text }}>{o.user} · {o.product}</span>
                      <span className="text-xs font-bold" style={{ color: S.text }}>¥{o.amount.toLocaleString()}</span>
                    </div>
                    {o.refundReason && <div className="text-xs mt-1" style={{ color: S.muted }}>退款原因：{o.refundReason}</div>}
                  </div>
                  {confirmAction.action === "reject" && (
                    <div>
                      <textarea
                        className="w-full px-3 py-2 text-xs outline-none resize-none"
                        style={{ background: S.bg, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }}
                        rows={2}
                        placeholder="请输入拒绝原因（必填）"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <button
                      className="flex-1 py-2 text-xs font-bold"
                      style={{
                        background: confirmAction.action === "approve" ? S.accent : confirmAction.action === "reject" ? "#cc0000" : S.accent,
                        color: confirmAction.action === "reject" ? "#ffffff" : "#ffffff",
                        borderRadius: S.radius, border: "none",
                        opacity: confirmAction.action === "reject" && !rejectReason.trim() ? 0.5 : 1,
                      }}
                      onClick={handleConfirmAction}
                      disabled={confirmAction.action === "reject" && !rejectReason.trim()}
                    >
                      确认{confirmAction.action === "approve" ? "批准" : confirmAction.action === "reject" ? "拒绝" : "收款"}
                    </button>
                    <button className="flex-1 py-2 text-xs font-bold" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius }} onClick={() => { setConfirmAction(null); setRejectReason(""); }}>
                      取消
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>支付订单 / 退款审核</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理订单、退款、发票及异常支付</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={handleExport}>
            <Download size={13} /> 导出CSV
          </button>
          {[{ id: "list", label: "全部订单" }, { id: "refund", label: `退款队列 (${refundQueue.length})` }].map(t => (
            <button key={t.id} className="px-3 py-2 text-xs font-bold" style={{ background: view === t.id ? "#1e293b" : S.surface, color: view === t.id ? S.accent : S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => { setView(t.id as any); setSelected(null); setPage(1); }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - clickable */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map(s => {
          const isActive = statCardFilter === s.filterVal;
          return (
            <button
              key={s.label}
              className="px-3 py-2.5 text-left transition-all"
              style={{
                background: isActive ? S.accentLight : S.surface,
                border: `1px solid ${isActive ? S.accent : S.border}`,
                borderRadius: S.radius,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                cursor: s.filterVal ? "pointer" : "default",
              }}
              onClick={() => s.filterVal && handleStatCardClick(s.filterVal)}
            >
              <div className="text-xs flex items-center gap-1" style={{ color: S.muted, fontFamily: "monospace" }}>
                {s.label}
                {s.filterVal && <span className="text-[8px]" style={{ color: isActive ? S.text : S.mutedLight }}>{isActive ? "●" : "○"}</span>}
              </div>
              <div className="font-bold mt-0.5" style={{ color: S.text, fontSize: "18px", fontFamily: "monospace" }}>{s.value}</div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {view === "list" && (
            <>
              {/* Filters */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
                  <Search size={13} style={{ color: S.muted }} />
                  <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索订单号、用户、产品..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div className="relative">
                  <select className="appearance-none px-3 py-2 pr-7 text-xs outline-none cursor-pointer font-bold" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setStatCardFilter(null); setPage(1); }}>
                    {["全部状态", "已完成", "待确认", "退款申请", "审核中", "退款完成", "退款已拒"].map(o => <option key={o} value={o} style={{ background: "#ffffff" }}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: S.muted }} />
                </div>
                {(statCardFilter || statusFilter !== "全部状态" || search) && (
                  <button className="flex items-center gap-1 px-3 py-2 text-xs font-bold" style={{ background: "#f1f5f9", border: `1px solid ${S.borderMed}`, color: S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => { setStatCardFilter(null); setStatusFilter("全部状态"); setSearch(""); setPage(1); }}>
                    <X size={12} /> 清除
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="overflow-hidden flex-1 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="grid text-xs px-4 py-2.5 flex-shrink-0" style={{ gridTemplateColumns: "160px 80px 200px 90px 70px 80px 100px 90px", background: "#f1f5f9", borderBottom: `1px solid ${S.borderMed}`, color: "#475569", fontFamily: "monospace", fontWeight: "bold", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                  <div>订单号</div><div>用户</div><div>产品</div><div>金额</div><div>城市</div><div>渠道</div><div>状态</div><div>时间</div>
                </div>
                <div className="overflow-auto flex-1">
                  {paged.map(o => {
                    const st = statusConfig[o.status];
                    const isSelected = selected === o.id;
                    return (
                      <div
                        key={o.id}
                        className="grid items-center px-4 py-2.5 cursor-pointer transition-all"
                        style={{
                          gridTemplateColumns: "160px 80px 200px 90px 70px 80px 100px 90px",
                          background: isSelected ? "rgba(59,130,246,0.08)" : "transparent",
                          borderBottom: `1px solid ${S.border}`,
                          borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent",
                        }}
                        onClick={() => setSelected(isSelected ? null : o.id)}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div className="flex items-center gap-1.5">
                          {o.risk !== "normal" && <AlertTriangle size={11} style={{ color: o.risk === "high" ? "#cc0000" : S.muted }} />}
                          <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{o.no}</span>
                        </div>
                        <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{o.user}</div>
                        <div className="text-xs truncate" style={{ color: S.muted, fontFamily: "monospace" }}>{o.product}</div>
                        <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>¥{o.amount.toLocaleString()}</div>
                        <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{o.city}</div>
                        <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{o.channel}</div>
                        <span className="px-2 py-0.5 text-xs font-bold w-fit" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{st.label}</span>
                        <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{o.date.split(" ")[1]}</div>
                      </div>
                    );
                  })}
                  {paged.length === 0 && (
                    <div className="py-12 text-center text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>暂无匹配订单</div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderTop: `1px solid ${S.border}`, background: "#f1f5f9" }}>
                    <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>共 {filtered.length} 条 · 第 {safePage} / {totalPages} 页</span>
                    <div className="flex gap-1.5">
                      <button className="px-2.5 py-1 text-xs font-bold disabled:opacity-30" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                        <ChevronLeft size={12} className="inline" /> 上一页
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} className="px-2 py-1 text-xs font-bold" style={{ background: p === safePage ? "#1e293b" : S.surface, color: p === safePage ? S.accent : S.muted, border: `1px solid ${p === safePage ? "#1e293b" : S.borderMed}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setPage(p)}>{p}</button>
                      ))}
                      <button className="px-2.5 py-1 text-xs font-bold disabled:opacity-30" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                        下一页 <ChevronRight size={12} className="inline" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {view === "refund" && (
            <div className="flex-1 overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${S.border}`, background: "#f1f5f9", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                <AlertTriangle size={14} style={{ color: S.accent }} />
                <span className="text-sm font-bold" style={{ color: S.accent, fontFamily: "monospace" }}>退款审核队列</span>
                <span className="ml-auto text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>按申请时间排序</span>
              </div>
              <div className="space-y-3 p-4">
                {refundQueue.map(o => (
                  <div key={o.id} className="p-4" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{o.user}</span>
                          <span className="text-xs font-mono" style={{ color: S.muted }}>{o.no}</span>
                          {o.risk !== "normal" && <AlertTriangle size={12} style={{ color: o.risk === "high" ? "#cc0000" : S.text }} />}
                        </div>
                        <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>{o.product} · ¥{o.amount.toLocaleString()} · {o.date}</div>
                        {o.refundReason && <div className="text-xs mt-1" style={{ color: S.textSec, fontFamily: "monospace" }}>退款原因：{o.refundReason}</div>}
                      </div>
                      <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusConfig[o.status].bg, color: statusConfig[o.status].color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{o.status}</span>
                    </div>
                    {o.risk === "high" && (
                      <div className="mt-2 flex items-center gap-2 p-2 text-xs font-bold" style={{ background: "#fff0f0", borderRadius: S.radiusSm }}>
                        <AlertTriangle size={11} style={{ color: "#cc0000" }} />
                        <span style={{ color: "#cc0000", fontFamily: "monospace" }}>用户已进群 · 已使用服务 · 退款风险高</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setConfirmAction({ orderId: o.id, action: "approve" })}>
                        <CheckCircle size={11} className="inline mr-1" />批准退款
                      </button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setConfirmAction({ orderId: o.id, action: "reject" })}>
                        <X size={11} className="inline mr-1" />拒绝
                      </button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#f1f5f9", color: S.text, borderRadius: S.radius, fontFamily: "monospace", border: `1px solid ${S.border}` }} onClick={() => { setSelected(o.id); setView("list"); }}>
                        <FileText size={11} className="inline mr-1" />查看详情
                      </button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#f1f5f9", color: S.text, borderRadius: S.radius, fontFamily: "monospace", border: `1px solid ${S.border}` }} onClick={() => showToast("已转交人工复核，将在24小时内处理")}>
                        <Clock size={11} className="inline mr-1" />转人工复核
                      </button>
                    </div>
                  </div>
                ))}
                {refundQueue.length === 0 && (
                  <div className="py-12 text-center text-xs" style={{ color: S.mutedLight, fontFamily: "monospace" }}>暂无退款申请</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {detail && view === "list" && (
          <div className="w-72 flex-shrink-0 p-4 flex flex-col gap-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "12px", borderBottom: `1px solid ${S.border}` }}>
              <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>订单详情</div>
              <button onClick={() => setSelected(null)}><X size={14} style={{ color: S.muted }} /></button>
            </div>
            <div className="py-4 text-center" style={{ background: S.bg, borderRadius: S.radius, border: `1px solid ${S.border}` }}>
              <CreditCard size={24} className="mx-auto mb-2" style={{ color: S.text }} />
              <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>¥{detail.amount.toLocaleString()}</div>
              <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{detail.product}</div>
              <span className="mt-2 inline-block px-2.5 py-0.5 text-xs font-bold" style={{ background: statusConfig[detail.status].bg, color: statusConfig[detail.status].color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{detail.status}</span>
            </div>
            {[["订单号", detail.no], ["用户", detail.user], ["手机", detail.phone], ["城市", detail.city], ["支付渠道", detail.channel], ["下单时间", detail.date]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                <span className="text-xs font-bold" style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
            {detail.refundReason && (
              <div className="px-3 py-2" style={{ background: "#fff8e1", borderRadius: S.radiusSm, border: `1px solid #3b82f6` }}>
                <div className="text-xs font-bold mb-0.5" style={{ color: "#b45309" }}>退款原因</div>
                <div className="text-xs" style={{ color: S.textSec }}>{detail.refundReason}</div>
              </div>
            )}
            {detail.refundRejectReason && (
              <div className="px-3 py-2" style={{ background: "#fff0f0", borderRadius: S.radiusSm, border: `1px solid #cc0000` }}>
                <div className="text-xs font-bold mb-0.5" style={{ color: "#cc0000" }}>拒绝原因</div>
                <div className="text-xs" style={{ color: S.textSec }}>{detail.refundRejectReason}</div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-auto">
              {detail.status === "待确认" && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setConfirmAction({ orderId: detail.id, action: "confirm" })}>
                  确认收款
                </button>
              )}
              {detail.status === "退款申请" && (
                <>
                  <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setConfirmAction({ orderId: detail.id, action: "approve" })}>批准退款</button>
                  <button className="w-full py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }} onClick={() => setConfirmAction({ orderId: detail.id, action: "reject" })}>拒绝退款</button>
                </>
              )}
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#f1f5f9", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => showToast("已创建关联工单，工单号 TK" + Date.now().toString().slice(-6))}>建立工单</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
