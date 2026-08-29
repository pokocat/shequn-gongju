export type IdentityRole = {
  roleKey: "super_admin" | "eco_leader" | "eco_coo" | "saas_owner" | "saas_op" | "platform_admin" | "platform_op" | "project_owner" | "regional_op" | "service" | "teacher";
  scopeType: "global" | "eco" | "saas" | "platform" | "project" | "city";
  scopeIds: string[];
  label: string;
  permissionSummary: string;
};

export type BindingStatus = "idle" | "in_use" | "pending_transfer" | "abnormal";

export type AccountOperation = {
  id: string;
  type: "create" | "edit" | "enable" | "disable" | "assign_tools" | "assign_projects" | "change_identities" | "invite_approved";
  actor: string;
  time: string;
  summary: string;
  details?: Record<string, any>;
};

export type SystemAccount = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "disabled" | "pending";
  bindingStatus: BindingStatus;
  identities: IdentityRole[];
  assignedToolIds: string[];
  projectIds: string[];
  createdAt: string;
  operationLogs: AccountOperation[];
};

export const bindingStatusMeta: Record<BindingStatus, { label: string; bg: string; color: string }> = {
  idle:             { label: "空闲",     bg: "#f0f0f0", color: "#555" },
  in_use:           { label: "使用中",   bg: "#ccff00", color: "#000" },
  pending_transfer: { label: "待交接",   bg: "#ffd600", color: "#000" },
  abnormal:         { label: "异常",     bg: "#ff6b6b", color: "#fff" },
};

export const roleKeyMeta: Record<IdentityRole["roleKey"], { label: string; defaultScope: IdentityRole["scopeType"]; summary: string }> = {
  super_admin:   { label: "超级管理员", defaultScope: "global",   summary: "全局数据、多生态管控、全权限" },
  eco_leader:    { label: "生态负责人",   defaultScope: "eco",     summary: "单个/多个生态的负责人" },
  eco_coo:       { label: "生态COO",      defaultScope: "eco",     summary: "生态运营与跨SaaS协调" },
  saas_owner:    { label: "SaaS负责人",   defaultScope: "saas",    summary: "单个SaaS系统的负责人" },
  saas_op:       { label: "SaaS运营",     defaultScope: "saas",    summary: "SaaS系统的运营支持" },
  platform_admin:{ label: "平台管理员",   defaultScope: "platform",summary: "单个平台的管理负责人" },
  platform_op:   { label: "平台运营",     defaultScope: "platform",summary: "平台的日常运营" },
  project_owner: { label: "项目负责人",   defaultScope: "project", summary: "具体项目的负责人" },
  regional_op:   { label: "区域运营",     defaultScope: "city",    summary: "指定城市的区域运营" },
  service:       { label: "客服",         defaultScope: "project", summary: "项目客服与会员服务" },
  teacher:       { label: "老师",         defaultScope: "project", summary: "项目服务老师/讲师" },
};

export type ScopeTypeLabelMap = Record<IdentityRole["scopeType"], { label: string; options: { id: string; name: string }[] }>;

export function buildScopeTypeLabelMap(
  ecoItems: { id: number | string; name: string }[],
  saasItems: { id: number | string; name: string }[],
  platformItems: { id: number | string; name: string }[],
  projectItems: { id: number | string; name: string }[]
): ScopeTypeLabelMap {
  return {
    global:   { label: "全局", options: [{ id: "*", name: "全部范围" }] },
    eco:      { label: "生态", options: ecoItems.map(e => ({ id: `eco-${e.id}`, name: e.name })) },
    saas:     { label: "SaaS", options: saasItems.map(s => ({ id: `saas-${s.id}`, name: s.name })) },
    platform: { label: "平台", options: platformItems.map(p => ({ id: `platform-${p.id}`, name: p.name })) },
    project:  { label: "项目", options: projectItems.map(p => ({ id: `project-${p.id}`, name: p.name })) },
    city:     { label: "城市", options: ["北京", "上海", "广州", "深圳", "成都", "杭州", "武汉", "南京", "西安", "重庆", "全国"].map(c => ({ id: c, name: c })) },
  };
}

