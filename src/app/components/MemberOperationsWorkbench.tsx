import InfluenceRanking from "./InfluenceRanking";
import { S, useThemeSingleton } from "../theme";
import { useProjectContext } from "../App";
import { PROJECT_WORK_MODE_META, canConfigureProjectWorkMode, roleLabel } from "../data/projectWorkModes";

export default function MemberOperationsWorkbench() {
  useThemeSingleton();
  const { platform, project, projectId, role, projectWorkMode, projectWorkModes, setProjectWorkMode } = useProjectContext();
  const workModeMeta = PROJECT_WORK_MODE_META[projectWorkMode];
  const canConfigure = canConfigureProjectWorkMode(role);
  const savedConfig = projectWorkModes[projectId];

  return <div className="h-full min-h-0 flex flex-col" style={{ background: S.bg, fontFamily: "monospace" }}>
    <header className="px-5 py-3 flex-shrink-0" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-base font-bold" style={{ color: S.text }}>总运营工作台</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: S.primaryDark, borderRadius: 999 }}>高频执行</span>
            <span className="px-2 py-0.5 text-[10px] font-bold" title={workModeMeta.description} style={{ background: projectWorkMode === "execution" ? "#fff0db" : "#e8fbf4", color: projectWorkMode === "execution" ? "#b45309" : "#007a5e", borderRadius: 999 }}>{workModeMeta.label}</span>
          </div>
          <p className="m-0 mt-1 text-[11px]" style={{ color: S.muted }}>从会员、社群、项目与代理四类经营对象快速判断、服务、执行并回收结果</p>
        </div>
        <span className="hidden lg:block text-[10px] whitespace-nowrap" style={{ color: S.muted }}>当前平台 · {platform}　当前项目 · {project}　当前角色 · {roleLabel(role)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2" style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}>
          <div className="min-w-0">
            <div className="text-[10px] font-bold" style={{ color: S.text }}>项目关系任务模式</div>
            <div className="text-[10px] mt-0.5 truncate" style={{ color: S.muted }}>{workModeMeta.description}{savedConfig ? ` · 最近由${savedConfig.updatedBy}配置于${new Date(savedConfig.updatedAt).toLocaleString("zh-CN", { hour12: false })}` : " · 使用系统默认模式"}</div>
          </div>
          {canConfigure ? <select aria-label="配置项目关系任务模式" value={projectWorkMode} onChange={event => setProjectWorkMode(event.target.value as "transparent" | "execution")} className="px-2 py-1 text-[10px] font-bold outline-none" style={{ background: S.surface, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}><option value="transparent">监管透明模式</option><option value="execution">任务执行模式</option></select> : <span className="text-[10px] whitespace-nowrap" style={{ color: S.muted }}>仅管理员可配置</span>}
        </div>
    </header>
    <div className="flex-1 min-h-0 overflow-hidden"><InfluenceRanking /></div>
  </div>;
}
