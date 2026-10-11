import { Suspense, lazy, useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { Monitor, Globe, Smartphone } from "lucide-react";
import PCLayout from "./components/PCLayout";
import Overview from "./components/Overview";
import { CommunicationTool, initialTools } from "./data/communicationTools";
import { SystemAccount, mockAccounts } from "./data/accountTypes";
import { InviteRecord, mockInvites } from "./data/inviteRecords";
import { Approval, mockApprovals } from "./data/approvalTypes";
import { ThemeProvider, useTheme, S, resolvePalette } from "./theme";

const UnifiedAccountManagement = lazy(() => import("./components/UnifiedAccountManagement"));
const CustomerService = lazy(() => import("./components/CustomerService"));
const InfluenceRanking = lazy(() => import("./components/InfluenceRanking"));
const MemberOperationsWorkbench = lazy(() => import("./components/MemberOperationsWorkbench"));
const EcosystemManagement = lazy(() => import("./components/EcosystemManagement"));
const BusinessProjectCenter = lazy(() => import("./components/BusinessProjectCenter"));
const BusinessCapabilityCenter = lazy(() => import("./components/BusinessCapabilityCenter"));
const ChannelFlow = lazy(() => import("./components/ChannelFlow"));
const Orders = lazy(() => import("./components/Orders"));
const Tickets = lazy(() => import("./components/Tickets"));
const ApprovalCenter = lazy(() => import("./components/ApprovalCenter"));
const Permissions = lazy(() => import("./components/Permissions"));
const PlatformModeConfig = lazy(() => import("./components/PlatformModeConfig"));
const CityBranch = lazy(() => import("./components/CityBranch"));
const ReportCenter = lazy(() => import("./components/ReportCenter"));
const MiniProgramCenter = lazy(() => import("./components/MiniProgramCenter"));
const MemberBenefits = lazy(() => import("./components/MemberBenefits"));
const Commission = lazy(() => import("./components/Commission"));
const ZhuLiRenApp = lazy(() => import("./components/ZhuLiRenApp"));
const ZhuLiRenV1 = lazy(() => import("./components/ZhuLiRenV1"));
const ZhuLiRenPC = lazy(() => import("./components/ZhuLiRenPC"));
const LandingPage = lazy(() => import("./components/LandingPage"));

const moduleMap: Record<string, React.ComponentType> = {
  overview:   Overview,
  accounts:   UnifiedAccountManagement,
  commtools:  UnifiedAccountManagement,
  wechat:     UnifiedAccountManagement,
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
  platformMode: PlatformModeConfig,
  cities:     CityBranch,
  commission: Commission,
  reports:    ReportCenter,
  miniPrograms: MiniProgramCenter,
  appMarket: () => <MiniProgramCenter startInMarket />,
  ecosystem:  EcosystemManagement,
  businessProjects: BusinessProjectCenter,
  capabilities: BusinessCapabilityCenter,
};

type ViewMode = "landing" | "pc" | "zhuliren-1" | "zhuliren-2" | "zhuliren-pc";
export type WorkspaceContext = "platform" | "project";
type ProjectContextValue = { platform: string; project: string; workspaceContext: WorkspaceContext; setWorkspaceContext: (value: WorkspaceContext) => void; platformMode: () => void; projectMode: (platform: string, project: string) => void; setPlatform: (value: string) => void; setProject: (value: string) => void; projectsByPlatform: Record<string, string[]> };
export const ProjectContext = createContext<ProjectContextValue>({ platform: "主理人公社", project: "V001 军师", workspaceContext: "project", setWorkspaceContext: () => {}, platformMode: () => {}, projectMode: () => {}, setPlatform: () => {}, setProject: () => {}, projectsByPlatform: {} });
export const useProjectContext = () => useContext(ProjectContext);
const projectsByPlatform: Record<string, string[]> = {
  "主理人公社": [
    "V001 军师",
    "AI超级广告公司",
    "AI艺人孵化",
    "AI数字资产平台",
    "AI大健康",
    "AI知识付费",
    "AI教育",
    "AI明星艺人授权",
    "AI企业礼品采购",
  ],
};

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
    return requestedView === "pc" || requestedView === "zhuliren-1" || requestedView === "zhuliren-2" || requestedView === "zhuliren-pc" ? requestedView : "landing";
  });
  const [activeModule, setActiveModule] = useState(() => {
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    return requestedModule && requestedModule in moduleMap ? requestedModule : "overview";
  });
  const [tools, setTools] = useState<CommunicationTool[]>(initialTools);
  const [accounts, setAccounts] = useState<SystemAccount[]>(mockAccounts);
  const [invites, setInvites] = useState<InviteRecord[]>(mockInvites);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [platform, setPlatform] = useState("主理人公社");
  const [project, setProject] = useState("V001 军师");
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContext>(() => activeModule === "ecosystem" ? "platform" : "project");

  useEffect(() => {
    if (activeModule === "ecosystem") setWorkspaceContext("platform");
  }, [activeModule]);

  const platformMode = () => {
    setWorkspaceContext("platform");
    setProject("");
  };

  const projectMode = (nextPlatform: string, nextProject: string) => {
    setPlatform(nextPlatform);
    setProject(nextProject);
    setWorkspaceContext("project");
  };

  const ActiveComponent = moduleMap[activeModule] || Overview;
  const selectView = (nextView: ViewMode) => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === "landing") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);
    if (nextView !== "pc") url.searchParams.delete("module");
    window.history.replaceState({}, "", url);
  };

  const selectModule = (nextModule: string) => {
    if (!(nextModule in moduleMap)) return;
    setActiveModule(nextModule);
    if (nextModule === "ecosystem") {
      setWorkspaceContext("platform");
      setProject("");
    }
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
      if (nextView === "pc" || nextView === "zhuliren-1" || nextView === "zhuliren-2" || nextView === "zhuliren-pc") setView(nextView);
      if (nextModule && nextModule in moduleMap) {
        setActiveModule(nextModule);
        if (nextModule === "ecosystem") {
          setWorkspaceContext("platform");
          setProject("");
        }
      } else if (!nextModule) setActiveModule("overview");
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
            <button onClick={() => selectView("zhuliren-2")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}>
              <Smartphone size={12} /> 主理人2
            </button>
            <button onClick={() => selectView("zhuliren-pc")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}>
              <Monitor size={12} /> 主理人 PC
            </button>
          </div>
          <Suspense fallback={<div className="size-full" />}>
            <LandingPage onEnterApp={() => selectView("pc")} />
          </Suspense>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ProjectContext.Provider value={{
        platform,
        project,
        workspaceContext,
        setWorkspaceContext,
        platformMode,
        projectMode,
        setPlatform: value => {
          setPlatform(value);
          setProject(projectsByPlatform[value]?.[0] || "");
          setWorkspaceContext("project");
        },
        setProject: value => {
          setProject(value);
          setWorkspaceContext("project");
        },
        projectsByPlatform
      }}>
      <AppShell
        toolsValue={toolsValue}
        accountsValue={accountsValue}
        invitesValue={invitesValue}
        approvalsValue={approvalsValue}
        view={view}
        selectView={selectView}
        activeModule={activeModule}
        selectModule={selectModule}
        ActiveComponent={ActiveComponent}
      />
      </ProjectContext.Provider>
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
        {view !== "pc" && (
          <div className="fixed top-3 right-3 z-50 flex gap-2 items-start">
            {/* 视图切换 */}
            <div className="flex gap-0 p-1 rounded-xl" style={{ background: S.glass, backdropFilter: "blur(10px)", border: `1px solid ${S.glassBorder}`, boxShadow: S.shadow }}>
              {([
                { id: "landing", label: "WEB", icon: Globe },
                { id: "pc", label: "PC", icon: Monitor },
                { id: "zhuliren-1", label: "主理人1", icon: Smartphone },
                { id: "zhuliren-2", label: "主理人2", icon: Smartphone },
                { id: "zhuliren-pc", label: "主理人 PC", icon: Monitor },
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
            <Suspense fallback={<div className="size-full" />}>
              {activeModule === "overview" ? <Overview onNavigate={selectModule} /> : <ActiveComponent />}
            </Suspense>
          </PCLayout>
        ) : view === "zhuliren-1" ? (
          <Suspense fallback={<div className="size-full" />}>
            <ZhuLiRenV1 />
          </Suspense>
        ) : view === "zhuliren-2" ? (
          <Suspense fallback={<div className="size-full" />}>
            <ZhuLiRenApp />
          </Suspense>
        ) : view === "zhuliren-pc" ? (
          <Suspense fallback={<div className="size-full" />}>
            <ZhuLiRenPC />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="size-full" />}>
            <ZhuLiRenApp />
          </Suspense>
        )}
      </div>
      </ApprovalsProvider>
      </InvitesProvider>
      </AccountsProvider>
    </ToolsProvider>
  );
}
