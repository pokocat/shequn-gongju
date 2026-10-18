import { lazy, Suspense, useState } from "react";
import { BarChart3, CreditCard, DollarSign, FileText, MapPin, Share2 } from "lucide-react";
import { S, useThemeSingleton } from "../theme";

const Orders = lazy(() => import("./Orders"));
const ChannelFlow = lazy(() => import("./ChannelFlow"));
const CityBranch = lazy(() => import("./CityBranch"));
const Commission = lazy(() => import("./Commission"));
const Tickets = lazy(() => import("./Tickets"));

type OperationsTab = "overview" | "orders" | "channel" | "cities" | "commission" | "tickets";

const tabs: Array<{ id: OperationsTab; label: string; description: string; icon: typeof BarChart3 }> = [
  { id: "overview", label: "运营总览", description: "查看各业务模块运行状态", icon: BarChart3 },
  { id: "orders", label: "订单与履约", description: "订单、退款与履约处理", icon: CreditCard },
  { id: "channel", label: "渠道分发与分销", description: "分配规则与渠道运营", icon: Share2 },
  { id: "cities", label: "城市分站", description: "城市团队与区域经营", icon: MapPin },
  { id: "commission", label: "佣金与结算", description: "分销佣金与结算管理", icon: DollarSign },
  { id: "tickets", label: "工单中心", description: "服务工单与问题跟进", icon: FileText },
];

const moduleComponents = { orders: Orders, channel: ChannelFlow, cities: CityBranch, commission: Commission, tickets: Tickets };

function OperationsOverview({ onSelect }: { onSelect: (tab: OperationsTab) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {tabs.slice(1).map(tab => {
        const Icon = tab.icon;
        return (
          <button key={tab.id} type="button" onClick={() => onSelect(tab.id)} className="p-4 text-left transition-transform hover:-translate-y-0.5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center" style={{ background: S.accentLight, color: S.primaryDark, borderRadius: S.radiusSm }}><Icon size={17} /></div>
            <div className="text-sm font-bold" style={{ color: S.text }}>{tab.label}</div>
            <div className="mt-1 text-[11px]" style={{ color: S.muted }}>{tab.description}</div>
            <div className="mt-4 text-[10px] font-bold" style={{ color: S.primary }}>进入模块 →</div>
          </button>
        );
      })}
    </div>
  );
}

export default function BusinessOperations() {
  useThemeSingleton();
  const [activeTab, setActiveTab] = useState<OperationsTab>("overview");
  const ActiveModule = activeTab === "overview" ? null : moduleComponents[activeTab];

  return (
    <div className="h-full overflow-auto p-4 sm:p-6" style={{ background: S.bg, fontFamily: "monospace" }}>
      <header className="mb-5">
        <div className="flex items-center gap-2"><BarChart3 size={20} style={{ color: S.accent }} /><h1 className="m-0 text-lg font-bold" style={{ color: S.text }}>业务运营</h1></div>
        <p className="m-0 mt-1 text-xs" style={{ color: S.muted }}>集中处理订单、渠道、城市、佣金和服务工单等日常运营工作</p>
      </header>
      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className="flex min-h-16 items-center gap-2 p-2 text-left" style={{ background: activeTab === tab.id ? S.primary : S.surface, color: activeTab === tab.id ? S.onPrimary : S.text, border: `1px solid ${activeTab === tab.id ? S.primary : S.border}`, borderRadius: S.radiusSm }}><Icon size={14} /><span className="min-w-0 text-[10px] font-bold leading-tight">{tab.label}</span></button>;
        })}
      </div>
      {activeTab === "overview" ? <OperationsOverview onSelect={setActiveTab} /> : activeTab === "channel" ? <Suspense fallback={<div className="p-6 text-xs" style={{ color: S.muted }}>正在加载业务模块…</div>}><ChannelFlow mode="operation" /></Suspense> : ActiveModule ? <Suspense fallback={<div className="p-6 text-xs" style={{ color: S.muted }}>正在加载业务模块…</div>}><ActiveModule /></Suspense> : null}
    </div>
  );
}
