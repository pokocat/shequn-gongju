import { useState } from "react";
import { Search, Plus, Clock, CheckCircle, AlertTriangle, X, ChevronRight, User } from "lucide-react";

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

const tickets = [
  { id: 1, no: "TK2026070501", type: "入群异常", user: "刘晓峰", phone: "138-9876-5432", assignee: "吴思远", city: "北京", status: "进行中", priority: "高", slaHours: 2, slaTotal: 4, created: "2026-07-05 08:00", desc: "用户扫码入群后显示群已满，备用群链接失效", tags: ["入群", "群码"] },
  { id: 2, no: "TK2026070502", type: "退款跟进", user: "王建国", phone: "158-0123-4569", assignee: "刘刚", city: "广州", status: "待处理", priority: "高", slaHours: 6, slaTotal: 8, created: "2026-07-04 14:00", desc: "用户申请退款，声称未使用任何服务，需核实订单记录", tags: ["退款", "争议"] },
  { id: 3, no: "TK2026070503", type: "账号问题", user: "张晓红", phone: "139-0123-4568", assignee: "林小燕", city: "上海", status: "已解决", priority: "中", slaHours: 0, slaTotal: 12, created: "2026-07-03 10:00", desc: "用户无法登录小程序，已协助重置密码", tags: ["账号", "已解决"] },
  { id: 4, no: "TK2026070504", type: "服务回访", user: "陈美玲", phone: "137-0123-4570", assignee: "待分配", city: "成都", status: "待处理", priority: "低", slaHours: 12, slaTotal: 24, created: "2026-07-05 07:00", desc: "新用户入会 7 日回访，确认权益使用情况", tags: ["回访", "新用户"] },
  { id: 5, no: "TK2026070505", type: "功能咨询", user: "赵志远", phone: "186-0123-4571", assignee: "待分配", city: "深圳", status: "待处理", priority: "中", slaHours: 8, slaTotal: 12, created: "2026-07-05 09:30", desc: "城市合伙人询问分销佣金结算规则及提现时间", tags: ["分销", "佣金"] },
  { id: 6, no: "TK2026070506", type: "内容投诉", user: "孙伟明", phone: "152-0123-4572", assignee: "林小燕", city: "上海", status: "进行中", priority: "中", slaHours: 4, slaTotal: 8, created: "2026-07-04 20:00", desc: "用户反映群内有其他用户发送广告，请求处理", tags: ["社群", "投诉"] },
  { id: 7, no: "TK2026070507", type: "技术故障", user: "钱美艳", phone: "186-6543-2109", assignee: "技术支持", city: "广州", status: "已解决", priority: "高", slaHours: 0, slaTotal: 2, created: "2026-07-04 18:00", desc: "支付页面报错，已修复并退还重复扣款", tags: ["支付", "技术"] },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  "进行中": { bg: "#f0f0f0", color: "#333" },
  "待处理": { bg: "#fffbeb", color: "#b45309" },
  "已解决": { bg: "#f0fff4", color: "#276749" },
};

