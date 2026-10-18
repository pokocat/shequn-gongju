---
intent: 在现有聚域后台中落地 V/D/G/S/Y 身份编码、关系链头像等级和多重身份展示
success_criteria: 关系链节点显示当前场景主身份编码；多重身份使用主编码加数量；右侧详情展示完整身份、等级、范围和状态；关系角色与身份等级分离；现有搜索、筛选、节点详情和业务操作台不受影响
risk_level: low
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 建立身份编码共享模型**
action: 在 `/Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/src/app` 下查找现有共享类型、主题和头像工具；新增一个最小的身份编码元数据模块，定义 `V/D/G/S/Y` 的身份类型、颜色、展示名称和场景主身份映射，并导出给关系链和会员详情使用。不得修改 PCLayout、EcosystemManagement、ChannelFlow 中用户或 linter 最近修改的无关内容。
loop: until 身份类型、编码前缀、颜色和场景映射均可被组件导入
max_iterations: 3
verify:
  type: shell
  command: yarn tsc --noEmit

- [ ] **Step 2: 将关系树数据拆分为身份与关系角色**
action: 修改 `/Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/src/app/components/InfluenceRanking.tsx` 的 `RelationNode` 和关系树示例数据，将现有混合的 `memberLevel`、`identity` 转换为主身份编码、身份类型、身份名称、关系角色和可选多重身份；空分支不设置身份编码。保持关系树搜索、筛选和展开收起数据结构兼容。
loop: until 关系树节点可区分身份等级和关系角色
max_iterations: 3
verify:
  type: shell
  command: yarn tsc --noEmit

- [ ] **Step 3: 实现头像底部主身份等级展示**
action: 在 `/Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/src/app/components/InfluenceRanking.tsx` 的 `TreeNode` 中，将会员等级标签移动到头像底部；使用当前经营工作台的会员场景显示 `V` 编码；存在其他有效身份时显示 `V3 +N`；空分支显示灰色状态，不显示身份编码。节点文本改为姓名、关系角色和身份类型/等级名称三层信息。
loop: until 关系树视觉结构符合“头像底部编码、节点旁关系角色、第二行身份等级”的规则
max_iterations: 3
verify:
  type: shell
  command: yarn tsc --noEmit

- [ ] **Step 4: 完善右侧多重身份详情**
action: 在 `/Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/src/app/components/InfluenceRanking.tsx` 的选中节点详情区域增加当前身份卡、其他身份列表、身份生效范围和关系信息；展示 `V/D/G/S/Y` 编码、类型、名称、范围和状态；为没有成员身份的空分支保留添加成员操作；不得移除现有服务处置、内容触达、活动运营、朋友圈计划、项目配置和结算审批操作。
loop: until 选中节点能同时查看主身份、其他身份和关系角色，空分支仍可添加成员
max_iterations: 3
verify:
  type: shell
  command: yarn tsc --noEmit

- [ ] **Step 5: 增加身份展示测试覆盖**
action: 在现有测试目录中新增或扩展身份编码测试，覆盖五类编码、颜色和场景主身份映射、多重身份数量计算、空分支不显示编码以及关系角色与身份等级分离；复用项目已有 Vitest 配置和测试风格，不修改现有通过测试的断言。
loop: until 身份编码和多重身份规则测试全部通过
max_iterations: 3
verify: yarn test --run

- [ ] **Step 6: 完成构建与关系链浏览器验证**
action: 运行项目构建、测试和差异检查；启动或复用 Vite 开发服务器并打开 `/?view=pc&module=users`，检查关系链头像底部编码、`+N` 多重身份、搜索筛选、选中详情、空分支添加入口和原业务操作台；检查控制台无运行时错误。若发现问题只修改本次身份展示相关文件。
loop: until 构建、测试、差异检查和浏览器验证全部通过
max_iterations: 3
verify:
  - type: shell
    command: yarn build && yarn test --run && git diff --check
  - type: browser
    url: http://127.0.0.1:5177/?view=pc&module=users
    check: 关系链显示头像底部主身份编码，多重身份显示 +N，右侧详情显示完整身份，空分支显示添加入口，控制台无错误
