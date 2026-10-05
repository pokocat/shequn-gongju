const http = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')
const { URL } = require('node:url')
const { readDb, updateDb, resetDb } = require('./store')
const { BusinessError, currentMember, envelope, errorEnvelope, withIdempotency } = require('./helpers')
const { clickInvite, activateMember, changeMemberStatus, inviteView } = require('./domain/invite')
const { activeRule, qualification, applyAgent, pendingApplications, reviewAgent, signAgent, payAgent, cancelAgent, applicationView, portfolioView } = require('./domain/agent')
const { teamTreeView } = require('./domain/team')

async function body(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new BusinessError('请求体不是合法 JSON', 400, 'INVALID_JSON') }
}

function send(response, status, payload, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  response.end(JSON.stringify(payload))
}

async function route(request, response) {
  const url = new URL(request.url, 'http://127.0.0.1')
  const method = request.method || 'GET'
  const pathname = url.pathname
  if (method === 'OPTIONS') return send(response, 204, null, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-demo-member-id, Idempotency-Key', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS' })
  if (method === 'GET' && pathname === '/health') return send(response, 200, envelope({ ok: true, service: 'principal-community-local-backend' }))
  if (method === 'GET' && pathname === '/') return serveConsole(response)
  const db = await readDb()
  const current = () => currentMember(db, request)
  const input = ['POST', 'PUT', 'PATCH'].includes(method) ? await body(request) : {}
  let data

  if (method === 'GET' && pathname === '/mp/me') data = {
    name: current().name,
    avatarPath: '',
    member_no: current().id,
    hasPaidEntitlement: current().memberStatus === 'active',
    identity: {
      identity: current().identity,
      base_identity: current().identity,
    },
    city: '上海',
    created_at: null,
  }
  else if (method === 'GET' && pathname === '/mp/growth') data = {
    level: 3,
    growth: 2860,
    nextThreshold: 4000,
    nextLevel: 4,
    remaining: 1140,
    progressPct: 71.5,
  }
  else if (method === 'GET' && pathname === '/mp/course-sessions') data = []
  else if (method === 'GET' && pathname === '/mp/announcements') data = { items: [], unread: 0 }
  else if (method === 'GET' && pathname === '/mp/diagnosis') data = { report: null, pending: null }
  else if (method === 'GET' && pathname === '/mp/my-group') data = { advisorStep: null, serviceTeacher: null }
  else if (method === 'GET' && pathname === '/mp/tickets') data = []
  else if (method === 'GET' && pathname === '/mp/invite') data = inviteView(db, current().id)
  else if (method === 'GET' && pathname === '/mp/team-tree') data = teamTreeView(db, current().id)
  else if (method === 'GET' && pathname === '/mp/invite/qrcode') data = { code: current().id === 'member-demo-001' ? 'DEMO001' : 'DEMO003', imageUrl: null }
  else if (method === 'POST' && pathname === '/mp/invite/click') data = await updateDb((state) => clickInvite(state, input.inviteeId || current().id, input.code))
  else if (method === 'GET' && pathname === '/mp/agent/application') data = applicationView(db, current().id)
  else if (method === 'GET' && pathname === '/mp/agent/applications/pending') data = pendingApplications(db, current().id)
  else if (method === 'POST' && pathname === '/mp/agent/application') data = await updateDb((state) => withIdempotency(state, request, () => applyAgent(state, current().id, input.identity, input.reason)))
  else if (method === 'GET' && pathname === '/mp/agent/portfolio') data = portfolioView(db, current().id)
  else if (method === 'GET' && pathname === '/local/demo/members') data = db.members
  else if (method === 'GET' && pathname === '/local/qualification-rules') data = db.qualificationRules
  else if (method === 'PUT' && pathname === '/local/qualification-rules') data = await updateDb((state) => {
    const rule = { mode: input.mode, requiredInvites: Number(input.requiredInvites || 0), trainingRequired: !!input.trainingRequired, version: input.version || `V${Date.now()}`, effectiveAt: new Date().toISOString() }
    state.qualificationRules.history.push(state.qualificationRules.active)
    state.qualificationRules.active = rule
    return rule
  })
  else if (method === 'POST' && pathname === '/local/reset') data = await resetDb()
  else if (method === 'POST' && /^\/local\/members\/[^/]+\/activate$/.test(pathname)) data = await updateDb((state) => activateMember(state, pathname.split('/')[3]))
  else if (method === 'POST' && /^\/local\/members\/[^/]+\/(refund|expire)$/.test(pathname)) data = await updateDb((state) => changeMemberStatus(state, pathname.split('/')[3], pathname.endsWith('/refund') ? 'refunded' : 'expired', input.reason || pathname.split('/').pop()))
  else if (method === 'POST' && /^\/local\/agent\/applications\/[^/]+\/review$/.test(pathname)) data = await updateDb((state) => reviewAgent(state, pathname.split('/')[4], !!input.approved, input.rejectReason, current().id))
  else if (method === 'POST' && /^\/local\/agent\/applications\/[^/]+\/sign$/.test(pathname)) data = await updateDb((state) => signAgent(state, pathname.split('/')[4]))
  else if (method === 'POST' && /^\/local\/agent\/applications\/[^/]+\/pay$/.test(pathname)) data = await updateDb((state) => payAgent(state, pathname.split('/')[4]))
  else if (method === 'POST' && /^\/local\/agents\/[^/]+\/cancel$/.test(pathname)) data = await updateDb((state) => cancelAgent(state, pathname.split('/')[3], input.reason || '本地模拟取消'))
  else if (method === 'GET' && pathname === '/local/rewards') data = { rewards: db.inviteRewards, pendingRecoveries: db.pendingRecoveries, auditLogs: db.auditLogs }
  else throw new BusinessError('接口不存在', 404, 'NOT_FOUND')
  return send(response, 200, envelope(data), { 'Access-Control-Allow-Origin': '*' })
}

async function serveConsole(response) {
  const file = path.join(__dirname, '..', 'public', 'index.html')
  const content = await fs.readFile(file, 'utf8')
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(content)
}

function createServer() {
  return http.createServer((request, response) => {
    route(request, response).catch((error) => {
      const status = error.status || 500
      send(response, status, errorEnvelope(error), { 'Access-Control-Allow-Origin': '*' })
    })
  })
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8787)
  createServer().listen(port, '127.0.0.1', () => console.log(`local backend listening on http://127.0.0.1:${port}`))
}

module.exports = { createServer, route }
