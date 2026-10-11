---
intent: 将会员、社群、项目、代理四类数据视角重整为围绕业务对象、关键经营数据、运营阶段与下一步动作的快速分析和快速运营工作台，并统一主理人公社项目、项目身份、项目账号任务及社群服务人员账号关联。
success_criteria: 会员主表可判断平台身份、会员等级、平台账号状态、项目身份摘要与运营阶段；会员资料可展开项目授权、项目账号、服务人员、账号任务、订单和消费；社群可按社群与活动分析触达、点击、绑定、报名、消费、订单和成交额；项目可分析代理发展、会员发展、订单和交易额；代理可分析下线会员、订单、交易额、佣金、培训和考核；现有账号添加按钮、状态判断、登录绑定授权状态、操作日志、失败原因、重新操作和引导交互保持可用；项目名称保持主理人公社选择器标准；测试、构建、git diff 检查和浏览器验证通过。
risk_level: medium
auto_approve: false
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 固定实施边界并记录工作区保护项**
action: 在项目根目录读取 `docs/superpowers/specs/2026-10-06-four-scope-operational-workbench-design.md`，检查 `src/app/components/EcosystemManagement.tsx`、`src/app/components/PCLayout.tsx` 及现有未提交变更；确认本轮不得恢复 `经营摘要`、`会员分层`、`RFM`，不得删除账号添加、状态判断、操作日志和引导交互，不得覆盖其他文件的有意修改。
loop: false
max_iterations: 1
verify:
  - type: artifact
    path: docs/superpowers/specs/2026-10-06-four-scope-operational-workbench-design.md
    assert:
      kind: exists
  - type: shell
    command: git status --short

- [ ] **Step 2: 统一主理人公社项目身份配置**
action: 在 `src/app/App.tsx`、`src/app/data/projectGroupRules.ts`、`src/app/data/levelConfig.ts` 中核对并收敛主理人公社及九个标准项目名称；建立稳定项目 ID、标准名称和已有旧名称的显式映射，保留已有项目社群规则数据，避免把旧名称静默覆盖为另一项目；让项目选择器、项目规则读取和项目身份等级使用同一标准项目标识。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

- [ ] **Step 3: 建立项目社群服务人员与系统账号的可复用匹配读取**
action: 在 `src/app/data/projectGroupRules.ts`、`src/app/data/accountTypes.ts`、`src/app/components/ProjectCommunitySystem.tsx` 中复用现有平台级账号、项目级账号、启用状态、城市、服务人员和账号身份数据；为会员资料提供当前项目和城市下的匹配结果，优先项目专属、其次城市匹配、再到主理人公社平台级账号、最后未匹配；不改变现有账号添加按钮、状态判断、日志和社群配置入口。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

gate: human

- [ ] **Step 4: 为会员主表补齐平台身份、平台账号和项目身份摘要模型**
action: 在 `src/app/components/InfluenceRanking.tsx` 及必要的共享数据文件中，将会员行模型从模糊的 `totalUsers` 收敛为明确的影响会员数语义，并补充平台业务身份、会员等级、平台账号状态、项目身份摘要、社群状态、最近活跃、累计消费和运营阶段字段；主表仅展示平台账号是否已添加与项目身份摘要，不展开项目账号授权日志。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 5: 接入会员运营阶段与阶段化操作**
action: 在 `src/app/components/InfluenceRanking.tsx` 和 `src/app/components/workbenchScopes.tsx` 中补齐会员阶段分类：待建立关系、待入群、待激活、已授权未消费、待首次转化、待复购、待升级、高价值会员、沉默会员和流失风险；根据账号、项目身份、绑定、消费和活跃数据显示阶段化动作，保留现有创建工单、回访、订单履约和关系处理入口，并让未添加账号、未授权项目和未绑定账号进入已有引导交互。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 6: 在会员资料侧接入项目与账号区域**
action: 在 `src/app/components/InfluenceRanking.tsx` 的会员资料区域保留基础资料、已加入社群和现有资料 Tabs，新增项目与账号展示；按九个标准项目显示项目身份等级、授权状态、项目相关账号、账号身份、登录状态、绑定状态、授权状态、匹配服务人员、现有账号任务状态、累计消费、订单数量、最近消费时间、运营阶段和下一步动作；任务数据必须复用 `src/app/data/agentTraining.ts`，不新建第二套账号任务模型。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 7: 回归会员账号添加、状态、日志和引导交互**
action: 在 `src/app/components/InfluenceRanking.tsx`、`src/app/components/WeChatManagement.tsx` 及相关账号数据文件中逐项检查并修复本轮关联改造造成的回归：添加账号按钮仍使用原入口；未添加、添加中、添加失败、已解绑状态仍可识别；登录、绑定、授权状态仍分开显示；失败原因、操作日志、重新添加、重新绑定、重新授权和未授权引导仍可进入。
loop: until npm test -- --run passes
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build

gate: human

