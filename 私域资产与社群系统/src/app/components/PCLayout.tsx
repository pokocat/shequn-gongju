import { ReactNode, useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users2,
  User, CreditCard, FileText, Shield, MapPin,
  Bell, Search, Settings, LogOut, Zap, AlertTriangle, Headphones, Layers, Share2,
  BarChart2, Star, DollarSign, ClipboardCheck, PanelLeftClose, PanelLeftOpen,
  Globe, Monitor, Smartphone, ChevronDown, Check
} from "lucide-react";
import { S, useThemeSingleton, ThemeControls } from "../theme";

type ViewMode = "landing" | "pc" | "mobile" | "zhuliren";

// ─── 软圆角赛博朋克 · 柔和边框 ────────────────────────────────
const navGroups = [
  { label: "工作台", items: [
    { id: "overview",   label: "跨项目工作台",   icon: LayoutDashboard, badge: null },
    { id: "ecosystem",  label: "项目与生态",     icon: Layers,          badge: null },
  ]},
  { label: "配置中心", items: [
    { id: "wechat",     label: "账号资产中心",    icon: CreditCard,      badge: "2"  },
    { id: "community",  label: "微信群管理",      icon: Users2,          badge: "8"  },
    { id: "cs",         label: "客服与服务资源",  icon: Headphones,      badge: null },
    { id: "channel",    label: "渠道流量绑定",    icon: Share2,          badge: null },
    { id: "cities",     label: "城市分站",        icon: MapPin,          badge: null },
    { id: "permissions",label: "员工权限",        icon: Shield,          badge: null },
  ]},
  { label: "日常运营", items: [
    { id: "users",      label: "会员运营工作台", icon: User,            badge: null },
    { id: "members",    label: "会员权益",       icon: Star,             badge: null },
  ]},
  { label: "服务与交易", items: [
    { id: "orders",     label: "支付订单",       icon: CreditCard,       badge: "3"  },
    { id: "tickets",    label: "工单中心",       icon: FileText,         badge: "12" },
    { id: "approval",   label: "审批中心",       icon: ClipboardCheck,   badge: "18" },
    { id: "commission", label: "分销佣金",       icon: DollarSign,       badge: null },
  ]},
  { label: "数据分析", items: [
    { id: "reports",    label: "数据报表中心",   icon: BarChart2,        badge: null },
  ]},
];
const navItems = navGroups.flatMap(g => g.items);

/* ─────── ViewModePicker —— 视图切换下拉选择器 ───────────────────────
   数据驱动：4 种视图 Web / PC / App / 主理人
   交互模式同 ThemePicker：openRef + 单次注册监听，避免 pointerdown/click 竞态
   ──────────────────────────────────────────────────────────────────── */
type VMItem = {
  id: ViewMode;
  label: string;
  short: string;          // 触发器上显示的短标签
  desc: string;           // 菜单里的副标题
  icon: typeof Globe;
  accent: string;         // 触发器胶囊的强调色
};
const VIEW_MODES: VMItem[] = [
  { id: "landing",  label: "官网展示", short: "WEB",   desc: "公开官网 · 营销介绍页", icon: Globe,     accent: "#0ea5e9" },
  { id: "pc",       label: "PC 后台",  short: "PC",    desc: "工作台 · 全功能控制台", icon: Monitor,    accent: S.accent },
  { id: "mobile",   label: "APP 预览", short: "APP",   desc: "会员小程序 · 私域用户端", icon: Smartphone, accent: "#22c55e" },
  { id: "zhuliren", label: "主理人",    short: "主理人", desc: "城市主理人 · 合伙人工作台", icon: Star,     accent: "#1e293b" },
];

