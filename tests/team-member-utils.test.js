import { describe, it, expect } from 'vitest';
import {
  esc,
  levelBadge,
  getMemberPool,
  memberRowHtml,
  filterMembersByScope,
  filterMembersByKeyword,
  getRelationTabs,
  TEAM_MEMBER_POOL,
  METRIC_POOL_MAP,
  FUNNEL_POOL_MAP
} from '../public/member-app/pages/team-member-utils.js';

describe('esc', () => {
  it('字符串原样返回', () => {
    expect(esc('hello')).toBe('hello');
  });

  it('数字转为字符串', () => {
    expect(esc(123)).toBe('123');
  });

  it('null 转为字符串', () => {
    expect(esc(null)).toBe('null');
  });

  it('undefined 转为字符串', () => {
    expect(esc(undefined)).toBe('undefined');
  });

  it('特殊字符原样保留（当前实现不做 HTML 转义）', () => {
    expect(esc('<script>')).toBe('<script>');
  });
});

describe('levelBadge', () => {
  it('空字符串返回空', () => {
    expect(levelBadge('')).toBe('');
  });

  it('null 返回空', () => {
    expect(levelBadge(null)).toBe('');
  });

  it('undefined 返回空', () => {
    expect(levelBadge(undefined)).toBe('');
  });

  it('SV 开头使用紫色 #6D5BD0', () => {
    const html = levelBadge('SV.3');
    expect(html).toContain('#6D5BD0');
    expect(html).toContain('SV.3');
    expect(html).toContain('class="mbr-level"');
  });

  it('V.3 开头使用蓝色 #5B8DEF', () => {
    const html = levelBadge('V.3');
    expect(html).toContain('#5B8DEF');
    expect(html).toContain('V.3');
  });

  it('其他 V 等级（如 V.1）使用橙色 #F7B65C', () => {
    const html = levelBadge('V.1');
    expect(html).toContain('#F7B65C');
    expect(html).toContain('V.1');
  });

  it('返回包含 mbr-level 类名的 span', () => {
    const html = levelBadge('SV.1');
    expect(html).toMatch(/^<span class="mbr-level"/);
    expect(html).toMatch(/<\/span>$/);
  });
});

describe('getMemberPool', () => {
  it('直属团长 映射到 agent 数据池', () => {
    const pool = getMemberPool('直属团长');
    expect(pool).toBe(TEAM_MEMBER_POOL.agent);
  });

  it('引流学员 映射到 follow 数据池', () => {
    const pool = getMemberPool('引流学员');
    expect(pool).toBe(TEAM_MEMBER_POOL.follow);
  });

  it('年卡会员 映射到 vip 数据池', () => {
    const pool = getMemberPool('年卡会员');
    expect(pool).toBe(TEAM_MEMBER_POOL.vip);
  });

  it('社群数 映射到 community 数据池', () => {
    const pool = getMemberPool('社群数');
    expect(pool).toBe(TEAM_MEMBER_POOL.community);
  });

  it('漏斗环节 会员招募 映射到 vip', () => {
    const pool = getMemberPool('会员招募');
    expect(pool).toBe(TEAM_MEMBER_POOL.vip);
  });

  it('漏斗环节 扫码 映射到 scan', () => {
    const pool = getMemberPool('扫码');
    expect(pool).toBe(TEAM_MEMBER_POOL.scan);
  });

  it('漏斗环节 体验 映射到 experience', () => {
    const pool = getMemberPool('体验');
    expect(pool).toBe(TEAM_MEMBER_POOL.experience);
  });

  it('漏斗环节 发展团长 映射到 agent', () => {
    const pool = getMemberPool('发展团长');
    expect(pool).toBe(TEAM_MEMBER_POOL.agent);
  });

  it('漏斗环节 聚合社群 映射到 community', () => {
    const pool = getMemberPool('聚合社群');
    expect(pool).toBe(TEAM_MEMBER_POOL.community);
  });

  it('未映射的指标兜底到 follow', () => {
    const pool = getMemberPool('不存在的指标');
    expect(pool).toBe(TEAM_MEMBER_POOL.follow);
  });

  it('每个数据池包含 label、actions、members 字段', () => {
    Object.keys(TEAM_MEMBER_POOL).forEach((key) => {
      const pool = TEAM_MEMBER_POOL[key];
      expect(pool).toHaveProperty('label');
      expect(pool).toHaveProperty('actions');
      expect(pool).toHaveProperty('members');
      expect(Array.isArray(pool.actions)).toBe(true);
      expect(Array.isArray(pool.members)).toBe(true);
      expect(pool.members.length).toBeGreaterThan(0);
    });
  });

  it('METRIC_POOL_MAP 中所有值都对应有效数据池', () => {
    Object.values(METRIC_POOL_MAP).forEach((key) => {
      expect(TEAM_MEMBER_POOL[key]).toBeDefined();
    });
  });

  it('FUNNEL_POOL_MAP 中所有值都对应有效数据池', () => {
    Object.values(FUNNEL_POOL_MAP).forEach((key) => {
      expect(TEAM_MEMBER_POOL[key]).toBeDefined();
    });
  });
});