- [ ] **Step 8: 重整社群视角的社群主表和运营阶段**
action: 在 `src/app/components/workbenchScopes.tsx` 和 `src/app/components/InfluenceRanking.tsx` 中将社群主表调整为围绕社群对象展示所属项目、群主/服务官、会员数、已入群会员、发言会员、信息到达量、链接点击量、项目绑定量、课程报名量、消费人数、订单量、成交额、社群状态和下一步动作；补齐待提升触达、待提升点击、待绑定项目、待课程转化、待消费转化、高成交、沉默、退群预警和活动待复盘分类。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 9: 接入社群活动按社群拆分分析与操作表单**
action: 在 `src/app/components/workbenchScopes.tsx`、`src/app/components/InfluenceRanking.tsx` 和 `src/app/data/communityDataStore.ts` 中复用当前本地社群数据，增加活动名称、社群、项目、覆盖、到达率、点击率、绑定、报名、消费、订单、转化率、成交额和复购指标的展示；将群公告、群发消息、群活动、群预警表单参数绑定到当前社群阶段动作，避免把本地演示数据描述为后端实时数据。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 10: 重整项目视角的代理、会员、订单和交易额指标**
action: 在 `src/app/components/workbenchScopes.tsx` 和 `src/app/components/InfluenceRanking.tsx` 中将项目主表和档案改为展示项目阶段、负责人、代理总数及 D1-D5 分布、新增与活跃代理、会员总数及新增与活跃会员、已授权、已绑定账号、已消费、复购会员、订单数、本月交易额、累计交易额、复购率和健康度；项目操作表单保留项目任务、报表、里程碑和复盘入口，并绑定到项目阶段和数据分析动作。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 11: 重整代理视角并复用培训考核任务体系**
action: 在 `src/app/components/workbenchScopes.tsx`、`src/app/components/InfluenceRanking.tsx` 和 `src/app/data/agentTraining.ts` 中补齐代理等级、下线会员授权与账号绑定、下线会员消费、订单、交易额、佣金、结算、培训、实训、考核和代理留存指标；代理个人档案和任务列表继续读取现有 `trainingTasks`、状态元数据和任务类型，不创建新的培训任务状态枚举。
loop: until npm run build passes
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

- [ ] **Step 12: 验证四类视角切换状态与生态布局不回退**
action: 检查 `src/app/components/InfluenceRanking.tsx` 的四类视角切换、筛选、选中对象和资料 Tabs 状态，确保切换后字段、阶段、操作表单和档案内容对应当前视角；检查 `src/app/components/EcosystemManagement.tsx` 与 `src/app/components/PCLayout.tsx` 的现有用户修改、生态层级导航、管理工具入口和整体布局没有被覆盖或回退。
loop: false
max_iterations: 1
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

gate: human

- [ ] **Step 13: 增加覆盖四类业务视角的确定性测试**
action: 在现有 `tests` 目录中新增或扩展针对项目标准名称映射、服务人员账号匹配优先级、会员项目身份判断、账号状态与运营阶段分离、社群活动指标、项目交易指标和代理培训任务复用的 Vitest 测试；测试只验证当前前端数据模型和交互逻辑，不假设不存在的后端 API。
loop: until npm test -- --run passes
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 14: 执行完整构建、测试与变更格式检查**
action: 在项目根目录执行生产构建、完整 Vitest 测试和 git diff 格式检查；只修复本次四类运营工作台改造引入的错误，保留现有工作区中与本次无关的用户、linter、公共页面和文档变更。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run
  - type: shell
    command: git diff --check

- [ ] **Step 15: 启动预览并进行四类视角浏览器验收**
action: 启动本地 Vite 预览，访问 `/?view=pc&module=users&role=platform_op`；在会员视角验证平台身份、会员等级、平台账号状态、项目身份摘要、已加入社群和项目与账号区域；分别切换社群、项目、代理视角，验证主表字段、阶段分类、资料档案和操作表单随视角变化；验证约 390px 宽度下资料栏、表格和操作区无关键内容遮挡。
loop: false
max_iterations: 1
verify:
  type: browser
  url: http://127.0.0.1:5207/?view=pc&module=users&role=platform_op
  check: 会员、社群、项目、代理四类视角均能完成切换；会员账号添加与引导入口可用；项目名称和身份等级可见；项目与账号、服务人员和任务信息可展开；桌面与窄屏无关键内容遮挡

gate: human

- [ ] **Step 16: 完成最终人工验收与实施交付检查**
action: 对照 `docs/superpowers/specs/2026-10-06-four-scope-operational-workbench-design.md` 逐项检查验收标准和非目标范围；确认没有重新引入经营摘要、会员分层或 RFM，没有改动账号添加按钮设计，没有把项目授权、账号绑定和消费状态混为一项，没有把服务人员姓名匹配误当成稳定账号 ID；确认最终 diff 只包含本轮实施相关修改。
loop: false
max_iterations: 1
verify:
  - type: shell
    command: git diff --check
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run

gate: human
