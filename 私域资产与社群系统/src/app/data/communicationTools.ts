// ─────────────────────────────────────────────────────────────
// ResourceTool = 原 CommunicationTool + 微信台账非重复字段 + 四类型专属运营字段 + 5阶段生命周期状态
// 保留 CommunicationTool 名称为 type alias，保证旧组件（CommunicationToolManagement、审批中心）不报错。
// ─────────────────────────────────────────────────────────────

export type CommunicationToolType = "wecom" | "wechat" | "phone" | "email" | "media" | "workspace" | "developer" | "business";

export type ToolRiskLevel = "normal" | "warning" | "high";

/** 5 阶段生命周期：未启用 → 养号中 → 空闲(项目号池可领) → 使用中(已发放到人) → 异常/待交接 → 已停用/归档 */
export type ToolHealthStatus = "not_enabled" | "nurturing" | "idle" | "in_use" | "pending_transfer" | "abnormal" | "disabled" | "archived";

/** 微信/媒体/企微/手机 通用操作日志（详情抽屉Tab-4） */
export type ResourceToolLog = {
  id: string;
  time: string;
  actor: string;
  action: "注册入库" | "送回养号" | "养号完成" | "分配到项目" | "发放到人" | "改归属人" | "改项目" | "触发风控" | "工具交接审批" | "审批通过交接" | "停用" | "归档" | "加入矩阵" | "申请商单" | "批量导入" | "编辑详情";
  summary: string;
  details?: Record<string, unknown>;
};

/** 媒体号发布时间线单项（Mockup中的近7天内容）*/
export type MediaPublishTimelineItem = {
  date: string;
  title: string;
  contentType: "短视频" | "图文" | "直播" | "合集";
  playViews: number;
};

/** 紧急联系人（微信专属）*/
export type EmergencyContact = {
  name: string;
  wechatId?: string;
  phone?: string;
  note: string;
};

// ─── 四类型专属字段 ───────────────────────────────────────────
type WeChatSpecificFields = {
  /** 性别:男/女/— */
  gender?: string;
  /** QQ绑定号 */
  qqNo?: string;
  /** 绑定邮箱 */
  boundEmail?: string;
  /** 是否已实名认证（个人号） */
  certified?: boolean;
  /** 近30天邀请新入群人数（加粉）*/
  invitedNew30d?: number;
  /** 累计扫码次数（活码） */
  scanCount?: number;
  /** 微信号密码（加密存储，展示为"已配置/未配置"） */
  wechatPasswordConfigured?: boolean;
  /** QQ密保等级 */
  qqSecurityLevel?: "未配置" | "基础" | "高级";
  /** 邮箱密保 */
  emailSecurityConfigured?: boolean;
  /** 紧急联系人 */
  emergencyContacts?: EmergencyContact[];
  /** 绑定微信号的身份证实名状态文本 */
  idCardRealName?: string;
  /** 银行卡绑定状态 */
  bankCardConfigured?: boolean;
  /** 支付密码是否配置 */
  payPasswordConfigured?: boolean;
  /** 近7天好友增长数，用于列表"最近动作"列展示 */
  last7dFriendsGrowth?: number;
  /** 微信号二维码展示状态 */
  qrCodeBound?: boolean;
  /** 部门/岗位（客服号/招商号等，用于按类型视角专属列）*/
  accountPosition?: string;
};

type WeComSpecificFields = {
  /** 企业名（已有别名）*/
  enterpriseName?: string;
  /** 企业部门 */
  department?: string;
  /** 是否开通会话存档 */
  chatArchiveEnabled?: boolean;
  /** 分公司/主体 */
  subsidiary?: string;
  /** 近7天企业消息数 */
  last7dMessageCount?: number;
  /** 外部联系人（客户）总数 */
  externalContactCount?: number;
};

type PhoneSpecificFields = {
  /** 运营商：移动/联通/电信/广电 */
  carrier?: "移动" | "联通" | "电信" | "广电";
  /** 实名状态与日期 */
  realNameStatus?: "已实名" | "未实名" | "实名中";
  realNameDate?: string;
  /** 套餐描述 */
  planName?: string;
  /** 通话限制 */
  callRestriction?: "无限制" | "禁止外呼" | "仅紧急呼叫";
  /** 注册微信号数量 */
  boundWechatCount?: number;
  /** 最后通话日期 */
  lastCallDate?: string;
};

type EmailSpecificFields = {
  /** 邮箱服务商与恢复邮箱 */
  emailProvider?: string;
  recoveryEmail?: string;
  /** 邮箱是否完成安全验证 */
  emailVerified?: boolean;
};

