---
intent: 在现有四类经营工作台上增加任务闭环、项目启动配置、动态指标和窄屏体验
success_criteria: 下一步动作可创建并跟踪任务；待启动项目可完成配置并进入运营中；社群和项目指标按统一口径动态计算；390px 窄屏可滚动表格、打开档案并执行核心动作；既有账号、入群、关系和日志能力无回归
risk_level: medium
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 盘点现有任务与操作台接口**
action: 阅读 src/app/components/InfluenceRanking.tsx、src/app/components/workbenchScopes.tsx、src/app/components/PushTasks.tsx 以及相关测试，确认任务中心状态、操作台渲染入口、ScopeRow 字段和现有日志函数，记录不改变的接口边界。
loop: false
verify:
  type: shell
  command: yarn test

- [ ] **Step 2: 建立任务与指标的最小类型模型**
action: 在现有工作台数据类型所在文件中增加任务状态、任务对象引用、指标结果和项目启动配置的 TypeScript 类型，保持现有 ScopeRow、ScopeColumn 和旧 cells 回退兼容，不修改 EcosystemManagement.tsx、PCLayout.tsx 或 projectGroupRules.ts。
loop: false
verify: npx tsc --noEmit

- [ ] **Step 3: 实现纯函数指标计算**
action: 为社群和项目增加统一指标计算函数，读取具名 row.data 数值，区分 pending、no-data、zero 和 value，输出分子、分母、格式化值和口径文本；覆盖授权率、绑定率、消费转化率、复购率、发言率和点击率。
loop: until yarn test --runInBand passes
max_iterations: 3
verify: yarn test

- [ ] **Step 4: 接入社群和项目动态指标展示**
action: 在 InfluenceRanking.tsx 和 workbenchScopes.tsx 中以计算结果替换静态指标展示，保持既有表头、右侧档案和待启动项目文案；待配置显示“待配置”，分母为 0 显示“暂无样本”，真实零值显示 0%，并展示指标口径。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 5: 接入下一步动作任务草稿**
action: 扩展 handleScopeNextAction，使会员、社群、项目和代理动作生成任务草稿，自动填充对象类型、对象键、对象名称、来源动作、任务标题、任务类型、负责人、优先级和默认状态；已有未完成的同对象同动作任务只定位并提示，不重复创建。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 6: 完成任务创建、状态更新和结果回写**
action: 在统一操作台中增加任务确认、负责人、优先级、截止时间、状态和结果字段；保存任务时同步任务中心数量并写入操作记录；完成、暂停、取消任务时更新任务状态，只有有明确动作结果时才回写对象阶段或下一步动作。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 7: 实现项目启动配置表单**
action: 在项目启动配置入口增加项目负责人、服务人员、项目账号、代理规则、会员入口、关联社群和启动备注字段；复用已有项目与社群数据，不复制 projectGroupRules.ts 的映射；保存前校验负责人、服务人员、会员入口和社群。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 8: 完成项目配置保存与阶段回写**
action: 保存有效项目配置到当前会话状态，更新项目配置状态、项目阶段和项目行指标来源，创建或完成项目启动任务并写入操作日志；校验失败保留输入并显示字段错误，不修改项目阶段。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 9: 完善窄屏表格与横向滚动提示**
action: 为经营工作台表格增加 390px 窄屏布局规则、排名头像名称冻结列、不透明 sticky 背景、左右边缘渐隐提示和横向滚动提示；确保下一步动作列能够滚动到并点击，桌面字段不被删除。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 10: 将档案与统一操作台适配窄屏**
action: 在 InfluenceRanking.tsx 中将右侧档案和统一操作台在窄屏转换为全宽抽屉或面板，保留概览、项目、社群、订单、任务和保存/完成/取消操作；关系链增加横向滚动容器，避免节点被压缩。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 11: 补充四项增强的回归测试**
action: 在现有测试目录补充任务去重与状态回写、项目配置校验与保存、动态指标四种状态以及既有账号入群关系日志保留的测试；测试只覆盖公开纯函数或可稳定调用的状态辅助函数，不改动已删除测试文件。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 12: 执行最终质量检查**
action: 检查所有本阶段修改的 diff，确认没有修改 EcosystemManagement.tsx、PCLayout.tsx、projectGroupRules.ts 的无关内容，没有新增代码注释或秘密；运行完整测试、生产构建和空白检查。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: yarn test
  - type: shell
    command: yarn build
  - type: shell
    command: git diff --check

- [ ] **Step 13: 浏览器回归四类工作台与窄屏流程**
action: 启动或复用开发服务器，访问 http://127.0.0.1:5178/?view=pc&module=users 或实际端口，验证会员、社群、项目、代理视角切换，下一步动作创建任务，项目启动配置，动态指标状态，390px 左右表格横向滚动、冻结列、档案面板和操作台，确认控制台无 error 或 warn。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5178/?view=pc&module=users
  check: 四类视角、任务闭环、项目配置、动态指标和窄屏核心操作均可用且控制台无错误