describe('memberRowHtml', () => {
  const member = {
    name: '屋顶小仙女',
    phone: '18705817856',
    wechat: 'Melody-yoo',
    region: '浙江-湖州',
    date: '2017-03-28',
    amount: '¥1789',
    skin: '轻油|重敏|非色素|紧致',
    level: 'V.1',
    subCount: 128
  };

  it('生成包含 mbr-row 类的 div', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('class="mbr-row"');
    expect(html).toContain('role="button"');
  });

  it('包含正确的 data-team-member 属性', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('data-team-member="屋顶小仙女"');
  });

  it('使用真人头像图片而不是姓名首字', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('<img class="mbr-avatar"');
    expect(html).toContain('../assets/avatars/avatar-01.jpg');
    expect(html).not.toContain('<span class="mbr-avatar">屋</span>');
  });

  it('D2 显示统一主理人身份名称', () => {
    expect(levelBadge('D2')).toContain('D2 · 核心合伙人');
  });

  it('LEADER 显示团长', () => {
    expect(levelBadge('LEADER')).toContain('团长');
  });

  it('支持全部 D1-D5 身份名称', () => {
    expect(levelBadge('D1')).toContain('D1 · 创始人');
    expect(levelBadge('D3')).toContain('D3 · 事业合伙人');
    expect(levelBadge('D4')).toContain('D4 · 分公司负责人');
    expect(levelBadge('D5')).toContain('D5 · 分公司合伙人');
  });

  it('包含等级徽章', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('class="mbr-level"');
  });

  it('包含复制按钮且 data-copy 为昵称', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('class="mbr-copy-btn"');
    expect(html).toContain('data-copy="屋顶小仙女"');
    expect(html).toContain('>复制</span>');
  });

  it('包含行为描述（传入的 action）', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('扫描我的推广码');
    expect(html).toContain('16:14');
  });

  it('action 缺省时回退到成员自身 action', () => {
    const m = { ...member, action: '自定义动作' };
    const html = memberRowHtml(m);
    expect(html).toContain('自定义动作');
  });

  it('包含下级用户数', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('下级用户：128人');
  });

  it('包含尾部箭头', () => {
    const html = memberRowHtml(member, '扫描我的推广码');
    expect(html).toContain('class="mbr-go">›</span>');
  });

  it('无等级时不渲染等级徽章', () => {
    const m = { ...member, level: '' };
    const html = memberRowHtml(m, '扫描我的推广码');
    expect(html).not.toContain('mbr-level');
  });
});

