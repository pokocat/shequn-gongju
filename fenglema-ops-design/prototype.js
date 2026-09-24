const pcPages = [
  {
    id: "overview",
    title: "PC 后台总览",
    kicker: "运营总览",
    hero: ["蜂乐玛私域运营中台", "把手机号、邮箱、微信、微信群、会员、收益和客服工单统一到一个操作台。", "OPS"],
    metrics: [
      ["账号资产", "3,286", "微信 538 / 手机号 1,246", "up"],
      ["活跃社群", "186", "今日新增 12 个群成员", "up"],
      ["待分配用户", "64", "新会员 42 人待进群", "warn"],
      ["高风险事项", "11", "退款、离职交接、满群预警", "bad"],
    ],
    filters: ["今日", "华东大区", "全部项目", "高优先级"],
    tableTitle: "今日运营待办",
    columns: ["类型", "对象", "状态", "负责人", "操作"],
    rows: [
      ["账号交接", "微信 FLM088 离职待归还", "高风险", "林老师", "发起交接"],
      ["群分配", "22 名 PRO 会员待分群", "待处理", "王璐琪", "智能分配"],
      ["微信领用", "FLM102 申请用于杭州项目", "待审批", "Shirley", "审批"],
      ["工单", "入群二维码过期 12 条", "处理中", "陈一凡", "跟进"],
      ["退款", "重复购买退款 7 笔", "需复核", "财务组", "复核"],
    ],
    sideTitle: "AI 运营建议",
    sideItems: ["优先处理 FLM088 账号交接，已关联 8 个服务群。", "华东体验官群容量平均 86%，建议新增 2 个备用群。", "最近 7 天入群异常集中在二维码过期，可批量刷新群码。"],
    board: [
      ["账号清点", "426 个微信已领用", "需补充 18 个保管人"],
      ["服务资源", "38 名服务官在线", "杭州、深圳资源偏紧"],
      ["财务风险", "¥12,560 退款待审", "7 笔需人工复核"],
    ],
  },
  {
    id: "accounts",
    title: "账号资产中心",
    kicker: "资产台账",
    hero: ["账号资产与注册关系", "手机号、邮箱、微信、媒体账号、注册平台、项目领用、保管人和风险状态一张表。", "ID"],
    metrics: [
      ["手机号", "1,246", "可用 986 个", "up"],
      ["邮箱", "682", "绑定平台 428 个", "up"],
      ["微信号", "538", "已领用 426 个", "warn"],
      ["媒体账号", "124", "抖音/小红书/视频号", "up"],
    ],
    filters: ["全部资产", "已领用", "待交接", "风险账号"],
    tableTitle: "资产列表",
    columns: ["资产类型", "账号标识", "注册/绑定", "领用项目", "保管人"],
    rows: [
      ["手机号", "138****8888", "注册微信 FLM001", "华东增长班", "林老师"],
      ["邮箱", "ops01@flm.cn", "公众号 / 小程序后台", "活动触达", "运营部"],
      ["微信", "FLM088", "服务 8 个群", "体验官项目", "王璐琪"],
      ["小红书", "蜂乐玛成长社", "内容种草", "公域引流", "内容组"],
      ["视频号", "蜂乐玛会员服务", "直播 / 私信", "会员增长", "张老师"],
    ],
    sideTitle: "账号详情",
    sideItems: ["绑定手机号：138****8888。", "当前领用：林老师，华东增长班 A1。", "关联微信群：华东体验官1群、杭州PRO服务群、VIP续费群。"],
    board: [
      ["登记完整率", "92.8%", "缺少 46 条二级保管信息"],
      ["交接中", "18 个", "离职、调岗、项目结束"],
      ["安全提醒", "7 个", "长时间未登录或多端登录"],
    ],
  },
  {
    id: "wechat",
    title: "微信管理",
    kicker: "微信资产",
    hero: ["微信号领用与服务关系", "管理微信号归属、项目用途、绑定手机号、对应微信群、服务人群和交接状态。", "WX"],
    metrics: [
      ["微信总数", "538", "在线 426 个", "up"],
      ["待审批领用", "16", "今日新增 5 个", "warn"],
      ["交接中", "9", "2 个超时", "bad"],
      ["服务人群", "28,960", "覆盖 186 个群", "up"],
    ],
    filters: ["全部微信", "可领用", "已领用", "交接中", "风险"],
    tableTitle: "微信号列表",
    columns: ["微信号", "绑定手机号", "当前项目", "服务群数", "状态"],
    rows: [
      ["FLM001", "138****8888", "华东增长班 A1", "12 个群", "已领用"],
      ["FLM088", "137****6521", "体验官服务", "8 个群", "交接中"],
      ["FLM102", "139****8866", "杭州项目", "0 个群", "待审批"],
      ["FLM207", "136****7788", "VIP续费", "16 个群", "风险提醒"],
      ["FLM318", "135****9090", "华南游客转化", "7 个群", "已领用"],
    ],
    sideTitle: "微信操作台",
    sideItems: ["领用流程：申请 -> 审批 -> 绑定项目 -> 分配群。", "交接流程：冻结新增分配 -> 导出关联群 -> 新保管人确认。", "风险规则：满 30 天未更新状态、多人共用、服务群异常增长。"],
    board: [
      ["可领用微信", "112 个", "可用于新项目"],
      ["绑定手机号", "100%", "所有微信必须可追溯"],
      ["群关联", "1,248 条", "支持按人群与项目检索"],
    ],
  },
  {
    id: "groups",
    title: "社群 / 微信群管理",
    kicker: "社群运营",
    hero: ["微信群资产与服务管理", "记录群名称、群码、服务老师、群容量、人群标签、归属微信和项目阶段。", "群"],
    metrics: [
      ["微信群", "186", "活跃 154 个", "up"],
      ["群成员", "28,960", "今日新增 486", "up"],
      ["满群预警", "9", "容量超过 85%", "bad"],
      ["群码过期", "12", "需要刷新", "warn"],
    ],
    filters: ["全部群", "体验官", "尊享官", "游客", "满群预警"],
    tableTitle: "微信群列表",
    columns: ["群名称", "归属微信", "服务官", "容量", "状态"],
    rows: [
      ["华东体验官1群", "FLM001", "林老师", "428 / 500", "活跃"],
      ["杭州PRO服务群", "FLM088", "王璐琪", "486 / 500", "满群预警"],
      ["华南游客转化群", "FLM318", "Jessica", "326 / 500", "活跃"],
      ["VIP续费提醒群", "FLM207", "财务组", "492 / 500", "满群预警"],
      ["新用户引导群", "FLM102", "陈老师", "89 / 500", "筹备中"],
    ],
    sideTitle: "群详情",
    sideItems: ["群标签：华东、体验官、PRO会员、服务中。", "入群规则：同城市优先，同推荐人优先，服务官在线优先。", "群码状态：3 个渠道正在使用，过期前 24 小时提醒。"],
    board: [
      ["群结构", "体验官 48 / 尊享官 36 / 游客 72", "按身份独立服务"],
      ["服务效率", "平均响应 18 分钟", "超时群 6 个"],
      ["活跃度", "72.3%", "低活跃群进入唤醒计划"],
    ],
  },
  {
    id: "allocation",
    title: "群分配",
    kicker: "智能分配",
    hero: ["用户进群智能分配", "按地区、身份、推荐关系、项目阶段、群容量和服务官负载推荐最合适的群。", "AI"],
    metrics: [
      ["待分配", "64", "新会员 42 人", "warn"],
      ["今日已分配", "128", "自动分配 96 人", "up"],
      ["人工调整", "11", "较昨日 -18%", "up"],
      ["分配准确率", "92.4%", "持续优化", "up"],
    ],
    filters: ["待分配", "VIP", "体验官", "游客", "容量紧张"],
    tableTitle: "待分配用户",
    columns: ["用户", "身份/城市", "推荐群", "命中规则", "动作"],
    rows: [
      ["王思琪", "体验官 / 杭州", "华东体验官1群", "地区+身份+容量", "确认分配"],
      ["李明轩", "尊享官 / 上海", "华东尊享官2群", "身份+推荐人", "确认分配"],
      ["赵子涵", "游客 / 深圳", "华南游客转化群", "地区+服务官", "确认分配"],
      ["陈一凡", "运营商 / 北京", "华北运营商群", "角色+项目", "确认分配"],
      ["周雨辰", "PRO / 杭州", "杭州PRO服务群", "城市+付费等级", "容量预警"],
    ],
    sideTitle: "分配策略",
    sideItems: ["优先级：推荐关系 > 付费等级 > 城市 > 服务官负载 > 群容量。", "容量超过 90% 自动推荐备用群。", "服务官离线或超负载时暂停新增分配。"],
    board: [
      ["推荐命中", "92.4%", "本周人工调整下降"],
      ["备用群", "12 个", "可承接满群溢出"],
      ["异常入群", "7 条", "二维码过期或身份冲突"],
    ],
  },
  {
    id: "users",
    title: "用户操作台",
    kicker: "用户服务",
    hero: ["用户 360 度操作台", "一个页面看到用户账号、订单、归属群、服务记录、推荐关系、收益和下一步动作。", "360"],
    metrics: [
      ["待跟进用户", "128", "高价值 26 人", "warn"],
      ["今日回访", "56", "完成率 72%", "up"],
      ["入群异常", "12", "二维码/身份冲突", "bad"],
      ["续费机会", "38", "7 日内到期", "up"],
    ],
    filters: ["全部用户", "待回访", "入群异常", "高价值", "将到期"],
    tableTitle: "用户服务队列",
    columns: ["用户", "身份", "当前群", "最近动作", "操作"],
    rows: [
      ["Shirley", "联合创始人 / PRO", "华东增长班 A1", "查看权益", "打开用户卡"],
      ["王思琪", "体验官", "华东体验官1群", "申请退款", "查看订单"],
      ["李明轩", "尊享官", "华东尊享官2群", "7 日到期", "续费提醒"],
      ["赵子涵", "游客", "未入群", "扫码失败", "重新分群"],
      ["陈一凡", "运营商", "华北运营商群", "提交工单", "跟进"],
    ],
    sideTitle: "用户卡片",
    sideItems: ["基础资料：手机号、微信号、来源渠道、注册时间。", "服务链路：推荐人、所属服务官、所在群、历史工单。", "快捷动作：分配群、发提醒、建工单、处理退款、变更标签。"],
    board: [
      ["关系链", "3 层", "推荐人 Victoria"],
      ["权益状态", "PRO 已开通", "剩余 15 天"],
      ["AI 评分", "A+ 88", "建议专属回访"],
    ],
  },
  {
    id: "orders",
    title: "支付订单 / 退款审核",
    kicker: "订单财务",
    hero: ["订单、退款与发票", "订阅开通、续费、退款、发票冲销和异常订单统一处理。", "¥"],
    metrics: [
      ["今日支付", "¥128,560", "+18.6%", "up"],
      ["续费率", "68.7%", "+7.3%", "up"],
      ["待退款", "23", "金额 ¥12,560", "warn"],
      ["异常订单", "7", "需复核", "bad"],
    ],
    filters: ["全部订单", "待支付", "已支付", "待退款", "风险订单"],
    tableTitle: "退款申请",
    columns: ["会员", "金额", "原因", "风险", "动作"],
    rows: [
      ["王思琪", "¥2,999", "课程不符合预期", "高风险", "审核"],
      ["李明轩", "¥299", "个人原因", "低风险", "通过"],
      ["张雅婷", "¥2,999", "重复购买", "中风险", "关联订单"],
      ["陈一凡", "¥199", "暂未使用", "低风险", "通过"],
      ["刘佳怡", "¥2,999", "服务体验不佳", "中风险", "客服复核"],
    ],
    sideTitle: "审核建议",
    sideItems: ["重复购买订单可自动关联原订单。", "高风险退款需要人工复核服务记录。", "退款通过后自动触发发票冲销流程。"],
    board: [
      ["待开票", "86 笔", "¥112,520"],
      ["已退款", "12 笔", "¥18,600"],
      ["待结算", "24 笔", "¥26,880"],
    ],
  },
  {
    id: "tickets",
    title: "工单中心",
    kicker: "客服闭环",
    hero: ["工单与回访中心", "会员咨询、售后问题、入群异常、服务跟进和回访记录统一闭环。", "CS"],
    metrics: [
      ["待处理", "28", "较昨日 +6", "warn"],
      ["今日解决", "56", "较昨日 +18", "up"],
      ["超时预警", "7", "需处理", "bad"],
      ["满意度", "4.8", "较昨日 +0.2", "up"],
    ],
    filters: ["全部工单", "待处理", "处理中", "已解决", "超时"],
    tableTitle: "工单列表",
    columns: ["工单号", "类型", "优先级", "指派人", "状态"],
    rows: [
      ["TK250616001", "课程咨询", "高", "林老师", "待处理"],
      ["TK250616002", "账号问题", "中", "张老师", "处理中"],
      ["TK250615094", "退款申请", "中", "陈老师", "已升级"],
      ["TK250614021", "活动报名", "低", "黄老师", "已解决"],
      ["TK250614099", "入群异常", "高", "系统", "待处理"],
    ],
    sideTitle: "处理记录",
    sideItems: ["系统已识别用户所在群和最近订单。", "建议先发送新群码，再回访确认入群。", "超时工单会自动提醒指派人和主管。"],
    board: [
      ["平均响应", "18 分钟", "较上周 -4 分钟"],
      ["处理时长", "4.2 小时", "目标 4 小时内"],
      ["满意反馈", "92.6%", "已解决工单口径"],
    ],
  },
  {
    id: "permissions",
    title: "权限设置",
    kicker: "系统安全",
    hero: ["角色、权限与数据边界", "配置角色可见城市、可操作模块、高风险权限审批和操作日志。", "SEC"],
    metrics: [
      ["角色数量", "8", "+1", "up"],
      ["活跃管理员", "38", "+6", "up"],
      ["待审核权限", "12", "+3", "warn"],
      ["高风险提醒", "2", "需处理", "bad"],
    ],
    filters: ["全部角色", "区域管理员", "客服", "财务", "高风险"],
    tableTitle: "权限矩阵",
    columns: ["角色", "模块权限", "数据范围", "高危操作", "状态"],
    rows: [
      ["联合创始人", "查看/编辑/导出", "全部城市", "需审批", "启用"],
      ["区域管理员", "查看/编辑", "本区域", "部分审批", "启用"],
      ["客服", "工单/用户/群", "分配范围", "无导出", "启用"],
      ["服务官", "群/会员", "负责社群", "无财务", "启用"],
      ["财务运营", "订单/退款/发票", "全部财务", "需审批", "启用"],
    ],
    sideTitle: "风险建议",
    sideItems: ["财务数据导出权限过多，建议收敛到 3 个角色。", "系统配置权限仅保留核心管理员。", "高风险操作必须记录 IP、对象和操作前后状态。"],
    board: [
      ["今日操作日志", "286 条", "2 条被拦截"],
      ["待审批", "12 条", "权限升级申请"],
      ["已处理预警", "14 条", "本周安全事件"],
    ],
  },
  {
    id: "cities",
    title: "城市分站",
    kicker: "区域运营",
    hero: ["城市分站协同", "区域负责人、社群班级、服务资源、城市增长和本地运营建议统一管理。", "CITY"],
    metrics: [
      ["已开通城市", "32", "+4", "up"],
      ["区域管理员", "126", "+18", "up"],
      ["班级总数", "1,248", "+96", "up"],
      ["本月新增会员", "4,589", "+23.6%", "up"],
    ],
    filters: ["全部大区", "华东", "华南", "华北", "待开通"],
    tableTitle: "城市/区域列表",
    columns: ["大区", "城市", "开通状态", "管理员", "运营状态"],
    rows: [
      ["华东大区", "杭州", "已开通", "8 人", "活跃"],
      ["华东大区", "上海", "已开通", "6 人", "活跃"],
      ["华南大区", "深圳", "已开通", "5 人", "增长快"],
      ["华北大区", "北京", "已开通", "7 人", "稳定"],
      ["西南大区", "成都", "筹备中", "3 人", "待开通"],
    ],
    sideTitle: "城市建议",
    sideItems: ["杭州活跃度低于大区平均，建议加强活动运营。", "成长班资源偏紧，建议新增 2-3 个班级。", "沉睡会员可推送专属唤醒福利。"],
    board: [
      ["杭州", "2,356 活跃会员", "增长 +12.5%"],
      ["上海", "1,982 活跃会员", "续费率 72%"],
      ["深圳", "1,648 活跃会员", "新增最快"],
    ],
  },
];

