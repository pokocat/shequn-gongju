import { useState } from "react";
import { ChevronRight, Users, Globe, Layers, Zap, TrendingUp, Plus, Settings, ArrowRight, Building2, Package, LayoutDashboard, CheckCircle } from "lucide-react";

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

// ─── 四层架构定义 ─────────────────────────────────────────────
const tiers = [
  {
    id: "super",
    level: 1,
    label: "超级生态",
    sublabel: "Super Ecosystem",
    icon: Zap,
    desc: "最顶层的生态体系，统一管理所有下属生态、平台和资源。拥有全局数据视角和最高权限。",
    role: "平台创始人 / 超级管理员",
    count: 1,
    metrics: [
      { label: "下属生态数", value: "3" },
      { label: "SaaS平台数", value: "7" },
      { label: "项目总数",   value: "24" },
      { label: "全局用户数", value: "12,847" },
    ],
  },
  {
    id: "eco",
    level: 2,
    label: "生态",
    sublabel: "Ecosystem",
    icon: Globe,
    desc: "垂直领域生态体系，聚焦特定行业或场景。管理旗下多个 SaaS 平台和资源池，形成闭环生态。",
    role: "生态负责人 / 联合创始人",
    count: 3,
    metrics: [
      { label: "下属SaaS平台", value: "7" },
      { label: "活跃项目",    value: "24" },
      { label: "生态会员",    value: "8,320" },
      { label: "月营收",      value: "¥84万" },
    ],
  },
  {
    id: "saas",
    level: 3,
    label: "SaaS 平台",
    sublabel: "SaaS Platform",
    icon: Package,
    desc: "向下属项目提供私域社群管理工具的软件平台。包含账号资产、社群管理、用户运营、订单工单等核心能力。",
    role: "平台运营负责人 / 产品经理",
    count: 7,
    metrics: [
      { label: "服务项目数", value: "24" },
      { label: "平台用户",  value: "6,120" },
      { label: "活跃群组",  value: "187" },
      { label: "本月工单",  value: "342" },
    ],
  },
  {
    id: "platform",
    level: 4,
    label: "平台",
    sublabel: "Platform / Project",
    icon: LayoutDashboard,
    desc: "使用私域社群工具的具体项目。每个平台拥有独立的用户群体、微信群、服务老师和运营数据，通过 SaaS 层统一管理。",
    role: "项目负责人 / 区域运营 / 客服",
    count: 24,
    metrics: [
      { label: "本项目用户", value: "1,623" },
      { label: "活跃群组",  value: "34" },
      { label: "服务老师",  value: "12" },
      { label: "本月营收",  value: "¥51.6万" },
    ],
  },
];

// ─── 生态列表数据 ─────────────────────────────────────────────
const ecosystems = [
  { id: 1, name: "蜂乐玛健康生态", desc: "以大健康为核心，整合营养、运动、身心灵多个赛道", platforms: 3, projects: 10, members: 4820, revenue: "¥42万/月", status: "主力生态" },
  { id: 2, name: "蜂乐玛教育生态", desc: "在线教育与实体培训融合的知识生态体系",              platforms: 2, projects: 8,  members: 2310, revenue: "¥28万/月", status: "成长中" },
  { id: 3, name: "蜂乐玛商业生态", desc: "面向B端的代理、分销与城市合伙人体系",              platforms: 2, projects: 6,  members: 1190, revenue: "¥14万/月", status: "孵化中" },
];