const priorityConfig: Record<string, { color: string }> = {
  "高": { color: S.text },
  "中": { color: S.textSec },
  "低": { color: S.muted },
};

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [selected, setSelected] = useState<number | null>(null);

  const stats = [
    { label: "全部", count: tickets.length },
    { label: "待处理", count: tickets.filter(t => t.status === "待处理").length },
    { label: "进行中", count: tickets.filter(t => t.status === "进行中").length },
    { label: "已解决", count: tickets.filter(t => t.status === "已解决").length },
    { label: "高优先", count: tickets.filter(t => t.priority === "高" && t.status !== "已解决").length },
  ];

  const filtered = tickets.filter(t =>
    (statusFilter === "全部" || t.status === statusFilter || (statusFilter === "高优先" && t.priority === "高" && t.status !== "已解决")) &&
    (t.no.includes(search) || t.user.includes(search) || t.type.includes(search) || t.assignee.includes(search))
  );

  const detail = tickets.find(t => t.id === selected);

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>工单中心</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理咨询、售后、入群异常、退款跟进等工单</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
          <Plus size={13} /> 新建工单
        </button>
      </div>

      {/* Stat tabs */}
      <div className="flex gap-2">
        {stats.map(s => (
          <button
            key={s.label}
            className="flex items-center gap-2 px-4 py-2.5 text-xs transition-all font-bold"
            style={{
              background: statusFilter === s.label ? "#1a1a1a" : S.surface,
              border: `1px solid ${statusFilter === s.label ? "#1a1a1a" : S.border}`,
              color: statusFilter === s.label ? S.accent : S.muted,
              borderRadius: S.radius,
              fontFamily: "monospace",
            }}
            onClick={() => setStatusFilter(s.label)}
          >
            <span>{s.label}</span>
            <span className="px-1.5 py-0.5 text-xs font-bold" style={{ background: statusFilter === s.label ? S.accent : "#f0f0ec", color: statusFilter === s.label ? "#000" : S.muted, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              {s.count}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
          <Search size={13} style={{ color: S.muted }} />
          <input className="bg-transparent outline-none text-xs w-40" style={{ color: S.textSec, fontFamily: "monospace" }} placeholder="搜索工单..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="grid text-xs px-4 py-2.5 flex-shrink-0" style={{ gridTemplateColumns: "130px 90px 80px 100px 80px 90px 80px 1fr", background: "#f5f5f5", borderBottom: `1px solid ${S.borderMed}`, color: "#555555", fontFamily: "monospace", fontWeight: "bold", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
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
            {filtered.map((t, idx) => {
              const st = statusConfig[t.status];
              const pr = priorityConfig[t.priority];
              const isSelected = selected === t.id;
              return (
                <div
                  key={t.id}
                  className="grid items-center px-4 py-3 cursor-pointer transition-all"
                  style={{
                    gridTemplateColumns: "130px 90px 80px 100px 80px 90px 80px 1fr",
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
                  <div className="flex gap-1">
                    {t.status === "待处理" && (
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }} onClick={e => e.stopPropagation()}>指派</button>
                    )}
                    {t.status === "进行中" && (
                      <button className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }} onClick={e => e.stopPropagation()}>完成</button>
                    )}
                    <button className="px-2 py-1 text-xs flex items-center gap-0.5 font-bold" style={{ background: "#f0f0ec", color: S.muted, border: `1px solid ${S.border}`, borderRadius: S.radiusSm, fontFamily: "monospace" }} onClick={() => setSelected(t.id)}>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="w-[280px] flex-shrink-0 p-4 flex flex-col gap-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusLg, boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
            <div className="flex items-center justify-between" style={{ paddingBottom: "12px", borderBottom: `1px solid ${S.border}` }}>
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

            {detail.status !== "已解决" && (
              <div>
                <div className="text-xs mb-1.5 font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>SLA 剩余</div>
                <SlaBar hours={detail.slaHours} total={detail.slaTotal} />
              </div>
            )}

            {[["用户", detail.user], ["联系方式", detail.phone], ["所在城市", detail.city], ["处理人", detail.assignee], ["优先级", detail.priority], ["创建时间", detail.created]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                <span className="text-xs font-bold" style={{ color: k === "处理人" && v === "待分配" ? S.text : S.textSec, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}

            <div className="flex flex-col gap-2 mt-auto">
              {detail.assignee === "待分配" && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>指派处理人</button>
              )}
              {detail.status === "进行中" && (
                <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
                  <CheckCircle size={12} className="inline mr-1" />标记已解决
                </button>
              )}
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, color: S.textSec, borderRadius: S.radius, fontFamily: "monospace" }}>添加跟进记录</button>
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#fff8e1", color: "#b45309", borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
                <AlertTriangle size={12} className="inline mr-1" />升级处理
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