const miniPages = [
  {
    id: "home",
    title: "首页",
    desc: "查看权益、公告、待办、服务老师和入群状态。",
    metrics: [["待办", "6"], ["权益", "PRO"], ["消息", "12"]],
    actions: ["查看权益", "进入社群", "查看公告", "联系客服"],
    feed: ["华东增长班 A1 今日有新公告", "你有 2 个入群任务待确认", "本周收益日报已生成"],
  },
  {
    id: "community",
    title: "社群",
    desc: "我的群、推荐群、群二维码、服务官、入群申请状态。",
    metrics: [["我的群", "3"], ["待入群", "1"], ["服务官", "林老师"]],
    actions: ["查看群码", "申请入群", "邀请好友", "联系服务官"],
    feed: ["华东体验官1群容量 86%", "杭州PRO服务群二维码 20 小时后过期", "推荐你加入 VIP 续费提醒群"],
  },
  {
    id: "tasks",
    title: "任务",
    desc: "处理回访、售后、入群异常、订单跟进和活动提醒。",
    metrics: [["今日任务", "18"], ["已完成", "11"], ["超时", "2"]],
    actions: ["处理任务", "上传凭证", "标记完成", "查看记录"],
    feed: ["赵子涵扫码失败，需重新分群", "王思琪退款申请待客服回访", "李明轩 7 日后到期，建议续费提醒"],
  },
  {
    id: "income",
    title: "收益",
    desc: "日报、月报、年报、提现、分销预估和解冻收益。",
    metrics: [["可提现", "¥8,920"], ["本月", "¥18,260"], ["待解冻", "¥3,600"]],
    actions: ["看日报", "申请提现", "直属用户", "收益明细"],
    feed: ["今日新增 VIP 5 人", "本月分销店预估 ¥12,800", "3 笔收益将在 24 小时后解冻"],
  },
  {
    id: "mine",
    title: "我的",
    desc: "账号资料、会员等级、绑定手机号/微信、订单和服务记录。",
    metrics: [["等级", "体验官"], ["订单", "4"], ["好友", "88"]],
    actions: ["编辑资料", "绑定账号", "我的订单", "服务记录"],
    feed: ["手机号 138****8888 已绑定", "微信 shirley_hcs 已绑定", "PRO 权益剩余 15 天"],
  },
];

