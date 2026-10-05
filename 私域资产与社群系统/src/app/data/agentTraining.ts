export type AgentTrainingStage = "S0" | "S1" | "S2" | "S3" | "S4";

export type TrainingTaskStatus =
  | "not_started"
  | "in_progress"
  | "pending_submission"
  | "pending_review"
  | "needs_revision"
  | "passed"
  | "overdue"
  | "abandoned";

export type MentorRole = "course" | "operations" | "business";

export type TrainingGroupType = "onboarding" | "class" | "business_coaching";

export type TrainingGroupStatus =
  | "pending_start"
  | "in_progress"
  | "review_pending"
  | "completed"
  | "migrating"
  | "dissolved";

export type RiskStatus = "none" | "attention" | "high";

export type CourseType = "required" | "practical" | "elective";

export type AgentTrainingStageConfig = {
  stage: AgentTrainingStage;
  name: string;
  description: string;
  requirements: string[];
};

export type TrainingTask = {
  id: string;
  agentId: string;
  title: string;
  type: "course" | "exam" | "practical" | "mentor_review" | "follow_up" | "group_migration";
  status: TrainingTaskStatus;
  stage: AgentTrainingStage;
  courseId?: string;
  groupId?: string;
  mentorId?: string;
  dueAt: string;
  nextAction: string;
};

export type Mentor = {
  id: string;
  name: string;
  avatar?: string;
  roles: MentorRole[];
  serviceSummary: string;
  loadStatus: "normal" | "warning" | "overloaded";
  contactTarget: string;
};

export type TrainingGroup = {
  id: string;
  name: string;
  type: TrainingGroupType;
  status: TrainingGroupStatus;
  mentorIds: string[];
  memberCount: number;
  startsAt: string;
  endsAt?: string;
  previousGroupId?: string;
  nextGroupId?: string;
};

export type CourseProgress = {
  total: number;
  completed: number;
  inProgress: number;
  score?: number;
  completionRate: number;
};

export type PracticalProgress = {
  total: number;
  submitted: number;
  passed: number;
  pendingReview: number;
  completionRate: number;
};

export type AgentTrainingRecord = {
  agentId: string;
  agentName: string;
  currentStage: AgentTrainingStage;
  stageProgress: number;
  courseProgress: CourseProgress;
  practicalProgress: PracticalProgress;
  riskStatus: RiskStatus;
  riskReason?: string;
  mentorIds: string[];
  groupIds: string[];
  taskIds: string[];
  lastUpdatedAt: string;
};

export type TrainingCourse = {
  id: string;
  name: string;
  type: CourseType;
  stage: AgentTrainingStage;
  durationMinutes: number;
};

export const agentTrainingStageMeta: Record<AgentTrainingStage, { label: string; description: string }> = {
  S0: { label: "待入训", description: "完成资料确认、导师分配和培训群入群" },
  S1: { label: "入门认证", description: "完成身份、职责、系统操作和基础考试" },
  S2: { label: "业务实训", description: "完成招募、带教、社群运营和经营实训" },
  S3: { label: "独立经营", description: "独立完成审核、运营、异常处理和复盘" },
  S4: { label: "团队复制", description: "带教新代理并组织培训，准备晋升" },
};

export const trainingTaskStatusMeta: Record<TrainingTaskStatus, { label: string }> = {
  not_started: { label: "未开始" },
  in_progress: { label: "学习中" },
  pending_submission: { label: "待提交" },
  pending_review: { label: "待导师审核" },
  needs_revision: { label: "需要补充" },
  passed: { label: "已通过" },
  overdue: { label: "已逾期" },
  abandoned: { label: "已放弃" },
};

export const mentorRoleMeta: Record<MentorRole, { label: string; description: string }> = {
  course: { label: "课程导师", description: "负责课程、授课、考试和知识答疑" },
  operations: { label: "运营导师", description: "跟进学习进度、审核作业和管理训练群" },
  business: { label: "业务导师", description: "负责招募、带教、社群和经营复盘" },
};

