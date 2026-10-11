---
intent: 将行业生态 / 平台管理页面改造成参考运营台的信息架构与交互模式
success_criteria: 右侧工作区具备对象摘要、指标概览、快捷操作、账号卡片和运营记录；所有操作保持当前页面内完成；权限、账号日志和资源创建规则不变；测试、构建和差异检查通过
risk_level: low
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 补齐运营台式详情区图标与状态配置**
action: 在 src/app/components/EcosystemManagement.tsx 中补充 MoreHorizontal、Pencil、UserCheck、Activity、AlertTriangle、History、XCircle 等 lucide-react 图标导入，并确认现有 S 主题变量可复用；不改变任何数据模型或权限函数。
loop: false
verify: git diff --check -- src/app/components/EcosystemManagement.tsx

- [ ] **Step 2: 重组生态详情头部与快捷操作**
action: 在 src/app/components/EcosystemManagement.tsx 的生态详情区域，将平级文字按钮整理为对象标题、类型/状态标签、四项指标卡和图标+中文短文案快捷操作；为图标按钮补充 title 与 aria-label；保留现有查看平台、查看项目、数据报表、账号管理和新建资源行为。
loop: until 运营台式头部、指标和快捷操作在生态对象详情中渲染且原有行为保持
max_iterations: 3
verify:
  type: shell
  command: npm run build

- [ ] **Step 3: 统一 SaaS 与平台详情的工作台操作样式**
action: 在 src/app/components/EcosystemManagement.tsx 中将 SaaS 合作伙伴和平台对象详情的操作入口统一为与生态详情相同的图标按钮、中文短文案、状态标签和当前页面内配置交互；不得改变层级切换、进入平台、项目列表和创建权限逻辑。
loop: until 三类对象详情均使用一致的操作层级且资源创建权限保持通过
max_iterations: 3
verify:
  type: shell
  command: npm test -- --run

- [ ] **Step 4: 优化账号运营卡片与风险记录区**
action: 在 src/app/components/EcosystemManagement.tsx 中优化身份账号区域，保留账号卡片的身份、状态、项目数、工具数、查看并编辑和启停操作；增加最近操作记录、待处理邀请或账号风险的运营台式信息块，所有内容使用中文空状态和中文 Toast，启停继续写入 operationLogs。
loop: until 账号管理卡片、风险/记录信息块和抽屉操作在当前对象上下文正常工作
max_iterations: 3
verify:
  type: shell
  command: npm run build

- [ ] **Step 5: 验证桌面与窄屏行业生态页面**
action: 启动 Vite 开发服务器，打开 http://127.0.0.1:5173/?view=pc&module=ecosystem，检查生态、SaaS、平台对象切换、快捷操作、账号编辑抽屉和启停反馈；再用窄屏视口检查右侧工作区纵向排列和抽屉可用性。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5173/?view=pc&module=ecosystem
  check: 生态、SaaS、平台详情均能显示运营台式头部和快捷操作；账号编辑仍在当前页面内打开；窄屏无横向溢出

- [ ] **Step 6: 执行最终质量检查**
action: 在项目根目录依次运行测试、生产构建和 EcosystemManagement.tsx 差异检查，确认没有 JSX、类型、测试或空白错误。
loop: until 所有质量检查通过
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check -- src/app/components/EcosystemManagement.tsx
