const SYSTEM_META = {
  "pc-backend": {
    owner: "运营中台",
    status: "后台主线",
    description: "承接订单操作台、活动通知、客服回访、微信社群配置等 PC 管理能力。",
    modules: ["操作台", "活动通知", "客服回访", "微信管理", "社群管理"],
  },
  "backend-order-service-member": {
    owner: "客服运营",
    status: "业务补全",
    description: "覆盖会员、订单、售后、客服、回访单等后台运营与移动端联动页面。",
    modules: ["订单", "退款售后", "客服", "会员", "消息"],
  },
  "backend-wechat-community": {
    owner: "社群运营",
    status: "增长模块",
    description: "围绕微信号、微信群、会员推广、收益日报和社群数据的运营管理。",
    modules: ["微信号", "微信群", "推广", "收益", "会员分层"],
  },
  "miniapp-jinfu": {
    owner: "金服小程序",
    status: "移动端主线",
    description: "面向运营商、体验官、游客和用户关系的金服移动端工作台。",
    modules: ["收益", "人群", "回访", "活动", "提现"],
  },
  "mall-order-cart": {
    owner: "商城前台",
    status: "交易闭环",
    description: "商城首页、购物车、订单详情、收货地址、会员等级与客服入口。",
    modules: ["首页", "购物车", "订单", "地址", "会员"],
  },
  "mall-promotion": {
    owner: "商城增长",
    status: "裂变链路",
    description: "体验官个人中心、推广中心、分享至群、邀请入群等推广页面。",
    modules: ["推广中心", "邀请入群", "分享", "体验官"],
  },
  "group-prototypes": {
    owner: "社群工具",
    status: "Axure 原型",
    description: "原始可交互原型，保留 Axure 页面跳转和交互说明。",
    modules: ["群管理后台", "群营销小程序"],
  },
};

const PRODUCT_MODULES = [
  {
    name: "账号资产中心",
    role: "公司与个人账号的统一台账",
    goal: "统一记录手机号、邮箱、微信、媒体账号、注册用途、登录资料、领用人、所属项目和服务人群。",
    features: ["手机号台账", "邮箱台账", "微信注册关系", "媒体账号", "领用记录", "项目绑定"],
  },
  {
    name: "用户操作台",
    role: "客服与运营的一线工作台",
    goal: "把用户档案、影响力排行、关系链、订单详情、回访任务集中在一个页面处理。",
    features: ["待处理任务", "我发布的任务", "我回访的任务", "用户档案", "订单详情", "任务指派"],
  },
  {
    name: "微信管理",
    role: "承接私域流量的微信资产库",
    goal: "统一管理客服微信号、二维码、归属客服、地区、绑定资料和承载群数量。",
    features: ["新增微信", "微信资料维护", "二维码管理", "归属客服", "地区分类", "群数统计"],
  },
  {
    name: "社群管理",
    role: "微信群资源与入群名单管理",
    goal: "维护每个微信群的归属微信、服务官、群类型、扫码次数、入群人数和成员名单。",
    features: ["新建微信群", "群二维码", "群类型", "入群名单", "扫码统计", "群容量"],
  },
  {
    name: "群分配",
    role: "用户入群和换群的规则引擎",
    goal: "按地区、等级、推荐关系、归属客服、群容量和用户身份自动推荐合适微信群。",
    features: ["自动分群", "手动调整", "换群记录", "容量预警", "未进群提醒", "分配日志"],
  },
  {
    name: "客服工单",
    role: "售后、回访、问题处理闭环",
    goal: "将订单问题、售后问题、用户反馈转成任务并分配到部门和员工。",
    features: ["问题分类", "优先级", "提醒时间", "处理人", "图片附件", "历史记录"],
  },
  {
    name: "分销关系链",
    role: "体验官、尊享官、游客的层级管理",
    goal: "追踪直属/间接用户、家族关系、影响力、收益和消费贡献。",
    features: ["关系树", "影响力榜", "直属体验", "间接游客", "收益报表", "推荐消费"],
  },
  {
    name: "活动触达",
    role: "活动内容发布与群触达",
    goal: "创建活动通知、富文本内容和链接页面，并推送到用户或微信群。",
    features: ["活动草稿", "已发布", "富文本", "链接页面", "推送记录", "触达统计"],
  },
];

