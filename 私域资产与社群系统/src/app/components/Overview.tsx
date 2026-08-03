import { TrendingUp, Database, Users2, UserPlus, AlertTriangle, Zap, CheckCircle, Clock, ArrowUp, ArrowDown, MessageCircle } from "lucide-react";

// ─── Soft rounded cyberpunk constants ────────────────────────
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
  radius: "12px",
  radiusSm: "8px",
  radiusLg: "14px",
};

// ─── Recharts-free charts ────────────────────────────────────
function SVGLineChart({ data, keys, colors, height = 160 }: { data: any[]; keys: string[]; colors: string[]; height?: number }) {
  const W = 500; const H = height; const PAD = { top: 8, right: 8, bottom: 22, left: 32 };
  const innerW = W - PAD.left - PAD.right; const innerH = H - PAD.top - PAD.bottom;
  const allVals = data.flatMap(d => keys.map(k => d[k] as number));
  const minV = Math.min(...allVals); const maxV = Math.max(...allVals);
  const xStep = innerW / (data.length - 1);
  const scaleY = (v: number) => innerH - ((v - minV) / (maxV - minV || 1)) * innerH;
  const pts = (key: string) => data.map((d, i) => `${PAD.left + i * xStep},${PAD.top + scaleY(d[key])}`).join(" ");
  const yTicks = [minV, Math.round((minV + maxV) / 2), maxV];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }}>
      {yTicks.map((v, i) => {
        const y = PAD.top + scaleY(v);
        return <g key={i}><line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="1" /><text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill={S.mutedLight} fontFamily="monospace">{v > 999 ? `${(v/1000).toFixed(1)}k` : v}</text></g>;
      })}
      {data.map((d, i) => (
        <text key={i} x={PAD.left + i * xStep} y={H - 4} textAnchor="middle" fontSize="9" fill={S.mutedLight} fontFamily="monospace">{d.date}</text>
      ))}
      {keys.map((key, ki) => (
        <polyline key={ki} points={pts(key)} fill="none" stroke={colors[ki]} strokeWidth={ki === 0 ? 2.5 : 1.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={ki === 1 ? "5 3" : undefined} />
      ))}
      {keys.map((key, ki) => {
        const last = data[data.length - 1];
        const x = PAD.left + (data.length - 1) * xStep;
        const y = PAD.top + scaleY(last[key]);
        return <rect key={ki} x={x - 3} y={y - 3} width="6" height="6" fill={colors[ki]} rx="2" />;
      })}
    </svg>
  );
}