type MediaSpecificFields = {
  /** 平台（已有别名）:抖音/小红书/公众号/B站/视频号/快手 等 */
  mediaPlatform?: string;
  /** 认证类型:未认证/企业蓝V/个人黄V/MCN签约 */
  certifiedType?: "未认证" | "企业蓝V" | "个人黄V" | "官方认证";
  /** 认证主体描述，如"私域·社群咨询" */
  certifiedSubject?: string;
  /** 创作者中心等级:未开通/L1/L2/L3/L4 等 */
  creatorLevel?: string;
  /** 内容标签，如 ["私域运营","社群操盘"] */
  contentTags?: string[];
  /** 矩阵归属:如"北京生态·账号矩阵（主号）" */
  matrixGroup?: string;
  /** MCN签约状态 */
  mcnStatus?: "自营·未签约" | "已签约·独家" | "已签约·非独家";
  /** 带货权限 */
  commerceCapabilities?: string[]; // 如 ["小黄车","抖音小店","团购券"]
  /** 粉丝画像Top1描述 */
  fansProfileTop?: string;
  /** 本月商单机会数量+佣金预估 */
  commercialOpportunity?: { pending: number; estimatedCommissionYuan: number };
  /** 协同人员: 如{剪辑:"林小燕"} */
  collaborators?: Record<string, string>;
  /** 养号/入驻完成日 */
  nurturingCompletedDate?: string;
  /** 近7天发布时间线 */
  last7Publish?: MediaPublishTimelineItem[];
  /** 近30日发布数 */
  publish30d?: number;
  /** 近30日播放/阅读总数 */
  play30d?: number;
  /** 近7日涨粉 */
  fansGrowth7d?: number;
  /** 粉丝总数（替代friendCount语义，两者都保留读即可）*/
  fansCount?: number;
};

// ─── 合并后的大实体（原CommunicationTool兼容） ──────────────
export interface CommunicationTool
  extends WeChatSpecificFields,
    WeComSpecificFields,
    PhoneSpecificFields,
    EmailSpecificFields,
    MediaSpecificFields {
  id: string;
  type: CommunicationToolType;
  identifier: string;
  name: string;
  /** 5 阶段生命周期枚举 */
  status: ToolHealthStatus;
  riskLevel: ToolRiskLevel;
  /** 归属人 uid（SystemAccount.uid，可空=空闲） */
  boundAccountId: string | null;
  /** 分配到的项目ID数组（可空=未分配项目）*/
  boundProjectIds: string[];
  dailyAddLimit: number;
  todayAdded: number;
  friendCount: number;
  groupCount: number;
  lastActiveDate: string;
  /** 运营台账视角中"最后登录/最后发布"日期，和lastActiveDate同步但语义更清晰 */
  lastLoginDate?: string;
  /** 登录设备：如"MacOS · Chrome 126" */
  lastLoginDevice?: string;
  /** 注册/采购入库日期 */
  onboardDate?: string;
  /** 备注（已有） */
  notes?: string;
  /** 全量操作日志时间线（详情抽屉Tab-4来源）*/
  operationLogs?: ResourceToolLog[];
  // ---- 已有别名字段，保留兼容 ----
  boundPhone?: string; // 微信/手机号通用绑定号
  corpName?: string;   // 企微企业名 = enterpriseName
  nickname?: string;   // 微信昵称 = name 的对应别名，保留
  platform?: string;   // 媒体平台 = mediaPlatform
}

/** 新语义命名：统一使用 ResourceTool 作为融合模块的实体名 */
export type ResourceTool = CommunicationTool;

// ─── 状态元数据（5阶段 + 风险等级 + 类型标签色） ───────────────
export const statusMeta: Record<ToolHealthStatus, { label: string; badgeBg: string; badgeColor: string; borderColor: string }> = {
  not_enabled:      { label: "未启用",    badgeBg: "#f3f4f6", badgeColor: "#555",      borderColor: "#e5e7eb" },
  nurturing:        { label: "养号中",    badgeBg: "#fffbeb", badgeColor: "#b45309",  borderColor: "#ffd600" },
  idle:             { label: "空闲",      badgeBg: "#eff6ff", badgeColor: "#1d4ed8",  borderColor: "#bfdbfe" },
  in_use:           { label: "使用中",    badgeBg: "#ccff00", badgeColor: "#000",      borderColor: "#b3cc00" },
  pending_transfer: { label: "待交接",    badgeBg: "#1a1a1a", badgeColor: "#ccff00",  borderColor: "#111" },
  abnormal:         { label: "异常",      badgeBg: "#fff0f0", badgeColor: "#c53030",  borderColor: "#fecaca" },
  disabled:         { label: "已停用",    badgeBg: "#f3f4f6", badgeColor: "#888",      borderColor: "#d4d4d4" },
  archived:         { label: "已归档",    badgeBg: "#f3f4f6", badgeColor: "#666",      borderColor: "#bbb" },
};

export const riskMeta: Record<ToolRiskLevel, { label: string; color: string; bg: string }> = {
  normal:  { label: "正常", color: "#07c160", bg: "#ecfdf5" },
  warning: { label: "关注", color: "#ff9500", bg: "#fff7ed" },
  high:    { label: "高危", color: "#ff3b30", bg: "#fff0f0" },
};