describe('filterMembersByScope', () => {
  const members = [
    { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },
    { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }
  ];

  it('scope 为 全部 返回全部成员', () => {
    const result = filterMembersByScope(members, '全部');
    expect(result).toHaveLength(10);
  });

  it('scope 为空 返回全部成员', () => {
    const result = filterMembersByScope(members, '');
    expect(result).toHaveLength(10);
  });

  it('scope 为 undefined 返回全部成员', () => {
    const result = filterMembersByScope(members);
    expect(result).toHaveLength(10);
  });

  it('scope 为 直推 返回前 60%', () => {
    const result = filterMembersByScope(members, '直推');
    expect(result).toHaveLength(6); // ceil(10 * 0.6) = 6
    expect(result[0].name).toBe('A');
    expect(result[5].name).toBe('F');
  });

  it('scope 为 团队 返回前 40%', () => {
    const result = filterMembersByScope(members, '团队');
    expect(result).toHaveLength(4); // ceil(10 * 0.4) = 4
  });

  it('scope 为 推荐 返回前 30%', () => {
    const result = filterMembersByScope(members, '推荐');
    expect(result).toHaveLength(3); // ceil(10 * 0.3) = 3
  });

  it('不修改原数组', () => {
    const copy = members.slice();
    filterMembersByScope(members, '直推');
    expect(members).toEqual(copy);
  });

  it('至少返回 1 个成员（即使比例算出 0）', () => {
    const single = [{ name: 'A' }];
    const result = filterMembersByScope(single, '推荐');
    expect(result).toHaveLength(1);
  });
});

describe('filterMembersByKeyword', () => {
  const members = [
    { name: '屋顶小仙女', wechat: 'Melody-yoo' },
    { name: '周末', wechat: 'zhoumo-88' },
    { name: '金小叼', wechat: 'jindiao' }
  ];

  it('空关键词返回全部', () => {
    const result = filterMembersByKeyword(members, '');
    expect(result).toHaveLength(3);
  });

  it('undefined 关键词返回全部', () => {
    const result = filterMembersByKeyword(members);
    expect(result).toHaveLength(3);
  });

  it('按 name 匹配', () => {
    const result = filterMembersByKeyword(members, '周末');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('周末');
  });

  it('按 wechat 匹配', () => {
    const result = filterMembersByKeyword(members, 'jindiao');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('金小叼');
  });

  it('部分匹配 name', () => {
    const result = filterMembersByKeyword(members, '小');
    expect(result).toHaveLength(2); // 屋顶小仙女、金小叼
  });

  it('无匹配返回空数组', () => {
    const result = filterMembersByKeyword(members, '不存在');
    expect(result).toHaveLength(0);
  });

  it('不修改原数组', () => {
    const copy = members.slice();
    filterMembersByKeyword(members, '周末');
    expect(members).toEqual(copy);
  });
});

describe('getRelationTabs', () => {
  it('生成 4 个 tab', () => {
    const tabs = getRelationTabs('新增VIP');
    expect(tabs).toHaveLength(4);
  });

  it('第一个为 全部', () => {
    const tabs = getRelationTabs('新增VIP');
    expect(tabs[0]).toBe('全部');
  });

  it('其余 tab 拼接 poolLabel', () => {
    const tabs = getRelationTabs('新增VIP');
    expect(tabs[1]).toBe('直属新增VIP');
    expect(tabs[2]).toBe('间接新增VIP');
    expect(tabs[3]).toBe('其他新增VIP');
  });

  it('空 label 也能生成', () => {
    const tabs = getRelationTabs('');
    expect(tabs).toEqual(['全部', '直属', '间接', '其他']);
  });
});

describe('TEAM_MEMBER_POOL 数据完整性', () => {
  it('follow 数据池有 8 个成员', () => {
    expect(TEAM_MEMBER_POOL.follow.members).toHaveLength(8);
  });

  it('scan 数据池有 6 个成员', () => {
    expect(TEAM_MEMBER_POOL.scan.members).toHaveLength(6);
  });

  it('experience 数据池有 5 个成员', () => {
    expect(TEAM_MEMBER_POOL.experience.members).toHaveLength(5);
  });

  it('vip 数据池有 5 个成员', () => {
    expect(TEAM_MEMBER_POOL.vip.members).toHaveLength(5);
  });

  it('agent 数据池有 3 个成员', () => {
    expect(TEAM_MEMBER_POOL.agent.members).toHaveLength(3);
  });

  it('community 数据池有 3 个成员', () => {
    expect(TEAM_MEMBER_POOL.community.members).toHaveLength(3);
  });

  it('每个成员包含必要字段', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      pool.members.forEach((m) => {
        expect(m).toHaveProperty('name');
        expect(m).toHaveProperty('phone');
        expect(m).toHaveProperty('wechat');
        expect(m).toHaveProperty('region');
        expect(m).toHaveProperty('date');
        expect(m).toHaveProperty('amount');
        expect(m).toHaveProperty('skin');
        expect(m).toHaveProperty('level');
        expect(m).toHaveProperty('subCount');
        expect(typeof m.subCount).toBe('number');
      });
    });
  });

  it('每个数据池有非空 label', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      expect(pool.label.length).toBeGreaterThan(0);
    });
  });

  it('每个数据池有非空 actions', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      expect(pool.actions.length).toBeGreaterThan(0);
      pool.actions.forEach((a) => expect(typeof a).toBe('string'));
    });
  });
});

