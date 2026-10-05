const test = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('../src/server')
const { resetDb, updateDb } = require('../src/store')

let server
let base

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  return { status: response.status, body: await response.json() }
}

function json(method, data, memberId = 'member-demo-001') {
  return { method, headers: { 'x-demo-member-id': memberId }, body: JSON.stringify(data || {}) }
}

async function resetScenario() {
  await request('/local/reset', json('POST'))
  await updateDb((db) => {
    const member = db.members.find((item) => item.id === 'member-demo-002')
    member.memberStatus = 'registered'
    member.identity = '会员'
    member.agentStatus = 'none'
    member.balance = 0
    const candidate = db.members.find((item) => item.id === 'member-demo-003')
    candidate.identity = '会员'
    candidate.agentStatus = 'none'
    db.inviteAttributions = []
    db.inviteRelations = []
    db.inviteRewards = []
    db.agentApplications = []
    db.applicationReviews = []
    db.contracts = []
    db.payments = []
    db.pendingRecoveries = []
    db.auditLogs = []
  })
}

test.before(async () => {
  await resetDb()
  server = createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})

test.after(() => server.close())

test('health and first-click attribution are available', async () => {
  await resetScenario()
  const health = await request('/health')
  assert.equal(health.body.data.ok, true)
  const first = await request('/mp/invite/click', json('POST', { inviteeId: 'member-demo-002', code: 'DEMO001' }))
  assert.equal(first.body.data.locked, true)
  const second = await request('/mp/invite/click', json('POST', { inviteeId: 'member-demo-002', code: 'DEMO003' }))
  assert.equal(second.body.data.inviterId, 'member-demo-001')
})

test('activation issues one member reward and repeated activation is safe', async () => {
  await resetScenario()
  await request('/mp/invite/click', json('POST', { inviteeId: 'member-demo-002', code: 'DEMO001' }))
  await request('/local/members/member-demo-002/activate', json('POST'))
  await request('/local/members/member-demo-002/activate', json('POST'))
  const rewards = await request('/local/rewards')
  assert.equal(rewards.body.data.rewards.filter((x) => x.type === '会员邀请奖励').length, 1)
})

test('agent application snapshots rule and gates formal activation', async () => {
  await resetScenario()
  await request('/local/qualification-rules', json('PUT', { mode: 'A', version: 'V-A' }))
  const submitted = await request('/mp/agent/application', json('POST', { identity: '团长' }, 'member-demo-003'))
  const application = submitted.body.data
  assert.equal(application.ruleSnapshot.version, 'V-A')
  const beforeSign = await request('/mp/agent/portfolio', { headers: { 'x-demo-member-id': 'member-demo-003' } })
  assert.equal(beforeSign.body.data.available, false)
  await request(`/local/agent/applications/${application.id}/review`, json('POST', { approved: true }))
  await request(`/local/agent/applications/${application.id}/sign`, json('POST'))
  await request(`/local/agent/applications/${application.id}/pay`, json('POST'))
  const afterPay = await request('/mp/agent/portfolio', { headers: { 'x-demo-member-id': 'member-demo-003' } })
  assert.equal(afterPay.body.data.available, true)
})

test('refund creates pending recovery when inviter balance is insufficient', async () => {
  await resetScenario()
  await request('/mp/invite/click', json('POST', { inviteeId: 'member-demo-002', code: 'DEMO001' }))
  await request('/local/members/member-demo-002/activate', json('POST'))
  await updateDb((db) => { db.members.find((item) => item.id === 'member-demo-001').balance = 0 })
  await request('/local/members/member-demo-002/expire', json('POST'))
  const rewards = await request('/local/rewards')
  assert.equal(rewards.body.data.pendingRecoveries.length, 1)
  assert.equal(rewards.body.data.rewards[0].status, '待扣回')
})

test('B/C qualification and rejected applications can be retried', async () => {
  await resetScenario()
  const ruleB = await request('/local/qualification-rules', json('PUT', { mode: 'B', requiredInvites: 1, version: 'V-B' }))
  assert.equal(ruleB.body.data.mode, 'B')
  const blocked = await request('/mp/agent/application', json('POST', { identity: '团长' }, 'member-demo-003'))
  assert.equal(blocked.status, 422)

  await request('/local/qualification-rules', json('PUT', { mode: 'C', requiredInvites: 0, trainingRequired: true, version: 'V-C' }))
  const submitted = await request('/mp/agent/application', json('POST', { identity: '团长' }, 'member-demo-003'))
  assert.equal(submitted.body.data.ruleSnapshot.version, 'V-C')
  await request(`/local/agent/applications/${submitted.body.data.id}/review`, json('POST', { approved: false, rejectReason: '资料需补充' }))
  const retried = await request('/mp/agent/application', json('POST', { identity: '团长' }, 'member-demo-003'))
  assert.equal(retried.status, 200)
  assert.equal(retried.body.data.ruleSnapshot.version, 'V-C')
})

