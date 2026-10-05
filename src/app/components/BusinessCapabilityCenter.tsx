import { useState } from "react";
import { AppWindow, Boxes, Check, ChevronRight, Link2, Plus, Store, Wrench } from "lucide-react";
import { S, useThemeSingleton } from "../theme";

type CapabilityType = "应用" | "项目小程序" | "工具" | "方案" | "服务";
type Capability = { id: string; name: string; type: CapabilityType; desc: string; price: string; modules: string[] };
type Project = { id: string; name: string; model: string; status: string; capabilities: string[] };

const catalog: Capability[] = [
  { id: "community", name: "社群增长套件", type: "应用", desc: "会员、社群、活动一体化运营", price: "¥299/月", modules: ["会员", "社群", "活动"] },
  { id: "member-workbench", name: "会员运营工作台", type: "应用", desc: "会员画像、关系链与运营任务处理", price: "¥399/月", modules: ["会员", "订单", "活动"] },
  { id: "leader-distribution", name: "团长分销工具", type: "应用", desc: "推广、订单路由与佣金结算", price: "¥399/月", modules: ["订单", "佣金", "会员"] },
  { id: "city-partner", name: "城市合伙人系统", type: "应用", desc: "招募、培训与区域经营协同", price: "¥499/月", modules: ["代理", "订单", "佣金"] },
  { id: "host-commune", name: "主理人公社", type: "项目小程序", desc: "会员、社群、课程、活动与订单服务端", price: "¥699/月", modules: ["会员", "社群", "课程"] },
  { id: "ai-learning", name: "AI 学习社", type: "项目小程序", desc: "训练营、作业、认证与学习服务", price: "¥499/月", modules: ["课程", "训练营", "认证"] },
  { id: "nutrition", name: "AI 营养补剂会员平台", type: "项目小程序", desc: "会员商城、营养方案与复购服务", price: "¥699/月", modules: ["商城", "会员", "服务"] },
  { id: "host-ip", name: "AI 主理人公社", type: "项目小程序", desc: "主理人招募、学习与资源协作", price: "¥699/月", modules: ["招募", "社群", "协作"] },
  { id: "talent", name: "AI 艺人孵化", type: "项目小程序", desc: "报名、任务、培训与签约管理", price: "¥899/月", modules: ["报名", "任务", "签约"] },
  { id: "talent-license", name: "AI 艺人授权", type: "项目小程序", desc: "IP 授权申请、素材、合同与订单", price: "¥899/月", modules: ["授权", "合同", "订单"] },
  { id: "star-clips", name: "AI 明星切片", type: "项目小程序", desc: "内容分发、团队协作与结算", price: "¥899/月", modules: ["内容", "团队", "结算"] },
  { id: "short-drama", name: "AI 短剧", type: "项目小程序", desc: "投稿、选角、制作协同与投流", price: "¥1,299/月", modules: ["投稿", "制作", "投流"] },
  { id: "super-ads", name: "AI 超级广告", type: "项目小程序", desc: "广告主、素材、投放与报表", price: "¥1,299/月", modules: ["广告主", "素材", "报表"] },
  { id: "knowledge", name: "AI 知识付费", type: "项目小程序", desc: "课程、专栏、读书会与付费社群", price: "¥699/月", modules: ["课程", "专栏", "社群"] },
  { id: "education", name: "AI 教育", type: "项目小程序", desc: "学员、家长、课程与服务管理", price: "¥899/月", modules: ["学员", "家长", "课程"] },
  { id: "advisor", name: "AI 军师", type: "项目小程序", desc: "企业诊断、咨询与陪跑交付", price: "¥1,299/月", modules: ["诊断", "咨询", "交付"] },
  { id: "founder-ip", name: "AI 创始 IP", type: "项目小程序", desc: "内容、线索、咨询与商业合作", price: "¥899/月", modules: ["内容", "线索", "合作"] },
  { id: "wecom", name: "企业微信运营助手", type: "工具", desc: "客户同步、会话运营与任务提醒", price: "¥199/月", modules: ["客户", "企微", "社群"] },
  { id: "growth", name: "会员增长方案包", type: "方案", desc: "标签、触达、活动与复购标准流程", price: "¥1,980/套", modules: ["会员", "活动", "订单"] },
  { id: "wecom-setup", name: "企业微信配置服务", type: "服务", desc: "组织、客户、群与权限的落地配置", price: "¥3,800/次", modules: ["企微", "客户", "社群"] },
  { id: "coach", name: "社群运营陪跑", type: "服务", desc: "策略复盘、活动规划与指标跟进", price: "¥6,800/月", modules: ["运营", "服务"] },
];

