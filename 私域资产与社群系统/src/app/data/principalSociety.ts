export type ThemeId = "peach" | "orchid" | "amber" | "rose" | "mono-lime" | "mono-electric" | "mono-lemon" | "mono-orange" | "forest" | "sage" | "sound" | "citrus" | "neon-night" | "sky-data" | "lavender" | "botanical";
export type CommunityStatus = "active" | "attention" | "archived";
export type ProjectStatus = "未开始" | "进行中" | "待确认" | "已完成" | "已暂停";
export type ActionStatus = "pending" | "completed";
export type ActionRelatedType = "member" | "community" | "project" | "growthTask" | "notification";

export type Principal = {
  id: string;
  name: string;
  avatar: string;
  level: string;
  growthValue: number;
  tags: string[];
  phone: string;
  accountStatus: string;
  preferredTheme: ThemeId;
  lastSyncAt: string;
};

export type Community = {
  id: string;
  name: string;
  type: string;
  status: CommunityStatus;
  memberCount: number;
  capacity: number;
  activityScore: number;
  todayNewMembers: number;
  pendingFollowUps: number;
  attentionReason?: string;
  relatedProjectIds: string[];
  updatedAt: string;
};

export type Member = {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  communityIds: string[];
  projectIds: string[];
  lastInteractionAt: string;
  followUpStatus: "待跟进" | "已跟进";
  followUpDueAt?: string;
  contactChannels: string[];
};

export type ProjectMilestone = {
  id: string;
  title: string;
  status: "已完成" | "进行中" | "待开始";
  dueAt: string;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  progress: number;
  principalIds: string[];
  communityIds: string[];
  memberIds: string[];
  milestones: ProjectMilestone[];
  nextAction: string;
  nextActionDueAt: string;
  updatedAt: string;
};

export type ActionItem = {
  id: string;
  type: "跟进" | "提醒" | "里程碑" | "成长" | "通知";
  title: string;
  description: string;
  priority: "高" | "中" | "低";
  status: ActionStatus;
  relatedType: ActionRelatedType;
  relatedId: string;
  dueAt: string;
  completedAt?: string;
};

export type GrowthTask = {
  id: string;
  title: string;
  description: string;
  taskType: "实践任务" | "提交任务" | "学习任务";
  growthValue: number;
  status: "未开始" | "进行中" | "待提交" | "审核中" | "已完成";
  dueAt: string;
  rewardId?: string;
};

const avatarBase = "/principal-1-h5/assets/avatars/people";

export const initialPrincipal: Principal = {
  id: "principal-001",
  name: "王总",
  avatar: `${avatarBase}/avatar-17.jpg`,
  level: "D3 · 事业合伙人",
  growthValue: 2680,
  tags: ["主理人", "项目共创"],
  phone: "138****2680",
  accountStatus: "正常",
  preferredTheme: "peach",
  lastSyncAt: "刚刚",
};

export const initialCommunities: Community[] = [
  { id: "community-ai-growth", name: "AI增长实战群", type: "项目共创", status: "attention", memberCount: 268, capacity: 300, activityScore: 86, todayNewMembers: 6, pendingFollowUps: 4, attentionReason: "4 位新成员待跟进", relatedProjectIds: ["project-ai-ad"], updatedAt: "10 分钟前" },
  { id: "community-leader", name: "主理人经营群", type: "经营交流", status: "active", memberCount: 124, capacity: 200, activityScore: 92, todayNewMembers: 3, pendingFollowUps: 1, relatedProjectIds: ["project-growth"], updatedAt: "35 分钟前" },
  { id: "community-course", name: "成长教练陪跑群", type: "成长服务", status: "archived", memberCount: 86, capacity: 120, activityScore: 48, todayNewMembers: 0, pendingFollowUps: 0, relatedProjectIds: [], updatedAt: "昨天" },
];