const SOLVED_PROBLEMS = [
  {
    title: "账号太多，注册资料记不住",
    pain: "公司和个人都有大量手机号、邮箱、微信、媒体账号。手机号可能用于注册微信，邮箱可能用于注册媒体号，后续谁在用、用于哪个项目很容易遗忘。",
    solution: "建立账号资产中心，记录手机号、邮箱、微信、媒体账号、注册用途、登录信息、领用人、项目和服务人群。",
  },
  {
    title: "微信号和微信群资产分散",
    pain: "客服微信、微信群、二维码、归属客服、地区和群容量分散维护，运营很难知道哪个微信承接了哪些群。",
    solution: "建立微信资产库和微信群资产库，统一绑定客服、地区、二维码、群类型和群数据。",
  },
  {
    title: "用户入群靠人工判断",
    pain: "用户该进哪个群、是否已进群、是否需要换群，依赖人工记忆，容易错分、漏分和重复分配。",
    solution: "建立群分配规则，根据地区、身份、推荐关系、客服归属、群容量自动推荐微信群。",
  },
  {
    title: "用户关系链和收益看不清",
    pain: "体验官、尊享官、游客、运营商之间存在推荐和收益关系，但后台缺少统一关系链视图。",
    solution: "把直属/间接用户、家族、影响力、个人消费、推荐消费和收益报表放到同一个关系链模块。",
  },
  {
    title: "客服跟进没有闭环",
    pain: "售后、回访、入群异常、订单问题分散在聊天和表格里，无法追踪处理人、优先级和历史记录。",
    solution: "建立客服工单和用户操作台，从用户详情直接创建任务、指派员工、记录回访和标记完成。",
  },
  {
    title: "运营活动触达不可追踪",
    pain: "活动通知、群推送、链接页面和扫码结果之间缺少数据串联，无法评估活动转化。",
    solution: "活动触达模块统一管理草稿、发布、链接、推送对象、扫码次数和入群转化。",
  },
];

const PRODUCT_POSITIONING = [
  ["系统名称", "蜂乐玛私域社群运营中台"],
  ["核心目标", "把账号资产、用户、微信、微信群、客服任务、订单售后、收益关系链统一管理"],
  ["PC 端定位", "给运营、客服和管理层做批量管理、规则配置、工单协同和数据分析"],
  ["小程序定位", "给用户、体验官、服务官和移动客服做入群、收益、任务和个人中心操作"],
  ["第一期重点", "账号资产中心、用户操作台、微信管理、微信群管理、群分配、客服任务"],
];

const ALLOCATION_RULES = [
  ["地区匹配", "优先分配到用户所在地区或相邻地区的微信群。"],
  ["身份分层", "游客、体验官、尊享官、运营商进入不同类型群。"],
  ["推荐关系", "优先跟随推荐人、家族或上级体验官所在社群。"],
  ["客服归属", "已有归属客服的用户优先进入该客服负责的微信号/群。"],
  ["群容量", "群人数达到阈值后自动推荐备用群，避免过载。"],
  ["转化目标", "高影响力或高消费用户优先进入服务官更强的群。"],
];

const DATA_ENTITIES = [
  "账号资产",
  "手机号",
  "邮箱",
  "媒体账号",
  "领用记录",
  "项目",
  "服务人群",
  "用户",
  "微信号",
  "微信群",
  "入群记录",
  "推荐关系",
  "客服任务",
  "订单",
  "回访单",
  "活动通知",
  "收益记录",
];

const MENU_DESIGN = [
  ["工作台", "影响力排行榜", "用户详情", "待办任务"],
  ["账号资产", "手机号", "邮箱", "微信号", "媒体账号", "领用记录"],
  ["私域资产", "微信管理", "微信群管理", "群分配", "入群名单"],
  ["用户运营", "用户管理", "关系链", "会员等级", "标签分层"],
  ["客服中心", "客服管理", "回访管理", "订单售后", "历史记录"],
  ["增长触达", "活动通知", "链接页面", "推广中心", "扫码统计"],
  ["数据报表", "收益日报", "影响力榜", "社群转化", "客服绩效"],
  ["系统管理", "员工管理", "角色权限", "项目分类", "地区配置"],
];

const FEATURE_MATRIX = [
  ["账号资产中心", "PC", "管理员/运营", "管理手机号、邮箱、微信、媒体账号、注册用途、领用人和项目绑定"],
  ["用户操作台", "PC", "客服/运营", "查看用户档案、影响力、订单、回访任务并创建工单"],
  ["微信管理", "PC", "运营管理员", "维护微信号、二维码、归属客服、地区、群数"],
  ["微信群管理", "PC", "社群运营", "维护群资料、二维码、服务官、入群名单和扫码数据"],
  ["群分配", "PC + 小程序", "运营/服务官", "自动推荐群、手动换群、记录入群状态"],
  ["客服任务", "PC + 小程序", "客服", "处理售后、回访、入群异常和订单问题"],
  ["收益中心", "小程序", "体验官/尊享官", "查看日报、月报、年报、提现和分销预估"],
  ["活动触达", "PC + 小程序", "运营/用户", "发布活动、打开链接、分享入群、追踪扫码"],
];

