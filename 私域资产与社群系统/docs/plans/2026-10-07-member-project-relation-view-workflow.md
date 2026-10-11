---
intent: 在会员数据主表中增加项目关系视图，用于按项目批量筛选和处理会员，同时保留右侧会员档案的项目关系深度操作。
success_criteria: 会员视图保持原有字段；项目关系视图一行一个会员并支持项目、关系状态、阶段、身份和下一步动作筛选；顶部展示项目漏斗指标；点击会员默认打开项目关系档案；授权、绑定、登录按钮及日志能力无回归；通过测试、构建和差异检查。
risk_level: medium
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 增加会员子视图和项目关系筛选状态**
action: 在 InfluenceRanking.tsx 中增加会员视图类型、默认视图和项目关系筛选状态；切换全局处理对象时重置会员子视图和项目筛选，不改变其他工作台状态。
loop: false
verify: yarn build

- [ ] **Step 2: 增加项目关系纯函数和聚合数据**
action: 基于现有 MemberProjectData 和 memberServiceForUser 聚合每个会员的项目摘要，按项目维度计算关系状态、项目阶段、消费、订单和下一步动作，并区分全局会员身份与项目身份。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 3: 增加会员项目关系视图切换与筛选控件**
action: 在会员处理对象下增加会员视图/项目关系视图切换；项目关系视图显示项目、关系状态、阶段、身份和下一步动作筛选，重置按钮同步清除这些筛选。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 4: 实现项目关系指标和一行一个会员主表**
action: 在会员主表区域增加项目关系漏斗指标和横向滚动列表，保持一行一个会员；具体项目筛选时展示该项目关系数据，全部项目时展示关联项目摘要和待处理动作。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 5: 连接档案项目关系和既有操作**
action: 点击项目关系视图中的会员或查看按钮时打开右侧会员档案并默认进入项目关系 Tab；复用现有授权、绑定、登录操作及提示、日志逻辑，不修改 CustomerService.tsx、EcosystemManagement.tsx、PCLayout.tsx 或 projectGroupRules.ts。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 6: 执行最终质量检查和窄屏回归**
action: 检查本阶段 diff 只涉及计划文件和 InfluenceRanking.tsx 的相关改动，验证 390px 下筛选区、指标和主表可横向滚动，随后执行完整测试、生产构建和差异检查。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: yarn test
  - type: shell
    command: yarn build
  - type: shell
    command: git diff --check
  - type: browser
    check: 会员视图与项目关系视图可切换；项目筛选和关系筛选可组合；点击会员打开项目关系档案；关键操作可见且窄屏无整体横向溢出
