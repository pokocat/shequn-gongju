export type MemberNetworkRole = "agent" | "leader";

export type MemberRelationType =
  | "direct_ownership"
  | "development"
  | "recommendation"
  | "operation";

export type MemberNetworkRelation = {
  fromId: string;
  toId: string;
  type: MemberRelationType;
};

export type MemberNetworkEntity = {
  id: string;
  name: string;
  kind: "agent" | "leader" | "member" | "community";
  parentId?: string;
};

export type MemberNetworkScope = {
  selfId: string;
  role: MemberNetworkRole;
  directCommunityIds: string[];
  directLeaderIds: string[];
  directAgentIds: string[];
  developedAgentIds: string[];
  developedLeaderIds: string[];
  recommendedMemberIds: string[];
  recommendedLeaderIds: string[];
  recommendedCommunityIds: string[];
  aggregateCommunityIds: string[];
  maxDepth: number;
};

export type MemberNetworkView = {
  scope: "direct" | "development" | "recommendation";
  title: string;
  description: string;
  relationLabel: string;
  entityIds: string[];
  aggregateOnly: boolean;
};

const unique = (values: string[]) => Array.from(new Set(values));

const relatedIds = (
  selfId: string,
  relations: MemberNetworkRelation[],
  type: MemberRelationType,
) =>
  unique(
    relations
      .filter(relation => relation.fromId === selfId && relation.type === type)
      .map(relation => relation.toId),
  );

const collectDevelopedIds = (
  selfId: string,
  relations: MemberNetworkRelation[],
  maxDepth: number,
) => {
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: selfId, depth: 0 }];
  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth >= maxDepth) continue;
    relations
      .filter(
        relation =>
          relation.fromId === current.id && relation.type === "development",
      )
      .forEach(relation => {
        if (!visited.has(relation.toId)) {
          visited.add(relation.toId);
          queue.push({ id: relation.toId, depth: current.depth + 1 });
        }
      });
  }
  return Array.from(visited);
};

const collectAggregateCommunityIds = (
  developedIds: string[],
  relations: MemberNetworkRelation[],
) =>
  unique(
    relations
      .filter(
        relation =>
          relation.type === "operation" &&
          developedIds.includes(relation.fromId),
      )
      .map(relation => relation.toId),
  );

const collectRecommendedIds = (
  selfId: string,
  entities: MemberNetworkEntity[],
  relations: MemberNetworkRelation[],
) => {
  const recommendedMemberIds = relatedIds(selfId, relations, "recommendation");
  const recommendedLeaderIds = unique(
    recommendedMemberIds.flatMap(memberId =>
      relations
        .filter(
          relation =>
            relation.fromId === memberId && relation.type === "development",
        )
        .map(relation => relation.toId),
    ),
  ).filter(id => entities.find(entity => entity.id === id)?.kind === "leader");
  const recommendedCommunityIds = collectAggregateCommunityIds(
    [...recommendedMemberIds, ...recommendedLeaderIds],
    relations,
  );

  return {
    recommendedMemberIds,
    recommendedLeaderIds,
    recommendedCommunityIds,
  };
};

export const calculateMemberNetworkScope = (
  selfId: string,
  role: MemberNetworkRole,
  entities: MemberNetworkEntity[],
  relations: MemberNetworkRelation[],
): MemberNetworkScope => {
  const directCommunityIds = relatedIds(selfId, relations, "operation");
  const directOwnershipIds = relatedIds(selfId, relations, "direct_ownership");
  const directLeaderIds = directOwnershipIds.filter(
    id => entities.find(entity => entity.id === id)?.kind === "leader",
  );
  const directAgentIds = directOwnershipIds.filter(
    id => entities.find(entity => entity.id === id)?.kind === "agent",
  );
  const maxDepth = role === "agent" ? 2 : 1;
  const developedIds = collectDevelopedIds(selfId, relations, maxDepth);
  const recommended = collectRecommendedIds(selfId, entities, relations);
  const developedAgentIds = developedIds.filter(
    id => entities.find(entity => entity.id === id)?.kind === "agent",
  );
  const developedLeaderIds = developedIds.filter(
    id => entities.find(entity => entity.id === id)?.kind === "leader",
  );
  const aggregateCommunityIds = collectAggregateCommunityIds(
    developedIds,
    relations,
  );

  return {
    selfId,
    role,
    directCommunityIds,
    directLeaderIds,
    directAgentIds,
    developedAgentIds,
    developedLeaderIds,
    recommendedMemberIds: recommended.recommendedMemberIds,
    recommendedLeaderIds: recommended.recommendedLeaderIds,
    recommendedCommunityIds: recommended.recommendedCommunityIds,
    aggregateCommunityIds,
    maxDepth: role === "agent" ? 2 : 1,
  };
};

