import React, { useState, useMemo } from "react";
import { X, ThumbsUp, ThumbsDown, UserCheck, AlertTriangle } from "lucide-react";
import type { InviteRecord, InviteSubmission } from "../data/inviteRecords";
import { inviteStatusMeta } from "../data/inviteRecords";
import type { IdentityRole, BindingStatus } from "../data/accountTypes";
import {
  roleKeyMeta,
  availableProjects,
  bindingStatusMeta,
} from "../data/accountTypes";
import { useInvites, useApprovals } from "../App";
import { createApproval } from "../data/approvalTypes";
import { S, useThemeSingleton } from "../theme";
// 基于已有的 roleKeyMeta 合成 identityMeta 列表（保持与 AccountDrawer 一致）
const identityMeta = (Object.keys(roleKeyMeta) as IdentityRole["roleKey"][]).map((rk) => {
  const m = roleKeyMeta[rk];
  const scopeTypeMap: Record<IdentityRole["scopeType"], string> = {
    global: "全局", eco: "生态", saas: "SaaS", platform: "平台", project: "项目", city: "城市",
  };
  return {
    roleKey: rk,
    label: m.label,
    scopeType: m.defaultScope,
    scopeTypeLabel: scopeTypeMap[m.defaultScope],
    defaultScopeIds: [] as string[],
    desc: m.summary,
  };
});

function roleKeyToLabel(k: string): string {
  return roleKeyMeta[k as IdentityRole["roleKey"]]?.label ?? k;
}

