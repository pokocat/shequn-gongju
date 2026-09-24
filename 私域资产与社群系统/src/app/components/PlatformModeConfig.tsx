import { useMemo, useState } from "react";
import { Check, Eye, Lock, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
import {
  canConfigurePlatformMode,
  defaultPlatformModeConfig,
  getRoleGroupLabel,
  type PlatformRoleCode,
} from "../data/levelConfig";

const identityOptions: Array<{ value: "platformAdmin" | PlatformRoleCode; label: string }> = [
  { value: "platformAdmin", label: "平台管理员" },
  { value: "D1", label: "D1 · 创始人" },
  { value: "D2", label: "D2 · 核心合伙人" },
  { value: "D3", label: "D3 · 事业合伙人" },
  { value: "D4", label: "D4 · 分公司负责人" },
  { value: "D5", label: "D5 · 分公司合伙人" },
];

export default function PlatformModeConfig() {
  useThemeSingleton();
  const [identity, setIdentity] = useState<"platformAdmin" | PlatformRoleCode>("platformAdmin");
  const [d1ConfigPermission, setD1ConfigPermission] = useState(true);
  const [config, setConfig] = useState(defaultPlatformModeConfig);
  const [draft, setDraft] = useState(config);
  const [notice, setNotice] = useState("");
  const canEdit = canConfigurePlatformMode(identity, d1ConfigPermission);
  const companyRoles = useMemo(() => config.roles.filter(role => role.group === "company"), [config.roles]);
  const agentRoles = useMemo(() => config.roles.filter(role => role.group === "agent"), [config.roles]);

  const updateRoleParameter = (code: PlatformRoleCode, key: "commissionRate" | "recruitmentLimit", value: number) => {
    setDraft(current => ({
      ...current,
      roles: current.roles.map(role => role.code === code ? { ...role, operating: { ...role.operating, [key]: value } } : role),
    }));
  };

  const saveDraft = () => {
    setNotice("运营参数草稿已保存，尚未影响线上生效版本");
  };

  const publish = () => {
    const nextVersion = `ops-1.0.${config.versions.length}`;
    const nextConfig = {
      ...draft,
      operatingVersion: nextVersion,
      versions: [{
        version: nextVersion,
        status: "published" as const,
        createdBy: identity === "platformAdmin" ? "平台管理员" : "D1 · 创始人",
        createdAt: "2026-09-23 12:00:00",
        effectiveAt: "2026-09-23 12:00:00",
        affectedModules: ["运营参数", "团长招募", "库存履约", "佣金结算"],
        changeSummary: "发布运营可调参数变更。",
      }, ...draft.versions],
    };
    setConfig(nextConfig);
    setDraft(nextConfig);
    setNotice(`已发布 ${nextVersion}，新业务将使用该版本`);
  };

  const rollback = () => {
    const previous = config.versions[1];
    if (!previous) {
      setNotice("当前没有可回滚的历史版本");
      return;
    }
    setNotice(`已生成回滚草稿，目标版本：${previous.version}`);
  };

  return (
    <div className="p-6 h-full overflow-auto" style={{ background: S.bg, fontFamily: "monospace" }}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-lg font-bold" style={{ color: S.text }}>平台模式配置</div>
          <div className="text-xs mt-1" style={{ color: S.muted }}>参考一人公司系统的平台建设结构，统一管理角色骨架与运营参数</div>
        </div>
        <div className="flex items-center gap-2">
          <select value={identity} onChange={event => setIdentity(event.target.value as typeof identity)} className="px-3 py-2 text-xs" style={{ background: S.surface, color: S.text, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>
            {identityOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {identity === "D1" && <label className="flex items-center gap-1.5 text-[11px]" style={{ color: S.muted }}><input type="checkbox" checked={d1ConfigPermission} onChange={event => setD1ConfigPermission(event.target.checked)} />配置权限</label>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          ["当前模式", config.mode],
          ["预置规则", config.presetVersion],
          ["运营版本", config.operatingVersion],
          ["生效状态", "已生效"],
        ].map(([label, value]) => <div key={label} className="p-3" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-[10px]" style={{ color: S.muted }}>{label}</div><div className="text-sm font-bold mt-1" style={{ color: S.text }}>{value}</div></div>)}
      </div>

      <div className="p-4 mb-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex items-center justify-between gap-3 mb-3"><div><div className="text-sm font-bold" style={{ color: S.text }}>配置总览</div><div className="text-[11px] mt-1" style={{ color: S.muted }}>平台上线时锁定身份骨架，日常只调整运营参数</div></div><div className="flex items-center gap-1.5 text-[11px]" style={{ color: canEdit ? "#15803d" : S.muted }}><ShieldCheck size={14} />{canEdit ? "当前身份可配置" : "当前身份只读"}</div></div>
        <div className="grid grid-cols-3 gap-3 text-[11px]" style={{ color: S.textSec }}><div className="p-3" style={{ background: S.bg, borderRadius: S.radiusSm }}><b>平台预置规则</b><div className="mt-1" style={{ color: S.muted }}>D1-D5 编码、分组、归属、核心责任和权限边界</div></div><div className="p-3" style={{ background: S.bg, borderRadius: S.radiusSm }}><b>运营可调参数</b><div className="mt-1" style={{ color: S.muted }}>分润、招募、审核、晋升和预警阈值</div></div><div className="p-3" style={{ background: S.bg, borderRadius: S.radiusSm }}><b>版本与审计</b><div className="mt-1" style={{ color: S.muted }}>草稿、发布、生效时间、回滚来源和变更摘要</div></div></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[{ title: "公司角色 · D1-D3", roles: companyRoles }, { title: "代理角色 · D4-D5", roles: agentRoles }].map(section => <div key={section.title} className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="flex items-center gap-2 mb-3"><Lock size={13} style={{ color: S.accent }} /><div className="text-sm font-bold" style={{ color: S.text }}>{section.title}</div></div>{section.roles.map(role => <div key={role.code} className="p-3 mb-2 last:mb-0" style={{ background: S.bg, borderRadius: S.radiusSm, border: `1px solid ${S.border}` }}><div className="flex justify-between gap-3"><div><span className="text-xs font-bold" style={{ color: S.text }}>{role.code} · {role.name}</span><div className="text-[11px] mt-1" style={{ color: S.muted }}>{role.description}</div></div><span className="text-[10px] px-2 py-1 h-fit" style={{ background: S.accentLight, color: S.text, borderRadius: 999 }}>{getRoleGroupLabel(role.group)}</span></div><div className="text-[10px] mt-2" style={{ color: S.muted }}>核心规则：{role.preset.ownershipRules.join("；")}</div></div>)}</div>)}
      </div>

      <div className="p-4 mb-5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}>
        <div className="flex items-center justify-between mb-3"><div><div className="text-sm font-bold" style={{ color: S.text }}>运营可调参数</div><div className="text-[11px] mt-1" style={{ color: S.muted }}>只读身份可查看当前生效值，配置身份可编辑草稿</div></div>{canEdit ? <div className="text-[11px]" style={{ color: "#15803d" }}>编辑权限已开启</div> : <div className="flex items-center gap-1 text-[11px]" style={{ color: S.muted }}><Eye size={13} />只读模式</div>}</div>
        <div className="overflow-hidden" style={{ border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><div className="grid grid-cols-5 px-3 py-2 text-[10px] font-bold" style={{ background: S.bg, color: S.muted }}><span>角色</span><span>审核方式</span><span>佣金比例</span><span>招募上限</span><span>预警阈值</span></div>{draft.roles.map(role => <div key={role.code} className="grid grid-cols-5 items-center px-3 py-2.5 text-[11px]" style={{ borderTop: `1px solid ${S.border}`, color: S.text }}><span className="font-bold">{role.code} · {role.name}</span><span>{role.operating.approvalMode === "agent_first_review" ? "代理初审" : "平台复审"}</span><input type="number" min="0" max="1" step="0.01" disabled={!canEdit} value={role.operating.commissionRate} onChange={event => updateRoleParameter(role.code, "commissionRate", Number(event.target.value))} className="w-20 px-2 py-1" style={{ background: canEdit ? S.surface : S.bg, border: `1px solid ${S.borderMed}`, borderRadius: 4, color: S.text }} /><input type="number" min="0" disabled={!canEdit} value={role.operating.recruitmentLimit} onChange={event => updateRoleParameter(role.code, "recruitmentLimit", Number(event.target.value))} className="w-20 px-2 py-1" style={{ background: canEdit ? S.surface : S.bg, border: `1px solid ${S.borderMed}`, borderRadius: 4, color: S.text }} /><span>{role.operating.warningThresholds.pendingReview} 条待审</span></div>)}</div>
        <div className="flex items-center justify-between mt-4"><span className="text-[11px]" style={{ color: notice ? "#15803d" : S.muted }}>{notice || `当前生效时间：${config.effectiveAt}`}</span>{canEdit && <div className="flex gap-2"><button type="button" onClick={() => { setDraft(config); setNotice("已撤销未发布修改"); }} className="flex items-center gap-1 px-3 py-2 text-xs" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}><RotateCcw size={13} />撤销</button><button type="button" onClick={saveDraft} className="flex items-center gap-1 px-3 py-2 text-xs" style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}><Save size={13} />保存草稿</button><button type="button" onClick={publish} className="flex items-center gap-1 px-3 py-2 text-xs font-bold" style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm }}><Check size={13} />发布生效</button><button type="button" onClick={rollback} className="px-3 py-2 text-xs" style={{ background: S.accentLight, color: S.text, borderRadius: S.radiusSm }}>回滚</button></div>}</div>
      </div>

      <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><div className="text-sm font-bold mb-3" style={{ color: S.text }}>版本与变更记录</div>{config.versions.map(version => <div key={version.version} className="flex items-start justify-between gap-4 py-3" style={{ borderTop: `1px solid ${S.border}` }}><div><div className="text-xs font-bold" style={{ color: S.text }}>{version.version} · {version.status === "published" ? "已发布" : "草稿"}</div><div className="text-[11px] mt-1" style={{ color: S.muted }}>{version.changeSummary}</div></div><div className="text-right text-[10px]" style={{ color: S.muted }}>{version.createdBy}<br />生效：{version.effectiveAt}</div></div>)}</div>
    </div>
  );
}
