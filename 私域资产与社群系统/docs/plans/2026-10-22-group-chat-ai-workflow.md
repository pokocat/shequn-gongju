---
intent: 完善两套群聊详情页的企业微信群同步说明、AI 总结和问群 AI 交互
success_criteria: 两套 group-chat 页面均能按 g 参数显示同步群内容；AI 总结和问答只使用当前可见消息；锁定内容不泄露；只读边界和 iframe 返回行为保持；npm test 与 npm run build 通过
risk_level: low
auto_approve: true
worktree: false
---

## Steps

- [ ] **Step 1: 统一群聊页面的只读与同步状态文案**
action: 修改 `public/member-app/pages/group-chat.html` 和 `public/principal-1-h5/pages/group-chat.html` 的群聊顶部、消息流和底部输入区域，明确标注企业微信群同步来源、同步范围、只读状态，并移除会让用户误认为可以向微信群发送消息的交互文案；保留 `?g=`、`group-chat` 和现有返回导航。
loop: false
verify:
  type: shell
  command: python3 - <<'PY'
from pathlib import Path
for p in [Path('public/member-app/pages/group-chat.html'), Path('public/principal-1-h5/pages/group-chat.html')]:
    s=p.read_text()
    assert '企业微信群' in s
    assert '只读' in s
    assert 'group-chat' in s
PY

- [ ] **Step 2: 完善会员版 AI 总结面板**
action: 在 `public/member-app/pages/group-chat.html` 中将现有 AI 总结渲染改为结构化分组，展示核心话题、结论、待办和关注项；总结只能从当前群公开可见消息及已有 ai 数据生成，未解锁的 lockedMessages 不得进入总结；无数据时显示明确空状态。
loop: until npm test -- --runInBand passes
max_iterations: 3
verify: npm test -- --runInBand

- [ ] **Step 3: 完善会员版问群 AI**
action: 在 `public/member-app/pages/group-chat.html` 中补齐快捷问题、自定义输入、发送、回答来源说明和未知问题提示；根据当前群的可见消息与确定性本地数据返回答案，空问题只聚焦输入框，不追加假消息；锁定内容未解锁时不得出现在回答中。
loop: until npm test -- --runInBand passes
max_iterations: 3
verify: npm test -- --runInBand

- [ ] **Step 4: 同步主理人版群聊 AI 体验**
action: 在 `public/principal-1-h5/pages/group-chat.html` 中加入与会员版一致的 AI 总结分组、问群 AI 输入与回答逻辑；根据该页面已有群数据和会员可见状态过滤上下文；保留现有卡片、会员升级入口、群参数和 iframe 返回机制。
loop: until npm test -- --runInBand passes
max_iterations: 3
verify: npm test -- --runInBand

- [ ] **Step 5: 执行静态页面与工程回归验证**
action: 检查两个 group-chat 页面包含同步来源、AI 总结、问群 AI、只读说明及 `g` 参数解析；运行完整测试和生产构建，确认没有脚本语法或打包错误。
loop: false
verify:
  - type: shell
    command: npm test
  - type: shell
    command: npm run build
  - type: shell
    command: python3 - <<'PY'
from pathlib import Path
for p in [Path('public/member-app/pages/group-chat.html'), Path('public/principal-1-h5/pages/group-chat.html')]:
    s=p.read_text()
    for token in ['AI 总结', '问群 AI', '只读', 'location.search', 'group-chat']:
        assert token in s, (p, token)
PY