const initialProjects: Project[] = [
  { id: "pro", name: "PRO会员增长计划", model: "健康会员 SCRM 模型", status: "运营中", capabilities: ["企业微信运营助手", "订单系统"] },
  { id: "trial", name: "体验官转化计划", model: "健康会员 SCRM 模型", status: "筹备中", capabilities: ["企业微信运营助手"] },
  { id: "city", name: "城市合伙人招募", model: "代理分销 SCRM 模型", status: "运营中", capabilities: ["城市合伙人系统", "订单系统"] },
];

const connected = [
  { name: "主理人公社小程序", source: "市场订阅", sync: "正常同步", action: "权益展示、课程核销" },
  { name: "企业微信 SCRM", source: "自有系统", sync: "正常同步", action: "客户、群与服务关系回写" },
  { name: "订单系统", source: "自有系统", sync: "待映射", action: "订单、退款与履约回写" },
];

const tabs = ["能力市场", "已接入能力", "业务项目"] as const;

export default function BusinessCapabilityCenter() {
  useThemeSingleton();
  const [tab, setTab] = useState<(typeof tabs)[number]>("能力市场");
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState("pro");
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<string[]>(["wecom"]);
  const [notice, setNotice] = useState("");
  const selected = projects.find(project => project.id === selectedProjectId) ?? projects[0];
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };
  const bind = (capability: Capability) => {
    if (capability.type === "方案") { setTab("业务项目"); setTargetProjectId(null); notify(`已基于「${capability.name}」创建业务项目草稿`); return; }
    if (capability.type === "服务") { setTab("业务项目"); notify(`请选择业务项目后预约「${capability.name}」`); return; }
    setEnabled(current => current.includes(capability.id) ? current : [...current, capability.id]);
    if (targetProjectId) setProjects(current => current.map(project => project.id === targetProjectId && !project.capabilities.includes(capability.name) ? { ...project, capabilities: [...project.capabilities, capability.name] } : project));
    notify(targetProjectId ? `已启用并绑定至 ${projects.find(p => p.id === targetProjectId)?.name}` : `${capability.name} 已进入“已接入能力”`);
  };

  return <div className="h-full overflow-auto p-6" style={{ background: S.bg, fontFamily: "monospace" }}>
    <header className="flex items-start justify-between gap-4 mb-5"><div><div className="flex items-center gap-2"><Boxes size={20} style={{ color: S.accent }} /><h1 className="m-0 text-lg font-bold" style={{ color: S.text }}>业务能力中心</h1></div><p className="m-0 mt-1 text-xs" style={{ color: S.muted }}>选择能力、完成接入映射，并绑定到真实业务项目</p></div><button type="button" onClick={() => { setTab("业务项目"); setTargetProjectId(null); notify("新建业务项目流程已打开"); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}><Plus size={14} />新建业务项目</button></header>
    <div className="flex items-center gap-1 p-1 mb-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>{tabs.map(item => <button type="button" key={item} onClick={() => { setTab(item); setTargetProjectId(null); }} className="flex-1 px-3 py-2 text-xs font-bold" style={{ background: tab === item ? "#1e293b" : "transparent", color: tab === item ? S.accent : S.muted, borderRadius: 6 }}>{item}</button>)}</div>
    {targetProjectId && <div className="flex items-center justify-between gap-3 px-3 py-2 mb-4 text-xs" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}><span>正在为 <b>{projects.find(item => item.id === targetProjectId)?.name}</b> 添加业务能力</span><button type="button" onClick={() => setTargetProjectId(null)}><Check size={14} /></button></div>}
    {tab === "能力市场" && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">{catalog.map(item => { const Icon = item.type === "应用" ? AppWindow : item.type === "工具" ? Wrench : item.type === "方案" ? Boxes : Store; const action = item.type === "方案" ? "基于方案创建项目" : item.type === "服务" ? "选择项目预约" : enabled.includes(item.id) ? "已接入，可绑定" : "启用能力"; return <div key={item.id} className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center justify-between"><div className="w-9 h-9 flex items-center justify-center" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: S.radiusSm }}><Icon size={18} /></div><span className="text-[10px] font-bold" style={{ color: S.muted }}>{item.type}</span></div><div className="text-sm font-bold mt-3" style={{ color: S.text }}>{item.name}</div><div className="text-[11px] leading-relaxed mt-1 min-h-[34px]" style={{ color: S.muted }}>{item.desc}</div><div className="flex flex-wrap gap-1 mt-3">{item.modules.map(module => <span key={module} className="px-1.5 py-0.5 text-[9px]" style={{ background: S.bg, color: S.textSec, borderRadius: 999 }}>{module}</span>)}</div><div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${S.border}` }}><span className="text-xs font-bold" style={{ color: S.text }}>{item.price}</span><button type="button" onClick={() => bind(item)} className="text-[10px] font-bold" style={{ color: "#6db100" }}>{action} <ChevronRight size={12} className="inline" /></button></div></div>; })}</div>}
    {tab === "已接入能力" && <div className="space-y-2">{connected.map(item => <div key={item.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="w-9 h-9 flex items-center justify-center" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: S.radiusSm }}><Link2 size={17} /></div><div className="min-w-0"><div className="text-sm font-bold" style={{ color: S.text }}>{item.name}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>{item.source} · {item.action}</div></div><button type="button" onClick={() => notify(`${item.name} 的数据映射与动作回写配置已打开`)} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>{item.sync} · 配置映射</button></div>)}{catalog.filter(item => enabled.includes(item.id)).map(item => <div key={`enabled-${item.id}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="w-9 h-9 flex items-center justify-center" style={{ background: S.accentLight, color: "#5a6e00", borderRadius: S.radiusSm }}><AppWindow size={17} /></div><div><div className="text-sm font-bold" style={{ color: S.text }}>{item.name}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>市场订阅 · 已启用，等待绑定业务项目</div></div><button type="button" onClick={() => { setTab("业务项目"); notify(`请选择项目绑定 ${item.name}`); }} className="px-2.5 py-1.5 text-[10px] font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>绑定项目</button></div>)}</div>}
    {tab === "业务项目" && <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-4"><aside className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>{projects.map(project => <button type="button" key={project.id} onClick={() => { setSelectedProjectId(project.id); setTargetProjectId(project.id); }} className="w-full text-left p-3 mb-2" style={{ background: selectedProjectId === project.id ? S.accentLight : S.bg, border: `1px solid ${selectedProjectId === project.id ? S.accent : S.border}`, borderRadius: S.radiusSm }}><div className="text-sm font-bold" style={{ color: S.text }}>{project.name}</div><div className="text-[10px] mt-1" style={{ color: S.muted }}>{project.model}</div><div className="text-[10px] mt-2" style={{ color: project.status === "运营中" ? "#008565" : "#e77800" }}>{project.status}</div></button>)}</aside><main className="p-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-start justify-between"><div><div className="text-base font-bold" style={{ color: S.text }}>{selected.name}</div><div className="text-[11px] mt-1" style={{ color: S.muted }}>行业模型：{selected.model} · 真实客户、订单、权益和服务由当前项目产生</div></div><button type="button" onClick={() => { setTargetProjectId(selected.id); setTab("能力市场"); }} className="px-3 py-1.5 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm }}>添加业务能力</button></div><div className="mt-5 text-xs font-bold" style={{ color: S.muted }}>已绑定能力</div><div className="space-y-2 mt-2">{selected.capabilities.map(name => <div key={name} className="flex items-center justify-between p-3" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><span className="text-xs font-bold" style={{ color: S.text }}>{name}</span><span className="text-[10px]" style={{ color: "#008565" }}>已绑定 · 可处理业务</span></div>)}</div></main></div>}
    {notice && <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2 px-4 py-3 text-sm" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, boxShadow: S.shadowLg }}><Check size={15} />{notice}</div>}
  </div>;
}