const ACCOUNT_ASSET_FIELDS = [
  ["基础账号", "手机号、邮箱、微信号、视频号/公众号/小红书/抖音等媒体账号"],
  ["注册关系", "手机号注册了哪个微信，邮箱注册了哪个平台，微信绑定了哪些群"],
  ["领用关系", "当前领用人、所属部门、领用时间、归还状态、交接记录"],
  ["项目关系", "账号用于哪个项目、哪个品牌、哪个地区、哪个活动"],
  ["服务人群", "游客、体验官、尊享官、运营商、客服号、服务官号"],
  ["安全信息", "登录方式、密保信息、备用联系人、状态提醒、风险备注"],
];

const ACCOUNT_FLOW = ["手机号/邮箱", "注册微信/媒体号", "员工领用", "绑定项目", "服务人群", "对应微信群"];

const ROADMAP = [
  {
    phase: "一期 MVP",
    goal: "先把账号资产、私域资产和人工工作流跑通",
    items: ["账号资产中心", "用户操作台", "微信管理", "微信群管理", "群分配", "客服任务"],
  },
  {
    phase: "二期 增长闭环",
    goal: "把分销关系、收益和活动触达接起来",
    items: ["关系链", "收益报表", "活动通知", "扫码统计", "推广中心"],
  },
  {
    phase: "三期 自动化",
    goal: "降低人工判断成本，提升分群和客服效率",
    items: ["自动分群规则", "容量预警", "客服绩效", "异常提醒", "数据看板"],
  },
];

const PC_VERSION = {
  name: "PC 运营后台",
  positioning: "给运营、客服、管理层使用，承担批量管理、任务协同、数据分析和规则配置。",
  navigation: [
    ["工作台", "待办任务", "影响力排行榜", "用户详情", "操作记录"],
    ["账号资产", "手机号", "邮箱", "微信号", "媒体账号", "领用记录"],
    ["私域管理", "微信管理", "微信群管理", "群分配", "入群名单"],
    ["用户运营", "用户列表", "关系链", "会员等级", "标签分层"],
    ["客服中心", "客服管理", "回访单", "订单售后", "任务分派"],
    ["活动触达", "活动通知", "富文本编辑", "链接页面", "推送统计"],
    ["数据报表", "社群转化", "收益报表", "客服绩效", "增长漏斗"],
    ["系统设置", "员工管理", "角色权限", "地区配置", "项目分类"],
  ],
  screens: [
    {
      title: "账号资产中心",
      layout: ["手机号/邮箱/微信/媒体账号台账", "注册用途和登录资料", "领用人和项目绑定", "账号状态与到期提醒"],
    },
    {
      title: "运营工作台",
      layout: ["左侧任务队列", "中部影响力排行", "下方关系链与任务创建", "右侧用户档案与订单详情"],
    },
    {
      title: "微信管理",
      layout: ["筛选搜索", "微信号资产表", "新增/编辑弹窗", "二维码与客服绑定", "群数统计"],
    },
    {
      title: "微信群管理",
      layout: ["群列表", "群类型/地区筛选", "群二维码", "入群名单", "扫码/入群数据"],
    },
    {
      title: "群分配",
      layout: ["待分配用户", "推荐微信群", "规则命中说明", "手动调整", "分配日志"],
    },
  ],
};

const REFERENCE_PC_PAGES = [
  ["总览", "成员、关系链、支付收益、AI运营建议、今日待办统一看板"],
  ["账号资产", "手机号、邮箱、微信、媒体账号、领用人、项目和服务人群"],
  ["会员管理", "会员身份、班级/群归属、付费状态、服务老师和AI评分"],
  ["班级/社群管理", "社群分班、服务协同、学习/运营进度、风险预警"],
  ["AI洞察", "续费风险、资源匹配、活跃漏斗、服务响应效率"],
  ["支付订单", "订阅开通、续费、退款、发票和异常订单"],
  ["公告中心", "活动通知、课程提醒、系统公告、按人群/区域触达"],
  ["工单中心", "会员咨询、服务跟进、问题闭环、满意度反馈"],
  ["权限设置", "角色边界、数据访问、操作日志、高风险权限预警"],
  ["城市分站", "城市/区域负责人、服务资源、班级数和活跃会员"],
];

const MINIAPP_PRODUCT = {
  tabs: ["首页", "社群", "任务", "收益", "我的"],
  pages: [
    ["首页", "会员权益、公告提醒、待办入口、专属服务老师"],
    ["社群", "我的群、推荐群、群二维码、服务官、入群状态"],
    ["任务", "回访任务、售后问题、入群异常、处理进度"],
    ["收益", "日报/月报/年报、提现、分销预估、解冻收益"],
    ["我的", "账号资料、会员等级、绑定手机号/微信、服务记录"],
  ],
  roles: ["会员", "体验官", "尊享官", "服务官", "客服"],
};

