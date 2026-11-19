---
intent: 将项目与商城页重构为我的项目优先工作台，并明确项目详情状态与操作
success_criteria: 主项目及下一步行动优先展示；发现项目和辅助入口层级清晰；不展示伪造的个人进度或报名成功；导航与查询参数保留；窄屏布局无重叠
risk_level: low
auto_approve: true
worktree: false

## Steps

- [ ] **Step 1: 调整项目工作台层级**
action: 编辑 `public/principal-1-h5/pages/group.html`：将成长营改为“正在进行”主卡，删除硬编码的用户参与数、席位数及动态进度示例，展示明确的静态项目阶段和下一步行动说明；将选品共学营归入“发现项目”；社群推荐、商城置于后续次级区块；删除 `.project-section--mall` 的 transform 和负 margin。保留现有各 data-nav 值及主页点击代理脚本。
loop: until 主页信息架构、文案层级与导航约束均符合设计规格
max_iterations: 3
verify: 使用仓库现有测试和构建后，在浏览器检查主页结构、移动端无重叠且没有负向商城位移；如无法浏览器验证，逐项检查 HTML/CSS 与导航处理器

- [ ] **Step 2: 完善成长营详情页**
action: 编辑 `public/member-app/pages/project-growth.html`，增加不冒充用户真实参与数据的状态说明、项目阶段/内容摘要、下一步行动说明、内容与权益分区，并提供继续查看项目内容的明确入口；只使用页面已确认的项目内容，不新增报名成功反馈。修复返回工作台操作，使 iframe 嵌入时通过 postMessage 发送 mpNavigate 并保留 location.search，独立页面仍正确导航。
loop: until 详情层级和独立/嵌入返回导航符合规格
max_iterations: 3
verify: 检查详情页文案不含虚构个人状态或进度，返回入口支持独立页面及 iframe，并保留查询参数

- [ ] **Step 3: 完善选品共学营详情页**
action: 编辑 `public/principal-1-h5/pages/project-selection.html`，明确这是可发现项目并呈现开放信息以现有页面可确认内容为限；保留每周选品、测试、复盘和共学信息，设置仅进入详情/内容的主操作，不显示虚假的报名成功反馈。修复返回工作台操作，使 iframe 嵌入时通过 postMessage 发送 mpNavigate 并保留 location.search，独立页面仍正确导航。
loop: until 项目状态表达克制且详情/返回入口符合规格
max_iterations: 3
verify: 检查无虚构名额、报名成功或用户参与状态，返回入口支持独立页面及 iframe

- [ ] **Step 4: 执行回归验证**
action: 对三个目标页面运行项目测试和构建；检查变更 diff，验证主页所有原有项目/社群/商城 data-nav 不丢失，详情页支持 iframe 消息导航且保留查询参数，并检查窄屏主要操作不被底部 TabBar 覆盖。
loop: until 测试与构建通过且目标页面回归检查无阻断问题
max_iterations: 3
verify: npm test && npm run build
