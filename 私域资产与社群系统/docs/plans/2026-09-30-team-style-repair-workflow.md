---
intent: 优化团队页面在移动端的视觉密度、信息层级与窄屏可读性，同时保持既有数据和整屏下钻交互不变。
success_criteria: 团队入口、影响力矩阵、运营网络和整屏团队页面在 430px 画布中布局清晰、无横向溢出，且构建与脚本检查通过。
risk_level: low
auto_approve: true
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 调整团队主页卡片密度**
action: 在 public/member-app/pages/tasks.html 中收紧 team-growth-item、team-functions、influence-metrics 和 influence-card 的内边距与模块间距，保证团队成长和我的团队入口的标题、描述、数量和箭头在移动端清晰对齐。
loop: until visual hierarchy is compact without text overlap
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5173/member-app/pages/tasks.html
  check: 代理角色团队页的团队成长、我的团队及核心指标卡片在窄屏中完整显示且没有文字遮挡

- [ ] **Step 2: 优化影响力矩阵的数字层级**
action: 在 public/member-app/pages/tasks.html 中调整 influence-matrix、influence-value、influence-add 和 influence-potential 的列宽、行高、字号和间距，使主数、红色本周新增数和潜在数分层明确，并保留全部现有表头和数据。
loop: until matrix values are readable at mobile width
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5173/member-app/pages/tasks.html
  check: 代理角色团队页影响力矩阵的四列数据完整可读，红色加数与潜在数不重叠

- [ ] **Step 3: 提升运营网络与整屏页面可读性**
action: 在 public/member-app/pages/tasks.html 中调整 influence-team-grid、influence-team-cell、influence-boundary 和 team-fullscreen 相关样式，提升三列网络卡片、权限说明、整屏页头、搜索筛选和成员列表的移动端层级与触控可读性。
loop: until team drill-down screens are visually balanced
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5173/member-app/pages/tasks.html
  check: 从我的团队和运营网络进入整屏页面后，页头、搜索筛选和成员列表无裁切、无横向滚动且层级清晰

- [ ] **Step 4: 执行静态与构建回归**
action: 对 public/member-app/pages/tasks.html 提取内联脚本执行 node --check，执行 git diff --check 与 npm run build，并在浏览器中检查控制台和文档横向溢出。
loop: until all verification commands succeed
max_iterations: 3
verify:
  - type: shell
    command: python3 -c 'import re,sys; from pathlib import Path; s=Path("public/member-app/pages/tasks.html").read_text(); sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check && git diff --check && npm run build
  - type: browser
    url: http://127.0.0.1:5173/member-app/pages/tasks.html
    check: 页面控制台无错误，documentElement.scrollWidth 不大于 innerWidth
