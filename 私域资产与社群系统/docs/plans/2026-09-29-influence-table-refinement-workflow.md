---
intent: 优化主理人公社小程序影响力详情表格的关系层级名称与新增人数展示，保证移动端简约且无重叠。
success_criteria: 表格行名为两字、新增人数以主数字后的红色 +N 同行展示、潜在数据不被遮挡，并且语法检查、差异检查、构建和 430px 视口验证通过。
risk_level: low
auto_approve: true
branch: codex/publish-community-system
worktree: false
dirty_worktree: allow
---

## Steps

- [x] **Step 1: 调整表格新增人数样式**
action: 修改 public/member-app/pages/tasks.html 的 .influence-add，移除绝对定位、红色背景、边框和阴影，改为与 .influence-value 同行的红色小号加粗文本；保留 .influence-potential 块级单行展示。
loop: until inline script syntax check passes
max_iterations: 3
verify: python3 -c 'import re,sys; p="public/member-app/pages/tasks.html"; s=open(p,encoding="utf-8").read(); sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check

- [x] **Step 2: 缩短影响力关系层级名称**
action: 修改 public/member-app/pages/tasks.html 的 shared.agent.tabs 与 shared.leader.tabs 行标签，将代理端显示名调整为直推、团队、推荐，将团长端显示名调整为直营、推荐、发展、会员；保持每个单元格数据、列头、颜色、说明和 data-team-detail 下钻生成逻辑不变。
loop: until inline script syntax check passes
max_iterations: 3
verify: python3 -c 'import re,sys; p="public/member-app/pages/tasks.html"; s=open(p,encoding="utf-8").read(); sys.stdout.write("\n".join(re.findall(r"<script[^>]*>(.*?)</script>",s,re.S)))' | node --check

- [x] **Step 3: 更新新增说明并完成静态验证**
action: 修改 public/member-app/pages/tasks.html 中影响力表格说明，将“红色徽标”改为“红色 +N”；运行 git diff --check 与 npm run build，修复本次改动造成的任一错误。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: git diff --check
  - type: shell
    command: npm run build

- [x] **Step 4: 验证移动端影响力表格**
action: 在 430px 宽度本地预览中验证代理端团队发展与社群会员表格、团长端社群会员与推荐关系表格，确认两字关系层级不换行，红色 +N 与主数字同行，潜在 N 可见且没有覆盖。
loop: until browser verification passes
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5179/member-app/pages/tasks.html?embed=1
  check: 在移动端实际预览中，四张影响力表格均无横向溢出；关系层级均为两字且不换行；新增人数采用 static 定位且潜在数据可见；表格数字下钻可用。
