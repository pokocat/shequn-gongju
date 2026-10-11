---
intent: 完善主理人公社移动端本地交互原型，按方案 B 拆分消息、成长和账户详情页面
success_criteria: 移动端原型具备消息详情、系统通知、成长详情、账户详情、状态联动和基础无障碍语义，现有项目/商城/群权限流程保持可用，测试与构建通过
risk_level: low
auto_approve: true
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 提取移动端详情页组件边界**
action: 在 src/app/components/ZhuLiRenApp.tsx 中识别消息、成长、账户详情所需的共享 props 和状态边界，保持现有五 Tab 与项目/商城/群流程不变；仅拆出本轮需要的组件接口。
loop: false
verify: git diff --check

- [ ] **Step 2: 实现消息详情与系统通知**
action: 新增 src/app/components/ZhuLiRenMessageDetail.tsx，支持会话标题、消息内容、已读状态和返回；在 ZhuLiRenApp.tsx 中接入会话点击、未读清零、系统通知入口，并让已解锁群权限同步出现在消息区域。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 3: 实现成长详情组件**
action: 新增 src/app/components/ZhuLiRenGrowthDetail.tsx，支持课程、导师、认证考试和任务详情四类内容；从 GrowthHome 接入详情打开、任务状态推进和返回，保持本地 React 状态。
loop: until npm test succeeds
max_iterations: 3
verify: npm test

- [ ] **Step 4: 实现账户详情组件**
action: 新增 src/app/components/ZhuLiRenAccountDetail.tsx，支持订单、权益、群权限、培训档案、收益、邀请、客服和设置详情；从 MeHome 接入入口，继续复用购买和入群后的数量联动。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 补齐移动端无障碍与布局语义**
action: 为 BottomNav 添加导航语义和当前项标识，为图标按钮补充 aria-label，检查详情返回按钮和固定底部区域在 375px 宽度下不遮挡核心操作。
loop: false
verify: git diff --check

- [ ] **Step 6: 完成回归验证**
action: 在项目目录执行完整测试、生产构建和变更空白检查，并使用现有开发服务器或启动 Vite 在 375x812 视口验证消息、项目、主理台、成长、我的及详情返回路径。
loop: until npm test && npm run build && git diff --check succeeds
max_iterations: 3
verify:
  - type: shell
    command: npm test
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check
  - type: browser
    url: http://localhost:5174/?view=zhuliren
    check: 375x812 viewport renders all five tabs and detail pages return to their parent page