// ===== 以下为补充用例：边界场景、全量映射、数据完整性 =====

describe('esc（补充）', () => {
  it('boolean true 转为 "true"', () => {
    expect(esc(true)).toBe('true');
  });

  it('boolean false 转为 "false"', () => {
    expect(esc(false)).toBe('false');
  });

  it('空字符串返回空字符串', () => {
    expect(esc('')).toBe('');
  });

  it('对象转为 "[object Object]"', () => {
    expect(esc({ a: 1 })).toBe('[object Object]');
  });

  it('数组转为逗号拼接字符串', () => {
    expect(esc([1, 2, 3])).toBe('1,2,3');
  });

  it('返回值类型始终为 string', () => {
    expect(typeof esc(0)).toBe('string');
    expect(typeof esc(null)).toBe('string');
  });
});

describe('levelBadge（补充）', () => {
  it('数字 0 视为空返回空字符串', () => {
    expect(levelBadge(0)).toBe('');
  });

  it('false 视为空返回空字符串', () => {
    expect(levelBadge(false)).toBe('');
  });

  it('纯空白字符串不视为空，走默认橙色分支', () => {
    // '   ' 是 truthy，indexOf('SV')/('V.3') 均为 -1，命中默认橙色
    const html = levelBadge('   ');
    expect(html).toContain('#F7B65C');
    expect(html).toContain('   ');
  });

  it('V.2 不属于 V.3，走默认橙色', () => {
    const html = levelBadge('V.2');
    expect(html).toContain('#F7B65C');
  });

  it('V.3.1 以 V.3 开头，走蓝色', () => {
    const html = levelBadge('V.3.1');
    expect(html).toContain('#5B8DEF');
  });

  it('单独 "V" 走默认橙色', () => {
    const html = levelBadge('V');
    expect(html).toContain('#F7B65C');
  });

  it('单独 "SV" 走紫色', () => {
    const html = levelBadge('SV');
    expect(html).toContain('#6D5BD0');
  });

  it('SV.1 走紫色且包含等级文本', () => {
    const html = levelBadge('SV.1');
    expect(html).toContain('#6D5BD0');
    expect(html).toContain('SV.1');
  });

  it('返回完整 span 结构：开始标签、style、文本、结束标签', () => {
    const html = levelBadge('V.3');
    expect(html).toBe('<span class="mbr-level" style="background:#5B8DEF">V.3</span>');
  });

  it('level 为数字 1 时（非空），走默认橙色', () => {
    const html = levelBadge(1);
    expect(html).toContain('#F7B65C');
    expect(html).toContain('1');
  });
});

