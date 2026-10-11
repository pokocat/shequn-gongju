---
intent: 将“我的微信群”和“社群广场”嵌入消息页的三 Tab 内容区，保留对话列表与群详情、会员升级交互。
success_criteria: 消息页内三 Tab 可切换；群列表可进入群详情；高级群可打开升级弹层；构建与测试通过。
risk_level: low
auto_approve: true
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 为消息页三 Tab 建立静态页面回归测试**
action: 新增 tests/notificationsTabs.test.ts，断言 notifications.html 包含三个同页 Tab、三个对应内容面板、群详情导航与高级群升级弹层绑定。
loop: false
max_iterations: 1
verify: npm test -- --run tests/notificationsTabs.test.ts
gate: auto

- [ ] **Step 2: 在消息页内实现三个内容面板**
action: 修改 public/member-app/pages/notifications.html：保留现有对话列表，将历史 group.html 的群列表与 group--社群广场.html 的精选群内容嵌入独立面板；不改变独立页面文件。
loop: until static tab assertions pass
max_iterations: 3
verify: npm test -- --run tests/notificationsTabs.test.ts
gate: auto

- [ ] **Step 3: 接入同页切换与既有交互**
action: 修改 notifications.html 中的脚本，使三个 Tab 在消息页切换，已同步群发送 group-chat 导航并携带 g 参数，高级群打开消息页内升级弹层。
loop: until static tab assertions pass
max_iterations: 3
verify: npm test -- --run tests/notificationsTabs.test.ts
gate: auto

- [ ] **Step 4: 执行项目级验证**
action: 运行完整 Vitest 套件与 Vite 生产构建，确认本次静态页面更新未破坏现有项目。
loop: until all checks pass
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
gate: auto
