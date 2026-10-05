---
intent: 在不改变现有页面视觉结构的前提下，统一关联页的代理—团长业务语义：代理招募并赋能团长、代理持库存履约发货、团长推广成交并获得佣金。
success_criteria: promote、invite-poster、matrix、training 页面不再出现团长管理代理、三级返佣或团队分润语义；入口跳转与代理招募团长、团长成长培训的职责一致；生产构建和关键浏览器路径通过。
risk_level: low
auto_approve: true
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 重构推广页角色语义与操作**
action: 修改 public/member-app/pages/promote.html，保留现有双视图和布局。代理视图改为团长招募、赋能任务、团长成交贡献与库存履约协同；团长视图改为素材推广、成交佣金、订单路由上级代理与社群运营。删除名下代理、团队收益、引流现金奖励、邀请注册代理、收益提现等旧层级与返佣语义；将邀请入口统一表达为代理招募团长，并把培训入口表达为团长成长培训。
loop: false
max_iterations: 1
verify:
  type: shell
  command: "! grep -E '名下代理|团队月收益|邀请注册代理|奖励 ¥18 / 引流|收益提现' public/member-app/pages/promote.html"
gate: auto

- [ ] **Step 2: 修订团长招募海报与邀请规则**
action: 修改 public/member-app/pages/invite-poster.html，保留海报布局，将邀请对象明确为团长申请；将最多三级邀请和虚拟奖励规则改为直属上级代理绑定、一个团长只归属一个代理、代理初审后进入平台复审；清除与多级关系或返佣冲突的统计及文案。
loop: false
max_iterations: 1
verify:
  type: shell
  command: "! grep -E '最多三级|一至三级|成长值等虚拟权益|不做返佣结算' public/member-app/pages/invite-poster.html"
gate: auto

- [ ] **Step 3: 校正矩阵与培训页面的角色表述**
action: 修改 public/member-app/pages/matrix.html 和 public/member-app/pages/training.html。矩阵档案不再将认证代理作为默认个人身份，改为团长或社群运营身份；培训页支持团长成长培训的入口语义，突出社群运营、推广素材、成交服务和向上级代理汇报，不改变原有课程交付布局。
loop: false
max_iterations: 1
verify:
  type: shell
  command: "! grep -E '认证代理|学习轨：会员轨' public/member-app/pages/matrix.html public/member-app/pages/training.html"
gate: auto

- [ ] **Step 4: 静态语义与脚本检查**
action: 对 promote.html、invite-poster.html、matrix.html、training.html 提取每个内嵌 script 至 /tmp 并用 node --check 校验；同时运行 git diff --check，确认不存在空白错误。
loop: until all checks pass
max_iterations: 3
verify:
  type: shell
  command: "python3 - <<'PY'\nfrom pathlib import Path\nimport re\nfor name in ('promote.html', 'invite-poster.html', 'matrix.html', 'training.html'):\n    text = Path('public/member-app/pages', name).read_text()\n    for index, script in enumerate(re.findall(r'<script(?:\\s[^>]*)?>([\\s\\S]*?)</script>', text)):\n        Path(f'/tmp/{name}.{index}.js').write_text(script)\nPY\nfor file in /tmp/promote.html.*.js /tmp/invite-poster.html.*.js /tmp/matrix.html.*.js /tmp/training.html.*.js; do node --check \"$file\"; done\ngit diff --check -- public/member-app/pages/promote.html public/member-app/pages/invite-poster.html public/member-app/pages/matrix.html public/member-app/pages/training.html"
gate: auto

- [ ] **Step 5: 构建并回归关键跳转路径**
action: 运行 npm run build；启动 Vite 本地服务后，以 390×844 视口打开 tasks.html?full=1，验证代理视图的招募团长入口能进入 invite-poster.html，验证团长视图的成长培训入口能进入 training.html，并确认目标页不包含旧层级/返佣文案。
loop: until build and browser checks pass
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: browser
    url: http://127.0.0.1:5182/member-app/pages/tasks.html?full=1
    check: 代理招募团长与团长成长培训入口可跳转且目标页不显示旧层级或返佣文案。
gate: auto
