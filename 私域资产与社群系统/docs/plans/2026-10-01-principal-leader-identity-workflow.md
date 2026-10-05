---
intent: 统一主理人平台 D1-D5 身份与独立团长身份，修正小程序展示和团长发展规则
success_criteria: PC 与小程序统一显示 D1-D5；团长显示为独立身份；D2-D5 可发展团长且 D1 默认不可直接发展；团长可发展社群和会员；测试、构建和预览验证通过
risk_level: medium
auto_approve: false
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 扩展统一身份配置**
action: 在 `src/app/data/levelConfig.ts` 中保留 D1-D5 平台身份，新增 `BusinessIdentityCode`、独立 `LEADER`/`MEMBER` 身份类型、团长发展规则和 `canDevelopLeader` 判断；确保 D1 返回 false，D2-D5 返回 true，且不把团长加入 D1-D5 层级树。
loop: until `levelConfig.ts` 类型检查通过且规则断言成立
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run tests/level-config.test.*

- [ ] **Step 2: 补充配置单元测试**
action: 在现有测试目录中新增或编辑与 `levelConfig.ts` 对应的测试文件，覆盖 D1-D5 中文名称、LEADER/MEMBER 独立编码、D2-D5 可发展团长、D1 默认不可直接发展，以及旧代理等级不作为平台身份的断言。
loop: until 新增身份规则测试通过
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 3: 统一团队工具身份徽章**
action: 编辑 `public/member-app/pages/team-member-utils.js` 及其测试，将正式身份徽章映射为 D1-D5 和“团长”，保留会员成长等级的独立展示能力，不再把巨星、明星、微星、新星、小星星或一级代理、二级代理、三级代理渲染为主理人平台身份。
loop: until 工具函数测试通过且旧平台等级名称没有渲染路径
max_iterations: 3
verify: npm test -- --run tests/team-member-utils.test.js

- [ ] **Step 4: 更新团队页面身份展示**
action: 编辑 `public/member-app/pages/tasks.html`，将团队总览、筛选、成员列表、成员详情和推荐人页面的正式身份展示改为 D1-D5 或“团长”；保留会员成长等级为独立维度，移除旧团队视觉等级作为平台级别的展示和筛选。
loop: until 页面源码仅使用统一身份标签并保留团队操作功能
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 更新团长与代理工作台文案和边界**
action: 编辑 `public/member-app/pages/promote.html`，让代理/团长视角继续控制工作台能力但不承担正式平台等级；代理侧显示可发展团长能力，团长侧显示“团长”、发展社群和发展会员职责，并隐藏代理库存、履约、团长审核能力。
loop: until 工作台身份与能力边界通过源码断言
max_iterations: 3
verify: npm run build

- [ ] **Step 6: 接入发展关系字段与范围语义**
action: 编辑 `src/app/data/memberNetworkScope.ts` 和需要的影响力类型，补充 `developedByIdentityId`、`developedByRoleCode`、团长身份和直属运营边界的类型表达；保持直属、发展、推荐、运营四种关系不混用。
loop: until TypeScript 构建通过且网络范围类型不回退为仅按视角推断
max_iterations: 3
verify: npm run build

- [ ] **Step 7: 完成全量测试和浏览器验证**
action: 运行全量测试和构建，启动或复用 Vite 开发服务，在 `http://127.0.0.1:5182/?view=zhuliren` 检查主理人公社预览中的团队与团长身份名称、旧等级停用、代理/团长工作台边界和真人头像展示。
loop: until 全量测试、构建和预览检查均通过
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
  - type: browser
    url: http://127.0.0.1:5182/?view=zhuliren
    check: 主理人公社团队页面显示 D1-D5 正式名称或团长，未显示旧团队视觉等级，成员真人头像正常