function useStyles() {
  return {
    input:
      "px-3 py-2 text-xs outline-none bg-[#fafaf8] border border-[rgba(15,23,42,0.06)] rounded-[6px] text-[#111] w-full",
    btnPrimary:
      "px-4 py-2 text-xs font-bold rounded-[6px] bg-black text-[#3b82f6] border border-black transition-all hover:opacity-95",
    btnGhost:
      "px-4 py-2 text-xs font-bold rounded-[6px] bg-white text-[#111] border border-[rgba(15,23,42,0.12)] transition-all hover:bg-[#f1f5f9]",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  invite: InviteRecord | null;
  reviewerUid?: string;
  reviewerName?: string;
};

export default function InviteReviewDrawer({

  open,
  onClose,
  invite,
  reviewerUid = "acc_chenyuhang",
  reviewerName = "陈宇航",
}: Props) {
  useThemeSingleton();
const _cls = useStyles();
  const { invites, setInvites } = useInvites();
  const { setApprovals } = useApprovals();

  const [tab, setTab] = useState<"preview" | "edit">("preview");

  // 可编辑草案
  const [roles, setRoles] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [bindingStatus, setBindingStatus] = useState<BindingStatus>("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 每次邀请对象变化重置
  React.useEffect(() => {
    if (invite) {
      setRoles(invite.suggestedIdentities.map((i) => i.roleKey));
      setProjectIds([...invite.suggestedProjectIds]);
      setBindingStatus("pending");
      setRejectReason("");
      setTab("preview");
    }
  }, [invite?.id, open]);

  const canReview = useMemo(() => invite && invite.status === "submitted", [invite]);

  function toggleRole(k: string) {
    setRoles((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }
  function toggleProject(pid: string) {
    setProjectIds((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]));
  }

  function buildIdentities(): IdentityRole[] {
    return roles.map((rk) => {
      const meta = identityMeta.find((m) => m.roleKey === rk);
      return {
        roleKey: rk as IdentityRole["roleKey"],
        scopeType: meta?.scopeType || "project",
        scopeIds: meta?.defaultScopeIds || [],
        label: roleKeyToLabel(rk),
        permissionSummary: meta?.desc || "",
      };
    });
  }

  function onApprove() {
    if (!invite || !canReview) return;
    if (roles.length === 0) return;
    const identities = buildIdentities();
    // 推送至审批中心走多级审批流程（邀请人初审 → 生态运营终审）
    const approval = createApproval("invite_register", {
      title: `邀请注册：${invite.submission?.realName || invite.inviteeName}`,
      submitter: reviewerName,
      submitterUid: reviewerUid,
      description: `${invite.inviterName || invite.inviterUid} 邀请 ${invite.inviteeName} 注册，建议身份：${identities.map((i) => i.label).join("、")}，初审通过待终审`,
      detail: {
        被邀请人: invite.submission?.realName || invite.inviteeName,
        手机号: invite.inviteePhone,
        邮箱: invite.inviteeEmail,
        建议身份: identities.map((i) => i.label).join("、"),
        建议项目: projectIds.map((pid) => availableProjects.find((p) => p.id === pid)?.name || pid).join("、"),
        邀请码: invite.inviteCode,
      },
      payload: {
        type: "invite_register",
        inviteId: invite.id,
        inviteeName: invite.submission?.realName || invite.inviteeName,
        inviteePhone: invite.inviteePhone,
        inviteeEmail: invite.inviteeEmail,
        inviteCode: invite.inviteCode,
        identities,
        projectIds,
        bindingStatus,
      },
    });
    setApprovals((prev) => [approval, ...prev]);
    setSuccessToast("✅ 初审通过，已提交至审批中心待终审");
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 900);
  }

  function onReject() {
    if (!invite || !canReview) return;
    if (!rejectReason.trim()) {
      alert("请填写驳回原因");
      return;
    }
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setInvites((prev) =>
      prev.map((it) =>
        it.id === invite.id
          ? {
              ...it,
              status: "rejected",
              rejectReason: rejectReason.trim(),
              reviewedBy: reviewerName,
              reviewedByUid: reviewerUid,
              reviewedAt: now,
            }
          : it
      )
    );
    setSuccessToast("⛔ 已驳回，原因已记录");
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 900);
  }

  if (!open || !invite) return null;
  const status = inviteStatusMeta[invite.status];
  const sub: InviteSubmission | undefined = invite.submission;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(12,12,12,0.5)", backdropFilter: "blur(2px)" }}
      />
      {successToast && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-6 px-4 py-2 text-[12px] font-bold"
          style={{
            background: "#1e293b",
            color: "#3b82f6",
            borderRadius: S.radiusSm,
            border: "1px solid #1e293b",
            zIndex: 70,
          }}
        >
          {successToast}
        </div>
      )}

      <div
        className="absolute top-0 right-0 h-full flex flex-col transition-transform duration-200"
        style={{
          width: "min(600px, 92vw)",
          background: S.surface,
          borderLeft: `1px solid ${S.border}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${S.border}` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: S.radiusSm,
                background: "#1e293b",
                color: "#3b82f6",
              }}
            >
              <UserCheck size={14} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                邀请审核
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}55` }}
                >
                  {status.label}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: S.muted }}>
                邀请码：<span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{invite.inviteCode}</span>
                {" · "}由 {invite.inviterName || invite.inviterUid} 于 {invite.createdAt} 发起
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: S.radiusSm,
              background: "#ffffff",
              color: S.text,
              border: `1px solid ${S.border}`,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Sub-tabs: preview / edit */}
        <div
          className="flex items-center gap-1 px-5 pt-3"
          style={{ borderBottom: `1px solid ${S.border}` }}
        >
          {[
            { k: "preview", label: "提交材料预览", icon: "📄" },
            { k: "edit", label: "调整身份 / 项目 / 领用状态", icon: "✏️" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as "preview" | "edit")}
              className="px-3 py-2 text-[11px] font-bold -mb-px transition-all"
              style={{
                color: tab === t.k ? S.text : S.muted,
                borderBottom: `2px solid ${tab === t.k ? "#1e293b" : "transparent"}`,
              }}
            >
              <span className="mr-1">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {tab === "preview" ? (
            <>
              {/* 被邀请人信息 */}
              <section
                className="grid grid-cols-3 gap-2"
              >
                <InfoCard k="姓名" v={invite.inviteeName} />
                <InfoCard k="手机号" v={invite.inviteePhone} />
                <InfoCard k="邮箱" v={invite.inviteeEmail} />
              </section>

              {/* 被邀请人提交的材料 */}
              <section>
                <div className="text-[11px] font-bold mb-2">📋 被邀请人填写 / 提交的材料</div>
                {sub ? (
                  <div
                    className="p-3.5 space-y-2.5"
                    style={{
                      background: S.surfaceSoft,
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    <Row k="实名" v={sub.realName} />
                    <Row k="身份证号" v={sub.idCardNo} mono />
                    <Row
                      k="手机号已验证"
                      v={sub.phoneVerified ? "✅ 已验证" : "❌ 未验证"}
                    />
                    <Row k="部门" v={sub.department || "—"} />
                    <Row k="职位" v={sub.jobTitle || "—"} />
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: S.muted }}>
                        履历 / 补充说明
                      </div>
                      <div
                        className="mt-1 p-2.5 text-[11px]"
                        style={{
                          background: "#ffffff",
                          border: `1px solid ${S.border}`,
                          borderRadius: S.radiusSm,
                          color: S.text,
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.65,
                        }}
                      >
                        {sub.resumeRemark || "（未填写）"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-4 text-center text-[11px]"
                    style={{
                      background: S.surfaceSoft,
                      border: `1px dashed ${S.border}`,
                      borderRadius: S.radiusSm,
                      color: S.muted,
                    }}
                  >
                    对方尚未在注册落地页提交材料
                  </div>
                )}
              </section>

              {/* 建议身份 + 项目 */}
              <section className="grid grid-cols-5 gap-3">
                <div className="col-span-3">
                  <div className="text-[11px] font-bold mb-2">🎯 建议授予身份（共 {invite.suggestedIdentities.length} 项）</div>
                  <div className="space-y-1.5">
                    {invite.suggestedIdentities.length === 0 && (
                      <div className="text-[10px]" style={{ color: S.muted }}>未建议身份</div>
                    )}
                    {invite.suggestedIdentities.map((id) => (
                      <div
                        key={id.roleKey + id.scopeType}
                        className="flex items-center justify-between p-2"
                        style={{
                          background: "#ffffff",
                          border: `1px solid ${S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="px-1.5 py-0.5 text-[10px] font-bold"
                            style={{
                              background: "#1e293b",
                              color: "#3b82f6",
                              borderRadius: 4,
                            }}
                          >
                            {id.label}
                          </span>
                          <span className="text-[10px]" style={{ color: S.muted }}>
                            {id.permissionSummary}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[11px] font-bold mb-2">📁 建议分配项目（共 {invite.suggestedProjectIds.length} 项）</div>
                  <div className="space-y-1.5">
                    {invite.suggestedProjectIds.length === 0 && (
                      <div className="text-[10px]" style={{ color: S.muted }}>未分配项目</div>
                    )}
                    {invite.suggestedProjectIds.map((pid) => {
                      const p = availableProjects.find((x) => x.id === pid);
                      return (
                        <div
                          key={pid}
                          className="flex items-center gap-2 p-2"
                          style={{
                            background: "#ffffff",
                            border: `1px solid ${S.border}`,
                            borderRadius: S.radiusSm,
                          }}
                        >
                          <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "#3b82f6", color: "#ffffff", borderRadius: 4 }}>
                            {p?.type || "项目"}
                          </span>
                          <span className="text-[11px] font-bold truncate flex-1">{p?.name || pid}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* 审核历史 */}
              {(invite.reviewedAt || invite.rejectReason) && (
                <section>
                  <div className="text-[11px] font-bold mb-2">🕓 审核记录</div>
                  <div
                    className="p-3"
                    style={{
                      background: S.surfaceSoft,
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    <div className="text-[11px]">
                      <b>{invite.reviewedBy || "审核人"}</b>
                      {" · "}
                      {invite.status === "approved" ? "审核通过" : invite.status === "rejected" ? "审核驳回" : "审核"}
                      {" · "}
                      {invite.reviewedAt || "—"}
                    </div>
                    {invite.rejectReason && (
                      <div
                        className="mt-2 p-2 text-[11px]"
                        style={{
                          background: "#fff5f5",
                          border: "1px solid #ffcfcf",
                          color: "#c00",
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <b>驳回原因：</b>
                        {invite.rejectReason}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          ) : (
            // edit tab
            <>
              {/* 授予身份 */}
              <section>
                <div className="text-[11px] font-bold mb-2">🎯 实际授予身份</div>
                <div className="grid grid-cols-2 gap-2">
                  {identityMeta.map((m) => {
                    const on = roles.includes(m.roleKey);
                    return (
                      <button
                        key={m.roleKey}
                        type="button"
                        onClick={() => toggleRole(m.roleKey)}
                        className="text-left p-2.5 transition-all"
                        style={{
                          background: on ? "#1e293b" : S.surfaceSoft,
                          color: on ? "#ffffff" : S.text,
                          border: `1px solid ${on ? "#1e293b" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{m.label}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5" style={{
                            background: on ? "#3b82f6" : S.surfaceSoft,
                            color: "#ffffff",
                            borderRadius: 4,
                          }}>
                            {m.scopeTypeLabel}
                          </span>
                        </div>
                        <div
                          className="mt-1 text-[10px]"
                          style={{ color: on ? "rgba(255,255,255,0.65)" : S.muted }}
                        >
                          {m.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 分配项目 */}
              <section>
                <div className="text-[11px] font-bold mb-2">📁 实际分配项目</div>
                <div className="grid grid-cols-2 gap-2">
                  {availableProjects.map((p) => {
                    const on = projectIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleProject(p.id)}
                        className="flex items-center gap-2 p-2 text-left transition-all"
                        style={{
                          background: on ? "#3b82f633" : S.surfaceSoft,
                          border: `1px solid ${on ? "#1e293b" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <span
                          className="flex items-center justify-center font-bold"
                          style={{
                            width: 18, height: 18, borderRadius: 4,
                            background: on ? "#ffffff" : "#ffffff",
                            color: on ? "#3b82f6" : "#999",
                            border: `1px solid ${on ? "#ffffff" : S.border}`,
                          }}
                        >
                          {on ? "✓" : ""}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate">{p.name}</div>
                          <div className="text-[10px] truncate" style={{ color: S.muted }}>
                            {p.type} · {p.city}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 领用状态 */}
              <section>
                <div className="text-[11px] font-bold mb-2">🧰 账号领用状态（初始）</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(bindingStatusMeta) as BindingStatus[]).map((s) => {
                    const on = bindingStatus === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBindingStatus(s)}
                        className="py-1.5 text-[10px] font-bold transition-all"
                        style={{
                          background: on ? bindingStatusMeta[s].bg : "#fafaf8",
                          color: on ? bindingStatusMeta[s].color : S.textSec,
                          border: `1px solid ${on ? "#1e293b" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        {bindingStatusMeta[s].label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 驳回原因（仅在准备驳回时需要） */}
              <section>
                <div className="text-[11px] font-bold mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={12} style={{ color: "#ff9500" }} /> 如驳回，必须填写驳回原因
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="例如：缺少岗位胜任证明 / 项目未明确 / 身份推荐不合理……（驳回后将以邮件形式通知申请人）"
                  rows={3}
                  className={`${_cls.input}`}
                  style={{ resize: "none" }}
                />
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-3"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          <div className="text-[10px]" style={{ color: S.muted }}>
            {canReview
              ? "初审通过后将提交至审批中心待终审；终审通过后自动创建系统账号；驳回将把状态回推给被邀请人并附上原因"
              : "当前邀请状态不允许审核操作"}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className={`${_cls.btnGhost} px-3.5 py-2 text-xs font-bold`}>
              关闭
            </button>
            {canReview && (
              <>
                <button
                  onClick={onReject}
                  className="px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #c00",
                    color: "#c00",
                    borderRadius: S.radiusSm,
                  }}
                >
                  <ThumbsDown size={13} /> 驳回
                </button>
                <button
                  onClick={onApprove}
                  disabled={roles.length === 0}
                  className={`${_cls.btnPrimary} px-4 py-2 text-xs font-bold flex items-center gap-1.5 ${roles.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <ThumbsUp size={13} /> 初审通过
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="p-2.5"
      style={{
        background: "#ffffff",
        border: `1px solid ${S.border}`,
        borderRadius: S.radiusSm,
      }}
    >
      <div className="text-[10px]" style={{ color: S.muted }}>{k}</div>
      <div className="mt-0.5 text-[12px] font-bold truncate">{v}</div>
    </div>
  );
}

function Row({ k, v, mono = false }: { k: string; v?: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <div className="w-24 shrink-0 font-bold" style={{ color: S.muted }}>{k}</div>
      <div className="flex-1 min-w-0 break-all" style={{ fontFamily: mono ? "ui-monospace, Menlo, monospace" : undefined }}>
        {v || "—"}
      </div>
    </div>
  );
}