function ViewModePicker({
  view, setView,
}: { view: ViewMode; setView: (v: ViewMode) => void }) {
  useThemeSingleton();
  const current = VIEW_MODES.find(m => m.id === view) ?? VIEW_MODES[1];

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!openRef.current) return;
      if (!wrapperRef.current || !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!openRef.current) return;
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-shrink-0">
      {/* Trigger: 紧凑胶囊 —— 当前视图 icon + 短标签 + 下拉箭头 */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="view-mode-picker-menu"
        aria-label={`视图：${current.label} · 点击切换`}
        title="切换视图 · WEB / PC / APP / 主理人"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 pr-1 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          paddingLeft: 8,
          paddingTop: 4,
          paddingBottom: 4,
          background: S.glass,
          border: `1px solid ${S.glassBorder}`,
          borderRadius: "999px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: S.shadow,
          cursor: "pointer",
          lineHeight: 1,
          fontFamily: "monospace",
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: S.muted, userSelect: "none" }}>VIEW</span>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: "999px",
            background: current.accent, color: "#fff",
            fontSize: 11, fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <current.icon size={11} strokeWidth={2.5} />
          <span>{current.short}</span>
        </span>
        <ChevronDown size={12} style={{ color: S.muted, flexShrink: 0 }} />
      </button>

      {/* Menu */}
      {open && (
        <div
          id="view-mode-picker-menu"
          role="listbox"
          aria-label="选择视图"
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: `calc(100% + 8px)`,
            left: 0,
            minWidth: 210,
            background: S.surface,
            border: `1px solid ${S.borderMed}`,
            borderRadius: S.radiusLg,
            boxShadow: S.shadow,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            padding: "6px",
            zIndex: 1000,
          }}
        >
          {VIEW_MODES.map(m => {
            const active = view === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setView(m.id); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "9px 10px",
                  borderRadius: S.radiusSm,
                  background: active ? S.primaryLight : "transparent",
                  color: active ? S.primaryDark : S.text,
                  cursor: "pointer", border: "none",
                  textAlign: "left",
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  lineHeight: 1.35,
                  transition: "background 120ms",
                }}
                onMouseEnter={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = S.glass; (e.currentTarget as HTMLElement).style.color = S.primary; }
                }}
                onMouseLeave={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = S.text; }
                }}
              >
                <span
                  style={{
                    display: "inline-flex", width: 30, height: 30,
                    alignItems: "center", justifyContent: "center",
                    borderRadius: 8,
                    background: active ? m.accent : S.surface,
                    border: `1px solid ${active ? "transparent" : S.borderMed}`,
                    color: active ? "#ffffff" : S.muted,
                    boxShadow: active ? S.shadow : "none",
                    flexShrink: 0,
                  }}
                >
                  <m.icon size={14} strokeWidth={2.5} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  {m.label}
                  <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: S.muted, marginTop: 2 }}>
                    {m.desc}
                  </span>
                </span>
                {active && (
                  <span style={{ color: S.primary, display: "inline-flex" }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface PCLayoutProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  view: ViewMode;
  selectView: (v: ViewMode) => void;
  children: ReactNode;
}

export default function PCLayout({
 view, selectView, activeModule, onModuleChange, children }: PCLayoutProps) {
  useThemeSingleton();
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeItem = navItems.find(i => i.id === activeModule);

  return (
    <div className="flex h-full" style={{ background: S.bg }}>
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col transition-all duration-200" style={{ width: isSidebarCollapsed ? 64 : 220, background: S.surface, borderRight: `1px solid ${S.border}` }}>

        {/* Logo */}
        <div className={isSidebarCollapsed ? "h-14 flex items-center justify-center gap-1 flex-shrink-0" : "h-14 flex items-center px-4 gap-3 flex-shrink-0"} style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: S.accent, borderRadius: S.radiusSm }}>
            <Zap size={15} style={{ color: "#ffffff" }} />
          </div>
          {!isSidebarCollapsed && <div className="min-w-0">
            <div className="font-black tracking-wide" style={{ fontSize: "14px", color: S.text, fontFamily: "monospace", letterSpacing: "0.08em" }}>聚域</div>
            <div style={{ color: S.muted, fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.1em" }}>PRIVATE DOMAIN OS</div>
          </div>}
          <button
            type="button"
            title={isSidebarCollapsed ? "展开导航栏" : "收起导航栏"}
            aria-label={isSidebarCollapsed ? "展开导航栏" : "收起导航栏"}
            onClick={() => setIsSidebarCollapsed(value => !value)}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0"
            style={{ color: S.muted, marginLeft: isSidebarCollapsed ? 0 : "auto" }}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* Risk alert */}
        {!isSidebarCollapsed && <div className="mx-3 mt-3 px-3 py-1.5 flex items-center gap-2" style={{ background: S.accentLight, border: `1px solid ${S.accentMid}`, borderRadius: S.radiusSm }}>
          <AlertTriangle size={11} style={{ color: "#5a6e00", flexShrink: 0 }} />
          <span style={{ color: "#5a6e00", fontSize: "10px", fontFamily: "monospace", fontWeight: 700 }}>2 RISK ITEMS</span>
        </div>}

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto px-2">
          {navGroups.map(group => (
            <div key={group.label}>
              {!isSidebarCollapsed && <div style={{ color: S.mutedLight, fontSize: "9px", padding: "10px 10px 3px", letterSpacing: "0.14em", fontFamily: "monospace", fontWeight: 700 }}>{group.label}</div>}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onModuleChange(item.id)}
                    className={isSidebarCollapsed ? "w-full flex items-center justify-center px-0 py-2 text-left transition-all mb-0.5" : "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all mb-0.5"}
                    style={{
                      background: isActive ? S.accent : "transparent",
                      borderRadius: S.radiusSm,
                      color: isActive ? "#ffffff" : S.muted,
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    <Icon size={13} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                    {!isSidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isSidebarCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 font-bold" style={{ background: isActive ? "rgba(0,0,0,0.15)" : S.accent, color: "#ffffff", fontSize: "9px", borderRadius: "4px", fontFamily: "monospace" }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className={isSidebarCollapsed ? "p-2 mb-2 flex-shrink-0" : "p-3 mx-2 mb-2 flex-shrink-0"} style={{ borderTop: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
              创
            </div>
            {!isSidebarCollapsed && <div className="flex-1 min-w-0">
              <div className="font-bold truncate" style={{ fontSize: "11px", color: S.text, fontFamily: "monospace" }}>王总·创始人</div>
              <div style={{ color: S.muted, fontSize: "9px", fontFamily: "monospace" }}>ROOT ACCESS</div>
            </div>}
            {!isSidebarCollapsed && <LogOut size={12} style={{ color: S.mutedLight, cursor: "pointer", flexShrink: 0 }} />}
          </div>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 flex items-center px-6 gap-4 flex-shrink-0" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
          {/* 视图切换：浮动下拉选择器 */}
          <ViewModePicker view={view} setView={selectView} />

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs flex-shrink-0" style={{ fontFamily: "monospace" }}>
            {["SUPER", "ECO", "SAAS", activeItem?.label?.toUpperCase()].map((seg, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 font-bold text-xs" style={{
                  background: i === arr.length - 1 ? S.accent : "rgba(15,23,42,0.06)",
                  color: i === arr.length - 1 ? "#ffffff" : S.muted,
                  borderRadius: "4px",
                  fontSize: "9px",
                }}>
                  {seg}
                </span>
                {i < arr.length - 1 && <span style={{ color: S.mutedLight, fontSize: "10px" }}>/</span>}
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm ml-4">
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
              <Search size={12} style={{ color: S.muted }} />
              <input className="bg-transparent outline-none flex-1 text-xs" style={{ color: S.text, fontFamily: "monospace" }} placeholder="SEARCH..." />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* ── 右上角主题 + 暗黑模式 ────────────────────────────────── */}
            <ThemeControls />
            <div className="relative cursor-pointer">
              <Bell size={15} style={{ color: S.muted }} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center font-bold" style={{ background: S.accent, color: "#ffffff", fontSize: "8px", borderRadius: "4px", fontFamily: "monospace" }}>3</div>
            </div>
            <Settings size={15} style={{ color: S.muted, cursor: "pointer" }} />
            <div className="px-3 py-1 font-bold" style={{ background: "#1e293b", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace", letterSpacing: "0.04em" }}>
              2026-07-05
            </div>
          </div>
        </div>

        {/* Content */}
        <div data-pc-content className="flex-1 overflow-auto" style={{ background: S.bg }}>
          {children}
        </div>
      </div>
    </div>
  );
}