const productProblems = [
  ["账号太多记不住", "手机号、邮箱、微信、媒体号统一建档，记录注册平台、绑定关系、保管人和项目用途。"],
  ["微信和群服务关系混乱", "每个微信号关联服务群、用户人群、群码、服务官和交接状态，避免离职或换项目断档。"],
  ["新用户不知道进哪个群", "按城市、身份、来源、推荐关系、群容量和服务官负载自动给出分群建议。"],
  ["用户服务动作分散", "用户操作台集中展示订单、权益、群、工单、回访、退款和下一步动作。"],
];

const moduleFlows = {
  overview: ["登记账号资产", "绑定微信/媒体号", "分配项目与保管人", "关联社群和用户", "监控风险与待办"],
  accounts: ["新增资产", "绑定注册平台", "设置保管人", "领用到项目", "到期/交接预警"],
  wechat: ["申请领用微信", "审批绑定项目", "关联手机号", "分配服务群", "交接或回收"],
  groups: ["创建微信群档案", "绑定归属微信", "配置群码", "设置人群标签", "容量与活跃监控"],
  allocation: ["识别待分配用户", "匹配城市身份", "检查群容量", "推荐服务官", "确认入群"],
  users: ["识别用户身份", "查看账号订单", "检查所在群", "生成服务动作", "沉淀跟进记录"],
  orders: ["支付开通", "续费提醒", "退款申请", "人工/AI 审核", "发票冲销"],
  tickets: ["用户提交问题", "系统识别对象", "指派服务官", "处理与回访", "关闭评价"],
  permissions: ["设置角色", "定义数据范围", "配置高危审批", "记录操作日志", "风险拦截"],
  cities: ["开通城市", "设置区域负责人", "分配班级社群", "监控增长", "生成运营建议"],
};