export const typeMeta: Record<CommunicationToolType, { label: string; short: string; color: string; bg: string }> = {
  wecom:  { label: "企业微信", short: "企微", color: "#fff", bg: "#0d0d0d" },
  wechat: { label: "个人微信", short: "微信", color: "#fff", bg: "#07c160" },
  phone:  { label: "手机号",   short: "手机", color: "#fff", bg: "#4a90e2" },
  email:  { label: "邮箱",     short: "邮箱", color: "#fff", bg: "#7c3aed" },
  media:  { label: "媒体账号", short: "媒体", color: "#fff", bg: "#ff6b35" },
  workspace: { label: "协作与 AI", short: "协作", color: "#fff", bg: "#2563eb" },
  developer: { label: "开发与基础设施", short: "开发", color: "#fff", bg: "#334155" },
  business: { label: "业务系统", short: "业务", color: "#fff", bg: "#0f766e" },
};

/**
 * 只有「有社媒账号安全风控风险」的类型才需要养号：
 *   ✅ wecom（企业微信） / wechat（个人微信） / media（抖音 · 视频号 · 小红书 · B站 · 快手 等）
 *   ❌ phone / email / workspace / developer / business —— 没有被封风险，直接可用
 */
export const NURTURE_TYPES: Set<CommunicationToolType> = new Set(["wecom", "wechat", "media"]);
export function needsNurturing(type: CommunicationToolType): boolean {
  return NURTURE_TYPES.has(type);
}

