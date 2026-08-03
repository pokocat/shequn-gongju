import { useState } from "react";
import { Search, Filter, ChevronDown, AlertTriangle, CheckCircle, Clock, X, CreditCard, FileText } from "lucide-react";

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

const orders = [
  { id: 1, no: "ORD2026070501", user: "李云天", phone: "138-0123-4567", product: "续费PRO会员年卡", amount: 2480, status: "已完成", city: "北京", date: "2026-07-05 09:12", risk: "normal", channel: "微信支付" },
  { id: 2, no: "ORD2026070502", user: "张晓红", phone: "139-0123-4568", product: "体验营报名费", amount: 980, status: "待确认", city: "上海", date: "2026-07-05 10:30", risk: "normal", channel: "支付宝" },
  { id: 3, no: "ORD2026070503", user: "王建国", phone: "158-0123-4569", product: "代理授权费", amount: 4800, status: "退款申请", city: "广州", date: "2026-07-04 14:23", risk: "high", channel: "微信支付" },
  { id: 4, no: "ORD2026070504", user: "陈美玲", phone: "137-0123-4570", product: "基础会员月卡", amount: 298, status: "已完成", city: "成都", date: "2026-07-04 16:45", risk: "normal", channel: "微信支付" },
  { id: 5, no: "ORD2026070505", user: "赵志远", phone: "186-0123-4571", product: "城市合伙人费", amount: 9800, status: "审核中", city: "深圳", date: "2026-07-03 11:00", risk: "warning", channel: "银行转账" },
  { id: 6, no: "ORD2026070506", user: "孙伟明", phone: "152-0123-4572", product: "PRO会员季卡", amount: 880, status: "已完成", city: "上海", date: "2026-07-03 08:20", risk: "normal", channel: "微信支付" },
  { id: 7, no: "ORD2026070507", user: "刘晓峰", phone: "138-9876-5432", product: "代理授权费", amount: 4800, status: "退款完成", city: "北京", date: "2026-07-02 15:30", risk: "normal", channel: "微信支付" },
  { id: 8, no: "ORD2026070508", user: "钱美艳", phone: "186-6543-2109", product: "体验营", amount: 980, status: "待确认", city: "广州", date: "2026-07-02 19:00", risk: "normal", channel: "支付宝" },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  "已完成": { bg: S.accent, color: "#000", label: "已完成" },
  "待确认": { bg: "#ffd600", color: "#000", label: "待确认" },
  "退款申请": { bg: "#1a1a1a", color: S.accent, label: "退款申请" },
  "审核中": { bg: "#f0f0f0", color: "#333333", label: "审核中" },
  "退款完成": { bg: "#f0f0ec", color: "#555", label: "退款完成" },
};

