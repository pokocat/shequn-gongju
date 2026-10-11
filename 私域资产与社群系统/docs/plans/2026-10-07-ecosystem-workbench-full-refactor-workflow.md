---
intent: 将“我的生态”完整重构为以生态层级树和对象管理为核心的超级生态管理员工作台
success_criteria: 顶部工作台栏、生态/SaaS/平台对象导航、四项总览带、生态树与详情区完成；默认只展开生态层；创建审批和直属超级生态归属行为保持；390px无横向溢出；测试、构建、格式检查和浏览器回归通过
risk_level: medium
auto_approve: true
branch: hotl/ecosystem-workbench-full-refactor
worktree: false

## Steps

- [ ] **Step 1: 固化完整工作台设计边界**
action: 读取并确认 `docs/superpowers/specs/2026-10-07-ecosystem-workbench-full-refactor-design.md`、`EcosystemManagement.tsx` 中 `SuperView` 和主组件边界；确认只改超级生态首页结构，不迁移数据模型和既有创建副作用。
loop: until design scope and preserved behaviors are explicit
max_iterations: 2
verify: test -f docs/superpowers/specs/2026-10-07-ecosystem-workbench-full-refactor-design.md

- [ ] **Step 2: 重构 SuperView 为层级管理工作台**
action: 修改 `SuperView`，将旧的独立统计卡和旗下生态列表重组为总览数据带、生态树节点、SaaS/直属超级生态二级节点和选中生态详情区；默认仅选中第一个生态，不递归展开平台与项目；保留所有创建入口、审批生成、账号订阅账单副作用和现有导航回调。
loop: until SuperView contains one coherent hierarchy management region and preserved callback names remain wired
max_iterations: 4
verify: grep -n '直属超级生态\|新建 SaaS 合作伙伴\|setCreatePlatformOpen\|onOpenProjects\|onOpenReports' src/app/components/EcosystemManagement.tsx

- [ ] **Step 3: 收敛主组件顶部与对象导航**
action: 修改 `EcosystemManagement` 主组件顶部，合并工作台上下文、角色、路径、账号/商业入口和身份切换；将对象导航明确为生态、SaaS 合作伙伴、平台三个可切换入口；避免在超级生态首页重复渲染旧层级长描述。
loop: until the top area is a compact workbench header plus object navigation with existing mainTab and activeTier behavior intact
max_iterations: 3
verify: grep -n '账号管理\|商业与计费\|切换身份\|生态\|SaaS 合作伙伴\|平台' src/app/components/EcosystemManagement.tsx

- [ ] **Step 4: 完成响应式层级布局**
action: 调整工作台相关 Tailwind 类名，桌面端使用树形区与详情区双栏，移动端使用单列折叠结构、两列总览指标和横向可滚动对象导航；内部按钮阻止事件冒泡。
loop: until hierarchy region has desktop split layout and mobile single-column layout without fixed-width overflow
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 添加或调整结构回归测试**
action: 在现有测试约定内补充最小可验证的数据派生或归属规则测试；保留 `tests/ecosystemContext.test.ts` 对上下文和直属超级生态标签的既有断言，不改变其用户意图。
loop: until relevant tests cover context and owner label without broad snapshot coupling
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 6: 执行完整验证与浏览器回归**
action: 在项目目录执行测试、生产构建和 `git diff --check`；启动开发服务器后验证桌面端和390px移动端的工作台布局、生态展开、详情入口、直属超级生态文案、无横向溢出和无控制台错误。
loop: until all checks pass and browser evidence confirms desktop/mobile behavior
max_iterations: 4
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

## Workflow Self-Check

- Steps are ordered from design boundary to implementation and verification.
- Each implementation step names the target file or component and preserves existing behavior.
- Verification commands are executable from the project root.
- No step commits changes or modifies unrelated views.
