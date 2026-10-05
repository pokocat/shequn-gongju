---
intent: 在总运营工作台接入主理人公社精简会员数据表单
success_criteria: 会员新增表单仅保留身份、关系入群、运营标签和备注字段；项目与社群归属等字段自动展示；表单可打开、校验必填、保存后反馈；项目构建与测试通过
risk_level: low
auto_approve: true
worktree: false

## Steps

- [ ] **Step 1: 增加会员表单状态与字段模型**
action: 在 src/app/components/InfluenceRanking.tsx 中增加会员表单的打开状态、表单值状态、标签选择状态和保存处理函数；必填字段为会员姓名、微信号、会员等级、会员关系状态、入群状态；项目归属与当前项目上下文只读展示。
loop: false
verify: yarn build

- [ ] **Step 2: 增加会员表单入口与表单界面**
action: 在会员数据视角的顶部操作区域增加“新增会员”按钮，并在 InfluenceRanking.tsx 内实现表单弹层；表单分为会员身份、关系与入群、运营标签、运营备注四个区域，提供取消和保存会员操作。
loop: false
verify: yarn build

- [ ] **Step 3: 接入保存反馈与字段校验**
action: 保存时校验五个必填字段；校验通过后关闭弹层并通过现有提示机制反馈“会员已创建”，校验失败时保留弹层并展示缺失字段提示；不新增后端或持久化逻辑。
loop: false
verify: yarn test

- [ ] **Step 4: 完成项目级验证**
action: 运行项目构建与测试命令，确认新增会员入口、表单渲染、保存反馈和现有会员工作台无类型或构建错误。
loop: false
verify:
  - type: shell
    command: yarn build
  - type: shell
    command: yarn test