const refundQueue = orders.filter(o => o.status === "退款申请" || o.status === "审核中");

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "refund">("list");

  const filtered = orders.filter(o =>
    (statusFilter === "全部状态" || o.status === statusFilter) &&
    (o.user.includes(search) || o.no.includes(search) || o.product.includes(search) || o.city.includes(search))
  );

  const detail = orders.find(o => o.id === selected);
  const totalRevenue = orders.filter(o => o.status === "已完成").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>支付订单 / 退款审核</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理订单、退款、发票及异常支付</p>
        </div>
        <div className="flex gap-2">
          {[{ id: "list", label: "全部订单" }, { id: "refund", label: `退款队列 (${refundQueue.length})` }].map(t => (
            <button key={t.id} className="px-3 py-2 text-xs font-bold" style={{ background: view === t.id ? "#1a1a1a" : S.surface, color: view === t.id ? S.accent : S.muted, border: `1px solid ${S.borderMed}`, borderRadius: S.radius, fontFamily: "monospace" }} onClick={() => setView(t.id as any)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "今日营收", value: `¥${totalRevenue.toLocaleString()}` },
          { label: "订单总数", value: orders.length },
          { label: "待确认", value: orders.filter(o => o.status === "待确认").length },
          { label: "退款申请", value: orders.filter(o => o.status === "退款申请").length },
          { label: "审核中", value: orders.filter(o => o.status === "审核中").length },
        ].map(s => (
          <div key={s.label} className="px-3 py-2.5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{s.label}</div>
            <div className="font-bold mt-0.5" style={{ color: S.text, fontSize: "18px", fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {view === "list" && (
            <>
              {/* Filters */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
                  <Search size={13} style={{ color: S.muted }} />
                  <input className="bg-transparent outline-none text-xs flex-1" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索订单号、用户、产品..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="relative">
                  <select className="appearance-none px-3 py-2 pr-7 text-xs outline-none cursor-pointer font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    {["全部状态", "已完成", "待确认", "退款申请", "审核中", "退款完成"].map(o => <option key={o} value={o} style={{ background: "#ffffff" }}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: S.muted }} />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.borderMed}`, color: S.textSec, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
                  <Filter size={13} /> 筛选
                </button>
              </div>

              {/* Table */}
              <div className="overflow-hidden flex-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="grid text-xs px-4 py-2.5" style={{ gridTemplateColumns: "160px 80px 200px 90px 70px 80px 100px 90px", background: "#f5f5f5", borderBottom: `1px solid ${S.borderMed}`, color: "#555555", fontFamily: "monospace", fontWeight: "bold", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
                  <div>订单号</div>
                  <div>用户</div>
                  <div>产品</div>
                  <div>金额</div>
                  <div>城市</div>
                  <div>渠道</div>
                  <div>状态</div>
                  <div>时间</div>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 420px)" }}>
                  {filtered.map((o, idx) => {
                    const st = statusConfig[o.status];
                    const isSelected = selected === o.id;
                    return (
                      <div
                        key={o.id}
                        className="grid items-center px-4 py-2.5 cursor-pointer transition-all"
                        style={{
                          gridTemplateColumns: "160px 80px 200px 90px 70px 80px 100px 90px",
                          background: isSelected ? "rgba(204,255,0,0.08)" : "transparent",
                          borderBottom: `1px solid ${S.border}`,
                          borderLeft: isSelected ? `3px solid ${S.accent}` : "3px solid transparent",
                        }}
                        onClick={() => setSelected(isSelected ? null : o.id)}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div className="flex items-center gap-1.5">
                          {o.risk !== "normal" && <AlertTriangle size={11} style={{ color: S.muted }} />}
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
                </div>
              </div>
            </>
          )}

          {view === "refund" && (
            <div className="flex-1 overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${S.border}`, background: "#f5f5f5", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
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
                          {o.risk !== "normal" && <AlertTriangle size={12} style={{ color: S.text }} />}
                        </div>
                        <div className="text-xs mt-1" style={{ color: S.muted, fontFamily: "monospace" }}>{o.product} · ¥{o.amount.toLocaleString()} · {o.date}</div>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusConfig[o.status].bg, color: statusConfig[o.status].color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{o.status}</span>
                    </div>
                    {o.risk === "high" && (
                      <div className="mt-2 flex items-center gap-2 p-2 text-xs font-bold" style={{ background: "#f5f5f5", borderRadius: S.radiusSm }}>
                        <AlertTriangle size={11} style={{ color: S.accent }} />
                        <span style={{ color: S.accent, fontFamily: "monospace" }}>用户已进群 · 已使用服务 · 退款风险高</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace", border: "none" }}><CheckCircle size={11} className="inline mr-1" />批准退款</button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}><X size={11} className="inline mr-1" />拒绝</button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#f0f0ec", color: S.text, borderRadius: S.radius, fontFamily: "monospace", border: `1px solid ${S.border}` }}><FileText size={11} className="inline mr-1" />查看详情</button>
                      <button className="px-3 py-1.5 text-xs font-bold" style={{ background: "#f0f0ec", color: S.text, borderRadius: S.radius, fontFamily: "monospace", border: `1px solid ${S.border}` }}><Clock size={11} className="inline mr-1" />转人工复核</button>
                    </div>
                  </div>
                ))}
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
            <div className="flex flex-col gap-2 mt-auto">
              {detail.status === "待确认" && <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>确认收款</button>}
              {detail.status === "退款申请" && <button className="w-full py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>处理退款</button>}
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>建立工单</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
