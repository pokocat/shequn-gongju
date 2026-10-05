import { useState } from "react";
import { Shield, Plus, Check, X, Eye, Edit, Trash2, Download, CheckSquare } from "lucide-react";
import { S, useThemeSingleton } from "../theme";
const roles = [
  { id: 1, name: "平台管理员", color: S.text, users: ["王总"], desc: "平台全局配置、权限模板与敏感操作审批" },
  { id: 2, name: "区域管理员", color: S.text, users: ["吴思远（北京）", "林小燕（上海）", "刘刚（广州）"], desc: "管理所在区域的项目、群与运营资源" },
  { id: 3, name: "项目负责人", color: S.text, users: ["张副总"], desc: "项目管理、服务关系与资源统筹" },
  { id: 4, name: "项目运营", color: S.text, users: ["李运营总"], desc: "项目数据、活动配置与团队协同" },
  { id: 5, name: "社群运营", color: S.text, users: ["小陈"], desc: "群运营、群分配与运营数据查看" },
  { id: 6, name: "服务老师", color: S.text, users: ["吴思远", "林小燕", "刘刚", "李梦华", "赵志远"], desc: "社群任务、服务记录与会员跟进" },
  { id: 7, name: "客服专员", color: S.text, users: ["小王", "小李"], desc: "会员查询、工单处理与服务群查看" },
  { id: 8, name: "内容运营", color: S.text, users: ["内容王", "内容赵"], desc: "内容资源管理与媒体账号协同" },
  { id: 9, name: "财务运营", color: S.text, users: ["财务张", "财务李"], desc: "订单、退款与财务报表查看" },
];

const modules = [
  "后台总览", "账号资产", "微信管理", "社群管理", "群分配", "用户操作台", "支付订单", "工单中心", "权限设置", "城市分站",
];

