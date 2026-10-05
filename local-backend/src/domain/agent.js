const { BusinessError, audit, id, now } = require('../helpers')
const { AGENT_REWARD, issueReward, reverseRewards } = require('./invite')

function activeRule(db) {
  return db.qualificationRules.active
}

function validInvites(db, memberId) {
  return db.inviteRelations.filter((item) => item.inviterId === memberId && item.status === '已激活').length
}

function qualification(db, memberId) {
  const member = db.members.find((item) => item.id === memberId)
  const rule = activeRule(db)
  const invites = validInvites(db, memberId)
  const invitePassed = invites >= rule.requiredInvites
  const trainingPassed = !rule.trainingRequired || !!member.trainingCompleted
  const passed = member.memberStatus === 'active' && invitePassed && trainingPassed
  const missing = []
  if (member.memberStatus !== 'active') missing.push('会员未激活')
  if (!invitePassed) missing.push(`还差 ${rule.requiredInvites - invites} 个有效邀请`)
  if (!trainingPassed) missing.push('还差培训或社群任务')
  return { passed, mode: rule.mode, ruleVersion: rule.version, summary: passed ? '当前规则下具备申请资格' : missing.join('，'), invites, requiredInvites: rule.requiredInvites, trainingCompleted: !!member.trainingCompleted, identityOptions: ['团长', '代理'] }
}