export const trainingGroupTypeMeta: Record<TrainingGroupType, { label: string }> = {
  onboarding: { label: "入门群" },
  class: { label: "班级训练群" },
  business_coaching: { label: "经营陪跑群" },
};

export const trainingGroupStatusMeta: Record<TrainingGroupStatus, { label: string }> = {
  pending_start: { label: "待开班" },
  in_progress: { label: "进行中" },
  review_pending: { label: "结业待复盘" },
  completed: { label: "已结营" },
  migrating: { label: "迁移中" },
  dissolved: { label: "已解散" },
};

export const riskStatusMeta: Record<RiskStatus, { label: string }> = {
  none: { label: "正常" },
  attention: { label: "需关注" },
  high: { label: "高风险" },
};

export const agentTrainingStages: AgentTrainingStageConfig[] = [
  { stage: "S0", name: "待入训", description: "完成资料确认、导师分配和培训群入群", requirements: ["确认代理资料", "分配导师", "加入入门群"] },
  { stage: "S1", name: "入门认证", description: "完成身份、职责、系统操作和基础考试", requirements: ["完成必修课程", "通过基础考试", "确认业务规范"] },
  { stage: "S2", name: "业务实训", description: "完成招募、带教、社群运营和经营实训", requirements: ["提交实训作业", "完成社群运营打卡", "通过导师审核"] },
  { stage: "S3", name: "独立经营", description: "独立完成审核、运营、异常处理和复盘", requirements: ["独立完成经营任务", "完成经营复盘", "通过业务导师评价"] },
  { stage: "S4", name: "团队复制", description: "带教新代理并组织培训，准备晋升", requirements: ["完成新代理带教", "组织一次培训", "提交晋升准备材料"] },
];

export const trainingCourses: TrainingCourse[] = [
  { id: "course_agent_intro", name: "代理商角色与业务规范", type: "required", stage: "S1", durationMinutes: 45 },
  { id: "course_system_basics", name: "社群系统基础操作", type: "required", stage: "S1", durationMinutes: 60 },
  { id: "course_community_practice", name: "社群运营实训", type: "practical", stage: "S2", durationMinutes: 90 },
  { id: "course_recruitment_practice", name: "团长招募与带教", type: "practical", stage: "S2", durationMinutes: 75 },
  { id: "course_business_review", name: "独立经营复盘方法", type: "required", stage: "S3", durationMinutes: 50 },
  { id: "course_mentor_basics", name: "新代理带教基础", type: "elective", stage: "S4", durationMinutes: 40 },
];

export const mentors: Mentor[] = [
  { id: "mentor_liu", name: "刘老师", roles: ["course", "operations"], serviceSummary: "负责课程答疑、作业审核和班级进度跟进", loadStatus: "normal", contactTarget: "chat--服务导师.html" },
  { id: "mentor_wang", name: "王教练", roles: ["business"], serviceSummary: "负责招募、带教、社群经营和复盘辅导", loadStatus: "warning", contactTarget: "chat--成长教练.html" },
  { id: "mentor_chen", name: "陈导师", roles: ["operations", "business"], serviceSummary: "负责训练群运营、异常跟进和经营陪跑", loadStatus: "normal", contactTarget: "chat--社群运营.html" },
];

export const trainingGroups: TrainingGroup[] = [
  { id: "group_onboarding_202610", name: "10月代理入门群", type: "onboarding", status: "completed", mentorIds: ["mentor_liu"], memberCount: 18, startsAt: "2026-09-28 09:00", endsAt: "2026-10-03 18:00", nextGroupId: "group_class_202610" },
  { id: "group_class_202610", name: "10月业务训练营·01班", type: "class", status: "in_progress", mentorIds: ["mentor_liu", "mentor_chen"], memberCount: 16, startsAt: "2026-10-04 09:00", nextGroupId: "group_coaching_202610" },
  { id: "group_coaching_202610", name: "10月经营陪跑群", type: "business_coaching", status: "pending_start", mentorIds: ["mentor_wang", "mentor_chen"], memberCount: 8, startsAt: "2026-10-19 09:00", previousGroupId: "group_class_202610" },
];