const relationTemplates = {
  accounts: [["注册微信", "FLM001 / FLM088"], ["绑定平台", "公众号、小程序、视频号"], ["风险", "18 个待交接"]],
  wechat: [["绑定手机号", "138****8888"], ["关联微信群", "12 个服务群"], ["保管人", "林老师 / 王璐琪"]],
  groups: [["归属微信", "FLM001"], ["群容量", "428 / 500"], ["人群标签", "华东、体验官、PRO"]],
  allocation: [["推荐规则", "城市+身份+容量"], ["备用群", "12 个可承接"], ["异常", "7 条待处理"]],
  users: [["手机号", "138****8888"], ["微信号", "shirley_hcs"], ["所在群", "华东增长班 A1"]],
  orders: [["关联订单", "TK250616001"], ["退款风险", "中高风险"], ["发票", "待冲销 3 张"]],
  tickets: [["用户对象", "王思琪"], ["关联群", "华东体验官1群"], ["SLA", "剩余 42 分钟"]],
  permissions: [["数据范围", "全部城市/本区域"], ["高危动作", "导出、退款、权限变更"], ["日志", "286 条"]],
  cities: [["区域负责人", "126 人"], ["班级社群", "1,248 个"], ["服务资源", "杭州偏紧"]],
  overview: [["核心资产", "手机/邮箱/微信/媒体号"], ["运营对象", "用户/群/订单/工单"], ["自动化", "分配/预警/审批"]],
};

