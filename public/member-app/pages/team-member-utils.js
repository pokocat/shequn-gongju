/**
 * 团队成员列表 / 详情页 核心纯函数与数据
 *
 * 从 tasks.html 提取，便于单元测试。
 * - 浏览器环境：直接挂到全局（window.*），供 tasks.html 内联脚本调用
 * - Node/Vitest 环境：通过 module.exports 导出，供测试 require
 */
(function (root) {
  // 成员数据池：按指标类型分组，每组内含不同关系范围的成员
  var TEAM_MEMBER_POOL = {
    follow: { // 新增关注 / 引流学员
      label: '新增关注', actions: ['扫描我的推广码', '扫描我的商品推广码', '通过点击任意链接'],
      members: [
        { name: '屋顶小仙女', phone: '18705817856', wechat: 'Melody-yoo', region: '浙江-湖州', date: '2017-03-28', amount: '¥1789', skin: '轻油|重敏|非色素|紧致', level: 'V.1', subCount: 128 },
        { name: '周末', phone: '18612345678', wechat: 'zhoumo-88', region: '上海-浦东', date: '2018-06-15', amount: '¥968', skin: '中性|轻敏|色素|紧致', level: 'V.3', subCount: 128 },
        { name: '金小叼', phone: '13900001111', wechat: 'jindiao', region: '北京-朝阳', date: '2019-01-08', amount: '¥2,340', skin: '混油|耐受|色素|松弛', level: 'V.3', subCount: 120 },
        { name: '蜂乐玛主理官大发', phone: '13700002222', wechat: 'dafa-mall', region: '广东-深圳', date: '2020-11-20', amount: '¥5,680', skin: '油性|耐受|非色素|紧致', level: '', subCount: 28 },
        { name: '大神很忙表示一点也不…', phone: '13500003333', wechat: 'busy-god', region: '四川-成都', date: '2021-04-03', amount: '¥1,120', skin: '干性|轻敏|色素|紧致', level: 'V.3', subCount: 107 },
        { name: '吾の姿态', phone: '13400004444', wechat: 'my-pose', region: '江苏-南京', date: '2021-09-12', amount: '¥780', skin: '中性|耐受|非色素|紧致', level: '', subCount: 29 },
        { name: 'ONE MORE', phone: '13300005555', wechat: 'one-more', region: '浙江-杭州', date: '2022-02-18', amount: '¥1,560', skin: '混干|轻敏|色素|松弛', level: 'SV.3', subCount: 45 },
        { name: '欧米提', phone: '13200006666', wechat: 'omiti', region: '湖北-武汉', date: '2022-07-30', amount: '¥2,100', skin: '油性|重敏|非色素|紧致', level: 'SV.3', subCount: 78 }
      ]
    },
    scan: { // 新增扫码
      label: '新增扫码', actions: ['扫描我的推广码', '扫描我的商品推广码'],
      members: [
        { name: '屋顶小仙女', phone: '18705817856', wechat: 'Melody-yoo', region: '浙江-湖州', date: '2017-03-28', amount: '¥1789', skin: '轻油|重敏|非色素|紧致', level: 'V.1', subCount: 128 },
        { name: '周末', phone: '18612345678', wechat: 'zhoumo-88', region: '上海-浦东', date: '2018-06-15', amount: '¥968', skin: '中性|轻敏|色素|紧致', level: 'V.3', subCount: 128 },
        { name: '金小叼', phone: '13900001111', wechat: 'jindiao', region: '北京-朝阳', date: '2019-01-08', amount: '¥2,340', skin: '混油|耐受|色素|松弛', level: 'V.3', subCount: 120 },
        { name: '吾の姿态', phone: '13400004444', wechat: 'my-pose', region: '江苏-南京', date: '2021-09-12', amount: '¥780', skin: '中性|耐受|非色素|紧致', level: '', subCount: 29 },
        { name: 'ONE MORE', phone: '13300005555', wechat: 'one-more', region: '浙江-杭州', date: '2022-02-18', amount: '¥1,560', skin: '混干|轻敏|色素|松弛', level: 'SV.3', subCount: 45 },
        { name: '欧米提', phone: '13200006666', wechat: 'omiti', region: '湖北-武汉', date: '2022-07-30', amount: '¥2,100', skin: '油性|重敏|非色素|紧致', level: 'SV.3', subCount: 78 }
      ]
    },
    experience: { // 新增体验
      label: '新增体验', actions: ['购买了【9.9全国包邮】新人体验包'],
      members: [
        { name: '屋顶小仙女', phone: '18705817856', wechat: 'Melody-yoo', region: '浙江-湖州', date: '2017-03-28', amount: '¥1789', skin: '轻油|重敏|非色素|紧致', level: '', subCount: 128 },
        { name: '周末', phone: '18612345678', wechat: 'zhoumo-88', region: '上海-浦东', date: '2018-06-15', amount: '¥968', skin: '中性|轻敏|色素|紧致', level: '', subCount: 128 },
        { name: '金小叼', phone: '13900001111', wechat: 'jindiao', region: '北京-朝阳', date: '2019-01-08', amount: '¥2,340', skin: '混油|耐受|色素|松弛', level: '', subCount: 120 },
        { name: '蜂乐玛主理官大发', phone: '13700002222', wechat: 'dafa-mall', region: '广东-深圳', date: '2020-11-20', amount: '¥5,680', skin: '油性|耐受|非色素|紧致', level: '', subCount: 28 },
        { name: '大神很忙表示一点也不…', phone: '13500003333', wechat: 'busy-god', region: '四川-成都', date: '2021-04-03', amount: '¥1,120', skin: '干性|轻敏|色素|紧致', level: '', subCount: 107 }
      ]
    },
    vip: { // 新增VIP / 年卡会员
      label: '新增VIP', actions: ['购买升级产品 Se-Golden喝出完美容…', '颜值满5000升级V5成为尊享官'],
      members: [
        { name: '屋顶小仙女', phone: '18705817856', wechat: 'Melody-yoo', region: '浙江-湖州', date: '2017-03-28', amount: '¥1789', skin: '轻油|重敏|非色素|紧致', level: 'SV.1', subCount: 128 },
        { name: '周末', phone: '18612345678', wechat: 'zhoumo-88', region: '上海-浦东', date: '2018-06-15', amount: '¥968', skin: '中性|轻敏|色素|紧致', level: 'SV.1', subCount: 128 },
        { name: '金小叼', phone: '13900001111', wechat: 'jindiao', region: '北京-朝阳', date: '2019-01-08', amount: '¥2,340', skin: '混油|耐受|色素|松弛', level: 'SV.1', subCount: 57 },
        { name: '蜂乐玛主理官大发', phone: '13700002222', wechat: 'dafa-mall', region: '广东-深圳', date: '2020-11-20', amount: '¥5,680', skin: '油性|耐受|非色素|紧致', level: '', subCount: 28 },
        { name: '大神很忙表示一点也不…', phone: '13500003333', wechat: 'busy-god', region: '四川-成都', date: '2021-04-03', amount: '¥1,120', skin: '干性|轻敏|色素|紧致', level: '', subCount: 107 }
      ]
    },
    agent: { // 代理 / 团长
      label: '新增代理', actions: ['提交团长申请并通过初审', '完成代理入驻认证'],
      members: [
        { name: '王敏', phone: '18800000001', wechat: 'wangmin-hz', region: '浙江-杭州', date: '2020-03-15', amount: '¥12,800', skin: '中性|耐受|非色素|紧致', level: 'SV.3', subCount: 86 },
        { name: '李芳', phone: '18800000002', wechat: 'lifang-zh', region: '上海-徐汇', date: '2020-07-22', amount: '¥9,600', skin: '干性|轻敏|色素|紧致', level: 'V.3', subCount: 64 },
        { name: '周舟', phone: '18800000003', wechat: 'zhouzhou-qz', region: '浙江-宁波', date: '2021-01-10', amount: '¥6,400', skin: '混油|耐受|色素|松弛', level: 'V.1', subCount: 52 }
      ]
    },
    community: { // 社群数
      label: '社群列表', actions: ['创建并运营社群'],
      members: [
        { name: '杭州妈妈成长群', phone: '-', wechat: '-', region: '浙江-杭州', date: '2020-03-15', amount: '¥12,800', skin: '-', level: '', subCount: 46 },
        { name: '职场成长社群', phone: '-', wechat: '-', region: '上海-徐汇', date: '2020-07-22', amount: '¥9,600', skin: '-', level: '', subCount: 42 },
        { name: '亲子阅读群', phone: '-', wechat: '-', region: '浙江-宁波', date: '2021-01-10', amount: '¥6,400', skin: '-', level: '', subCount: 38 }
      ]
    }
  };

  // 成员昵称 → 真人头像文件名映射（头像放在 ../assets/avatars/ 下）
  var NAME_AVATAR_MAP = {
    '屋顶小仙女': 'avatar-01.jpg',
    '周末': 'avatar-02.jpg',
    '金小叼': 'avatar-03.jpg',
    '蜂乐玛主理官大发': 'avatar-04.jpg',
    '大神很忙表示一点也不…': 'avatar-05.jpg',
    '吾の姿态': 'avatar-06.jpg',
    'ONE MORE': 'avatar-07.jpg',
    '欧米提': 'avatar-08.jpg',
    '王敏': 'avatar-09.jpg',
    '李芳': 'avatar-10.jpg',
    '周舟': 'avatar-11.jpg',
    '杭州妈妈成长群': 'avatar-12.jpg',
    '职场成长社群': 'avatar-01.jpg',
    '亲子阅读群': 'avatar-02.jpg'
  };

  function avatarFor(name) {
    var file = NAME_AVATAR_MAP[name] || 'avatar-01.jpg';
    return '../assets/avatars/' + file;
  }

  // 指标名称 → 数据池 key 的映射
  var METRIC_POOL_MAP = {
    '市级代理': 'agent', '区县代理': 'agent', '直属团长': 'agent', '意向代理': 'agent',
    '社群数': 'community', '引流学员': 'follow', '年卡会员': 'vip', '高级会员': 'vip', '旗舰会员': 'vip',
    '推荐团长': 'agent', '其社群数': 'community', '社群成员': 'follow', '本周新增': 'follow',
    '活跃成员': 'follow', '新增会员': 'vip', '待跟进': 'experience'
  };

  var FUNNEL_POOL_MAP = {
    '新增关注': 'follow', '扫码': 'scan', '引流学员': 'follow', '体验': 'experience',
    '正价课': 'vip', '新代理': 'agent', '新团长': 'agent', '新增会员': 'vip',
    '活跃成员': 'follow', '待跟进': 'experience', '待初审': 'agent', '复审中': 'agent', '已通过': 'agent',
    '发展代理': 'agent', '发展团长': 'agent', '聚合社群': 'community',
    '我推荐的人': 'follow', '已发展团长': 'agent', '可查看社群': 'community',
    '引流收入': 'follow', '会员招募': 'vip', '会员升级': 'vip', '社群消费': 'vip'
  };

  function esc(s) { return String(s); }

  // 等级徽章样式
  function levelBadge(level) {
    if (!level) return '';
    var lv = String(level);
    var identityLabels = {
      D1: 'D1 · 创始人',
      D2: 'D2 · 核心合伙人',
      D3: 'D3 · 事业合伙人',
      D4: 'D4 · 分公司负责人',
      D5: 'D5 · 分公司合伙人',
      LEADER: '团长'
    };
    var display = identityLabels[lv] || lv;
    var color = lv === 'LEADER' ? '#9CA3AF' : (identityLabels[lv] ? '#4C9B8A' : (lv.indexOf('SV') === 0 ? '#6D5BD0' : (lv.indexOf('V.3') === 0 ? '#5B8DEF' : '#F7B65C')));
    return '<span class="mbr-level" style="background:' + color + '">' + esc(display) + '</span>';
  }

  function getMemberPool(metric) {
    var key = METRIC_POOL_MAP[metric] || FUNNEL_POOL_MAP[metric] || 'follow';
    return TEAM_MEMBER_POOL[key] || TEAM_MEMBER_POOL.follow;
  }

  // 成员行（新增成员列表页用）
  function memberRowHtml(m, action) {
    var time = '16:14';
    return '<div class="mbr-row" data-team-member="' + esc(m.name) + '" role="button">' +
      '<img class="mbr-avatar" src="' + avatarFor(m.name) + '" alt="">' +
      '<span class="mbr-copy">' +
        '<span class="mbr-name-line">' + levelBadge(m.level) + '<span class="mbr-name">' + esc(m.name) + '</span><span class="mbr-copy-btn" data-copy="' + esc(m.name) + '" role="button">复制</span></span>' +
        '<span class="mbr-action">' + time + ' ' + esc(action || m.action || '') + '</span>' +
        '<span class="mbr-sub">下级用户：' + m.subCount + '人</span>' +
      '</span>' +
      '<span class="mbr-go">›</span>' +
    '</div>';
  }

  // 按关系范围过滤成员（模拟直推/团队/推荐切片）
  function filterMembersByScope(members, scope) {
    if (scope === '全部' || !scope) return members.slice();
    var ratio = scope === '直推' ? 0.6 : (scope === '团队' ? 0.4 : 0.3);
    return members.slice(0, Math.max(1, Math.ceil(members.length * ratio)));
  }

  // 按关键词过滤成员（匹配 name / wechat）
  function filterMembersByKeyword(members, keyword) {
    var kw = (keyword || '').trim();
    if (!kw) return members.slice();
    return members.filter(function (m) {
      return m.name.indexOf(kw) > -1 || (m.wechat && m.wechat.indexOf(kw) > -1);
    });
  }

  // 计算关系类型 Tab 名称
  function getRelationTabs(poolLabel) {
    return ['全部', '直属' + poolLabel, '间接' + poolLabel, '其他' + poolLabel];
  }

  var api = {
    TEAM_MEMBER_POOL: TEAM_MEMBER_POOL,
    NAME_AVATAR_MAP: NAME_AVATAR_MAP,
    METRIC_POOL_MAP: METRIC_POOL_MAP,
    FUNNEL_POOL_MAP: FUNNEL_POOL_MAP,
    esc: esc,
    levelBadge: levelBadge,
    avatarFor: avatarFor,
    getMemberPool: getMemberPool,
    memberRowHtml: memberRowHtml,
    filterMembersByScope: filterMembersByScope,
    filterMembersByKeyword: filterMembersByKeyword,
    getRelationTabs: getRelationTabs
  };

  // 浏览器：挂到全局供 tasks.html 使用
  root.TEAM_MEMBER_POOL = TEAM_MEMBER_POOL;
  root.NAME_AVATAR_MAP = NAME_AVATAR_MAP;
  root.METRIC_POOL_MAP = METRIC_POOL_MAP;
  root.FUNNEL_POOL_MAP = FUNNEL_POOL_MAP;
  root.esc = esc;
  root.levelBadge = levelBadge;
  root.avatarFor = avatarFor;
  root.getMemberPool = getMemberPool;
  root.memberRowHtml = memberRowHtml;
  root.filterMembersByScope = filterMembersByScope;
  root.filterMembersByKeyword = filterMembersByKeyword;
  root.getRelationTabs = getRelationTabs;

  // Node / Vitest：导出
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