describe('getMemberPool（补充）', () => {
  it('空字符串指标兜底到 follow', () => {
    expect(getMemberPool('')).toBe(TEAM_MEMBER_POOL.follow);
  });

  it('undefined 指标兜底到 follow', () => {
    expect(getMemberPool(undefined)).toBe(TEAM_MEMBER_POOL.follow);
  });

  it('null 指标兜底到 follow', () => {
    expect(getMemberPool(null)).toBe(TEAM_MEMBER_POOL.follow);
  });

  it('METRIC_POOL_MAP 全量键均能正确映射', () => {
    const expected = {
      '市级代理': 'agent', '区县代理': 'agent', '直属团长': 'agent', '意向代理': 'agent',
      '社群数': 'community', '引流学员': 'follow', '年卡会员': 'vip', '高级会员': 'vip',
      '旗舰会员': 'vip', '推荐团长': 'agent', '其社群数': 'community', '社群成员': 'follow',
      '本周新增': 'follow', '活跃成员': 'follow', '新增会员': 'vip', '待跟进': 'experience'
    };
    Object.entries(expected).forEach(([metric, key]) => {
      expect(getMemberPool(metric)).toBe(TEAM_MEMBER_POOL[key]);
    });
  });

  it('FUNNEL_POOL_MAP 全量键均能正确映射', () => {
    const expected = {
      '新增关注': 'follow', '扫码': 'scan', '引流学员': 'follow', '体验': 'experience',
      '正价课': 'vip', '新代理': 'agent', '新团长': 'agent', '新增会员': 'vip',
      '活跃成员': 'follow', '待跟进': 'experience', '待初审': 'agent', '复审中': 'agent',
      '已通过': 'agent', '发展代理': 'agent', '发展团长': 'agent', '聚合社群': 'community',
      '我推荐的人': 'follow', '已发展团长': 'agent', '可查看社群': 'community',
      '引流收入': 'follow', '会员招募': 'vip', '会员升级': 'vip', '社群消费': 'vip'
    };
    Object.entries(expected).forEach(([metric, key]) => {
      expect(getMemberPool(metric)).toBe(TEAM_MEMBER_POOL[key]);
    });
  });

  it('METRIC_POOL_MAP 与 FUNNEL_POOL_MAP 共有键结果一致', () => {
    // 引流学员、新增会员、活跃成员、待跟进 同时在两张表中
    ['引流学员', '新增会员', '活跃成员', '待跟进'].forEach((k) => {
      expect(METRIC_POOL_MAP[k]).toBe(FUNNEL_POOL_MAP[k]);
    });
  });

  it('相同指标多次调用返回同一对象引用', () => {
    const a = getMemberPool('直属团长');
    const b = getMemberPool('直属团长');
    expect(a).toBe(b);
  });

  it('每个数据池的 label 值符合预期', () => {
    expect(TEAM_MEMBER_POOL.follow.label).toBe('新增关注');
    expect(TEAM_MEMBER_POOL.scan.label).toBe('新增扫码');
    expect(TEAM_MEMBER_POOL.experience.label).toBe('新增体验');
    expect(TEAM_MEMBER_POOL.vip.label).toBe('新增VIP');
    expect(TEAM_MEMBER_POOL.agent.label).toBe('新增代理');
    expect(TEAM_MEMBER_POOL.community.label).toBe('社群列表');
  });
});

describe('memberRowHtml（补充）', () => {
  const base = {
    name: '屋顶小仙女',
    level: 'V.1',
    subCount: 128
  };

  it('包含全部预期的 class 名', () => {
    const html = memberRowHtml(base, '扫描我的推广码');
    ['mbr-row', 'mbr-avatar', 'mbr-copy', 'mbr-name-line', 'mbr-name',
     'mbr-copy-btn', 'mbr-action', 'mbr-sub', 'mbr-go'].forEach((cls) => {
      expect(html).toContain(cls);
    });
  });

  it('action 参数与 m.action 均缺省时，行为描述仅显示时间', () => {
    const html = memberRowHtml(base);
    expect(html).toContain('16:14 ');
  });

  it('subCount 为 0 时显示 "下级用户：0人"', () => {
    const html = memberRowHtml({ ...base, subCount: 0 }, '扫描');
    expect(html).toContain('下级用户：0人');
  });

  it('单字符昵称时仍使用真人头像图片', () => {
    const html = memberRowHtml({ ...base, name: '王' }, '扫描');
    expect(html).toContain('<img class="mbr-avatar"');
    expect(html).toContain('../assets/avatars/avatar-01.jpg');
  });

  it('昵称含特殊字符时原样输出（esc 不做 HTML 转义）', () => {
    const html = memberRowHtml({ ...base, name: 'A<B' }, '扫描');
    expect(html).toContain('data-team-member="A<B"');
  });

  it('data-team-member 与 data-copy 属性值一致（均为昵称）', () => {
    const html = memberRowHtml(base, '扫描');
    expect(html).toContain('data-team-member="屋顶小仙女"');
    expect(html).toContain('data-copy="屋顶小仙女"');
  });

  it('member 自身有 action 但未传参时使用 m.action', () => {
    const m = { ...base, action: '成员自带动作' };
    const html = memberRowHtml(m);
    expect(html).toContain('成员自带动作');
  });

  it('传参 action 优先于 m.action', () => {
    const m = { ...base, action: '成员自带动作' };
    const html = memberRowHtml(m, '传入动作');
    expect(html).toContain('传入动作');
    expect(html).not.toContain('成员自带动作');
  });

  it('time 固定为 16:14', () => {
    const html = memberRowHtml(base, '扫描');
    expect(html).toContain('16:14');
  });
});