const createForms = {
  accounts: ["资产类型", "账号标识", "注册平台", "保管人", "领用项目"],
  wechat: ["微信号", "绑定手机号", "申请项目", "保管人", "用途说明"],
  groups: ["群名称", "归属微信", "服务官", "人群标签", "群容量"],
  allocation: ["用户姓名", "用户身份", "所在城市", "推荐关系", "目标项目"],
  users: ["用户姓名", "手机号", "微信号", "用户身份", "来源渠道"],
  orders: ["会员姓名", "订单类型", "支付金额", "支付渠道", "备注"],
  tickets: ["会员姓名", "问题类型", "优先级", "指派人", "问题描述"],
  permissions: ["角色名称", "数据范围", "模块权限", "审批规则", "备注"],
  cities: ["城市名称", "所属大区", "区域负责人", "开通状态", "服务资源"],
  overview: ["任务类型", "关联对象", "负责人", "优先级", "处理说明"],
};

const state = {
  mode: "pc",
  pc: "overview",
  mini: "home",
  selectedRow: 0,
  search: "",
  menuOpen: false,
  activeFilter: "全部",
  modal: null,
  activityLog: ["系统已同步微信、手机号、微信群与订单关系。", "AI 已识别 64 名待分配用户。"],
};

const app = document.querySelector("#prototypeApp");
const sideNav = document.querySelector("#sideNav");
const pcContent = document.querySelector("#pcContent");
const pageTitle = document.querySelector("#pageTitle");
const pageKicker = document.querySelector("#pageKicker");
const globalSearch = document.querySelector("#globalSearch");
const systemEntry = document.querySelector("#systemEntry");
const systemMenu = document.querySelector("#systemMenu");
const systemEntries = [
  { group: "前端入口", label: "PC 端入口", mode: "pc", page: "overview", desc: "进入 PC 后台交互界面" },
  { group: "前端入口", label: "小程序入口", mode: "mini", page: "home", desc: "进入 iPhone 16 Pro Max 小程序界面" },
];

render();

systemEntry.addEventListener("click", () => {
  state.menuOpen = !state.menuOpen;
  renderSystemMenu();
});

globalSearch.addEventListener("input", () => {
  state.search = globalSearch.value.trim();
  renderContent();
});

document.addEventListener("click", (event) => {
  const command = event.target.closest("[data-command]");
  if (!command) return;
  event.stopPropagation();
  handleCommand(command.dataset.command, command.dataset.payload || "");
});

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  event.stopPropagation();
  showToast(action.dataset.action);
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".floating-entry")) return;
  if (!state.menuOpen) return;
  state.menuOpen = false;
  renderSystemMenu();
});

function switchMode(mode) {
  state.mode = mode;
  state.selectedRow = 0;
  state.search = "";
  state.activeFilter = "全部";
  globalSearch.value = "";
  render();
}

function render() {
  renderSystemMenu();
  renderOverlay();
  app.dataset.mode = state.mode;
  globalSearch.placeholder = state.mode === "pc" ? "搜索手机号 / 微信号 / 群名 / 用户" : "搜索小程序页面 / 用户 / 任务";
  renderSideNav();
  renderContent();
}

