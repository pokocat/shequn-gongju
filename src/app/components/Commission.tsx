import { useState } from "react";
import { Check, X, ChevronDown, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { S, useThemeSingleton } from "../theme";
// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_TREND = [
  { month: "2月", total: 22400, l1: 10200, l2: 8100, l3: 4100 },
  { month: "3月", total: 28600, l1: 13000, l2: 10400, l3: 5200 },
  { month: "4月", total: 31200, l1: 14200, l2: 11200, l3: 5800 },
  { month: "5月", total: 34800, l1: 16000, l2: 12500, l3: 6300 },
  { month: "6月", total: 36100, l1: 16800, l2: 12900, l3: 6400 },
  { month: "7月", total: 38420, l1: 18200, l2: 12600, l3: 7620 },
];

const TOP_EARNERS = [
  { rank: 1, name: "张志远",   level: "一级",  month: 6820, total: 48200, team: 18 },
  { rank: 2, name: "李晓红",   level: "一级",  month: 5640, total: 39600, team: 14 },
  { rank: 3, name: "王建国",   level: "一级",  month: 4980, total: 32100, team: 11 },
  { rank: 4, name: "陈美玲",   level: "二级",  month: 3200, total: 21800, team: 8  },
  { rank: 5, name: "赵伟明",   level: "二级",  month: 2960, total: 18400, team: 7  },
];

const COMMISSION_DETAIL = [
  { time: "2026-07-05 09:12", agent: "张志远", level: "一级", order: "ORD20260705001", type: "直销",   amount: 596,  status: "已结算" },
  { time: "2026-07-05 10:30", agent: "李晓红", level: "一级", order: "ORD20260705002", type: "直销",   amount: 196,  status: "待结算" },
  { time: "2026-07-05 11:48", agent: "陈美玲", level: "二级", order: "ORD20260705003", type: "间接",   amount: 298,  status: "待结算" },
  { time: "2026-07-04 14:22", agent: "王建国", level: "一级", order: "ORD20260704001", type: "直销",   amount: 880,  status: "已结算" },
  { time: "2026-07-04 16:00", agent: "赵伟明", level: "二级", order: "ORD20260704002", type: "间接",   amount: 148,  status: "已结算" },
  { time: "2026-07-04 17:30", agent: "孙文英", level: "三级", order: "ORD20260704003", type: "团队奖", amount: 74,   status: "待结算" },
  { time: "2026-07-03 09:00", agent: "张志远", level: "一级", order: "ORD20260703001", type: "直销",   amount: 1760, status: "已结算" },
  { time: "2026-07-03 10:20", agent: "李晓红", level: "一级", order: "ORD20260703002", type: "直销",   amount: 596,  status: "已结算" },
  { time: "2026-07-02 14:00", agent: "刘春雨", level: "二级", order: "ORD20260702001", type: "间接",   amount: 298,  status: "已结算" },
  { time: "2026-07-01 08:30", agent: "钱小明", level: "三级", order: "ORD20260701001", type: "团队奖", amount: 49,   status: "已结算" },
];

const SETTLEMENT_RECORDS = [
  { period: "2026年6月", agents: 128, total: 36100, status: "已结算", time: "2026-07-01 10:00" },
  { period: "2026年5月", agents: 121, total: 34800, status: "已结算", time: "2026-06-01 10:00" },
  { period: "2026年4月", agents: 115, total: 31200, status: "已结算", time: "2026-05-01 10:00" },
  { period: "2026年3月", agents: 108, total: 28600, status: "已结算", time: "2026-04-01 10:00" },
  { period: "2026年2月", agents: 98,  total: 22400, status: "已结算", time: "2026-03-01 10:00" },
  { period: "2026年7月", agents: 134, total: 38420, status: "结算中", time: "—" },
];

