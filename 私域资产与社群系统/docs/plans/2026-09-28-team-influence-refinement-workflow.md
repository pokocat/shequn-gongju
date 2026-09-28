---
intent: Simplify the member-app Team tab and replace mixed influence detail tabs with role-appropriate team, community, and recommendation views.
success_criteria: The top navigation says 团队; the purple overview and 团队能力 heading are absent; training and certification entries remain; agent and leader influence details expose only meaningful role-appropriate columns; and the mobile page builds, parses, and renders without horizontal overflow.
risk_level: low
auto_approve: true
dirty_worktree: allow
worktree: false
branch: master
---

## Steps

- [ ] **Step 1: Simplify the Team entry and header structure**
action: Update `public/member-app/pages/tasks.html` so both role tab definitions use `团队`, remove the `influence-cover` markup from `renderInfluenceBody`, remove the `team-functions-head` markup, and preserve the training and certification cards in their existing order.
loop: until the removed labels and cover markup are absent while the two function cards remain present
max_iterations: 3
verify: node -e "const s=require('fs').readFileSync('public/member-app/pages/tasks.html','utf8'); for(const x of ['label: \'团队\'','培训学习','认证进度']) if(!s.includes(x)) process.exit(1); for(const x of ['团队中心','influence-cover','团队能力']) if(s.includes(x)) process.exit(1)"

- [ ] **Step 2: Replace the agent influence data model**
action: In `public/member-app/pages/tasks.html`, define the agent views as `团队发展` with 市级代理、区县代理、直属团长 columns and `社群会员` with 社群数、社群成员、本周新增、活跃成员 columns. Keep direct, subordinate, and recommendation rows and preserve clickable detail cells.
loop: until the agent view model supplies separate headers and rows for both views without proxy or member metrics being mixed
max_iterations: 3
verify: node -e "const s=require('fs').readFileSync('public/member-app/pages/tasks.html','utf8'); for(const x of ['团队发展','社群会员','直属团长','社群数','活跃成员']) if(!s.includes(x)) process.exit(1)"

- [ ] **Step 3: Replace the leader influence data model**
action: In `public/member-app/pages/tasks.html`, define the leader views as `社群会员` and `推荐关系`; do not expose an agent-development view. Use community growth columns for the first view and 推荐团长、其社群数、社群成员、本周新增 columns for the second view, retaining aggregate-only relationship information.
loop: until the leader view exposes two useful views and contains no leader-side `代理发展情况` label
max_iterations: 3
verify: node -e "const s=require('fs').readFileSync('public/member-app/pages/tasks.html','utf8'); for(const x of ['推荐关系','推荐团长','其社群数']) if(!s.includes(x)) process.exit(1); if(s.includes("label: '代理发展情况'")) process.exit(1)"

- [ ] **Step 4: Render per-view table headers and accessible detail labels**
action: Refactor the influence table rendering in `public/member-app/pages/tasks.html` to read headers from the active view rather than using four hard-coded role columns. Build click targets from the row label and active header so list drilling remains specific and correct.
loop: until both role views render their own headers and the extracted inline script parses
max_iterations: 3
verify: node -e "const fs=require('fs');const s=fs.readFileSync('public/member-app/pages/tasks.html','utf8');const m=[...s.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];fs.writeFileSync('/tmp/tasks-team-refinement.js',m.map(x=>x[1]).join('\n'))" && node --check /tmp/tasks-team-refinement.js

- [ ] **Step 5: Remove obsolete header styles and verify mobile layout**
action: Remove unused `.influence-cover*` and `.team-functions-head` CSS selectors from `public/member-app/pages/tasks.html`, preserve the existing typography and card spacing, then inspect the agent and leader Team views in the member-app mobile shell and switch each influence view once.
loop: until no obsolete selectors remain and both role-specific detail tables fit their cards at mobile size
max_iterations: 3
verify:
  - type: shell
    command: npm run build && git diff --check
  - type: browser
    url: http://127.0.0.1:5173/member-app/pages/tasks.html
    check: Team tab has no purple overview or 团队能力 heading; agent and leader each render their distinct useful influence views without horizontal overflow
