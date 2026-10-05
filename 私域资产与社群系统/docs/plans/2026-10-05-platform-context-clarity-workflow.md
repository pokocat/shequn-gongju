---
intent: 修复平台管理页的上下文混淆，建立平台模式与项目模式边界
success_criteria: 平台管理页和平台工作台隐藏项目切换器并保持平台上下文，进入具体项目后才显示项目上下文；当前平台的合作伙伴、生态和状态字段语义一致；构建、测试、diff 检查和浏览器验证通过
risk_level: medium
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 定义平台与项目工作区上下文**
action: 在 src/app/App.tsx 中增加 WorkspaceContext 类型及 ProjectContext 对应字段，默认值保持兼容；让 PC 页面能够接收当前页面上下文模式，并提供清理项目上下文的能力，不改变既有平台切换和项目列表数据。
loop: false
verify: npm run build

- [ ] **Step 2: 按上下文模式控制顶部选择器**
action: 在 src/app/components/PCLayout.tsx 中让布局接收 workspaceContext 或等价的显示参数；平台模式只显示当前平台并隐藏项目选择器，项目模式保持现有平台/项目选择器；保留现有视图下拉框定位和关闭行为。
loop: false
verify: npm run build

- [ ] **Step 3: 接通平台管理页的平台上下文**
action: 在 src/app/App.tsx 和 src/app/components/EcosystemManagement.tsx 中接通平台管理入口与平台工作台状态：进入行业生态模块和点击进入平台时清理旧项目并保持 platform 模式；平台工作台项目列表的明确进入动作设置目标项目并切换 project 模式；返回平台列表恢复 platform 模式。
loop: until 平台管理入口、平台工作台和项目进入动作均使用明确的上下文模式
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 4: 统一当前平台信息与状态语义**
action: 在 src/app/components/EcosystemManagement.tsx 中让平台卡片和平台配置抽屉从同一平台记录读取 SaaS 合作伙伴与所属生态；补充或使用 dataStatus 字段区分平台生命周期 status、数据接入状态和 revenue 展示，缺少 dataStatus 时显示待接入。
loop: false
verify: npm run build

- [ ] **Step 5: 静态质量检查**
action: 检查本次修改的上下文模式、平台状态字段和项目入口引用，确认没有新增注释、旧项目选择器旁路或类型错误，并运行完整自动检查。
loop: until 所有自动检查通过
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run
  - type: shell
    command: git diff --check

- [ ] **Step 6: 浏览器验证平台上下文边界**
action: 启动开发服务器并访问 ?view=pc&module=ecosystem，验证平台管理页顶部隐藏项目切换器；点击进入平台后仍为平台上下文且不显示旧项目；从平台工作台进入具体项目后才出现项目上下文；验证平台抽屉的合作伙伴、生态、平台状态和数据接入状态文案；检查控制台无新增错误。
loop: false
verify:
  type: browser
  url: http://127.0.0.1:5203/?view=pc&module=ecosystem
  check: 平台管理页、平台工作台和项目进入流程的上下文显示与平台状态语义符合设计规范
