---
intent: 为超级生态、行业生态、SaaS 合作伙伴、平台和项目建立统一自动编号，并将现有数据按顺序补发编号
success_criteria: 所有五类组织数据都有唯一稳定的展示编号；现有数据按顺序补发；创建新记录自动生成不重复编号；关系树、详情和创建成功提示展示编号；现有筛选、权限和父子关系逻辑不受影响
risk_level: medium
auto_approve: true
worktree: false
---

## Steps

- [ ] **Step 1: 增加统一编号生成工具**
action: 在 `src/app/components/EcosystemManagement.tsx` 的层级数据定义附近增加组织编号类型、层级前缀映射和按同类记录计算下一个四位序号的函数；支持 `SE`、`ECO`、`SAS`、`PLT`、`PRJ` 五类编号，编号格式固定为 `<PREFIX>-<四位序号>`，不改变现有内部 `id`。
loop: until 编号生成函数可为五类层级生成正确格式且不会与传入记录重复
max_iterations: 3
verify: npm test -- --run tests/ecosystemContext.test.ts

- [ ] **Step 2: 为现有静态数据补发编号**
action: 在 `src/app/components/EcosystemManagement.tsx` 的超级生态、生态、SaaS、平台和项目数据中增加 `code` 字段；按当前数据顺序补发 `SE-0001`、`ECO-0001` 起始的连续编号，保留项目名称中的 `V001` 等旧业务前缀；为超级生态补充 `SE-0001` 的展示数据，不改动现有名称、内部 id 或父子过滤字段。
loop: until 五类现有数据均包含 code 且每类编号唯一、顺序连续
max_iterations: 3
verify: npm test -- --run tests/ecosystemContext.test.ts

- [ ] **Step 3: 更新创建流程自动生成编号**
action: 在 `src/app/components/EcosystemManagement.tsx` 的生态、SaaS、平台和项目创建处理逻辑中，使用对应层级的编号生成函数写入新记录的 `code`；删除流程不回收编号，后续创建只取现有记录中的最大序号加一；创建表单不增加编号输入项；创建成功提示中显示新生成的编号。
loop: until 新建各层级记录时编号自动生成且不依赖用户输入
max_iterations: 4
verify: npm run build

- [ ] **Step 4: 在关系树和当前节点标题展示编号**
action: 在 `src/app/components/EcosystemManagement.tsx` 的左侧关系树节点名称旁或下方增加 code 展示；在右侧当前节点标题区域展示当前节点名称和 code；使用紧凑等宽字体和辅助色，不改变现有节点点击、展开、收起和操作按钮布局。
loop: until 超级生态、生态、SaaS、平台和项目节点在关系树及当前节点区域均能看到对应编号
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 增加编号回归测试并验证构建**
action: 在 `tests/ecosystemContext.test.ts` 或现有生态测试文件中增加编号格式、现有数据补发顺序、层级独立递增和名称修改不影响编号的测试；运行完整测试和生产构建，确认没有破坏作用域过滤与历史页面路由。
loop: until 完整测试和生产构建通过
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