describe('filterMembersByScope（补充）', () => {
  const members = [
    { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }
  ];

  it('空数组成员在任何 scope 下都返回空数组', () => {
    expect(filterMembersByScope([], '全部')).toEqual([]);
    expect(filterMembersByScope([], '直推')).toEqual([]);
    expect(filterMembersByScope([], '推荐')).toEqual([]);
  });

  it('单成员数组：直推/团队/推荐均返回 1 个', () => {
    const single = [{ name: 'A' }];
    expect(filterMembersByScope(single, '直推')).toHaveLength(1);
    expect(filterMembersByScope(single, '团队')).toHaveLength(1);
    expect(filterMembersByScope(single, '推荐')).toHaveLength(1);
  });

  it('2 个成员：直推 ceil(2*0.6)=2，推荐 ceil(2*0.3)=1', () => {
    const two = [{ name: 'A' }, { name: 'B' }];
    expect(filterMembersByScope(two, '直推')).toHaveLength(2);
    expect(filterMembersByScope(two, '推荐')).toHaveLength(1);
  });

  it('未知 scope 走默认比例 0.3', () => {
    // '其他' 不在判断中，走 else 分支 ratio=0.3
    const result = filterMembersByScope(members, '其他');
    expect(result).toHaveLength(2); // ceil(5 * 0.3) = ceil(1.5) = 2
  });

  it('返回的是新数组引用，不与原数组相同', () => {
    const result = filterMembersByScope(members, '全部');
    expect(result).not.toBe(members);
  });

  it('scope 为 null 返回全部', () => {
    expect(filterMembersByScope(members, null)).toHaveLength(5);
  });

  it('直推返回前 N 个且顺序不变', () => {
    const result = filterMembersByScope(members, '直推');
    expect(result.map((m) => m.name)).toEqual(['A', 'B', 'C']); // ceil(5*0.6)=3
  });
});

