---
intent: 将主理台改造为符合“代理招募团长、团长推广成交、订单路由代理库存发货、团长获得佣金”的双角色四分法工作台，并保持影响力页的视觉排版语言。
success_criteria: 代理端展示团队、经营、履约、推广四个维度；团长端展示社群、佣金、事项、推广四个维度；团长档案页反映归属、社群、培训、活跃和成交数据；构建和差异检查通过。
risk_level: low
auto_approve: true
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 角色化工作台状态与数据**
action: 在 public/member-app/pages/tasks.html 用 people、money、process、marketing 四个稳定键替换旧的团队、收益、审核、推广字符串状态；定义代理标签为团队、经营、履约、推广，团长标签为社群、佣金、事项、推广；将旧的团队分润、团长管理代理和代理拿佣金的数据改为库存经营、代理履约和团长销售佣金数据。
loop: false
max_iterations: 1
verify: node --check public/member-app/pages/tasks.html
gate: auto

- [ ] **Step 2: 代理端四分法与库存履约**
action: 在 public/member-app/pages/tasks.html 更新代理端 people、money、process、marketing 渲染，使团队页包含团长招募、初审、团长档案、活跃度与排行；经营页展示进货成本、库存价值、销售回款、预计利润和待结算团长佣金；履约页展示团长申请、库存占用、待发货、低库存、物流和售后；推广页展示给团长布置的活动、内容和培训任务。
loop: false
max_iterations: 1
verify: node --check public/member-app/pages/tasks.html
gate: auto

- [ ] **Step 3: 团长端四分法与佣金流程**
action: 在 public/member-app/pages/tasks.html 更新团长端 people、money、process、marketing 渲染，使社群页包含成员、活跃、留存和待跟进；佣金页展示预计、已结算、可提现和订单佣金；事项页展示本人双层审核、订单路由、代理发货物流和售后；推广页展示领取素材、完成推广任务和向代理汇报。
loop: false
max_iterations: 1
verify: node --check public/member-app/pages/tasks.html
gate: auto

- [ ] **Step 4: 团长档案页和下钻跳转**
action: 在 public/member-app/pages/agent-info.html 将旧代理信息语义改为代理查看名下团长的档案，展示审核状态、所属社群、培训进度、活跃度、本期成交、预计佣金和近期推广动态；更新标题、描述与底部操作，并确保 tasks.html 的团队列表跳转至该页。
loop: false
max_iterations: 1
verify: node --check public/member-app/pages/agent-info.html

gate: auto

- [ ] **Step 5: 静态校验与页面验证**
action: 运行 npm run build、git diff --check 和 node --check，启动本地静态服务器并在移动视口检查代理与团长切换、四个页签、周期切换和团长档案跳转；仅修复本次页面引入的问题。
loop: until npm run build、git diff --check 和 node --check 均通过，且浏览器中无脚本报错
max_iterations: 3
verify:
  - type: shell
    command: npm run build && git diff --check && node --check public/member-app/pages/tasks.html && node --check public/member-app/pages/agent-info.html
  - type: browser
    url: http://127.0.0.1:4173/member-app/pages/tasks.html?full=1
    check: 代理与团长均可进入对应四个页签，页面不溢出且没有控制台错误
gate: auto