// ─── 扩展阶段后的 17 条初始化工具数据 ─────────────────────────
export const initialTools: ResourceTool[] = [
  // ── 企微 4 条 ──────────────────────────────────────────────
  {
    id: "t_001", type: "wecom", identifier: "corp_beijing_01", name: "北京企业微信-招商",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_eco_invite"], dailyAddLimit: 50, todayAdded: 12, friendCount: 487, groupCount: 3,
    lastActiveDate: "2026-08-25", lastLoginDate: "2026-08-25", lastLoginDevice: "MacOS · Wecom客户端",
    onboardDate: "2026-02-15", corpName: "健康运营（北京）有限公司", enterpriseName: "健康运营（北京）有限公司",
    department: "生态招商部", chatArchiveEnabled: true, subsidiary: "北京PRO会员服务",
    last7dMessageCount: 1892, externalContactCount: 487,
    operationLogs: [
      { id: "l1", time: "2026-02-15 10:00", actor: "系统初始化", action: "注册入库", summary: "采购企业微信席位1号，导入为未启用" },
      { id: "l2", time: "2026-02-24 09:00", actor: "系统初始化", action: "养号完成", summary: "养号9天通过，进入空闲号池" },
      { id: "l3", time: "2026-03-10 14:00", actor: "系统初始化", action: "分配到项目", summary: "分配给生态招商项目" },
      { id: "l4", time: "2026-04-03 09:10", actor: "陈宇航", action: "发放到人", summary: "绑定给吴思远(acc_wusiyuan)" },
    ],
    notes: "北京PRO+生态招商双项目归属的主号"
  },
  {
    id: "t_002", type: "wecom", identifier: "corp_shanghai_01", name: "上海企业微信-林小燕",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_linxiaoyan",
    boundProjectIds: ["p_shanghai_exp"], dailyAddLimit: 50, todayAdded: 8, friendCount: 356, groupCount: 2,
    lastActiveDate: "2026-08-25", lastLoginDate: "2026-08-25", onboardDate: "2026-02-16",
    corpName: "健康运营（上海）有限公司", enterpriseName: "健康运营（上海）有限公司",
    department: "体验官运营部", chatArchiveEnabled: true, subsidiary: "上海体验官项目",
    last7dMessageCount: 1120, externalContactCount: 356,
    operationLogs: [{ id: "l1", time: "2026-02-16 10:00", actor: "系统初始化", action: "注册入库", summary: "" }],
  },
  {
    id: "t_003", type: "wecom", identifier: "corp_guangzhou_01", name: "广州企业微信-刘刚",
    status: "abnormal", riskLevel: "high", boundAccountId: "acc_liugang",
    boundProjectIds: ["p_guangzhou_train"], dailyAddLimit: 30, todayAdded: 0, friendCount: 234, groupCount: 1,
    lastActiveDate: "2026-08-15", lastLoginDate: "2026-08-15", onboardDate: "2026-02-20",
    corpName: "健康运营（广州）有限公司", enterpriseName: "健康运营（广州）有限公司",
    department: "代理培训部", chatArchiveEnabled: false, subsidiary: "广州代理培训",
    last7dMessageCount: 0, externalContactCount: 234,
    operationLogs: [{ id: "l1", time: "2026-08-20 02:30", actor: "系统巡检", action: "触发风控", summary: "连续30天未登录，标记异常/高危" }],
    notes: "30天未登录，需立即停用或交接"
  },
  {
    id: "t_004", type: "wecom", identifier: "corp_chengdu_01", name: "成都企业微信-赵志远",
    status: "pending_transfer", riskLevel: "warning", boundAccountId: "acc_zhaozhiyuan",
    boundProjectIds: ["p_chengdu"], dailyAddLimit: 30, todayAdded: 3, friendCount: 67, groupCount: 1,
    lastActiveDate: "2026-08-20", onboardDate: "2026-03-02",
    corpName: "健康运营（成都）有限公司", enterpriseName: "健康运营（成都）有限公司",
    department: "成都分公司运营", chatArchiveEnabled: true, subsidiary: "成都分站",
    last7dMessageCount: 210, externalContactCount: 67,
    operationLogs: [{ id: "l1", time: "2026-08-22 15:20", actor: "赵志远", action: "工具交接审批", summary: "申请离职交接，审批中" }],
    notes: "人员离职待交接"
  },

  // ── 个人微信 6 条（引入wechat专属字段）──────────────────────
  {
    id: "t_005", type: "wechat", identifier: "wx_bj_01", name: "思远",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 30, todayAdded: 8, friendCount: 1823, groupCount: 16,
    lastActiveDate: "2026-08-25", lastLoginDate: "2026-08-25 09:12", lastLoginDevice: "iPhone 15 Pro · WeChat 8.0.48",
    onboardDate: "2026-03-12", boundPhone: "138-0012-3456", nickname: "思远",
    gender: "男", qqNo: "287634521", boundEmail: "wsy@eco-saas.com",
    certified: true, invitedNew30d: 42, scanCount: 386,
    wechatPasswordConfigured: true, qqSecurityLevel: "高级", emailSecurityConfigured: true,
    idCardRealName: "已实名", bankCardConfigured: true, payPasswordConfigured: true,
    last7dFriendsGrowth: 128, qrCodeBound: true, accountPosition: "招商号",
    emergencyContacts: [
      { name: "林小燕", wechatId: "wx_sh_01", phone: "139-0012-3457", note: "紧急交接与安全核验" },
      { name: "陈明", wechatId: "wx_hz_01", phone: "158-0012-3464", note: "账号异常与登录告警" },
    ],
    operationLogs: [
      { id: "l1", time: "2026-03-12 09:00", actor: "系统初始化", action: "注册入库", summary: "采购手机号卡+注册微信" },
      { id: "l2", time: "2026-03-22 09:00", actor: "系统初始化", action: "养号完成", summary: "10天养号通过" },
      { id: "l3", time: "2026-04-01 10:00", actor: "系统初始化", action: "分配到项目", summary: "分配给北京PRO" },
      { id: "l4", time: "2026-04-03 09:10", actor: "陈宇航", action: "发放到人", summary: "绑定吴思远" },
      { id: "l5", time: "2026-08-24 19:10", actor: "吴思远", action: "编辑详情", summary: "更新紧急联系人信息" },
    ],
  },
  {
    id: "t_006", type: "wechat", identifier: "wx_sh_01", name: "小燕",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_linxiaoyan",
    boundProjectIds: ["p_shanghai_exp"], dailyAddLimit: 30, todayAdded: 5, friendCount: 356, groupCount: 2,
    lastActiveDate: "2026-08-25", onboardDate: "2026-03-13", boundPhone: "139-0012-3457", nickname: "小燕",
    gender: "女", qqNo: "345782910", boundEmail: "lxy@eco-saas.com",
    certified: true, invitedNew30d: 38, scanCount: 312, last7dFriendsGrowth: 62,
    accountPosition: "客服号", emergencyContacts: [{ name: "吴思远", phone: "138-0012-3456", note: "区域负责人" }],
  },
  {
    id: "t_007", type: "wechat", identifier: "wx_gz_01", name: "刘刚",
    status: "abnormal", riskLevel: "high", boundAccountId: "acc_liugang",
    boundProjectIds: ["p_guangzhou_train"], dailyAddLimit: 20, todayAdded: 0, friendCount: 234, groupCount: 1,
    lastActiveDate: "2026-08-05", onboardDate: "2026-03-18", boundPhone: "138-0012-3458", nickname: "刘刚",
    gender: "男", qqNo: "412893047", boundEmail: "lg@eco-saas.com", certified: false,
    invitedNew30d: 21, scanCount: 187, last7dFriendsGrowth: 0, accountPosition: "客服号",
    operationLogs: [{ id: "l1", time: "2026-08-19 02:30", actor: "系统巡检", action: "触发风控", summary: "长期未登录，标记异常高危" }],
    notes: "需尽快回收并重新发放"
  },
  {
    id: "t_008", type: "wechat", identifier: "wx_cd_01", name: "志远",
    status: "pending_transfer", riskLevel: "warning", boundAccountId: "acc_zhaozhiyuan",
    boundProjectIds: ["p_chengdu"], dailyAddLimit: 20, todayAdded: 2, friendCount: 67, groupCount: 1,
    lastActiveDate: "2026-08-22", onboardDate: "2026-03-25", boundPhone: "152-0012-3461", nickname: "志远",
    gender: "男", qqNo: "523019483", certified: false, accountPosition: "客服号",
  },
  {
    id: "t_009", type: "wechat", identifier: "wx_sz_01", name: "梦华",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_limenghua",
    boundProjectIds: ["p_shenzhen"], dailyAddLimit: 30, todayAdded: 6, friendCount: 310, groupCount: 2,
    lastActiveDate: "2026-08-25", onboardDate: "2026-03-28", boundPhone: "186-0012-3462", nickname: "梦华",
    gender: "女", certified: true, last7dFriendsGrowth: 44, accountPosition: "招商号",
  },
  // 养号中
  {
    id: "t_010n", type: "wechat", identifier: "wx_nj_02", name: "待启用·南京2",
    status: "nurturing", riskLevel: "normal", boundAccountId: null,
    boundProjectIds: [], dailyAddLimit: 10, todayAdded: 0, friendCount: 18, groupCount: 0,
    lastActiveDate: "2026-08-26", onboardDate: "2026-08-20", boundPhone: "151-0012-3478", nickname: "—",
    gender: "—", certified: false, notes: "养号第6天/共10天，进度60%"
  },
  // 未启用
  {
    id: "t_010", type: "wechat", identifier: "wx_bj_02", name: "待分配微信号-北京2",
    status: "not_enabled", riskLevel: "normal", boundAccountId: null,
    boundProjectIds: [], dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0,
    lastActiveDate: "—", onboardDate: "2026-08-24", boundPhone: "135-0012-3463", nickname: "—",
    gender: "—", certified: false, notes: "新到卡+注册，待进入养号流程"
  },

  // ── 手机号 3 条 ────────────────────────────────────────────
  {
    id: "t_011", type: "phone", identifier: "phone_138_0012_3456", name: "北京主手机号",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0,
    lastActiveDate: "2026-08-25", onboardDate: "2025-11-10", boundPhone: "138-0012-3456",
    carrier: "移动", realNameStatus: "已实名", realNameDate: "2025-11-10",
    planName: "5G畅享299套餐 · 不限量", callRestriction: "无限制",
    boundWechatCount: 2, lastCallDate: "2026-08-25",
  },
  {
    id: "t_012", type: "phone", identifier: "phone_139_0012_3457", name: "上海主手机号",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_linxiaoyan",
    boundProjectIds: ["p_shanghai_exp"], dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0,
    lastActiveDate: "2026-08-25", onboardDate: "2025-11-11", boundPhone: "139-0012-3457",
    carrier: "联通", realNameStatus: "已实名", realNameDate: "2025-11-11",
    planName: "冰激凌239套餐 · 3000分钟", callRestriction: "无限制",
    boundWechatCount: 2, lastCallDate: "2026-08-25",
  },
  {
    id: "t_012b", type: "phone", identifier: "phone_unused_01", name: "闲置联通号-杭州",
    status: "idle", riskLevel: "normal", boundAccountId: null, boundProjectIds: [],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0, lastActiveDate: "2026-07-10",
    onboardDate: "2025-12-01", boundPhone: "176-0012-3499",
    carrier: "联通", realNameStatus: "已实名", realNameDate: "2025-12-01",
    planName: "天王星199套餐", callRestriction: "无限制",
    boundWechatCount: 1, lastCallDate: "2026-07-10",
    notes: "杭州分站编制外闲置号，可批拨"
  },

  // ── 邮箱 2 条 ─────────────────────────────────────────────
  {
    id: "t_012e", type: "email", identifier: "ops@fenglema.com", name: "运营主邮箱",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0,
    lastActiveDate: "2026-08-25", lastLoginDate: "2026-08-25", onboardDate: "2025-10-12",
    emailProvider: "企业邮箱", recoveryEmail: "security@fenglema.com", emailVerified: true,
    emailSecurityConfigured: true, notes: "项目通知与账号安全恢复邮箱",
  },
  {
    id: "t_012f", type: "email", identifier: "service@fenglema.com", name: "客服服务邮箱",
    status: "idle", riskLevel: "normal", boundAccountId: null, boundProjectIds: [],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 0, groupCount: 0,
    lastActiveDate: "2026-08-10", onboardDate: "2026-01-09",
    emailProvider: "企业邮箱", recoveryEmail: "admin@fenglema.com", emailVerified: true,
    emailSecurityConfigured: false, notes: "待分配给客服团队",
  },

  // ── 媒体号 4 条（含抖音媒体专属展开模板mockup：dy_bj_01） ────
  {
    id: "t_013", type: "media", identifier: "mp_eco_official", name: "官方公众号",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_beijing_pro"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 12800, groupCount: 0,
    lastActiveDate: "2026-08-25", onboardDate: "2025-09-01",
    platform: "公众号", mediaPlatform: "公众号",
    certifiedType: "官方认证", certifiedSubject: "健康运营·私域生态",
    creatorLevel: "L5", contentTags: ["行业观察","政策解读","案例库"],
    matrixGroup: "生态主矩阵（主号）", mcnStatus: "自营·未签约",
    commerceCapabilities: ["菜单栏广告","小程序跳转"],
    fansProfileTop: "男35-44岁 · 私域从业者 42%",
    commercialOpportunity: { pending: 1, estimatedCommissionYuan: 3200 },
    collaborators: { 内容撰写: "林小燕", 视觉: "外聘设计" },
    nurturingCompletedDate: "2025-11-10",
    fansCount: 12800, fansGrowth7d: 186, publish30d: 12, play30d: 48000,
    last7Publish: [
      { date: "08-25", title: "《SaaS生态协作的3个误区》", contentType: "图文", playViews: 6200 },
      { date: "08-23", title: "《8月城市分站数据汇总》", contentType: "图文", playViews: 4100 },
      { date: "08-20", title: "《项目制运营怎么做》", contentType: "合集", playViews: 9800 },
    ],
  },
  // 🔴 重点：北京PRO项目·吴思远名下 抖音 dy_bj_01 粉丝4.2w（Mockup中媒体展开的模板实体）
  {
    id: "dy_bj_01", type: "media", identifier: "dy_bj_01", name: "抖音·北京 @eco_beijing",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan",
    boundProjectIds: ["p_beijing_pro"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 42180, groupCount: 0,
    lastActiveDate: "2026-08-26", onboardDate: "2025-11-08", lastLoginDate: "2026-08-26 22:10", lastLoginDevice: "iPhone 15 · 抖音 32.5",
    platform: "抖音", mediaPlatform: "抖音",
    certifiedType: "企业蓝V", certifiedSubject: "社群·私域咨询",
    creatorLevel: "L4",
    contentTags: ["私域运营","社群操盘","门店增长"],
    matrixGroup: "北京生态·账号矩阵（主号）",
    mcnStatus: "自营·未签约",
    commerceCapabilities: ["小黄车", "抖音小店", "团购券"],
    fansProfileTop: "女 25-34岁 · 北京 38%",
    commercialOpportunity: { pending: 3, estimatedCommissionYuan: 9400 },
    collaborators: { "内容运营": "吴思远", "剪辑": "林小燕" },
    nurturingCompletedDate: "2026-02-10",
    fansCount: 42180, fansGrowth7d: 1108, publish30d: 18, play30d: 986000,
    last7Publish: [
      { date: "08-24", title: "从0到1搭建一个高转化社群", contentType: "短视频", playViews: 124000 },
      { date: "08-23", title: "私域社群话术模板（合集）", contentType: "图文",   playViews: 18000 },
      { date: "08-21", title: "3个常见社群运营坑",         contentType: "短视频", playViews: 86000 },
      { date: "08-19", title: "北京分站首月复盘（直播回放）", contentType: "直播",   playViews: 23000 },
      { date: "08-18", title: "城市分站和总店怎么分工",      contentType: "短视频", playViews: 61000 },
    ],
    notes: "核心引流主号，每周二、四、六日更",
  },
  {
    id: "t_014", type: "media", identifier: "dy_eco_official", name: "@eco_official",
    status: "in_use", riskLevel: "normal", boundAccountId: null,
    boundProjectIds: [],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 28600, groupCount: 0,
    lastActiveDate: "2026-08-25", onboardDate: "2025-10-10",
    platform: "抖音", mediaPlatform: "抖音",
    certifiedType: "企业蓝V", certifiedSubject: "生态·品牌官方",
    creatorLevel: "L3", contentTags: ["品牌故事","官方活动"],
    matrixGroup: "生态主矩阵", mcnStatus: "自营·未签约",
    commerceCapabilities: ["小黄车"],
    fansProfileTop: "混合 全国",
    commercialOpportunity: { pending: 0, estimatedCommissionYuan: 0 },
    fansCount: 28600, fansGrowth7d: 520, publish30d: 9, play30d: 312000,
  },
  {
    id: "t_015", type: "media", identifier: "xhs_eco_life", name: "eco_life 小红书",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_linxiaoyan",
    boundProjectIds: ["p_shanghai_exp"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 9300, groupCount: 0,
    lastActiveDate: "2026-08-24", onboardDate: "2026-01-08",
    platform: "小红书", mediaPlatform: "小红书",
    certifiedType: "个人黄V", certifiedSubject: "生活方式博主",
    creatorLevel: "L3", contentTags: ["健康生活","城市探店"],
    matrixGroup: "生态内容矩阵（子号）", mcnStatus: "自营·未签约",
    commerceCapabilities: ["薯店","蒲公英商单"],
    fansProfileTop: "女 25-32岁 · 长三角 52%",
    commercialOpportunity: { pending: 2, estimatedCommissionYuan: 2800 },
    fansCount: 9300, fansGrowth7d: 328, publish30d: 14, play30d: 210000,
  },
  // ── 内容与微信生态补充 ─────────────────────────────────────
  {
    id: "mini_eco_01", type: "media", identifier: "wxmini_eco_service", name: "聚域服务小程序",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 6300, groupCount: 0, lastActiveDate: "2026-08-27", onboardDate: "2026-01-18",
    platform: "小程序", mediaPlatform: "小程序", certifiedType: "官方认证", certifiedSubject: "聚域私域服务平台",
    matrixGroup: "微信生态·服务入口", contentTags: ["会员服务", "订单查询"], fansCount: 6300, publish30d: 4, play30d: 12000,
  },
  // ── 协作与 AI ─────────────────────────────────────────────
  {
    id: "work_figma_01", type: "workspace", identifier: "figma_team_eco", name: "聚域设计工作区",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 18, groupCount: 0, lastActiveDate: "2026-08-28", lastLoginDate: "2026-08-28", onboardDate: "2025-12-10",
    platform: "Figma", notes: "团队设计席位，管理员：吴思远", operationLogs: [{ id: "l1", time: "2025-12-10 10:00", actor: "系统初始化", action: "注册入库", summary: "创建团队工作区" }],
  },
  {
    id: "work_chatgpt_01", type: "workspace", identifier: "chatgpt_team_eco", name: "聚域 ChatGPT 团队",
    status: "in_use", riskLevel: "warning", boundAccountId: "acc_linxiaoyan", boundProjectIds: ["p_shanghai_exp"],
    dailyAddLimit: 0, todayAdded: 0, friendCount: 12, groupCount: 0, lastActiveDate: "2026-08-27", lastLoginDate: "2026-08-27", onboardDate: "2026-02-04",
    platform: "ChatGPT", notes: "Team 订阅，MFA 已配置，账单由运营负责", operationLogs: [{ id: "l1", time: "2026-02-04 09:00", actor: "系统初始化", action: "注册入库", summary: "订阅团队工作区" }],
  },
  {
    id: "work_claude_01", type: "workspace", identifier: "claude_team_eco", name: "聚域 Claude 工作区",
    status: "idle", riskLevel: "normal", boundAccountId: null, boundProjectIds: [], dailyAddLimit: 0, todayAdded: 0, friendCount: 8, groupCount: 0,
    lastActiveDate: "2026-08-16", onboardDate: "2026-03-02", platform: "Claude", notes: "待分配给内容与研发团队",
  },
  {
    id: "work_workbuddy_01", type: "workspace", identifier: "workbuddy_eco", name: "聚域 WorkBuddy",
    status: "nurturing", riskLevel: "normal", boundAccountId: null, boundProjectIds: [], dailyAddLimit: 0, todayAdded: 0, friendCount: 4, groupCount: 0,
    lastActiveDate: "2026-08-25", onboardDate: "2026-08-25", platform: "WorkBuddy", notes: "安全配置期，待绑定组织与 MFA",
  },
  {
    id: "work_trae_01", type: "workspace", identifier: "trae_eco_dev", name: "聚域 Trae 开发账号",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 6, groupCount: 0,
    lastActiveDate: "2026-08-28", onboardDate: "2026-04-12", platform: "Trae", notes: "研发协作账号，绑定北京项目",
  },
  // ── 开发与基础设施 ─────────────────────────────────────────
  {
    id: "dev_github_01", type: "developer", identifier: "github_pokocat", name: "聚域 GitHub 组织",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 14, groupCount: 8,
    lastActiveDate: "2026-08-28", lastLoginDate: "2026-08-28", onboardDate: "2025-10-20", platform: "GitHub", notes: "组织含私域系统仓库，部署 Token 由管理员保管",
  },
  {
    id: "dev_domain_01", type: "developer", identifier: "fenglema.com", name: "蜂乐玛主域名",
    status: "in_use", riskLevel: "warning", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 2, groupCount: 0,
    lastActiveDate: "2026-08-20", onboardDate: "2025-08-01", platform: "域名", notes: "到期日 2027-08-01，需提前 30 天续费",
  },
  // ── 业务系统 ──────────────────────────────────────────────
  {
    id: "sys_scrm_01", type: "business", identifier: "scrm_eco_console", name: "聚域 SCRM 控制台",
    status: "in_use", riskLevel: "normal", boundAccountId: "acc_wusiyuan", boundProjectIds: ["p_beijing_pro"], dailyAddLimit: 0, todayAdded: 0, friendCount: 26, groupCount: 0,
    lastActiveDate: "2026-08-29", lastLoginDate: "2026-08-29", onboardDate: "2026-01-01", platform: "SCRM", notes: "超级管理员账号，支持项目级权限分配",
  },
  {
    id: "sys_crm_01", type: "business", identifier: "crm_eco_sales", name: "聚域 CRM 销售系统",
    status: "pending_transfer", riskLevel: "warning", boundAccountId: "acc_linxiaoyan", boundProjectIds: ["p_shanghai_exp"], dailyAddLimit: 0, todayAdded: 0, friendCount: 9, groupCount: 0,
    lastActiveDate: "2026-08-26", onboardDate: "2026-02-14", platform: "CRM", notes: "原管理员岗位调整，等待交接审批",
  },
];

export { initialTools as initialResourceTools };

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT · 项目实体（轻量，聚合数据从 tools 动态计算）
   ═══════════════════════════════════════════════════════════════════════════ */

export type ProjectStatus = "active" | "preparing" | "archived";

export interface Project {
  id: string;                    // "p_beijing_pro"
  name: string;                  // "北京 PRO 会员"
  short?: string;                // "FLM-BJ-PRO"
  subtitle?: string;             // "健康运营 · PRO 会员服务线"
  location?: string;             // "北京"
  owner?: string;                // "吴思源"
  ownerUid?: string;             // "acc_wusiyuan"
  status: ProjectStatus;
  budget?: string;               // "¥50万/季"
  createdAt?: string;            // "2026-01-15"
  /** 可选子项目（层级关系） */
  children?: string[];
}

export const initialProjects: Project[] = [
  {
    id: "p_beijing_pro", name: "北京 PRO 会员", short: "FLM-BJ-PRO",
    subtitle: "健康运营 · PRO 会员服务线", location: "北京",
    owner: "吴思源", ownerUid: "acc_wusiyuan", status: "active",
    budget: "¥50万/季", createdAt: "2026-01-15",
  },
  {
    id: "p_shanghai_exp", name: "上海体验官", short: "SH-EXP",
    subtitle: "上海地区种子用户运营", location: "上海",
    owner: "林小燕", ownerUid: "acc_linxiaoyan", status: "active",
    budget: "¥30万/季", createdAt: "2026-02-01",
  },
  {
    id: "p_guangzhou_train", name: "广州代理培训", short: "GZ-TRN",
    subtitle: "华南代理体系搭建", location: "广州",
    owner: "刘刚", ownerUid: "acc_liugang", status: "active",
    budget: "¥20万/季", createdAt: "2026-03-01",
  },
  {
    id: "p_chengdu", name: "成都分站", short: "CD-BRANCH",
    subtitle: "西南地区运营中心", location: "成都",
    owner: "赵志远", ownerUid: "acc_zhaozhiyuan", status: "preparing",
    budget: "¥15万/季", createdAt: "2026-04-12",
  },
  {
    id: "p_shenzhen", name: "深圳代理", short: "SZ-AGENT",
    subtitle: "大湾区代理招募", location: "深圳",
    owner: "李梦华", ownerUid: "acc_limenghua", status: "active",
    createdAt: "2026-05-01",
  },
  {
    id: "p_eco_invite", name: "生态招商", short: "ECO-INVITE",
    subtitle: "生态伙伴招商与渠道拓展", location: "全国",
    owner: "吴思源", ownerUid: "acc_wusiyuan", status: "active",
    budget: "¥80万/年", createdAt: "2026-02-10",
  },
  {
    id: "p_hangzhou_branch", name: "杭州分站", short: "HZ-BRANCH",
    subtitle: "华东地区内容中心", location: "杭州",
    owner: "陈明", ownerUid: "acc_chenming", status: "preparing", createdAt: "2026-06-01",
  },
  {
    id: "p_wuhan_branch", name: "武汉分站", short: "WH-BRANCH",
    subtitle: "华中地区运营中心", location: "武汉",
    owner: "王芳", ownerUid: "acc_wangfang", status: "active", createdAt: "2026-05-10",
  },
  {
    id: "p_nanjing_branch", name: "南京分站", short: "NJ-BRANCH",
    subtitle: "华东地区用户运营", location: "南京",
    owner: "张磊", ownerUid: "acc_zhanglei", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "p_xian_branch", name: "西安分站", short: "XA-BRANCH",
    subtitle: "西北地区筹备中", location: "西安",
    owner: "孙浩", ownerUid: "acc_sunhao", status: "preparing", createdAt: "2026-06-15",
  },
];

/** 平台库存（未分配给任何项目的账号）的虚拟项目 ID */
export const PLATFORM_POOL_ID = "__platform_pool__";

export function projectStatusBadge(status: ProjectStatus) {
  return {
    active:    { label: "进行中", color: "#07c160", bg: "#ecfdf5" },
    preparing: { label: "筹备中", color: "#ff9500", bg: "#fff7ed" },
    archived:  { label: "已归档", color: "#9ca3af", bg: "#f3f4f6" },
  }[status];
}

/** 从 tools 聚合出项目的统计数据（类型分布 / KPI / 风险等） */
export function aggregateProject(projectId: string, tools: ResourceTool[]) {
  const projectTools = projectId === PLATFORM_POOL_ID
    ? tools.filter(t => !(t.boundProjectIds && t.boundProjectIds.length))
    : tools.filter(t => t.boundProjectIds?.includes(projectId));

  const typeBreakdown: Record<string, number> = {};
  let inUse = 0, abnormal = 0, pendingTransfer = 0, idle = 0;
  let todayAdded = 0, friendTotal = 0;
  let riskHigh = 0, riskWarning = 0;

  for (const t of projectTools) {
    typeBreakdown[t.type] = (typeBreakdown[t.type] || 0) + 1;
    if (t.status === "in_use") inUse++;
    else if (t.status === "abnormal") abnormal++;
    else if (t.status === "pending_transfer") pendingTransfer++;
    else if (t.status === "idle" || t.status === "not_enabled" || t.status === "nurturing") idle++;
    todayAdded += t.todayAdded || 0;
    friendTotal += t.friendCount || 0;
    if (t.riskLevel === "high") riskHigh++;
    else if (t.riskLevel === "warning") riskWarning++;
  }

  return {
    toolCount: projectTools.length,
    inUse, abnormal, pendingTransfer, idle,
    todayAdded, friendTotal, riskHigh, riskWarning,
    typeBreakdown,
    tools: projectTools,
  };
}