describe('filterMembersByKeyword（补充）', () => {
  const members = [
    { name: '屋顶小仙女', wechat: 'Melody-yoo' },
    { name: '周末', wechat: 'zhoumo-88' },
    { name: '金小叼', wechat: 'jindiao' }
  ];

  it('仅含空白的关键词被 trim 为空，返回全部', () => {
    const result = filterMembersByKeyword(members, '   ');
    expect(result).toHaveLength(3);
  });

  it('关键词前后空白被 trim 后匹配', () => {
    const result = filterMembersByKeyword(members, '  周末  ');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('周末');
  });

  it('成员无 wechat 属性时不崩溃，仅按 name 匹配', () => {
    const list = [{ name: 'A' }, { name: 'B' }];
    const result = filterMembersByKeyword(list, 'A');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('A');
  });

  it('空成员数组返回空数组', () => {
    expect(filterMembersByKeyword([], '关键词')).toEqual([]);
    expect(filterMembersByKeyword([], '')).toEqual([]);
  });

  it('返回新数组引用', () => {
    const result = filterMembersByKeyword(members, '');
    expect(result).not.toBe(members);
  });

  it('匹配区分大小写（indexOf 原生行为）', () => {
    const result = filterMembersByKeyword(members, 'JINDIAO');
    expect(result).toHaveLength(0); // wechat 是 jindiao，大写不匹配
  });

  it('关键词出现在 name 中间也能匹配', () => {
    const result = filterMembersByKeyword(members, '仙女');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('屋顶小仙女');
  });

  it('关键词出现在 wechat 中间也能匹配', () => {
    const result = filterMembersByKeyword(members, 'yoo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('屋顶小仙女');
  });
});

describe('getRelationTabs（补充）', () => {
  it('undefined label 生成 "直属undefined" 等', () => {
    const tabs = getRelationTabs(undefined);
    expect(tabs).toEqual(['全部', '直属undefined', '间接undefined', '其他undefined']);
  });

  it('null label 生成 "直属null" 等', () => {
    const tabs = getRelationTabs(null);
    expect(tabs).toEqual(['全部', '直属null', '间接null', '其他null']);
  });

  it('数字 label 被字符串拼接', () => {
    const tabs = getRelationTabs(123);
    expect(tabs[1]).toBe('直属123');
  });

  it('每次调用返回新数组', () => {
    const a = getRelationTabs('X');
    const b = getRelationTabs('X');
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });
});

describe('TEAM_MEMBER_POOL 数据完整性（补充）', () => {
  it('所有成员的 level 均为合法值（空串或 V.1/V.3/SV.1/SV.3）', () => {
    const valid = ['', 'V.1', 'V.3', 'SV.1', 'SV.3'];
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      pool.members.forEach((m) => {
        expect(valid).toContain(m.level);
      });
    });
  });

  it('所有成员 subCount 为非负整数', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      pool.members.forEach((m) => {
        expect(Number.isInteger(m.subCount)).toBe(true);
        expect(m.subCount).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('community 数据池成员的 phone 和 wechat 均为 "-"', () => {
    TEAM_MEMBER_POOL.community.members.forEach((m) => {
      expect(m.phone).toBe('-');
      expect(m.wechat).toBe('-');
    });
  });

  it('同一数据池内成员昵称不重复', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      const names = pool.members.map((m) => m.name);
      expect(new Set(names).size).toBe(names.length);
    });
  });

  it('agent 数据池成员等级均非空（代理应有等级）', () => {
    TEAM_MEMBER_POOL.agent.members.forEach((m) => {
      expect(m.level).not.toBe('');
    });
  });

  it('experience 数据池成员等级均为空（体验用户无等级）', () => {
    TEAM_MEMBER_POOL.experience.members.forEach((m) => {
      expect(m.level).toBe('');
    });
  });

  it('所有成员 amount 以 "¥" 开头（除社群为 ¥ 外）', () => {
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      pool.members.forEach((m) => {
        expect(m.amount.startsWith('¥')).toBe(true);
      });
    });
  });

  it('所有成员 date 符合 YYYY-MM-DD 格式', () => {
    const dateReg = /^\d{4}-\d{2}-\d{2}$/;
    Object.values(TEAM_MEMBER_POOL).forEach((pool) => {
      pool.members.forEach((m) => {
        expect(m.date).toMatch(dateReg);
      });
    });
  });

  it('METRIC_POOL_MAP 键数量为 16', () => {
    expect(Object.keys(METRIC_POOL_MAP)).toHaveLength(16);
  });

  it('FUNNEL_POOL_MAP 键数量为 23', () => {
    expect(Object.keys(FUNNEL_POOL_MAP)).toHaveLength(23);
  });

  it('导出 api 包含全部预期方法与数据', () => {
    const api = {
      esc, levelBadge, getMemberPool, memberRowHtml,
      filterMembersByScope, filterMembersByKeyword, getRelationTabs,
      TEAM_MEMBER_POOL, METRIC_POOL_MAP, FUNNEL_POOL_MAP
    };
    ['esc', 'levelBadge', 'getMemberPool', 'memberRowHtml',
     'filterMembersByScope', 'filterMembersByKeyword', 'getRelationTabs',
     'TEAM_MEMBER_POOL', 'METRIC_POOL_MAP', 'FUNNEL_POOL_MAP'].forEach((k) => {
      expect(api[k]).toBeDefined();
    });
  });
});