function renderSystemMenu() {
  systemMenu.hidden = !state.menuOpen;
  systemEntry.textContent = "切换端";
  systemEntry.classList.toggle("active", state.menuOpen);
  const groups = [...new Set(systemEntries.map((item) => item.group))];
  systemMenu.innerHTML = groups
    .map((group) => {
      const items = systemEntries
        .filter((item) => item.group === group)
        .map((item) => {
          const active = item.mode === state.mode && (item.mode === "pc" ? item.page === state.pc : item.page === state.mini);
          return `<button type="button" class="${active ? "active" : ""}" data-system-mode="${item.mode}" data-system-page="${item.page}">${item.label}<span>${item.desc}</span></button>`;
        })
        .join("");
      return `<h4>${group}</h4>${items}`;
    })
    .join("");

  systemMenu.querySelectorAll("[data-system-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      enterSystem(button.dataset.systemMode, button.dataset.systemPage);
    });
  });
}

function enterSystem(mode, page) {
  state.mode = mode;
  if (mode === "pc") {
    state.pc = page;
  } else {
    state.mini = page;
  }
  state.selectedRow = 0;
  state.search = "";
  state.menuOpen = false;
  globalSearch.value = "";
  render();
  showToast(`已进入：${mode === "pc" ? "PC 端" : "小程序端"}`);
}

function handleCommand(command, payload) {
  if (command === "create") {
    state.modal = { type: "create", page: state.mode === "pc" ? state.pc : "mini", payload };
    renderOverlay();
    return;
  }

  if (command === "export") {
    state.activityLog.unshift("已生成当前模块数据导出任务，包含筛选条件和操作日志。");
    showToast("已创建导出任务");
    renderContent();
    return;
  }

  if (command === "close-modal") {
    state.modal = null;
    renderOverlay();
    return;
  }

  if (command === "submit-form") {
    state.activityLog.unshift(`已提交${payload || "业务"}申请，进入审批/处理队列。`);
    state.modal = null;
    renderOverlay();
    renderContent();
    showToast("已提交，流程已更新");
    return;
  }

  if (command === "assign") {
    state.activityLog.unshift("已按城市、身份、容量和服务官负载生成群分配结果。");
    showToast("已生成群分配建议");
    renderContent();
    return;
  }

  if (command === "handover") {
    state.activityLog.unshift("已发起微信交接，系统冻结新增群分配并通知新保管人确认。");
    showToast("已发起微信交接");
    renderContent();
    return;
  }

  if (command === "approve") {
    state.activityLog.unshift("已完成审批动作，关联用户、订单、账号和群状态已同步。");
    showToast("审批已处理");
    renderContent();
    return;
  }

  showToast(command);
}

function renderSideNav() {
  const pages = state.mode === "pc" ? pcPages : miniPages;
  const activeId = state.mode === "pc" ? state.pc : state.mini;
  const attr = state.mode === "pc" ? "data-pc" : "data-mini";

  sideNav.innerHTML = pages
    .map((page) => `<button type="button" class="${page.id === activeId ? "active" : ""}" ${attr}="${page.id}"><span>${page.kicker || "小程序"}</span>${page.title}</button>`)
    .join("");

  sideNav.querySelectorAll("[data-pc]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pc = button.dataset.pc;
      state.selectedRow = 0;
      state.activeFilter = "全部";
      render();
    });
  });

  sideNav.querySelectorAll("[data-mini]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mini = button.dataset.mini;
      state.activeFilter = "全部";
      render();
    });
  });
}

function renderContent() {
  if (state.mode === "pc") {
    renderPcPage();
  } else {
    renderMiniPage();
  }
}