function applicationFor(db, memberId) {
  return db.agentApplications.filter((item) => item.memberId === memberId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null
}

function sponsorFor(db, memberId) {
  const relation = db.inviteRelations.find((item) => item.inviteeId === memberId)
  return relation ? relation.inviterId : null
}

function reviewerCanReview(db, reviewerId, application) {
  if (reviewerId === 'local-admin') return true
  const reviewer = db.members.find((item) => item.id === reviewerId)
  if (!reviewer) throw new BusinessError('审核人不存在', 404, 'REVIEWER_NOT_FOUND')
  if (reviewer.identity === '主理人') return true
  if (reviewer.agentStatus !== 'active' || !['代理', '团长'].includes(reviewer.identity)) {
    throw new BusinessError('当前身份无审核权限', 403, 'REVIEW_FORBIDDEN')
  }
  if (application.identity === '代理' && reviewer.identity !== '代理') {
    throw new BusinessError('团长不能审核代理申请', 403, 'REVIEW_FORBIDDEN')
  }
  if (application.sponsorId !== reviewerId) {
    throw new BusinessError('仅直属上级可以审核该申请', 403, 'REVIEW_FORBIDDEN')
  }
  return true
}

function pendingApplications(db, reviewerId) {
  if (reviewerId === 'local-admin') {
    return pendingApplicationResult(db, reviewerId, null)
  }
  const reviewer = db.members.find((item) => item.id === reviewerId)
  if (!reviewer) throw new BusinessError('审核人不存在', 404, 'REVIEWER_NOT_FOUND')
  const canReview = reviewer.identity === '主理人' || (reviewer.agentStatus === 'active' && ['代理', '团长'].includes(reviewer.identity))
  if (!canReview) throw new BusinessError('当前身份无审核权限', 403, 'REVIEW_FORBIDDEN')
  return pendingApplicationResult(db, reviewerId, reviewer)
}

function pendingApplicationResult(db, reviewerId, reviewer) {
  const visible = db.agentApplications.filter((item) => {
    if (item.status !== '审核中') return false
    if (reviewerId === 'local-admin' || reviewer.identity === '主理人') return true
    if (item.sponsorId !== reviewerId) return false
    return item.identity !== '代理' || reviewer.identity === '代理'
  })
  const applications = visible.map((item) => {
    const applicant = db.members.find((member) => member.id === item.memberId)
    return { ...item, applicantName: applicant ? applicant.name : item.memberId, sponsorId: item.sponsorId || null }
  })
  return {
    applications,
    counts: {
      leader: applications.filter((item) => item.identity === '团长').length,
      agent: applications.filter((item) => item.identity === '代理').length,
      total: applications.length
    }
  }
}

function applyAgent(db, memberId, identity, reason) {
  const current = applicationFor(db, memberId)
  if (current && ['审核中', '待签约', '待缴费', '正式代理'].includes(current.status)) throw new BusinessError('当前申请正在处理中', 409, 'APPLICATION_IN_PROGRESS')
  const check = qualification(db, memberId)
  if (!check.passed) throw new BusinessError(check.summary, 422, 'QUALIFICATION_NOT_MET')
  const rule = activeRule(db)
  const application = { id: id('application'), memberId, sponsorId: sponsorFor(db, memberId), identity: identity || '团长', reason: reason || '', status: '审核中', qualification: check, ruleSnapshot: { ...rule }, rejectReason: '', createdAt: now(), updatedAt: now() }
  db.agentApplications.push(application)
  audit(db, 'agent_application_submitted', memberId, application.id, { ruleVersion: rule.version })
  return application
}

function reviewAgent(db, applicationId, approved, rejectReason, reviewerId = 'local-admin') {
  const application = db.agentApplications.find((item) => item.id === applicationId)
  if (!application) throw new BusinessError('申请不存在', 404, 'APPLICATION_NOT_FOUND')
  if (application.status !== '审核中') throw new BusinessError('当前申请不可审核', 409, 'INVALID_APPLICATION_STATE')
  reviewerCanReview(db, reviewerId, application)
  application.status = approved ? '待签约' : '已拒绝'
  application.rejectReason = approved ? '' : (rejectReason || '资料或资格未通过')
  application.updatedAt = now()
  db.applicationReviews.push({ id: id('review'), applicationId, reviewerId, approved, rejectReason: application.rejectReason, createdAt: now() })
  audit(db, approved ? 'agent_application_approved' : 'agent_application_rejected', reviewerId, applicationId, { rejectReason: application.rejectReason })
  return application
}

function signAgent(db, applicationId) {
  const application = db.agentApplications.find((item) => item.id === applicationId)
  if (!application || application.status !== '待签约') throw new BusinessError('申请当前不可签约', 409, 'INVALID_APPLICATION_STATE')
  const contract = db.contracts.find((item) => item.applicationId === applicationId) || { id: id('contract'), applicationId, status: '已签约', signedAt: now() }
  if (!db.contracts.find((item) => item.applicationId === applicationId)) db.contracts.push(contract)
  application.status = '待缴费'
  application.updatedAt = now()
  audit(db, 'agent_contract_signed', application.memberId, applicationId)
  return application
}

function payAgent(db, applicationId) {
  const application = db.agentApplications.find((item) => item.id === applicationId)
  if (!application || application.status !== '待缴费') throw new BusinessError('申请当前不可缴费', 409, 'INVALID_APPLICATION_STATE')
  const payment = db.payments.find((item) => item.applicationId === applicationId) || { id: id('payment'), applicationId, status: '已缴费', paidAt: now() }
  if (!db.payments.find((item) => item.applicationId === applicationId)) db.payments.push(payment)
  application.status = '正式代理'
  application.updatedAt = now()
  const member = db.members.find((item) => item.id === application.memberId)
  member.identity = application.identity
  member.agentStatus = 'active'
  const attribution = db.inviteAttributions.find((item) => item.inviteeId === application.memberId)
  if (attribution) issueReward(db, '代理邀请奖励', attribution.inviterId, application.memberId, AGENT_REWARD, 'agent_activated')
  audit(db, 'agent_activated', application.memberId, applicationId)
  return application
}

function cancelAgent(db, memberId, reason) {
  const member = db.members.find((item) => item.id === memberId)
  if (!member) throw new BusinessError('会员不存在', 404, 'MEMBER_NOT_FOUND')
  member.agentStatus = 'cancelled'
  const applications = db.agentApplications.filter((item) => item.memberId === memberId && item.status === '正式代理')
  for (const application of applications) application.status = '已取消'
  reverseRewards(db, memberId, reason || '代理取消', '代理邀请奖励')
  audit(db, 'agent_cancelled', memberId, memberId, { reason })
  return member
}

function applicationView(db, memberId) {
  const application = applicationFor(db, memberId)
  const check = qualification(db, memberId)
  const contract = application && db.contracts.find((item) => item.applicationId === application.id)
  const payment = application && db.payments.find((item) => item.applicationId === application.id)
  return { application, qualification: check, canApply: check.passed && (!application || !['审核中', '待签约', '待缴费', '正式代理'].includes(application.status)), contract: contract || { status: '待签约' }, payment: payment || { status: '待缴费' } }
}

function portfolioView(db, memberId) {
  const member = db.members.find((item) => item.id === memberId)
  const application = applicationFor(db, memberId)
  const available = member.agentStatus === 'active' && application && application.status === '正式代理'
  return { available: !!available, identity: member.identity, status: member.agentStatus, communities: [], students: [] }
}

module.exports = { activeRule, qualification, applicationFor, pendingApplications, applyAgent, reviewAgent, signAgent, payAgent, cancelAgent, applicationView, portfolioView }
