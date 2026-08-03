import { useState } from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";
import PCLayout from "./components/PCLayout";
import Overview from "./components/Overview";
import AccountAssets from "./components/AccountAssets";
import WeChatManagement from "./components/WeChatManagement";
import CommunityManagement from "./components/CommunityManagement";
import GroupAssignment from "./components/GroupAssignment";
import CustomerService from "./components/CustomerService";
import InfluenceRanking from "./components/InfluenceRanking";
import EcosystemManagement from "./components/EcosystemManagement";
import ChannelFlow from "./components/ChannelFlow";
import PushTasks from "./components/PushTasks";
import Activities from "./components/Activities";
import Orders from "./components/Orders";
import Tickets from "./components/Tickets";
import ApprovalCenter from "./components/ApprovalCenter";
import Permissions from "./components/Permissions";
import CityBranch from "./components/CityBranch";
import ReportCenter from "./components/ReportCenter";
import MemberBenefits from "./components/MemberBenefits";
import Commission from "./components/Commission";
import MobileApp from "./components/MobileApp";
import LandingPage from "./components/LandingPage";

const moduleMap: Record<string, React.ComponentType> = {
  overview:   Overview,
  accounts:   AccountAssets,
  wechat:     WeChatManagement,
  community:  CommunityManagement,
  assignment: GroupAssignment,
  cs:         CustomerService,
  influence:  InfluenceRanking,
  channel:    ChannelFlow,
  users:      InfluenceRanking,
  segment:    InfluenceRanking,
  members:    MemberBenefits,
  pushtasks:  PushTasks,
  activities: Activities,
  orders:     Orders,
  tickets:    Tickets,
  approval:   ApprovalCenter,
  permissions:Permissions,
  cities:     CityBranch,
  commission: Commission,
  reports:    ReportCenter,
  ecosystem:  EcosystemManagement,
};

type ViewMode = "landing" | "pc" | "mobile";

export default function App() {
  const [view, setView] = useState<ViewMode>(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    return requestedView === "pc" || requestedView === "mobile" ? requestedView : "landing";
  });
  const [activeModule, setActiveModule] = useState("overview");

  const ActiveComponent = moduleMap[activeModule] || Overview;
  const selectView = (nextView: ViewMode) => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === "landing") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);
    window.history.replaceState({}, "", url);
  };

  if (view === "landing") {
    return (
      <div className="size-full relative">
        {/* Switcher */}
        <div className="fixed top-4 right-4 z-[100] flex gap-1 p-1 rounded-xl shadow-lg" style={{ background: "rgba(5,9,23,0.8)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "linear-gradient(135deg, #4361ee, #7c3aed)", color: "white" }}>
            <Globe size={12} /> 官网
          </button>
          <button onClick={() => selectView("pc")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}>
            <Monitor size={12} /> PC 后台
          </button>
          <button onClick={() => selectView("mobile")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}>
            <Smartphone size={12} /> 小程序
          </button>
        </div>
        <LandingPage onEnterApp={() => selectView("pc")} />
      </div>
    );
  }

  return (
    <div className="size-full relative" style={{ background: "#f5f6fa" }}>
      {/* View switcher */}
      <div className="fixed top-3 right-4 z-50 flex gap-0 p-0" style={{ background: "#000", border: "1px solid #ccff00", borderRadius: 0 }}>
        <button onClick={() => selectView("landing")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "landing" ? "#ccff00" : "transparent", color: view === "landing" ? "#000" : "#ccff00", borderRadius: 0, borderRight: "1px solid #333" }}>
          <Globe size={11} /> WEB
        </button>
        <button onClick={() => selectView("pc")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "pc" ? "#ccff00" : "transparent", color: view === "pc" ? "#000" : "#ccff00", borderRadius: 0, borderRight: "1px solid #333" }}>
          <Monitor size={11} /> PC
        </button>
        <button onClick={() => selectView("mobile")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "mobile" ? "#ccff00" : "transparent", color: view === "mobile" ? "#000" : "#ccff00", borderRadius: 0 }}>
          <Smartphone size={11} /> APP
        </button>
      </div>

      {view === "pc" ? (
        <PCLayout activeModule={activeModule} onModuleChange={setActiveModule}>
          <ActiveComponent />
        </PCLayout>
      ) : (
        <MobileApp />
      )}
    </div>
  );
}