// ─── SaaS 平台列表 ───────────────────────────────────────────
const saasPlatforms = [
  { id: 1, name: "蜂乐玛私域工具",    eco: "蜂乐玛健康生态", desc: "私域账号资产 + 微信社群 + 用户服务 + 订单工单一体化系统", projects: 4, users: 1623, groups: 34,  status: "生产中", isCurrent: true  },
  { id: 2, name: "蜂乐玛课程平台",    eco: "蜂乐玛健康生态", desc: "在线课程管理、学员互动与结业认证",                         projects: 3, users: 2100, groups: 18,  status: "生产中", isCurrent: false },
  { id: 3, name: "蜂乐玛代理系统",    eco: "蜂乐玛健康生态", desc: "代理商招募、培训、分销与佣金结算",                         projects: 3, users: 890,  groups: 12,  status: "生产中", isCurrent: false },
  { id: 4, name: "蜂乐玛学习平台",    eco: "蜂乐玛教育生态", desc: "自主学习路径、积分激励与学习报告",                         projects: 4, users: 1560, groups: 22,  status: "测试中", isCurrent: false },
  { id: 5, name: "蜂乐玛直播工具",    eco: "蜂乐玛教育生态", desc: "在线直播、回放管理与观看数据分析",                         projects: 4, users: 750,  groups: 8,   status: "开发中", isCurrent: false },
  { id: 6, name: "蜂乐玛城市合伙人",  eco: "蜂乐玛商业生态", desc: "城市站长招募、资源分配与业绩追踪",                         projects: 3, users: 430,  groups: 15,  status: "测试中", isCurrent: false },
  { id: 7, name: "蜂乐玛分销系统",    eco: "蜂乐玛商业生态", desc: "多级分销、佣金计算与实时结算",                             projects: 3, users: 760,  groups: 10,  status: "生产中", isCurrent: false },
];

// ─── 项目/平台列表 ───────────────────────────────────────────
const projects = [
  { id: 1, name: "蜂乐玛PRO会员",   saas: "蜂乐玛私域工具", eco: "健康生态", users: 1023, groups: 12, teacher: "吴思远/林小燕", cities: ["北京","上海","深圳"], revenue: "¥28万/月", status: "主力项目" },
  { id: 2, name: "蜂乐玛体验官",   saas: "蜂乐玛私域工具", eco: "健康生态", users: 387,  groups: 8,  teacher: "刘刚/李梦华",    cities: ["广州","成都","杭州"], revenue: "¥12万/月", status: "增长中" },
  { id: 3, name: "蜂乐玛代理商",   saas: "蜂乐玛私域工具", eco: "健康生态", users: 134,  groups: 6,  teacher: "赵志远",          cities: ["全国"],               revenue: "¥7万/月",  status: "稳定运营" },
  { id: 4, name: "蜂乐玛城市分站", saas: "蜂乐玛私域工具", eco: "健康生态", users: 79,   groups: 8,  teacher: "陈明/王芳",       cities: ["武汉","南京","西安"],  revenue: "¥4.6万/月",status: "孵化中" },
  { id: 5, name: "蜂乐玛7日训练营",saas: "蜂乐玛课程平台", eco: "健康生态", users: 450,  groups: 5,  teacher: "课程组",          cities: ["线上"],               revenue: "¥6万/月",  status: "季节性" },
  { id: 6, name: "蜂乐玛健康学院", saas: "蜂乐玛学习平台", eco: "教育生态", users: 820,  groups: 10, teacher: "教研团队",        cities: ["线上"],               revenue: "¥15万/月", status: "主力项目" },
];

const statusCfg: Record<string, { bg: string; color: string }> = {
  "主力项目": { bg: S.accent,            color: "#000" },
  "主力生态": { bg: S.accent,            color: "#000" },
  "增长中":   { bg: S.accent,            color: "#000" },
  "成长中":   { bg: S.accentLight,       color: "#0d0d0d" },
  "稳定运营": { bg: "#f0f0ec",           color: "#555" },
  "孵化中":   { bg: "#f0f0ec",           color: "#555" },
  "季节性":   { bg: "#f0f0ec",           color: "#555" },
  "生产中":   { bg: S.accent,            color: "#000" },
  "测试中":   { bg: "#ffd600",           color: "#000" },
  "开发中":   { bg: "#f0f0ec",           color: "#555" },
};

