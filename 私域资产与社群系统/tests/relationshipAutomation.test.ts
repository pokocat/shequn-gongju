import { describe, expect, it } from "vitest";
import { createLocalRelationshipAutomationService } from "../src/app/data/relationshipAutomation";

describe("关系自动化任务", () => {
  it("每次创建添加动作都会生成独立任务", async () => {
    const service = createLocalRelationshipAutomationService();
    const input = {
      memberRank: 1,
      memberName: "盛光年",
      memberAccount: "THEv424",
      accountId: "service-personal",
      accountLabel: "服务官个微",
      entry: "群内" as const,
    };

    const tasks = await Promise.all([
      service.createPersonalAddTask(input),
      service.createPersonalAddTask(input),
      service.createPersonalAddTask(input),
    ]);

    expect(new Set(tasks.map(task => task.id)).size).toBe(3);
    expect((await service.listTasks(1)).length).toBe(3);
  });

  it("人工复核后保存最终关系状态", async () => {
    const service = createLocalRelationshipAutomationService();
    const task = await service.createEnterpriseAddTask({
      memberRank: 2,
      memberName: "皮卡丘",
      memberAccount: "imp11",
      accountId: "service-enterprise",
      accountLabel: "服务官企微",
    });

    const result = await service.confirmTaskResult({
      taskId: task.id,
      finalStatus: "已通过",
      message: "人工确认已通过",
      operator: "当前服务人员",
    });

    expect(result.finalStatus).toBe("已通过");
    expect(result.task.humanReviewStatus).toBe("人工确认成功");
    expect(result.task.aiStatus).toBe("AI确认成功");
  });
});
