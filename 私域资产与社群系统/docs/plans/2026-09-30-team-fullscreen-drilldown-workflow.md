---
intent: 将团队页所有团队与影响力下钻从底部抽屉替换为整屏页面流，保留现有指标、数值与角色权限口径。
success_criteria: 我的团队、运营网络、影响力矩阵和成员行均可进入匹配的整屏页；支持成员详情与下一级关系返回；脚本检查、差异检查、构建和移动端浏览器回归通过。
risk_level: low
auto_approve: true
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立整屏详情层样式与容器**
action: 在 `public/member-app/pages/tasks.html` 中移除团队详情抽屉的遮罩与上拉样式，新增覆盖主理台内容区的整屏详情层、导航栏、统计区、筛选区、搜索框、成员行、明细日期分组、成员档案和空状态样式；保持现有暖米色与紫色视觉变量。
loop: false
max_iterations: 1
verify: python3 -c 'from pathlib import Path; s=Path("public/member-app/pages/tasks.html").read_text(); assert "team-fullscreen" in s and "team-detail-mask" not in s'

- [ ] **Step 2: 建立结构化整屏页面状态与渲染器**
action: 在 `public/member-app/pages/tasks.html` 中以结构化页面状态栈替换 `TEAM_DETAIL_STACK`、`renderTeamDetail`、`openTeamDetail` 和 `closeTeamDetail`，实现团队总览、关系成员、指标明细、成员详情四种页面渲染，复用现有圆环图并使用演示成员数据呈现授权范围。
loop: until inline script parses
max_iterations: 3
verify: python3 -c 'import re,sys; from pathlib import Path; s=Path("public/member-app/pages/tasks.html").read_text(); sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check

- [ ] **Step 3: 连接团队入口与指标上下文**
action: 在 `public/member-app/pages/tasks.html` 中为我的团队、运营网络卡片和影响力矩阵单元格输出结构化 `data-team-page` 上下文，确保点击后分别进入团队总览、关系列表或指标明细，并将主数、周新增、潜在值和关系名称传入页面状态。
loop: until inline script parses
max_iterations: 3
verify: python3 -c 'import re,sys; from pathlib import Path; s=Path("public/member-app/pages/tasks.html").read_text(); assert "data-team-page" in s; sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check

- [ ] **Step 4: 连接下钻、返回与身份切换交互**
action: 在 `public/member-app/pages/tasks.html` 的事件委托中替换 `data-team-detail` 和抽屉事件逻辑，支持整屏返回、关系筛选、成员详情、下一级关系、搜索输入和身份切换时关闭整屏详情；保留原有其他工作台事件处理。
loop: until inline script parses
max_iterations: 3
verify: python3 -c 'import re,sys; from pathlib import Path; s=Path("public/member-app/pages/tasks.html").read_text(); assert "data-team-page" in s and "data-team-full-back" in s; sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check

- [ ] **Step 5: 验证整屏下钻与生产构建**
action: 运行差异检查、生产构建，并在 430px 移动端浏览器中验证代理端和团长端的我的团队、矩阵指标明细、成员详情、下一级关系与返回路径；修复任何检查失败或布局溢出。
loop: until all checks pass
max_iterations: 3
verify:
  - type: shell
    command: git diff --check && npm run build
  - type: browser
    url: http://127.0.0.1:4173/member-app/pages/tasks.html
    check: 整屏团队与指标下钻可打开、逐级返回且页面无横向溢出