const permMatrix: Record<string, Record<string, number[]>> = {
  "平台管理员": { "后台总览": [1, 1, 1, 1], "账号资产": [1, 1, 1, 1], "微信管理": [1, 1, 1, 1], "社群管理": [1, 1, 1, 1], "群分配": [1, 1, 1, 1], "用户操作台": [1, 1, 1, 1], "支付订单": [1, 1, 1, 1], "工单中心": [1, 1, 1, 1], "权限设置": [1, 1, 1, 1], "城市分站": [1, 1, 1, 1] },
  "项目负责人": { "后台总览": [1, 1, 1, 0], "账号资产": [1, 1, 1, 0], "微信管理": [1, 1, 1, 0], "社群管理": [1, 1, 1, 0], "群分配": [1, 1, 1, 0], "用户操作台": [1, 1, 1, 0], "支付订单": [1, 1, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [1, 0, 0, 0], "城市分站": [1, 1, 1, 0] },
  "区域管理员": { "后台总览": [1, 0, 0, 0], "账号资产": [1, 1, 0, 0], "微信管理": [1, 1, 0, 0], "社群管理": [1, 1, 1, 0], "群分配": [1, 1, 1, 0], "用户操作台": [1, 1, 0, 0], "支付订单": [1, 0, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [0, 0, 0, 0], "城市分站": [1, 1, 0, 0] },
  "客服专员": { "后台总览": [1, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [1, 0, 0, 0], "群分配": [1, 1, 0, 0], "用户操作台": [1, 1, 0, 0], "支付订单": [1, 0, 0, 0], "工单中心": [1, 1, 1, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
  "服务老师": { "后台总览": [0, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [1, 0, 0, 0], "社群管理": [1, 1, 0, 0], "群分配": [1, 0, 0, 0], "用户操作台": [1, 0, 0, 0], "支付订单": [0, 0, 0, 0], "工单中心": [1, 1, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
  "财务运营": { "后台总览": [1, 0, 0, 0], "账号资产": [0, 0, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [0, 0, 0, 0], "群分配": [0, 0, 0, 0], "用户操作台": [1, 0, 0, 0], "支付订单": [1, 1, 0, 0], "工单中心": [1, 0, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [1, 0, 0, 0] },
  "内容运营": { "后台总览": [0, 0, 0, 0], "账号资产": [1, 1, 0, 0], "微信管理": [0, 0, 0, 0], "社群管理": [0, 0, 0, 0], "群分配": [0, 0, 0, 0], "用户操作台": [0, 0, 0, 0], "支付订单": [0, 0, 0, 0], "工单中心": [0, 0, 0, 0], "权限设置": [0, 0, 0, 0], "城市分站": [0, 0, 0, 0] },
};
const unifiedPermMatrix: Record<string, Record<string, number[]>> = {
  ...permMatrix,
  "项目运营": { ...permMatrix["区域管理员"], "权限设置": [0, 0, 0, 0], "支付订单": [0, 0, 0, 0] },
  "社群运营": { ...permMatrix["服务老师"], "群分配": [1, 1, 0, 0], "社群管理": [1, 1, 0, 0] },
};

const permLabels = ["查看", "编辑", "删除", "导出"];
const permIcons = [Eye, Edit, Trash2, Download];

const auditLog = [
  { action: "修改权限", role: "区域管理员", operator: "王总", time: "2026-07-05 09:00", detail: "新增「群分配」编辑权限" },
  { action: "新增员工", role: "客服专员", operator: "张副总", time: "2026-07-04 15:30", detail: "将「小陈」添加到客服专员岗位角色" },
  { action: "撤销权限", role: "财务运营", operator: "王总", time: "2026-07-03 11:00", detail: "移除「退款审批」高风险权限" },
  { action: "创建岗位角色", role: "内容运营", operator: "张副总", time: "2026-07-02 10:00", detail: "新建内容运营岗位角色" },
];

export default function Permissions({ embedded = false }: { embedded?: boolean }) {
  useThemeSingleton();
  const [roleRows, setRoleRows] = useState(roles);
  const [selectedRole, setSelectedRole] = useState<string>("客服专员");
  const [matrix, setMatrix] = useState(unifiedPermMatrix);
  const [editing, setEditing] = useState(false);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const role = roleRows.find(r => r.name === selectedRole) || roleRows[0];
  const perms = matrix[selectedRole] || {};
  const togglePermission = (module: string, permissionIndex: number) => {
    if (!editing) return;
    setMatrix(current => ({ ...current, [selectedRole]: { ...current[selectedRole], [module]: (current[selectedRole]?.[module] || [0, 0, 0, 0]).map((value, index) => index === permissionIndex ? (value ? 0 : 1) : value) } }));
  };
  const addRole = () => {
    const name = newRoleName.trim();
    if (!name || roleRows.some(item => item.name === name)) return;
    setRoleRows(current => [...current, { id: current.length + 1, name, color: S.text, users: [], desc: "自定义岗位角色权限" }]);
    setMatrix(current => ({ ...current, [name]: Object.fromEntries(modules.map(module => [module, [0, 0, 0, 0]])) }));
    setSelectedRole(name); setNewRoleName(""); setNewRoleOpen(false); setEditing(true);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ background: S.bg, fontFamily: "monospace" }}>
      {!embedded && <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold" style={{ color: S.text, fontFamily: "monospace" }}>岗位权限模板</h2>
          <p className="text-xs mt-0.5" style={{ color: S.muted, fontFamily: "monospace" }}>管理岗位角色的默认权限；员工可继承后配置个人例外权益</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold" onClick={() => setNewRoleOpen(true)} style={{ background: "#1e293b", color: S.accent, borderRadius: S.radius, fontFamily: "monospace", border: "none" }}>
          <Plus size={13} /> 新建岗位角色
        </button>
      </div>}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Roles list */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 mb-1"><div className="text-sm font-bold" style={{ color: S.text, fontFamily: "monospace" }}>岗位角色列表（{roleRows.length}）</div><button type="button" className="w-7 h-7 grid place-items-center" title="新增岗位角色" onClick={() => setNewRoleOpen(true)} style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm }}><Plus size={14} /></button></div>
          {newRoleOpen && <div className="p-2" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radiusSm }}><input autoFocus value={newRoleName} onChange={event => setNewRoleName(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addRole(); }} placeholder="岗位角色名称" className="w-full px-2 py-1.5 text-xs outline-none" style={{ background: S.bg, border: `1px solid ${S.borderMed}`, borderRadius: 5 }} /><div className="flex justify-end gap-1 mt-2"><button type="button" className="px-2 py-1 text-[10px]" onClick={() => setNewRoleOpen(false)}>取消</button><button type="button" className="px-2 py-1 text-[10px] font-bold" style={{ background: S.ink, color: S.accent, borderRadius: 4 }} onClick={addRole}>创建</button></div></div>}
          {roleRows.map(r => (
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
                <div className="text-xs" style={{ color: selectedRole === r.name ? S.mutedLight : S.muted, fontFamily: "monospace" }}>{r.users.length} 人 · {r.desc}</div>
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
                <div className="mt-2 text-[10px]" style={{ color: S.muted, fontFamily: "monospace" }}>已启用权限：{Object.values(perms).flat().filter(Boolean).length} 项</div>
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
              <div className="flex-1 font-bold" style={{ color: "#475569", fontFamily: "monospace" }}>功能模块{editing ? " · 表单编辑" : ""}</div>
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
                      <button key={i} type="button" aria-label={`${mod}${permLabels[i]}`} className={`w-16 flex justify-center ${editing ? "cursor-pointer" : "cursor-default"}`} onClick={() => togglePermission(mod, i)} aria-pressed={Boolean(v)} disabled={!editing}>
                        {v ? (
                          <div className="w-5 h-5 flex items-center justify-center" style={{ background: S.accent, borderRadius: S.radiusSm }}>
                            <Check size={11} style={{ color: S.onPrimary }} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center" style={{ background: "#f1f5f9", borderRadius: S.radiusSm }}>
                            <X size={11} style={{ color: "#999" }} />
                          </div>
                        )}
                      </button>
                    ))}
                    <div className="w-16 flex justify-center">
                      <button type="button" className="text-xs px-2 py-1 font-bold" onClick={() => setEditing(true)} style={{ background: editing ? S.accent : "#1e293b", color: editing ? "#ffffff" : S.accent, borderRadius: S.radiusSm, fontFamily: "monospace", border: "none" }}>{editing ? "编辑中" : "编辑"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {editing && <div className="flex items-center justify-between gap-3 px-3 py-2.5" style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: S.radius }}><span className="text-[10px]" style={{ color: S.muted }}>点击权限单元格切换；保存后将作为该岗位角色的默认权限生效</span><div className="flex gap-2"><button type="button" className="px-3 py-1.5 text-xs" onClick={() => { setMatrix(unifiedPermMatrix); setEditing(false); }} style={{ background: S.bg, color: S.textSec, border: `1px solid ${S.borderMed}`, borderRadius: S.radiusSm }}>取消修改</button><button type="button" className="px-3 py-1.5 text-xs font-bold" onClick={() => setEditing(false)} style={{ background: S.ink, color: S.accent, borderRadius: S.radiusSm }}>保存模板</button></div></div>}
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