function renderPcPage() {
  const page = pcPages.find((item) => item.id === state.pc);
  const rows = filterRows(page.rows);
  const selected = rows[state.selectedRow] || rows[0] || page.rows[0];
  const flow = moduleFlows[page.id] || moduleFlows.overview;
  const relations = relationTemplates[page.id] || relationTemplates.overview;
  pageTitle.textContent = page.title;
  pageKicker.textContent = page.kicker;

  pcContent.innerHTML = `
    <section class="hero-card hero-dashboard">
      <div>
        <div class="status-line"><span>实时运营</span><span>数据更新于 2 分钟前</span></div>
        <h2>${page.hero[0]}</h2>
        <p>${page.hero[1]}</p>
        <div class="quick-actions">
          <button type="button" data-action="已生成运营建议">生成建议</button>
          <button type="button" data-action="已创建处理任务">创建任务</button>
          <button type="button" data-action="已同步微信与群数据">同步数据</button>
        </div>
      </div>
      <div class="hero-orbit"><span>${page.hero[2]}</span></div>
    </section>
    ${page.id === "overview" ? renderProblemStrip() : ""}
    <section class="metric-grid">
      ${page.metrics.map(([label, value, sub, type]) => renderMetric(label, value, sub, type)).join("")}
    </section>
    <section class="module-flow">
      ${flow.map((item, index) => `<button type="button" data-action="已定位流程：${item}"><span>${String(index + 1).padStart(2, "0")}</span>${item}</button>`).join("")}
    </section>
    <section class="filter-bar">
      ${page.filters.map((item, index) => `<button type="button" class="${state.activeFilter === item || (index === 0 && state.activeFilter === "全部") ? "active" : ""}" data-filter="${item}">${item}</button>`).join("")}
      <button type="button" data-command="create" data-payload="高级筛选">高级筛选</button>
    </section>
    <section class="workbench-grid">
      <article class="table-card operations-table">
        <div class="section-head">
          <h3>${page.tableTitle}</h3>
          <button type="button" data-action="已导出当前列表">导出列表</button>
        </div>
        <table>
          <thead><tr>${page.columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row, rowIndex) => renderRow(row, rowIndex, page.columns.length)).join("")}
          </tbody>
        </table>
      </article>
      <article class="detail-panel">
        <div class="section-head">
          <h3>${page.sideTitle}</h3>
          <span class="pill">${selected?.[0] || "当前对象"}</span>
        </div>
        <div class="selected-card">
          <strong>${selected?.[1] || selected?.[0]}</strong>
          <p>${selected?.slice(2).join(" / ")}</p>
        </div>
        <div class="relation-grid">
          ${relations.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
        ${page.sideItems.map((item) => `<p>${item}</p>`).join("")}
        <div class="detail-actions">
          ${renderPrimaryCommands(page.id)}
        </div>
      </article>
    </section>
    <section class="system-activity">
      <article class="insight-card activity-card">
        <div class="section-head">
          <h3>系统操作动态</h3>
          <button type="button" data-command="export">导出日志</button>
        </div>
        ${state.activityLog.slice(0, 4).map((item) => `<p>${item}</p>`).join("")}
      </article>
      <article class="insight-card decision-card">
        <div class="section-head">
          <h3>下一步决策</h3>
          <span class="pill warning">AI 辅助</span>
        </div>
        <strong>${nextDecision(page.id)}</strong>
        <p>系统会根据资产、群、用户、订单和工单的关联状态，把需要人工处理的事项聚合到当前页面。</p>
      </article>
    </section>
    <section class="board-grid">
      ${page.board.map(([title, value, desc]) => `<article class="insight-card board-card"><span>${title}</span><strong>${value}</strong><p>${desc}</p></article>`).join("")}
    </section>
  `;

  pcContent.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      showToast(`已切换筛选：${state.activeFilter}`);
      renderPcPage();
    });
  });

  pcContent.querySelectorAll("[data-row]").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedRow = Number(row.dataset.row);
      renderPcPage();
    });
  });
}

function renderProblemStrip() {
  return `
    <section class="problem-strip">
      ${productProblems.map(([title, desc]) => `<article><strong>${title}</strong><p>${desc}</p></article>`).join("")}
    </section>
  `;
}

function renderPrimaryCommands(pageId) {
  const commands = {
    wechat: [
      ["handover", "发起交接"],
      ["approve", "审批领用"],
    ],
    groups: [
      ["create", "新增群档案"],
      ["assign", "刷新群码"],
    ],
    allocation: [
      ["assign", "智能分配"],
      ["approve", "确认入群"],
    ],
    orders: [
      ["approve", "审核退款"],
      ["export", "导出财务"],
    ],
    tickets: [
      ["approve", "处理工单"],
      ["create", "创建回访"],
    ],
    permissions: [
      ["approve", "审批权限"],
      ["create", "新增角色"],
    ],
  };
  const list = commands[pageId] || [
    ["create", "新增记录"],
    ["approve", "立即处理"],
  ];
  return list.map(([command, label], index) => `<button type="button" class="${index === 0 ? "primary-action" : ""}" data-command="${command}" data-payload="${label}">${label}</button>`).join("");
}

function nextDecision(pageId) {
  const decisions = {
    accounts: "优先补全 46 条缺少二级保管人的资产记录。",
    wechat: "先处理 FLM088 交接，避免 8 个关联服务群无人负责。",
    groups: "杭州PRO服务群接近满员，建议新增备用群并迁移后续入群。",
    allocation: "64 名待分配用户中有 22 名可自动确认入群。",
    users: "高价值用户应优先回访，并同步权益、订单和所在群状态。",
    orders: "高风险退款需查看服务记录后再审批，避免误退。",
    tickets: "入群异常类工单可批量刷新群码后回访。",
    permissions: "财务导出权限需要收敛到核心角色。",
    cities: "杭州分站需增加班级与服务资源承接新增会员。",
  };
  return decisions[pageId] || "今天优先清理账号交接、待分群和退款审核三个高风险队列。";
}

function renderMetric(label, value, sub, type) {
  return `
    <article class="card metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <em class="${type}">${sub}</em>
    </article>
  `;
}

function renderRow(row, rowIndex) {
  return `
    <tr class="${rowIndex === state.selectedRow ? "selected" : ""}" data-row="${rowIndex}">
      ${row
        .map((cell, index) => {
          const isLast = index === row.length - 1;
          if (isLast) return `<td><button type="button" class="row-action" data-command="approve" data-payload="${cell}">${cell}</button></td>`;
          return `<td>${index === 2 || index === 3 ? `<span class="pill ${pillTone(cell)}">${cell}</span>` : cell}</td>`;
        })
        .join("")}
    </tr>
  `;
}

function pillTone(text) {
  if (/风险|超时|满群|高/.test(text)) return "danger";
  if (/待|审批|预警|中/.test(text)) return "warning";
  if (/活跃|已|启用|通过/.test(text)) return "success";
  return "";
}

function filterRows(rows) {
  if (!state.search) return rows;
  return rows.filter((row) => row.join(" ").toLowerCase().includes(state.search.toLowerCase()));
}

