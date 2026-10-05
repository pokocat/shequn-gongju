import type { IdentityRole } from "./accountTypes";

export type InviteStatus = "pending" | "submitted" | "approved" | "rejected" | "expired";

export type InviteRecord = {
  id: string;
  inviterUid: string;
  inviterName?: string;        // 冗余显示用
  inviteeName: string;
  inviteePhone: string;
  inviteeEmail: string;
  suggestedIdentities: IdentityRole[];
  suggestedProjectIds: string[];
  inviteCode: string;
  inviteLink: string;
  status: InviteStatus;
  rejectReason?: string;
  submittedAt?: string;
  submission?: InviteSubmission;
  reviewedBy?: string;
  reviewedByUid?: string;
  reviewedAt?: string;
  resultAccountUid?: string;
  expireAt: string;
  createdAt: string;
};

export type InviteSubmission = {
  realName: string;
  idCardNo?: string;
  phoneVerified: boolean;
  department?: string;
  jobTitle?: string;
  resumeRemark?: string;
};

export const inviteStatusMeta: Record<InviteStatus, { label: string; bg: string; color: string; dot: string }> = {
  pending:   { label: "待填写",   bg: "#f0f0f0", color: "#555",   dot: "#999" },
  submitted: { label: "待审核",   bg: "#ccff00", color: "#000",   dot: "#0d0d0d" },
  approved:  { label: "已通过",   bg: "#e6fce6", color: "#07c160", dot: "#07c160" },
  rejected:  { label: "已驳回",   bg: "#ffe0e0", color: "#c00",   dot: "#ff3b30" },
  expired:   { label: "已过期",   bg: "#f5f5f5", color: "#999",   dot: "#ccc" },
};

export function genInviteCode(len = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function daysLater(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 16).replace("T", " ");
}

// 6 条 mock 邀请，覆盖 5 种状态各至少 1 条
export const mockInvites: InviteRecord[] = [
  {
    id: "inv_001",
    inviterUid: "acc_chenyuhang",
    inviterName: "陈宇航",
    inviteeName: "冯雪峰",
    inviteePhone: "13900000101",
    inviteeEmail: "fengxuefeng@future.com",
    suggestedIdentities: [{ roleKey: "eco_leader", scopeType: "eco", scopeIds: ["eco-3"], label: "生态负责人", permissionSummary: "知识付费生态负责人" }],
    suggestedProjectIds: ["p_course_train"],
    inviteCode: "KF7X2M9Q",
    inviteLink: "https://app.example.com/register?code=KF7X2M9Q",
    status: "pending",
    expireAt: daysLater(5),
    createdAt: "2026-08-24 10:12",
  },
  {
    id: "inv_002",
    inviterUid: "acc_linquingyao",
    inviterName: "林清瑶",
    inviteeName: "韩雨辰",
    inviteePhone: "13900000102",
    inviteeEmail: "hanyuchen@pet.com",
    suggestedIdentities: [{ roleKey: "saas_owner", scopeType: "saas", scopeIds: ["saas-3"], label: "SaaS负责人", permissionSummary: "宠物生态SaaS负责人" }],
    suggestedProjectIds: ["p_chengdu"],
    inviteCode: "PT4L6N2V",
    inviteLink: "https://app.example.com/register?code=PT4L6N2V",
    status: "submitted",
    submittedAt: "2026-08-25 14:30",
    submission: {
      realName: "韩雨辰",
      idCardNo: "5101**********1234",
      phoneVerified: true,
      department: "宠物事业部",
      jobTitle: "SaaS 运营总监",
      resumeRemark: "5 年 SaaS 行业经验，曾任某宠物平台产品负责人",
    },
    expireAt: daysLater(3),
    createdAt: "2026-08-23 15:40",
  },
  {
    id: "inv_003",
    inviterUid: "acc_wusiyuan",
    inviterName: "吴思远",
    inviteeName: "陈思远",
    inviteePhone: "13900000103",
    inviteeEmail: "chensiyuan@health.com",
    suggestedIdentities: [{ roleKey: "platform_op", scopeType: "platform", scopeIds: ["platform-1"], label: "平台运营", permissionSummary: "健康运营平台日常运营" }],
    suggestedProjectIds: ["p_beijing_pro", "p_shanghai_exp"],
    inviteCode: "HE8R3T5K",
    inviteLink: "https://app.example.com/register?code=HE8R3T5K",
    status: "approved",
    reviewedBy: "陈宇航",
    reviewedByUid: "acc_chenyuhang",
    reviewedAt: "2026-08-25 09:18",
    resultAccountUid: "acc_siyuan01",
    expireAt: daysLater(4),
    createdAt: "2026-08-22 11:05",
  },
  {
    id: "inv_004",
    inviterUid: "acc_zhoukairui",
    inviterName: "周楷瑞",
    inviteeName: "林晓彤",
    inviteePhone: "13900000104",
    inviteeEmail: "linxiaotong@edu.com",
    suggestedIdentities: [{ roleKey: "teacher", scopeType: "project", scopeIds: ["project-5"], label: "老师", permissionSummary: "7日训练营讲师" }],
    suggestedProjectIds: ["p_course_train"],
    inviteCode: "ED2Y7P1J",
    inviteLink: "https://app.example.com/register?code=ED2Y7P1J",
    status: "rejected",
    rejectReason: "缺少教育行业相关资质证明，建议补充后重新提交",
    reviewedBy: "林清瑶",
    reviewedByUid: "acc_linquingyao",
    reviewedAt: "2026-08-24 16:40",
    expireAt: daysLater(6),
    createdAt: "2026-08-21 09:55",
  },
  {
    id: "inv_005",
    inviterUid: "acc_linxiaoyan",
    inviterName: "林小燕",
    inviteeName: "赵嘉豪",
    inviteePhone: "13900000105",
    inviteeEmail: "zhaojiahao@beauty.com",
    suggestedIdentities: [{ roleKey: "regional_op", scopeType: "city", scopeIds: ["广州", "深圳"], label: "区域运营", permissionSummary: "广深地区区域运营" }],
    suggestedProjectIds: ["p_guangzhou_train"],
    inviteCode: "BM9W5Q4N",
    inviteLink: "https://app.example.com/register?code=BM9W5Q4N",
    status: "expired",
    expireAt: "2026-08-20 12:00",
    createdAt: "2026-08-13 12:00",
  },
  {
    id: "inv_006",
    inviterUid: "acc_wusiyuan",
    inviterName: "吴思远",
    inviteeName: "徐婉清",
    inviteePhone: "13900000106",
    inviteeEmail: "xuwanqing@service.com",
    suggestedIdentities: [{ roleKey: "service", scopeType: "project", scopeIds: ["project-1"], label: "客服", permissionSummary: "PRO会员项目客服" }],
    suggestedProjectIds: ["p_beijing_pro"],
    inviteCode: "CS6K1D7L",
    inviteLink: "https://app.example.com/register?code=CS6K1D7L",
    status: "submitted",
    submittedAt: "2026-08-25 18:05",
    submission: {
      realName: "徐婉清",
      phoneVerified: true,
      department: "客户服务中心",
      jobTitle: "资深客服专员",
      resumeRemark: "3 年私域客服经验，擅长社群问题响应与转化",
    },
    expireAt: daysLater(6),
    createdAt: "2026-08-24 19:10",
  },
];
