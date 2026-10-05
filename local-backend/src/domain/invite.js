const { BusinessError, audit, id, money, now } = require('../helpers')

const MEMBER_REWARD = 30
const AGENT_REWARD = 100

function findRelation(db, inviteeId) {
  return db.inviteRelations.find((item) => item.inviteeId === inviteeId)
}

function clickInvite(db, inviteeId, code) {
  const inviteCode = db.inviteCodes.find((item) => item.code === code)
  if (!inviteCode) throw new BusinessError('邀请码不存在', 404, 'INVITE_CODE_NOT_FOUND')
  const existing = db.inviteAttributions.find((item) => item.inviteeId === inviteeId)
  if (existing) return existing
  const attribution = { id: id('attr'), inviteeId, inviterId: inviteCode.memberId, code, locked: true, createdAt: now() }
  db.inviteAttributions.push(attribution)
  db.inviteRelations.push({ id: id('relation'), inviterId: inviteCode.memberId, inviteeId, status: '待激活', activatedAt: null })
  audit(db, 'invite_attribution_locked', inviteeId, inviteeId, { inviterId: inviteCode.memberId, code })
  return attribution
}

function issueReward(db, type, inviterId, inviteeId, amount, sourceEvent) {
  const duplicated = db.inviteRewards.find((item) => item.type === type && item.inviteeId === inviteeId && item.status !== '已撤回')
  if (duplicated) return duplicated
  const inviter = db.members.find((item) => item.id === inviterId)
  if (!inviter) throw new BusinessError('奖励归属会员不存在', 404, 'MEMBER_NOT_FOUND')
  let remaining = money(amount)
  const recoveries = db.pendingRecoveries.filter((item) => item.memberId === inviterId && item.status === '待扣回')
  for (const recovery of recoveries) {
    if (remaining <= 0) break
    const offset = Math.min(remaining, recovery.amount)
    recovery.amount = money(recovery.amount - offset)
    remaining = money(remaining - offset)
    if (recovery.amount === 0) recovery.status = '已扣回'
  }
  inviter.balance = money(inviter.balance + remaining)
  const reward = { id: id('reward'), type, inviterId, inviteeId, amount: money(amount), creditedAmount: remaining, status: '已发放', sourceEvent, createdAt: now(), reversedAt: null }
  db.inviteRewards.push(reward)
  audit(db, 'reward_issued', inviterId, reward.id, { type, inviteeId, amount: money(amount), creditedAmount: remaining })
  return reward
}

function activateMember(db, memberId) {
  const member = db.members.find((item) => item.id === memberId)
  if (!member) throw new BusinessError('会员不存在', 404, 'MEMBER_NOT_FOUND')
  if (member.memberStatus === 'active') return member
  member.memberStatus = 'active'
  const relation = findRelation(db, memberId)
  if (relation) {
    relation.status = '已激活'
    relation.activatedAt = now()
    issueReward(db, '会员邀请奖励', relation.inviterId, memberId, MEMBER_REWARD, 'member_activated')
  }
  audit(db, 'member_activated', memberId, memberId)
  return member
}

function reverseRewards(db, inviteeId, reason, type) {
  const rewards = db.inviteRewards.filter((item) => item.inviteeId === inviteeId && item.status === '已发放' && (!type || item.type === type))
  for (const reward of rewards) {
    const inviter = db.members.find((item) => item.id === reward.inviterId)
    const debit = Math.min(inviter.balance, reward.creditedAmount)
    inviter.balance = money(inviter.balance - debit)
    if (debit < reward.creditedAmount) {
      db.pendingRecoveries.push({ id: id('recovery'), memberId: inviter.id, rewardId: reward.id, amount: money(reward.creditedAmount - debit), status: '待扣回', reason, createdAt: now() })
      reward.status = '待扣回'
    } else {
      reward.status = '已扣回'
    }
    reward.reversedAt = now()
    audit(db, 'reward_reversed', inviter.id, reward.id, { reason, debit })
  }
}

function changeMemberStatus(db, memberId, status, reason) {
  const member = db.members.find((item) => item.id === memberId)
  if (!member) throw new BusinessError('会员不存在', 404, 'MEMBER_NOT_FOUND')
  member.memberStatus = status
  if (status !== 'active') reverseRewards(db, memberId, reason)
  audit(db, `member_${status}`, memberId, memberId, { reason })
  return member
}

function inviteView(db, memberId) {
  const member = db.members.find((item) => item.id === memberId)
  const relations = db.inviteRelations.filter((item) => item.inviterId === memberId)
  const rewards = db.inviteRewards.filter((item) => item.inviterId === memberId)
  const code = db.inviteCodes.find((item) => item.memberId === memberId)
  const memberRewards = rewards.filter((item) => item.type === '会员邀请奖励')
  const agentRewards = rewards.filter((item) => item.type === '代理邀请奖励')
  return {
    inviteCode: code ? code.code : null,
    total: relations.length,
    activated: relations.filter((item) => item.status === '已激活').length,
    memberInviteReward: memberRewards.reduce((sum, item) => sum + item.amount, 0),
    agentInviteReward: agentRewards.reduce((sum, item) => sum + item.amount, 0),
    rewardStatus: rewards.some((item) => item.status === '待扣回') ? '待扣回' : rewards.some((item) => item.status === '已扣回') ? '已撤回' : '',
    firstClickLocked: true,
    attributionText: '首次点击后锁定邀请关系',
    relations,
    balance: member.balance,
  }
}

module.exports = { MEMBER_REWARD, AGENT_REWARD, clickInvite, activateMember, changeMemberStatus, issueReward, reverseRewards, inviteView }