const WITHDRAWAL_REQUESTS = [
  { id: 1, name: "张志远", amount: 5000, method: "支付宝 138****4567", time: "2026-07-05 09:00", status: "待审核" },
  { id: 2, name: "李晓红", amount: 3200, method: "招商银行 **** 8821", time: "2026-07-04 14:30", status: "已打款" },
  { id: 3, name: "王建国", amount: 2800, method: "微信零钱 139****2233", time: "2026-07-04 11:00", status: "待审核" },
  { id: 4, name: "陈美玲", amount: 1600, method: "支付宝 158****7890", time: "2026-07-03 16:00", status: "已打款" },
  { id: 5, name: "赵伟明", amount: 900,  method: "工商银行 **** 3342", time: "2026-07-03 09:20", status: "已拒绝" },
  { id: 6, name: "孙文英", amount: 600,  method: "支付宝 186****6677", time: "2026-07-02 15:00", status: "待审核" },
];

// ─── Badge helper ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; color: string; radius?: string }> = {
  "已结算": { bg: S.accent,  color: S.text,  radius: S.radiusSm },
  "待结算": { bg: "#3b82f6", color: S.text,  radius: S.radiusSm },
  "结算中": { bg: "#f1f5f9", color: "#475569",  radius: S.radiusSm },
  "已打款": { bg: S.accent,  color: S.text,  radius: S.radiusSm },
  "待审核": { bg: "#3b82f6", color: S.text,  radius: S.radiusSm },
  "已拒绝": { bg: "#1e293b", color: S.accent, radius: S.radiusSm },
  "直销":   { bg: "#f1f5f9", color: "#475569", radius: S.radiusSm },
  "间接":   { bg: "#f1f5f9", color: "#475569", radius: S.radiusSm },
  "团队奖": { bg: S.accent,  color: S.text,  radius: S.radiusSm },
};

function Badge({ label }: { label: string }) {
  const st = STATUS_STYLES[label] ?? { bg: "#f1f5f9", color: "#475569", radius: S.radiusSm };
  return (
    <span
      style={{
        background: st.bg,
        color: st.color,
        borderRadius: st.radius ?? S.radiusSm,
        padding: "2px 7px",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
        fontFamily: "monospace",
      }}
    >
      {label}
    </span>
  );
}

const LEVEL_COLOR: Record<string, string> = {
  "一级": S.accent,
  "二级": "#3b82f6",
  "三级": "#f1f5f9",
};

const LEVEL_TEXT: Record<string, string> = {
  "一级": S.text,
  "二级": S.text,
  "三级": "#475569",
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function WithdrawalModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("支付宝");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: S.surface,
          border: `1px solid ${S.borderMed}`,
          borderRadius: S.radiusLg,
          padding: 24,
          width: 400,
          boxShadow: "0 16px 48px rgba(15,23,42,0.12)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: S.text, fontFamily: "monospace", fontSize: 14, textTransform: "uppercase" }}>申请提现</span>
          <button onClick={onClose} style={{ color: S.muted, background: "none", border: "none", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, marginBottom: 4, display: "block", color: S.muted, fontFamily: "monospace", textTransform: "uppercase" }}>提现金额（元）</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="请输入提现金额"
              style={{
                width: "100%",
                border: `1px solid rgba(15,23,42,0.12)`,
                borderRadius: S.radiusSm,
                padding: "8px 10px",
                fontSize: 13,
                color: S.text,
                outline: "none",
                background: "#f1f5f9",
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, marginBottom: 4, display: "block", color: S.muted, fontFamily: "monospace", textTransform: "uppercase" }}>提现方式</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["支付宝", "微信", "银行卡"].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: S.radiusSm,
                    border: `1px solid ${method === m ? S.text : S.border}`,
                    background: method === m ? "#1e293b" : S.surface,
                    color: method === m ? S.accent : S.muted,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: method === m ? 700 : 400,
                    fontFamily: "monospace",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, marginBottom: 4, display: "block", color: S.muted, fontFamily: "monospace", textTransform: "uppercase" }}>账号</label>
            <input
              placeholder={method === "银行卡" ? "银行卡号" : `${method}账号`}
              style={{
                width: "100%",
                border: `1px solid rgba(15,23,42,0.12)`,
                borderRadius: S.radiusSm,
                padding: "8px 10px",
                fontSize: 13,
                color: S.text,
                outline: "none",
                background: "#f1f5f9",
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "8px", borderRadius: S.radiusSm, border: `1px solid ${S.border}`,
              background: S.surface, color: S.muted, fontSize: 13, cursor: "pointer", fontFamily: "monospace",
            }}
          >
            取消
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "8px", borderRadius: S.radiusSm, border: "none",
              background: "#1e293b", color: S.accent, fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: "monospace",
            }}
          >
            提交申请
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Tree Diagram ───────────────────────────────────────────────────────

