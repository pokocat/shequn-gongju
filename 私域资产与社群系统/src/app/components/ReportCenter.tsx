import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Download, ArrowUp, ArrowDown } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const COLORS = [S.accent, "#1e293b", "#808080", "#b0b0b0", "#d0d0d0", "#3d3d3d", "rgba(204,255,0,0.5)"];

const revenueData = [
  { month: "1月", revenue: 28.4, users: 890 },
  { month: "2月", revenue: 31.2, users: 1020 },
  { month: "3月", revenue: 38.6, users: 1180 },
  { month: "4月", revenue: 42.1, users: 1290 },
  { month: "5月", revenue: 45.7, users: 1450 },
  { month: "6月", revenue: 49.3, users: 1540 },
  { month: "7月", revenue: 51.6, users: 1623 },
];

const channelPie = [
  { name: "微信私域", value: 42 },
  { name: "抖音引流", value: 28 },
  { name: "朋友圈广告", value: 15 },
  { name: "老带新", value: 10 },
  { name: "其他", value: 5 },
];

const dailyUserData = [
  { day: "7/1", new: 67, active: 890, churned: 12 },
  { day: "7/2", new: 45, active: 920, churned: 8 },
  { day: "7/3", new: 73, active: 960, churned: 15 },
  { day: "7/4", new: 89, active: 1010, churned: 11 },
  { day: "7/5", new: 94, active: 1050, churned: 9 },
  { day: "7/6", new: 58, active: 1080, churned: 13 },
  { day: "7/7", new: 82, active: 1120, churned: 7 },
];

const cityData = [
  { city: "北京", revenue: 16.2, users: 420, groups: 12, growth: 15.3, arpu: 3857 },
  { city: "上海", revenue: 13.8, users: 380, groups: 10, growth: 12.1, arpu: 3632 },
  { city: "深圳", revenue: 9.3, users: 310, groups: 8, growth: 18.7, arpu: 3000 },
  { city: "广州", revenue: 8.7, users: 290, groups: 7, growth: 9.4, arpu: 3000 },
  { city: "成都", revenue: 5.4, users: 180, groups: 5, growth: 22.6, arpu: 3000 },
  { city: "杭州", revenue: 4.2, users: 140, groups: 4, growth: 14.8, arpu: 3000 },
];

const projectData = [
  { month: "2月", pro: 18.2, experience: 6.4, agent: 4.1, city: 2.8 },
  { month: "3月", pro: 22.6, experience: 7.8, agent: 5.3, city: 3.2 },
  { month: "4月", pro: 26.1, experience: 8.2, agent: 5.8, city: 3.6 },
  { month: "5月", pro: 28.4, experience: 9.1, agent: 6.2, city: 4.0 },
  { month: "6月", pro: 30.8, experience: 9.7, agent: 6.8, city: 4.4 },
  { month: "7月", pro: 32.4, experience: 10.2, agent: 7.1, city: 4.8 },
];

const projectMetrics = [
  { name: "PRO会员", revenue: "¥32.4万", users: 1023, arpu: "¥3168", retention: "87.2%", growth: "+11.3%" },
  { name: "体验官", revenue: "¥10.2万", users: 387, arpu: "¥2635", retention: "72.4%", growth: "+8.6%" },
  { name: "代理商", revenue: "¥7.1万", users: 134, arpu: "¥5299", retention: "91.3%", growth: "+14.7%" },
  { name: "城市分站", revenue: "¥4.8万", users: 28, arpu: "¥17143", retention: "96.4%", growth: "+22.4%" },
];

const channelFunnel = [
  { stage: "曝光", count: 48600, pct: 100 },
  { stage: "点击", count: 12340, pct: 25.4 },
  { stage: "加微信", count: 4820, pct: 9.9 },
  { stage: "入群", count: 2640, pct: 5.4 },
  { stage: "下单", count: 509, pct: 1.0 },
];

const channelDetail = [
  { name: "微信私域", users: 682, revenue: "¥21.7万", conv: "8.2%", arpu: "¥3182" },
  { name: "抖音引流", users: 454, revenue: "¥14.4万", conv: "3.1%", arpu: "¥3172" },
  { name: "朋友圈广告", users: 243, revenue: "¥7.7万", conv: "2.4%", arpu: "¥3169" },
  { name: "老带新", users: 162, revenue: "¥5.2万", conv: "12.6%", arpu: "¥3210" },
  { name: "其他", users: 82, revenue: "¥2.6万", conv: "1.8%", arpu: "¥3171" },
];

const DATE_RANGES = ["本月", "上月", "近3月", "近6月", "本年"];
const TABS = ["概览报表", "城市分析", "项目报表", "渠道来源"];

