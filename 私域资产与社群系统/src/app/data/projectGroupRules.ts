export type AllocationMode = "轮巡分配" | "统一分配" | "定向分配" | "漏斗分层";

export type GroupTypeRule = {
  id: string;
  name: string;
  code: string;
  tier: "引流" | "培育" | "转化" | "交付" | "服务" | "IP私域";
  memberRoles: string[];
  entryCondition: string;   // 入群条件（规则预览展示用）
  capacity: number;        // 单群容量（微信限制等）
  cities: string[];        // 默认适用地区，"全国" 表示跨城市
  allocationMode: AllocationMode;
  nameTemplate: string;    // 群命名模板
  enabled: boolean;
  // 规则预览增强字段
  retentionGoal?: string;  // 留存/运营目标
  weeklyOps?: string;      // 每周运营 SOP 简述
  tagColor?: string;       // 胶囊底色（可选）
};

export type WechatAccount = {
  id: string;
  project: string;
  wechat: string;
  city: string;
  createdAt: string;
  service: string;
  enabled: boolean;
  groupCapacity: number;
};

export const regionCodes: Record<string, string> = {
  北京: "B", 吉林: "J", 上海: "H", 广州: "G", 深圳: "S", 成都: "C", 杭州: "Z", 武汉: "W", 南京: "N", 西安: "XA", 全国: "X",
};

// ────────────────────────────────────────────────────────────
//  12 大 AI 产品线 × 专属群类型漏斗体系
//  每个产品一般都包含：引流层 → 培育层 → 转化层 → 交付/服务层 → IP私域层
// ────────────────────────────────────────────────────────────

const LEARN_COMMUNITY: GroupTypeRule[] = [
  // AI 学习社群（AI-LEARN）：C 端学员生命周期 5 层漏斗
  { id: "ai-learn-funnel",   name: "流量营",   code: "AIF01", tier: "引流", memberRoles: ["潜在学员", "免费课用户"],               entryCondition: "任意渠道扫码 + 留手机号 + 0 元公开课",           capacity: 500, cities: ["全国"],                          allocationMode: "轮巡分配", nameTemplate: "AI学习·{city}流量营{seq}群", retentionGoal: "7天留存≥40%，引导到体验营",    weeklyOps: "周一公开课通知 · 周三AI实操 · 周五学员故事",         enabled: true },
  { id: "ai-learn-nurture",  name: "体验营",   code: "AIF02", tier: "培育", memberRoles: ["体验营学员", "7天试学用户"],                  entryCondition: "9.9 元 7 天体验营 + 完成≥3 次打卡作业",          capacity: 500, cities: ["北京", "上海", "广州", "成都", "杭州"], allocationMode: "轮巡分配", nameTemplate: "AI学习·{city}体验营{seq}群", retentionGoal: "结业转化率≥18% → 正价课", weeklyOps: "每日作业点评 · 老师直播答疑 · 结业颁奖",            enabled: true },
  { id: "ai-learn-convert",  name: "选课群",   code: "AIF03", tier: "转化", memberRoles: ["购课意向", "已购单科"],                         entryCondition: "体验营结业 or 老学员续费咨询",                   capacity: 300, cities: ["北京", "上海", "广州"],                allocationMode: "统一分配", nameTemplate: "AI学习·选课{seq}群",        retentionGoal: "正价客单价≥2000，3天转化", weeklyOps: "讲师连麦 · 政策说明 · 限时福利 · 学员案例",        enabled: true },
  { id: "ai-learn-deliver",  name: "正价班级", code: "AIF04", tier: "交付", memberRoles: ["正价课学员", "陪跑营", "年度会员"],              entryCondition: "付费正价课 / 年度会员",                          capacity: 200, cities: ["全国"],                          allocationMode: "定向分配", nameTemplate: "{course}·{city}班{seq}期",   retentionGoal: "完课率≥70%，复购率≥25%",   weeklyOps: "每日上课提醒 · 作业提交 · 1v1 督学回访",           enabled: true },
  { id: "ai-learn-ip",       name: "讲师私域", code: "AIF05", tier: "IP私域", memberRoles: ["老学员铁粉", "续费会员", "合伙人"],              entryCondition: "学习≥ 2 门正价课 + 愿意主动分享",                 capacity: 200, cities: ["全国"],                          allocationMode: "统一分配", nameTemplate: "{teacher}老师·AI私董{seq}群", retentionGoal: "复购+转介绍≥40%",            weeklyOps: "每周闭门分享 · 专属福利 · 线下沙龙邀约",           enabled: true },
];

