import { ReactNode, useState } from "react";
import {
  LayoutDashboard, Database, MessageCircle, Users2,
  User, CreditCard, FileText, Shield, MapPin,
  Bell, Search, Settings, LogOut, Zap, AlertTriangle, Headphones, Layers, Radio,
  BarChart2, Star, DollarSign, ClipboardCheck, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

// ─── 软圆角赛博朋克 · 柔和边框 ────────────────────────────────
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

const navGroups = [
  { label: "工作台", items: [
    { id: "overview",   label: "跨项目工作台",   icon: LayoutDashboard, badge: null },
    { id: "ecosystem",  label: "项目与生态",     icon: Layers,          badge: null },
  ]},
  { label: "配置中心", items: [
    { id: "accounts",   label: "账号资产中心",   icon: Database,        badge: null },
    { id: "wechat",     label: "微信账号管理",   icon: MessageCircle,   badge: "2"  },
    { id: "community",  label: "微信群管理",     icon: Users2,          badge: "8"  },
    { id: "cs",         label: "客服与服务资源", icon: Headphones,      badge: null },
    { id: "channel",    label: "渠道流量绑定",   icon: Radio,            badge: null },
    { id: "cities",     label: "城市分站",       icon: MapPin,          badge: null },
    { id: "permissions",label: "员工权限",       icon: Shield,          badge: null },
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

interface PCLayoutProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  children: ReactNode;
}

export default function PCLayout({ activeModule, onModuleChange, children }: PCLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeItem = navItems.find(i => i.id === activeModule);

  return (
    <div className="flex h-full" style={{ background: S.bg }}>
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col transition-all duration-200" style={{ width: isSidebarCollapsed ? 64 : 220, background: S.surface, borderRight: `1px solid ${S.border}` }}>

        {/* Logo */}
        <div className={isSidebarCollapsed ? "h-14 flex items-center justify-center gap-1 flex-shrink-0" : "h-14 flex items-center px-4 gap-3 flex-shrink-0"} style={{ borderBottom: `1px solid ${S.border}` }}>
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: S.accent, borderRadius: S.radiusSm }}>
            <Zap size={15} style={{ color: "#000" }} />
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
                      color: isActive ? "#000" : S.muted,
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    <Icon size={13} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                    {!isSidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isSidebarCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 font-bold" style={{ background: isActive ? "rgba(0,0,0,0.15)" : S.accent, color: "#000", fontSize: "9px", borderRadius: "4px", fontFamily: "monospace" }}>
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
            <div className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#0d0d0d", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace" }}>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs flex-shrink-0" style={{ fontFamily: "monospace" }}>
            {["SUPER", "ECO", "SAAS", activeItem?.label?.toUpperCase()].map((seg, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 font-bold text-xs" style={{
                  background: i === arr.length - 1 ? S.accent : "rgba(0,0,0,0.06)",
                  color: i === arr.length - 1 ? "#000" : S.muted,
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
            <div className="relative cursor-pointer">
              <Bell size={15} style={{ color: S.muted }} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center font-bold" style={{ background: S.accent, color: "#000", fontSize: "8px", borderRadius: "4px", fontFamily: "monospace" }}>3</div>
            </div>
            <Settings size={15} style={{ color: S.muted, cursor: "pointer" }} />
            <div className="px-3 py-1 font-bold" style={{ background: "#0d0d0d", color: S.accent, fontSize: "10px", borderRadius: S.radiusSm, fontFamily: "monospace", letterSpacing: "0.04em" }}>
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
