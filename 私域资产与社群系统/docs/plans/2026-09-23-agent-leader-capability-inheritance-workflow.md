---
intent: 让代理工作台直接复用团长社群运营能力，同时保留代理专属的团长管理、库存履约和经营管理功能
success_criteria: 代理与团长共享社群运营入口和数据卡片；代理额外显示团长管理、履约和经营模块；团长不显示代理专属操作；页面构建、脚本检查和 390x844 浏览器回归通过
risk_level: medium
auto_approve: false
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 抽取代理与团长共享能力模型**
action: 在 `public/member-app/pages/tasks.html` 中将社群、成员、内容、活动、商品推广、成交服务和订单路由状态定义为代理与团长共享能力，避免继续用 agent/leader 两套完全独立的数据结构表达相同能力；保留代理经营数据与团长佣金数据的差异。
loop: until 代理和团长都能从同一组共享能力配置生成社群相关内容，且代理专属字段没有混入团长视图
max_iterations: 3
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
s=Path('public/member-app/pages/tasks.html').read_text()
for token in ['共享','社群','成员','推广','成交']:
    if token not in s: raise SystemExit(token)
if 'ROLE === \'agent\'' not in s or 'ROLE === \'leader\'' not in s: raise SystemExit('role branches missing')
PY

- [ ] **Step 2: 调整工作台导航与角色专属模块**
action: 修改 `public/member-app/pages/tasks.html` 的 `ROLE_TABS`、操作栏和子页签渲染：代理增加可进入的社群运营入口，并保留团长管理、履约、经营入口；团长保留社群、推广、订单和佣金入口，不显示招募团长、库存采购、发货执行、售后处理和团队经营管理入口。
loop: until 两种身份的导航和操作按钮符合“代理能力 = 团长能力 + 代理专属能力”，且按钮文案与业务责任一致
max_iterations: 3
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
s=Path('public/member-app/pages/tasks.html').read_text()
required=['招募团长','去发货','预计佣金','查看结算','社群']
for token in required:
    if token not in s: raise SystemExit(token)
PY

- [ ] **Step 3: 对齐推广页的共享社群运营视图**
action: 修改 `public/member-app/pages/promote.html`，让代理视角和团长视角都展示社群运营、内容发布、成员跟进、商品推广和成交服务相关能力；代理继续展示团长赋能、任务下发和库存履约说明，团长继续展示来自上级代理的任务和订单路由说明。
loop: until 推广页的共享能力文案一致，代理专属能力和团长可执行能力边界清晰
max_iterations: 3
verify:
  type: shell
  command: ! grep -n -E '名下代理|最多三级|一至三级|邀请注册代理|认证代理|可提现|提现|团队推广看板' public/member-app/pages/promote.html

- [ ] **Step 4: 清理关联页面中的身份与数据范围表达**
action: 检查并按需修改 `public/member-app/pages/agent-info.html`、`public/member-app/pages/invite-poster.html`、`public/member-app/pages/training.html` 和 `public/member-app/pages/matrix.html`，确保代理查看的是直属团长及其社群经营数据，团长查看的是自己的社群数据，旧的代理/团长身份迁移逻辑保持兼容。
loop: until 关联页面没有把代理描述为只负责库存、也没有把团长描述为拥有代理管理能力
max_iterations: 3
verify:
  type: shell
  command: ! grep -R -n -E '团长招募代理|团长管理代理|名下代理|邀请注册代理|可提现金额|收益提现' public/member-app/pages/tasks.html public/member-app/pages/promote.html public/member-app/pages/agent-info.html public/member-app/pages/invite-poster.html public/member-app/pages/training.html public/member-app/pages/matrix.html

- [ ] **Step 5: 检查内嵌脚本、差异和生产构建**
action: 提取 `tasks.html`、`promote.html`、`agent-info.html`、`invite-poster.html`、`training.html` 和 `matrix.html` 的内嵌脚本执行 `node --check`，然后运行 `git diff --check` 和 `npm run build`；只修复本次能力继承改动引入的问题。
loop: until 所有内嵌脚本语法检查、差异检查和生产构建都通过
max_iterations: 3
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
import re, subprocess, tempfile
pages=['tasks.html','promote.html','agent-info.html','invite-poster.html','training.html','matrix.html']
for page in pages:
    text=Path('public/member-app/pages',page).read_text()
    for i,script in enumerate(re.findall(r'<script(?:\\s[^>]*)?>(.*?)</script>',text,re.S|re.I)):
        path=Path(tempfile.gettempdir())/f'{page}-{i}.js'
        path.write_text(script)
        subprocess.run(['node','--check',str(path)],check=True)
PY
npm run build && git diff --check

- [ ] **Step 6: 完成 390x844 移动端角色回归**
action: 启动 Vite 服务并使用浏览器在 390x844 视口分别打开 `tasks.html?full=1` 的代理和团长视角，以及 `promote.html` 的代理和团长视角；检查代理能进入共享社群功能并额外看到团长、履约、经营模块，团长只看到社群、推广、订单、佣金模块；同时检查页面无横向内容溢出和控制台错误。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5185/member-app/pages/tasks.html?full=1
  check: 390x844 下代理和团长均能使用社群运营能力，代理显示额外管理/履约/经营入口，团长不显示代理专属操作，promote.html 两种视角文案和入口一致，控制台无错误
gate: human