const NUTRI_PLATFORM: GroupTypeRule[] = [
  // AI 营养补剂会员平台（AI-NUTRI）：保健品/运动/减脂
  { id: "nutri-free",    name: "减脂体验群", code: "NUT01", tier: "引流", memberRoles: ["免费体验用户", "BMI检测客"], entryCondition: "扫码填 BMI 测评 + 领取 7 天减脂食谱", capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI营养·{city}减脂体验{seq}群", retentionGoal: "7天出体验报告→ 会员", weeklyOps: "每日饮食打卡 + AI 营养师点评", enabled: true },
  { id: "nutri-vip",     name: "会员服务群", code: "NUT02", tier: "交付", memberRoles: ["月度会员", "季度会员"],     entryCondition: "付费 299 / 799 会员",              capacity: 300, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{plan}会员·{advisor}{seq}群",  retentionGoal: "季度续费率≥55%",        weeklyOps: "每日 1v1 饮食指导 + 每周体成分复盘", enabled: true },
  { id: "nutri-supp",    name: "运动补剂群", code: "NUT03", tier: "转化", memberRoles: ["健身教练用户", "运动爱好者"], entryCondition: "购买过 ≥1 件运动补剂 + 留微信",    capacity: 300, cities: ["北京", "上海", "深圳"], allocationMode: "统一分配", nameTemplate: "AI补剂·{city}铁粉{seq}群",      retentionGoal: "补剂复购率≥35%",        weeklyOps: "新品体验官招募 + 限时满赠", enabled: true },
  { id: "nutri-anti",    name: "抗衰私享群", code: "NUT04", tier: "IP私域", memberRoles: ["SVIP抗衰用户", "合伙人"],     entryCondition: "年消费≥ 8000 + 邀请制",            capacity: 200, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "AI抗衰·{city}私享{seq}群",       retentionGoal: "年度复购≥60%",          weeklyOps: "专家连线 + 海外抗衰方案", enabled: true },
];

const HOST_COMMUNE: GroupTypeRule[] = [
  // AI 主理人公社（AI-HOST）：KOC/中小店主/私域操盘手学习社
  { id: "host-open",    name: "主理人社群", code: "HOS01", tier: "引流", memberRoles: ["店主/KOC", "私域从业者"], entryCondition: "关注公众号 + 填写主理人问卷",       capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI主理人·{city}开放{seq}群",   retentionGoal: "7天活跃≥30% → 付费社员", weeklyOps: "每周案例拆解直播 + 资源对接", enabled: true },
  { id: "host-member",  name: "社员学习社", code: "HOS02", tier: "培育", memberRoles: ["付费社员", "季度社员"],   entryCondition: "999 元年度社员",                  capacity: 300, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "AI主理人·{term}期社员{seq}群", retentionGoal: "毕业转化率≥25%",          weeklyOps: "每周AI工具课 + 工具包下发", enabled: true },
  { id: "host-mcn",     name: "MCN 内培群", code: "HOS03", tier: "交付", memberRoles: ["签约主理人", "陪跑项目"],   entryCondition: "签约公社 MCN or 陪跑营学员",       capacity: 200, cities: ["北京", "上海", "杭州", "成都"], allocationMode: "定向分配", nameTemplate: "AI陪跑·{project}{seq}班",      retentionGoal: "陪跑交付率≥90%",          weeklyOps: "1v1 陪跑复盘 + 月度数据会", enabled: true },
  { id: "host-city",    name: "城市分社",   code: "HOS04", tier: "服务", memberRoles: ["城市合伙人", "线下沙龙主理"], entryCondition: "城市级社员 + 举办过 ≥1 次线下沙龙", capacity: 200, cities: ["北京", "上海", "成都", "杭州", "广州"], allocationMode: "定向分配", nameTemplate: "公社·{city}分社{seq}群",        retentionGoal: "城市GMV≥20w/季",          weeklyOps: "分社资源对接 + 线下活动策划", enabled: true },
];

const TALENT_INCUBATE: GroupTypeRule[] = [
  // AI 艺人孵化平台（AI-TALENT）：素人 → 练习生 → 签约艺人
  { id: "talent-tryout", name: "海选报名群", code: "TAL01", tier: "引流", memberRoles: ["素人报名者", "短视频用户"],   entryCondition: "填写艺能资料卡 + 15 秒自我介绍视频",  capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI艺人·{city}海选{seq}群", retentionGoal: "入选试镜率≥10%",          weeklyOps: "每周海选榜单 + 选角通知", enabled: true },
  { id: "talent-trainee", name: "练习生学院", code: "TAL02", tier: "培育", memberRoles: ["练习生A/B班", "训练营学员"],   entryCondition: "通过海选面试 + 签约经纪",            capacity: 200, cities: ["北京", "上海", "成都"], allocationMode: "定向分配", nameTemplate: "{term}期·{class}班{seq}群",   retentionGoal: "季度签约率≥35%",          weeklyOps: "课程表 + 老师作业点评 + 月考", enabled: true },
  { id: "talent-debut",   name: "出道运营组", code: "TAL03", tier: "转化", memberRoles: ["即将出道艺人", "宣发团队"],    entryCondition: "练习生结业 or 已有艺人合约",         capacity: 150, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{name}·出道运营{seq}组",     retentionGoal: "首月曝光≥1000w",           weeklyOps: "出道日程同步 + 宣发物料分发", enabled: true },
  { id: "talent-fan",     name: "艺人后援会", code: "TAL04", tier: "IP私域", memberRoles: ["核心粉丝", "后援会管理员"],    entryCondition: "粉籍≥3 月 + 反黑打卡",                capacity: 500, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{name}·官方后援{seq}群",     retentionGoal: "应援参与率≥60%",           weeklyOps: "打榜/应援/生日会/线下见面会", enabled: true },
];

const TALENT_LICENSE: GroupTypeRule[] = [
  // AI 艺人授权平台（AI-TLIP）：品牌方/版权方/肖像授权
  { id: "tlic-brand",   name: "品牌方对接群", code: "TLP01", tier: "引流", memberRoles: ["品牌方采购", "MCN商务"],   entryCondition: "品牌资质认证 + 留名片",         capacity: 300, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "艺人授权·品牌{seq}群",    retentionGoal: "立项意向≥15%",            weeklyOps: "每周艺人 IP 授权目录下发", enabled: true },
  { id: "tlic-negot",   name: "授权谈判组",   code: "TLP02", tier: "转化", memberRoles: ["法务/商务", "已立项品牌"], entryCondition: "有具体授权需求 + 进入报价环节",   capacity: 150, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{brand}×{talent}授权组",   retentionGoal: "签约率≥40%",              weeklyOps: "合同条款同步 + 付款节点提醒", enabled: true },
  { id: "tlic-rights",  name: "版权维权组",   code: "TLP03", tier: "服务", memberRoles: ["法务", "维权代理"],       entryCondition: "已授权品牌 or 版权被侵权方",       capacity: 200, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{talent}·版权维权{seq}组", retentionGoal: "维权胜诉率≥80%",          weeklyOps: "侵权线索分发 + 案件进度同步", enabled: true },
  { id: "tlic-agent",   name: "经纪人私董群", code: "TLP04", tier: "IP私域", memberRoles: ["经纪人合伙人", "平台 VIP"], entryCondition: "季度≥ 5 单经纪约",                 capacity: 150, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "经纪人·授权私董{seq}群",   retentionGoal: "合作续费率≥65%",          weeklyOps: "独家艺人资源 + 闭门对接会", enabled: true },
];

const STAR_CLIP: GroupTypeRule[] = [
  // AI 明星切片平台（AI-STAR）：切片分销团队
  { id: "star-recruit", name: "分销招募群", code: "STC01", tier: "引流", memberRoles: ["短视频创作者", "小B团长"],   entryCondition: "留下剪辑作品 + 渠道账号",         capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "明星切片·{city}招募{seq}群", retentionGoal: "授权开通率≥20%",         weeklyOps: "每周切片任务包 + 爆款案例", enabled: true },
  { id: "star-cut",     name: "切片作业群", code: "STC02", tier: "培育", memberRoles: ["授权分销团长", "剪辑师"],   entryCondition: "开通明星切片授权 + 完成首次剪辑",  capacity: 300, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{star}·切片{seq}群",         retentionGoal: "人均产出≥3条/天",         weeklyOps: "明星最新素材 + 爆款脚本 + 数据榜", enabled: true },
  { id: "star-data",    name: "爆款指挥部", code: "STC03", tier: "转化", memberRoles: ["头部团长", "运营"],        entryCondition: "单条视频≥10w 播放 or 月GMV≥5w",    capacity: 200, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "爆款·{product}指挥{seq}群",  retentionGoal: "ROI≥3",                   weeklyOps: "投放反馈 + 素材迭代 + 佣金结算", enabled: true },
  { id: "star-partner", name: "头部合伙人", code: "STC04", tier: "IP私域", memberRoles: ["MCN级合伙人", "Top 团长"],  entryCondition: "季度GMV≥50w + 自有团队≥5 人",      capacity: 150, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "明星切片·合伙人{seq}群",    retentionGoal: "续约率≥70%",              weeklyOps: "独家 IP 通道 + 年度返点", enabled: true },
];

const SHORT_DRAMA: GroupTypeRule[] = [
  // AI 短剧平台（AI-SHORT）：编剧/导演/演员/投流
  { id: "sd-pitch",     name: "剧本投稿群", code: "DRM01", tier: "引流", memberRoles: ["编剧", "网文作者"],     entryCondition: "提交短剧大纲 or 网文改编版权",     capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI短剧·{city}投稿{seq}群",  retentionGoal: "过审立项率≥8%",          weeklyOps: "每周题材征集 + 剧本点评", enabled: true },
  { id: "sd-crew",      name: "剧组筹备组", code: "DRM02", tier: "培育", memberRoles: ["导演/演员/后期", "剧组"], entryCondition: "剧本立项通过 + 签约剧组",          capacity: 200, cities: ["北京", "上海", "成都", "杭州"], allocationMode: "定向分配", nameTemplate: "{dramaName}·剧组筹备{seq}", retentionGoal: "按时开机率≥90%",         weeklyOps: "分镜确认 + 选角进度 + 排期", enabled: true },
  { id: "sd-launch",    name: "投流运营群", code: "DRM03", tier: "转化", memberRoles: ["投流师", "运营"],      entryCondition: "短剧杀青 or 进入上线窗口期",       capacity: 200, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{dramaName}·投流{seq}组",   retentionGoal: "ROI≥1.3",                weeklyOps: "投放素材 + 实时数据反馈 + 投流策略调整", enabled: true },
  { id: "sd-fans",      name: "追剧铁粉群", code: "DRM04", tier: "IP私域", memberRoles: ["付费追剧用户", "IP铁粉"], entryCondition: "观看≥ 2 部短剧 + 留评",            capacity: 500, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "追剧·{IP}粉丝{seq}群",      retentionGoal: "下一部点击转化率≥30%",  weeklyOps: "新剧提前看 + 演员连麦 + 二创大赛", enabled: true },
];

const SUPER_ADS: GroupTypeRule[] = [
  // AI 超级广告平台（AI-ADS）：广告主/代理商/KOL分发
  { id: "ads-advert",  name: "广告主招商群", code: "ADS01", tier: "引流", memberRoles: ["品牌市场", "代理商"],    entryCondition: "提交公司资质 + 投放预算",         capacity: 300, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "AI广告·广告主{seq}群",    retentionGoal: "首投转化≥12%",            weeklyOps: "每周媒体库存 + 行业案例", enabled: true },
  { id: "ads-brief",    name: "需求对接群",   code: "ADS02", tier: "培育", memberRoles: ["AE/AM", "品牌对接人"],  entryCondition: "开户充值 + 确定 brief",           capacity: 150, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{brand}·{campaign}对接{seq}", retentionGoal: "按时出稿率≥95%",          weeklyOps: "素材确认 + 节奏表同步 + QA", enabled: true },
  { id: "ads-launch",   name: "投放执行群",   code: "ADS03", tier: "转化", memberRoles: ["优化师", "设计师"],    entryCondition: "创意定稿 + 进入投放期",            capacity: 150, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{brand}·投放{seq}组",      retentionGoal: "KPI达成率≥85%",           weeklyOps: "日报+周报 + 素材迭代 + 出价调整", enabled: true },
  { id: "ads-holding",  name: "品牌年框群",   code: "ADS04", tier: "服务", memberRoles: ["年框客户", "KA服务组"],  entryCondition: "年框合同≥100w",                   capacity: 100, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{brand}·KA服务{seq}群",    retentionGoal: "续框率≥70%",              weeklyOps: "季/年度复盘会 + 专属方案", enabled: true },
];

const PAY_KNOWLEDGE: GroupTypeRule[] = [
  // AI 知识付费平台（AI-PAYK）：小鹅通/学浪类，课程+社群
  { id: "payk-funnel",  name: "公开课群",     code: "PKG01", tier: "引流", memberRoles: ["公开课用户", "活动参与用户"], entryCondition: "0 元公开课 or 活动报名",       capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI知识·{topic}公开{seq}群", retentionGoal: "付费转化≥8%",             weeklyOps: "课程预告 + 讲师分享", enabled: true },
  { id: "payk-course",  name: "单课学习群",   code: "PKG02", tier: "培育", memberRoles: ["单课学员", "专栏订阅者"],    entryCondition: "9.9 ~ 999 元单课付费",         capacity: 400, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{course}·学习{seq}群",       retentionGoal: "完课率≥60%",              weeklyOps: "每日学习任务 + 打卡", enabled: true },
  { id: "payk-member",  name: "年度会员营",   code: "PKG03", tier: "交付", memberRoles: ["年度会员", "知识合伙人"],    entryCondition: "1999 / 3999 元年度会员",        capacity: 300, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{tier}会员·{city}{seq}群",   retentionGoal: "年续费率≥55%",            weeklyOps: "每周新课 + 嘉宾分享 + 1v1 顾问", enabled: true },
  { id: "payk-creator", name: "创作者孵化营", code: "PKG04", tier: "IP私域", memberRoles: ["签约创作者", "讲师合伙人"],  entryCondition: "已上线≥1 门课程 + 销售达标",      capacity: 200, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "AI创作·孵化营{seq}期",       retentionGoal: "季度新课产出≥2 门/人",     weeklyOps: "选题策划 + 录制指导 + 宣发分发", enabled: true },
];

const EDU_PLATFORM: GroupTypeRule[] = [
  // AI 教育平台（AI-EDU）：K12/职业教育，长期交付
  { id: "edu-crm",     name: "咨询意向群",   code: "EDU01", tier: "引流", memberRoles: ["家长", "学生", "咨询用户"], entryCondition: "留资 + 领取测评/资料包",       capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI教育·{grade}咨询{seq}群", retentionGoal: "试听到访率≥25%",          weeklyOps: "每日教育干货 + 讲座邀请", enabled: true },
  { id: "edu-trial",   name: "体验课班级",   code: "EDU02", tier: "培育", memberRoles: ["试听学员", "短课营学员"],   entryCondition: "99 元体验营 or 到店试课",       capacity: 200, cities: ["北京", "上海", "广州", "深圳", "成都", "武汉", "西安", "南京", "杭州"], allocationMode: "定向分配", nameTemplate: "{subject}·体验{term}班{seq}", retentionGoal: "正价课转化≥22%",        weeklyOps: "每日上课提醒 + 作业 + 家长会", enabled: true },
  { id: "edu-official", name: "正价课班级",   code: "EDU03", tier: "交付", memberRoles: ["正价课在读学员"],          entryCondition: "年卡/学期卡付费",               capacity: 100, cities: ["北京", "上海", "广州", "深圳", "成都", "武汉", "西安", "南京", "杭州"], allocationMode: "定向分配", nameTemplate: "{grade}{subject}·{teacher}{seq}班", retentionGoal: "续班率≥70%",              weeklyOps: "每日学习任务 + 1v1 辅导 + 每月学情报告", enabled: true },
  { id: "edu-alumni",   name: "升学/校友群",   code: "EDU04", tier: "IP私域", memberRoles: ["优秀学员", "老家长"],     entryCondition: "毕业 or 结课，表现优异",         capacity: 300, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "AI教育·校友{seq}群",         retentionGoal: "转介绍≥1.2 人/家庭",     weeklyOps: "升学路径分享 + 校友活动 + 老带新政策", enabled: true },
];

const AI_STRATEGIST: GroupTypeRule[] = [
  // AI 军师（AI-ADVISOR）：企业老板/高管顾问
  { id: "adsr-open",    name: "老板早读群",  code: "ADV01", tier: "引流", memberRoles: ["企业主", "高管"],          entryCondition: "关注公众号 + 名片认证",       capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "AI军师·{city}早读{seq}群",   retentionGoal: "付费智囊团≥8%",          weeklyOps: "每日 AI 早报 + 行业洞察", enabled: true },
  { id: "adsr-biz",     name: "诊断服务群",  code: "ADV02", tier: "转化", memberRoles: ["诊断客户", "小 B 客户"],    entryCondition: "999 元企业 AI 诊断 + 访谈",   capacity: 200, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{company}·AI诊断{seq}组",    retentionGoal: "咨询续单≥30%",            weeklyOps: "诊断问卷 + 专家访谈排期 + 报告交付", enabled: true },
  { id: "adsr-team",    name: "智囊陪跑团",  code: "ADV03", tier: "交付", memberRoles: ["季度/年度陪跑客户"],        entryCondition: "5w/季 陪跑签约",              capacity: 100, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{company}·AI智囊{seq}团",    retentionGoal: "季度续单率≥65%",          weeklyOps: "每周 AI 落地会 + 执行任务清单", enabled: true },
  { id: "adsr-master",  name: "创始私董会",  code: "ADV04", tier: "IP私域", memberRoles: ["私董会员", "年度 VIP"],    entryCondition: "30w/年 私董协议 + 邀请制",    capacity: 80,  cities: ["全国"], allocationMode: "统一分配", nameTemplate: "AI军师·私董会{seq}",         retentionGoal: "续费率≥80%",              weeklyOps: "双月闭门会 + 资源对接 + 专属顾问", enabled: true },
];

const FOUNDER_IP: GroupTypeRule[] = [
  // AI 创始 IP（AI-FOUND）：创始人个人 IP 打造
  { id: "fip-listen",   name: "IP 围观团",   code: "FIP01", tier: "引流", memberRoles: ["公众号粉丝", "视频号观众"], entryCondition: "关注创始人公域账号 + 留微信",  capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "{name}哥·围观{seq}群",       retentionGoal: "故事/产品转化≥5%",       weeklyOps: "每日创始人语录 + 行业故事", enabled: true },
  { id: "fip-story",    name: "IP 故事营",   code: "FIP02", tier: "培育", memberRoles: ["深度关注用户", "故事群"],   entryCondition: "支付 19.9 故事营 or 转发朋友圈", capacity: 300, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{name}·故事营{seq}期",       retentionGoal: "咨询转化率≥15%",          weeklyOps: "创始人自传连载 + 每周 1 场直播", enabled: true },
  { id: "fip-ipco",     name: "IP 咨询群",   code: "FIP03", tier: "转化", memberRoles: ["IP 打造客户", "陪跑客户"],  entryCondition: "签约 IP 陪跑 9800 起",          capacity: 150, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{name}IP·打造{seq}组",       retentionGoal: "3 月出片率≥80%",          weeklyOps: "定位梳理 + 脚本共创 + 拍摄执行", enabled: true },
  { id: "fip-circle",   name: "创始人圈子",  code: "FIP04", tier: "IP私域", memberRoles: ["联创/股东", "高净值客户"],  entryCondition: "合伙人 or 年费 5w + 邀请制",    capacity: 150, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{name}·创始人圈{seq}",       retentionGoal: "圈层裂变≥3人/人",         weeklyOps: "每月闭门局 + 跨界资源匹配 + 线下私宴", enabled: true },
];

// ────────────────────────────────────────────────────────────
//  全局映射：项目名 → 群类型体系
//  key 必须与 initialProjects 中项目名严格一致
// ────────────────────────────────────────────────────────────

export const projectGroupRules: Record<string, GroupTypeRule[]> = {
  "AI学习社群":       LEARN_COMMUNITY,
  "AI营养补剂会员平台": NUTRI_PLATFORM,
  "AI主理人公社":       HOST_COMMUNE,
  "AI艺人孵化平台":     TALENT_INCUBATE,
  "AI艺人授权平台":     TALENT_LICENSE,
  "AI明星切片平台":     STAR_CLIP,
  "AI短剧平台":         SHORT_DRAMA,
  "AI超级广告平台":     SUPER_ADS,
  "AI知识付费平台":     PAY_KNOWLEDGE,
  "AI教育平台":         EDU_PLATFORM,
  "AI军师":             AI_STRATEGIST,
  "AI创始IP":           FOUNDER_IP,
};

// 当项目名未在上面映射时，用通用 5 层漏斗兜底
const FALLBACK_RULES: GroupTypeRule[] = [
  { id: "fb-lead",   name: "引流群",   code: "FB01", tier: "引流",   memberRoles: ["潜在用户"],         entryCondition: "扫码或活动报名",               capacity: 500, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "{project}·引流{seq}群", retentionGoal: "加粉率≥30%", weeklyOps: "内容推送 + 福利活动", enabled: true },
  { id: "fb-nurture", name: "培育群",   code: "FB02", tier: "培育",   memberRoles: ["注册用户", "意向用户"], entryCondition: "填写资料 or 体验产品",      capacity: 400, cities: ["全国"], allocationMode: "轮巡分配", nameTemplate: "{project}·培育{seq}群", retentionGoal: "转化≥12%",    weeklyOps: "案例分享 + 试用反馈", enabled: true },
  { id: "fb-convert", name: "成交群",   code: "FB03", tier: "转化",   memberRoles: ["付费用户"],          entryCondition: "首次付费",                     capacity: 300, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{project}·成交{seq}群", retentionGoal: "客单价达标",  weeklyOps: "福利 + 复购引导",   enabled: true },
  { id: "fb-deliver", name: "交付群",   code: "FB04", tier: "交付",   memberRoles: ["正式客户"],          entryCondition: "正价产品或服务",               capacity: 200, cities: ["全国"], allocationMode: "定向分配", nameTemplate: "{project}·交付{seq}群", retentionGoal: "NPS≥50",     weeklyOps: "服务交付 + 反馈闭环", enabled: true },
  { id: "fb-vip",     name: "VIP 私域", code: "FB05", tier: "IP私域", memberRoles: ["核心老客"],          entryCondition: "复购≥ 2 次 or 年度≥5000",       capacity: 200, cities: ["全国"], allocationMode: "统一分配", nameTemplate: "{project}·VIP{seq}群",  retentionGoal: "复购≥50%",   weeklyOps: "专属权益 + 私董邀请",  enabled: true },
];

export const wechatAccounts: WechatAccount[] = [
  { id: "FLM001", project: "AI学习社群", wechat: "FLM001", city: "北京", createdAt: "2026-01-08", service: "吴思远", enabled: true, groupCapacity: 20 },
  { id: "FLM002", project: "AI艺人孵化平台", wechat: "FLM002", city: "吉林", createdAt: "2026-02-14", service: "林小燕", enabled: true, groupCapacity: 20 },
  { id: "FLM003", project: "AI知识付费平台", wechat: "FLM003", city: "上海", createdAt: "2026-03-02", service: "刘刚", enabled: true, groupCapacity: 20 },
  { id: "FLM004", project: "AI营养补剂会员平台", wechat: "FLM004", city: "广州", createdAt: "2026-03-18", service: "陈明", enabled: true, groupCapacity: 20 },
  { id: "FLP001", project: "AI短剧平台", wechat: "FLP001", city: "北京", createdAt: "2026-01-06", service: "吴思远", enabled: true, groupCapacity: 20 },
  { id: "FLP002", project: "AI超级广告平台", wechat: "FLP002", city: "上海", createdAt: "2026-02-10", service: "林小燕", enabled: true, groupCapacity: 20 },
  { id: "FLE001", project: "AI明星切片平台", wechat: "FLE001", city: "广州", createdAt: "2026-01-21", service: "刘刚", enabled: true, groupCapacity: 20 },
  { id: "FLE002", project: "AI教育平台", wechat: "FLE002", city: "成都", createdAt: "2026-02-06", service: "陈明", enabled: true, groupCapacity: 20 },
];

// ── 默认群类型规则：AI学习社群（系统主展示场景）
export const defaultGroupTypeRules: GroupTypeRule[] = projectGroupRules["AI学习社群"] ?? FALLBACK_RULES;

/**
 * 根据项目名获取对应群类型体系；未匹配则返回通用 5 层漏斗。
 * @param projectName 分配表单里选择的项目名
 */
export function getGroupRulesForProject(projectName: string | null | undefined): GroupTypeRule[] {
  if (!projectName) return defaultGroupTypeRules;
  return projectGroupRules[projectName] ?? FALLBACK_RULES;
}

export function buildGroupCode(typeCode: string, city: string, sequence: number) {
  const region = regionCodes[city] || "X";
  return `${typeCode.toUpperCase()}${region}${sequence}`;
}

export function buildGroupName(project: string, type: string, city: string, sequence: number, template?: string) {
  const tpl = template || "{project}{type}{city}{seq}群";
  return tpl
    .replace("{project}", project || "")
    .replace("{type}", type || "")
    .replace("{city}", city && city !== "—" ? city : "")
    .replace("{seq}", String(sequence).padStart(2, "0"));
}

export function pickWechatAccount(project: string, city: string, usedGroupCount: Record<string, number>) {
  const candidates = wechatAccounts
    .filter(account => account.project === project && account.enabled && (account.city === city || city === "全国"))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return candidates.find(account => (usedGroupCount[account.id] || 0) < account.groupCapacity) || null;
}

// 规则胶囊颜色（按层级）
export const tierColorMap: Record<GroupTypeRule["tier"], { bg: string; color: string; border: string; dot: string }> = {
  "引流":   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
  "培育":   { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0", dot: "#10b981" },
  "转化":   { bg: "#fef3c7", color: "#92400e", border: "#fde68a", dot: "#f59e0b" },
  "交付":   { bg: "#f3e8ff", color: "#6d28d9", border: "#ddd6fe", dot: "#8b5cf6" },
  "服务":   { bg: "#f0fff4", color: "#276749", border: "#bbf7d0", dot: "#22c55e" },
  "IP私域": { bg: "#fdf2f8", color: "#9d174d", border: "#fbcfe8", dot: "#ec4899" },
};