const MINIAPP_VERSION = {
  name: "小程序端",
  positioning: "给体验官、尊享官、服务官、客服外勤和普通用户使用，承担移动端查看、回访、入群和收益操作。",
  roles: ["游客/会员", "体验官", "尊享官", "服务官", "客服"],
  tabs: ["首页", "社群", "收益", "任务", "我的"],
  screens: [
    {
      title: "首页",
      purpose: "展示会员等级、专属客服、活动入口、升级提示和待办提醒。",
      actions: ["查看活动", "绑定手机", "升级体验官", "联系客服"],
    },
    {
      title: "社群",
      purpose: "展示可加入群、已加入群、邀请入群和分享至群。",
      actions: ["查看群二维码", "申请入群", "分享海报", "联系服务官"],
    },
    {
      title: "收益",
      purpose: "体验官/尊享官查看日报、月报、年报、提现和分销店预估。",
      actions: ["看收益", "申请提现", "查看直属/间接用户", "解冻收益"],
    },
    {
      title: "任务",
      purpose: "客服或服务官处理回访、订单问题、入群异常和活动跟进。",
      actions: ["处理任务", "记录回访", "上传图片", "标记完成"],
    },
    {
      title: "我的",
      purpose: "个人资料、会员等级、我的好友、我的影响力、订单和客服信息。",
      actions: ["编辑资料", "查看订单", "查看好友", "查看影响力"],
    },
  ],
};

const state = {
  manifest: null,
  activeSystemId: "overview",
  mode: "system",
  query: "",
  selectedIndex: 0,
};

const elements = {
  nav: document.querySelector("#systemNav"),
  title: document.querySelector("#systemTitle"),
  type: document.querySelector("#systemType"),
  summary: document.querySelector("#summary"),
  content: document.querySelector("#content"),
  search: document.querySelector("#searchInput"),
  overviewButton: document.querySelector("#overviewButton"),
  systemButton: document.querySelector("#systemButton"),
  gridButton: document.querySelector("#gridButton"),
  previewButton: document.querySelector("#previewButton"),
  openSource: document.querySelector("#openSource"),
};

const template = document.querySelector("#systemTemplate");

init();

async function init() {
  const response = await fetch("./manifest.json");
  state.manifest = await response.json();
  bindEvents();
  render();
}

function bindEvents() {
  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    state.selectedIndex = 0;
    renderContent();
  });

  elements.overviewButton.addEventListener("click", () => {
    state.activeSystemId = "overview";
    state.mode = "system";
    state.selectedIndex = 0;
    render();
  });

  elements.systemButton.addEventListener("click", () => setMode("system"));
  elements.gridButton.addEventListener("click", () => setMode("grid"));
  elements.previewButton.addEventListener("click", () => setMode("preview"));
}

function setMode(mode) {
  state.mode = mode;
  state.selectedIndex = 0;
  renderContent();
}

function systems() {
  return state.manifest?.systems || [];
}

function activeSystem() {
  return systems().find((system) => system.id === state.activeSystemId);
}

function metaFor(system) {
  return SYSTEM_META[system.id] || {
    owner: system.type,
    status: "已归档",
    description: "从原始资料中整理出的系统页面。",
    modules: [],
  };
}

function filteredScreens(system) {
  if (!system?.screens) return [];
  if (!state.query) return system.screens;
  return system.screens.filter((screen) => {
    return `${screen.title} ${system.title} ${system.type} ${metaFor(system).modules.join(" ")}`.toLowerCase().includes(state.query);
  });
}

function allScreens() {
  return systems().flatMap((system) => system.screens || []);
}

function render() {
  renderNav();
  renderContent();
}

function renderNav() {
  elements.overviewButton.classList.toggle("is-active", state.activeSystemId === "overview");
  elements.nav.innerHTML = "";

  systems().forEach((system) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const meta = metaFor(system);
    item.classList.toggle("is-active", system.id === state.activeSystemId);
    item.querySelector(".system-name").textContent = system.title;
    item.querySelector(".system-count").textContent = system.prototypeLinks?.length
      ? `${system.prototypeLinks.length} 原型`
      : `${system.screens.length} 页`;
    item.title = `${meta.owner} · ${meta.status}`;
    item.addEventListener("click", () => {
      state.activeSystemId = system.id;
      state.mode = "system";
      state.selectedIndex = 0;
      render();
    });
    elements.nav.appendChild(item);
  });
}

