const crypto = require('node:crypto')

class BusinessError extends Error {
  constructor(message, status = 400, code = 'BUSINESS_ERROR') {
    super(message)
    this.status = status
    this.code = code
  }
}

function now() {
  return new Date().toISOString()
}

function id(prefix) {
  return `${prefix}-${crypto.randomUUID()}`
}

function money(value) {
  return Math.round(Number(value || 0) * 100) / 100
}

function currentMember(db, request) {
  const memberId = request.headers['x-demo-member-id'] || 'member-demo-001'
  if (memberId === 'local-admin') return { id: 'local-admin', name: '本地管理员', identity: '系统管理员', agentStatus: 'active' }
  const member = db.members.find((item) => item.id === memberId)
  if (!member) throw new BusinessError('演示会员不存在', 404, 'MEMBER_NOT_FOUND')
  return member
}

function audit(db, action, actorId, targetId, detail = {}) {
  db.auditLogs.push({ id: id('audit'), action, actorId, targetId, detail, createdAt: now() })
}

function envelope(data = null, message = '') {
  return { code: 0, message, data }
}

function errorEnvelope(error) {
  return { code: error.code || 'BUSINESS_ERROR', message: error.message || '请求失败', data: null }
}

function withIdempotency(db, request, handler) {
  const key = request.headers['idempotency-key']
  if (!key) return handler()
  if (db.idempotency[key]) return db.idempotency[key]
  return Promise.resolve(handler()).then((result) => {
    db.idempotency[key] = result
    return result
  })
}

module.exports = { BusinessError, now, id, money, currentMember, audit, envelope, errorEnvelope, withIdempotency }
