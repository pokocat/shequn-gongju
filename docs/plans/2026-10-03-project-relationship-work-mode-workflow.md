---
intent: 按项目统一配置关系任务工作模式，支持监管透明模式与任务执行模式，并分离人工服务记录和 AI/外部系统客观状态
success_criteria: 每个项目可独立保存一种工作模式；模式保存后立即影响当前项目任务视图；管理员和项目负责人可配置；工作人员按项目模式查看信息但不能修改模式；管理员始终可查看客观状态、人工记录和差异；人工操作不覆盖客观状态；构建、测试和浏览器回归通过
risk_level: medium
auto_approve: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立项目工作模式数据模型**
action: 在 `src/app/data/projectWorkModes.ts` 新增 `ProjectRelationshipWorkMode`、`ProjectWorkModeConfig`、项目模式默认值、模式展示文案和模式说明；为当前项目名称建立稳定项目 ID 映射；未配置项目默认使用 `transparent`。
loop: false
verify:
  type: artifact
  path: src/app/data/projectWorkModes.ts
  assert:
    kind: exists

- [ ] **Step 2: 补充项目配置类型与模式入口数据**
action: 修改 `src/app/components/workbenchScopes.tsx`，让项目数据能够关联稳定项目 ID，并为项目档案提供关系任务工作模式配置所需的项目元数据；不得改变会员、社群和代理视角现有配置结构。
loop: false
verify: yarn build

- [ ] **Step 3: 传递当前项目和角色上下文**
action: 修改 `src/app/components/PCLayout.tsx` 与 `src/app/components/MemberOperationsWorkbench.tsx`，保留现有项目切换行为，增加当前项目上下文和当前用户角色的传递边界；项目切换后必须重新计算当前项目模式，不得沿用上一个项目的模式。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 4: 实现项目档案模式配置区**
action: 在项目档案相关界面增加“关系任务工作模式”配置区，展示监管透明模式和任务执行模式的说明、当前配置人、更新时间和保存反馈；管理员、区域管理员、项目负责人显示可编辑控件，其他角色只读；保存后立即更新当前项目配置。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 5: 增加项目模式工作台徽标和可见性判断**
action: 修改 `src/app/components/InfluenceRanking.tsx`，读取当前项目模式和当前角色，显示当前项目模式徽标；监管透明模式向工作人员展示 AI/外部系统客观状态，任务执行模式隐藏客观状态但保留任务要求和人工服务入口；管理员、区域管理员和项目负责人始终显示完整客观信息。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 6: 分离人工操作日志、客观状态和任务状态**
action: 在 `src/app/components/InfluenceRanking.tsx` 中扩展人工服务日志和客观关系变化日志的本地数据结构；人工添加、联系和邀请入群动作只追加人工日志并更新汇总，不得修改 `personal`、`enterprise`、`group` 或 AI 客观状态；管理员视图并列展示客观状态、人工服务记录和当前任务状态。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 7: 增加差异监管与真实日志展示**
action: 将关系操作日志从 Toast 升级为会员档案中的可见日志或时间线；对人工操作次数与客观状态不一致、任务完成但状态待核验、客观成功但无人操作等情况显示异常提示；透明模式和任务执行模式都不得允许人工直接编辑客观状态。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 8: 对齐权限展示**
action: 修改 `src/app/components/Permissions.tsx` 与 `src/app/components/CustomerService.tsx`，补充项目关系任务工作模式的查看和配置能力说明，明确管理员、区域管理员、项目负责人可配置，项目运营、社群运营和服务老师只能执行任务；保留后续接入细粒度项目权限的接口边界。
loop: false
verify: yarn build

- [ ] **Step 9: 编写模式与日志单元测试**
action: 在现有 `tests` 目录增加项目模式辅助逻辑和关系任务状态隔离测试，覆盖项目独立配置、默认透明模式、模式切换立即生效、任务执行模式隐藏客观状态、管理员完整可见、人工操作不覆盖客观状态和日志累计。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 10: 执行完整质量检查**
action: 在项目根目录运行构建、测试和 diff 检查，确认未引入 TypeScript/Vite 错误、测试回归失败或空白文件变更；检查工作流涉及的所有文件与规格一致。
loop: until all checks pass
max_iterations: 3
verify:
  - type: shell
    command: yarn build
  - type: shell
    command: yarn test
  - type: shell
    command: git diff --check

- [ ] **Step 11: 浏览器回归验证两种项目模式**
action: 启动隔离 QA 服务并打开 `?view=pc&module=users`，分别验证管理员视图、工作人员监管透明模式和工作人员任务执行模式；切换不同项目确认项目模式独立生效，点击人工服务按钮确认次数和人工记录变化，确认客观状态不被人工操作覆盖且页面无新的控制台业务错误。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5190/?view=pc&module=users
  check: 项目模式徽标、配置权限、两种工作人员视图、管理员完整视图、人工日志和客观状态差异均符合规格
  gate: human