function renderContent() {
  if (state.activeSystemId === "overview") {
    renderOverview();
    return;
  }

  const system = activeSystem();
  const screens = filteredScreens(system);
  const phoneCount = screens.filter((screen) => screen.kind === "phone").length;
  const desktopCount = screens.filter((screen) => screen.kind === "desktop").length;
  const meta = metaFor(system);

  elements.title.textContent = system?.title || "未找到系统";
  elements.type.textContent = `${system?.type || ""} / ${meta.owner}`;
  elements.openSource.style.display = system?.prototypeLinks?.length ? "inline-flex" : "none";
  elements.openSource.href = system?.prototypeLinks?.[0]?.path || "#";
  elements.systemButton.style.display = "inline-grid";
  elements.gridButton.style.display = "inline-grid";
  elements.previewButton.style.display = "inline-grid";
  elements.systemButton.classList.toggle("is-active", state.mode === "system");
  elements.gridButton.classList.toggle("is-active", state.mode === "grid");
  elements.previewButton.classList.toggle("is-active", state.mode === "preview");

  elements.summary.innerHTML = `
    <div class="metric"><strong>${screens.length}</strong><span>当前页面</span></div>
    <div class="metric"><strong>${desktopCount}</strong><span>PC 端界面</span></div>
    <div class="metric"><strong>${phoneCount}</strong><span>小程序 / App 界面</span></div>
    <div class="metric"><strong>${system?.prototypeLinks?.length || 0}</strong><span>Axure 原型入口</span></div>
  `;

  if (state.mode === "system") {
    renderSystem(system, screens);
    return;
  }

  if (system?.prototypeLinks?.length && !screens.length) {
    renderAxure(system);
    return;
  }

  if (!screens.length) {
    elements.content.innerHTML = `<div class="empty">没有匹配的页面</div>`;
    return;
  }

  if (state.mode === "preview") {
    renderPreview(screens);
    return;
  }

  renderGrid(screens);
}

