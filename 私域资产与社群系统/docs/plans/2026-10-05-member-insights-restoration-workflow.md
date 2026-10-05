---
intent: 恢复会员资料栏的经营摘要和会员分层指标，仅展示可核验数据，并明确 RFM 数据尚未接入的状态。
success_criteria: 资料栏展示动态经营摘要和经营标签；社群数与明细一致；RFM 不显示虚构数值；测试、构建和浏览器验收通过。
risk_level: low
auto_approve: true
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 为会员洞察派生模型建立失败测试**
action: 在 tests/memberInsights.test.ts 中为资料栏派生函数编写测试：已入群高影响力会员应得到社群数、已入群服务状态和高潜力会员标签；待入群会员应得到零社群数和待服务跟进标签；RFM 字段应只包含待接入或待同步状态，不包含金额、订单数或冠军客户等静态样例。
loop: false
max_iterations: 1
verify: yarn vitest run tests/memberInsights.test.ts
gate: auto

- [ ] **Step 2: 实现可核验的会员洞察派生模块**
action: 新建 src/app/data/memberInsights.ts，定义资料栏所需的输入和展示模型；根据会员 rank、level、influence、邀请入群客观状态和已加入社群列表，派生已入社群数、影响力、会员等级、服务状态、经营标签与建议，并返回明确的 RFM 待接入状态。不得导入 React 组件或放入硬编码订单、金额、活跃日期、RFM 客户等级。
loop: until tests/memberInsights.test.ts passes
max_iterations: 3
verify: yarn vitest run tests/memberInsights.test.ts
gate: auto

- [ ] **Step 3: 在资料栏接入经营摘要和会员分层区块**
action: 修改 src/app/components/InfluenceRanking.tsx：调用 memberInsights 派生模型；移除经营摘要和分层指标容器上的 hidden；按“基础资料、经营摘要、会员分层、已加入社群、资料 Tabs”顺序渲染。经营摘要展示已入社群、影响力、会员等级与服务状态；会员分层展示经营标签、建议和 R/F/M/RFM 待接入状态。移除资料栏现有静态的 3 单、2 群、今天、近30天 3次、¥1,240、冠军客户与虚构同步时间。
loop: until yarn build passes
max_iterations: 3
verify: yarn build
gate: auto

- [ ] **Step 4: 扩展数据派生的边界测试**
action: 完善 tests/memberInsights.test.ts，覆盖无邀请入群任务显示未分配、已入群但低影响力显示已服务会员、任何输入下 RFM 指标均不展示静态金额或客户等级，且社群数量等于传入的已加入社群列表长度。
loop: until tests/memberInsights.test.ts passes
max_iterations: 3
verify: yarn vitest run tests/memberInsights.test.ts
gate: auto

- [ ] **Step 5: 验证完整测试和生产构建**
action: 运行全量测试、生产构建和变更空白检查；若失败，仅修复本工作流涉及文件中的问题，不回退工作区已有的 EcosystemManagement.tsx 或其他用户修改。
loop: until all checks pass
max_iterations: 3
verify:
  - type: shell
    command: yarn test
  - type: shell
    command: yarn build
  - type: shell
    command: git diff --check
gate: auto

- [ ] **Step 6: 浏览器验收资料栏状态联动**
action: 在会员数据页面依次选择已入群会员和待入群会员，验证经营摘要、会员分层和社群明细随选择同步更新；确认页面不再显示静态订单、消费、冠军客户或虚构同步时间，并确认资料 Tabs 与二维码入口保持可用。
loop: false
max_iterations: 1
verify:
  type: browser
  url: http://127.0.0.1:5205/?view=pc&module=users&role=platform_op
  check: 已入群会员显示动态社群数和高潜力或已服务标签；待入群会员显示零社群数和待服务跟进；RFM 全部为待接入或待同步状态。
gate: auto
