import { describe, expect, it } from "vitest";
import {
  agentTrainingRecords,
  agentTrainingStages,
  mentorRoleMeta,
  trainingGroupStatusMeta,
  trainingGroupTypeMeta,
  trainingGroups,
  trainingTaskStatusMeta,
  trainingTasks,
} from "../src/app/data/agentTraining";
import {
  getMemberNetworkViews,
  calculateMemberNetworkScope,
  memberNetworkExample,
} from "../src/app/data/memberNetworkScope";

describe("代理培训数据", () => {
  it("按 S0 到 S4 顺序定义培训阶段", () => {
    expect(agentTrainingStages.map(stage => stage.stage)).toEqual(["S0", "S1", "S2", "S3", "S4"]);
    expect(agentTrainingStages.map(stage => stage.name)).toEqual(["待入训", "入门认证", "业务实训", "独立经营", "团队复制"]);
  });

  it("提供完整导师角色标签", () => {
    expect(mentorRoleMeta).toEqual({
      course: { label: "课程导师", description: "负责课程、授课、考试和知识答疑" },
      operations: { label: "运营导师", description: "跟进学习进度、审核作业和管理训练群" },
      business: { label: "业务导师", description: "负责招募、带教、社群和经营复盘" },
    });
  });

  it("定义培训群类型、状态以及班级到陪跑群的迁移关系", () => {
    expect(trainingGroupTypeMeta).toEqual({
      onboarding: { label: "入门群" },
      class: { label: "班级训练群" },
      business_coaching: { label: "经营陪跑群" },
    });
    expect(trainingGroupStatusMeta).toEqual({
      pending_start: { label: "待开班" },
      in_progress: { label: "进行中" },
      review_pending: { label: "结业待复盘" },
      completed: { label: "已结营" },
      migrating: { label: "迁移中" },
      dissolved: { label: "已解散" },
    });

    const onboarding = trainingGroups.find(group => group.type === "onboarding");
    const classGroup = trainingGroups.find(group => group.type === "class");
    const coaching = trainingGroups.find(group => group.type === "business_coaching");

    expect(onboarding?.status).toBe("completed");
    expect(onboarding?.nextGroupId).toBe(classGroup?.id);
    expect(classGroup?.status).toBe("in_progress");
    expect(classGroup?.nextGroupId).toBe(coaching?.id);
    expect(coaching?.status).toBe("pending_start");
    expect(coaching?.previousGroupId).toBe(classGroup?.id);
  });

  it("覆盖任务状态及其语义标签", () => {
    const statuses = new Set(trainingTasks.map(task => task.status));

    expect(statuses).toEqual(new Set(["passed", "pending_review", "overdue", "not_started", "needs_revision"]));
    expect(trainingTasks.map(task => task.stage)).toEqual(["S1", "S2", "S0", "S1", "S3"]);
    expect(trainingTaskStatusMeta.passed.label).toBe("已通过");
    expect(trainingTaskStatusMeta.pending_review.label).toBe("待导师审核");
    expect(trainingTaskStatusMeta.overdue.label).toBe("已逾期");
    expect(trainingTaskStatusMeta.not_started.label).toBe("未开始");
    expect(trainingTaskStatusMeta.needs_revision.label).toBe("需要补充");
  });

  it("development 和 recommendation 只提供聚合权限，不暴露个人培训明细", () => {
    const scope = calculateMemberNetworkScope(
      "agent-self",
      "agent",
      memberNetworkExample.entities,
      memberNetworkExample.relations,
    );
    const views = getMemberNetworkViews(scope);
    const aggregateViews = views.filter(view => ["development", "recommendation"].includes(view.scope));

    expect(aggregateViews).toHaveLength(2);
    expect(aggregateViews.every(view => view.aggregateOnly)).toBe(true);
    expect(aggregateViews.flatMap(view => view.entityIds)).not.toContain("agent_001");
    expect(aggregateViews.flatMap(view => view.entityIds)).not.toContain("task_training_001");
    expect(aggregateViews.flatMap(view => view.entityIds)).not.toContain("mentor_liu");
    expect(aggregateViews.flatMap(view => view.entityIds)).not.toContain("group_class_202610");
    expect(aggregateViews.every(view => !("trainingTasks" in view))).toBe(true);
    expect(aggregateViews.every(view => !("trainingRecords" in view))).toBe(true);
    expect(agentTrainingRecords.some(record => record.agentId === "agent_001")).toBe(true);
  });
});