function renderOverview() {
  const screenCount = allScreens().length;
  const pcCount = allScreens().filter((screen) => screen.kind === "desktop").length;
  const phoneCount = screenCount - pcCount;

  elements.title.textContent = "私域社群运营中台设计";
  elements.type.textContent = "需求整理 / 重新开发设计";
  elements.openSource.style.display = "none";
  elements.systemButton.style.display = "none";
  elements.gridButton.style.display = "none";
  elements.previewButton.style.display = "none";
  elements.summary.innerHTML = `
    <div class="metric"><strong>${SOLVED_PROBLEMS.length}</strong><span>要解决的问题</span></div>
    <div class="metric"><strong>${MENU_DESIGN.length}</strong><span>一级菜单</span></div>
    <div class="metric"><strong>${DATA_ENTITIES.length}</strong><span>关键数据对象</span></div>
    <div class="metric"><strong>${screenCount}</strong><span>参考界面素材</span></div>
  `;

  const cards = systems()
    .filter((system) => !state.query || `${system.title} ${system.type} ${metaFor(system).description}`.toLowerCase().includes(state.query))
    .map((system) => {
      const meta = metaFor(system);
      const cover = pickCover(system);
      return `
        <button class="module-card" type="button" data-system="${system.id}">
          <div class="module-copy">
            <span>${escapeHtml(system.type)}</span>
            <h3>${escapeHtml(system.title)}</h3>
            <p>${escapeHtml(meta.description)}</p>
            <div class="module-tags">${meta.modules.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}</div>
          </div>
          ${cover ? `<img src="${encodeURI(cover.path)}" alt="${escapeHtml(cover.title)}" />` : `<div class="prototype-mark">AX</div>`}
        </button>
      `;
    })
    .join("");

  elements.content.innerHTML = `
    <section class="product-hero">
      <div>
        <span class="status-pill">重新定义后的系统</span>
        <h3>蜂乐玛私域社群运营中台</h3>
        <p>这套系统要解决的不是单个商城或单个客服后台问题，而是把用户从商城交易、升级体验官/尊享官、进入微信群、被客服回访、产生复购和分销收益的全过程串起来。</p>
      </div>
      <div class="hero-stack">
        <strong>核心闭环</strong>
        <span>用户分层</span>
        <span>微信承接</span>
        <span>社群分配</span>
        <span>客服跟进</span>
        <span>收益转化</span>
      </div>
    </section>

    <section class="position-panel">
      ${PRODUCT_POSITIONING.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
    </section>

    <section class="problem-grid">
      ${SOLVED_PROBLEMS.map(
        (problem) => `
          <article>
            <h3>${escapeHtml(problem.title)}</h3>
            <p><b>现状问题：</b>${escapeHtml(problem.pain)}</p>
            <p><b>系统方案：</b>${escapeHtml(problem.solution)}</p>
          </article>
        `,
      ).join("")}
    </section>

    <section class="account-asset-panel">
      <article>
        <span class="status-pill">新增核心能力</span>
        <h3>账号资产与领用管理</h3>
        <p>系统需要先把公司和个人持有的大量手机号、邮箱、微信号、媒体账号做成统一台账，再继续管理它们和项目、员工、微信群、服务人群之间的对应关系。</p>
        <div class="account-flow">
          ${ACCOUNT_FLOW.map((item, index) => `<span>${escapeHtml(item)}</span>${index < ACCOUNT_FLOW.length - 1 ? "<i></i>" : ""}`).join("")}
        </div>
      </article>
      <div class="account-fields">
        ${ACCOUNT_ASSET_FIELDS.map(([title, detail]) => `<div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div>`).join("")}
      </div>
    </section>

    <section class="reference-redesign">
      <article class="reference-shell">
        <div class="reference-head">
          <span class="status-pill">参考图重设计</span>
          <h3>PC 端运营后台</h3>
          <p>采用参考图的深色科技后台结构：左侧模块导航、顶部全局搜索、主区数据看板、右侧AI建议和风险提醒。用于公司内部批量管理账号、会员、社群、订单、工单和权限。</p>
        </div>
        <div class="neon-dashboard">
          <aside>
            <strong>蜂乐玛 PRO</strong>
            ${REFERENCE_PC_PAGES.slice(0, 9).map(([name], index) => `<span class="${index === 0 ? "active" : ""}">${escapeHtml(name)}</span>`).join("")}
          </aside>
          <main>
            <div class="neon-hero">
              <div>
                <small>PC后台总览</small>
                <h4>私域资产与社群运营中心</h4>
                <p>账号、会员、群、订单、工单、权限和AI洞察统一管理</p>
              </div>
              <div class="orbital-cube">AI</div>
            </div>
            <div class="neon-metrics">
              <div><span>账号资产</span><strong>3,286</strong><em>手机号 / 邮箱 / 微信</em></div>
              <div><span>服务社群</span><strong>186</strong><em>覆盖 12 个项目</em></div>
              <div><span>待处理工单</span><strong>42</strong><em>高优先级 7 个</em></div>
              <div><span>本月转化</span><strong>68.7%</strong><em>较上月 +6.2%</em></div>
            </div>
            <div class="neon-grid">
              <section>
                <b>账号领用链路</b>
                <p>手机号 → 注册微信 → 员工领用 → 项目绑定 → 服务人群 → 对应微信群</p>
                <i></i><i></i><i></i>
              </section>
              <section>
                <b>群分配建议</b>
                <p>按地区、身份、推荐关系、客服归属和群容量推荐最佳社群</p>
                <button type="button">查看建议</button>
              </section>
              <section>
                <b>风险提醒</b>
                <p>账号未交接、群容量过高、退款待审核、权限异常</p>
                <button type="button">立即处理</button>
              </section>
            </div>
          </main>
        </div>
        <div class="reference-pages">
          ${REFERENCE_PC_PAGES.map(([name, desc]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(desc)}</span></div>`).join("")}
        </div>
      </article>

      <article class="reference-shell mini-reference">
        <div class="reference-head">
          <span class="status-pill">小程序端系统</span>
          <h3>移动端服务与协作入口</h3>
          <p>小程序用于会员、体验官、尊享官、服务官和客服在移动端完成入群、收益查看、任务处理、个人资料和服务记录。</p>
        </div>
        <div class="mini-product-showcase">
          ${MINIAPP_PRODUCT.pages.map(
            ([title, desc]) => `
              <div class="mini-phone-card">
                <div class="phone-notch"></div>
                <h4>${escapeHtml(title)}</h4>
                <p>${escapeHtml(desc)}</p>
                <div class="mini-lines"><i></i><i></i><i></i></div>
              </div>
            `,
          ).join("")}
        </div>
        <div class="miniapp-tabs dark-tabs">
          ${MINIAPP_PRODUCT.tabs.map((tab) => `<span>${escapeHtml(tab)}</span>`).join("")}
        </div>
        <div class="role-strip">
          ${MINIAPP_PRODUCT.roles.map((role) => `<em>${escapeHtml(role)}</em>`).join("")}
        </div>
      </article>
    </section>

    <section class="blueprint-grid">
      ${PRODUCT_MODULES.map(
        (module) => `
          <article class="blueprint-card">
            <span>${escapeHtml(module.role)}</span>
            <h3>${escapeHtml(module.name)}</h3>
            <p>${escapeHtml(module.goal)}</p>
            <div class="module-tags">${module.features.map((feature) => `<em>${escapeHtml(feature)}</em>`).join("")}</div>
          </article>
        `,
      ).join("")}
    </section>

    <section class="version-section">
      <article class="version-card pc-version">
        <div class="version-head">
          <span class="status-pill">PC 端版本</span>
          <h3>${escapeHtml(PC_VERSION.name)}</h3>
          <p>${escapeHtml(PC_VERSION.positioning)}</p>
        </div>
        <div class="pc-shell">
          <aside>
            ${PC_VERSION.navigation.map(([title]) => `<span>${escapeHtml(title)}</span>`).join("")}
          </aside>
          <main>
            <div class="pc-topline">
              <strong>用户操作台</strong>
              <span>搜索用户 / 微信号 / 群名</span>
            </div>
            <div class="pc-workbench">
              <div class="pc-queue">
                <b>任务队列</b>
                <em>售后问题</em>
                <em>入群异常</em>
                <em>回访提醒</em>
              </div>
              <div class="pc-rank">
                <b>影响力排行</b>
                <i></i><i></i><i></i><i></i>
              </div>
              <div class="pc-profile">
                <b>用户档案</b>
                <em>二维码</em>
                <em>订单详情</em>
                <em>分配群</em>
              </div>
            </div>
          </main>
        </div>
        <div class="screen-specs">
          ${PC_VERSION.screens.map(
            (screen) => `
              <div>
                <strong>${escapeHtml(screen.title)}</strong>
                ${screen.layout.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
              </div>
            `,
          ).join("")}
        </div>
      </article>

      <article class="version-card miniapp-version">
        <div class="version-head">
          <span class="status-pill">小程序版本</span>
          <h3>${escapeHtml(MINIAPP_VERSION.name)}</h3>
          <p>${escapeHtml(MINIAPP_VERSION.positioning)}</p>
        </div>
        <div class="phone-flow">
          ${MINIAPP_VERSION.screens.map(
            (screen) => `
              <div class="phone-frame">
                <div class="phone-status"></div>
                <strong>${escapeHtml(screen.title)}</strong>
                <p>${escapeHtml(screen.purpose)}</p>
                <div>${screen.actions.map((action) => `<span>${escapeHtml(action)}</span>`).join("")}</div>
              </div>
            `,
          ).join("")}
        </div>
        <div class="miniapp-tabs">
          ${MINIAPP_VERSION.tabs.map((tab) => `<span>${escapeHtml(tab)}</span>`).join("")}
        </div>
        <div class="role-strip">
          ${MINIAPP_VERSION.roles.map((role) => `<em>${escapeHtml(role)}</em>`).join("")}
        </div>
      </article>
    </section>

    <section class="matrix-section">
      <article class="design-panel">
        <h3>功能矩阵</h3>
        <div class="feature-table">
          <b>模块</b><b>端</b><b>使用人</b><b>核心价值</b>
          ${FEATURE_MATRIX.map((row) => row.map((cell) => `<span>${escapeHtml(cell)}</span>`).join("")).join("")}
        </div>
      </article>
      <article class="design-panel">
        <h3>开发分期</h3>
        <div class="roadmap-list">
          ${ROADMAP.map(
            (phase) => `
              <div>
                <strong>${escapeHtml(phase.phase)}</strong>
                <p>${escapeHtml(phase.goal)}</p>
                <div class="module-tags">${phase.items.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}</div>
              </div>
            `,
          ).join("")}
        </div>
      </article>
    </section>

    <section class="design-panels">
      <article class="design-panel">
        <h3>群分配规则</h3>
        <div class="rule-list">
          ${ALLOCATION_RULES.map(([name, detail]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}
        </div>
      </article>
      <article class="design-panel">
        <h3>后台菜单设计</h3>
        <div class="menu-columns">
          ${MENU_DESIGN.map(
            ([title, ...items]) => `
              <div>
                <strong>${escapeHtml(title)}</strong>
                ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
              </div>
            `,
          ).join("")}
        </div>
      </article>
    </section>

    <section class="console-design">
      <div class="console-column narrow">
        <h3>任务队列</h3>
        <p>待处理任务、我发布的任务、我回访的任务按优先级和提醒时间排列。</p>
        <span>售后问题</span>
        <span>入群异常</span>
        <span>回访提醒</span>
      </div>
      <div class="console-column main">
        <h3>用户影响力与关系链</h3>
        <p>按今日、本周、本月、总榜查看用户影响力、体验官/尊享官人数、消费贡献和推荐消费。</p>
        <div class="mini-table">
          <b>用户</b><b>等级</b><b>影响力</b><b>收益</b>
          <span>橙几</span><span>尊享官</span><span>679</span><span>9815</span>
          <span>皮卡丘</span><span>体验官</span><span>652</span><span>6305</span>
          <span>蜂乐玛</span><span>游客</span><span>496</span><span>3956</span>
        </div>
      </div>
      <div class="console-column profile">
        <h3>用户档案</h3>
        <p>展示微信二维码、归属微信群、推荐人、会员编号、订单、回访单和历史操作记录。</p>
        <div class="profile-actions">
          <button type="button">分配群</button>
          <button type="button">建任务</button>
          <button type="button">改资料</button>
        </div>
      </div>
    </section>

    <section class="data-model">
      <h3>关键数据对象</h3>
      <div>${DATA_ENTITIES.map((entity) => `<span>${escapeHtml(entity)}</span>`).join("")}</div>
    </section>

    <section class="command-center">
      <div class="flow-panel">
        <h3>业务链路</h3>
        <div class="flow">
          <span>商城交易</span>
          <i></i>
          <span>用户分层</span>
          <i></i>
          <span>微信承接</span>
          <i></i>
          <span>社群分配</span>
          <i></i>
          <span>客服回访</span>
          <i></i>
          <span>收益复购</span>
        </div>
      </div>
      <div class="ops-panel">
        <h3>参考素材</h3>
        <p>当前已整理 ${pcCount} 张 PC 后台界面、${phoneCount} 张移动端界面，可作为各模块细节还原依据。</p>
      </div>
    </section>

    <h3 class="section-title">参考界面矩阵</h3>
    <section class="module-grid">${cards || `<div class="empty">没有匹配的系统模块</div>`}</section>
  `;

  elements.content.querySelectorAll("[data-system]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSystemId = button.dataset.system;
      state.mode = "system";
      state.selectedIndex = 0;
      render();
    });
  });
}

function renderSystem(system, screens) {
  const meta = metaFor(system);
  const featured = screens.slice(0, 4);

  if (system.prototypeLinks?.length && !screens.length) {
    renderAxure(system);
    return;
  }

  elements.content.innerHTML = `
    <section class="system-layout">
      <article class="system-brief">
        <div>
          <span class="status-pill">${escapeHtml(meta.status)}</span>
          <h3>${escapeHtml(meta.owner)}</h3>
          <p>${escapeHtml(meta.description)}</p>
        </div>
        <div class="module-tags">${meta.modules.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}</div>
      </article>
      <article class="workflow-card">
        <h3>系统菜单</h3>
        <div class="menu-map">
          ${meta.modules.map((item) => `<button type="button" data-module="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
        </div>
      </article>
    </section>
    <section class="featured-screens">
      ${featured
        .map(
          (screen, index) => `
            <button class="featured-card is-${screen.kind}" type="button" data-index="${index}">
              <img src="${encodeURI(screen.path)}" alt="${escapeHtml(screen.title)}" />
              <span>${escapeHtml(screen.title)}</span>
            </button>
          `,
        )
        .join("")}
    </section>
  `;

  elements.content.querySelectorAll("[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedIndex = Number(button.dataset.index);
      state.mode = "preview";
      renderContent();
    });
  });

  elements.content.querySelectorAll("[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.search.value = button.dataset.module;
      state.query = button.dataset.module.toLowerCase();
      state.mode = "grid";
      renderContent();
    });
  });
}

