import InfluenceRanking from "./InfluenceRanking";
import { S, useThemeSingleton } from "../theme";
import { useProjectContext } from "../App";

export default function MemberOperationsWorkbench() {
  useThemeSingleton();
  const { platform, project } = useProjectContext();

  return <div className="h-full min-h-0 flex flex-col" style={{ background: S.bg, fontFamily: "monospace" }}>
    <header className="px-5 py-3 flex-shrink-0" style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-base font-bold" style={{ color: S.text }}>总运营工作台</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold" style={{ background: S.accentLight, color: S.primaryDark, borderRadius: 999 }}>高频执行</span>
          </div>
          <p className="m-0 mt-1 text-[11px]" style={{ color: S.muted }}>在同一工作区处理用户、社群、内容触达、活动、代理与运营结果</p>
        </div>
        <span className="hidden lg:block text-[10px] whitespace-nowrap" style={{ color: S.muted }}>当前平台 · {platform}　当前项目 · {project}</span>
      </div>
    </header>
    <div className="flex-1 min-h-0 overflow-hidden"><InfluenceRanking /></div>
  </div>;
}
