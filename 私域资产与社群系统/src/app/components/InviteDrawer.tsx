import React, { useState } from "react";
import { X, UserPlus, Send, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import type { IdentityRole } from "../data/accountTypes";
import {
  roleKeyMeta,
  availableProjects,
} from "../data/accountTypes";
import { useInvites } from "../App";
import { InviteRecord, genInviteCode, daysLater } from "../data/inviteRecords";

const S = {
  bg: "#fafafa",
  surface: "#ffffff",
  surfaceSoft: "#fafaf8",
  border: "rgba(0,0,0,0.06)",
  accent: "#ccff00",
  accentLight: "rgba(204,255,0,0.08)",
  text: "#111111",
  textSec: "#444444",
  muted: "#888888",
  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

// 基于已有的 roleKeyMeta 合成 identityMeta 列表（保持与 AccountDrawer 一致）
const identityMeta = (Object.keys(roleKeyMeta) as IdentityRole["roleKey"][]).map((rk) => {
  const m = roleKeyMeta[rk];
  const scopeTypeMap: Record<IdentityRole["scopeType"], string> = {
    global: "全局",
    eco: "生态",
    saas: "SaaS",
    platform: "平台",
    project: "项目",
    city: "城市",
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
      "px-3 py-2 text-xs outline-none bg-[#fafaf8] border border-[rgba(0,0,0,0.06)] rounded-[6px] text-[#111] w-full",
    btnPrimary:
      "px-4 py-2 text-xs font-bold rounded-[6px] bg-black text-[#ccff00] border border-black transition-all hover:opacity-95",
    btnGhost:
      "px-4 py-2 text-xs font-bold rounded-[6px] bg-white text-[#111] border border-[rgba(0,0,0,0.12)] transition-all hover:bg-[#f7f7f7]",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  // 发起邀请人，简单 demo：先固定成 Mock 账号中的陈宇航
  inviterUid?: string;
  inviterName?: string;
};

export default function InviteDrawer({ open, onClose, inviterUid = "acc_chenyuhang", inviterName = "陈宇航" }: Props) {
  const _cls = useStyles();
  const { invites, setInvites } = useInvites();

  const [inviteeName, setInviteeName] = useState("");
  const [inviteePhone, setInviteePhone] = useState("");
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [expireDays, setExpireDays] = useState<7 | 30 | 90>(7);
  const [genCode, setGenCode] = useState<string>(genInviteCode());
  const [genLink, setGenLink] = useState<string>(`https://app.example.com/register?code=${genCode}`);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");
  const [createdInvite, setCreatedInvite] = useState<InviteRecord | null>(null);

  function reset() {
    setInviteeName("");
    setInviteePhone("");
    setInviteeEmail("");
    setSelectedRoles([]);
    setSelectedProjects([]);
    setExpireDays(7);
    const c = genInviteCode();
    setGenCode(c);
    setGenLink(`https://app.example.com/register?code=${c}`);
    setCopied(false);
    setStep("form");
    setCreatedInvite(null);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 220);
  }

  function toggleRole(k: string) {
    setSelectedRoles((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }
  function toggleProject(pid: string) {
    setSelectedProjects((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
    );
  }

  function regenCode() {
    const c = genInviteCode();
    setGenCode(c);
    setGenLink(`https://app.example.com/register?code=${c}`);
  }

  function formValid(): boolean {
    if (!inviteeName.trim() || !inviteePhone.trim() || !inviteeEmail.trim()) return false;
    if (selectedRoles.length === 0) return false;
    if (!/^1[3-9]\d{9}$/.test(inviteePhone)) return false;
    if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(inviteeEmail)) return false;
    return true;
  }

  function onGenerate() {
    if (!formValid()) return;
    const suggestedIdentities: IdentityRole[] = selectedRoles.map((rk) => {
      const meta = identityMeta.find((m) => m.roleKey === rk);
      return {
        roleKey: rk as IdentityRole["roleKey"],
        scopeType: meta?.scopeType || "project",
        scopeIds: meta?.defaultScopeIds || [],
        label: roleKeyToLabel(rk),
        permissionSummary: meta?.desc || "",
      };
    });

    const newInvite: InviteRecord = {
      id: `inv_${Date.now().toString(36)}`,
      inviterUid,
      inviterName,
      inviteeName: inviteeName.trim(),
      inviteePhone: inviteePhone.trim(),
      inviteeEmail: inviteeEmail.trim(),
      suggestedIdentities,
      suggestedProjectIds: selectedProjects,
      inviteCode: genCode,
      inviteLink: genLink,
      status: "pending",
      expireAt: daysLater(expireDays),
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setInvites((prev) => [newInvite, ...prev]);
    setCreatedInvite(newInvite);
    setStep("result");
  }

  function onCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(genLink).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* 遮罩 */}
      <div
        onClick={handleClose}
        className="absolute inset-0"
        style={{ background: "rgba(12,12,12,0.5)", backdropFilter: "blur(2px)" }}
      />

      {/* Drawer */}
      <div
        className="absolute top-0 right-0 h-full flex flex-col transition-transform duration-200 ease-out"
        style={{
          width: "min(560px, 92vw)",
          background: S.surface,
          borderLeft: `1px solid ${S.border}`,
          transform: "translateX(0)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${S.border}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: S.radiusSm,
                background: "#000",
                color: "#ccff00",
              }}
            >
              <UserPlus size={14} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-sm font-bold">邀请注册</div>
              <div className="text-[11px]" style={{ color: S.muted }}>
                发起邀请 → 对方填写 → 邀请人审核 → 生成账号
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center transition-all"
            style={{
              width: 28,
              height: 28,
              borderRadius: S.radiusSm,
              color: S.text,
              background: "#fff",
              border: `1px solid ${S.border}`,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {step === "form" ? (
          <>
            {/* Body Form */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Step 条 */}
              <ol className="flex items-center gap-2 text-[10px] font-bold">
                <li
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ background: "#000", color: "#ccff00" }}
                >
                  01 填写邀请信息
                </li>
                <li style={{ color: S.border }}>→</li>
                <li
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ background: S.surfaceSoft, color: S.muted, border: `1px solid ${S.border}` }}
                >
                  02 邀请码 / 链接
                </li>
              </ol>

              {/* 基础信息 */}
              <section>
                <div className="text-xs font-bold mb-2">
                  被邀请人基础信息 <span style={{ color: "#ff3b30" }}>*</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs">
                    姓名
                    <input
                      value={inviteeName}
                      onChange={(e) => setInviteeName(e.target.value)}
                      placeholder="例如：冯雪峰"
                      className={`${_cls.input} mt-1`}
                    />
                  </label>
                  <label className="block text-xs">
                    手机号
                    <input
                      value={inviteePhone}
                      onChange={(e) => setInviteePhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="11 位手机号"
                      maxLength={11}
                      className={`${_cls.input} mt-1`}
                    />
                  </label>
                  <label className="block text-xs col-span-2">
                    邮箱
                    <input
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                      placeholder="example@company.com"
                      className={`${_cls.input} mt-1`}
                    />
                  </label>
                </div>
              </section>

              {/* 建议身份 */}
              <section>
                <div className="text-xs font-bold mb-2">
                  建议授予身份 <span style={{ color: "#ff3b30" }}>*</span>
                  <span className="ml-1 font-normal" style={{ color: S.muted }}>
                    （审核时可调整）
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {identityMeta.map((m) => {
                    const on = selectedRoles.includes(m.roleKey);
                    return (
                      <button
                        type="button"
                        key={m.roleKey}
                        onClick={() => toggleRole(m.roleKey)}
                        className="text-left p-2.5 transition-all"
                        style={{
                          background: on ? "#0d0d0d" : S.surfaceSoft,
                          color: on ? "#fff" : S.text,
                          border: `1px solid ${on ? "#0d0d0d" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{m.label}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 font-bold"
                            style={{
                              background: on ? "#ccff00" : S.surfaceSoft,
                              color: "#000",
                              borderRadius: 4,
                            }}
                          >
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

              {/* 建议项目 */}
              <section>
                <div className="text-xs font-bold mb-2">
                  建议分配项目
                  <span className="ml-1 font-normal" style={{ color: S.muted }}>
                    （可多选，审核时可调整）
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableProjects.map((p) => {
                    const on = selectedProjects.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleProject(p.id)}
                        className="flex items-center gap-2 p-2 text-left transition-all"
                        style={{
                          background: on ? "#ccff0033" : S.surfaceSoft,
                          border: `1px solid ${on ? "#0d0d0d" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        <span
                          className="flex items-center justify-center font-bold"
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            background: on ? "#000" : "#fff",
                            color: on ? "#ccff00" : "#999",
                            border: `1px solid ${on ? "#000" : S.border}`,
                          }}
                        >
                          {on ? "✓" : ""}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-xs font-bold truncate"
                            style={{ color: S.text }}
                          >
                            {p.name}
                          </div>
                          <div
                            className="text-[10px] truncate"
                            style={{ color: S.muted }}
                          >
                            {p.type} · {p.city}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 有效期 & 邀请码 */}
              <section className="grid grid-cols-5 gap-3">
                <label className="block col-span-2 text-xs">
                  有效期
                  <div
                    className="mt-1 grid grid-cols-3 gap-1"
                  >
                    {([7, 30, 90] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setExpireDays(d)}
                        className="py-1.5 text-[11px] font-bold transition-all"
                        style={{
                          background: expireDays === d ? "#000" : "#fff",
                          color: expireDays === d ? "#ccff00" : S.textSec,
                          border: `1px solid ${expireDays === d ? "#0d0d0d" : S.border}`,
                          borderRadius: S.radiusSm,
                        }}
                      >
                        {d} 天
                      </button>
                    ))}
                  </div>
                </label>
                <label className="block col-span-3 text-xs">
                  邀请码
                  <div className="mt-1 flex items-center gap-1.5">
                    <div
                      className="flex-1 flex items-center justify-between px-2.5"
                      style={{
                        height: 36,
                        borderRadius: S.radiusSm,
                        background: S.surfaceSoft,
                        border: `1px solid ${S.border}`,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "#000",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      <span>{genCode}</span>
                      <button
                        type="button"
                        onClick={regenCode}
                        title="重新生成邀请码"
                        className="flex items-center justify-center"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          color: S.textSec,
                          background: "#fff",
                          border: `1px solid ${S.border}`,
                        }}
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="mt-1.5 flex items-center justify-between px-2.5 text-[10px]"
                    style={{
                      height: 30,
                      borderRadius: S.radiusSm,
                      background: S.surfaceSoft,
                      border: `1px solid ${S.border}`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: S.textSec,
                    }}
                  >
                    <span className="truncate">{genLink}</span>
                  </div>
                </label>
              </section>

              {/* 预览卡 */}
              <section
                className="p-3"
                style={{
                  border: `1px dashed ${S.border}`,
                  borderRadius: S.radius,
                  background: "#fffdf5",
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: "#a05200" }}>
                  <span>📨</span> 邀请预览（将以短信 / 邮件形式发送给被邀请人）
                </div>
                <div className="mt-2 text-[11px]" style={{ color: S.text, lineHeight: 1.7 }}>
                  <b>{inviteeName || "（姓名）"}</b> 您好，
                  <br />
                  <b>{inviterName}</b> 邀请您加入社群管理系统。
                  <br />
                  请打开链接并使用手机号 <b>{inviteePhone || "（手机号）"}</b> 完成注册：
                  <br />
                  <span
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: "#0a0",
                      fontWeight: 600,
                    }}
                  >
                    {genLink}
                  </span>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between gap-3 px-5 py-3"
              style={{ borderTop: `1px solid ${S.border}` }}
            >
              <div className="text-[10px]" style={{ color: S.muted }}>
                * 邀请一经创建，邀请链接 {expireDays} 天内有效，过期自动失效
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className={`${_cls.btnGhost} px-3.5 py-2 text-xs font-bold`}
                >
                  取消
                </button>
                <button
                  onClick={onGenerate}
                  disabled={!formValid()}
                  className={`${_cls.btnPrimary} px-4 py-2 text-xs font-bold flex items-center gap-1.5 ${!formValid() ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <Send size={13} /> 创建并发送邀请
                </button>
              </div>
            </div>
          </>
        ) : (
          // Step 2: result
          <>
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {/* Step 条 */}
              <ol className="flex items-center gap-2 text-[10px] font-bold">
                <li
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ background: S.surfaceSoft, color: S.muted, border: `1px solid ${S.border}` }}
                >
                  01 填写邀请信息
                </li>
                <li>→</li>
                <li
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ background: "#000", color: "#ccff00" }}
                >
                  02 邀请码 / 链接
                </li>
              </ol>

              {/* 成功卡 */}
              <section
                className="p-4 flex flex-col items-center text-center"
                style={{
                  background: "linear-gradient(180deg,#f6fff2 0%,#fff 70%)",
                  border: "1px solid #0a0",
                  borderRadius: S.radius,
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#0a0",
                    color: "#fff",
                  }}
                >
                  <CheckCircle2 size={30} strokeWidth={2.4} />
                </div>
                <div className="mt-3 text-[15px] font-bold">邀请已创建成功</div>
                <div className="mt-1 text-[11px]" style={{ color: S.muted }}>
                  邀请状态：待填写 · 有效期至 {createdInvite?.expireAt}
                </div>

                {/* 发送渠道 */}
                <div className="mt-4 w-full grid grid-cols-2 gap-2">
                  <button
                    className="py-2 text-[11px] font-bold"
                    style={{
                      background: "#fff",
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                      color: S.text,
                    }}
                  >
                    📱 短信发送
                  </button>
                  <button
                    className="py-2 text-[11px] font-bold"
                    style={{
                      background: "#fff",
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                      color: S.text,
                    }}
                  >
                    📧 邮件发送
                  </button>
                </div>
              </section>

              {/* 邀请链接卡 */}
              <section
                className="p-3"
                style={{
                  background: S.surfaceSoft,
                  border: `1px solid ${S.border}`,
                  borderRadius: S.radius,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold">邀请码</span>
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: "#ccff00", color: "#000", borderRadius: 4 }}
                  >
                    复制下方链接即可
                  </span>
                </div>
                <div
                  className="mt-2 flex items-center gap-2 px-3"
                  style={{
                    height: 44,
                    borderRadius: S.radiusSm,
                    background: "#fff",
                    border: "1px solid #000",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  {createdInvite?.inviteCode}
                </div>
                <div className="mt-3 text-[11px] font-bold">邀请注册链接</div>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="flex-1 px-3 py-2 text-[11px] truncate"
                    style={{
                      borderRadius: S.radiusSm,
                      background: "#fff",
                      border: `1px solid ${S.border}`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: S.textSec,
                    }}
                  >
                    {createdInvite?.inviteLink}
                  </div>
                  <button
                    onClick={onCopy}
                    className={`${copied ? "" : _cls.btnPrimary} flex items-center gap-1 px-3 py-2 text-[11px] font-bold`}
                    style={{
                      background: copied ? "#0a0" : undefined,
                      color: copied ? "#fff" : undefined,
                    }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={12} /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> 复制链接
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* 被邀请人摘要 */}
              <section
                className="grid grid-cols-3 gap-2 text-[11px]"
              >
                <div className="p-2.5" style={miniCardStyle}>
                  <div className="text-[10px]" style={{ color: S.muted }}>姓名</div>
                  <div className="mt-1 font-bold">{createdInvite?.inviteeName}</div>
                </div>
                <div className="p-2.5" style={miniCardStyle}>
                  <div className="text-[10px]" style={{ color: S.muted }}>手机</div>
                  <div className="mt-1 font-bold">{createdInvite?.inviteePhone}</div>
                </div>
                <div className="p-2.5" style={miniCardStyle}>
                  <div className="text-[10px]" style={{ color: S.muted }}>邮箱</div>
                  <div className="mt-1 font-bold truncate" title={createdInvite?.inviteeEmail}>
                    {createdInvite?.inviteeEmail}
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-3"
              style={{ borderTop: `1px solid ${S.border}` }}
            >
              <button
                onClick={() => {
                  reset();
                  setStep("form");
                }}
                className={`${_cls.btnGhost} px-3.5 py-2 text-xs font-bold`}
              >
                再邀请一个
              </button>
              <button
                onClick={handleClose}
                className={`${_cls.btnPrimary} px-4 py-2 text-xs font-bold`}
              >
                完成，关闭
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const miniCardStyle: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${S.border}`,
  borderRadius: S.radiusSm,
};
