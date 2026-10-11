---
intent: 按首页体验、交互闭环、移动端视觉三个阶段完善主理人公社新版移动端，并复用主理人公社1页面的头像与群头像视觉
success_criteria: 新版 zhuliren-2 在 375x812 和 430px 宽度下无横向溢出；消息未读、项目报名、商品购买、群升级入群、成长任务状态均可回写并反馈；头像与群头像使用主理人1已有资源风格；每阶段通过测试、构建、diff 检查和浏览器预览验证
risk_level: low
auto_approve: true
worktree: false
branch: main
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立新版头像数据与图片回退组件**
action: 在 src/app/components/ZhuLiRenApp.tsx 中为会话、群聊和用户资料补充主理人1头像资源路径，增加统一的图片头像渲染结构，保留文字 fallback，并确保群头像使用圆角裁切与 object-fit cover
loop: until 头像数据和渲染结构可通过构建
max_iterations: 3
verify: npm run build

- [ ] **Step 2: 优化消息首页首屏层级**
action: 在 src/app/components/ZhuLiRenApp.tsx 中优化 MessageHome 的标题、未读提示、筛选区、系统通知、会话列表和推荐群 CTA 的间距及触控区域；不修改 App.tsx 路由
loop: until 消息首页结构完成且无类型错误
max_iterations: 3
verify: npm run build

- [ ] **Step 3: 预览验证首页体验**
action: 使用当前 Vite 服务打开 http://localhost:5180/?view=zhuliren-2，设置 375x812 视口，检查消息首页、底部导航、头像、筛选入口和推荐群入口，记录并修复本阶段发现的横向溢出或遮挡问题
loop: until 浏览器检查通过
max_iterations: 3
verify:
  type: browser
  url: http://localhost:5180/?view=zhuliren-2
  check: 375x812 消息首页首屏可读、头像资源可见、底部导航不遮挡、无横向溢出

- [ ] **Step 4: 建立可回写的消息未读状态**
action: 在 src/app/components/ZhuLiRenApp.tsx 中将会话和系统通知未读数据提升为状态，点击会话或系统通知时清零对应未读数，并让筛选未读数和底部消息角标同步更新
loop: until 未读状态回写行为通过测试和构建
max_iterations: 4
verify: npm test && npm run build

- [ ] **Step 5: 完善项目报名与商品购买反馈**
action: 在 src/app/components/ZhuLiRenApp.tsx 中为项目报名、商品购买增加提交中保护和完成反馈，确保订单数、权益数、项目状态与消息入口在当前会话内同步，避免重复点击重复累计
loop: until 项目和商品闭环可重复验证且不重复累计
max_iterations: 4
verify: npm test && npm run build

- [ ] **Step 6: 完善群升级入群闭环**
action: 在 src/app/components/ZhuLiRenApp.tsx 中保持 locked、previewing、limit、purchased、unlocked 状态语义，补充升级和入群完成反馈，确保群数量只在首次加入时增加，并同步正式群聊消息入口和我的群权限
loop: until 群状态、数量和入口同步
max_iterations: 4
verify: npm test && npm run build

- [ ] **Step 7: 完善成长任务状态反馈**
action: 在 src/app/components/ZhuLiRenGrowthDetail.tsx 和 src/app/components/ZhuLiRenApp.tsx 中按任务状态显示对应动作，已完成任务隐藏推进按钮，推进后显示明确成功反馈并保持列表状态同步
loop: until 成长详情和列表状态一致
max_iterations: 3
verify: npm test && npm run build

- [ ] **Step 8: 预览验证交互闭环**
action: 使用 http://localhost:5180/?view=zhuliren-2 在 375x812 视口依次验证消息已读、项目报名、商品购买、群升级入群、成长任务推进和返回路径，修复本阶段发现的问题
loop: until 关键路径全部可完成
max_iterations: 4
verify:
  type: browser
  url: http://localhost:5180/?view=zhuliren-2
  check: 消息未读清零、项目报名、商品购买、群升级入群、成长任务推进和返回路径均有可见状态反馈

- [ ] **Step 9: 修正移动端安全区与底部布局**
action: 在 src/app/components/ZhuLiRenApp.tsx、src/app/components/ZhuLiRenMessageDetail.tsx、src/app/components/ZhuLiRenGrowthDetail.tsx 和 src/app/components/ZhuLiRenAccountDetail.tsx 中调整页面底部留白、固定导航和详情操作区，避免 375x812 与 430px 宽度下内容被遮挡
loop: until 两个目标宽度均无遮挡
max_iterations: 4
verify: npm run build && git diff --check

- [ ] **Step 10: 补齐移动端视觉与无障碍细节**
action: 在上述移动端组件中统一头像尺寸、圆角、触控最小高度、焦点样式和图标按钮 aria-label，检查长文本、卡片间距、颜色对比和群头像与主理人1资源风格一致
loop: until 视觉和无障碍检查通过
max_iterations: 4
verify: npm run build && git diff --check

- [ ] **Step 11: 预览验证移动端视觉**
action: 使用 http://localhost:5180/?view=zhuliren-2 分别以 375x812 和 430x932 视口检查五个 Tab、详情页、固定导航、安全区、头像与群头像，并修复发现的布局问题
loop: until 两个视口检查通过
max_iterations: 3
verify:
  type: browser
  url: http://localhost:5180/?view=zhuliren-2
  check: 375x812 和 430x932 下五个 Tab、详情页、固定导航和头像群头像视觉正常且无横向溢出

- [ ] **Step 12: 完成全量验证**
action: 在项目根目录执行测试、构建和变更检查，确认只修改本次移动端优化涉及的文件且无未解决错误
loop: until 所有验证命令通过
max_iterations: 3
verify: npm test && npm run build && git diff --check