function renderMiniPage() {
  const page = miniPages.find((item) => item.id === state.mini);
  const miniFlow = ["身份识别", "权益校验", "任务提醒", "服务跟进", "结果同步"];
  pageTitle.textContent = `小程序端 - ${page.title}`;
  pageKicker.textContent = "移动工作台";

  pcContent.innerHTML = `
    <section class="mini-workspace">
      <div class="phone-shell">
        <div class="phone-screen">
          <div class="phone-top"></div>
          <div class="mini-user">
            <div class="avatar">蜂</div>
            <div>
              <strong>Shirley</strong>
              <span>体验官 / PRO 会员</span>
            </div>
          </div>
          <h2>${page.title}</h2>
          <p>${page.desc}</p>
          <div class="mini-metrics">
            ${page.metrics.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
          </div>
          <section class="phone-section">
            <strong>快捷操作</strong>
            <div class="phone-actions">
              ${page.actions.map((item) => `<button type="button" data-action="小程序已触发：${item}">${item}</button>`).join("")}
            </div>
          </section>
          <section class="phone-section">
            <strong>动态提醒</strong>
            ${page.feed.map((item) => `<p>${item}</p>`).join("")}
          </section>
          <section class="phone-section phone-progress">
            <strong>服务链路</strong>
            ${miniFlow.map((item, index) => `<div><span>${index + 1}</span>${item}</div>`).join("")}
          </section>
          <nav class="mini-tabbar">
            ${miniPages.map((item) => `<button type="button" class="${item.id === state.mini ? "active" : ""}" data-mini-tab="${item.id}">${item.title}</button>`).join("")}
          </nav>
        </div>
      </div>
      <div class="mini-console">
        <section class="hero-card mini-hero">
          <div>
            <div class="status-line"><span>小程序端</span><span>面向用户、服务官和区域管理员</span></div>
            <h2>移动端用户操作台</h2>
            <p>小程序负责承接用户自助、服务任务、收益查询、入群申请和消息触达；PC 后台负责配置规则和审核。</p>
          </div>
          <div class="hero-orbit"><span>MP</span></div>
        </section>
        <section class="metric-grid mini-side-metrics">
          ${renderMetric("待入群", "36", "需跟进", "warn")}
          ${renderMetric("今日任务", "18", "完成 11", "up")}
          ${renderMetric("可提现", "¥8,920", "本月 +12%", "up")}
          ${renderMetric("服务提醒", "7", "2 个超时", "bad")}
        </section>
        <article class="table-card">
          <div class="section-head">
            <h3>小程序页面结构</h3>
            <button type="button" data-action="已同步小程序菜单">同步菜单</button>
          </div>
          <table>
            <thead><tr><th>页面</th><th>核心动作</th><th>后台关联</th></tr></thead>
            <tbody>
              ${miniPages.map((item) => `<tr><td>${item.title}</td><td>${item.actions.slice(0, 2).join(" / ")}</td><td><span class="pill">PC规则配置</span></td></tr>`).join("")}
            </tbody>
          </table>
        </article>
        <article class="table-card">
          <div class="section-head">
            <h3>移动端业务动作</h3>
            <button type="button" data-command="create" data-payload="小程序任务">新增任务</button>
          </div>
          <div class="mobile-action-grid">
            ${["入群申请同步到群分配", "退款申请同步到订单审核", "用户咨询同步到工单中心", "收益提现同步到财务审核"].map((item) => `<button type="button" data-action="${item}">${item}</button>`).join("")}
          </div>
        </article>
      </div>
    </section>
  `;

  pcContent.querySelectorAll("[data-mini-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mini = button.dataset.miniTab;
      render();
    });
  });
}

function renderOverlay() {
  const old = document.querySelector(".modal-backdrop");
  if (old) old.remove();
  if (!state.modal) return;

  const pageId = state.modal.page === "mini" ? "users" : state.modal.page;
  const fields = createForms[pageId] || createForms.overview;
  const title = state.modal.payload || (state.modal.page === "mini" ? "新增小程序任务" : `新增${pcPages.find((item) => item.id === pageId)?.title || "记录"}`);
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <section class="system-modal">
      <div class="section-head">
        <h3>${title}</h3>
        <button type="button" data-command="close-modal">关闭</button>
      </div>
      <p>表单会把账号、微信、微信群、用户、订单和工单关系写入统一台账，后续所有模块共享同一份业务状态。</p>
      <div class="form-grid">
        ${fields.map((field, index) => `<label>${field}<input value="${index === 0 ? sampleFieldValue(field, pageId) : ""}" placeholder="请输入${field}" /></label>`).join("")}
      </div>
      <div class="modal-actions">
        <button type="button" data-command="close-modal">取消</button>
        <button type="button" class="primary-action" data-command="submit-form" data-payload="${title}">提交</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);
}

function sampleFieldValue(field, pageId) {
  const samples = {
    accounts: "手机号",
    wechat: "FLM520",
    groups: "华东增长班备用群",
    allocation: "新会员",
    users: "王思琪",
    orders: "PRO 年度会员",
    tickets: "入群异常",
    permissions: "区域管理员",
    cities: "杭州市",
    overview: "账号交接",
  };
  return samples[pageId] || field;
}

function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1800);
}
