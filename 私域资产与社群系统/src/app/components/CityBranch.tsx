import { useState } from "react";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowUp, ChevronRight, Plus, BarChart2 } from "lucide-react";
import { getAvatar } from "./Avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const S = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "rgba(15,23,42,0.06)",
  borderMed: "rgba(15,23,42,0.12)",
  accent: "#3b82f6",
  accentLight: "rgba(59,130,246,0.08)",
  accentMid: "rgba(59,130,246,0.18)",
  text: "#1e293b",
  textSec: "#475569",
  muted: "#94a3b8",
  mutedLight: "#cbd5e1",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

const cities = [
  { id: 1, city: "北京", manager: "吴思远", phone: "138-0012-3456", members: 420, proMembers: 312, groups: 4, wechats: 3, monthlyRevenue: 126000, revenueGrowth: 12, memberGrowth: 8, status: "优秀", monthlyData: [{ m: "4月", r: 98000, m2: 340 }, { m: "5月", r: 112000, m2: 385 }, { m: "6月", r: 118000, m2: 405 }, { m: "7月", r: 126000, m2: 420 }] },
  { id: 2, city: "上海", manager: "林小燕", phone: "139-0012-3457", members: 380, proMembers: 278, groups: 3, wechats: 2, monthlyRevenue: 114000, revenueGrowth: 18, memberGrowth: 15, status: "优秀", monthlyData: [{ m: "4月", r: 76000, m2: 280 }, { m: "5月", r: 94000, m2: 320 }, { m: "6月", r: 102000, m2: 360 }, { m: "7月", r: 114000, m2: 380 }] },
  { id: 3, city: "广州", manager: "刘刚", phone: "138-0012-3458", members: 290, proMembers: 180, groups: 2, wechats: 2, monthlyRevenue: 87000, revenueGrowth: -3, memberGrowth: -2, status: "待提升", monthlyData: [{ m: "4月", r: 91000, m2: 302 }, { m: "5月", r: 94000, m2: 298 }, { m: "6月", r: 91000, m2: 295 }, { m: "7月", r: 87000, m2: 290 }] },
  { id: 4, city: "深圳", manager: "李梦华", phone: "186-0012-3462", members: 310, proMembers: 220, groups: 3, wechats: 2, monthlyRevenue: 93000, revenueGrowth: 7, memberGrowth: 5, status: "良好", monthlyData: [{ m: "4月", r: 82000, m2: 280 }, { m: "5月", r: 87000, m2: 295 }, { m: "6月", r: 90000, m2: 305 }, { m: "7月", r: 93000, m2: 310 }] },
  { id: 5, city: "成都", manager: "赵志远", phone: "152-0012-3461", members: 180, proMembers: 98, groups: 2, wechats: 2, monthlyRevenue: 54000, revenueGrowth: 32, memberGrowth: 28, status: "高增长", monthlyData: [{ m: "4月", r: 32000, m2: 110 }, { m: "5月", r: 41000, m2: 140 }, { m: "6月", r: 48000, m2: 162 }, { m: "7月", r: 54000, m2: 180 }] },
  { id: 6, city: "杭州", manager: "陈明", phone: "158-0012-3464", members: 140, proMembers: 85, groups: 1, wechats: 1, monthlyRevenue: 42000, revenueGrowth: 24, memberGrowth: 20, status: "高增长", monthlyData: [{ m: "4月", r: 24000, m2: 85 }, { m: "5月", r: 30000, m2: 105 }, { m: "6月", r: 36000, m2: 125 }, { m: "7月", r: 42000, m2: 140 }] },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  "优秀":   { bg: S.accent, color: "#ffffff" },
  "良好":   { bg: "#f1f5f9", color: "#475569" },
  "高增长": { bg: "#3b82f6", color: "#ffffff" },
  "待提升": { bg: "#1e293b", color: S.accent },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 text-xs" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace", boxShadow: "0 4px 12px rgba(15,23,42,0.06)" }}>
        <div className="mb-1 font-bold">{label}</div>
        {payload.map((p: any) => <div key={p.name} style={{ color: S.textSec }}>{p.name}: {typeof p.value === "number" && p.value > 1000 ? `¥${p.value.toLocaleString()}` : p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function CityBranch() {
  const [selected, setSelected] = useState<number>(1);
  const detail = cities.find(c => c.id === selected)!;
  const totalRevenue = cities.reduce((s, c) => s + c.monthlyRevenue, 0);
  const totalMembers = cities.reduce((s, c) => s + c.members, 0);

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, letterSpacing: "0.05em", fontFamily: "monospace" }}>城市分站管理</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理各城市区域负责人、会员、群组和运营状态</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, border: "none", fontFamily: "monospace" }}>
          <Plus size={13} /> 新建分站
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "分站总数", value: cities.length, icon: MapPin },
          { label: "全国总会员", value: totalMembers.toLocaleString(), icon: Users },
          { label: "本月总营收", value: `¥${(totalRevenue / 10000).toFixed(0)}万`, icon: BarChart2 },
          { label: "月均增长率", value: `+${Math.round(cities.filter(c => c.revenueGrowth > 0).reduce((s, c) => s + c.revenueGrowth, 0) / cities.filter(c => c.revenueGrowth > 0).length)}%`, icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="px-3 py-3 flex items-center gap-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: S.accent, borderRadius: S.radiusSm }}>
              <s.icon size={18} style={{ color: "#ffffff" }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{s.label}</div>
              <div className="text-xl font-bold mt-0.5" style={{ color: S.text, fontFamily: "monospace" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* City cards */}
        <div className="flex-1 grid grid-cols-2 gap-3 overflow-auto content-start" style={{ maxHeight: "calc(100vh - 320px)" }}>
          {cities.map(c => {
            const st = statusConfig[c.status];
            const isSelected = selected === c.id;
            return (
              <div
                key={c.id}
                className="p-4 cursor-pointer transition-all"
                style={{
                  background: isSelected ? S.accentMid : S.surface,
                  border: `1px solid ${isSelected ? S.accent : S.border}`,
                  borderLeft: isSelected ? `3px solid ${S.accent}` : `1px solid ${S.border}`,
                  borderRadius: S.radius,
                  boxShadow: isSelected ? "0 4px 16px rgba(59,130,246,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
                onClick={() => setSelected(c.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={getAvatar(c.id - 1)} alt={c.manager} style={{ width: 36, height: 36, borderRadius: S.radiusSm, objectFit: "cover" }} />
                    <div>
                      <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{c.city}</div>
                      <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{c.manager}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold" style={{ background: st.bg, color: st.color, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{c.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="px-2 py-1.5 text-center" style={{ background: isSelected ? "#1e293b" : "#f1f5f9", borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>
                    <div className="text-xs font-bold" style={{ color: isSelected ? S.accent : S.text, fontFamily: "monospace" }}>{c.members}</div>
                    <div className="text-xs" style={{ color: isSelected ? S.mutedLight : S.muted, fontSize: "10px", fontFamily: "monospace" }}>总会员</div>
                  </div>
                  <div className="px-2 py-1.5 text-center" style={{ background: isSelected ? "#1e293b" : "#f1f5f9", borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}>
                    <div className="text-xs font-bold" style={{ color: isSelected ? S.accent : S.text, fontFamily: "monospace" }}>{c.groups}</div>
                    <div className="text-xs" style={{ color: isSelected ? S.mutedLight : S.muted, fontSize: "10px", fontFamily: "monospace" }}>活跃群</div>
                  </div>
                  <div className="px-2 py-1.5 text-center" style={{ background: S.accent, borderRadius: S.radiusSm, border: `1px solid rgba(15,23,42,0.06)` }}>
                    <div className="text-xs font-bold" style={{ color: "#ffffff", fontFamily: "monospace" }}>¥{(c.monthlyRevenue / 10000).toFixed(1)}万</div>
                    <div className="text-xs" style={{ color: "#333", fontSize: "10px", fontFamily: "monospace" }}>本月营收</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ fontFamily: "monospace" }}>
                  <div className="flex items-center gap-1" style={{ color: c.revenueGrowth >= 0 ? S.textSec : S.muted }}>
                    {c.revenueGrowth >= 0 ? <ArrowUp size={11} /> : <TrendingDown size={11} />}
                    <span>营收 {c.revenueGrowth >= 0 ? "+" : ""}{c.revenueGrowth}%</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: S.textSec }}>
                    {c.memberGrowth >= 0 ? <ArrowUp size={11} /> : <TrendingDown size={11} />}
                    <span>会员 {c.memberGrowth >= 0 ? "+" : ""}{c.memberGrowth}%</span>
                  </div>
                  <button className="flex items-center gap-0.5 text-xs font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>
                    详情 <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3 mb-3">
              <img src={getAvatar(detail.id - 1)} alt={detail.manager} style={{ width: 40, height: 40, borderRadius: S.radiusSm, objectFit: "cover" }} />
              <div>
                <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{detail.city}分站</div>
                <div className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>负责人：{detail.manager}</div>
              </div>
            </div>

            {[["联系方式", detail.phone], ["PRO会员", `${detail.proMembers} 人`], ["微信账号", `${detail.wechats} 个`], ["活跃群组", `${detail.groups} 个`]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
                <span className="text-xs" style={{ color: S.muted, fontFamily: "monospace" }}>{k}</span>
                <span className="text-xs font-bold" style={{ color: S.textSec, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 flex-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-sm font-bold mb-3" style={{ color: S.text, fontFamily: "monospace" }}>近4月趋势</div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={detail.monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: S.muted, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: S.muted, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="m2" name="会员数" fill={S.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-col gap-2">
              <button className="w-full py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, border: "none", fontFamily: "monospace" }}>查看分站详情</button>
              <button className="w-full py-2 text-xs font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: S.radius, border: "none", fontFamily: "monospace" }}>联系负责人</button>
              <button className="w-full py-2 text-xs font-bold" style={{ background: S.surface, color: S.text, borderRadius: S.radius, border: `1px solid ${S.borderMed}`, fontFamily: "monospace" }}>导出月报</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