const logSeed: Record<string, AccountOperation[]> = {
  acc_chenyuhang: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-12 10:22", summary: "创建账号并激活" },
    { id: "l2", type: "assign_tools", actor: "系统初始化", time: "2024-08-12 10:25", summary: "分配 3 个通讯工具", details: { toolIds: ["t_001", "t_005", "t_011"] } },
    { id: "l3", type: "assign_projects", actor: "陈宇航", time: "2024-08-20 09:15", summary: "新增覆盖成都分站运营项目" },
  ],
  acc_linquingyao: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-12 11:05", summary: "创建账号，绑定双身份" },
    { id: "l2", type: "assign_tools", actor: "系统初始化", time: "2024-08-12 11:10", summary: "分配 3 个通讯工具" },
  ],
  acc_zhaowenxuan: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-13 09:30", summary: "创建账号并激活" },
    { id: "l2", type: "disable", actor: "系统巡检", time: "2024-08-25 02:30", summary: "工具状态异常，账号领用状态标记为异常", details: { toolIds: ["t_003"] } },
  ],
  acc_sunwanqing: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-13 14:18", summary: "创建账号（暂无分配工具）" },
    { id: "l2", type: "change_identities", actor: "陈宇航", time: "2024-08-21 15:40", summary: "新增学习平台负责人身份" },
  ],
  acc_zhoukairui: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-15 16:40", summary: "创建账号并激活" },
    { id: "l2", type: "assign_tools", actor: "陈宇航", time: "2024-08-24 18:02", summary: "触发工具交接流程，等待新持有人确认", details: { toolIds: ["t_004", "t_008"] } },
  ],
  acc_wusiyuan: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-16 08:55", summary: "创建账号，平台+项目负责人双身份" },
    { id: "l2", type: "assign_projects", actor: "林清瑶", time: "2024-08-22 10:08", summary: "新增北京PRO会员项目分配" },
  ],
  acc_linxiaoyan: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-16 10:12", summary: "创建账号" },
    { id: "l2", type: "change_identities", actor: "林清瑶", time: "2024-08-23 14:20", summary: "新增区域运营身份（北上深）" },
  ],
  acc_liugang: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-18 15:00", summary: "创建账号并激活" },
    { id: "l2", type: "disable", actor: "陈宇航", time: "2024-08-24 11:55", summary: "离职审批通过，停用账号" },
  ],
  acc_limenghua: [
    { id: "l1", type: "create", actor: "系统初始化", time: "2024-08-20 11:33", summary: "创建账号" },
    { id: "l2", type: "assign_tools", actor: "李梦华", time: "2024-08-22 16:30", summary: "分配 t_009 媒体账号" },
  ],
  acc_zhengyutong: [
    { id: "l1", type: "invite_approved", actor: "陈宇航", time: "2024-08-22 17:24", summary: "邀请注册审核通过，生成待激活账号" },
  ],
};

