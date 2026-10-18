---
intent: 将消息页收敛为“对话 / 社群广场”两页签，并把已同步群聊与待解锁群统一放入对话页
success_criteria: 系统预览和主理人1 H5消息页只显示两个页签；对话页区分已同步群聊与待解锁群；社群广场保留发现和升级内容；相关测试通过
risk_level: low
auto_approve: true
worktree: false
dirty_worktree: allow
---

## Steps

- [ ] **Step 1: 更新系统预览消息页结构**
action: 修改 /Users/binbinchen/Documents/社群管理工具/主理人公社重设计预览.html 的 messages 页面，将三段式“我的群 / 推荐群”内容重组为“已同步群聊 / 待解锁群”，并新增两页签式视觉控件，仅保留“对话”和“社群广场”；已同步群继续使用 conversation 行，待解锁群使用权益卡和解锁按钮。
loop: false
verify:
  type: artifact
  path: /Users/binbinchen/Documents/社群管理工具/主理人公社重设计预览.html
  assert:
    kind: exists

- [ ] **Step 2: 同步主理人1 H5消息页页签**
action: 修改 /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/public/principal-1-h5/pages/notifications.html，将消息页页签从“对话 / 我的微信群 / 社群广场”改为“对话 / 社群广场”，并在对话主体中增加已同步群聊与待解锁群的明确分组和解锁动作。
loop: false
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
p=Path('public/principal-1-h5/pages/notifications.html')
s=p.read_text()
assert s.count('我的微信群') == 0
assert '社群广场' in s
assert '待解锁' in s
assert '已同步群聊' in s
PY

- [ ] **Step 3: 处理旧微信群入口兼容性**
action: 修改 /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/public/principal-1-h5/pages/group-chat.html，使其不再作为消息页独立页签暴露，并将页面说明调整为兼容入口或群会话详情语义，避免用户再次看到独立的“我的微信群”分类。
loop: false
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
p=Path('public/principal-1-h5/pages/group-chat.html')
s=p.read_text()
assert '社群广场' in s
assert '对话' in s
PY

- [ ] **Step 4: 校验消息页导航和内容边界**
action: 检查 /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统/public/principal-1-h5/pages/notifications.html、group-chat.html、group--社群广场.html 和 /Users/binbinchen/Documents/社群管理工具/主理人公社重设计预览.html，确认页签数量、当前高亮、已同步群聊、待解锁群和社群广场内容边界符合设计。
loop: false
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
root=Path('public/principal-1-h5/pages')
notifications=(root/'notifications.html').read_text()
plaza=(root/'group--社群广场.html').read_text()
assert notifications.count('mp-section-tab') >= 2
assert '我的微信群' not in notifications
assert '精选群' in plaza or '社群广场' in plaza
assert 'data-nav="notifications"' in notifications
assert 'data-nav="group--社群广场"' in notifications
PY

- [ ] **Step 5: 运行现有消息页测试**
action: 在 /Users/binbinchen/Documents/社群管理工具/私域资产与社群系统 执行消息页相关测试，确认导航和内容结构没有回归。
loop: false
verify: npm test -- --run tests/notificationsTabs.test.ts