function CSSBarChart({ data, dataKey, color }: { data: any[]; dataKey: string; color: string }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  return (
    <div className="flex items-end gap-2" style={{ height: 120 }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full transition-all" style={{ height: `${Math.max(4, (d[dataKey] / max) * 96)}px`, background: color, borderRadius: "4px 4px 0 0" }} />
          <span className="font-mono" style={{ color: S.muted, fontSize: "9px" }}>{d.city}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────
const userGrowth = [
  { date: "6/29", users: 1240, orders: 42 }, { date: "6/30", users: 1310, orders: 58 },
  { date: "7/1",  users: 1380, orders: 67 }, { date: "7/2",  users: 1425, orders: 45 },
  { date: "7/3",  users: 1490, orders: 73 }, { date: "7/4",  users: 1560, orders: 89 },
  { date: "7/5",  users: 1623, orders: 94 },
];
const cityData = [
  { city: "北京", members: 420 }, { city: "上海", members: 380 },
  { city: "广州", members: 290 }, { city: "深圳", members: 310 },
  { city: "成都", members: 180 }, { city: "杭州", members: 140 },
];
const aiSuggestions = [
  { icon: "!", title: "北京PRO会员群01 接近满员", desc: "当前 487/500，建议立即建立备用群", level: "high" },
  { icon: "→", title: "上海有 12 名用户待分配群组", desc: "建议优先分配至上海体验官群02", level: "medium" },
  { icon: "!", title: "fengle_gz_01 微信已30天未登录", desc: "存在账号封禁风险，请尽快处理", level: "high" },
  { icon: "↑", title: "本周订单量较上周提升 28%", desc: "成都新增用户增长明显，建议增加服务资源", level: "info" },
];
const todos = [
  { text: "审核退款申请 3 条", urgent: true, time: "09:30" },
  { text: "更新广州代理群群码", urgent: false, time: "11:00" },
  { text: "完成新用户分群 8 人", urgent: true, time: "12:00" },
  { text: "工单回访：陈美玲", urgent: false, time: "14:00" },
  { text: "城市分站月报审核", urgent: false, time: "16:00" },
];
const risks = [
  { text: "王建国退款申请超时 2h，SLA 风险" },
  { text: "fengle_gz_01 微信异常，30天未登录" },
  { text: "深圳代理群接近满员 (290/300)" },
];

function KpiCard({ icon: Icon, label, value, delta, deltaDir, accentColor }: any) {
  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 flex items-center justify-center" style={{ background: accentColor === S.accent ? S.accent : "#0d0d0d", borderRadius: S.radiusSm }}>
          <Icon size={16} style={{ color: accentColor === S.accent ? "#000" : S.accent }} />
        </div>
        <div className="flex items-center gap-1 text-xs font-mono font-bold" style={{ color: deltaDir === "up" ? "#0d0d0d" : "#e53e3e" }}>
          {deltaDir === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{delta}
        </div>
      </div>
      <div>
        <div className="text-xs font-mono" style={{ color: S.muted, letterSpacing: "0.04em" }}>{label}</div>
        <div className="font-bold mt-0.5" style={{ fontSize: "24px", color: S.text, fontFamily: "monospace" }}>{value}</div>
      </div>
    </div>
  );
}

export default function Overview() {
  return (
    <div className="p-6 space-y-5" style={{ background: S.bg, minHeight: "100%" }}>
      {/* Risk bar */}
      <div className="p-3 flex items-center gap-4 flex-wrap" style={{ background: "#0d0d0d", border: `1px solid ${S.accent}`, borderRadius: S.radiusSm }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} style={{ color: S.accent }} />
          <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.accent }}>// HIGH RISK ALERT</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {risks.map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#aaa" }}>
              <span style={{ color: S.accent }}>▶</span> {r.text}
            </div>
          ))}
        </div>
        <button className="ml-auto text-xs font-mono font-bold px-3 py-1" style={{ background: S.accent, color: "#000", borderRadius: "6px" }}>VIEW ALL</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard icon={Database}      label="// ACCOUNT ASSETS" value="1,247" delta="12 本月新增" deltaDir="up"   accentColor={S.accent} />
        <KpiCard icon={MessageCircle} label="// ACTIVE WECHATS" value="68"    delta="3 待交接"  deltaDir="down" accentColor="#000" />
        <KpiCard icon={Users2}        label="// ACTIVE GROUPS"   value="34"    delta="2 接近满员" deltaDir="down" accentColor="#000" />
        <KpiCard icon={UserPlus}      label="// PENDING ASSIGN"  value="23"    delta="8 今日新增" deltaDir="up"   accentColor={S.accent} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold font-mono tracking-wider" style={{ color: S.text }}>// USER_GROWTH_7D</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: S.muted }}>近 7 日新增用户 &amp; 订单</div>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3" style={{ background: S.accent, borderRadius: "3px" }} /><span style={{ color: S.muted }}>USERS</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3" style={{ background: S.text, borderRadius: "3px" }} /><span style={{ color: S.muted }}>ORDERS</span></div>
            </div>
          </div>
          <SVGLineChart data={userGrowth} keys={["users","orders"]} colors={[S.accent, S.text]} height={160} />
        </div>
        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-xs font-bold font-mono tracking-wider mb-1" style={{ color: S.text }}>// CITY_MEMBERS</div>
          <div className="text-xs font-mono mb-4" style={{ color: S.muted }}>各城市 PRO 会员数量</div>
          <CSSBarChart data={cityData} dataKey="members" color={S.accent} />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-3 gap-4">
        {/* AI suggestions */}
        <div className="col-span-2 p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
              <Zap size={12} style={{ color: "#000" }} />
            </div>
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.text }}>// AI_SUGGESTIONS</span>
            <span className="ml-auto text-xs font-mono px-2 py-0.5" style={{ background: "#0d0d0d", color: S.accent, borderRadius: "6px" }}>TODAY</span>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((s, i) => {
              const isHigh = s.level === "high";
              return (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5" style={{ background: isHigh ? "#0d0d0d" : S.bg, border: `1px solid ${isHigh ? S.accent : S.border}`, borderRadius: S.radiusSm }}>
                  <span className="font-bold font-mono flex-shrink-0 mt-0.5" style={{ color: isHigh ? S.accent : S.muted, fontSize: "14px" }}>{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: isHigh ? S.accent : S.text }}>{s.title}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: isHigh ? "#888" : S.muted }}>{s.desc}</div>
                  </div>
                  <button className="text-xs font-bold font-mono px-2 py-1 flex-shrink-0" style={{ background: S.accent, color: "#000", borderRadius: "6px" }}>→</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Todos */}
        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={13} style={{ color: S.accent }} />
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.text }}>// TASKS</span>
            <span className="ml-auto text-xs font-mono font-bold" style={{ color: S.muted }}>5 ITEMS</span>
          </div>
          <div className="space-y-0">
            {todos.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <div className="w-3.5 h-3.5 flex-shrink-0 border-2" style={{ borderColor: t.urgent ? S.accent : "rgba(0,0,0,0.15)", background: "transparent", borderRadius: "4px" }} />
                <span className="flex-1 text-xs font-mono" style={{ color: S.textSec }}>{t.text}</span>
                <div className="flex items-center gap-1 text-xs font-mono flex-shrink-0" style={{ color: S.muted }}>
                  <Clock size={9} />{t.time}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-bold font-mono tracking-wider" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
            VIEW CALENDAR →
          </button>
        </div>
      </div>
    </div>
  );
}