const Tip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="px-3 py-2 text-xs" style={{ background: S.surface, border: `1px solid ${S.borderMed}`, color: S.text, borderRadius: S.radiusSm, fontFamily: "monospace", boxShadow: "0 4px 12px rgba(15,23,42,0.06)" }}>
      <div className="font-bold mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: S.textSec }}>{p.name}: {p.value}</div>
      ))}
    </div>
  ) : null;

function KpiCard({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="text-xs mb-2 font-mono" style={{ color: S.muted }}>{label}</div>
      <div className="text-2xl font-bold mb-2" style={{ color: S.text, fontFamily: "monospace" }}>{value}</div>
      <div className="flex items-center gap-1 text-xs font-bold font-mono" style={{ color: up ? S.textSec : S.muted }}>
        {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {delta} 较上期
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        <KpiCard label="本月总营收" value="¥51.6万" delta="+13.2%" up={true} />
        <KpiCard label="新增用户" value="1,623" delta="+8.4%" up={true} />
        <KpiCard label="订单数" value="509" delta="+5.6%" up={true} />
        <KpiCard label="均客单价" value="¥1,014" delta="+7.1%" up={true} />
        <KpiCard label="退款率" value="3.1%" delta="-0.8%" up={false} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>营收与用户趋势</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Line yAxisId="left"  type="monotone" dataKey="revenue" name="营收(万)" stroke={S.accent} strokeWidth={2.5} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="users"   name="用户数"  stroke="#1e293b" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>渠道来源分布</div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={channelPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {channelPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {channelPie.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS[i % COLORS.length], border: `1px solid ${S.border}`, borderRadius: "3px" }} />
                    <span style={{ color: S.textSec }}>{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: S.text }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>近7日用户增长</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyUserData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="new" name="新增" fill={S.accent} radius={[4, 4, 0, 0]} />
            <Bar dataKey="churned" name="流失" fill="#1e293b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CityTab() {
  const [sortCol, setSortCol] = useState<string>("revenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...cityData].sort((a: any, b: any) => {
    const av = a[sortCol], bv = b[sortCol];
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const maxRevenue = Math.max(...cityData.map(c => c.revenue));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>城市营收对比</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => `¥${v}万`} />
              <Bar dataKey="revenue" name="营收(万)" fill={S.accent} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>城市增长率排名</div>
          <div className="space-y-3">
            {[...cityData].sort((a, b) => b.growth - a.growth).map((city, i) => (
              <div key={city.city}>
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: i < 3 ? "#1e293b" : "#f1f5f9", color: i < 3 ? S.accent : S.textSec, borderRadius: S.radiusSm }}>{i + 1}</span>
                    <span style={{ color: S.textSec, fontFamily: "monospace" }}>{city.city}</span>
                  </div>
                  <span className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>+{city.growth}%</span>
                </div>
                <div className="h-1.5" style={{ background: "#f1f5f9", borderRadius: "99px" }}>
                  <div className="h-full" style={{ width: `${(city.growth / 25) * 100}%`, background: i < 3 ? S.accent : S.mutedLight, borderRadius: "99px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>城市数据明细</div>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1e293b" }}>
              {[
                { key: "city", label: "城市" },
                { key: "revenue", label: "本月营收" },
                { key: "users", label: "用户数" },
                { key: "groups", label: "活跃群组" },
                { key: "growth", label: "环比增长" },
                { key: "arpu", label: "人均贡献" },
              ].map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-bold cursor-pointer select-none font-mono"
                  style={{ color: "#475569" }}
                  onClick={() => col.key !== "city" && handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key && (
                      <span style={{ color: S.accent }}>{sortDir === "desc" ? "↓" : "↑"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((city, i) => (
              <tr key={city.city}
                style={{ borderTop: `1px solid ${S.border}` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color: S.text, fontFamily: "monospace" }}>{city.city}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text, fontFamily: "monospace" }}>
                  <div className="flex items-center gap-2">
                    ¥{city.revenue}万
                    <div className="h-1.5 w-16" style={{ background: "#f1f5f9", borderRadius: "99px" }}>
                      <div className="h-full" style={{ width: `${(city.revenue / maxRevenue) * 100}%`, background: S.accent, borderRadius: "99px" }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>{city.users}人</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>{city.groups}个</td>
                <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color: S.text, fontFamily: "monospace" }}>+{city.growth}%</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>¥{city.arpu.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {projectMetrics.map(p => (
          <div key={p.name} className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{p.name}</div>
              <span className="text-xs px-2 py-0.5 font-bold" style={{ background: S.accent, color: S.onPrimary, borderRadius: S.radiusSm, fontFamily: "monospace" }}>{p.growth}</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs font-mono" style={{ color: S.muted }}>营收</div>
                <div className="text-xl font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{p.revenue}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "用户数", value: p.users + "人" },
                  { label: "ARPU", value: p.arpu },
                  { label: "留存率", value: p.retention },
                ].map(m => (
                  <div key={m.label}>
                    <div className="text-[10px] font-mono" style={{ color: S.mutedLight }}>{m.label}</div>
                    <div className="text-xs font-bold font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>各项目营收趋势</div>
        <div className="flex gap-4 mb-4">
          {[
            { key: "pro", label: "PRO会员", color: S.accent },
            { key: "experience", label: "体验官", color: "#1e293b" },
            { key: "agent", label: "代理商", color: "#808080" },
            { key: "city", label: "城市分站", color: "#b0b0b0" },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: S.textSec }}>
              <div className="w-3 h-0.5" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={projectData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: S.muted, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="pro" name="PRO会员" stroke={S.accent} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="experience" name="体验官" stroke="#1e293b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="agent" name="代理商" stroke="#808080" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="city" name="城市分站" stroke="#b0b0b0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChannelTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>渠道用户分布</div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={channelPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {channelPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {channelPie.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS[i % COLORS.length], border: `1px solid ${S.border}`, borderRadius: "3px" }} />
                    <span style={{ color: S.textSec, fontFamily: "monospace" }}>{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="text-sm font-bold mb-4" style={{ color: S.text, fontFamily: "monospace" }}>转化漏斗</div>
          <div className="space-y-3">
            {channelFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <span style={{ color: S.textSec, fontFamily: "monospace" }}>{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{stage.count.toLocaleString()}</span>
                    <span style={{ color: S.muted, fontFamily: "monospace" }}>({stage.pct}%)</span>
                  </div>
                </div>
                <div className="h-6 overflow-hidden" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}>
                  <div className="h-full flex items-center px-2 text-[10px] font-bold font-mono transition-all"
                    style={{
                      width: `${stage.pct}%`,
                      background: i === 0 ? S.accent : i === 1 ? "rgba(204,255,0,0.5)" : i === 2 ? "#1e293b" : "#3d3d3d",
                      color: i === 0 || i === 1 ? "#ffffff" : "#ffffff",
                      borderRadius: S.radiusSm,
                      fontFamily: "monospace",
                    }}>
                    {stage.pct >= 5 ? `${stage.pct}%` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>渠道明细</div>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1e293b" }}>
              {["渠道名称", "用户数", "营收", "转化率", "ARPU"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold font-mono" style={{ color: "#475569", fontFamily: "monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channelDetail.map((ch, i) => (
              <tr key={ch.name}
                style={{ borderTop: `1px solid ${S.border}` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,255,0,0.06)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS[i % COLORS.length], border: `1px solid ${S.border}`, borderRadius: "3px" }} />
                    <span className="text-sm font-bold font-mono" style={{ color: S.text, fontFamily: "monospace" }}>{ch.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>{ch.users}人</td>
                <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color: S.text, fontFamily: "monospace" }}>{ch.revenue}</td>
                <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color: S.text, fontFamily: "monospace" }}>{ch.conv}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textSec, fontFamily: "monospace" }}>{ch.arpu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReportCenter() {
  useThemeSingleton();
const [dateRange, setDateRange] = useState("本月");
  const [activeTab, setActiveTab] = useState("概览报表");

  return (
    <div className="p-6 space-y-5" style={{ background: S.bg, fontFamily: "monospace", minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: S.text, fontFamily: "monospace" }}>数据报表中心</h1>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>全面掌握业务数据，驱动增长决策</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radius }}>
            {DATE_RANGES.map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: dateRange === r ? "#1e293b" : S.surface,
                  color: dateRange === r ? S.accent : S.muted,
                  borderRight: r !== "本年" ? `1px solid ${S.border}` : "none",
                  fontFamily: "monospace",
                }}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold"
            style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, border: "none", fontFamily: "monospace" }}>
            <Download size={14} /> 导出报表
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-bold transition-all"
            style={{
              background: activeTab === tab ? "#1e293b" : "transparent",
              color: activeTab === tab ? S.accent : S.muted,
              borderRadius: S.radiusSm,
              fontFamily: "monospace",
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "概览报表" && <OverviewTab />}
      {activeTab === "城市分析" && <CityTab />}
      {activeTab === "项目报表" && <ProjectTab />}
      {activeTab === "渠道来源" && <ChannelTab />}
    </div>
  );
}
