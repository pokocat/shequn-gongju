// ─── 审批终审通过后的业务回写 hook ─────────────────────────
// 监听 approvals 状态变化，当审批单变为 approved 时执行业务回写

import { useEffect, useRef } from "react";
import { useApprovals, useAccounts, useTools, useInvites } from "../App";
import type { Approval, ApprovalPayload } from "../data/approvalTypes";
import type { SystemAccount, BindingStatus } from "../data/accountTypes";
import type { CommunicationTool } from "../data/communicationTools";

// 状态优先级（与 CommunicationToolManagement 一致）
const statusRank: Record<string, number> = {
  idle: 1,
  in_use: 2,
  pending_transfer: 3,
  abnormal: 4,
};
const rankToStatus: Record<number, BindingStatus> = {
  1: "idle",
  2: "in_use",
  3: "pending_transfer",
  4: "abnormal",
};

function nowStr(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

/** 邀请注册终审通过：创建系统账号 + 更新邀请状态 */
function writebackInviteRegister(
  payload: Extract<ApprovalPayload, { type: "invite_register" }>,
  ctx: {
    setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>;
    setInvites: React.Dispatch<React.SetStateAction<any[]>>;
  }
) {
  const now = nowStr();
  const newUid = `acc_${payload.inviteCode.toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
  const newAccount: SystemAccount = {
    uid: newUid,
    name: payload.inviteeName,
    email: payload.inviteeEmail,
    phone: payload.inviteePhone,
    status: "active",
    bindingStatus: payload.bindingStatus,
    identities: payload.identities,
    assignedToolIds: [],
    projectIds: payload.projectIds,
    createdAt: now,
  };
  ctx.setAccounts((prev) => [newAccount, ...prev]);
  ctx.setInvites((prev) =>
    prev.map((it: any) =>
      it.id === payload.inviteId
        ? {
            ...it,
            status: "approved",
            reviewedAt: now,
            resultAccountUid: newUid,
          }
        : it
    )
  );
}

/** 工具交接终审通过：更新工具 boundAccountId + 账号 assignedToolIds/bindingStatus */
function writebackToolHandover(
  payload: Extract<ApprovalPayload, { type: "tool_handover" }>,
  ctx: {
    tools: CommunicationTool[];
    setTools: React.Dispatch<React.SetStateAction<CommunicationTool[]>>;
    accounts: SystemAccount[];
    setAccounts: React.Dispatch<React.SetStateAction<SystemAccount[]>>;
  }
) {
  const { tools, setTools, accounts, setAccounts } = ctx;

  // 1. 更新工具
  setTools((prev) =>
    prev.map((t) => {
      if (t.id !== payload.toolId) return t;
      const next: CommunicationTool = {
        ...t,
        boundAccountId: payload.toAccountId || "",
        status: payload.toAccountId ? "in_use" : "idle",
      };
      return next;
    })
  );

  // 2. 更新原持有人：移除该工具
  const affectedIds = new Set<string>();
  if (payload.fromAccountId) affectedIds.add(payload.fromAccountId);
  if (payload.toAccountId) affectedIds.add(payload.toAccountId);

  setAccounts((prev) =>
    prev.map((a) => {
      if (!affectedIds.has(a.uid)) return a;

      // 计算新的 assignedToolIds
      let toolIds = new Set(a.assignedToolIds);
      if (payload.fromAccountId === a.uid) {
        toolIds.delete(payload.toolId);
      }
      if (payload.toAccountId === a.uid) {
        toolIds.add(payload.toolId);
      }

      // 重算 bindingStatus（取所有绑定工具的最高优先级状态）
      const boundStatuses = Array.from(toolIds).map((tid) => {
        if (tid === payload.toolId) {
          return payload.toAccountId ? "in_use" : "idle";
        }
        const t = tools.find((x) => x.id === tid);
        return t?.status ?? "idle";
      });
      const maxRank = boundStatuses.reduce(
        (m, s) => Math.max(m, statusRank[s] ?? 1),
        0
      );
      const finalStatus: BindingStatus =
        maxRank === 0 ? "idle" : rankToStatus[maxRank];

      return {
        ...a,
        assignedToolIds: Array.from(toolIds),
        bindingStatus: finalStatus,
      };
    })
  );
}

/** 主 hook：在组件中调用，自动监听审批状态变化并执行回写 */
export function useApprovalWriteback() {
  const { approvals } = useApprovals();
  const { accounts, setAccounts } = useAccounts();
  const { tools, setTools } = useTools();
  const { invites, setInvites } = useInvites();
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    approvals.forEach((ap: Approval) => {
      if (ap.status === "approved" && !processedRef.current.has(ap.id)) {
        processedRef.current.add(ap.id);
        const payload = ap.payload;
        switch (payload.type) {
          case "invite_register":
            writebackInviteRegister(payload, { setAccounts, setInvites });
            break;
          case "tool_handover":
            writebackToolHandover(payload, {
              tools,
              setTools,
              accounts,
              setAccounts,
            });
            break;
          // saas_onboard / platform_onboard / subscription_open
          // 需访问 EcosystemManagement 内部 state，本轮不回写
          // settlement / permission_change / refund 占位，不回写
          default:
            break;
        }
      }
    });
  }, [approvals, accounts, tools, setAccounts, setTools, setInvites]);
}