export const initialMembers: Member[] = [
  { id: "member-amy", name: "陈美玲", avatar: `${avatarBase}/avatar-13.jpg`, tags: ["新成员", "AI项目"], communityIds: ["community-ai-growth"], projectIds: ["project-ai-ad"], lastInteractionAt: "昨天", followUpStatus: "待跟进", followUpDueAt: "今天 18:00", contactChannels: ["微信"] },
  { id: "member-jessica", name: "Jessica", avatar: `${avatarBase}/avatar-14.jpg`, tags: ["高意向"], communityIds: ["community-leader"], projectIds: ["project-growth"], lastInteractionAt: "周二", followUpStatus: "待跟进", followUpDueAt: "明天", contactChannels: ["微信", "电话"] },
  { id: "member-shirley", name: "李雪", avatar: `${avatarBase}/avatar-15.jpg`, tags: ["活跃成员"], communityIds: ["community-ai-growth", "community-leader"], projectIds: ["project-ai-ad"], lastInteractionAt: "今天 09:20", followUpStatus: "已跟进", contactChannels: ["微信"] },
];

export const initialProjects: Project[] = [
  { id: "project-ai-ad", name: "AI超级广告公司", type: "项目共创", status: "进行中", progress: 68, principalIds: ["principal-001"], communityIds: ["community-ai-growth"], memberIds: ["member-amy", "member-shirley"], milestones: [{ id: "milestone-brief", title: "完成项目 brief", status: "已完成", dueAt: "10 月 09 日" }, { id: "milestone-content", title: "确认首轮内容", status: "进行中", dueAt: "今天 18:00" }, { id: "milestone-review", title: "复盘并发布", status: "待开始", dueAt: "10 月 16 日" }], nextAction: "确认首轮内容方案", nextActionDueAt: "今天 18:00", updatedAt: "20 分钟前" },
  { id: "project-growth", name: "社群增长陪跑计划", type: "增长计划", status: "待确认", progress: 42, principalIds: ["principal-001"], communityIds: ["community-leader"], memberIds: ["member-jessica"], milestones: [{ id: "milestone-data", title: "提交经营数据", status: "进行中", dueAt: "今天" }, { id: "milestone-plan", title: "确认陪跑计划", status: "待开始", dueAt: "10 月 15 日" }], nextAction: "提交本周经营数据", nextActionDueAt: "今天 18:00", updatedAt: "1 小时前" },
];

export const initialActionItems: ActionItem[] = [
  { id: "action-member-amy", type: "跟进", title: "跟进陈美玲的入群需求", description: "新成员已加入 AI 增长实战群，确认她的项目方向。", priority: "高", status: "pending", relatedType: "member", relatedId: "member-amy", dueAt: "今天 18:00" },
  { id: "action-project-content", type: "里程碑", title: "确认 AI 项目首轮内容", description: "项目正在进行中，今天完成首轮内容确认。", priority: "高", status: "pending", relatedType: "project", relatedId: "project-ai-ad", dueAt: "今天 18:00" },
  { id: "action-growth-data", type: "提醒", title: "提交本周经营数据", description: "完成提交后获得 80 成长值。", priority: "中", status: "pending", relatedType: "growthTask", relatedId: "growth-data", dueAt: "今天 20:00" },
  { id: "action-community", type: "通知", title: "查看 AI 增长实战群动态", description: "群内新增 6 位成员，及时处理待跟进事项。", priority: "中", status: "pending", relatedType: "community", relatedId: "community-ai-growth", dueAt: "今天" },
];

export const initialGrowthTasks: GrowthTask[] = [
  { id: "growth-review", title: "完成项目复盘", description: "实践任务 · 预计 20 分钟", taskType: "实践任务", growthValue: 100, status: "待提交", dueAt: "今天" },
  { id: "growth-data", title: "提交本周经营数据", description: "提交任务 · 截止今天 18:00", taskType: "提交任务", growthValue: 80, status: "未开始", dueAt: "今天 18:00" },
  { id: "growth-live", title: "参加成长教练直播", description: "学习任务 · 今晚 20:00", taskType: "学习任务", growthValue: 50, status: "进行中", dueAt: "今晚 20:00" },
];