function renderGrid(screens) {
  elements.content.innerHTML = `<div class="grid"></div>`;
  const grid = elements.content.firstElementChild;

  screens.forEach((screen, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `screen-card is-${screen.kind}`;
    card.innerHTML = `
      <div class="thumb"><img loading="lazy" src="${encodeURI(screen.path)}" alt="${escapeHtml(screen.title)}" /></div>
      <div class="card-title"><span>${escapeHtml(screen.title)}</span><span class="badge">${screen.kind === "phone" ? "手机" : "PC"}</span></div>
    `;
    card.addEventListener("click", () => {
      state.selectedIndex = index;
      state.mode = "preview";
      renderContent();
    });
    grid.appendChild(card);
  });
}

function renderPreview(screens) {
  const selected = screens[Math.min(state.selectedIndex, screens.length - 1)];
  elements.content.innerHTML = `
    <div class="preview">
      <div class="page-list"></div>
      <div class="stage is-${selected.kind}">
        <img src="${encodeURI(selected.path)}" alt="${escapeHtml(selected.title)}" />
      </div>
    </div>
  `;

  const list = elements.content.querySelector(".page-list");
  screens.forEach((screen, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = screen.title;
    button.classList.toggle("is-active", index === state.selectedIndex);
    button.addEventListener("click", () => {
      state.selectedIndex = index;
      renderPreview(screens);
    });
    list.appendChild(button);
  });
}

function renderAxure(system) {
  const meta = metaFor(system);
  elements.content.innerHTML = `
    <section class="system-brief wide">
      <div>
        <span class="status-pill">${escapeHtml(meta.status)}</span>
        <h3>${escapeHtml(meta.owner)}</h3>
        <p>${escapeHtml(meta.description)}</p>
      </div>
      <div class="module-tags">${meta.modules.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}</div>
    </section>
    <div class="axure-grid"></div>
  `;
  const grid = elements.content.querySelector(".axure-grid");

  system.prototypeLinks.forEach((link) => {
    const card = document.createElement("article");
    card.className = "axure-card";
    card.innerHTML = `
      <h3>${escapeHtml(link.title)}</h3>
      <p>${escapeHtml(link.description)}</p>
      <a href="${encodeURI(link.path)}" target="_blank" rel="noreferrer">进入原型</a>
    `;
    grid.appendChild(card);
  });
}

function pickCover(system) {
  const screens = system.screens || [];
  return screens.find((screen) => screen.kind === "desktop") || screens[0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