test('seeded applications enforce direct review permissions and refresh counts', async () => {
  await request('/local/reset', json('POST'))

  const agentPending = await request('/mp/agent/applications/pending', {
    headers: { 'x-demo-member-id': 'member-demo-003' },
  })
  assert.equal(agentPending.body.data.counts.leader, 1)
  assert.equal(agentPending.body.data.counts.agent, 1)
  assert.equal(agentPending.body.data.counts.total, 2)

  const leaderPending = await request('/mp/agent/applications/pending', {
    headers: { 'x-demo-member-id': 'member-demo-002' },
  })
  assert.equal(leaderPending.status, 200)
  assert.deepEqual(leaderPending.body.data.applications, [])

  const leaderApplication = agentPending.body.data.applications.find((item) => item.identity === '团长')
  const agentApplication = agentPending.body.data.applications.find((item) => item.identity === '代理')
  const leaderReview = await request(`/local/agent/applications/${agentApplication.id}/review`, json('POST', { approved: true, reviewerId: 'local-admin' }, 'member-demo-002'))
  assert.equal(leaderReview.status, 403)

  const memberReview = await request(`/local/agent/applications/${leaderApplication.id}/review`, json('POST', { approved: true }, 'member-demo-004'))
  assert.equal(memberReview.status, 403)

  const rejected = await request(`/local/agent/applications/${agentApplication.id}/review`, json('POST', { approved: false, rejectReason: '代理资料需补充' }, 'member-demo-003'))
  assert.equal(rejected.status, 200)
  assert.equal(rejected.body.data.rejectReason, '代理资料需补充')

  const afterReject = await request('/mp/agent/applications/pending', {
    headers: { 'x-demo-member-id': 'member-demo-003' },
  })
  assert.deepEqual(afterReject.body.data.counts, { leader: 1, agent: 0, total: 1 })

  const adminApproved = await request(`/local/agent/applications/${leaderApplication.id}/review`, json('POST', { approved: true }, 'local-admin'))
  assert.equal(adminApproved.status, 200)
  assert.equal(adminApproved.body.data.status, '待签约')

  const reviews = await request('/local/rewards', { headers: { 'x-demo-member-id': 'member-demo-001' } })
  assert.equal(reviews.status, 200)
})
test('team tree limits active relationship visibility by viewer identity', async () => {
  await request('/local/reset', json('POST'))

  const principal = await request('/mp/team-tree', {
    headers: { 'x-demo-member-id': 'member-demo-001' },
  })
  assert.equal(principal.status, 200)
  assert.equal(principal.body.data.stats.total, 6)
  assert.deepEqual(
    principal.body.data.nodes.map((item) => item.id),
    [
      'member-demo-001',
      'member-demo-002',
      'member-demo-003',
      'member-demo-004',
      'member-demo-005',
      'member-demo-006',
    ],
  )
  assert.equal(
    principal.body.data.nodes.find((item) => item.id === 'member-demo-003').parentId,
    'member-demo-002',
  )
  assert.equal(
    principal.body.data.nodes.find((item) => item.id === 'member-demo-003').childrenCount,
    2,
  )

  const leader = await request('/mp/team-tree', {
    headers: { 'x-demo-member-id': 'member-demo-002' },
  })
  assert.equal(leader.status, 200)
  assert.deepEqual(
    leader.body.data.nodes.map((item) => item.id),
    [
      'member-demo-002',
      'member-demo-003',
      'member-demo-004',
      'member-demo-005',
    ],
  )

  const agent = await request('/mp/team-tree', {
    headers: { 'x-demo-member-id': 'member-demo-003' },
  })
  assert.equal(agent.status, 200)
  assert.deepEqual(
    agent.body.data.nodes.map((item) => item.id),
    [
      'member-demo-003',
      'member-demo-004',
      'member-demo-005',
    ],
  )
  assert.equal(agent.body.data.nodes[0].parentId, null)

  const member = await request('/mp/team-tree', {
    headers: { 'x-demo-member-id': 'member-demo-004' },
  })
  assert.equal(member.status, 403)

  await updateDb((db) => {
    db.inviteRelations.push(
      { id: 'relation-pending', inviterId: 'member-demo-003', inviteeId: 'member-demo-006', status: '待激活' },
      { id: 'relation-missing', inviterId: 'member-demo-003', inviteeId: 'missing-member', status: '已激活' },
      { id: 'relation-cycle', inviterId: 'member-demo-005', inviteeId: 'member-demo-003', status: '已激活' },
    )
  })

  const safeAgent = await request('/mp/team-tree', {
    headers: { 'x-demo-member-id': 'member-demo-003' },
  })
  assert.equal(safeAgent.status, 200)
  assert.deepEqual(
    safeAgent.body.data.nodes.map((item) => item.id),
    [
      'member-demo-003',
      'member-demo-004',
      'member-demo-005',
    ],
  )
})

test('agent cancellation uses pending recovery when inviter balance is insufficient', async () => {
  await resetScenario()
  await request('/mp/invite/click', json('POST', { inviteeId: 'member-demo-002', code: 'DEMO001' }))
  await request('/local/members/member-demo-002/activate', json('POST'))
  const submitted = await request('/mp/agent/application', json('POST', { identity: '团长' }, 'member-demo-002'))
  await request(`/local/agent/applications/${submitted.body.data.id}/review`, json('POST', { approved: true }))
  await request(`/local/agent/applications/${submitted.body.data.id}/sign`, json('POST'))
  await request(`/local/agent/applications/${submitted.body.data.id}/pay`, json('POST'))
  await updateDb((db) => { db.members.find((item) => item.id === 'member-demo-001').balance = 0 })
  await request('/local/agents/member-demo-002/cancel', json('POST'))
  const rewards = await request('/local/rewards')
  const agentReward = rewards.body.data.rewards.find((item) => item.type === '代理邀请奖励')
  assert.equal(agentReward.status, '待扣回')
  assert.equal(rewards.body.data.pendingRecoveries.some((item) => item.rewardId === agentReward.id), true)
})

