const { BusinessError } = require('../helpers')

const AVATAR_PATHS = {
  'member-demo-001': '../assets/avatars/wang.jpg',
  'member-demo-002': '../assets/avatars/liyuntian.jpg',
  'member-demo-003': '../assets/avatars/yunying.jpg',
  'member-demo-004': '../assets/avatars/avatar-04.jpg',
  'member-demo-005': '../assets/avatars/avatar-05.jpg',
  'member-demo-006': '../assets/avatars/avatar-06.jpg',
}

const LEVELS = {
  主理人: 'PRINCIPAL',
  团长: 'LEADER',
  代理: 'AGENT',
  会员: 'MEMBER',
}

function viewerFor(db, viewerId) {
  const viewer = db.members.find((item) => item.id === viewerId)
  if (!viewer) throw new BusinessError('成员不存在', 404, 'MEMBER_NOT_FOUND')
  if (viewer.identity === '主理人') return viewer
  if (viewer.agentStatus === 'active' && ['团长', '代理'].includes(viewer.identity)) return viewer
  throw new BusinessError('当前身份无团队树查看权限', 403, 'TEAM_TREE_FORBIDDEN')
}

function activeGraph(db) {
  const members = new Map(db.members.map((item) => [item.id, item]))
  const children = new Map()
  const parentByChild = new Map()
  const seenEdges = new Set()

  db.inviteRelations.forEach((relation) => {
    if (relation.status !== '已激活') return
    if (!members.has(relation.inviterId) || !members.has(relation.inviteeId)) return
    if (relation.inviterId === relation.inviteeId) return
    if (parentByChild.has(relation.inviteeId)) return
    const edgeKey = `${relation.inviterId}:${relation.inviteeId}`
    if (seenEdges.has(edgeKey)) return
    seenEdges.add(edgeKey)
    parentByChild.set(relation.inviteeId, relation.inviterId)
    const items = children.get(relation.inviterId) || []
    items.push(relation.inviteeId)
    children.set(relation.inviterId, items)
  })

  return { members, children, parentByChild }
}

function descendantIds(rootId, children) {
  const visible = []
  const visited = new Set()

  function visit(memberId) {
    if (visited.has(memberId)) return
    visited.add(memberId)
    visible.push(memberId)
    ;(children.get(memberId) || []).forEach(visit)
  }

  visit(rootId)
  return visible
}

function fullTreeIds(members, children, parentByChild) {
  const visible = []
  const visited = new Set()
  const roots = Array.from(members.keys()).filter((memberId) => !parentByChild.has(memberId))

  roots.forEach((rootId) => {
    descendantIds(rootId, children).forEach((memberId) => {
      if (visited.has(memberId)) return
      visited.add(memberId)
      visible.push(memberId)
    })
  })

  Array.from(members.keys()).forEach((memberId) => {
    if (visited.has(memberId)) return
    descendantIds(memberId, children).forEach((id) => {
      if (visited.has(id)) return
      visited.add(id)
      visible.push(id)
    })
  })

  return visible
}

function teamTreeView(db, viewerId) {
  const viewer = viewerFor(db, viewerId)
  const { members, children, parentByChild } = activeGraph(db)
  const isPrincipal = viewer.identity === '主理人'
  const visibleIds = isPrincipal
    ? fullTreeIds(members, children, parentByChild)
    : descendantIds(viewer.id, children)
  const visible = new Set(visibleIds)
  const nodes = visibleIds.map((memberId) => {
    const member = members.get(memberId)
    const parentId = parentByChild.get(memberId)
    const childrenCount = (children.get(memberId) || []).filter((childId) => visible.has(childId)).length
    return {
      id: member.id,
      parentId: parentId && visible.has(parentId) ? parentId : null,
      name: member.name,
      identity: member.identity,
      level: LEVELS[member.identity] || 'MEMBER',
      balance: Number(member.balance || 0).toFixed(2),
      avatarPath: AVATAR_PATHS[member.id] || '../assets/avatars/avatar-01.jpg',
      childrenCount,
    }
  })
  const identityCounts = nodes.reduce((counts, node) => {
    counts[node.level] = (counts[node.level] || 0) + 1
    return counts
  }, {})

  return {
    viewer: { id: viewer.id, name: viewer.name, identity: viewer.identity },
    scope: isPrincipal ? 'full' : 'descendants',
    nodes,
    stats: {
      total: nodes.length,
      principal: identityCounts.PRINCIPAL || 0,
      leader: identityCounts.LEADER || 0,
      agent: identityCounts.AGENT || 0,
      member: identityCounts.MEMBER || 0,
    },
  }
}

module.exports = { teamTreeView }
