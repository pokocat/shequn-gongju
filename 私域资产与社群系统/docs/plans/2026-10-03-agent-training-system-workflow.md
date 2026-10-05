---
intent: Implement the approved agent training growth system in the existing member app and PC operations workbench.
success_criteria: Five-stage training path, training tasks, mentor roles, training groups, progress states, and scoped PC management are visible without regressing existing identity and relationship operations.
risk_level: medium
auto_approve: false
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: Add shared training domain types and sample data**
action: Inspect existing data conventions, then add the minimum typed training model and stable sample records in the existing data layer. Represent S0-S4 stages, task status, mentor role, training group type/status, course progress, practical progress, and risk status without changing existing identity or relationship types.
loop: until the shared model compiles and existing data imports remain valid
max_iterations: 3
verify: npm run build

- [ ] **Step 2: Add training summary to the PC influence workbench**
action: Extend src/app/components/InfluenceRanking.tsx with a compact team-growth training summary showing current stage, course/practical progress, mentor roles, training groups, and outstanding training actions. Keep direct scope actionable and development/recommendation scope aggregate-only.
loop: until the new summary renders and type checks
max_iterations: 3
verify: npm run build

- [ ] **Step 3: Add training tasks to the PC task center**
action: Extend the existing task category and task list structures in src/app/components/InfluenceRanking.tsx with training enrollment review, coursework, practical submission, mentor review, overdue follow-up, and group migration examples. Add visible status and action labels while preserving existing task categories and relationship drawer behavior.
loop: until existing and training task interactions render without TypeScript errors
max_iterations: 3
verify: npm run build

- [ ] **Step 4: Add the member-app team growth training view**
action: Extend public/member-app/pages/tasks.html using its existing identity-specific task and team-growth patterns to show the five-stage path, current stage requirements, training tasks, mentor cards, and three training-group cards. Reuse existing training/course/group navigation targets and keep the page compatible with the current embedded preview.
loop: until the member-app page contains all approved sections with no broken navigation attributes
max_iterations: 3
verify: git diff --check

- [ ] **Step 5: Add training activity metadata to the existing activity management**
action: Extend src/app/components/Activities.tsx only where needed so agent training and cohort activities expose training-specific target, mentor, group, and progress context while remaining compatible with the existing Activity type and activity list behavior.
loop: until the activity list and detail flow compile with the new training context
max_iterations: 3
verify: npm run build

- [ ] **Step 6: Add focused regression tests for training data and scope rules**
action: Add tests under tests/ following the existing Vitest conventions for S0-S4 ordering, mentor role labels, training group transitions, task status semantics, and aggregate-only protection for development/recommendation scopes.
loop: until all focused tests pass
max_iterations: 3
verify: npm test -- --run

- [ ] **Step 7: Run final validation**
action: Run repository diff validation, the complete test suite, and the production build. Fix only issues introduced by the training implementation and do not revert intentional existing changes in InfluenceRanking.tsx or other modified files.
loop: until all validation commands pass
max_iterations: 3
verify:
  - type: shell
    command: git diff --check
  - type: shell
    command: npm test -- --run
  - type: shell
    command: npm run build

- [ ] **Step 8: Human review of the training experience**
action: Open the member-app embedded preview and the PC influence workbench, then verify the five-stage training path, mentor roles, three training groups, task states, and scope labels are understandable and visually consistent with the existing product.
loop: false
gate: human
verify:
  type: human-review
  check: Team growth clearly reads as agent training, shows mentor and group ownership, and does not expose non-direct personal training details.
