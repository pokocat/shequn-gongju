import { useState } from "react";
import { CalendarDays, Send, UserRound } from "lucide-react";
import Activities from "./Activities";
import InfluenceRanking from "./InfluenceRanking";
import PushTasks from "./PushTasks";

const S = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  accent: "#3b82f6",
  text: "#1e293b",
  muted: "#94a3b8",
  radius: "10px",
  radiusSm: "6px",
};

type WorkbenchView = "members" | "push" | "activities";

const workbenchTabs: Array<{ id: WorkbenchView; label: string; icon: typeof UserRound; badge?: string; description: string }> = [
  { id: "members", label: "会员运营", icon: UserRound, description: "会员任务、画像、关系链与订单服务" },
  { id: "push", label: "推送任务", icon: Send, badge: "3", description: "触达计划、模板与执行日志" },
  { id: "activities", label: "活动运营", icon: CalendarDays, description: "活动、课程与报名运营" },
];

export default function MemberOperationsWorkbench() {
  const [activeView, setActiveView] = useState<WorkbenchView>("members");

  return (
    <div className="h-full min-h-0 flex flex-col" style={{ background: S.bg, fontFamily: "monospace" }}>
      <header className="px-5 pt-4 pb-3 flex-shrink-0" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="m-0 text-base font-bold" style={{ color: S.text }}>会员运营工作台</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(204,255,0,0.22)", color: "#4f6500", borderRadius: "999px" }}>日常运营</span>
            </div>
            <p className="m-0 mt-1 text-[11px]" style={{ color: S.muted }}>围绕会员执行触达、活动与持续运营</p>
          </div>
          <span className="hidden lg:block text-[10px] whitespace-nowrap" style={{ color: S.muted }}>当前项目 · 会员项目</span>
        </div>

        <div className="mt-3 flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="会员运营工作台功能">
          {workbenchTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveView(tab.id)}
                className="flex items-center gap-2 px-3 py-2 text-left whitespace-nowrap transition-all"
                style={{
                  background: isActive ? "#1e293b" : "#ffffff",
                  color: isActive ? S.accent : S.text,
                  border: `1px solid ${isActive ? "#1e293b" : S.border}`,
                  borderRadius: S.radiusSm,
                }}
              >
                <Icon size={14} />
                <span className="text-xs font-bold">{tab.label}</span>
                {tab.badge && <span className="min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-bold" style={{ background: S.accent, color: "#ffffff", borderRadius: "999px" }}>{tab.badge}</span>}
                <span className="hidden xl:inline text-[10px]" style={{ color: isActive ? "rgba(204,255,0,0.68)" : S.muted }}>{tab.description}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeView === "members" && <InfluenceRanking />}
        {activeView === "push" && <div className="h-full overflow-auto"><PushTasks /></div>}
        {activeView === "activities" && <Activities />}
      </div>
    </div>
  );
}
