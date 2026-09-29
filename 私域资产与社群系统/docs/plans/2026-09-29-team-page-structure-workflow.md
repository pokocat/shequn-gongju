---
intent: 在主理台团队页保留现有影响力详情数据口径，仅优化团队成长卡、二级 Tab 字体、新增数字呈现和底部动作归位。
success_criteria: 团队页展示“团队成长”和“我的团队”，影响力详情的列头和数据保持不变，新增值显示为右上角红底白字 +N 徽标，团队页不显示底部动作栏，构建与脚本检查通过。
risk_level: low
auto_approve: true
branch: codex/publish-community-system
worktree: false
---

## Steps

- [ ] **Step 1: 调整团队页导航与成长卡视觉**
action: 在 public/member-app/pages/tasks.html 中将 .subtab-pill 默认字号调整为 14px 并将选中态调整为 15px；将团队成长图标由文字徽标改为内联线条 SVG；将“培训学习”改为“团队成长”，将“认证进度”改为“我的团队”，并将第二张卡的详情入口保留在现有成员下钻机制内。
loop: false
max_iterations: 1
verify: node --check public/member-app/pages/tasks.html

- [ ] **Step 2: 保留影响力详情口径并替换新增标记**
action: 在 public/member-app/pages/tasks.html 中不修改 shared.agent.tabs 和 shared.leader.tabs 的 headers、rows、colors 与 note 数据，只将单元格的 +N 新增文字替换为主数字右上角的 .influence-add 徽标，并将提示文案更新为红色徽标说明。
loop: until node --check public/member-app/pages/tasks.html passes
max_iterations: 3
verify: node --check public/member-app/pages/tasks.html

- [ ] **Step 3: 将底部动作按子页归位**
action: 在 public/member-app/pages/tasks.html 中仅在履约和推广子页渲染 actbar；团队和经营页不渲染 actbar。代理履约页显示“经营社群”，推广页显示“招募团长”；团长履约页显示“成长培训”，推广页显示“去推广”。
loop: until node --check public/member-app/pages/tasks.html passes
max_iterations: 3
verify: node --check public/member-app/pages/tasks.html

- [ ] **Step 4: 验证静态页面和移动端布局**
action: 运行格式与构建检查，并在 430px 小程序视口中检查团队页、履约页、推广页，确认团队页没有底部动作栏、新增徽标不溢出、影响力详情列头及单元格数据仍然完整。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: git diff --check && npm run build
  - type: browser
    url: http://127.0.0.1:5178/member-app/pages/tasks.html
    check: 430px 视口中的团队页显示“团队成长”和“我的团队”，影响力详情新增值为红底白字 +N，团队页无底部动作栏
