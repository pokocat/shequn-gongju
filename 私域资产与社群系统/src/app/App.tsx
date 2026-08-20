import { useEffect, useState } from "react";
import { Monitor, Smartphone, Globe, Star } from "lucide-react";
import PCLayout from "./components/PCLayout";
import Overview from "./components/Overview";
import AccountAssets from "./components/AccountAssets";
import WeChatManagement from "./components/WeChatManagement";
import CommunityManagement from "./components/CommunityManagement";
import CustomerService from "./components/CustomerService";
import InfluenceRanking from "./components/InfluenceRanking";
import MemberOperationsWorkbench from "./components/MemberOperationsWorkbench";
import EcosystemManagement from "./components/EcosystemManagement";
import ChannelFlow from "./components/ChannelFlow";
import Orders from "./components/Orders";
import Tickets from "./components/Tickets";
import ApprovalCenter from "./components/ApprovalCenter";
import Permissions from "./components/Permissions";
import CityBranch from "./components/CityBranch";
import ReportCenter from "./components/ReportCenter";
import MemberBenefits from "./components/MemberBenefits";
import Commission from "./components/Commission";
import MobileApp from "./components/MobileApp";
import ZhuLiRenApp from "./components/ZhuLiRenApp";
import LandingPage from "./components/LandingPage";

const moduleMap: Record<string, React.ComponentType> = {
  overview:   Overview,
  accounts:   AccountAssets,
  wechat:     WeChatManagement,
  community:  CommunityManagement,
  cs:         CustomerService,
  influence:  InfluenceRanking,
  channel:    ChannelFlow,
  users:      MemberOperationsWorkbench,
  segment:    InfluenceRanking,
  members:    MemberBenefits,
  orders:     Orders,
  tickets:    Tickets,
  approval:   ApprovalCenter,
  permissions:Permissions,
  cities:     CityBranch,
  commission: Commission,
  reports:    ReportCenter,
  ecosystem:  EcosystemManagement,
};

type ViewMode = "landing" | "pc" | "mobile" | "zhuliren";

export default function App() {
  const [view, setView] = useState<ViewMode>(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    return requestedView === "pc" || requestedView === "mobile" || requestedView === "zhuliren" ? requestedView : "landing";
  });
  const [activeModule, setActiveModule] = useState(() => {
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    return requestedModule && requestedModule in moduleMap ? requestedModule : "overview";
  });

  const ActiveComponent = moduleMap[activeModule] || Overview;
  const selectView = (nextView: ViewMode) => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === "landing") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);
    window.history.replaceState({}, "", url);
  };

  const selectModule = (nextModule: string) => {
    if (!(nextModule in moduleMap)) return;
    setActiveModule(nextModule);
    const url = new URL(window.location.href);
    if (nextModule === "overview") url.searchParams.delete("module");
    else url.searchParams.set("module", nextModule);
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    const syncRouteState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextView = params.get("view");
      const nextModule = params.get("module");
      if (nextView === "pc" || nextView === "mobile" || nextView === "zhuliren") setView(nextView);
      if (nextModule && nextModule in moduleMap) setActiveModule(nextModule);
      else if (!nextModule) setActiveModule("overview");
    };
    window.addEventListener("popstate", syncRouteState);
    return () => window.removeEventListener("popstate", syncRouteState);
  }, []);

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
            <Smartphone size={12} /> 会员小程序
          </button>
          <button onClick={() => selectView("zhuliren")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}>
            <Star size={12} /> 主理人公社
          </button>
        </div>
        <LandingPage onEnterApp={() => selectView("pc")} />
      </div>
    );
  }

  return (
    <div className="size-full relative" style={{ background: "#f5f6fa" }}>
      {/* View switcher */}
      {view !== "zhuliren" && <div className="fixed top-3 right-4 z-50 flex gap-0 p-0" style={{ background: "#000", border: "1px solid #ccff00", borderRadius: 0 }}>
        <button onClick={() => selectView("landing")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "landing" ? "#ccff00" : "transparent", color: view === "landing" ? "#000" : "#ccff00", borderRadius: 0, borderRight: "1px solid #333" }}>
          <Globe size={11} /> WEB
        </button>
        <button onClick={() => selectView("pc")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "pc" ? "#ccff00" : "transparent", color: view === "pc" ? "#000" : "#ccff00", borderRadius: 0, borderRight: "1px solid #333" }}>
          <Monitor size={11} /> PC
        </button>
        <button onClick={() => selectView("mobile")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "mobile" ? "#ccff00" : "transparent", color: view === "mobile" ? "#000" : "#ccff00", borderRadius: 0, borderRight: "1px solid #333" }}>
          <Smartphone size={11} /> 会员APP
        </button>
        <button onClick={() => selectView("zhuliren")} className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all font-mono font-bold tracking-wider" style={{ background: view === "zhuliren" ? "#ccff00" : "transparent", color: view === "zhuliren" ? "#000" : "#ccff00", borderRadius: 0 }}>
          <Star size={11} /> 主理人
        </button>
      </div>}

      {view === "pc" ? (
        <PCLayout activeModule={activeModule} onModuleChange={selectModule}>
          <ActiveComponent />
        </PCLayout>
      ) : view === "mobile" ? (
        <MobileApp />
      ) : (
        <ZhuLiRenApp
          onOpenWeb={() => selectView("landing")}
          onOpenPc={() => selectView("pc")}
          onOpenMobile={() => selectView("mobile")}
        />
      )}
    </div>
  );
}
