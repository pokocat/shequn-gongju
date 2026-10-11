---
intent: 将主理人小程序统一为消息、微信群、主理台、发现、我的五个一级导航，并以服务角色会话作为消息首页核心
success_criteria: 主理人小程序预览可进入五个一级入口；消息首页展示置顶与全部服务角色会话；微信群入口进入现有群列表；PC 后台和其他身份页面不受影响
risk_level: low
auto_approve: false
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 检查主理人小程序入口与底部导航实现**
action: 读取 public/member-app/pages/index.html、message.html、group.html、tasks.html、mine.html 及 public/member-app/css/app.css，确认当前主理人首页、底部导航和页面跳转的实际实现位置；仅记录结论，不修改 PCLayout.tsx。
loop: false
verify:
  type: artifact
  path: public/member-app/pages/index.html
  assert:
    kind: exists

- [ ] **Step 2: 统一五个一级导航入口**
action: 在主理人小程序共用底部导航实现中，将导航固定为消息、微信群、主理台、发现、我的，分别指向 message.html、group.html、tasks.html、index.html、mine.html；保留当前查询参数与 embed/full 行为。
loop: until 导航文本和五个目标均唯一且正确
max_iterations: 3
verify: grep -R "消息\|微信群\|主理台\|发现\|我的" public/member-app/pages public/member-app/css

- [ ] **Step 3: 将消息首页改为服务角色会话列表**
action: 修改主理人小程序消息首页文件，移除独立任务宫格和公告/通知双 Tab 的首页承载方式，加入置顶会话、全部会话、职责标签、未读数、行动导向摘要和现有 chat 页面入口；复用现有头像、卡片和暖奶油视觉变量，不创建新的后端接口。
loop: until 消息首页 DOM 包含置顶会话区、全部会话区和八类服务角色入口
max_iterations: 3
verify:
  type: artifact
  path: public/member-app/pages/message.html
  assert:
    kind: exists

- [ ] **Step 4: 接通会话与群入口交互**
action: 为服务角色会话行和微信群一级入口补充 data-nav 跳转，确保课程顾问等会话可进入现有 chat 页面，微信群可进入 group.html，主理台可进入 tasks.html；不改动既有详情页业务逻辑。
loop: until 点击目标进入对应页面且查询参数保留
max_iterations: 3
verify: grep -R "data-nav" public/member-app/pages/message.html public/member-app/pages/group.html

- [ ] **Step 5: 运行构建与浏览器预览验证**
action: 运行前端构建，并在主理人小程序预览中检查五个底部入口、消息首页会话列表、微信群页面和主理台入口；记录控制台与网络错误，只修复本轮页面范围内的问题。
loop: until build 成功且预览关键入口可用
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: browser
    url: http://127.0.0.1:52206/member-app/pages/message.html?embed=1&full=1
    check: 消息首页展示五个底部导航与服务角色会话列表
