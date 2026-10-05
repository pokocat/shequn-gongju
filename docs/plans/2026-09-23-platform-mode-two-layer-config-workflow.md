---
intent: 将当前社群系统的平台模式配置改造成“平台预置规则 + 运营可调参数”两层架构，并统一 D1-D5 角色体系与权限边界
success_criteria: 配置页面明确区分两层规则；D1-D3 公司角色与 D4-D5 代理角色统一展示；管理员或具备配置权限的 D1 可编辑、预览、发布、回滚运营参数；D2-D5 只读；构建、脚本检查和浏览器回归通过
risk_level: medium
auto_approve: false
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立两层配置数据模型**
action: 在 `src/app/data/levelConfig.ts` 中将现有等级配置整理为单一 D1-D5 模型，补充角色分组、预置规则、运营参数、配置版本和生效状态字段；明确 D1-D3 为公司角色、D4-D5 为代理角色，避免继续出现 G1-G5 的第二套等级编号。
loop: until `src/app/data/levelConfig.ts` 能同时导出 D1-D5 角色、预置规则和运营参数类型，并且无重复等级编号
max_iterations: 3
verify:
  type: shell
  command: node -e "const fs=require('fs'); const p='src/app/data/levelConfig.ts'; const s=fs.readFileSync(p,'utf8'); if(!s.includes('D1')||!s.includes('D5')||!s.includes('预置')||!s.includes('运营')) process.exit(1)"

- [ ] **Step 2: 实现配置权限状态**
action: 在配置页面使用统一的身份与权限判断，支持平台管理员、具备配置权限的 D1、D2、D3、D4、D5 五类展示态；管理员或具备配置权限的 D1 显示编辑入口，其他身份隐藏保存、发布和回滚操作。
loop: until 页面权限状态与设计说明中的权限矩阵一致
max_iterations: 3
verify:
  type: shell
  command: grep -R -n -E "平台管理员|D1|D2|D3|D4|D5|可配置|只读|回滚" src/app public/member-app/pages --include='*.ts' --include='*.tsx' --include='*.html'

- [ ] **Step 3: 重构平台模式配置页面信息架构**
action: 在当前项目现有的平台建设 / 模式配置入口中加入配置总览、平台预置规则、运营可调参数、版本与变更记录四个区域；预置规则以只读方式展示角色骨架、归属关系和核心业务责任，运营参数展示可编辑字段与当前生效版本。
loop: until 配置页面同时展示两层配置和 D1-D5 分组，不再把角色等级、分润和权限混在单一配置卡中
max_iterations: 3
verify:
  type: browser
  url: http://localhost:5173
  check: 页面能进入模式配置，看到平台预置规则、运营可调参数、公司角色 D1-D3、代理角色 D4-D5 和版本信息

- [ ] **Step 4: 实现草稿、预览、发布和回滚交互**
action: 在运营可调参数区域实现草稿编辑、影响预览、发布生效、版本记录和回滚入口；发布后更新当前版本与生效状态，历史订单规则说明保持只读且不被新参数覆盖。
loop: until 修改运营参数后可以看到草稿状态、影响预览、发布后的版本变化和历史版本入口
max_iterations: 3
verify:
  type: browser
  url: http://localhost:5173
  check: 管理员或可配置 D1 能完成编辑到发布流程，普通身份看不到编辑、发布和回滚按钮

- [ ] **Step 5: 对齐移动端关联页面文案**
action: 检查 `public/member-app/pages/promote.html`、`invite-poster.html`、`matrix.html`、`training.html` 及 `tasks.html` 的角色称谓，确保代理角色使用 D4/D5 体系、团长归属代理、代理负责库存履约、团长获得销售佣金，并移除旧的多级邀请和错误收益表达。
loop: until 关联页面不再出现旧关系模型关键词，并且新文案与两层配置角色体系一致
max_iterations: 3
verify:
  type: shell
  command: ! grep -R -n -E '名下代理|最多三级|一至三级|团队月收益|邀请注册代理|认证代理|会员轨|收益提现' public/member-app/pages/promote.html public/member-app/pages/invite-poster.html public/member-app/pages/matrix.html public/member-app/pages/training.html

- [ ] **Step 6: 执行静态检查与生产构建**
action: 提取配置相关 HTML 的内嵌脚本执行语法检查，运行 `git diff --check` 和项目生产构建，修复本次改动引入的错误但不改动无关的既有工作区变更。
loop: until 所有脚本检查、差异检查和生产构建通过
max_iterations: 3
verify:
  type: shell
  command: npm run build && git diff --check

- [ ] **Step 7: 移动端浏览器回归**
action: 启动 Vite 开发服务，在 390x844 视口验证管理员/D1 配置态、D2-D5 只读态、公司角色与代理角色切换、配置版本显示以及代理招募团长和团长成长培训路径；确认 URL 参数和控制台无错误。
loop: false
verify:
  type: browser
  url: http://localhost:5173
  check: 390x844 下配置页面布局不溢出，权限状态正确，角色分组和关联页面跳转正常，控制台无错误
gate: human
