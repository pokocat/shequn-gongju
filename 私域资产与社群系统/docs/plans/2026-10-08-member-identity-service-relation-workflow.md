---
intent: 将会员平台身份和会员等级移动到头像标签，并按平台身份与会员等级组合匹配服务人员、账号和服务群，保持现有表单式操作能力。
success_criteria: 会员头像同时显示平台身份和会员等级标签；会员主表删除平台身份和会员等级列；服务官、班主任、个微、企微、公众号、小程序、视频号及对应服务群按组合身份匹配；未命中时显示待分配；账号和群保留状态、操作按钮、次数、日志和AI同步状态；通过测试、构建和差异检查。
risk_level: medium
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 梳理会员身份与服务关系现有数据模型**
action: 检查 InfluenceRanking.tsx、projectGroupRules.ts、communityDataStore.ts 及会员数据来源，定位会员姓名、头像、平台身份、会员等级、会员级账号任务、服务群和项目级账号群任务的现有字段与渲染入口，确认不得修改 CustomerService.tsx。
loop: false
verify:
  type: shell
  command: grep -nE "platformIdentity|identity|memberLevel|avatar|serviceAccounts|projectGroups|generatedGroups" src/app/components/InfluenceRanking.tsx src/app/data/projectGroupRules.ts src/app/data/communityDataStore.ts

- [ ] **Step 2: 抽取平台身份与会员等级组合匹配规则**
action: 在 InfluenceRanking.tsx 现有数据聚合逻辑中建立稳定的组合匹配入口，使用平台身份和会员等级筛选启用的服务人员账号及对应服务群；明确会员级关系和项目级关系的边界，未匹配时生成待分配状态，不创建虚假账号或群。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 3: 将平台身份和会员等级渲染为头像标签**
action: 修改会员主表会员单元格，将头像、会员姓名、平台身份标签和会员等级标签放在同一会员区域；沿用现有标签颜色、字体和头像样式，不在其他表格列重复展示这两类全局身份。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 4: 删除会员主表中的身份列并重新对齐宽度**
action: 从会员视图和相关会员主表表头、数据行移除平台身份和会员等级独立列，保留会员经营分析字段；重新核算表头与数据行 minWidth 和每列 width，使头像标签区域与表格横向滚动对齐。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 5: 按现有表单样式展示身份对应的服务关系**
action: 在会员档案和项目关系详情中复用现有任务表单样式，分别展示服务官个微、服务官企微、班主任个微、班主任企微、公众号、小程序、视频号、会员服务群以及项目服务账号和项目群；每项保留账号或群信息、服务人员、状态、操作按钮、人工次数、日志入口和AI同步状态，会员级和项目级任务使用独立ID。
loop: until yarn build passes
max_iterations: 3
verify: yarn build

- [ ] **Step 6: 补齐状态、人工操作和日志同步**
action: 确认服务账号与服务群的状态更新、人工操作次数和日志写入都按独立任务ID保存，重新渲染不会重置；无匹配关系显示待分配并保持可继续分配或核验的表单状态。
loop: until yarn test passes
max_iterations: 3
verify: yarn test

- [ ] **Step 7: 执行最终质量检查和界面回归**
action: 启动开发页面并检查会员视图、项目关系视图和右侧会员档案：头像标签显示两类身份；表格不再出现平台身份和会员等级列；服务账号和服务群按组合身份展示；状态修改、人工操作次数和日志入口可用；390px 窄屏下表格只在表格容器内横向滚动；最后检查差异格式。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: yarn test
  - type: shell
    command: yarn build
  - type: shell
    command: git diff --check
  - type: browser
    check: 会员头像显示平台身份和会员等级标签；会员主表无平台身份和会员等级独立列；服务账号、公众号、小程序、视频号和服务群按身份匹配并保留状态、按钮、次数、日志；项目关系详情可正常打开；窄屏表格容器可横向滚动
