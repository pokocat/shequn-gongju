---
intent: Implement agent and leader network visibility with separate direct-community, development, and recommendation scopes.
success_criteria: Agent and leader workbenches show correctly separated visibility scopes, relationship labels, aggregate-only subordinate data, and preserve existing role navigation and fulfillment boundaries.
risk_level: high
auto_approve: false
dirty_worktree: allow
worktree: false
branch: master
---

## Steps

- [ ] **Step 1: Add the mobile network scope model**
action: Update `src/app/data` with a focused TypeScript model and fixture data for direct ownership, development, recommendation, operation, visible object IDs, aggregate fields, and role-specific scope limits. Keep D1-D5 configuration unchanged.
loop: until the model compiles and relation types distinguish `direct_ownership`, `development`, `recommendation`, and `operation`
max_iterations: 3
verify: npm run build

- [ ] **Step 2: Add scope derivation helpers**
action: Implement pure helpers beside the new network model that derive agent and leader visible scopes from fixture relationships, enforce direct-community detail access, subordinate aggregate-only access, and leader exclusion of unrelated communities and fulfillment data.
loop: until scope helper checks pass
max_iterations: 4
verify: npm run build

- [ ] **Step 3: Split agent workbench ranges**
action: Update `public/member-app/pages/tasks.html` so the agent view separates `我的社群`, `发展网络`, and `推荐网络` within existing navigation, shows relationship labels on rows and cards, and keeps direct leader management separate from development aggregates.
loop: until the extracted inline JavaScript parses and the three agent ranges render without mixing totals
max_iterations: 4
verify: node -e "const fs=require('fs');const s=fs.readFileSync('public/member-app/pages/tasks.html','utf8');const m=[...s.matchAll(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi)];fs.writeFileSync('/tmp/tasks-network.js',m.map(x=>x[1]).join('\\n'))" && node --check /tmp/tasks-network.js

- [ ] **Step 4: Split leader workbench ranges**
action: Update `public/member-app/pages/tasks.html` and related member-app page data so the leader view separates `我的社群` and `我的推荐`, exposes only recommended-person and recommended-leader aggregate data, and does not expose agent inventory, fulfillment, after-sales, or unrelated community details.
loop: until the extracted inline JavaScript parses and leader labels and exclusions are present
max_iterations: 4
verify: node -e "const fs=require('fs');const s=fs.readFileSync('public/member-app/pages/tasks.html','utf8');const m=[...s.matchAll(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi)];fs.writeFileSync('/tmp/tasks-network.js',m.map(x=>x[1]).join('\\n'))" && node --check /tmp/tasks-network.js && node -e "const fs=require('fs');const s=fs.readFileSync('public/member-app/pages/tasks.html','utf8');for(const x of ['我的社群','发展网络','推荐网络','我的推荐']) if(!s.includes(x)) process.exit(1)"

- [ ] **Step 5: Align promotion and profile semantics**
action: Update `public/member-app/pages/promote.html`, `public/member-app/pages/agent-info.html`, and `public/member-app/pages/matrix.html` only where needed so direct operation, development, recommendation, and role identity use consistent labels without reverting the existing profile migration behavior.
loop: until all affected inline scripts parse and visible terminology is consistent
max_iterations: 3
verify: for f in public/member-app/pages/promote.html public/member-app/pages/agent-info.html public/member-app/pages/matrix.html; do node -e "const fs=require('fs');const s=fs.readFileSync('$f','utf8');const m=[...s.matchAll(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi)];fs.writeFileSync('/tmp/$(basename '$f').js',m.map(x=>x[1]).join('\\n'))" && node --check "/tmp/$(basename "$f").js" || exit 1; done

- [ ] **Step 6: Verify PC configuration boundaries**
action: Confirm `src/app/components/PlatformModeConfig.tsx` and `src/app/data/levelConfig.ts` continue to treat network visibility as a preset permission boundary while leaving operational parameters editable only for platform admins or authorized D1 identities.
loop: false
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check

- [ ] **Step 7: Run browser regression at mobile dimensions**
action: Start the Vite preview, open the agent and leader member-app routes at 390x844, and verify direct-community, development-network, recommendation-network, relationship labels, and restricted fulfillment data render correctly without horizontal layout regressions.
loop: until the mobile regression checks pass
max_iterations: 3
verify:
  type: browser
  url: http://127.0.0.1:5174/member-app/pages/tasks.html
  check: agent and leader role views render the correct range labels and do not show forbidden fulfillment details
  gate: human

- [ ] **Step 8: Run final validation**
action: Run the complete production build, inline-script syntax checks for all changed HTML pages, terminology checks, and repository diff checks; report any pre-existing chunk-size warning separately from failures.
loop: until all required validation commands pass
max_iterations: 3
verify:
  - type: shell
    command: npm run build
  - type: shell
    command: git diff --check
  - type: artifact
    path: src/app/data
    assert:
      kind: matches-glob
      value: "*.ts"
