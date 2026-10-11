---
intent: 将主理人公社重新设计为移动端小程序，而不是 PC 工作台
success_criteria: 产出可在移动端尺寸运行的主理人公社原型，包含消息、项目、主理台、成长、我的五个底部入口，以及推荐群试看、项目/商品入口、身份切换和成长任务状态；不使用侧边栏、桌面指标墙或 PC 工作台布局
risk_level: low
auto_approve: false
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立移动端页面边界**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中移除当前 PC 工作台页面的布局假设，保留组件入口接口，确定移动端容器、安全区、内容滚动区和底部导航的结构；不要修改 `PCLayout.tsx`。
loop: false
verify:
  type: shell
  command: git diff -- src/app/components/ZhuLiRenApp.tsx

- [ ] **Step 2: 定义移动端设计令牌与底部导航**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中建立暖白、深绿、浅绿、琥珀色视觉令牌，并实现 `消息｜项目｜主理台｜成长｜我的` 五项底部 Tab；当前 Tab 状态、消息未读红点和触控尺寸必须可见。
loop: until 底部导航在五个 Tab 间切换且无 TypeScript 错误
max_iterations: 3
verify: npm run build

- [ ] **Step 3: 实现消息首页与会话筛选**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中实现消息首页，包含顶部标题和搜索入口、`全部｜服务｜群聊｜项目｜培训` 筛选、服务人员会话、项目群、培训群、系统通知和未读数；点击筛选只能改变会话列表，不改变底部导航。
loop: until 五种筛选均能显示对应会话且默认打开消息 Tab
max_iterations: 3
verify: npm run build

- [ ] **Step 4: 实现推荐群试看状态**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中增加推荐群卡片、群详情展示、试看计数、试看结束升级卡、支付后已获得权限但未入群状态和已解锁状态；使用本地状态模拟流程，不接真实支付或群接口。
loop: until 未解锁、试看中、达到上限、已购买未入群、已解锁五种状态可通过界面操作验证
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 实现项目推荐与商城入口**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中实现项目 Tab，提供 `项目推荐｜商城` 分段切换；项目卡片展示状态、价值、适合身份、参与人数、截止时间和行动按钮；商城卡片展示普通价、会员价、批发价及当前用户可用价格。
loop: until 项目推荐和商城可切换，且价格权限说明清晰
max_iterations: 3
verify: npm run build

- [ ] **Step 6: 实现主理台身份和四板块**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中实现会员、代理、团长身份切换，以及团队、经营、资产、推广四个板块；三种身份必须都显示四个板块，但使用不同的示例数据和行动入口；未拥有身份显示申请条件，不显示空数据墙。
loop: until 三种身份和四个板块均可切换且内容随身份变化
max_iterations: 3
verify: npm run build

- [ ] **Step 7: 实现成长首页与任务状态**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中实现成长阶段、进度缺口、今日任务、推荐课程、导师服务和认证考试；任务支持未开始、进行中、待提交、审核中、已完成状态的本地演示，并展示完成后的权益说明。
loop: until 成长路径、任务状态和下一步行动均能在移动端内容区展示
max_iterations: 3
verify: npm run build

- [ ] **Step 8: 实现我的首页与账户联动展示**
action: 在 `src/app/components/ZhuLiRenApp.tsx` 中实现我的首页，包含当前身份、订单、权益、群权限、培训档案、收益与提现、邀请记录和设置入口；将推荐群解锁、项目参与和商城购买结果以本地示例状态反映到对应列表。
loop: until 我的页面能展示订单、权益和群权限三类记录
max_iterations: 3
verify: npm run build

- [ ] **Step 9: 接入移动端视图容器并保留 PC 视图隔离**
action: 检查 `src/app/App.tsx` 的 `view=zhuliren` 分支，确保它渲染移动端主理人公社而不是 `PCLayout`；检查 `view=pc` 仍渲染原有 PC 后台；不要修改 PC 视图的业务模块。
loop: false
verify:
  type: shell
  command: npm run build

- [ ] **Step 10: 执行移动端交互与回归验证**
action: 启动 Vite 开发服务，使用浏览器访问 `/?view=zhuliren`，将视口调整为 375×812，验证五个底部 Tab、消息筛选、推荐群试看、身份切换、四板块切换、成长任务状态和我的页面；同时确认 `view=pc` 仍能打开。
loop: false
verify:
  type: browser
  url: http://localhost:5173/?view=zhuliren
  check: 375x812 视口下显示移动端单列布局、底部五项导航，无 PC 侧边栏；核心 Tab 和本地演示流程可点击
  gate: human

- [ ] **Step 11: 运行测试、构建并检查变更范围**
action: 运行项目测试和生产构建，确认移动端原型没有引入编译错误或现有测试回归，并检查变更只涉及主理人公社移动端实现与必要的视图入口。
loop: until 测试和构建均通过且变更范围符合设计规格
max_iterations: 3
verify:
  - type: shell
    command: npm test
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --stat
