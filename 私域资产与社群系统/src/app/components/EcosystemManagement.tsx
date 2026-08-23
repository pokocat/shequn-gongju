import { useEffect, useState } from "react";
import { ChevronRight, Globe, Layers, Zap, TrendingUp, Plus, Settings, ArrowRight, Package, LayoutDashboard, CheckCircle, X, Save, ShieldCheck, MessageSquare, Eye, Building2, UsersRound, Workflow, SlidersHorizontal } from "lucide-react";
import { defaultGroupTypeRules, type GroupTypeRule } from "../data/projectGroupRules";
import { registerProjectRules, saveProjectRules, useCommunityData } from "../data/communityDataStore";

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
type ProjectTier = { name: string; rule: string; group: string; service: string };
type ProjectRecord = {
  id: number; name: string; saas: string; eco: string; users: number; groups: number; teacher: string; cities: string[]; revenue: string; status: string;
  enterpriseWx: string; enterpriseProjectCount: number; tiers: ProjectTier[];
  groupTypes: GroupTypeRule[];
  mechanism: { welcome: string; cadence: string; route: string; escalation: string };
  visibility: Record<string, boolean>;
};
const defaultTiers: ProjectTier[] = [
  { name: "普通会员", rule: "入群即享", group: "新客体验群", service: "48小时响应" },
  { name: "核心会员", rule: "累计消费 ¥1,000", group: "核心会员群", service: "24小时响应" },
  { name: "城市合伙人", rule: "完成认证", group: "城市合伙人群", service: "专属运营" },
];
const projects: ProjectRecord[] = [
  { id: 1, name: "蜂乐玛PRO会员", saas: "蜂乐玛私域工具", eco: "健康生态", users: 1023, groups: 12, teacher: "吴思远/林小燕", cities: ["北京","上海","深圳"], revenue: "¥28万/月", status: "主力项目", enterpriseWx: "蜂乐玛健康企业微信", enterpriseProjectCount: 3, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "欢迎语 + 入群任务", cadence: "每周 2 次", route: "按城市 + 会员等级分群", escalation: "异常自动通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": false } },
  { id: 2, name: "蜂乐玛体验官", saas: "蜂乐玛私域工具", eco: "健康生态", users: 387, groups: 8, teacher: "刘刚/李梦华", cities: ["广州","成都","杭州"], revenue: "¥12万/月", status: "增长中", enterpriseWx: "蜂乐玛健康企业微信", enterpriseProjectCount: 3, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "欢迎语 + 新人打卡", cadence: "每周 3 次", route: "按城市分群", escalation: "低活跃会员提醒客服" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": false } },
  { id: 3, name: "蜂乐玛代理商", saas: "蜂乐玛私域工具", eco: "健康生态", users: 134, groups: 6, teacher: "赵志远", cities: ["全国"], revenue: "¥7万/月", status: "稳定运营", enterpriseWx: "蜂乐玛商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "代理商欢迎流程", cadence: "每周 1 次", route: "按代理等级分群", escalation: "审批事项通知项目负责人" }, visibility: { "项目负责人": true, "区域运营": true, "客服": false, "生态负责人": true } },
  { id: 4, name: "蜂乐玛城市分站", saas: "蜂乐玛私域工具", eco: "健康生态", users: 79, groups: 8, teacher: "陈明/王芳", cities: ["武汉","南京","西安"], revenue: "¥4.6万/月", status: "孵化中", enterpriseWx: "蜂乐玛商务企业微信", enterpriseProjectCount: 2, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "城市站长欢迎流程", cadence: "每周 1 次", route: "按城市 + 等级分群", escalation: "跨城问题通知区域运营" }, visibility: { "项目负责人": true, "区域运营": true, "客服": true, "生态负责人": false } },
  { id: 5, name: "蜂乐玛7日训练营", saas: "蜂乐玛课程平台", eco: "健康生态", users: 450, groups: 5, teacher: "课程组", cities: ["线上"], revenue: "¥6万/月", status: "季节性", enterpriseWx: "蜂乐玛课程企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "训练营开营提醒", cadence: "每日 1 次", route: "按课程期次分群", escalation: "课程问题通知课程组" }, visibility: { "项目负责人": true, "区域运营": false, "客服": true, "生态负责人": false } },
  { id: 6, name: "蜂乐玛健康学院", saas: "蜂乐玛学习平台", eco: "教育生态", users: 820, groups: 10, teacher: "教研团队", cities: ["线上"], revenue: "¥15万/月", status: "主力项目", enterpriseWx: "蜂乐玛教育企业微信", enterpriseProjectCount: 1, tiers: defaultTiers, groupTypes: defaultGroupTypeRules, mechanism: { welcome: "学习路径欢迎语", cadence: "每周 2 次", route: "按课程 + 会员等级分群", escalation: "学习异常通知教研团队" }, visibility: { "项目负责人": true, "区域运营": false, "客服": true, "生态负责人": true } },
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

// ─── 项目/平台视图 ────────────────────────────────────────────
const fieldStyle = { background: "#fff", border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm, color: S.text, padding: "8px 10px", fontSize: 12, width: "100%" };
const roleNames = ["项目负责人", "区域运营", "客服", "生态负责人"];
const groupRuleRoleOptions = ["游客", "体验官", "VIP0", "VIP1", "VIP2", "VIP3", "VIP4", "SVIP0", "SVIP1", "SVIP2", "SVIP3", "SVIP4", "SVIP5", "普通会员", "核心会员", "城市合伙人"];
const groupRuleCityOptions = ["北京", "吉林", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "全国"];
type ProjectTab = "overview" | "tiers" | "groupRules" | "mechanism" | "visibility";

function GroupRulesEditor({ project, updateDraft }: { project: ProjectRecord; updateDraft: (updater: (current: ProjectRecord) => ProjectRecord) => void }) {
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});
  const updateRule = (idx: number, patch: Partial<GroupTypeRule>) => updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx ? { ...rule, ...patch } : rule) }));
  const toggleListValue = (idx: number, key: "cities" | "memberRoles", value: string) => updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx ? { ...rule, [key]: rule[key].includes(value) ? rule[key].filter(item => item !== value) : [...rule[key], value] } : rule) }));
  const addRole = (idx: number) => {
    const value = (roleDraft[String(idx)] || "").trim();
    if (!value) return;
    updateDraft(current => ({ ...current, groupTypes: current.groupTypes.map((rule, index) => index === idx && !rule.memberRoles.includes(value) ? { ...rule, memberRoles: [...rule.memberRoles.filter(role => role !== "待配置身份"), value] } : rule) }));
    setRoleDraft(current => ({ ...current, [idx]: "" }));
  };
  return <div className="space-y-2"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目群类型规则</div><p className="text-xs mt-1 leading-relaxed" style={{ color: S.muted }}>群类型启用后才能建群。地区与会员身份均可多选；群类型代码、地区代码和序号由系统生成并保持只读。</p></div>{project.groupTypes.map((rule, idx) => <div key={rule.id} className="p-3 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="px-2 py-1 text-xs font-bold" style={{ background: rule.enabled ? "#0d0d0d" : "#f0f0f0", color: rule.enabled ? S.accent : S.muted, borderRadius: S.radiusSm }}>{rule.code}</span><input value={rule.name} style={{ ...fieldStyle, width: 132, padding: "5px 7px" }} onChange={e => updateRule(idx, { name: e.target.value })} /></div><label className="flex items-center gap-1 text-xs font-bold" style={{ color: rule.enabled ? "#276749" : S.muted }}><input type="checkbox" checked={rule.enabled} onChange={e => updateRule(idx, { enabled: e.target.checked })} />启用</label></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-xs" style={{ color: S.muted }}>默认群容量<input type="number" min="1" value={rule.capacity} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { capacity: Number(e.target.value) })} /></label><label className="text-xs" style={{ color: S.muted }}>分配方式<select value={rule.allocationMode} style={{ ...fieldStyle, marginTop: 4 }} onChange={e => updateRule(idx, { allocationMode: e.target.value as GroupTypeRule["allocationMode"] })}><option>轮巡分配</option><option>统一分配</option></select></label></div><div><div className="text-xs font-bold mb-1.5">匹配会员身份 <span className="font-normal" style={{ color: S.muted }}>可多选</span></div><div className="flex flex-wrap gap-1.5">{groupRuleRoleOptions.map(role => <label key={role} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.memberRoles.includes(role) ? "#0d0d0d" : "#f7f7f7", color: rule.memberRoles.includes(role) ? S.accent : S.muted, border: `1px solid ${rule.memberRoles.includes(role) ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.memberRoles.includes(role)} onChange={() => toggleListValue(idx, "memberRoles", role)} />{role}</label>)}<input className="px-2 py-1 text-[10px] outline-none" style={{ ...fieldStyle, width: 116, padding: "5px 7px" }} placeholder="新增身份，回车" value={roleDraft[String(idx)] || ""} onChange={e => setRoleDraft(current => ({ ...current, [idx]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRole(idx); } }} /></div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>当前：{rule.memberRoles.length ? rule.memberRoles.join("、") : "未选择身份"}</div></div><div><div className="text-xs font-bold mb-1.5">管理地区 <span className="font-normal" style={{ color: S.muted }}>可多选，取消勾选即不参与建群</span></div><div className="flex flex-wrap gap-1.5">{groupRuleCityOptions.map(city => <label key={city} className="flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer" style={{ background: rule.cities.includes(city) ? "#0d0d0d" : "#f7f7f7", color: rule.cities.includes(city) ? S.accent : S.muted, border: `1px solid ${rule.cities.includes(city) ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }}><input className="sr-only" type="checkbox" checked={rule.cities.includes(city)} onChange={() => toggleListValue(idx, "cities", city)} />{city}</label>)}</div><div className="mt-1 text-[10px]" style={{ color: S.muted }}>已选地区：{rule.cities.length ? rule.cities.join("、") : "未选择地区，无法建群"}</div></div><div className="text-[10px] font-mono" style={{ color: S.muted }}>群名模板：<span style={{ color: S.text }}>{rule.nameTemplate}</span> · 编号只读：{rule.code} + 地区代码 + 序号</div></div>)}<button className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => updateDraft(current => ({ ...current, groupTypes: [...current.groupTypes, { id: `custom-${Date.now()}`, name: "新群类型", code: `FL${String(current.groupTypes.length + 1).padStart(2, "0")}`, memberRoles: [], capacity: 500, cities: ["北京"], allocationMode: "轮巡分配", nameTemplate: "{project}{type}{city}{seq}群", enabled: false }] }))}><Plus size={13} className="inline mr-1" />新增群类型规则</button></div>;
}

function ProjectDrawer({ project, onClose, onSave }: { project: ProjectRecord; onClose: () => void; onSave: (p: ProjectRecord) => void }) {
  const [draft, setDraft] = useState<ProjectRecord>(project);
  const [tab, setTab] = useState<ProjectTab>("overview");
  const updateDraft = (updater: (current: ProjectRecord) => ProjectRecord) => setDraft(updater);
  const updateMechanism = (key: keyof ProjectRecord["mechanism"], value: string) => setDraft(d => ({ ...d, mechanism: { ...d.mechanism, [key]: value } }));
  const updateTier = (idx: number, key: keyof ProjectTier, value: string) => setDraft(d => ({ ...d, tiers: d.tiers.map((t, i) => i === idx ? { ...t, [key]: value } : t) }));
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.16)" }} onClick={onClose}>
      <aside className="h-full w-full max-w-[520px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between px-5 py-4" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          <div><div className="text-base font-bold">项目配置 · {draft.name}</div><div className="text-xs mt-1 font-mono" style={{ color: S.muted }}>项目数据、会员等级与社群规则独立隔离</div></div>
          <button className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button>
        </div>
        <div className="flex gap-1 p-4 pb-2">
          {([["overview", "概览", LayoutDashboard], ["tiers", "会员等级", UsersRound], ["groupRules", "群类型规则", SlidersHorizontal], ["mechanism", "社群机制", Workflow], ["visibility", "可见范围", Eye]] as [ProjectTab, string, any][]).map(([id, label, Icon]) => <button key={id} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold" style={{ background: tab === id ? "#0d0d0d" : S.surface, color: tab === id ? S.accent : S.muted, border: `1px solid ${tab === id ? "#0d0d0d" : S.border}`, borderRadius: S.radiusSm }} onClick={() => setTab(id)}><Icon size={13} />{label}</button>)}
        </div>
        <div className="p-4 space-y-3">
          {tab === "overview" && <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>所属 SaaS / 生态</div><div className="text-sm font-bold mt-1">{draft.saas}</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.eco}</div></div>
              <div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>当前运营数据</div><div className="text-sm font-bold mt-1">{draft.users.toLocaleString()} 用户 · {draft.groups} 群</div><div className="text-xs mt-1" style={{ color: S.muted }}>{draft.revenue}</div></div>
            </div>
            <div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Building2 size={16} />企业微信归属</div><div className="text-sm font-bold mt-2">{draft.enterpriseWx}</div><div className="text-xs mt-1" style={{ color: S.muted }}>同一企业已承载 {draft.enterpriseProjectCount} 个项目 · 项目数据按项目隔离</div><button className="mt-3 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setTab("visibility")}>管理项目范围</button></div>
            <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={16} />运营基线</div><span className="text-xs font-mono" style={{ color: S.muted }}>{draft.tiers.length} 个会员等级</span></div><div className="flex flex-wrap gap-2 mt-3">{draft.tiers.map(t => <span key={t.name} className="px-2 py-1 text-xs font-bold" style={{ background: S.accentLight, borderRadius: S.radiusSm }}>{t.name}</span>)}</div><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><div style={{ color: S.muted }}>入群流程 <b style={{ color: S.text }}>{draft.mechanism.welcome}</b></div><div style={{ color: S.muted }}>运营频次 <b style={{ color: S.text }}>{draft.mechanism.cadence}</b></div></div></div>
          </>}
          {tab === "tiers" && <div className="space-y-2">{draft.tiers.map((tier, idx) => <div key={idx} className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold px-2 py-1" style={{ background: idx === 0 ? "#f0f0f0" : S.accent, borderRadius: S.radiusSm }}>等级 {idx + 1}</span><button className="text-xs" style={{ color: "#888" }} onClick={() => setDraft(d => ({ ...d, tiers: d.tiers.filter((_, i) => i !== idx) }))}>移除</button></div><div className="grid grid-cols-2 gap-2"><input value={tier.name} style={fieldStyle} onChange={e => updateTier(idx, "name", e.target.value)} placeholder="等级名称" /><input value={tier.rule} style={fieldStyle} onChange={e => updateTier(idx, "rule", e.target.value)} placeholder="升级条件" /><input value={tier.group} style={fieldStyle} onChange={e => updateTier(idx, "group", e.target.value)} placeholder="对应社群" /><input value={tier.service} style={fieldStyle} onChange={e => updateTier(idx, "service", e.target.value)} placeholder="服务 SLA" /></div></div>)}<button className="w-full py-2 text-xs font-bold" style={{ border: `1px dashed ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={() => setDraft(d => ({ ...d, tiers: [...d.tiers, { name: "新会员等级", rule: "待配置", group: "待配置社群", service: "待配置" }] }))}><Plus size={13} className="inline mr-1" />新增会员等级</button></div>}
          {tab === "groupRules" && <GroupRulesEditor project={draft} updateDraft={updateDraft} />}
          {tab === "mechanism" && <div className="p-4 space-y-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={16} />社群运营机制</div><p className="text-xs" style={{ color: S.muted }}>规则绑定当前项目，会员等级变化后自动路由到对应社群。</p>{([ ["welcome", "入群与欢迎流程"], ["cadence", "内容运营频次"], ["route", "分群路由规则"], ["escalation", "异常升级路径"]] as [keyof ProjectRecord["mechanism"], string][]).map(([key, label]) => <label key={key} className="block text-xs font-bold">{label}<input className="mt-1" value={draft.mechanism[key]} style={fieldStyle} onChange={e => updateMechanism(key, e.target.value)} /></label>)}</div>}
          {tab === "visibility" && <div className="space-y-3"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} />身份可见范围</div><p className="text-xs mt-1" style={{ color: S.muted }}>控制谁可以进入该项目并查看项目、企业微信和社群运营数据。</p></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>{roleNames.map(role => <label key={role} className="flex items-center justify-between py-2 text-xs font-bold" style={{ borderBottom: `1px solid ${S.border}` }}><span>{role}</span><input type="checkbox" checked={!!draft.visibility[role]} onChange={e => setDraft(d => ({ ...d, visibility: { ...d.visibility, [role]: e.target.checked } }))} /></label>)}</div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs font-bold mb-2">企业微信下的项目</div><div className="flex items-center gap-2 flex-wrap">{["蜂乐玛PRO会员", "蜂乐玛体验官", "蜂乐玛代理商"].map(name => <span key={name} className={name === draft.name ? "px-2 py-1 text-xs font-bold" : "px-2 py-1 text-xs"} style={{ background: name === draft.name ? "#0d0d0d" : "#f5f5f5", color: name === draft.name ? S.accent : S.muted, borderRadius: S.radiusSm }}>{name}</span>)}</div></div></div>}
        </div>
        <div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => { onSave(draft); onClose(); }}><Save size={13} />保存项目配置</button></div>
      </aside>
    </div>
  );
}

function CreateProjectDrawer({ onClose, onCreate }: { onClose: () => void; onCreate: (p: ProjectRecord) => void }) {
  const [name, setName] = useState(""); const [enterpriseWx, setEnterpriseWx] = useState("蜂乐玛健康企业微信"); const [eco, setEco] = useState("健康生态"); const [saas, setSaas] = useState("蜂乐玛私域工具"); const [creatorRole, setCreatorRole] = useState("项目负责人");
  const canCreate = name.trim().length > 1;
  return <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,.16)" }} onClick={onClose}><aside className="h-full w-full max-w-[460px] overflow-auto" style={{ background: S.bg, boxShadow: "-10px 0 30px rgba(0,0,0,.12)" }} onClick={e => e.stopPropagation()}><div className="flex items-start justify-between p-5" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}><div><div className="text-base font-bold">接入新项目</div><div className="text-xs mt-1" style={{ color: S.muted }}>创建后继续配置会员等级和社群机制</div></div><button className="p-1.5" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}><X size={16} /></button></div><div className="p-5 space-y-4"><div className="p-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.35)`, borderRadius: S.radius }}><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />项目归属关系</div><p className="text-xs mt-1" style={{ color: S.muted }}>一个企业微信可以承载多个项目；项目数据、会员等级和社群规则独立隔离。</p></div>{([["项目名称", name, setName, "例如：蜂乐玛PRO会员"], ["所属生态", eco, setEco, "选择生态"], ["SaaS 平台", saas, setSaas, "选择平台"], ["企业微信归属", enterpriseWx, setEnterpriseWx, "选择企业微信"]] as [string, string, (v: string) => void, string][]).map(([label, value, setValue, placeholder]) => <label key={label} className="block text-xs font-bold">{label}<input className="mt-1" value={value} placeholder={placeholder} style={fieldStyle} onChange={e => setValue(e.target.value)} /></label>)}<label className="block text-xs font-bold">创建身份<select className="mt-1" value={creatorRole} style={fieldStyle} onChange={e => setCreatorRole(e.target.value)}>{roleNames.map(role => <option key={role}>{role}</option>)}</select><span className="block mt-1 text-[10px] font-normal" style={{ color: S.muted }}>创建身份决定默认项目范围，后续可在“可见范围”中继续收敛。</span></label><div className="grid grid-cols-2 gap-2"><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认会员等级</div><div className="text-sm font-bold mt-1">3 个</div></div><div className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-xs" style={{ color: S.muted }}>默认可见身份</div><div className="text-sm font-bold mt-1">负责人 / 运营 / 客服</div></div></div></div><div className="sticky bottom-0 flex gap-2 p-4" style={{ background: S.surface, borderTop: `1px solid ${S.border}` }}><button className="flex-1 py-2 text-xs font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }} onClick={onClose}>取消</button><button className="flex-1 py-2 text-xs font-bold" disabled={!canCreate} style={{ background: canCreate ? "#0d0d0d" : "#ddd", color: canCreate ? S.accent : "#888", borderRadius: S.radiusSm }} onClick={() => canCreate && onCreate({ id: Date.now(), name, saas, eco, users: 0, groups: 0, teacher: "待分配", cities: ["待配置"], revenue: "待核算", status: "孵化中", enterpriseWx, enterpriseProjectCount: 1, tiers: defaultTiers.map(t => ({ ...t })), groupTypes: [], mechanism: { welcome: "欢迎语 + 入群任务", cadence: "每周 1 次", route: "按城市 + 会员等级分群", escalation: "异常通知项目负责人" }, visibility: { "项目负责人": creatorRole === "项目负责人", "区域运营": creatorRole === "区域运营", "客服": creatorRole === "客服", "生态负责人": creatorRole === "生态负责人" } })}>创建项目</button></div></aside></div>;
}

function ProjectView() {
  const [projectList, setProjectList] = useState<ProjectRecord[]>(projects);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [configProject, setConfigProject] = useState<ProjectRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { rulesByProject } = useCommunityData();
  const selected = projectList.find(p => p.id === selectedId);
  useEffect(() => { projects.forEach(project => registerProjectRules(project.name, project.groupTypes)); }, []);
  const saveProject = (next: ProjectRecord) => { setProjectList(list => list.map(p => p.id === next.id ? next : p)); saveProjectRules(next.name, next.groupTypes); };
  return <div className="space-y-3">
    <div className="flex items-center justify-between"><div><span className="text-sm font-bold" style={{ color: S.text }}>项目工作台 ({projectList.length})</span><div className="text-xs mt-1" style={{ color: S.muted }}>按项目隔离会员、企业微信和社群运营数据</div></div><div className="flex gap-2"><button className="px-3 py-1.5 text-xs font-bold" style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.muted, borderRadius: S.radiusSm }}>全部生态</button><button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }} onClick={() => setCreateOpen(true)}><Plus size={12} /> 接入新项目</button></div></div>
    <div className="grid grid-cols-4 gap-2">{[["可见项目", projectList.length, Eye], ["企业微信", new Set(projectList.map(p => p.enterpriseWx)).size, Building2], ["会员等级", projectList.reduce((n, p) => n + p.tiers.length, 0), UsersRound], ["运营群组", projectList.reduce((n, p) => n + p.groups, 0), MessageSquare]].map(([label, value, Icon]) => <div key={label as string} className="flex items-center gap-2 px-3 py-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><Icon size={15} style={{ color: S.muted }} /><div><div className="text-sm font-bold">{value as number}</div><div className="text-[10px]" style={{ color: S.muted }}>{label as string}</div></div></div>)}</div>
    <div className="p-3 flex items-start gap-2" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,.3)`, borderRadius: S.radius }}><Building2 size={16} /><div className="text-xs leading-relaxed"><b>企业微信与项目关系</b>：企业微信是账号承载层，一个企业可挂多个项目；项目是权限和运营数据隔离的最小单元。进入项目后，成员、会员等级、社群和报表只展示当前身份有权访问的范围。</div></div>
    <div className="overflow-auto" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="min-w-[1240px]">
        <div className="flex items-center px-4 py-2.5 text-xs font-bold font-mono" style={{ background: "#f5f5f5", borderBottom: `1px solid ${S.border}`, color: "#555" }}>
          {([["项目名称",190],["SaaS平台",130],["所属生态",90],["企业微信归属",170],["用户/群组",100],["服务老师",120],["覆盖城市",150],["状态",90],["操作",100]] as [string, number][]).map(([l, w]) => <div key={l} className="flex-shrink-0" style={{ width: w }}>{l}</div>)}
        </div>
        {projectList.map((p, idx) => (
          <div key={p.id} className="flex items-center px-4 py-3 cursor-pointer transition-all text-xs font-mono" style={{ background: selectedId === p.id ? S.accentLight : idx % 2 === 0 ? "#fff" : "#fafaf8", borderBottom: `1px solid ${S.border}`, borderLeft: selectedId === p.id ? `3px solid ${S.accent}` : "3px solid transparent" }} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}>
            <div className="flex-shrink-0 flex items-center gap-2" style={{ width: 190 }}><div className="w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm }}>{p.name[3]}</div><span className="font-bold">{p.name}</span></div>
            <div className="flex-shrink-0" style={{ width: 130, color: S.muted }}>{p.saas}</div><div className="flex-shrink-0" style={{ width: 90, color: S.muted }}>{p.eco}</div>
            <div className="flex-shrink-0" style={{ width: 170 }}><div className="font-bold">{p.enterpriseWx}</div><div className="text-[10px]" style={{ color: S.muted }}>同企业 {p.enterpriseProjectCount} 个项目</div></div>
            <div className="flex-shrink-0" style={{ width: 100 }}><b>{p.users.toLocaleString()}</b><span style={{ color: S.muted }}> / {p.groups} 群</span></div><div className="flex-shrink-0" style={{ width: 120, color: S.muted }}>{p.teacher}</div>
            <div className="flex-shrink-0" style={{ width: 150 }}><div className="flex flex-wrap gap-1">{p.cities.map(c => <span key={c} className="px-1.5 py-0.5 font-bold" style={{ background: "#0d0d0d", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm }}>{c}</span>)}</div></div>
            <div className="flex-shrink-0" style={{ width: 90 }}><span className="px-1.5 py-0.5 font-bold" style={{ background: statusCfg[p.status]?.bg, color: statusCfg[p.status]?.color, borderRadius: S.radiusSm }}>{p.status}</span></div>
            <div className="flex-shrink-0 flex gap-1" style={{ width: 100 }}><button className="px-2 py-1 text-xs font-bold" style={{ background: S.accent, color: "#000", borderRadius: S.radiusSm }} onClick={e => { e.stopPropagation(); setSelectedId(p.id); setConfigProject({ ...p, groupTypes: rulesByProject[p.name] ?? p.groupTypes }); }}>进入</button><button className="px-1.5 py-1" title="配置项目" style={{ background: "#f7f7f7", color: S.muted, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }} onClick={e => { e.stopPropagation(); setConfigProject({ ...p, groupTypes: rulesByProject[p.name] ?? p.groupTypes }); }}><Settings size={11} /></button></div>
          </div>
        ))}
      </div>
    </div>
    <div className="p-4 flex items-start gap-4" style={{ background: S.accentLight, border: `1px solid rgba(204,255,0,0.3)`, borderRadius: S.radius }}><LayoutDashboard size={18} style={{ color: "#0d0d0d", marginTop: 1, flexShrink: 0 }} /><div><div className="text-sm font-bold mb-1">项目是权限和运营隔离的最小单元</div><p className="text-xs leading-relaxed font-mono" style={{ color: S.textSec }}>项目负责人可以创建和配置自己负责的项目；区域运营、客服和主理人按可见范围进入项目。企业微信负责账号承载，项目负责会员等级、社群规则和运营数据。</p></div></div>
    {configProject && <ProjectDrawer project={configProject} onClose={() => setConfigProject(null)} onSave={saveProject} />}
    {createOpen && <CreateProjectDrawer onClose={() => setCreateOpen(false)} onCreate={p => { registerProjectRules(p.name, p.groupTypes); setProjectList(list => [p, ...list]); setCreateOpen(false); setConfigProject(p); }} />}
  </div>;
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
