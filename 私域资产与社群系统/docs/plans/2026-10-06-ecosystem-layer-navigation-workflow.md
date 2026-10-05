---
intent: 将生态平台管理页改造为四层可直接选择的紧凑运营工作台，同时保持平台与项目上下文及社群 Scope 隔离。
success_criteria: 用户可在同一层级条直接切换超级生态、生态、SaaS 合作伙伴与平台；平台页首屏展示当前对象、四项经营指标和唯一工作台导航；已有项目、社群、配置入口在桌面与移动端均可用；构建、测试和 diff 格式检查通过。
risk_level: low
auto_approve: true
worktree: host
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 梳理并收敛生态页的层级状态与展示配置**
action: 在 `src/app/components/EcosystemManagement.tsx` 定位 `activeTier`、层级说明卡和平台视图入口，定义四层平铺导航所需的局部配置（编号、名称、描述、数量与层级对应关系），复用当前 `activeTier` 及其选择逻辑，不修改生态、合作伙伴、平台、项目或社群的数据结构。
loop: false
max_iterations: 1
verify: npm run build

- [ ] **Step 2: 实现横向四层直接选择导航与当前对象摘要**
action: 在 `src/app/components/EcosystemManagement.tsx` 用紧凑的四项层级导航替换大型“第 N 层”主说明区；每项可点击、显示编号和名称，并为当前项提供高亮状态。层级导航下方保留当前对象路径、状态、必要归属信息与查看架构操作；小屏使用可横向滚动的同序导航，避免内容溢出或语义切换。
loop: until npm run build passes
max_iterations: 3
verify: npm run build

- [ ] **Step 3: 收敛平台工作台首屏信息与导航入口**
action: 在 `src/app/components/EcosystemManagement.tsx` 调整 `PlatformView` 顶部结构：保留平台名称与创建入口，将运营项目、平台用户、平台群组、本月营收组织为紧凑 KPI 网格；将平台总览、项目运营、平台级社群、平台配置收敛为唯一工作台导航，并继续调用既有 `scrollToSection` 和配置抽屉逻辑。
loop: until npm run build passes
max_iterations: 3
verify: npm run build

- [ ] **Step 4: 保持平台和项目社群 Scope 与已有入口不变**
action: 检查 `src/app/components/EcosystemManagement.tsx` 中平台社群调用仍使用 `ProjectCommunitySystem` 的 `scope="platform"`、`getCommunityScopeKey(communityPlatform, "platform")`，项目配置抽屉中的项目社群仍使用 `scope="project"` 和项目名；确认项目运营定位目标在桌面表格和移动卡片区继续存在。
loop: false
max_iterations: 1
verify: npm test -- --run

- [ ] **Step 5: 执行多视口页面视觉与交互验证**
action: 启动本地 Vite 预览，访问 `/?view=pc&module=ecosystem`；在桌面与约 390px 宽度确认四层导航可见且可选择、平台 KPI 无溢出、项目运营和平台级社群导航可定位、平台配置可打开，并确认没有遮挡全局顶部栏或移动抽屉。
loop: false
max_iterations: 1
verify:
  type: browser
  url: http://127.0.0.1:5173/?view=pc&module=ecosystem
  check: 四层层级导航、当前平台摘要、紧凑 KPI 与工作台入口在桌面和移动端可用且无内容遮挡

- [ ] **Step 6: 执行回归验证与变更检查**
action: 在项目根目录运行构建、测试及 git diff 格式检查；仅修复本轮 `EcosystemManagement.tsx` 改造引入的问题，保留工作区中其他历史未提交改动。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test -- --run
  - type: shell
    command: git diff --check
