import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { Monitor, Smartphone, Globe, Star } from "lucide-react";
import PCLayout from "./components/PCLayout";
import Overview from "./components/Overview";
import UnifiedAccountManagement from "./components/UnifiedAccountManagement";
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
import { CommunicationTool, initialTools } from "./data/communicationTools";
import { SystemAccount, mockAccounts } from "./data/accountTypes";
import { InviteRecord, mockInvites } from "./data/inviteRecords";
import { Approval, mockApprovals } from "./data/approvalTypes";

const moduleMap: Record<string, React.ComponentType> = {
  overview:   Overview,
  // 账号资产中心：四类型（微信/手机号/邮箱/媒体）台账；commtools 旧路由保持兼容 → 统一跳账号资产中心
  accounts:   UnifiedAccountManagement,
  commtools:  UnifiedAccountManagement,
  // 微信账号管理：统一资产入口，个人/企业微信选中后加载旧版微信管理设计
  wechat:     () => <UnifiedAccountManagement initialCategory="communication" initialSubtype="wechat" />,
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

export const ToolsContext = createContext<{
  tools: CommunicationTool[];
  setTools: React.Dispatch<React.SetStateAction<CommunicationTool[]>>;
}>({ tools: [], setTools: () => {} });

export const useTools = () => useContext(ToolsContext);

export const AccountsContext = createContext<{
  accounts: SystemAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>;
}>({ accounts: [], setAccounts: () => {} });

export const useAccounts = () => useContext(AccountsContext);

export const InvitesContext = createContext<{
  invites: InviteRecord[];
  setInvites: React.Dispatch<React.SetStateAction<InviteRecord[]>>;
}>({ invites: [], setInvites: () => {} });

export const useInvites = () => useContext(InvitesContext);

export const ApprovalsContext = createContext<{
  approvals: Approval[];
  setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
}>({ approvals: [], setApprovals: () => {} });

export const useApprovals = () => useContext(ApprovalsContext);

function ToolsProvider({ children, value }: { children: ReactNode; value: { tools: CommunicationTool[]; setTools: React.Dispatch<React.SetStateAction<CommunicationTool[]>> } }) {
  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
}

function AccountsProvider({ children, value }: { children: ReactNode; value: { accounts: SystemAccount[]; setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>> } }) {
  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
}

function InvitesProvider({ children, value }: { children: ReactNode; value: { invites: InviteRecord[]; setInvites: React.Dispatch<React.SetStateAction<InviteRecord[]>> } }) {
  return <InvitesContext.Provider value={value}>{children}</InvitesContext.Provider>;
}

function ApprovalsProvider({ children, value }: { children: ReactNode; value: { approvals: Approval[]; setApprovals: React.Dispatch<React.SetStateAction<Approval[]>> } }) {
  return <ApprovalsContext.Provider value={value}>{children}</ApprovalsContext.Provider>;
}

export default function App() {
  const [view, setView] = useState<ViewMode>(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    return requestedView === "pc" || requestedView === "mobile" || requestedView === "zhuliren" ? requestedView : "landing";
  });
  const [activeModule, setActiveModule] = useState(() => {
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    return requestedModule && requestedModule in moduleMap ? requestedModule : "overview";
  });
  const [tools, setTools] = useState<CommunicationTool[]>(initialTools);
  const [accounts, setAccounts] = useState<SystemAccount[]>(mockAccounts);
  const [invites, setInvites] = useState<InviteRecord[]>(mockInvites);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);

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

  const toolsValue = { tools, setTools };
  const accountsValue = { accounts, setAccounts };
  const invitesValue = { invites, setInvites };
  const approvalsValue = { approvals, setApprovals };

  if (view === "landing") {
    return (
      <div className="size-full relative">
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
    <ToolsProvider value={toolsValue}>
      <AccountsProvider value={accountsValue}>
      <InvitesProvider value={invitesValue}>
      <ApprovalsProvider value={approvalsValue}>
      <div className="size-full relative" style={{ background: "#f5f6fa" }}>
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
            {activeModule === "overview" ? <Overview onNavigate={selectModule} /> : <ActiveComponent />}
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
      </ApprovalsProvider>
      </InvitesProvider>
      </AccountsProvider>
    </ToolsProvider>
  );
}
