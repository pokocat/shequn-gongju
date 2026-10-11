---
intent: 统一后台资源页面的右侧详情与配置列交互
success_criteria: 首批微信管理、微信群管理、账号资产中心、客服与服务资源支持列表选中驱动详情，桌面端固定右列、移动端详情抽屉，既有测试和构建通过
risk_level: medium
auto_approve: true
dirty_worktree: allow

## Steps

- [ ] **Step 1: 盘点首批页面结构与选中状态**
action: 检查 `src/app/components/AccountAssets.tsx`、`WeChatManagement.tsx`、`CustomerService.tsx` 以及当前可用的 `CommunityManagement.tsx` 路径，确认列表渲染、选中状态、项目范围和现有 Dialog/Sheet 入口；不修改无关文件。
loop: false
verify:
  type: shell
  command: git status --short && test -f src/app/components/AccountAssets.tsx && test -f src/app/components/WeChatManagement.tsx && test -f src/app/components/CustomerService.tsx

- [ ] **Step 2: 确认微信群管理组件路径并建立测试基线**
action: 在仓库内定位 `CommunityManagement.tsx` 或对应微信群管理组件，读取其主列表和详情结构；运行现有测试，记录基线结果并确认没有因本次改造新增的失败。
loop: false
verify:
  - type: shell
    command: find src -name 'CommunityManagement.tsx' -o -iname '*community*management*.tsx'
  - type: shell
    command: npm test -- --run

- [ ] **Step 3: 统一账号资产中心详情列**
action: 在 `src/app/components/AccountAssets.tsx` 中保留现有 `selected` 驱动逻辑，统一详情列头部、摘要、状态/风险、项目归属、关联关系和操作区；确保没有选中对象时显示空状态，编辑继续使用既有 Dialog/处理入口，交接继续使用 Sheet 或现有连续操作入口。
loop: until npm test -- --run
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 4: 为微信管理补齐右侧账号详情**
action: 在 `src/app/components/WeChatManagement.tsx` 中增加或整理 `selectedWechat` 状态与派生对象，将账号生命周期、风险、项目、负责人、好友数、群数、认证门槛、绑定群和二维码入口放入右侧详情列；编辑使用 Dialog，交接或群绑定保留 Sheet/既有连续操作，敏感信息不明文展示。
loop: until npm test -- --run
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 5: 为客服与服务资源补齐员工详情**
action: 在 `src/app/components/CustomerService.tsx` 中增加或整理 `selectedStaff` 状态与派生对象，将标准角色、启用状态、服务区域、项目、管理微信数、管理群数、QQ/企业微信配置状态和二维码入口放入右侧详情列；密码等敏感字段只显示配置状态，角色权限编辑使用 Dialog，资源绑定和交接使用 Sheet。
loop: until npm test -- --run
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 6: 统一微信群管理右侧详情**
action: 在定位到的微信群管理组件中保留既有主从数据流，整理 `selectedGroup` 到右侧详情列，展示群名称、群类型、项目、城市、群主/服务官、状态、容量、成员统计、绑定微信、二维码和运营信息；成员名单与连续运营动作继续使用 Sheet 或现有操作区。
loop: until npm test -- --run
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 7: 补齐移动端详情抽屉与响应式约束**
action: 在首批四个页面中检查详情列在窄屏下的行为；将固定右列转换为可关闭的移动端覆盖层或抽屉，保持列表滚动位置、关闭后回到列表，并修复详情内容造成的横向溢出。
loop: until npm run build
max_iterations: 3
verify: npm run build

- [ ] **Step 8: 浏览器回归首批页面交互**
action: 启动本地 Vite 服务并逐页验证默认空状态、点击列表行、切换对象、关闭详情、移动端详情打开/关闭、项目范围切换后的详情清理；记录并修复可见布局或交互问题。
loop: until npm run build
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5173/
  check: 首批四个页面的列表选中、右侧详情、移动端详情抽屉和项目范围切换均正常

- [ ] **Step 9: 完成最终静态验证**
action: 在当前仓库运行完整测试、生产构建和差异格式检查，确认本次修改没有引入 TypeScript/JSX 构建错误、测试失败或空白敏感字段；只报告本次相关文件的变更。
loop: until npm test -- --run && npm run build && git diff --check
max_iterations: 3
verify:
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check
