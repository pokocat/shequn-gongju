---
intent: Build a locally runnable JSON-backed backend prototype for the 主理人公社 invite and agent-upgrade flow, compatible with the existing Taro frontend.
success_criteria: Health endpoint, demo identity switching, invite attribution and activation rewards, A/B/C qualification snapshots, agent review/sign/payment activation, reward reversal and pending recovery, debug controls, API tests, and frontend builds all pass.
risk_level: high
auto_approve: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: Scaffold the local backend package**
action: Create `/Users/binbinchen/Documents/社群管理工具/local-backend/package.json`, `src/`, `data/`, and `public/`; add the minimal Fastify runtime, test runner, start scripts, and a health route skeleton without modifying unrelated projects.
loop: false
verify:
  type: artifact
  path: local-backend
  assert:
    kind: exists

- [ ] **Step 2: Implement JSON persistence and demo seed data**
action: Implement `local-backend/src/store.js` and `local-backend/src/seed.js` with atomic JSON replacement, reset support, the three demo members, invite codes, A/B/C rules, and empty relation/reward/application collections.
loop: until `npm test -- --runInBand` passes for store initialization and reset tests
max_iterations: 3
verify: cd local-backend && npm test -- --runInBand

- [ ] **Step 3: Implement identity, response, and idempotency helpers**
action: Implement `local-backend/src/http.js` and `local-backend/src/helpers.js` for `x-demo-member-id`, unified `{ code, message, data }` responses, business errors, audit entries, and write-operation idempotency keys.
loop: until `npm test -- --runInBand` passes for helper tests
max_iterations: 3
verify: cd local-backend && npm test -- --runInBand

- [ ] **Step 4: Implement invite attribution and member lifecycle services**
action: Implement `local-backend/src/domain/invite.js` and `local-backend/src/domain/member.js` for first-click locking, pending activation, activation-only member rewards, refunds, expiry, balance-safe reversal, pending recovery, and subsequent reward offsetting.
loop: until invite lifecycle tests pass
max_iterations: 4
verify: cd local-backend && npm test -- --runInBand --testPathPattern=invite

- [ ] **Step 5: Implement qualification and agent application state machine**
action: Implement `local-backend/src/domain/qualification.js` and `local-backend/src/domain/agent.js` for A/B/C evaluation, rule versions, application snapshots, review rejection reasons, resubmission, contract/payment states, and formal-agent activation gates.
loop: until agent state-machine tests pass
max_iterations: 4
verify: cd local-backend && npm test -- --runInBand --testPathPattern=agent

- [ ] **Step 6: Add the `/mp/*` and local control API routes**
action: Implement `local-backend/src/server.js` routes for health, invite, QR placeholder, invite click, application, portfolio, demo members, reset, qualification rule updates, member lifecycle actions, review, sign, pay, cancel, and reward inspection.
loop: until API integration tests pass
max_iterations: 4
verify: cd local-backend && npm test -- --runInBand --testPathPattern=api

- [ ] **Step 7: Add the local debug console**
action: Create `local-backend/public/index.html` and its local assets so a browser can switch demo identity, choose A/B/C rules, trigger member and agent lifecycle actions, inspect rewards/pending recovery/audit data, and reset the JSON store.
loop: false
verify:
  type: artifact
  path: local-backend/public/index.html
  assert:
    kind: exists

- [ ] **Step 8: Connect the existing H5 API base URL to the local service**
action: Update only the existing development environment configuration and API helper needed for local H5 requests to target `http://127.0.0.1:8787`, while preserving production configuration and allowing the demo identity header to be set.
loop: until H5 API configuration tests or static checks pass
max_iterations: 3
verify: git diff --check -- ai-univ/主理人/h5/config ai-univ/主理人/h5/src/api

- [ ] **Step 9: Run the end-to-end workflow test**
action: Add or complete `local-backend/test/e2e.test.js` to reset data and exercise first-click attribution, activation reward, A/B/C qualification, application snapshot, rejection/resubmission, sign, pay, formal agent activation, agent reward, refund reversal, insufficient-balance pending recovery, and no duplicate reward behavior.
loop: until the full end-to-end test passes
max_iterations: 4
verify: cd local-backend && npm test -- --runInBand --testPathPattern=e2e

- [ ] **Step 10: Verify backend and both frontend targets**
action: Start the local backend, call `/health`, run the complete backend test suite, build the 主理人 H5 target and WeChat mini-program target, and record any non-blocking existing warnings without changing unrelated code.
loop: until all required verification commands pass
max_iterations: 3
verify:
  - type: shell
    command: cd local-backend && npm test -- --runInBand
  - type: shell
    command: cd ai-univ/主理人/h5 && npm run build:h5
  - type: shell
    command: cd ai-univ/主理人/h5 && npm run build:weapp
  - type: shell
    command: git diff --check

gate: human
