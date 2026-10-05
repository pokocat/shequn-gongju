// ─── 审批中心：类型定义 ─────────────────────────────────────
// 多级审批流程引擎：统一数据模型 + FlowTemplate 注册表 + 引擎函数

import type { IdentityRole, BindingStatus } from "./accountTypes";

// ─── 单据类型 ───────────────────────────────────────────────
export type ApprovalType =
  | "invite_register"    // 邀请注册审核
  | "saas_onboard"       // SaaS 入驻申请
  | "platform_onboard"   // 平台入驻申请
  | "subscription_open"  // 订阅开通/续费
  | "tool_handover"      // 通讯工具交接
  | "settlement"         // 分润/提现结算
  | "permission_change"  // 权限变更
  | "refund";            // 退款申请

// ─── 审批状态 ───────────────────────────────────────────────
export type ApprovalStatus = "pending" | "in_progress" | "approved" | "rejected";

// ─── 流程节点 ───────────────────────────────────────────────
export type FlowNode = {
  nodeKey: string;
  nodeName: string;
  approverRole: string;
};

// ─── 流程模板 ───────────────────────────────────────────────
export type FlowTemplate = {
  type: ApprovalType;
  name: string;
  icon: string;
  nodes: FlowNode[];
};

// ─── 审批历史记录 ───────────────────────────────────────────
export type ApprovalHistoryItem = {
  nodeKey: string;
  nodeName: string;
  actor: string;
  action: "submit" | "approve" | "reject" | "flow";
  comment?: string;
  time: string;
};

// ─── 业务回写 payload（联合类型，按 type 区分） ─────────────
export type ApprovalPayload =
  | {
      type: "invite_register";
      inviteId: string;
      inviteeName: string;
      inviteePhone: string;
      inviteeEmail: string;
      inviteCode: string;
      identities: IdentityRole[];
      projectIds: string[];
      bindingStatus: BindingStatus;
    }
  | {
      type: "tool_handover";
      toolId: string;
      toolName: string;
      toolType: string;
      fromAccountId: string;
      fromAccountName: string;
      toAccountId: string;
      toAccountName: string;
    }
  | {
      type: "saas_onboard";
      name: string;
      eco: string;
      desc: string;
    }
  | {
      type: "platform_onboard";
      name: string;
      saas: string;
      eco: string;
      desc: string;
    }
  | {
      type: "subscription_open";
      planKey: string;
      planName: string;
      subscriberName: string;
      priceCny: number;
      cycle: "yearly" | "monthly" | "once";
    }
  | { type: "settlement" | "permission_change" | "refund" };

// ─── 审批单据 ───────────────────────────────────────────────
export type Approval = {
  id: string;
  type: ApprovalType;
  title: string;
  submitter: string;
  submitterUid?: string;
  description: string;
  status: ApprovalStatus;
  currentNodeIndex: number;
  detail: Record<string, string>;
  payload: ApprovalPayload;
  history: ApprovalHistoryItem[];
  createdAt: string;
  urgent?: boolean;
};

