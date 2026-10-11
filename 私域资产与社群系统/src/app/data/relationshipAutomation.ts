export type AutomationChannel = "个微" | "企微";

export type AutomationTaskStatus =
  | "待执行"
  | "执行中"
  | "执行成功"
  | "执行失败"
  | "执行超时"
  | "执行中断"
  | "已取消";

export type AiReviewStatus =
  | "待识别"
  | "AI确认成功"
  | "AI确认失败"
  | "AI疑似成功"
  | "AI疑似失败"
  | "AI无法判断";

export type HumanReviewStatus =
  | "待人工复核"
  | "人工确认成功"
  | "人工确认失败"
  | "人工修正为成功"
  | "人工修正为失败"
  | "无需复核";

export type RelationshipTaskStatus =
  | "未添加"
  | "未关注"
  | "已申请"
  | "已通过"
  | "已拒绝"
  | "已拉黑"
  | "无法添加"
  | "未分配群"
  | "待入群"
  | "已入群"
  | "已退出";

export type RelationshipAutomationTask = {
  id: string;
  memberRank: number;
  memberName: string;
  memberAccount: string;
  accountId: string;
  accountLabel: string;
  channel: AutomationChannel;
  entry: "群内" | "搜索" | "二维码" | "企业微信引导";
  createdAt: string;
  updatedAt: string;
  automationStatus: AutomationTaskStatus;
  automationMessage: string;
  aiStatus: AiReviewStatus;
  aiMessage: string;
  humanReviewStatus: HumanReviewStatus;
  humanMessage?: string;
  finalStatus?: RelationshipTaskStatus;
  failureReason?: string;
};

export type PersonalAddTaskInput = {
  memberRank: number;
  memberName: string;
  memberAccount: string;
  accountId: string;
  accountLabel: string;
  entry: "群内" | "搜索" | "二维码";
};

export type EnterpriseAddTaskInput = {
  memberRank: number;
  memberName: string;
  memberAccount: string;
  accountId: string;
  accountLabel: string;
};

export type HumanReviewInput = {
  taskId: string;
  finalStatus: RelationshipTaskStatus;
  message?: string;
  failureReason?: string;
  operator?: string;
};

export type RelationshipResult = {
  task: RelationshipAutomationTask;
  finalStatus: RelationshipTaskStatus;
};

export type RelationshipAutomationService = {
  createPersonalAddTask(input: PersonalAddTaskInput): Promise<RelationshipAutomationTask>;
  createEnterpriseAddTask(input: EnterpriseAddTaskInput): Promise<RelationshipAutomationTask>;
  getTask(taskId: string): Promise<RelationshipAutomationTask | undefined>;
  listTasks(memberRank?: number): Promise<RelationshipAutomationTask[]>;
  confirmTaskResult(input: HumanReviewInput): Promise<RelationshipResult>;
  cancelTask(taskId: string): Promise<void>;
};

let sequence = 0;

const createTaskId = () => {
  sequence += 1;
  return `REL-${Date.now()}-${sequence.toString().padStart(3, "0")}`;
};

const now = () => new Date().toLocaleString("zh-CN", { hour12: false });

const createTask = (
  input: PersonalAddTaskInput | EnterpriseAddTaskInput,
  channel: AutomationChannel,
  entry: RelationshipAutomationTask["entry"],
): RelationshipAutomationTask => {
  const timestamp = now();
  return {
    id: createTaskId(),
    memberRank: input.memberRank,
    memberName: input.memberName,
    memberAccount: input.memberAccount,
    accountId: input.accountId,
    accountLabel: input.accountLabel,
    channel,
    entry,
    createdAt: timestamp,
    updatedAt: timestamp,
    automationStatus: "执行成功",
    automationMessage: `${channel}自动化已创建一次添加动作`,
    aiStatus: "AI疑似成功",
    aiMessage: "自动化已完成，等待人工确认会员关系结果",
    humanReviewStatus: "待人工复核",
  };
};

export const createLocalRelationshipAutomationService = (): RelationshipAutomationService => {
  const tasks = new Map<string, RelationshipAutomationTask>();

  const save = (task: RelationshipAutomationTask) => {
    const next = { ...task, updatedAt: now() };
    tasks.set(next.id, next);
    return next;
  };

  return {
    async createPersonalAddTask(input) {
      const task = createTask(input, "个微", input.entry);
      return save(task);
    },
    async createEnterpriseAddTask(input) {
      const task = createTask(input, "企微", "企业微信引导");
      return save(task);
    },
    async getTask(taskId) {
      const task = tasks.get(taskId);
      return task ? { ...task } : undefined;
    },
    async listTasks(memberRank) {
      return Array.from(tasks.values())
        .filter(task => memberRank === undefined || task.memberRank === memberRank)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .map(task => ({ ...task }));
    },
    async confirmTaskResult(input) {
      const task = tasks.get(input.taskId);
      if (!task) {
        throw new Error(`找不到自动化任务：${input.taskId}`);
      }
      const success = input.finalStatus === "已申请" || input.finalStatus === "已通过";
      const next = save({
        ...task,
        humanReviewStatus: success ? "人工确认成功" : "人工确认失败",
        humanMessage: input.message,
        failureReason: success ? undefined : input.failureReason,
        finalStatus: input.finalStatus,
        aiStatus: success ? "AI确认成功" : "AI确认失败",
        aiMessage: input.message ?? "人工复核结果已同步",
      });
      return { task: next, finalStatus: input.finalStatus };
    },
    async cancelTask(taskId) {
      const task = tasks.get(taskId);
      if (!task) return;
      save({
        ...task,
        automationStatus: "已取消",
        humanReviewStatus: "无需复核",
        humanMessage: "任务已取消",
      });
    },
  };
};

export const relationshipAutomationService = createLocalRelationshipAutomationService();