// ─── 架构流程图 ───────────────────────────────────────────────
function ArchitectureDiagram({ activeTier, onSelect }: { activeTier: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-stretch gap-0 overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {tiers.map((t, idx) => {
        const Icon = t.icon;
        const isActive = activeTier === t.id;
        return (
          <button
            key={t.id}
            className="flex-1 flex flex-col items-start gap-3 p-5 transition-all relative"
            style={{
              background: isActive ? S.accentLight : S.surface,
              borderRight: idx < 3 ? `1px solid ${S.border}` : "none",
              borderRadius: 0,
              borderBottom: isActive ? `3px solid ${S.accent}` : "3px solid transparent",
            }}
            onClick={() => onSelect(t.id)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: isActive ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: isActive ? S.accent : S.textSec, borderRadius: S.radiusSm }}>
                {t.level}
              </div>
              <span className="text-xs font-mono" style={{ color: S.muted }}>{t.sublabel}</span>
              {idx < 3 && <ArrowRight size={14} className="ml-auto" style={{ color: S.muted }} />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={18} style={{ color: isActive ? "#0d0d0d" : S.muted }} />
                <span className="text-sm font-bold" style={{ color: S.text }}>{t.label}</span>
              </div>
              <p className="text-xs leading-relaxed font-mono" style={{ color: S.muted }}>{t.desc.slice(0, 48)}...</p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: isActive ? "#0d0d0d" : "rgba(0,0,0,0.06)", color: isActive ? S.accent : S.textSec, borderRadius: S.radiusSm }}>
                {t.count} 个
              </span>
              <span className="text-xs font-mono" style={{ color: S.muted }}>当前</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── 超级生态视图 ─────────────────────────────────────────────
function SuperView() {
  const total = { ecosystems: 3, saas: 7, projects: 24, users: 12847, revenue: "¥142万", groups: 187 };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "下属生态", value: total.ecosystems },
          { label: "SaaS平台", value: total.saas },
          { label: "运营项目", value: total.projects },
          { label: "全局用户", value: total.users.toLocaleString() },
          { label: "全局群组", value: total.groups },
          { label: "总月营收", value: total.revenue },
        ].map(s => (
          <div key={s.label} className="px-3 py-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="text-xs font-mono" style={{ color: S.muted }}>{s.label}</div>
            <div className="text-xl font-bold mt-0.5" style={{ color: S.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: "#0d0d0d" }} />
          <span className="text-sm font-bold" style={{ color: S.text }}>超级生态 · 蜂乐玛</span>
          <span className="px-2 py-0.5 text-xs font-bold ml-2" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>最高层级</span>
        </div>
        <p className="text-xs leading-relaxed mb-4 font-mono" style={{ color: S.textSec }}>
          蜂乐玛超级生态是整个体系的最顶层。统一管理旗下所有生态、SaaS 平台和具体项目。拥有全局数据视角、最高级权限、多租户管控和生态资源调配能力。
          每个下属生态都是一个独立的业务闭环，通过 SaaS 平台层共享私域社群管理工具。
        </p>
        <div className="flex gap-2 flex-wrap">
          {["全局数据看板", "跨生态权限管理", "多租户隔离", "统一账号资产", "生态营收汇总"].map(t => (
            <span key={t} className="px-2.5 py-1 text-xs font-bold font-mono" style={{ background: S.accentLight, color: "#0d0d0d", borderRadius: S.radiusSm, border: `1px solid rgba(204,255,0,0.3)` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 生态视图 ─────────────────────────────────────────────────
function EcoView() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: S.text }}>旗下生态 ({ecosystems.length})</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
          <Plus size={12} /> 创建生态
        </button>
      </div>
      {ecosystems.map(e => (
        <div
          key={e.id}
          className="p-4 cursor-pointer transition-all"
          style={{
            background: selected === e.id ? S.accentLight : S.surface,
            border: `1px solid ${S.border}`,
            borderLeft: selected === e.id ? `3px solid ${S.accent}` : `3px solid transparent`,
            borderRadius: S.radius,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
          onClick={() => setSelected(selected === e.id ? null : e.id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radius }}>
              {e.name[3]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: S.text }}>{e.name}</span>
                <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusCfg[e.status]?.bg, color: statusCfg[e.status]?.color, borderRadius: S.radiusSm }}>{e.status}</span>
              </div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>{e.desc}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center flex-shrink-0">
              {[["SaaS平台", e.platforms], ["运营项目", e.projects], ["生态会员", e.members.toLocaleString()], ["月营收", e.revenue]].map(([l, v]) => (
                <div key={l as string} className="px-3 py-1.5" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold font-mono" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <ChevronRight size={16} style={{ color: S.muted, transform: selected === e.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </div>

          {selected === e.id && (
            <div className="mt-4 pt-4 flex gap-2" style={{ borderTop: `1px solid ${S.border}` }}>
              {["查看详情", "SaaS平台", "项目列表", "权限设置", "数据报表"].map(a => (
                <button key={a} className="px-3 py-1.5 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }}>{a}</button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SaaS 平台视图 ────────────────────────────────────────────
function SaasView() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: S.text }}>SaaS 平台 ({saasPlatforms.length})</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
          <Plus size={12} /> 新建平台
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {saasPlatforms.map(p => (
          <div
            key={p.id}
            className="p-4 relative"
            style={{
              background: p.isCurrent ? S.accentLight : S.surface,
              border: p.isCurrent ? `2px solid rgba(204,255,0,0.5)` : `1px solid ${S.border}`,
              borderRadius: S.radius,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {p.isCurrent && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5" style={{ background: "#0d0d0d", borderRadius: S.radiusSm }}>
                <CheckCircle size={10} style={{ color: S.accent }} />
                <span style={{ color: S.accent, fontSize: "10px", fontFamily: "monospace" }}>当前系统</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} style={{ color: p.isCurrent ? "#0d0d0d" : S.muted }} />
              <span className="text-sm font-bold" style={{ color: S.text }}>{p.name}</span>
            </div>
            <div className="text-xs mb-3 font-mono" style={{ color: S.muted }}>{p.desc}</div>
            <div className="text-xs mb-3 font-mono font-bold" style={{ color: S.text }}>所属：{p.eco}</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[["项目数", p.projects], ["用户数", p.users.toLocaleString()], ["群组数", p.groups]].map(([l, v]) => (
                <div key={l as string} className="px-2 py-1.5 text-center" style={{ background: "#f7f7f7", border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
                  <div className="text-xs font-bold" style={{ color: S.text }}>{v}</div>
                  <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span>
              <button className="flex items-center gap-1 text-xs font-bold" style={{ color: S.text }}>
                进入管理 <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 平台/项目视图 ────────────────────────────────────────────
function ProjectView() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: S.text }}>使用私域社群工具的项目 ({projects.length})</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>全部生态</button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
            <Plus size={12} /> 接入新项目
          </button>
        </div>
      </div>

      <div className="overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555555", borderRadius: `${S.radius} ${S.radius} 0 0` }}>
          {([["项目名称",200],["SaaS平台",130],["所属生态",90],["用户数",70],["群组数",70],["服务老师",120],["覆盖城市",160],["月营收",90],["状态",90],["操作",80]] as [string,number][]).map(([l,w]) => (
            <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>
          ))}
        </div>
        {projects.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono"
            style={{
              background: selected === p.id ? S.accentLight : idx % 2 === 0 ? "#ffffff" : "#fafaf8",
              borderBottom: `1px solid ${S.border}`,
              borderLeft: selected === p.id ? `3px solid ${S.accent}` : "3px solid transparent",
            }}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
          >
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 200 }}>
              <div className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
                {p.name[3]}
              </div>
              <span className="font-bold" style={{ color: S.text }}>{p.name}</span>
            </div>
            <div className="flex-shrink-0" style={{ width: 130, color: S.muted }}>{p.saas}</div>
            <div className="flex-shrink-0" style={{ width: 90, color: S.muted }}>{p.eco}</div>
            <div className="flex-shrink-0 font-bold" style={{ width: 70, color: S.text }}>{p.users.toLocaleString()}</div>
            <div className="flex-shrink-0" style={{ width: 70, color: S.muted }}>{p.groups} 个</div>
            <div className="flex-shrink-0" style={{ width: 120, color: S.muted }}>{p.teacher}</div>
            <div className="flex-shrink-0" style={{ width: 160 }}>
              <div className="flex flex-wrap gap-1">
                {p.cities.map(c => (
                  <span key={c} className="px-1.5 py-0.5 font-bold" style={{ background: "#0d0d0d", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 font-bold" style={{ width: 90, color: S.text }}>{p.revenue}</div>
            <div className="flex-shrink-0" style={{ width: 90 }}>
              <span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span>
            </div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 80 }}>
              <button className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={e => e.stopPropagation()}>进入</button>
              <button className="px-1.5 py-1" style={{ background: "#f7f7f7", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={e => e.stopPropagation()}>
                <Settings size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 说明卡 */}
      <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
        <LayoutDashboard size={18} style={{ color: "#0d0d0d", marginTop: 1, flexShrink: 0 }} />
        <div>
          <div className="text-sm font-bold mb-1" style={{ color: S.text }}>什么是「平台」？</div>
          <p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>
            平台（Project）是使用本私域社群管理工具的最小运营单元。每个平台拥有独立的用户群体、微信群组、服务老师配置和运营数据。
            上方系统的「账号资产」「微信管理」「社群管理」「用户操作台」等全部模块，均面向平台级别的日常运营工作。
            平台通过 SaaS 层接入工具能力，数据在生态层汇总，最终归属于超级生态统一管理。
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────
export default function EcosystemManagement() {
  const [activeTier, setActiveTier] = useState("super");
  const tier = tiers.find(t => t.id === activeTier)!;

  return (
    <div className="p-6 h-full flex flex-col gap-5 overflow-auto" style={{ background: S.bg, fontFamily: "monospace" }}>
      {/* 页头 */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="font-bold" style={{ color: S.text, letterSpacing: "0.05em" }}>生态架构管理</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: S.muted }}>
            四层生态架构：超级生态 → 生态 → SaaS 平台 → 平台（项目），当前系统属于 SaaS 平台层，为各平台项目提供私域社群管理能力
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <div className="w-2 h-2" style={{ background: S.accent, borderRadius: "50%" }} />
          <span className="text-xs font-mono" style={{ color: S.muted }}>当前：</span>
          <span className="text-xs font-bold font-mono" style={{ color: S.text }}>SaaS 平台 · 蜂乐玛私域工具</span>
        </div>
      </div>

      {/* 四层架构图 */}
      <ArchitectureDiagram activeTier={activeTier} onSelect={setActiveTier} />

      {/* 当前层级说明条 */}
      <div className="flex items-center gap-4 px-4 py-3 flex-shrink-0" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}>
        <tier.icon size={16} style={{ color: "#0d0d0d", flexShrink: 0 }} />
        <div className="flex-1">
          <span className="text-sm font-bold" style={{ color: S.text }}>第 {tier.level} 层：{tier.label}</span>
          <span className="text-xs ml-3 font-mono" style={{ color: S.muted }}>{tier.desc}</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {tier.metrics.map(m => (
            <div key={m.label} className="text-center">
              <div className="text-sm font-bold" style={{ color: S.text }}>{m.value}</div>
              <div className="font-mono" style={{ color: S.muted, fontSize: "10px" }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 px-3 py-1.5 text-xs font-bold font-mono" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>
          {tier.role}
        </div>
      </div>

      {/* 层级内容 */}
      <div className="flex-1">
        {activeTier === "super"    && <SuperView />}
        {activeTier === "eco"      && <EcoView />}
        {activeTier === "saas"     && <SaasView />}
        {activeTier === "platform" && <ProjectView />}
      </div>
    </div>
  );
}