// ─── FlowTemplate 注册表 ────────────────────────────────────
export const FLOW_TEMPLATES: Record<ApprovalType, FlowTemplate> = {
  invite_register: {
    type: "invite_register",
    name: "邀请注册",
    icon: "UserPlus",
    nodes: [
      { nodeKey: "inviter_review", nodeName: "邀请人初审", approverRole: "邀请人" },
      { nodeKey: "eco_ops_review", nodeName: "生态运营终审", approverRole: "超级生态运营" },
    ],
  },
  saas_onboard: {
    type: "saas_onboard",
    name: "SaaS 入驻",
    icon: "Building2",
    nodes: [
      { nodeKey: "eco_leader_review", nodeName: "生态负责人审批", approverRole: "生态负责人" },
      { nodeKey: "super_finance_review", nodeName: "超级生态财务复核", approverRole: "超级生态财务" },
    ],
  },
  platform_onboard: {
    type: "platform_onboard",
    name: "平台入驻",
    icon: "Layers",
    nodes: [
      { nodeKey: "saas_owner_review", nodeName: "SaaS 负责人审批", approverRole: "SaaS 负责人" },
      { nodeKey: "eco_ops_review", nodeName: "生态运营复核", approverRole: "生态运营" },
    ],
  },
  subscription_open: {
    type: "subscription_open",
    name: "订阅开通",
    icon: "Package",
    nodes: [
      { nodeKey: "saas_owner_review", nodeName: "SaaS/平台负责人审批", approverRole: "SaaS/平台负责人" },
      { nodeKey: "super_finance_review", nodeName: "超级生态财务终审", approverRole: "超级生态财务" },
    ],
  },
  tool_handover: {
    type: "tool_handover",
    name: "工具交接",
    icon: "ArrowRightLeft",
    nodes: [
      { nodeKey: "from_owner_confirm", nodeName: "原持有人确认", approverRole: "原账号持有人" },
      { nodeKey: "to_owner_confirm", nodeName: "新持有人确认", approverRole: "新账号持有人" },
      { nodeKey: "eco_ops_review", nodeName: "生态运营终审", approverRole: "生态运营" },
    ],
  },
  settlement: {
    type: "settlement",
    name: "分润/提现",
    icon: "CreditCard",
    nodes: [
      { nodeKey: "tier_leader_review", nodeName: "层级主管审批", approverRole: "层级主管" },
      { nodeKey: "finance_review", nodeName: "财务终审", approverRole: "财务" },
    ],
  },
  permission_change: {
    type: "permission_change",
    name: "权限变更",
    icon: "Shield",
    nodes: [
      { nodeKey: "direct_leader_review", nodeName: "直属主管审批", approverRole: "直属主管" },
      { nodeKey: "permission_admin_review", nodeName: "权限管理员终审", approverRole: "权限管理员" },
    ],
  },
  refund: {
    type: "refund",
    name: "退款申请",
    icon: "RotateCcw",
    nodes: [
      { nodeKey: "cs_review", nodeName: "客服初审", approverRole: "客服主管" },
      { nodeKey: "finance_review", nodeName: "财务终审", approverRole: "财务" },
    ],
  },
};

// ─── 状态显示配置 ───────────────────────────────────────────
export const approvalStatusMeta: Record<
  ApprovalStatus,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "待审批", bg: "#ffd600", color: "#000000" },
  in_progress: { label: "审批中", bg: "#1a1a1a", color: "#ffffff" },
  approved: { label: "已同意", bg: "#ccff00", color: "#000000" },
  rejected: { label: "已拒绝", bg: "#1a1a1a", color: "#ccff00" },
};