function AgentTree() {
  const levels = [
    { label: "一级代理", bg: S.accent, tc: S.text, count: 34, rate: "20%佣金", example: ["张志远", "李晓红", "王建国"] },
    { label: "二级代理", bg: "#3b82f6", tc: S.text, count: 67, rate: "10%佣金", example: ["陈美玲", "赵伟明", "孙文英"] },
    { label: "三级代理", bg: "#f1f5f9", tc: "#475569", count: 33, rate: "5%佣金",  example: ["刘春雨", "钱小明", "方大国"] },
  ];

  return (
    <div
      style={{
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderRadius: S.radius,
        padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>代理层级架构</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {levels.map((lvl, i) => (
          <div key={lvl.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: i * 20, flexShrink: 0 }} />
            <div
              style={{
                background: lvl.bg,
                border: `1px solid ${S.border}`,
                borderRadius: S.radiusSm,
                padding: "8px 12px",
                flex: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 11, color: lvl.tc, fontFamily: "monospace" }}>{lvl.label}</span>
                <span style={{ fontSize: 11, color: lvl.tc, fontFamily: "monospace", opacity: 0.7 }}>{lvl.count}人 · {lvl.rate}</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {lvl.example.map(n => (
                  <span
                    key={n}
                    style={{
                      background: S.surface,
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                      padding: "1px 6px",
                      fontSize: 10,
                      color: S.textSec,
                      fontFamily: "monospace",
                    }}
                  >
                    {n}
                  </span>
                ))}
                <span style={{ fontSize: 10, color: lvl.tc, padding: "1px 0", fontFamily: "monospace", opacity: 0.7 }}>+{lvl.count - 3}人</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Commission() {
  useThemeSingleton();
const [activeTab, setActiveTab] = useState("overview");
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [withdrawals, setWithdrawals] = useState(WITHDRAWAL_REQUESTS);
  const [detailFilter, setDetailFilter] = useState({ level: "全部", type: "全部" });

  const tabs = [
    { key: "overview",    label: "收益总览" },
    { key: "detail",      label: "佣金明细" },
    { key: "settlement",  label: "结算记录" },
    { key: "withdrawal",  label: "提现管理" },
  ];

  const approveWithdrawal = (id: number) => {
    setWithdrawals(w => w.map(r => r.id === id ? { ...r, status: "已打款" } : r));
  };
  const rejectWithdrawal = (id: number) => {
    setWithdrawals(w => w.map(r => r.id === id ? { ...r, status: "已拒绝" } : r));
  };

  const filteredDetail = COMMISSION_DETAIL.filter(
    r =>
      (detailFilter.level === "全部" || r.level === detailFilter.level) &&
      (detailFilter.type === "全部" || r.type === detailFilter.type)
  );

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, background: S.bg, minHeight: "100%", fontFamily: "monospace" }}>
      {withdrawalModal && <WithdrawalModal onClose={() => setWithdrawalModal(false)} />}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: S.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>分销佣金管理</h2>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: S.muted, fontFamily: "monospace" }}>追踪代理佣金、结算进度与提现审核</p>
        </div>
        <button
          onClick={() => setWithdrawalModal(true)}
          style={{
            background: "#1e293b", color: S.accent, border: "none", borderRadius: S.radius,
            padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
          }}
        >
          + 申请提现
        </button>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex", gap: 4, background: S.surface, border: `1px solid ${S.border}`,
          borderRadius: S.radius, padding: 4, width: "fit-content",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "6px 16px", borderRadius: S.radiusSm, border: "none",
              background: activeTab === t.key ? "#1e293b" : "transparent",
              color: activeTab === t.key ? S.accent : S.muted,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1 – 收益总览                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "本月总佣金", value: "¥38,420", icon: DollarSign, bg: S.accent,   tc: S.text },
              { label: "待结算",     value: "¥12,840", icon: Clock,       bg: "#3b82f6",  tc: S.text },
              { label: "已提现",     value: "¥25,580", icon: Check,       bg: "#1e293b",  tc: S.accent },
              { label: "代理总数",   value: "134人",   icon: Users,       bg: "#f1f5f9",  tc: "#475569" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  style={{
                    background: S.surface,
                    border: `1px solid ${S.border}`,
                    borderRadius: S.radius,
                    padding: "14px 16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: S.muted, fontFamily: "monospace", textTransform: "uppercase" }}>{s.label}</span>
                    <div style={{ background: s.bg, borderRadius: S.radiusSm, padding: 5 }}>
                      <Icon size={13} style={{ color: s.tc }} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: S.text, fontFamily: "monospace" }}>{s.value}</div>
                </div>
              );
            })}
          </div>

          {/* Distribution pyramid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "一级代理", fee: "¥4,800授权费", rate: "20%", count: 34, revenue: 18200, bg: S.accent, tc: S.text },
              { label: "二级代理", fee: "下线推荐佣金", rate: "10%", count: 67, revenue: 12600, bg: "#3b82f6", tc: S.text },
              { label: "三级代理", fee: "团队奖励",     rate: "5%",  count: 33, revenue: 7620,  bg: "#f1f5f9", tc: "#475569" },
            ].map(p => (
              <div
                key={p.label}
                style={{
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  borderRadius: S.radius,
                  padding: 14,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: S.text, fontFamily: "monospace" }}>{p.label}</span>
                  <span style={{ background: p.bg, color: p.tc, borderRadius: S.radiusSm, padding: "2px 7px", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
                    佣金率 {p.rate}
                  </span>
                </div>
                <div style={{ fontSize: 11, marginBottom: 8, color: S.muted, fontFamily: "monospace" }}>{p.fee}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>人数</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: S.text, fontFamily: "monospace" }}>{p.count}人</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: S.muted, fontFamily: "monospace" }}>本月收益</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: S.text, fontFamily: "monospace" }}>
                      ¥{p.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 10, height: 4, background: S.border, borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${(p.revenue / 38420) * 100}%`, height: "100%", background: p.bg === "#f1f5f9" ? S.text : p.bg, borderRadius: "4px" }} />
                </div>
                <div style={{ fontSize: 10, marginTop: 4, color: S.muted, fontFamily: "monospace" }}>
                  占总佣金 {((p.revenue / 38420) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          {/* Chart + tree */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
            {/* Trend chart */}
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>月度佣金趋势</div>
              <p style={{ fontSize: 11, marginBottom: 12, color: S.muted, fontFamily: "monospace" }}>最近6个月各级代理佣金构成</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke={S.border} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={36}
                    tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: S.radiusSm, border: `1px solid ${S.border}`, fontSize: 12, fontFamily: "monospace", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    formatter={(v: number, name: string) => {
                      const map: Record<string, string> = { l1: "一级", l2: "二级", l3: "三级", total: "合计" };
                      return [`¥${v.toLocaleString()}`, map[name] ?? name];
                    }}
                  />
                  <Line type="monotone" dataKey="l1" stroke={S.accent} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="l2" stroke={S.text} strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="l3" stroke={S.muted} strokeWidth={2} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent tree */}
            <AgentTree />
          </div>

          {/* Top earners */}
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${S.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>本月收益榜单 TOP 5</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
              <thead>
                <tr style={{ background: "#1e293b" }}>
                  {["排名", "姓名", "等级", "本月佣金", "累计佣金", "团队人数"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 14px", textAlign: "left", color: "#475569",
                        fontWeight: 700, borderBottom: `1px solid ${S.border}`,
                        fontFamily: "monospace", fontSize: 11, textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_EARNERS.map((r, i) => (
                  <tr key={r.rank} style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? S.surface : "#fafaf8" }}>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 22, height: 22, borderRadius: S.radiusSm,
                          background: r.rank <= 3 ? "#1e293b" : "#f1f5f9",
                          color: r.rank <= 3 ? S.accent : S.muted,
                          fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                        }}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{r.name}</td>
                    <td style={{ padding: "9px 14px" }}>
                      <span
                        style={{
                          background: LEVEL_COLOR[r.level] ?? "#f1f5f9",
                          color: LEVEL_TEXT[r.level] ?? "#475569",
                          borderRadius: S.radiusSm, padding: "2px 7px", fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                        }}
                      >
                        {r.level}代理
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px", color: S.text, fontWeight: 700, fontFamily: "monospace" }}>
                      ¥{r.month.toLocaleString()}
                    </td>
                    <td style={{ padding: "9px 14px", color: S.textSec, fontFamily: "monospace" }}>¥{r.total.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", color: S.muted, fontFamily: "monospace" }}>{r.team}人</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2 – 佣金明细                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "detail" && (
        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          {/* Filters */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${S.border}`, background: "#fafaf8" }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, fontFamily: "monospace" }}>筛选：</div>
            {/* Level filter */}
            <div style={{ position: "relative" }}>
              <select
                value={detailFilter.level}
                onChange={e => setDetailFilter(f => ({ ...f, level: e.target.value }))}
                style={{
                  border: `1px solid rgba(15,23,42,0.12)`, borderRadius: S.radiusSm,
                  padding: "5px 28px 5px 10px", fontSize: 12, color: S.text,
                  background: S.surface, cursor: "pointer", appearance: "none", fontFamily: "monospace",
                }}
              >
                {["全部", "一级", "二级", "三级"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
            </div>
            {/* Type filter */}
            <div style={{ position: "relative" }}>
              <select
                value={detailFilter.type}
                onChange={e => setDetailFilter(f => ({ ...f, type: e.target.value }))}
                style={{
                  border: `1px solid rgba(15,23,42,0.12)`, borderRadius: S.radiusSm,
                  padding: "5px 28px 5px 10px", fontSize: 12, color: S.text,
                  background: S.surface, cursor: "pointer", appearance: "none", fontFamily: "monospace",
                }}
              >
                {["全部", "直销", "间接", "团队奖"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
            </div>
            <div style={{ fontSize: 11, color: S.muted, fontFamily: "monospace" }}>共 {filteredDetail.length} 条记录</div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {["时间", "代理人", "等级", "来源订单", "佣金类型", "金额", "状态"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 14px", textAlign: "left", color: "#475569",
                      fontWeight: 700, borderBottom: `1px solid ${S.border}`,
                      whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDetail.map((r, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? S.surface : "#fafaf8" }}
                >
                  <td style={{ padding: "8px 14px", color: S.muted, whiteSpace: "nowrap", fontFamily: "monospace" }}>{r.time}</td>
                  <td style={{ padding: "8px 14px", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{r.agent}</td>
                  <td style={{ padding: "8px 14px" }}>
                    <span
                      style={{
                        background: LEVEL_COLOR[r.level] ?? "#f1f5f9",
                        color: LEVEL_TEXT[r.level] ?? "#475569",
                        borderRadius: S.radiusSm, padding: "1px 6px", fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                      }}
                    >
                      {r.level}
                    </span>
                  </td>
                  <td style={{ padding: "8px 14px", color: S.muted, fontFamily: "monospace", fontSize: 11 }}>{r.order}</td>
                  <td style={{ padding: "8px 14px" }}><Badge label={r.type} /></td>
                  <td style={{ padding: "8px 14px", color: S.text, fontWeight: 700, fontFamily: "monospace" }}>¥{r.amount}</td>
                  <td style={{ padding: "8px 14px" }}><Badge label={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3 – 结算记录                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "settlement" && (
        <>
          {/* Calendar overview */}
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>结算月历</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SETTLEMENT_RECORDS.map(r => {
                const st = STATUS_STYLES[r.status] ?? { bg: "#f1f5f9", color: "#475569" };
                return (
                  <div
                    key={r.period}
                    style={{
                      background: st.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm,
                      padding: "8px 14px", textAlign: "center", minWidth: 90,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 11, color: st.color, fontFamily: "monospace" }}>{r.period}</div>
                    <div style={{ fontSize: 10, marginTop: 2, color: st.color, fontFamily: "monospace" }}>{r.status}</div>
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>¥{r.total.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Records table */}
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${S.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>结算记录明细</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
              <thead>
                <tr style={{ background: "#1e293b" }}>
                  {["结算周期", "代理人数", "总金额", "状态", "操作时间"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 16px", textAlign: "left", color: "#475569",
                        fontWeight: 700, borderBottom: `1px solid ${S.border}`,
                        fontFamily: "monospace", fontSize: 11, textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SETTLEMENT_RECORDS.map((r, i) => (
                  <tr
                    key={r.period}
                    style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? S.surface : "#fafaf8" }}
                  >
                    <td style={{ padding: "9px 16px", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{r.period}</td>
                    <td style={{ padding: "9px 16px", color: S.textSec, fontFamily: "monospace" }}>{r.agents}人</td>
                    <td style={{ padding: "9px 16px", color: S.text, fontWeight: 700, fontFamily: "monospace" }}>¥{r.total.toLocaleString()}</td>
                    <td style={{ padding: "9px 16px" }}><Badge label={r.status} /></td>
                    <td style={{ padding: "9px 16px", color: S.muted, fontFamily: "monospace" }}>{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Settlement bar chart */}
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>结算金额趋势</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={MONTHLY_TREND} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={S.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={40}
                  tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: S.radiusSm, border: `1px solid ${S.border}`, fontSize: 12, fontFamily: "monospace", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v: number) => [`¥${v.toLocaleString()}`, "结算金额"]}
                />
                <Bar dataKey="total" fill={S.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4 – 提现管理                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "withdrawal" && (
        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${S.border}` }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: S.text, fontFamily: "monospace", textTransform: "uppercase" }}>提现申请列表</span>
            <div style={{ display: "flex", gap: 8, fontSize: 11, color: S.muted, fontFamily: "monospace" }}>
              <span>待审核：{withdrawals.filter(r => r.status === "待审核").length}笔</span>
              <span>·</span>
              <span>合计：¥{withdrawals.filter(r => r.status === "待审核").reduce((s, r) => s + r.amount, 0).toLocaleString()}</span>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {["申请人", "金额", "收款方式", "申请时间", "状态", "操作"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 16px", textAlign: "left", color: "#475569",
                      fontWeight: 700, borderBottom: `1px solid ${S.border}`,
                      whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((r, i) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? S.surface : "#fafaf8" }}
                >
                  <td style={{ padding: "9px 16px", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{r.name}</td>
                  <td style={{ padding: "9px 16px", color: S.text, fontWeight: 700, fontFamily: "monospace" }}>¥{r.amount.toLocaleString()}</td>
                  <td style={{ padding: "9px 16px", color: S.muted, fontFamily: "monospace" }}>{r.method}</td>
                  <td style={{ padding: "9px 16px", color: S.muted, whiteSpace: "nowrap", fontFamily: "monospace" }}>{r.time}</td>
                  <td style={{ padding: "9px 16px" }}><Badge label={r.status} /></td>
                  <td style={{ padding: "9px 16px" }}>
                    {r.status === "待审核" ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => approveWithdrawal(r.id)}
                          style={{
                            padding: "3px 10px", borderRadius: S.radiusSm, border: "none",
                            background: S.accent, color: S.text, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
                          }}
                        >
                          通过
                        </button>
                        <button
                          onClick={() => rejectWithdrawal(r.id)}
                          style={{
                            padding: "3px 10px", borderRadius: S.radiusSm, border: "none",
                            background: "#1e293b", color: S.accent, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
                          }}
                        >
                          拒绝
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: S.mutedLight, fontSize: 11, fontFamily: "monospace" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
