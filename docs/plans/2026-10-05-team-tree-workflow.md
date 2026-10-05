---
intent: 基于已激活邀请关系，为主理人、团长和代理提供按身份隔离的真实团队树，并接入移动端团队页
success_criteria: GET /mp/team-tree 按当前身份返回正确可见节点、统计和 parentId；会员被拒绝；无效或循环关系不会导致接口失败；tasks.html 使用接口数据并保留第二层默认展开；后端测试、lint 和前端构建通过
risk_level: high
auto_approve: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 创建团队树领域逻辑**
action: 在 /Users/binbinchen/Documents/社群管理工具/local-backend/src/domain/team.js 新增 teamTreeView(db, viewerId)，校验 viewerId；主理人以完整关系森林为范围，团长和代理以本人为根向下遍历，会员抛出 403；仅接受 status 为“已激活”的关系；忽略不存在成员、重复边和会造成循环的边；返回 nodes、stats、viewer 和 scope 字段，节点包含 id、parentId、name、identity、level、balance、avatarPath、childrenCount。
loop: until 团队领域逻辑覆盖权限、激活关系、异常关系和统计
max_iterations: 3
gate: human
verify: node -e "const { teamTreeView } = require('./src/domain/team'); const { createSeed } = require('./src/seed'); const db=createSeed(); const result=teamTreeView(db,'member-demo-001'); if(result.nodes.length!==6) process.exit(1); if(result.stats.total!==6) process.exit(1)"

- [ ] **Step 2: 注册团队树接口**
action: 修改 /Users/binbinchen/Documents/社群管理工具/local-backend/src/server.js，引入 teamTreeView，并增加 GET /mp/team-tree 路由；当前查看人必须来自 current().id，不接受请求体或查询参数覆盖；保持现有 envelope 和错误处理格式。
loop: false
verify: node -e "const { createServer } = require('./src/server'); const server=createServer(); server.listen(0,'127.0.0.1',()=>{const port=server.address().port; fetch('http://127.0.0.1:'+port+'/mp/team-tree',{headers:{'x-demo-member-id':'member-demo-001'}}).then(r=>r.json().then(b=>{server.close(); if(!b.data||!Array.isArray(b.data.nodes)) process.exit(1)}))})"

- [ ] **Step 3: 增加团队树权限和异常关系测试**
action: 修改 /Users/binbinchen/Documents/社群管理工具/local-backend/test/e2e.test.js，覆盖主理人完整树、团长仅本人名下、代理仅本人名下、会员 403、待激活关系不返回、无效成员关系被忽略、循环关系不会死循环，并断言节点 parentId、childrenCount 和 stats。
loop: until npm test 中团队树场景全部通过
max_iterations: 3
verify: npm test

- [ ] **Step 4: 接入移动端真实团队数据**
action: 修改 /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/public/member-app/pages/tasks.html，增加团队树状态和 loadTeamTree()；团队总览进入时请求 /mp/team-tree；将后端 nodes 映射为现有 flattenTeamTree/teamTreeRowHtml 所需字段，将后端 stats 映射为等级统计和总人数；保留整行展开和第二层默认展开；加载失败显示可理解的错误状态；不修改 PCLayout.tsx。
loop: until 页面逻辑可在接口成功、加载中和失败三种状态下渲染
max_iterations: 3
verify: node --check /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/public/member-app/pages/tasks.html

- [ ] **Step 5: 运行完整验证**
action: 重置本地后端 seed，运行 local-backend 测试和前端项目已有 lint、typecheck、build 命令；检查 git diff 只包含团队树接口、测试和移动端接入相关改动，不回滚既有用户修改。
loop: until 所有可用验证命令通过或明确记录已有基线失败
max_iterations: 3
verify:
  - type: shell
    command: cd /Users/binbinchen/Documents/社群管理工具/local-backend && npm test
  - type: shell
    command: cd /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统 && npm run build
