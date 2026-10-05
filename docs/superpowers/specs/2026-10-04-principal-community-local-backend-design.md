# 主理人公社本地后端闭环原型设计

## 目标

在现有主理人公社 Taro 小程序/H5 前端之外新增一个可本地启动的后端原型，使用 JSON 文件持久化数据，并通过 `x-demo-member-id` 切换演示身份。目标是验证邀请会员、代理升级、审核、签约、缴费和奖励回收的端到端业务闭环，不作为生产鉴权或生产支付服务。

## 范围

本次原型包含：

- Node.js + Fastify HTTP 服务；
- JSON 文件数据库，支持初始化、读取、原子写入和重置；
- 默认演示会员与请求头切换身份；
- `/mp/*` 前端接口兼容层；
- 本地控制接口或调试控制台，用于推进审核、签约、缴费和逆向事件；
- 邀请关系首次点击锁定；
- 会员支付激活及会员邀请奖励；
- A/B/C 代理资格规则；
- 申请时保存规则快照；
- 申请审核、拒绝原因和重新申请；
- 签约、缴费、正式代理开通；
- 代理邀请奖励；
- 退款、会员失效、代理取消引起的奖励撤回和待扣回；
- API 集成测试与前端构建验证。

不包含：真实微信登录、真实支付、真实电子签约、生产数据库、生产后台权限、真实财务出账。

## 目录与启动

新增目录：

```text
local-backend/
  package.json
  src/
  data/
  public/
```

服务默认监听 `127.0.0.1:8787`。JSON 数据默认位于 `local-backend/data/db.json`，首次启动自动初始化。提供 `npm run dev` 和 `npm test`。

本地原型身份规则：

- 未传 `x-demo-member-id` 时使用 `member-demo-001`；
- 传入请求头后，以该值解析当前演示会员；
- 未知身份返回统一业务错误；
- 身份切换只用于本地测试，不模拟正式 JWT。

预置身份至少包括：

- `member-demo-001`：主理人/邀请人，拥有邀请码和可用余额；
- `member-demo-002`：普通被邀请会员；
- `member-demo-003`：可用于代理申请流程的演示会员。

## 数据模型

`db.json` 保存以下集合：

- `members`：会员状态、会员身份、余额、代理状态；
- `inviteCodes`：邀请码及所属会员；
- `inviteAttributions`：首次点击锁定记录；
- `inviteRelations`：邀请关系与激活状态；
- `inviteRewards`：奖励类型、金额、状态和来源事件；
- `qualificationRules`：当前 A/B/C 规则及版本；
- `agentApplications`：申请状态、身份、申请次数、规则快照和拒绝原因；
- `applicationReviews`：审核历史；
- `contracts`：签约状态；
- `payments`：代理缴费状态；
- `pendingRecoveries`：待扣回金额；
- `auditLogs`：关键状态变更。

所有写操作使用单进程串行写入，并采用临时文件写入后替换原文件，避免中途写坏数据。状态变更同时追加审计日志。

## 核心状态规则

### 邀请归因

首次有效点击邀请码时创建唯一归因记录。后续点击其他邀请码不得覆盖原邀请人。被邀请人未激活时关系状态为 `待激活`，激活后为 `已激活`。

### 会员奖励

被邀请人完成支付并激活后，只发放一次会员邀请奖励。退款或会员失效触发撤回：余额足够时立即扣回并记录 `已扣回`；余额不足时不允许负余额，记录 `待扣回`。后续奖励优先抵扣待扣回金额。

### 代理资格

规则配置包含：

- `mode`：`A`、`B` 或 `C`；
- `requiredInvites`：有效邀请数量；
- `trainingRequired`：是否完成培训/社群任务；
- `version`；
- `effectiveAt`。

A 模式要求会员已激活。B 模式要求有效激活邀请数达到门槛。C 模式除邀请数外还要求演示培训/任务完成。申请资格由服务端计算，不接受客户端直接声明通过。

### 代理申请

申请提交时复制当前生效规则到 `ruleSnapshot`，并建立申请历史。审核中、待签约、待缴费和正式代理状态不能重复提交。拒绝必须记录原因和审核记录；重新提交时重新按当前规则校验并建立新申请版本。

状态流转：

```text
可申请 -> 审核中 -> 待签约 -> 待缴费 -> 正式代理
                  \-> 已拒绝 -> 可重新申请
```

未完成签约或缴费时不得开通代理身份、代理工作台或代理邀请权限。

### 代理奖励

被邀请人完成审核通过、签约、缴费并正式开通代理后，才发放代理邀请奖励。代理取消后按同一扣回规则撤回。

## API

统一响应格式：

```json
{ "code": 0, "message": "", "data": {} }
```

主要接口：

```text
GET  /health
GET  /mp/invite
GET  /mp/invite/qrcode
POST /mp/invite/click
GET  /mp/agent/application
POST /mp/agent/application
GET  /mp/agent/portfolio
GET  /local/demo/members
POST /local/reset
GET  /local/qualification-rules
PUT  /local/qualification-rules
POST /local/members/:memberId/activate
POST /local/members/:memberId/refund
POST /local/members/:memberId/expire
POST /local/agent/applications/:id/review
POST /local/agent/applications/:id/sign
POST /local/agent/applications/:id/pay
POST /local/agents/:memberId/cancel
GET  /local/rewards
```

写接口使用请求头 `Idempotency-Key`；若未提供，原型服务为关键写操作生成一次性操作标识并拒绝同一业务状态的重复推进。当前前端申请接口保持现有请求体 `{ identity, reason }` 兼容。

## 前端接入

本地开发时将主理人 H5 API 基址指向 `http://127.0.0.1:8787`。当前前端调用的 `/mp/invite`、`/mp/agent/application` 和 `/mp/agent/portfolio` 直接由本地服务响应。为了测试不同用户，调试控制台和 API 请求均可设置 `x-demo-member-id`。

正式页面只展示服务端返回的资格、规则版本、合同、缴费和奖励状态，不在前端复制资格判断或奖励计算。

## 调试控制台

本地服务提供轻量控制台，用于：

- 切换演示身份；
- 查看当前邀请关系和奖励；
- 选择 A/B/C 规则；
- 模拟首次点击、激活、退款和失效；
- 提交和审核代理申请；
- 模拟签约、缴费、代理取消；
- 查看待扣回记录和审计日志；
- 重置演示数据。

控制台只服务于原型验证，不替代正式管理后台。

## 错误与权限

- 当前会员由请求头解析，客户端不传 member ID 作为业务主体；
- 查询接口只返回当前身份有权查看的数据；
- 未知身份、非法状态推进和资格不足返回明确业务错误；
- 代理工作台对非正式代理返回 `available: false`，不视为系统异常；
- 不返回手机号、支付账号等敏感字段；
- 所有关键写操作记录旧状态、新状态、操作者和时间。

## 验证标准

1. 服务可启动，`GET /health` 返回成功。
2. 默认身份和 `x-demo-member-id` 身份切换均可用。
3. 首次点击锁定归因，重复点击不能覆盖。
4. 未激活不产生会员奖励，激活后只产生一次奖励。
5. A/B/C 资格结果与规则版本正确。
6. 申请保存规则快照，规则更新不改变历史申请。
7. 审核拒绝可重新申请，审核中不能重复提交。
8. 未完成签约或缴费时不能成为正式代理。
9. 正式代理完成后产生代理奖励。
10. 退款、失效和取消可正确扣回或生成待扣回。
11. JSON 重启后数据仍然存在，重置接口可恢复演示初始状态。
12. API 测试通过，主理人 H5 和微信小程序构建通过。