export const getMemberNetworkViews = (
  scope: MemberNetworkScope,
): MemberNetworkView[] => {
  const views: MemberNetworkView[] = [
    {
      scope: "direct",
      title: "我的社群",
      description: "只展示你直接运营和服务的社群。",
      relationLabel: "直接运营",
      entityIds: unique([
      scope.selfId,
      ...scope.directCommunityIds,
      ...scope.directLeaderIds,
      ...scope.directAgentIds,
    ]),
      aggregateOnly: false,
    },
  ];

  if (scope.role === "agent") {
    views.push({
      scope: "development",
      title: "发展网络",
      description: "汇总你发展的代理、团长及其社群，不展开非直属经营明细。",
      relationLabel: "发展关系 · 只读聚合",
      entityIds: unique([
        ...scope.developedAgentIds,
        ...scope.developedLeaderIds,
        ...scope.aggregateCommunityIds,
      ]),
      aggregateOnly: true,
    });
  }

  views.push({
    scope: "recommendation",
    title: scope.role === "agent" ? "推荐网络" : "我的推荐",
    description:
      scope.role === "agent"
        ? "展示你推荐的人，以及推荐链条下的团长和社群聚合。"
        : "展示你推荐的人及其发展的团长和社群聚合数据。",
    relationLabel: "推荐关系 · 只读聚合",
    entityIds: unique([
      ...scope.recommendedMemberIds,
      ...scope.recommendedLeaderIds,
      ...scope.recommendedCommunityIds,
    ]),
    aggregateOnly: true,
  });

  return views;
};

export const canViewMemberNetworkEntity = (
  scope: MemberNetworkScope,
  entityId: string,
  relationType: MemberRelationType,
) => {
  if (relationType === "operation") {
    return scope.directCommunityIds.includes(entityId);
  }
  if (relationType === "development") {
    return (
      scope.developedAgentIds.includes(entityId) ||
      scope.developedLeaderIds.includes(entityId) ||
      scope.aggregateCommunityIds.includes(entityId)
    );
  }
  if (relationType === "recommendation") {
    return (
      scope.recommendedMemberIds.includes(entityId) ||
      scope.recommendedLeaderIds.includes(entityId) ||
      scope.recommendedCommunityIds.includes(entityId)
    );
  }
  return entityId === scope.selfId;
};

export const memberNetworkExample = {
  entities: [
    { id: "agent-self", name: "当前代理", kind: "agent" },
    { id: "agent-child", name: "发展代理", kind: "agent" },
    { id: "leader-direct", name: "直属团长", kind: "leader", parentId: "agent-self" },
    { id: "leader-child", name: "下属代理发展的团长", kind: "leader", parentId: "agent-child" },
    { id: "leader-recommended", name: "推荐团长", kind: "leader" },
    { id: "member-recommended", name: "推荐成员", kind: "member" },
    { id: "community-self", name: "我的社群", kind: "community" },
    { id: "community-leader", name: "团长社群", kind: "community" },
    { id: "community-child", name: "下属团长社群", kind: "community" },
    { id: "community-recommended", name: "推荐链路社群", kind: "community" },
  ] satisfies MemberNetworkEntity[],
  relations: [
    { fromId: "agent-self", toId: "community-self", type: "operation" },
    { fromId: "agent-self", toId: "agent-child", type: "development" },
    { fromId: "agent-self", toId: "leader-direct", type: "direct_ownership" },
    { fromId: "leader-direct", toId: "community-leader", type: "operation" },
    { fromId: "agent-child", toId: "leader-child", type: "development" },
    { fromId: "leader-child", toId: "community-child", type: "operation" },
    { fromId: "agent-self", toId: "member-recommended", type: "recommendation" },
    { fromId: "member-recommended", toId: "leader-recommended", type: "development" },
    { fromId: "leader-recommended", toId: "community-recommended", type: "operation" },
    { fromId: "leader-direct", toId: "member-recommended", type: "recommendation" },
  ] satisfies MemberNetworkRelation[],
} as const;