export const mockAccounts: SystemAccount[] = [
  {
    uid: "acc_chenyuhang", name: "陈宇航", email: "chenyuhang@eco.com", phone: "13800000001", status: "active", bindingStatus: "in_use", createdAt: "2024-08-12 10:22",
    identities: [{ roleKey: "super_admin", scopeType: "global", scopeIds: ["*"], label: "超级管理员", permissionSummary: "全局数据/多生态/全权限" }],
    assignedToolIds: ["t_001", "t_005", "t_011"],
    projectIds: ["p_beijing_pro", "p_shanghai_exp", "p_guangzhou_train", "p_chengdu"],
    operationLogs: logSeed.acc_chenyuhang,
  },
  {
    uid: "acc_linquingyao", name: "林清瑶", email: "linqingyao@eco.com", phone: "13800000002", status: "active", bindingStatus: "in_use", createdAt: "2024-08-12 11:05",
    identities: [
      { roleKey: "eco_leader", scopeType: "eco", scopeIds: ["eco-1", "eco-2"], label: "生态负责人", permissionSummary: "健康医药美业+宠物生态负责人" },
      { roleKey: "saas_owner", scopeType: "saas", scopeIds: ["saas-1"], label: "SaaS负责人", permissionSummary: "私域工具SaaS负责人" },
    ],
    assignedToolIds: ["t_002", "t_006", "t_012"],
    projectIds: ["p_shanghai_exp", "p_chengdu"],
    operationLogs: logSeed.acc_linquingyao,
  },
  {
    uid: "acc_zhaowenxuan", name: "赵文轩", email: "zhaowenxuan@eco.com", phone: "13800000003", status: "active", bindingStatus: "abnormal", createdAt: "2024-08-13 09:30",
    identities: [{ roleKey: "eco_coo", scopeType: "eco", scopeIds: ["eco-1"], label: "生态COO", permissionSummary: "健康医药美业生态运营总监" }],
    assignedToolIds: ["t_003"],
    projectIds: ["p_guangzhou_train"],
    operationLogs: logSeed.acc_zhaowenxuan,
  },
  {
    uid: "acc_sunwanqing", name: "孙婉清", email: "sunwanqing@eco.com", phone: "13800000004", status: "active", bindingStatus: "idle", createdAt: "2024-08-13 14:18",
    identities: [
      { roleKey: "saas_owner", scopeType: "saas", scopeIds: ["saas-2", "saas-4"], label: "SaaS负责人", permissionSummary: "课程平台+学习平台负责人" },
    ],
    assignedToolIds: [],
    projectIds: ["p_course_train", "p_advanced_class", "p_member_club"],
    operationLogs: logSeed.acc_sunwanqing,
  },
  {
    uid: "acc_zhoukairui", name: "周楷瑞", email: "zhoukairui@eco.com", phone: "13800000005", status: "active", bindingStatus: "pending_transfer", createdAt: "2024-08-15 16:40",
    identities: [{ roleKey: "saas_op", scopeType: "saas", scopeIds: ["saas-1"], label: "SaaS运营", permissionSummary: "私域工具SaaS运营支持" }],
    assignedToolIds: ["t_004", "t_008"],
    projectIds: ["p_chengdu"],
    operationLogs: logSeed.acc_zhoukairui,
  },
  {
    uid: "acc_wusiyuan", name: "吴思远", email: "wusiyuan@eco.com", phone: "13800000006", status: "active", bindingStatus: "in_use", createdAt: "2024-08-16 08:55",
    identities: [
      { roleKey: "platform_admin", scopeType: "platform", scopeIds: ["platform-1"], label: "平台管理员", permissionSummary: "健康运营平台管理员" },
      { roleKey: "project_owner", scopeType: "project", scopeIds: ["project-1", "project-2"], label: "项目负责人", permissionSummary: "PRO会员+体验官项目负责人" },
    ],
    assignedToolIds: ["t_001", "t_005", "t_011"],
    projectIds: ["p_beijing_pro", "p_shanghai_exp"],
    operationLogs: logSeed.acc_wusiyuan,
  },
  {
    uid: "acc_linxiaoyan", name: "林小燕", email: "linxiaoyan@eco.com", phone: "13800000007", status: "active", bindingStatus: "in_use", createdAt: "2024-08-16 10:12",
    identities: [
      { roleKey: "platform_op", scopeType: "platform", scopeIds: ["platform-1"], label: "平台运营", permissionSummary: "健康运营平台运营" },
      { roleKey: "regional_op", scopeType: "city", scopeIds: ["北京", "上海", "深圳"], label: "区域运营", permissionSummary: "北上深城市运营" },
    ],
    assignedToolIds: ["t_002", "t_006", "t_012"],
    projectIds: ["p_shanghai_exp", "p_beijing_pro"],
    operationLogs: logSeed.acc_linxiaoyan,
  },
  {
    uid: "acc_liugang", name: "刘刚", email: "liugang@eco.com", phone: "13800000008", status: "disabled", bindingStatus: "abnormal", createdAt: "2024-08-18 15:00",
    identities: [{ roleKey: "teacher", scopeType: "project", scopeIds: ["project-2"], label: "老师", permissionSummary: "体验官项目服务老师" }],
    assignedToolIds: ["t_003", "t_007"],
    projectIds: ["p_guangzhou_train"],
    operationLogs: logSeed.acc_liugang,
  },
  {
    uid: "acc_limenghua", name: "李梦华", email: "limenghua@eco.com", phone: "13800000009", status: "active", bindingStatus: "in_use", createdAt: "2024-08-20 11:33",
    identities: [
      { roleKey: "project_owner", scopeType: "project", scopeIds: ["project-5", "project-6", "project-7"], label: "项目负责人", permissionSummary: "7日训练营/进阶班/俱乐部负责人" },
      { roleKey: "service", scopeType: "project", scopeIds: ["project-5"], label: "客服", permissionSummary: "训练营值班客服" },
    ],
    assignedToolIds: ["t_009"],
    projectIds: ["p_course_train", "p_advanced_class", "p_member_club"],
    operationLogs: logSeed.acc_limenghua,
  },
  {
    uid: "acc_zhengyutong", name: "郑雨桐", email: "zhengyutong@eco.com", phone: "13800000010", status: "pending", bindingStatus: "idle", createdAt: "2024-08-22 17:24",
    identities: [{ roleKey: "service", scopeType: "project", scopeIds: ["project-1", "project-2"], label: "客服", permissionSummary: "PRO会员/体验官客服团队" }],
    assignedToolIds: [],
    projectIds: [],
    operationLogs: logSeed.acc_zhengyutong,
  },
];

// 邀请注册 / 账号分配中常选的项目候选列表（与 projects 字段保持一致，方便筛选和展示）
export type ProjectOption = { id: string; name: string; type: string; city: string };
export const availableProjects: ProjectOption[] = [
  { id: "p_beijing_pro",     name: "PRO会员（北京）",       type: "SaaS私域",   city: "北京" },
  { id: "p_shanghai_exp",    name: "体验官（上海）",       type: "SaaS私域",   city: "上海" },
  { id: "p_chengdu",         name: "成都分站运营",         type: "SaaS私域",   city: "成都" },
  { id: "p_guangzhou_train", name: "广州培训代理",         type: "城市合伙人", city: "广州" },
  { id: "p_course_train",    name: "7日训练营",           type: "课程平台",   city: "线上" },
  { id: "p_advanced_class",  name: "进阶班认证",           type: "课程平台",   city: "全国" },
  { id: "p_member_club",     name: "付费会员俱乐部",       type: "课程平台",   city: "全国" },
  { id: "p_pet_mall",        name: "宠物用品商城会员",     type: "分销系统",   city: "全国" },
  { id: "p_edu_camp",        name: "亲子教育训练营",       type: "学习平台",   city: "深圳" },
  { id: "p_summer_school",   name: "暑期成长营",           type: "学习平台",   city: "杭州" },
];
