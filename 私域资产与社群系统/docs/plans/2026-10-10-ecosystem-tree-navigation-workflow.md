---
intent: 将生态管理页左侧关系导航改造成整体大容器内的文本化树形关系链
success_criteria: 生态、SaaS、平台、项目四级关系清晰；节点可展开收起并可选中项目；右侧项目工作台保持可用；桌面与窄屏不溢出；测试、lint、类型检查和构建通过
risk_level: low
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 读取生态树实现与项目脚本**
action: 检查 src/app/components/EcosystemManagement.tsx 的关系树 JSX、相关 state 和主题变量，并读取 package.json 确认验证命令；不要修改用户近期改动的 PCLayout.tsx、ZhuLiRenV1.tsx 和 group-chat.html
loop: false
verify:
  type: artifact
  path: src/app/components/EcosystemManagement.tsx
  assert:
    kind: exists

- [ ] **Step 2: 设计关系树节点状态**
action: 在 EcosystemManagement.tsx 中增加关系树展开状态与节点渲染所需的最小局部类型或函数，复用现有生态、SaaS、平台、项目数据和 selectNode 行为，不新增数据 store
loop: false
verify: grep -n "ecosystem.*tree\|expanded\|selectNode" src/app/components/EcosystemManagement.tsx

- [ ] **Step 3: 替换左侧为整体树形容器**
action: 将现有图标式生态层级导航替换为一个整体关系树容器，使用主题变量、缩进、竖线和横向连接线表达层级；节点以文本、状态圆点、状态和数量为主，保留生态、SaaS、平台、项目点击行为及未匹配平台展示
loop: false
verify: grep -n "生态与项目关系\|border-left\|border-top\|当前项目" src/app/components/EcosystemManagement.tsx

- [ ] **Step 4: 增加展开收起与响应式样式**
action: 为生态、SaaS、平台节点加入独立展开收起控制，避免展开按钮触发节点选择；调整桌面左窄右宽和窄屏全宽节点布局，确保关系树内部可滚动且项目行可点击
loop: false
verify: grep -n "set.*Expanded\|stopPropagation\|lg:grid-cols\|overflow-y" src/app/components/EcosystemManagement.tsx

- [ ] **Step 5: 检查交互与代码差异**
action: 运行项目已有测试或针对生态上下文的测试，并检查 git diff 仅包含关系树实现及必要计划文件，确认用户近期文件没有被回退或改写
loop: false
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: git diff -- src/app/components/EcosystemManagement.tsx

- [ ] **Step 6: 运行质量验证**
action: 根据 package.json 中实际存在的脚本依次运行 lint、typecheck（若存在）和 build，修复本轮关系树改动引入的错误
loop: until 所有可用质量检查通过
max_iterations: 3
verify:
  - type: shell
    command: npm run lint
  - type: shell
    command: npm run build
