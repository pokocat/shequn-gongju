import { useState } from "react";
import { TrendingUp, Database, Users2, UserPlus, AlertTriangle, Zap, CheckCircle, Clock, ArrowUp, ArrowDown, MessageCircle, ChevronRight, X } from "lucide-react";
import { S, useThemeSingleton } from "../theme";

// ─── Soft rounded cyberpunk constants ────────────────────────
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

type SuggestionLevel = "high" | "medium" | "info";
type SuggestionAction = "处理" | "分配" | "登录" | "查看";

interface AISuggestion {
  id: number;
  icon: string;
  title: string;
  desc: string;
  level: SuggestionLevel;
  action: SuggestionAction;
  targetModule?: string;
}

const initialSuggestions: AISuggestion[] = [
  { id: 1, icon: "!", title: "北京PRO会员群01 接近满员", desc: "当前 487/500，建议立即建立备用群", level: "high", action: "处理", targetModule: "community" },
  { id: 2, icon: "→", title: "上海有 12 名用户待分配群组", desc: "建议优先分配至上海体验官群02", level: "medium", action: "分配", targetModule: "users" },
  { id: 3, icon: "!", title: "wx_gz_01 微信已30天未登录", desc: "存在账号封禁风险，请尽快处理", level: "high", action: "登录", targetModule: "wechat" },
  { id: 4, icon: "↑", title: "本周订单量较上周提升 28%", desc: "成都新增用户增长明显，建议增加服务资源", level: "info", action: "查看", targetModule: "reports" },
];

interface TodoItem {
  id: number;
  text: string;
  urgent: boolean;
  time: string;
  done: boolean;
  targetModule?: string;
}

const initialTodos: TodoItem[] = [
  { id: 1, text: "审核退款申请 3 条", urgent: true, time: "09:30", done: false, targetModule: "orders" },
  { id: 2, text: "更新广州代理群群码", urgent: false, time: "11:00", done: false, targetModule: "community" },
  { id: 3, text: "完成新用户分群 8 人", urgent: true, time: "12:00", done: false, targetModule: "users" },
  { id: 4, text: "工单回访：陈美玲", urgent: false, time: "14:00", done: false, targetModule: "tickets" },
  { id: 5, text: "城市分站月报审核", urgent: false, time: "16:00", done: false, targetModule: "reports" },
];

interface RiskItem {
  id: number;
  text: string;
  level: "high" | "warning";
  delta?: string;
  action: string;
  targetModule?: string;
}

const initialRisks: RiskItem[] = [
  { id: 1, text: "王建国退款申请超时 2h，SLA 风险", level: "high", delta: "+2h", action: "立即处理", targetModule: "orders" },
  { id: 2, text: "wx_gz_01 微信异常，30天未登录", level: "high", delta: "30d", action: "查看工具", targetModule: "wechat" },
  { id: 3, text: "深圳代理群接近满员 (290/300)", level: "warning", delta: "97%", action: "扩容", targetModule: "community" },
];

interface OverviewProps {
  onNavigate?: (module: string) => void;
}