// ─── 引擎函数 ───────────────────────────────────────────────
function nowStr(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function genId(): string {
  return `ap_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/** 创建审批单 */
export function createApproval(
  type: ApprovalType,
  data: {
    title: string;
    submitter: string;
    submitterUid?: string;
    description: string;
    detail?: Record<string, string>;
    payload: ApprovalPayload;
    urgent?: boolean;
  }
): Approval {
  const template = FLOW_TEMPLATES[type];
  const now = nowStr();
  return {
    id: genId(),
    type,
    title: data.title,
    submitter: data.submitter,
    submitterUid: data.submitterUid,
    description: data.description,
    status: "pending",
    currentNodeIndex: 0,
    detail: data.detail || {},
    payload: data.payload,
    history: [
      {
        nodeKey: template.nodes[0].nodeKey,
        nodeName: template.nodes[0].nodeName,
        actor: data.submitter,
        action: "submit",
        time: now,
      },
    ],
    createdAt: now,
    urgent: data.urgent,
  };
}

/** 推进到下一节点（同意当前节点） */
export function advanceNode(
  approval: Approval,
  actor: string,
  comment?: string
): Approval {
  const template = FLOW_TEMPLATES[approval.type];
  const nextIndex = approval.currentNodeIndex + 1;
  const now = nowStr();
  const currentNode = template.nodes[approval.currentNodeIndex];

  // 终审通过
  if (nextIndex >= template.nodes.length) {
    return {
      ...approval,
      status: "approved",
      history: [
        ...approval.history,
        {
          nodeKey: currentNode.nodeKey,
          nodeName: currentNode.nodeName,
          actor,
          action: "approve" as const,
          comment,
          time: now,
        },
      ],
    };
  }

  // 推进到下一节点
  const nextNode = template.nodes[nextIndex];
  return {
    ...approval,
    status: "in_progress",
    currentNodeIndex: nextIndex,
    history: [
      ...approval.history,
      {
        nodeKey: currentNode.nodeKey,
        nodeName: currentNode.nodeName,
        actor,
        action: "approve" as const,
        comment,
        time: now,
      },
      {
        nodeKey: nextNode.nodeKey,
        nodeName: nextNode.nodeName,
        actor: "系统",
        action: "flow" as const,
        comment: `流转至「${nextNode.nodeName}」`,
        time: now,
      },
    ],
  };
}

/** 拒绝审批 */
export function rejectApproval(
  approval: Approval,
  actor: string,
  comment: string
): Approval {
  const template = FLOW_TEMPLATES[approval.type];
  const currentNode = template.nodes[approval.currentNodeIndex];
  const now = nowStr();
  return {
    ...approval,
    status: "rejected",
    history: [
      ...approval.history,
      {
        nodeKey: currentNode.nodeKey,
        nodeName: currentNode.nodeName,
        actor,
        action: "reject" as const,
        comment,
        time: now,
      },
    ],
  };
}

// ─── Mock 数据 ──────────────────────────────────────────────
export const mockApprovals: Approval[] = [
  // 1. 邀请注册 — pending（刚提交，节点0）
  {
    id: "ap_001",
    type: "invite_register",
    title: "邀请注册：韩雨辰",
    submitter: "林清瑶",
    submitterUid: "acc_linquingyao",
    description: "林清瑶邀请韩雨辰注册为 SaaS 负责人，已提交材料待初审",
    status: "pending",
    currentNodeIndex: 0,
    detail: {
      被邀请人: "韩雨辰",
      手机号: "13900000102",
      邮箱: "hanyuchen@pet.com",
      建议身份: "SaaS负责人",
      建议项目: "p_chengdu",
      邀请码: "PT4L6N2V",
    },
    payload: {
      type: "invite_register",
      inviteId: "inv_002",
      inviteeName: "韩雨辰",
      inviteePhone: "13900000102",
      inviteeEmail: "hanyuchen@pet.com",
      inviteCode: "PT4L6N2V",
      identities: [
        {
          roleKey: "saas_owner",
          scopeType: "saas",
          scopeIds: ["saas-3"],
          label: "SaaS负责人",
          permissionSummary: "宠物生态SaaS负责人",
        },
      ],
      projectIds: ["p_chengdu"],
      bindingStatus: "pending",
    },
    history: [
      {
        nodeKey: "inviter_review",
        nodeName: "邀请人初审",
        actor: "林清瑶",
        action: "submit",
        time: "2026-08-25 14:30",
      },
    ],
    createdAt: "2026-08-25 14:30",
    urgent: false,
  },
  // 2. 邀请注册 — in_progress（初审通过，流转到终审）
  {
    id: "ap_002",
    type: "invite_register",
    title: "邀请注册：徐婉清",
    submitter: "吴思远",
    submitterUid: "acc_wusiyuan",
    description: "吴思远邀请徐婉清注册为客服，初审已通过待终审",
    status: "in_progress",
    currentNodeIndex: 1,
    detail: {
      被邀请人: "徐婉清",
      手机号: "13900000106",
      邮箱: "xuwanqing@service.com",
      建议身份: "客服",
      建议项目: "p_beijing_pro",
      邀请码: "CS6K1D7L",
    },
    payload: {
      type: "invite_register",
      inviteId: "inv_006",
      inviteeName: "徐婉清",
      inviteePhone: "13900000106",
      inviteeEmail: "xuwanqing@service.com",
      inviteCode: "CS6K1D7L",
      identities: [
        {
          roleKey: "service",
          scopeType: "project",
          scopeIds: ["project-1"],
          label: "客服",
          permissionSummary: "PRO会员项目客服",
        },
      ],
      projectIds: ["p_beijing_pro"],
      bindingStatus: "pending",
    },
    history: [
      {
        nodeKey: "inviter_review",
        nodeName: "邀请人初审",
        actor: "吴思远",
        action: "submit",
        time: "2026-08-25 18:05",
      },
      {
        nodeKey: "inviter_review",
        nodeName: "邀请人初审",
        actor: "吴思远",
        action: "approve",
        comment: "材料齐全，身份推荐合理",
        time: "2026-08-25 19:00",
      },
      {
        nodeKey: "eco_ops_review",
        nodeName: "生态运营终审",
        actor: "系统",
        action: "flow",
        comment: "流转至「生态运营终审」",
        time: "2026-08-25 19:00",
      },
    ],
    createdAt: "2026-08-25 18:05",
    urgent: false,
  },
  // 3. SaaS 入驻 — in_progress（生态负责人已批，财务复核中）
  {
    id: "ap_003",
    type: "saas_onboard",
    title: "SaaS 入驻：私域工具（宠物生态）",
    submitter: "林清瑶",
    submitterUid: "acc_linquingyao",
    description: "在宠物生态下新建 SaaS 系统「私域工具」，生态负责人已批，待财务复核",
    status: "in_progress",
    currentNodeIndex: 1,
    detail: {
      SaaS名称: "私域工具",
      所属生态: "宠物生态",
      描述: "私域账号资产+微信社群一体化",
      预估年费: "¥59,800",
    },
    payload: {
      type: "saas_onboard",
      name: "私域工具",
      eco: "宠物生态",
      desc: "私域账号资产+微信社群一体化",
    },
    history: [
      {
        nodeKey: "eco_leader_review",
        nodeName: "生态负责人审批",
        actor: "林清瑶",
        action: "submit",
        time: "2026-08-24 10:00",
      },
      {
        nodeKey: "eco_leader_review",
        nodeName: "生态负责人审批",
        actor: "陈宇航",
        action: "approve",
        comment: "符合生态战略方向",
        time: "2026-08-24 14:00",
      },
      {
        nodeKey: "super_finance_review",
        nodeName: "超级生态财务复核",
        actor: "系统",
        action: "flow",
        comment: "流转至「超级生态财务复核」",
        time: "2026-08-24 14:00",
      },
    ],
    createdAt: "2026-08-24 10:00",
    urgent: false,
  },
  // 4. 平台入驻 — pending
  {
    id: "ap_004",
    type: "platform_onboard",
    title: "平台入驻：健康运营平台",
    submitter: "吴思远",
    submitterUid: "acc_wusiyuan",
    description: "在私域工具 SaaS 下新建平台「健康运营平台」",
    status: "pending",
    currentNodeIndex: 0,
    detail: {
      平台名称: "健康运营平台",
      所属SaaS: "私域工具",
      所属生态: "健康医药美业生态",
      描述: "健康类目运营平台",
    },
    payload: {
      type: "platform_onboard",
      name: "健康运营平台",
      saas: "私域工具",
      eco: "健康医药美业生态",
      desc: "健康类目运营平台",
    },
    history: [
      {
        nodeKey: "saas_owner_review",
        nodeName: "SaaS 负责人审批",
        actor: "吴思远",
        action: "submit",
        time: "2026-08-26 09:00",
      },
    ],
    createdAt: "2026-08-26 09:00",
    urgent: false,
  },
  // 5. 订阅开通 — approved（终审通过）
  {
    id: "ap_005",
    type: "subscription_open",
    title: "订阅开通：SaaS·标准版（宠物生态）",
    submitter: "林清瑶",
    submitterUid: "acc_linquingyao",
    description: "宠物生态开通 SaaS·标准版年费订阅，已终审通过",
    status: "approved",
    currentNodeIndex: 1,
    detail: {
      套餐: "SaaS·标准版",
      订阅方: "宠物生态",
      年费: "¥59,800",
      周期: "年付",
    },
    payload: {
      type: "subscription_open",
      planKey: "saas-standard",
      planName: "SaaS·标准版",
      subscriberName: "宠物生态",
      priceCny: 59800,
      cycle: "yearly",
    },
    history: [
      {
        nodeKey: "saas_owner_review",
        nodeName: "SaaS/平台负责人审批",
        actor: "林清瑶",
        action: "submit",
        time: "2026-08-20 10:00",
      },
      {
        nodeKey: "saas_owner_review",
        nodeName: "SaaS/平台负责人审批",
        actor: "林清瑶",
        action: "approve",
        time: "2026-08-20 11:00",
      },
      {
        nodeKey: "super_finance_review",
        nodeName: "超级生态财务终审",
        actor: "系统",
        action: "flow",
        comment: "流转至「超级生态财务终审」",
        time: "2026-08-20 11:00",
      },
      {
        nodeKey: "super_finance_review",
        nodeName: "超级生态财务终审",
        actor: "财务主管",
        action: "approve",
        comment: "预算充足，同意开通",
        time: "2026-08-20 15:00",
      },
    ],
    createdAt: "2026-08-20 10:00",
    urgent: false,
  },
  // 6. 工具交接 — in_progress（原持有人已确认，待新持有人确认，3级第2节点）
  {
    id: "ap_006",
    type: "tool_handover",
    title: "工具交接：wx_cd_01（赵志远 → 周楷瑞）",
    submitter: "HR系统",
    description: "赵志远离职，微信号 wx_cd_01 交接至周楷瑞，原持有人已确认",
    status: "in_progress",
    currentNodeIndex: 1,
    detail: {
      工具: "wx_cd_01",
      类型: "微信",
      原持有人: "赵志远",
      新持有人: "周楷瑞",
      粉丝数: "342",
      城市: "成都",
    },
    payload: {
      type: "tool_handover",
      toolId: "t_008",
      toolName: "wx_cd_01",
      toolType: "wechat",
      fromAccountId: "acc_zhaozhiyuan",
      fromAccountName: "赵志远",
      toAccountId: "acc_zhoukairui",
      toAccountName: "周楷瑞",
    },
    history: [
      {
        nodeKey: "from_owner_confirm",
        nodeName: "原持有人确认",
        actor: "HR系统",
        action: "submit",
        time: "2026-08-25 09:00",
      },
      {
        nodeKey: "from_owner_confirm",
        nodeName: "原持有人确认",
        actor: "赵志远",
        action: "approve",
        comment: "确认交接，已清空个人数据",
        time: "2026-08-25 10:00",
      },
      {
        nodeKey: "to_owner_confirm",
        nodeName: "新持有人确认",
        actor: "系统",
        action: "flow",
        comment: "流转至「新持有人确认」",
        time: "2026-08-25 10:00",
      },
    ],
    createdAt: "2026-08-25 09:00",
    urgent: true,
  },
  // 7. 工具交接 — approved（3级全部完成）
  {
    id: "ap_007",
    type: "tool_handover",
    title: "工具交接：wx_xa_01（孙浩 → 待分配）",
    submitter: "HR系统",
    description: "孙浩离职，微信号 wx_xa_01 已交接至待分配状态",
    status: "approved",
    currentNodeIndex: 2,
    detail: {
      工具: "wx_xa_01",
      类型: "微信",
      原持有人: "孙浩",
      新持有人: "待分配",
      粉丝数: "218",
      城市: "西安",
    },
    payload: {
      type: "tool_handover",
      toolId: "t_xa_01",
      toolName: "wx_xa_01",
      toolType: "wechat",
      fromAccountId: "acc_sunhao",
      fromAccountName: "孙浩",
      toAccountId: "",
      toAccountName: "待分配",
    },
    history: [
      {
        nodeKey: "from_owner_confirm",
        nodeName: "原持有人确认",
        actor: "HR系统",
        action: "submit",
        time: "2026-08-24 10:00",
      },
      {
        nodeKey: "from_owner_confirm",
        nodeName: "原持有人确认",
        actor: "孙浩",
        action: "approve",
        time: "2026-08-24 11:00",
      },
      {
        nodeKey: "to_owner_confirm",
        nodeName: "新持有人确认",
        actor: "系统",
        action: "flow",
        comment: "流转至「新持有人确认」",
        time: "2026-08-24 11:00",
      },
      {
        nodeKey: "to_owner_confirm",
        nodeName: "新持有人确认",
        actor: "系统管理员",
        action: "approve",
        comment: "同意接收为待分配",
        time: "2026-08-24 13:00",
      },
      {
        nodeKey: "eco_ops_review",
        nodeName: "生态运营终审",
        actor: "系统",
        action: "flow",
        comment: "流转至「生态运营终审」",
        time: "2026-08-24 13:00",
      },
      {
        nodeKey: "eco_ops_review",
        nodeName: "生态运营终审",
        actor: "系统管理员",
        action: "approve",
        comment: "已确认账号信息，执行交接",
        time: "2026-08-24 14:30",
      },
    ],
    createdAt: "2026-08-24 10:00",
    urgent: false,
  },
  // 8. 退款申请 — pending
  {
    id: "ap_008",
    type: "refund",
    title: "申请退款 ¥4,800",
    submitter: "王建国",
    description: "已使用服务30天，因个人原因申请全额退款，高风险客诉",
    status: "pending",
    currentNodeIndex: 0,
    detail: {
      订单编号: "ORD2026070503",
      产品: "代理授权费",
      金额: "¥4,800",
      已使用天数: "30天",
      退款原因: "个人原因",
      风险等级: "高",
    },
    payload: { type: "refund" },
    history: [
      {
        nodeKey: "cs_review",
        nodeName: "客服初审",
        actor: "王建国",
        action: "submit",
        time: "2026-08-26 08:23",
      },
    ],
    createdAt: "2026-08-26 08:23",
    urgent: true,
  },
  // 9. 分润/提现 — in_progress
  {
    id: "ap_009",
    type: "settlement",
    title: "申请提现 ¥3,200",
    submitter: "李梦华",
    description: "申请将 ¥3,200 佣金提现至支付宝账户",
    status: "in_progress",
    currentNodeIndex: 1,
    detail: {
      提现金额: "¥3,200",
      提现渠道: "支付宝",
      账户: "limenghua@example.com",
      可提余额: "¥5,680",
      本月已提: "¥2,000",
    },
    payload: { type: "settlement" },
    history: [
      {
        nodeKey: "tier_leader_review",
        nodeName: "层级主管审批",
        actor: "李梦华",
        action: "submit",
        time: "2026-08-26 10:15",
      },
      {
        nodeKey: "tier_leader_review",
        nodeName: "层级主管审批",
        actor: "区域主管",
        action: "approve",
        time: "2026-08-26 11:00",
      },
      {
        nodeKey: "finance_review",
        nodeName: "财务终审",
        actor: "系统",
        action: "flow",
        comment: "流转至「财务终审」",
        time: "2026-08-26 11:00",
      },
    ],
    createdAt: "2026-08-26 10:15",
    urgent: false,
  },
  // 10. 权限变更 — rejected
  {
    id: "ap_010",
    type: "permission_change",
    title: "申请给陈明添加「群分配」权限",
    submitter: "杭州区域负责人",
    description: "申请为陈明添加「群分配」编辑权限，已在终审环节被驳回",
    status: "rejected",
    currentNodeIndex: 1,
    detail: {
      目标用户: "陈明",
      申请权限: "群分配（编辑）",
      原有权限: "群分配（只读）",
      申请原因: "杭州区域运营需要",
    },
    payload: { type: "permission_change" },
    history: [
      {
        nodeKey: "direct_leader_review",
        nodeName: "直属主管审批",
        actor: "杭州区域负责人",
        action: "submit",
        time: "2026-08-25 16:30",
      },
      {
        nodeKey: "direct_leader_review",
        nodeName: "直属主管审批",
        actor: "杭州区域负责人",
        action: "approve",
        time: "2026-08-25 17:00",
      },
      {
        nodeKey: "permission_admin_review",
        nodeName: "权限管理员终审",
        actor: "系统",
        action: "flow",
        comment: "流转至「权限管理员终审」",
        time: "2026-08-25 17:00",
      },
      {
        nodeKey: "permission_admin_review",
        nodeName: "权限管理员终审",
        actor: "权限管理员",
        action: "reject",
        comment: "陈明岗位未变更，暂不调整权限范围",
        time: "2026-08-25 18:00",
      },
    ],
    createdAt: "2026-08-25 16:30",
    urgent: false,
  },
];
