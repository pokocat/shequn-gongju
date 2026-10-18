import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
import Overview from "./Overview";
import ReportCenter, { REPORT_TABS, type ReportTab } from "./ReportCenter";

type AnalyticsPanel = "overview" | ReportTab;

export default function AnalyticsWorkbench({
  defaultTab = "overview",
  onNavigate,
}: {
  defaultTab?: "overview" | "reports";
  onNavigate?: (module: string) => void;
}) {
  useThemeSingleton();
  const [activePanel, setActivePanel] = useState<AnalyticsPanel>(
    defaultTab === "reports" ? "概览报表" : "overview",
  );

  return (
    <div className="min-h-full" style={{ background: S.bg }}>
      <div className="sticky top-0 z-10 px-6 pt-5" style={{ background: S.bg }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: S.text }}>经营分析</h1>
            <p className="mt-1 text-xs" style={{ color: S.muted }}>跨项目掌握经营全局，快速查看经营趋势与业务报表</p>
          </div>
          <div className="flex max-w-[70%] items-center gap-1 overflow-x-auto p-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
            <button
              type="button"
              onClick={() => setActivePanel("overview")}
              className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all"
              style={{
                background: activePanel === "overview" ? S.primary : "transparent",
                color: activePanel === "overview" ? S.onPrimary : S.muted,
                borderRadius: S.radiusSm,
              }}
            >
              <LayoutDashboard size={13} />
              跨项目总览
            </button>
            {REPORT_TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePanel(tab)}
                className="shrink-0 px-3 py-2 text-xs font-bold transition-all"
                style={{
                  background: activePanel === tab ? S.primary : "transparent",
                  color: activePanel === tab ? S.onPrimary : S.muted,
                  borderRadius: S.radiusSm,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      {activePanel === "overview" ? (
        <Overview
          onNavigate={module => {
            if (module === "reports") setActivePanel("概览报表");
            else onNavigate?.(module);
          }}
        />
      ) : (
        <ReportCenter
          activeTab={activePanel}
          onActiveTabChange={setActivePanel}
          showTabs={false}
        />
      )}
    </div>
  );
}
