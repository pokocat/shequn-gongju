import { useState } from "react";
import { Shield, Plus, Check, X, Eye, Edit, Trash2, Download, CheckSquare } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const roles = [
  { id: 1, name: "创始人", color: S.text, users: ["王总"], desc: "全部权限，包含敏感操作和数据导出" },
  { id: 2, name: "联合创始人", color: S.text, users: ["张副总", "李运营总"], desc: "除财务审批外全部权限" },
  { id: 3, name: "区域管理员", color: S.text, users: ["吴思远（北京）", "林小燕（上海）", "刘刚（广州）"], desc: "管理所在区域全部资源" },
  { id: 4, name: "客服", color: S.text, users: ["小王", "小李", "小陈"], desc: "用户查询、工单处理、退款发起" },
  { id: 5, name: "服务老师", color: S.text, users: ["吴思远", "林小燕", "刘刚", "李梦华", "赵志远"], desc: "社群管理、任务处理、基础用户查看" },
  { id: 6, name: "财务运营", color: S.text, users: ["财务张", "财务李"], desc: "订单查看、退款审批、财务报表" },
  { id: 7, name: "内容运营", color: S.text, users: ["内容王", "内容赵"], desc: "媒体账号管理、内容发布" },
];

const modules = [
  "后台总览", "账号资产", "微信管理", "社群管理", "群分配", "用户操作台", "支付订单", "工单中心", "权限设置", "城市分站",
];

