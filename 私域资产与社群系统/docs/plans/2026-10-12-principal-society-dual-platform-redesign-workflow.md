---
intent: 实施主理人公社 H5 与微信小程序双端统一重设计，聚焦主理人工作台、社群、项目、成长、我的和三套可切换主题
success_criteria: H5 端完成工作台到行动详情的主关键路径、社群和项目移动端卡片、成长与主题切换；业务模型和主题语义可供微信小程序复用；测试、构建和 diff 检查通过
risk_level: medium
auto_approve: false
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立实现边界与现有入口清单**
action: 阅读 src/app/App.tsx、src/app/components/ZhuLiRenApp.tsx、ZhuLiRenMessageDetail.tsx、ZhuLiRenGrowthDetail.tsx、ZhuLiRenAccountDetail.tsx 及现有移动端样式入口，确认 H5 视图参数、已有详情状态和可复用资源；只记录本次需要修改的文件，不改动无关工作区变更。
loop: false
verify:
  type: artifact
  path: src/app/components/ZhuLiRenApp.tsx
  assert:
    kind: exists

- [ ] **Step 2: 定义主理人业务模型与演示数据边界**
action: 在 src/app/data 下新增本次移动端需要的 Principal、Community、Member、Project、ActionItem、GrowthTask 类型和最小演示数据模块；字段必须对应设计文档，工作台行动项通过 relatedType 与 relatedId 关联详情对象。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 3: 建立三套主题语义变量**
action: 在现有移动端可复用的样式入口中建立 community-blue、principal-green、principal-black 三套主题配置，覆盖基础颜色、状态色、圆角、阴影、间距和密度变量；默认主题为 community-blue，组件不得继续依赖无法解释的主题硬编码作为新逻辑来源。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 4: 将移动端外壳调整为统一底部导航结构**
action: 在 src/app/components/ZhuLiRenApp.tsx 中将首期导航语义整理为工作台、社群、项目、成长、我的；保留现有消息能力作为工作台通知或行动来源，确保导航状态、未读角标、safe-area 留白和详情返回状态不互相覆盖。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 实现主理人工作台首屏聚合**
action: 在 src/app/components/ZhuLiRenApp.tsx 中实现问候区、今日行动最多三条、重点社群最多两条、重点项目最多两条、快捷操作和成长反馈；行动项点击进入已有或新增详情状态，完成操作后更新聚合数据并保留 Toast 反馈。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 6: 实现社群移动端列表与详情**
action: 在 src/app/components/ZhuLiRenApp.tsx 中增加社群列表卡片、全部/活跃中/需要关注/已归档筛选，以及社群详情的概览、成员、动态和设置分区；需要关注状态必须显示触发原因，空状态和错误状态沿用统一反馈语义。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 7: 实现项目移动端列表与详情**
action: 在 src/app/components/ZhuLiRenApp.tsx 中增加项目列表卡片和项目详情，突出当前阶段、进度、下一步动作、截止时间、关联社群和关联成员；更新项目进度后同步工作台对应行动项和项目卡片。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 8: 整理成长与个人中心入口**
action: 在 src/app/components/ZhuLiRenApp.tsx、ZhuLiRenGrowthDetail.tsx 和 ZhuLiRenAccountDetail.tsx 中补齐等级、成长值、成长任务、课程、权益、主理人资料、通知、账号设置和数据同步入口；保持现有群升级、购买、报名、任务推进和账户详情状态可用。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 9: 实现主题选择页面与持久化**
action: 在 src/app/components/ZhuLiRenApp.tsx 中增加“我的 → UI 风格”页面和工作台快捷入口，支持三套预设主题立即切换；主题写入 localStorage，页面刷新后恢复，登录同步暂以可替换的偏好接口边界保留，不新增后端依赖。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 10: 补齐统一状态与移动端可用性**
action: 在主理人移动端相关组件中补齐骨架屏、空状态、缓存时间提示、错误重试、无权限状态、aria-label、最小点击区域、375px 横向溢出防护和固定底部导航避让；不改变已确认的业务流程。
loop: until npm run build succeeds && git diff --check succeeds
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

- [ ] **Step 11: 抽取双端共享契约**
action: 在 src/app/data 下整理不依赖 React DOM 的业务类型、主题名称、主题语义变量名称、状态枚举和关键路径文案，确保未来原生微信小程序可直接按同一契约实现；不在本步骤引入微信 SDK 或模拟完整原生工程。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [ ] **Step 12: 编写关键路径回归测试**
action: 在 tests 下新增主理人移动端回归测试，覆盖默认工作台、行动项进入详情并完成、社群筛选、项目进度同步、成长任务状态变化、三套主题切换与 localStorage 恢复；使用现有 Vitest 配置和 React 测试约定，不引入新测试框架。
loop: until npm test succeeds
max_iterations: 3
verify: npm test

- [ ] **Step 13: 完成生产构建与变更检查**
action: 在项目目录运行完整测试、生产构建和 diff 检查，确认本次主理人双端统一设计的 H5 实现没有引入类型、测试、构建或空白字符错误；只报告本次改动相关问题。
loop: until npm test && npm run build && git diff --check succeeds
max_iterations: 3
verify:
  - type: shell
    command: npm test
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

- [ ] **Step 14: 完成 375px H5 浏览器回归**
action: 启动或复用 Vite 开发服务器，在 375x812 视口访问 /?view=zhuliren-2，检查工作台、社群、项目、成长、我的五个入口，完成行动项、社群筛选、项目更新和主题切换，确认详情返回、底部导航、头像资源、缓存主题和控制台无新增错误。
loop: false
gate: human
verify:
  type: browser
  url: http://127.0.0.1:5187/?view=zhuliren-2
  check: 375x812 视口下五个入口、行动详情、社群卡片、项目卡片、成长任务、主题切换和详情返回正常，无横向溢出、遮挡或控制台错误
