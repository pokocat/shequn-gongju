---
intent: 统一账号资产中心“全部”页面右侧详情为个人微信最终版骨架
success_criteria: 当前筛选结果与详情一致；详情标签为账号资料、绑定分配、运营数据、个人安全；底部仅有编辑和发起交接，其他操作收纳到更多菜单；个人微信页面不变；构建和测试通过
risk_level: low
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 对齐详情选择逻辑**
action: 编辑 src/app/components/AccountsAndResourceCenter.tsx，删除默认优先选择 dy_bj_01 的逻辑；当 filteredTools 有结果且当前选中项无效时选择 filteredTools[0]，无结果时清空 selectedToolId；selectedTool 只从 filteredTools 推导。
loop: until 详情对象始终属于当前筛选结果
max_iterations: 3
verify: grep -n "dy_bj_01\|selectedTool =\|setSelectedToolId" src/app/components/AccountsAndResourceCenter.tsx

- [ ] **Step 2: 统一详情标签命名**
action: 在 src/app/components/AccountsAndResourceCenter.tsx 的 DetailPanel 中，将顶层标签改为“账号资料”“绑定分配”“运营数据”“个人安全”，保留现有四类内容的数据能力并将风险与日志内容归入个人安全展示范围。
loop: false
verify: grep -n "账号资料\|绑定分配\|运营数据\|个人安全" src/app/components/AccountsAndResourceCenter.tsx

- [ ] **Step 3: 收敛详情操作入口**
action: 在 src/app/components/AccountsAndResourceCenter.tsx 的 DetailPanel 中保留底部“编辑”和“发起交接”两个主按钮，将改项目、改归属人、同步、二维码、养号、停用、归档及媒体操作放入“更多操作”菜单，并复用现有回调和确认流程。
loop: false
verify: grep -n "更多操作\|编辑\|发起交接" src/app/components/AccountsAndResourceCenter.tsx

- [ ] **Step 4: 运行构建和测试**
action: 在项目根目录执行 npm run build 和 npm test，修复本次改动造成的类型、构建或测试错误。
loop: until npm run build and npm test both pass
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: npm test

- [ ] **Step 5: 检查个人微信未被改动并确认变更范围**
action: 对比 git diff，确认 WeChatManagement.tsx 未被修改，检查通用详情改动只涉及预期文件，并输出可供预览的本地页面地址。
loop: false
verify: git diff --name-only -- src/app/components/WeChatManagement.tsx src/app/components/AccountsAndResourceCenter.tsx