const permMatrix: Record<string, Record<string, number[]>> = {
  "创始人": { "后台总览": [1, 1, 1, 1], "账号资产": [1, 1, 1, 1], "微信管理": [1, 1, 1, 1], "社群管理": [1, 1, 1, 1], "群分配": [1, 1, 1, 1], "用户操作台": [1, 1, 1, 1], "支付订单": [1, 1, 1, 1], "工单中心": [1, 1, 1, 1], "权限设置": [1, 1, 1, 1], "城市分站": [1, 1, 1, 1] },
  "联合创始人": { "后台总览": [1, 1, 1, 0], "账号资产": [1, 1, 1, 0], "微信管理": [1, 1, 1, 0], "社群管理": [1, 1, 1, 0], "群分配": [1, 1, 1, 0], "用户操作台": [1, 1, 1, 0], "支付订单": [1, 1, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [1, 0, 0, 0], "城市分站": [1, 1, 1, 0] },
  "区域管理员": { "后台总览": [1, 0, 0, 0], "账号资产": [1, 1, 0, 0], "微信管理": [1, 1, 0, 0], "社群管理": [1, 1, 1, 0], "群分配": [1, 1, 1, 0], "用户操作台": [1, 1, 0, 0], "支付订单": [1, 0, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [0, 0, 0, 0], "城市分站": [1, 1, 0, 0] },
  "客服": { "后台总览": [1, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [1, 0, 0, 0], "群分配": [1, 1, 0, 0], "用户操作台": [1, 1, 0, 0], "支付订单": [1, 0, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
  "服务老师": { "后台总览": [0, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [1, 0, 0, 0], "社群管理": [1, 1, 0, 0], "群分配": [1, 0, 0, 0], "用户操作台": [1, 0, 0, 0], "支付订单": [0, 0, 0, 0], "工单中心": [1, 1, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
  "财务运营": { "后台总览": [1, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [0, 0, 0, 0], "群分配": [0, 0, 0, 0], "用户操作台": [1, 0, 0, 0], "支付订单": [1, 1, 0, 0], "工单中心": [1, 0, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [1, 0, 0, 0] },
  "内容运营": { "后台总览": [0, 0, 0, 0], "账号资产": [1, 1, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [0, 0, 0, 0], "群分配": [0, 0, 0, 0], "用户操作台": [0, 0, 0, 0], "支付订单": [0, 0, 0, 0], "工单中心": [0, 0, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
};

const permLabels = ["查看", "编辑", "删除", "导出"];
const permIcons = [Eye, Edit, Trash2, Download];

const auditLog = [
  { action: "修改权限", role: "区域管理员", operator: "王总", time: "2026-07-05 09:00", detail: "新增「群分配」编辑权限" },
  { action: "新增用户", role: "客服", operator: "张副总", time: "2026-07-04 15:30", detail: "将「小陈」添加到客服角色" },
  { action: "撤销权限", role: "财务运营", operator: "王总", time: "2026-07-03 11:00", detail: "移除「退款审批」高风险权限" },
  { action: "创建角色", role: "内容运营", operator: "张副总", time: "2026-07-02 10:00", detail: "新建内容运营角色" },
];

export default function Permissions() {
  useThemeSingleton();
const [selectedRole, setSelectedRole] = useState<string>("客服");

  const role = roles.find(r => r.name === selectedRole)!;
  const perms = permMatrix[selectedRole] || {};

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>权限设置</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理角色、模块权限、数据范围及高风险操作审批</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
          <Plus size={13} /> 新建角色
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Roles list */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-2">
          <div className="text-xs px-1 mb-1 font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>角色列表 ({roles.length})</div>
          {roles.map(r => (
            <button
              key={r.id}
              className="flex items-center gap-2.5 px-3 py-2.5 text-left transition-all font-bold"
              style={{
                background: selectedRole === r.name ? "#1e293b" : S.surface,
                border: `1px solid ${selectedRole === r.name ? "#1e293b" : S.border}`,
                borderRadius: S.radius,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onClick={() => setSelectedRole(r.name)}
            >
              <div className="w-2 h-2 flex-shrink-0" style={{ background: selectedRole === r.name ? S.accent : S.border, borderRadius: "50%" }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold" style={{ color: selectedRole === r.name ? S.accent : S.text, fontFamily: "monospace" }}>{r.name}</div>
                <div className="text-xs" style={{ color: selectedRole === r.name ? S.mutedLight : S.muted, fontFamily: "monospace" }}>{r.users.length} 人</div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Role header */}
          <div className="p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}>
                <Shield size={18} style={{ color: S.accent }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{role.name}</div>
                <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{role.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold" style={{ color: S.muted, fontFamily: "monospace" }}>当前成员</div>
                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                  {role.users.map(u => (
                    <span key={u} className="px-1.5 py-0.5 text-xs font-bold" style={{ background: "#f1f5f9", color: S.text, borderRadius: S.radiusSm, border: `1px solid ${S.border}`, fontFamily: "monospace" }}>{u}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Permission matrix table */}
          <div className="overflow-hidden flex-1" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex text-xs px-4 py-2.5 items-center" style={{ background: "#f1f5f9", borderBottom: `1px solid ${S.borderMed}`, borderRadius: `${S.radius} ${S.radius} 0 0` }}>
              <div className="flex-1 font-bold" style={{ color: "#475569", fontFamily: "monospace" }}>功能模块</div>
              {permLabels.map((l, i) => {
                const Icon = permIcons[i];
                return (
                  <div key={l} className="w-16 text-center flex items-center justify-center gap-1 font-bold" style={{ color: "#475569", fontFamily: "monospace" }}>
                    <Icon size={11} />{l}
                  </div>
                );
              })}
              <div className="w-16 text-center font-bold" style={{ color: "#475569", fontFamily: "monospace" }}>操作</div>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 520px)" }}>
              {modules.map((mod, idx) => {
                const p = perms[mod] || [0, 0, 0, 0];
                return (
                  <div key={mod} className="flex items-center px-4 py-3" style={{ borderBottom: `1px solid ${S.border}`, background: idx % 2 === 0 ? S.surface : S.bg }}>
                    <div className="flex-1 text-xs font-bold" style={{ color: S.textSec, fontFamily: "monospace" }}>{mod}</div>
                    {p.map((v, i) => (
                      <div key={i} className="w-16 flex justify-center">
                        {v ? (
                          <div className="w-5 h-5 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
                            <Check size={11} style={{ color: S.onPrimary }} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}>
                            <X size={11} style={{ color: "#999" }} />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="w-16 flex justify-center">
                      <button className="text-xs px-2 py-1 font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }}>编辑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="w-60 flex-shrink-0 p-4" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={14} style={{ color: S.text }} />
            <div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>操作审计日志</div>
          </div>
          <div className="space-y-4">
            {auditLog.map((l, i) => (
              <div key={i} className="relative pl-3">
                <div className="absolute left-0 top-1.5 w-1.5 h-1.5" style={{ background: S.accent, borderRadius: "50%", border: "2px solid #1e293b" }} />
                <div className="text-xs font-bold" style={{ color: S.text, fontFamily: "monospace" }}>{l.action}</div>
                <div className="text-xs mt-0.5 font-bold inline-block px-2 py-0.5" style={{ color: S.accent, background: "#f1f5f9", borderRadius: S.radiusSm, fontFamily: "monospace" }}>{l.role}</div>
                <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{l.detail}</div>
                <div className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>{l.operator} · {l.time}</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-bold" style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
            查看完整日志
          </button>
        </div>
      </div>
    </div>
  );
}
