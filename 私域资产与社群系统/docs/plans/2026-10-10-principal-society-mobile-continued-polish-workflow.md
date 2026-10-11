---
intent: 整体打磨主理人移动端的视觉一致性、交互反馈与 375px 移动端体验
success_criteria: 五个 Tab、详情页、群流程和头像资源保持可用；主要入口有反馈；测试、构建、diff 检查和浏览器回归通过
risk_level: low
auto_approve: true
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [x] **Step 1: 统一移动端基础交互语义**
action: 在 src/app/components/ZhuLiRenApp.tsx 中为 MobileHeader、GroupPreview、ProjectOrProductDetail、ConsoleHome、MeHome 的图标按钮和主要返回入口补齐 aria-label、最小点击区域与安全区间距；不改变现有状态流转。
loop: until git diff --check succeeds
max_iterations: 3
verify: git diff --check

- [x] **Step 2: 补齐消息、项目和设置入口反馈**
action: 在 src/app/components/ZhuLiRenApp.tsx 中为消息搜索、消息“查看全部”、项目搜索、项目“全部项目”、主理台更多、客服、账号设置等当前无响应按钮接入现有 Toast 或已有详情/Tab 跳转；保持未读清零和账户 rows 联动不变。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [x] **Step 3: 优化小屏卡片与底部导航布局**
action: 在 src/app/components/ZhuLiRenApp.tsx 中调整 375px 下的横向筛选、主理台统计卡、成长阶段条、商城双列卡片、底部导航和页面底部留白，确保主要按钮不被固定导航遮挡且内容不横向溢出。
loop: until npm run build succeeds
max_iterations: 3
verify: npm run build

- [x] **Step 4: 检查头像与交互状态保持一致**
action: 检查 src/app/components/ZhuLiRenApp.tsx 及相关详情组件，确保头像只使用 public/principal-1-h5/assets/avatars 中存在的文件，群头像继续使用 avatar-12.jpg，项目报名、商品购买、成长任务、群升级和入群后的 Toast 与数量状态保持一致。
loop: false
verify:
  - type: shell
    command: for file in avatar-01.jpg avatar-02.jpg avatar-03.jpg avatar-04.jpg avatar-09.jpg avatar-12.jpg; do test -f "public/principal-1-h5/assets/avatars/$file" || exit 1; done
  - type: shell
    command: git diff --check

- [x] **Step 5: 完成自动化回归**
action: 在项目目录运行完整测试和生产构建，确认主理人移动端相关改动没有引入 TypeScript、测试或构建错误。
loop: until npm test && npm run build && git diff --check succeeds
max_iterations: 3
verify:
  - type: shell
    command: npm test
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

- [x] **Step 6: 完成 375px 浏览器回归**
action: 启动或复用 Vite 开发服务器，在 375x812 视口访问 /?view=zhuliren-2，依次检查消息、项目、主理台、成长、我的五个 Tab，打开消息/成长/账户/项目详情并返回，完成群试看与升级入口点击，检查头像图片加载和控制台错误。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5187/?view=zhuliren-2
  check: 375x812 视口下五个 Tab、详情返回、群流程、头像资源和主要入口反馈正常，无横向溢出和控制台错误