export const trainingTasks: TrainingTask[] = [
  { id: "task_training_001", agentId: "agent_001", title: "完成社群系统基础操作", type: "course", status: "passed", stage: "S1", courseId: "course_system_basics", groupId: "group_class_202610", mentorId: "mentor_liu", dueAt: "2026-10-05 18:00", nextAction: "查看下一节实训课" },
  { id: "task_training_002", agentId: "agent_001", title: "提交首个社群运营实训", type: "practical", status: "pending_review", stage: "S2", courseId: "course_community_practice", groupId: "group_class_202610", mentorId: "mentor_chen", dueAt: "2026-10-06 18:00", nextAction: "等待运营导师审核" },
  { id: "task_training_003", agentId: "agent_002", title: "完成代理资料与规则确认", type: "follow_up", status: "overdue", stage: "S0", groupId: "group_onboarding_202610", mentorId: "mentor_liu", dueAt: "2026-10-02 18:00", nextAction: "联系运营导师补齐资料" },
  { id: "task_training_004", agentId: "agent_002", title: "加入班级训练群", type: "group_migration", status: "not_started", stage: "S1", groupId: "group_class_202610", mentorId: "mentor_liu", dueAt: "2026-10-04 12:00", nextAction: "确认入群" },
  { id: "task_training_005", agentId: "agent_003", title: "完成独立经营复盘", type: "practical", status: "needs_revision", stage: "S3", courseId: "course_business_review", groupId: "group_coaching_202610", mentorId: "mentor_wang", dueAt: "2026-10-08 18:00", nextAction: "补充经营数据和复盘结论" },
];

export const agentTrainingRecords: AgentTrainingRecord[] = [
  { agentId: "agent_001", agentName: "林晓彤", currentStage: "S2", stageProgress: 62, courseProgress: { total: 4, completed: 3, inProgress: 1, score: 92, completionRate: 75 }, practicalProgress: { total: 3, submitted: 2, passed: 1, pendingReview: 1, completionRate: 67 }, riskStatus: "none", mentorIds: ["mentor_liu", "mentor_chen"], groupIds: ["group_onboarding_202610", "group_class_202610"], taskIds: ["task_training_001", "task_training_002"], lastUpdatedAt: "2026-10-03 16:20" },
  { agentId: "agent_002", agentName: "赵嘉豪", currentStage: "S0", stageProgress: 28, courseProgress: { total: 2, completed: 0, inProgress: 0, score: undefined, completionRate: 0 }, practicalProgress: { total: 1, submitted: 0, passed: 0, pendingReview: 0, completionRate: 0 }, riskStatus: "high", riskReason: "资料确认已逾期，尚未完成入训", mentorIds: ["mentor_liu"], groupIds: ["group_onboarding_202610"], taskIds: ["task_training_003", "task_training_004"], lastUpdatedAt: "2026-10-03 15:05" },
  { agentId: "agent_003", agentName: "徐婉清", currentStage: "S3", stageProgress: 84, courseProgress: { total: 6, completed: 5, inProgress: 1, score: 88, completionRate: 83 }, practicalProgress: { total: 4, submitted: 4, passed: 3, pendingReview: 0, completionRate: 75 }, riskStatus: "attention", riskReason: "经营复盘需要补充数据", mentorIds: ["mentor_wang", "mentor_chen"], groupIds: ["group_class_202610", "group_coaching_202610"], taskIds: ["task_training_005"], lastUpdatedAt: "2026-10-03 14:40" },
];
