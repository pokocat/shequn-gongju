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
import { ThemeProvider, useTheme, S, resolvePalette } from "./theme";

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
      <ThemeProvider>
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
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AppShell toolsValue={toolsValue} accountsValue={accountsValue} invitesValue={invitesValue} approvalsValue={approvalsValue} view={view} selectView={selectView} activeModule={activeModule} selectModule={selectModule} ActiveComponent={ActiveComponent} />
    </ThemeProvider>
  );
}

function AppShell({ toolsValue, accountsValue, invitesValue, approvalsValue, view, selectView, activeModule, selectModule, ActiveComponent }: {
  toolsValue: { tools: CommunicationTool[]; setTools: React.Dispatch<React.SetStateAction<CommunicationTool[]>> };
  accountsValue: { accounts: SystemAccount[]; setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>> };
  invitesValue: { invites: InviteRecord[]; setInvites: React.Dispatch<React.SetStateAction<InviteRecord[]>> };
  approvalsValue: { approvals: Approval[]; setApprovals: React.Dispatch<React.SetStateAction<Approval[]>> };
  view: ViewMode;
  selectView: (v: ViewMode) => void;
  activeModule: string;
  selectModule: (m: string) => void;
  ActiveComponent: React.ComponentType;
}) {
  const { palette } = useTheme();
  return (
    <ToolsProvider value={toolsValue}>
      <AccountsProvider value={accountsValue}>
      <InvitesProvider value={invitesValue}>
      <ApprovalsProvider value={approvalsValue}>
      <div className="size-full relative" style={{ background: S.bg }}>
        {/* PC 视图：视图切换胶囊移入 PCLayout Header（见 HeaderThemeControls），这里不渲染避免遮挡
            Mobile/Landing/Zhuliren 视图：仍然右上角悬浮 */}
        {view !== "zhuliren" && view !== "pc" && (
          <div className="fixed top-3 right-3 z-50 flex gap-2 items-start">
            {/* 视图切换 */}
            <div className="flex gap-0 p-1 rounded-xl" style={{ background: S.glass, backdropFilter: "blur(10px)", border: `1px solid ${S.glassBorder}`, boxShadow: S.shadow }}>
              {([
                { id: "landing", label: "WEB", icon: Globe },
                { id: "pc", label: "PC", icon: Monitor },
                { id: "mobile", label: "APP", icon: Smartphone },
                { id: "zhuliren", label: "主理人", icon: Star },
              ] as const).map(v => (
                <button key={v.id} onClick={() => selectView(v.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] transition-all font-bold"
                  style={{
                    background: view === v.id ? palette.gradient : "transparent",
                    color: view === v.id ? S.onPrimary : S.textSec,
                    borderRadius: S.radiusSm,
                    fontFamily: "monospace",
                    letterSpacing: "0.02em",
                    border: view === v.id ? "none" : "1px solid transparent",
                  }}>
                  <v.icon size={11} /> {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === "pc" ? (
          <PCLayout view={view} selectView={selectView} activeModule={activeModule} onModuleChange={selectModule}>
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
