---
intent: 将“我的生态”首页重构为轻量总览与旗下生态列表，减少重复信息并保持现有业务行为
success_criteria: 顶部上下文、轻量层级导航、四项核心指标和旗下生态主体列表完成；大段说明卡及底部管理工具移除；桌面端和390px移动端布局可用；测试、构建、格式检查通过
risk_level: low
auto_approve: true
branch: hotl/compact-ecosystem-workbench
worktree: false

## Steps

- [ ] **Step 1: 收敛超级生态首页结构**
action: 修改 `src/app/components/EcosystemManagement.tsx` 的 `SuperView`，移除“我的生态”大段说明卡和七项统计卡，保留四项核心指标（下属生态、SaaS 合作伙伴、平台、项目），并将首页主体整理为顶部指标带和旗下生态区域。
loop: until `SuperView` 只保留四项核心指标与旗下生态主体内容
max_iterations: 3
verify: ! grep -nE '全局用户|全局群组|总月营收|超级生态是整个体系的最顶层' src/app/components/EcosystemManagement.tsx

- [ ] **Step 2: 压缩旗下生态标题和卡片内容**
action: 在同一文件中将旗下生态标题说明压缩为单行语义，合并“新建生态”和“新建平台”为紧凑的新建操作区；默认生态项隐藏长描述，保留名称、状态、SaaS、平台、项目、营收和已有展开操作，确保直属生态创建与平台创建回调不变。
loop: until 生态列表主体只展示必要数据且既有创建回调仍存在
max_iterations: 3
verify: grep -n '新建生态\|新建平台\|新建 SaaS 合作伙伴\|setCreateEcoOpen\|setCreatePlatformOpen' src/app/components/EcosystemManagement.tsx

- [ ] **Step 3: 调整顶部工具和层级导航密度**
action: 修改主组件中运营上下文、当前层级摘要和底部管理工具区域：合并顶部身份与当前上下文，移除重复的当前层级长描述，将经营视图、账号管理、商业与计费入口放入顶部操作区，并删除底部独立管理工具栏；保持生态、SaaS、平台层级切换和我的生态身份上下文不变。
loop: until 页面不再同时显示重复身份说明、长层级摘要和底部管理工具栏
max_iterations: 3
verify: grep -n '管理工具\|运营上下文\|当前层级说明\|账号管理\|商业与计费' src/app/components/EcosystemManagement.tsx

- [ ] **Step 4: 完善响应式紧凑布局**
action: 在 `src/app/components/EcosystemManagement.tsx` 中调整超级生态首页相关 Tailwind 类名，使桌面端四项指标横向排列、生态关键数据紧凑排列，移动端使用两列指标和单列生态内容，并确保顶部操作和层级导航可换行或横向滚动。
loop: until 页面相关布局类名满足桌面端和移动端结构要求
max_iterations: 3
verify: npm run build

- [ ] **Step 5: 回归测试与格式检查**
action: 在项目目录执行完整测试、生产构建和 Git 差异格式检查，修复本次紧凑化改造引入的测试、类型、构建或格式问题，不修改用户已有的生态上下文测试意图。
loop: until all verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check