export default function Overview({
 onNavigate }: OverviewProps = {}) {
  useThemeSingleton();
const [suggestions, setSuggestions] = useState<AISuggestion[]>(initialSuggestions);
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [risks] = useState<RiskItem[]>(initialRisks);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function navigate(module?: string) {
    if (module && onNavigate) {
      onNavigate(module);
    } else {
      showToast("暂未配置跳转目标");
    }
  }

  function handleSuggestionAction(id: number, action: SuggestionAction, targetModule?: string) {
    const s = suggestions.find(x => x.id === id);
    if (!s) return;
    if (targetModule) {
      navigate(targetModule);
    } else {
      showToast(`建议已处理：${s.title.slice(0, 12)}...`);
    }
    setSuggestions(prev => prev.filter(x => x.id !== id));
  }

  function handleSuggestionDismiss(id: number) {
    setSuggestions(prev => prev.filter(x => x.id !== id));
    showToast("建议已忽略");
  }

  function toggleTodo(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const t = todos.find(x => x.id === id);
    if (t && !t.done) showToast(`已完成：${t.text}`);
  }

  function handleTodoClick(t: TodoItem) {
    if (!t.done && t.targetModule) navigate(t.targetModule);
  }

  function handleRiskAction(r: RiskItem) {
    if (r.targetModule) navigate(r.targetModule);
    else showToast(`${r.action} · ${r.text.slice(0, 10)}...`);
  }

  function handleViewAllRisks() {
    navigate("tickets");
  }

  const kpis = [
    { icon: Database,      label: "// ACCOUNT ASSETS", value: "1,247", delta: "12 本月新增", deltaDir: "up" as const,   accentColor: S.accent, targetModule: "accounts" },
    { icon: MessageCircle, label: "// ACTIVE WECHATS", value: "68",    delta: "3 待交接",  deltaDir: "down" as const, accentColor: "#3b82f6", targetModule: "wechat" },
    { icon: Users2,        label: "// ACTIVE GROUPS",   value: "34",    delta: "2 接近满员", deltaDir: "down" as const, accentColor: "#3b82f6", targetModule: "community" },
    { icon: UserPlus,      label: "// PENDING ASSIGN",  value: "23",    delta: "8 今日新增", deltaDir: "up" as const,   accentColor: S.accent, targetModule: "users" },
  ];

  const completedCount = todos.filter(t => t.done).length;
  const highRiskCount = risks.filter(r => r.level === "high").length;

  return (
    <div className="p-6 space-y-5 relative" style={{ background: S.bg, minHeight: "100%", fontFamily: "monospace" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {/* Risk bar - real-time with action */}
      <div className="p-3 flex items-center gap-4 flex-wrap" style={{ background: "#1e293b", border: `1px solid ${S.accent}`, borderRadius: S.radiusSm }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={13} style={{ color: S.accent }} />
          <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.accent }}>// HIGH RISK ALERT</span>
          <span className="text-xs font-bold px-1.5 py-0.5" style={{ background: highRiskCount > 0 ? "#cc0000" : S.accent, color: "#ffffff", borderRadius: "4px" }}>{risks.length}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {risks.map(r => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs font-mono group" style={{ color: "#aaa" }}>
              <span style={{ color: r.level === "high" ? "#ff6b6b" : S.accent }}>▶</span>
              <span>{r.text}</span>
              {r.delta && <span className="px-1 py-0.5 text-xs font-bold" style={{ background: r.level === "high" ? "rgba(204,0,0,0.2)" : S.accentMid, color: r.level === "high" ? "#ff6b6b" : S.accent, borderRadius: "3px" }}>{r.delta}</span>}
              <button
                className="text-xs font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: S.accent, color: S.onPrimary, borderRadius: "3px" }}
                onClick={() => handleRiskAction(r)}
              >
                {r.action}
              </button>
            </div>
          ))}
        </div>
        <button className="ml-auto text-xs font-mono font-bold px-3 py-1 flex items-center gap-1" style={{ background: S.accent, color: S.onPrimary, borderRadius: "6px" }} onClick={handleViewAllRisks}>
          VIEW ALL <ChevronRight size={10} className="inline" />
        </button>
      </div>

      {/* KPIs - clickable */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <button
              key={k.label}
              className="p-4 flex flex-col gap-3 text-left transition-all hover:shadow-md group"
              style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", cursor: "pointer" }}
              onClick={() => navigate(k.targetModule)}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 flex items-center justify-center" style={{ background: k.accentColor === S.accent ? S.accent : "#1e293b", borderRadius: S.radiusSm }}>
                  <Icon size={16} style={{ color: k.accentColor === S.accent ? "#ffffff" : S.accent }} />
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold" style={{ color: k.deltaDir === "up" ? "#1e293b" : "#e53e3e" }}>
                    {k.deltaDir === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{k.delta}
                  </div>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: S.muted }} />
                </div>
              </div>
              <div>
                <div className="text-xs font-mono" style={{ color: S.muted, letterSpacing: "0.04em" }}>{k.label}</div>
                <div className="font-bold mt-0.5" style={{ fontSize: "24px", color: S.text }}>{k.value}</div>
              </div>
            </button>
          );
        })}
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
        {/* AI suggestions - actionable */}
        <div className="col-span-2 p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
              <Zap size={12} style={{ color: S.onPrimary }} />
            </div>
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.text }}>// AI_SUGGESTIONS</span>
            <span className="ml-auto text-xs font-mono px-2 py-0.5" style={{ background: "#1e293b", color: S.accent, borderRadius: "6px" }}>{suggestions.length} 待处理</span>
          </div>
          <div className="space-y-2">
            {suggestions.map(s => {
              const isHigh = s.level === "high";
              return (
                <div key={s.id} className="flex items-start gap-3 px-3 py-2.5 group transition-all" style={{ background: isHigh ? "#1e293b" : S.bg, border: `1px solid ${isHigh ? S.accent : S.border}`, borderRadius: S.radiusSm }}>
                  <span className="font-bold font-mono flex-shrink-0 mt-0.5" style={{ color: isHigh ? S.accent : s.level === "medium" ? "#b45309" : S.muted, fontSize: "14px" }}>{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: isHigh ? S.accent : S.text }}>{s.title}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: isHigh ? "#888" : S.muted }}>{s.desc}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      className="text-xs font-bold font-mono px-2.5 py-1 transition-all"
                      style={{
                        background: s.level === "high" ? S.accent : "#1e293b",
                        color: s.level === "high" ? "#ffffff" : S.accent,
                        borderRadius: "6px",
                        border: "none",
                      }}
                      onClick={() => handleSuggestionAction(s.id, s.action, s.targetModule)}
                    >
                      {s.action}
                    </button>
                    <button
                      className="text-xs font-mono px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "transparent", color: isHigh ? "#888" : S.muted, borderRadius: "6px", border: `1px solid ${S.border}` }}
                      onClick={() => handleSuggestionDismiss(s.id)}
                      title="忽略"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
            {suggestions.length === 0 && (
              <div className="py-8 text-center">
                <CheckCircle size={20} className="mx-auto mb-2" style={{ color: S.accent }} />
                <div className="text-xs font-mono" style={{ color: S.muted }}>所有建议已处理</div>
              </div>
            )}
          </div>
        </div>

        {/* Todos - checkable */}
        <div className="p-5 flex flex-col" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={13} style={{ color: S.accent }} />
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: S.text }}>// TASKS</span>
            <span className="ml-auto text-xs font-mono font-bold" style={{ color: S.muted }}>{completedCount}/{todos.length}</span>
          </div>
          <div className="space-y-0 flex-1">
            {todos.map(t => (
              <div
                key={t.id}
                className={`flex items-center gap-2.5 py-2.5 group ${!t.done && t.targetModule ? "cursor-pointer" : ""}`}
                style={{ borderBottom: `1px solid ${S.border}`, opacity: t.done ? 0.5 : 1 }}
                onClick={() => handleTodoClick(t)}
              >
                <button
                  className="w-3.5 h-3.5 flex-shrink-0 border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: t.done ? S.accent : t.urgent ? S.accent : "rgba(0,0,0,0.15)",
                    background: t.done ? S.accent : "transparent",
                    borderRadius: "4px",
                  }}
                  onClick={e => { e.stopPropagation(); toggleTodo(t.id); }}
                >
                  {t.done && <CheckCircle size={9} style={{ color: "#ffffff" }} />}
                </button>
                <span className="flex-1 text-xs font-mono" style={{ color: t.done ? S.muted : S.textSec, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                <div className="flex items-center gap-1 text-xs font-mono flex-shrink-0" style={{ color: S.muted }}>
                  <Clock size={9} />{t.time}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 py-2 text-xs font-bold font-mono tracking-wider transition-all"
              style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, border: "none" }}
              onClick={() => navigate("tickets")}
            >
              工单中心 →
            </button>
            <button
              className="flex-1 py-2 text-xs font-bold font-mono tracking-wider transition-all"
              style={{ background: completedCount > 0 ? S.accent : "#f1f5f9", color: completedCount > 0 ? "#ffffff" : S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}
              disabled={completedCount === 0}
              onClick={() => { setTodos(prev => prev.map(t => ({ ...t, done: false }))); showToast("已重置所有任务"); }}
            >
              重置 ({completedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
