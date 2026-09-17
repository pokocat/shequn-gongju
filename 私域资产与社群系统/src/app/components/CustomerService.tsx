import { useLayoutEffect, useMemo, useState } from "react";
import { getAvatar } from "./Avatar";
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  QrCode,
  ExternalLink,
  Archive,
  Users,
  ShieldCheck,
  UserRoundCog,
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";
import { S, useThemeSingleton } from "../theme";
import { mockAccounts, roleKeyMeta } from "../data/accountTypes";
import Permissions from "./Permissions";
const PAGE_SIZE = 8;
const unifiedRoleOptions = [
  "平台管理员",
  "区域管理员",
  "项目负责人",
  "项目运营",
  "社群运营",
  "服务老师",
  "客服专员",
  "内容运营",
  "财务运营",
];

// ─── 模拟数据 ─────────────────────────────────────────────────
const csStaff = [
  {
    id: 1,
    no: "00001",
    gender: "女",
    name: "杨桂英",
    phone: "13732112621",
    account: "admin1",
    password: "T7321021",
    area: "华北/吉林",
    area2: "华北/吉林/吉林市",
    role: "探哥",
    wechatCount: 0,
    groupCount: 0,
    qqNo: "暂无",
    qqEmail: "暂无",
    qqGroup: "暂无",
    wechatId: "暂无",
    recruitTime: "暂无",
    qrLink: "暂无",
    wechats: [],
  },
  {
    id: 2,
    no: "00009",
    gender: "女",
    name: "李娜",
    phone: "13732112621",
    account: "admin2",
    password: "S8432012",
    area: "华南/广西",
    area2: "华南/广西/南宁市",
    role: "假面",
    wechatCount: 8,
    groupCount: 30,
    qqNo: "345678921",
    qqEmail: "lina@qq.com",
    qqGroup: "南宁会员群",
    wechatId: "wx_gx_01",
    recruitTime: "2024-03-15",
    qrLink: "https://wx.qq.com/qr/001",
    wechats: ["ECO001", "ECO002"],
  },
  {
    id: 3,
    no: "00002",
    gender: "男",
    name: "吴杰",
    phone: "15796482156",
    account: "admin3",
    password: "A9821034",
    area: "华东/安徽",
    area2: "华东/安徽/合肥市",
    role: "探哥",
    wechatCount: 5,
    groupCount: 30,
    qqNo: "412893047",
    qqEmail: "wujie@qq.com",
    qqGroup: "合肥会员群",
    wechatId: "wx_ah_01",
    recruitTime: "2024-05-20",
    qrLink: "https://wx.qq.com/qr/002",
    wechats: ["ECO003", "ECO004", "ECO005"],
  },
  {
    id: 4,
    no: "00003",
    gender: "女",
    name: "傅小小",
    phone: "18965442359",
    account: "admin4",
    password: "P4532198",
    area: "华东/浙江",
    area2: "华东/浙江/杭州市",
    role: "假面",
    wechatCount: 6,
    groupCount: 30,
    qqNo: "523019483",
    qqEmail: "fuxiao@qq.com",
    qqGroup: "杭州会员群",
    wechatId: "wx_hz_02",
    recruitTime: "2024-02-10",
    qrLink: "https://wx.qq.com/qr/003",
    wechats: ["ECO001", "ECO006"],
  },
  {
    id: 5,
    no: "00004",
    gender: "男",
    name: "李超",
    phone: "14562358974",
    account: "admin5",
    password: "Q3219087",
    area: "华西/甘肃",
    area2: "华西/甘肃/兰州市",
    role: "假面",
    wechatCount: 9,
    groupCount: 30,
    qqNo: "634102938",
    qqEmail: "lichao@qq.com",
    qqGroup: "兰州会员群",
    wechatId: "wx_gs_01",
    recruitTime: "2024-06-01",
    qrLink: "https://wx.qq.com/qr/004",
    wechats: ["ECO002", "ECO007"],
  },
  {
    id: 6,
    no: "00005",
    gender: "男",
    name: "邓磊",
    phone: "13754821454",
    account: "admin6",
    password: "W6781245",
    area: "华中/河北",
    area2: "华中/河北/石家庄",
    role: "探哥",
    wechatCount: 1,
    groupCount: 30,
    qqNo: "745293018",
    qqEmail: "denglei@qq.com",
    qqGroup: "石家庄会员群",
    wechatId: "wx_hb_01",
    recruitTime: "2024-01-08",
    qrLink: "https://wx.qq.com/qr/005",
    wechats: ["ECO003"],
  },
  {
    id: 7,
    no: "00006",
    gender: "男",
    name: "何杰",
    phone: "14858944572",
    account: "admin7",
    password: "E5431987",
    area: "华南/广西",
    area2: "华南/广西/桂林市",
    role: "假面",
    wechatCount: 1,
    groupCount: 30,
    qqNo: "856304721",
    qqEmail: "hejie@qq.com",
    qqGroup: "桂林会员群",
    wechatId: "wx_gl_01",
    recruitTime: "2024-04-12",
    qrLink: "https://wx.qq.com/qr/006",
    wechats: ["ECO004"],
  },
  {
    id: 8,
    no: "00007",
    gender: "男",
    name: "徐尚",
    phone: "15648295763",
    account: "admin8",
    password: "R2198765",
    area: "华北/辽宁",
    area2: "华北/辽宁/沈阳市",
    role: "假面",
    wechatCount: 3,
    groupCount: 30,
    qqNo: "967415830",
    qqEmail: "xushang@qq.com",
    qqGroup: "沈阳会员群",
    wechatId: "wx_ln_01",
    recruitTime: "2023-11-20",
    qrLink: "https://wx.qq.com/qr/007",
    wechats: ["ECO001", "ECO005", "ECO006"],
  },
  {
    id: 9,
    no: "00008",
    gender: "女",
    name: "谭敏仪",
    phone: "15487235464",
    account: "admin9",
    password: "T1987432",
    area: "华中/河北",
    area2: "华中/河北/保定市",
    role: "假面",
    wechatCount: 4,
    groupCount: 30,
    qqNo: "108526394",
    qqEmail: "tanmin@qq.com",
    qqGroup: "保定会员群",
    wechatId: "wx_bd_01",
    recruitTime: "2024-07-05",
    qrLink: "https://wx.qq.com/qr/008",
    wechats: ["ECO002", "ECO003", "ECO007"],
  },
  {
    id: 10,
    no: "00010",
    gender: "女",
    name: "陈小芬",
    phone: "13987654321",
    account: "admin10",
    password: "Y9871234",
    area: "华东/江苏",
    area2: "华东/江苏/南京市",
    role: "探哥",
    wechatCount: 6,
    groupCount: 30,
    qqNo: "219873456",
    qqEmail: "chenfen@qq.com",
    qqGroup: "南京会员群",
    wechatId: "wx_nj_02",
    recruitTime: "2024-03-28",
    qrLink: "https://wx.qq.com/qr/009",
    wechats: ["ECO004", "ECO005"],
  },
];
const normalizeRoleLabel = (label: string) =>
  ({
    探哥: "服务老师",
    假面: "客服专员",
    超级管理员: "平台管理员",
    平台管理员: "平台管理员",
    生态负责人: "项目负责人",
    SaaS负责人: "项目负责人",
    生态COO: "项目负责人",
    平台运营: "项目运营",
    SaaS运营: "项目运营",
    区域运营: "区域管理员",
    老师: "服务老师",
    客服: "客服专员",
  })[label] || label;

const employeeStaff = [
  ...csStaff.map((staff) => {
    const role = normalizeRoleLabel(staff.role);
    return {
      ...staff,
      role,
      roles: [role],
      source: "service" as const,
      serviceOfficer: role === "服务老师" ? "吴思远" : "林小燕",
      projects: ["AI学习社群"],
      department: "客户服务中心",
    };
  }),
  ...mockAccounts.map((account, index) => {
    const roles = Array.from(
      new Set(
        account.identities
          .map((identity) => normalizeRoleLabel(identity.label))
          .filter((role) => role !== "平台运营"),
      ),
    );
    return {
      id: 100 + index,
      no: `EMP${String(index + 1).padStart(3, "0")}`,
      gender: index % 2 ? "女" : "男",
      name: account.name,
      phone: account.phone,
      account: account.email.split("@")[0],
      password: "",
      area:
        account.identities
          .find((identity) => identity.scopeType === "city")
          ?.scopeIds.join("/") || "全国",
      area2:
        account.identities
          .find((identity) => identity.scopeType === "city")
          ?.scopeIds.join(" / ") || "跨项目",
      role: roles.join(" / ") || "待配置",
      roles,
      wechatCount: account.assignedToolIds.length,
      groupCount: 0,
      qqNo: "—",
      qqEmail: account.email,
      qqGroup: "—",
      wechatId: "—",
      recruitTime: account.createdAt,
      qrLink: "—",
      wechats: [],
      source: "employee" as const,
      serviceOfficer: account.identities.some(
        (identity) => identity.roleKey === "service",
      )
        ? account.name
        : "—",
      projects: account.projectIds,
      department:
        account.identities
          .find((identity) => identity.scopeType === "city")
          ?.scopeIds.join(" / ") || "集团中心",
    };
  }),
];

const serviceOfficerRows = mockAccounts
  .filter(
    (account) =>
      account.status === "active" &&
      account.identities.some((identity) =>
        ["service", "project_owner", "regional_op"].includes(identity.roleKey),
      ),
  )
  .map((account) => ({
    uid: account.uid,
    name: account.name,
    phone: account.phone,
    roles: account.identities
      .filter((identity) =>
        ["service", "project_owner", "regional_op"].includes(identity.roleKey),
      )
      .map((identity) =>
        normalizeRoleLabel(roleKeyMeta[identity.roleKey].label),
      ),
    projects: account.projectIds,
    cities: account.identities
      .filter((identity) => identity.scopeType === "city")
      .flatMap((identity) => identity.scopeIds),
    activeTools: account.assignedToolIds.length,
  }));

const projectLabels: Record<string, string> = {
  p_beijing_pro: "北京 PRO 会员",
  p_shanghai_exp: "上海体验官",
  p_guangzhou_train: "广州代理培训",
  p_chengdu: "成都分站",
  p_shenzhen: "深圳代理",
  p_eco_invite: "生态招商",
  p_course_train: "7 日训练营",
  p_advanced_class: "进阶班",
  p_member_club: "会员俱乐部",
};
const projectLabel = (id: string) => projectLabels[id] || id;
type EmployeeRow = (typeof employeeStaff)[number];
const getNextEmployeeNo = (rows: Array<{ no: string }>) => {
  const maxSerial = rows.reduce((max, row) => {
    const match = row.no.match(/(\d+)$/);
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  return `EMP-${String(maxSerial + 1).padStart(6, "0")}`;
};

const wechatTabs = [
  "ECO001",
  "ECO002",
  "ECO003",
  "ECO004",
  "ECO005",
  "ECO006",
  "ECO007",
];

const groupDetail = Array.from({ length: 10 }, (_, i) => ({
  groupNo: `0000${i + 1}`,
  name: `体验官${i + 1}群`,
  orgName: [
    "北京分社",
    "上海分社",
    "广州分社",
    "深圳分社",
    "成都分社",
    "杭州分社",
    "武汉分社",
    "南京分社",
    "西安分社",
    "重庆分社",
  ][i],
  groupInCount: [3, 2, 4, 1, 2, 3, 1, 2, 1, 2][i],
  wechat: [
    "ECO001",
    "ECO002",
    "ECO001",
    "ECO003",
    "ECO002",
    "ECO001",
    "ECO004",
    "ECO002",
    "ECO003",
    "ECO001",
  ][i],
  serviceStaff: [
    "吴思远",
    "林小燕",
    "刘刚",
    "李梦华",
    "陈明",
    "吴思远",
    "林小燕",
    "张磊",
    "孙浩",
    "陈明",
  ][i],
  groupOwner: [
    "思远",
    "小燕",
    "刘刚",
    "梦华",
    "陈明",
    "吴思远",
    "林小燕",
    "张磊",
    "孙浩",
    "陈明",
  ][i],
  manualCount: [12, 8, 15, 6, 10, 9, 7, 11, 5, 13][i],
  friendCount: [487, 356, 234, 310, 140, 198, 120, 215, 89, 175][i],
  memberCount: [100, 786, 491, 200, 204, 500, 380, 308, 150, 260][i],
  actualCount: [98, 780, 488, 195, 200, 495, 375, 302, 148, 255][i],
  status: [
    "配置完成",
    "待配置",
    "配置完成",
    "配置完成",
    "待配置",
    "配置完成",
    "配置完成",
    "配置完成",
    "待配置",
    "配置完成",
  ][i],
  type: [
    "体验官群",
    "游客群",
    "PRO会员群",
    "尊享群",
    "体验官群",
    "家族群",
    "游客群",
    "分站群",
    "体验官群",
    "PRO会员群",
  ][i],
  updatedAt: [
    "2026-07-05",
    "2026-07-04",
    "2026-06-28",
    "2026-07-05",
    "2026-07-01",
    "2026-07-05",
    "2026-07-03",
    "2026-07-05",
    "2026-06-20",
    "2026-07-04",
  ][i],
}));

const getAssignedWechatIds = (staff: (typeof csStaff)[0]) =>
  Array.from(new Set(staff.wechats));
const getManagedGroupCount = (staff: (typeof csStaff)[0]) => {
  const assigned = getAssignedWechatIds(staff);
  return groupDetail.filter((group) => assigned.includes(group.wechat)).length;
};

// ─── 岗位角色与权限模板 ───────────────────────────────────────
const roleTemplates: Record<string, string> = {
  平台管理员: "平台全局配置、账号资产、权限模板与敏感操作审批",
  区域管理员: "区域资源管理、群分配、区域运营数据查看",
  项目负责人: "项目管理、服务关系、项目资源查看",
  项目运营: "项目数据、活动配置、服务团队协同",
  社群运营: "群运营、群分配、运营数据查看",
  服务老师: "社群任务、服务记录、会员跟进",
  客服专员: "会员查询、工单处理、服务群查看",
  内容运营: "内容资源管理、媒体账号协同、内容数据查看",
  财务运营: "订单查看、退款审批、财务报表查看",
};
const roleOptions = unifiedRoleOptions;
const permissionFeatures = [
  "会员查询",
  "工单处理",
  "服务群查看",
  "社群任务",
  "服务记录",
  "会员跟进",
  "群运营",
  "群分配",
  "运营数据查看",
  "项目数据",
  "活动配置",
  "服务团队协同",
  "项目管理",
  "服务关系",
  "项目资源查看",
];
const permissionTemplates = [
  {
    id: "platform-admin",
    name: "平台管理员权限",
    roles: ["平台管理员"],
    features: permissionFeatures,
  },
  {
    id: "regional-admin",
    name: "区域管理员权限",
    roles: ["区域管理员"],
    features: [
      "会员查询",
      "服务群查看",
      "群运营",
      "群分配",
      "运营数据查看",
      "项目数据",
      "服务团队协同",
      "项目资源查看",
    ],
  },
  {
    id: "project-owner",
    name: "项目负责人权限",
    roles: ["项目负责人"],
    features: [
      "会员查询",
      "服务群查看",
      "群运营",
      "运营数据查看",
      "项目数据",
      "活动配置",
      "服务团队协同",
      "项目管理",
      "服务关系",
      "项目资源查看",
    ],
  },
  {
    id: "project-ops",
    name: "项目运营权限",
    roles: ["项目运营"],
    features: [
      "会员查询",
      "服务群查看",
      "群运营",
      "运营数据查看",
      "项目数据",
      "活动配置",
      "服务团队协同",
    ],
  },
  {
    id: "community-ops",
    name: "社群运营权限",
    roles: ["社群运营"],
    features: ["服务群查看", "社群任务", "群运营", "群分配", "运营数据查看"],
  },
  {
    id: "service-coach",
    name: "服务老师权限",
    roles: ["服务老师"],
    features: ["会员查询", "服务群查看", "社群任务", "服务记录", "会员跟进"],
  },
  {
    id: "cs-basic",
    name: "客服基础权限",
    roles: ["客服专员"],
    features: ["会员查询", "工单处理", "服务群查看"],
  },
  {
    id: "content-ops",
    name: "内容运营权限",
    roles: ["内容运营"],
    features: ["运营数据查看", "项目资源查看"],
  },
  {
    id: "finance-ops",
    name: "财务运营权限",
    roles: ["财务运营"],
    features: ["会员查询", "运营数据查看", "项目数据"],
  },
];
const templateForRoles = (roles: string[]) =>
  permissionTemplates
    .filter((template) => template.roles.some((role) => roles.includes(role)))
    .map((template) => template.id);
const featuresForTemplates = (templateIds: string[]) =>
  Array.from(
    new Set(
      permissionTemplates
        .filter((template) => templateIds.includes(template.id))
        .flatMap((template) => template.features),
    ),
  );

function PermissionTable({
  selected,
  onToggle,
  compact = false,
  editable = false,
}: {
  selected: string[];
  onToggle: (feature: string) => void;
  compact?: boolean;
  editable?: boolean;
}) {
  const allEnabled = permissionFeatures.every((feature) =>
    selected.includes(feature),
  );
  const toggleAll = () =>
    permissionFeatures.forEach((feature) => {
      const enabled = selected.includes(feature);
      if (allEnabled === enabled) onToggle(feature);
    });
  return (
    <div
      className="overflow-hidden"
      style={{
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderRadius: S.radiusSm,
      }}
    >
      <div
        className="grid items-center px-3 py-2 text-[10px] font-semibold"
        style={{
          gridTemplateColumns: "1fr repeat(4, 52px)",
          background: "#f1f5f9",
          borderBottom: `1px solid ${S.border}`,
          color: S.muted,
        }}
      >
        <span>功能模块</span>
        <button
          type="button"
          className="text-center"
          onClick={toggleAll}
          disabled={!editable}
        >
          查看
        </button>
        <span className="text-center">编辑</span>
        <span className="text-center" style={{ color: "#b45309" }}>
          删除
        </span>
        <span className="text-center" style={{ color: "#b45309" }}>
          导出
        </span>
      </div>
      <div
        className={
          compact ? "max-h-52 overflow-auto" : "max-h-64 overflow-auto"
        }
      >
        {permissionFeatures.map((feature, index) => {
          const enabled = selected.includes(feature);
          return (
            <div
              key={feature}
              className="grid items-center px-3 py-1.5 text-[10px]"
              style={{
                gridTemplateColumns: "1fr repeat(4, 52px)",
                background: index % 2 ? S.bg : S.surface,
                borderBottom: `1px solid ${S.border}`,
                color: S.textSec,
              }}
            >
              <span>{feature}</span>
              <label className="flex justify-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  disabled={!editable}
                  onChange={() => onToggle(feature)}
                />
              </label>
              <span className="flex justify-center">
                <input type="checkbox" checked={false} disabled readOnly />
              </span>
              <span className="flex justify-center">
                <input type="checkbox" checked={false} disabled readOnly />
              </span>
              <span className="flex justify-center">
                <input type="checkbox" checked={false} disabled readOnly />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RolePicker({
  roles,
  onChange,
}: {
  roles: string[];
  onChange: (roles: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [options, setOptions] = useState(roleOptions);
  const toggle = (role: string) =>
    onChange(
      roles.includes(role)
        ? roles.filter((item) => item !== role)
        : [...roles, role],
    );
  const addRole = () => {
    const name = newRole.trim();
    if (!name || options.includes(name)) return;
    setOptions((current) => [...current, name]);
    onChange([...roles, name]);
    setNewRole("");
  };
  return (
    <div className="relative flex-1">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
        onClick={() => setOpen((value) => !value)}
        style={{
          background: S.bg,
          border: `1px solid ${S.borderMed}`,
          borderRadius: S.radiusSm,
          color: roles.length ? S.text : S.muted,
        }}
      >
        <span>
          {roles.length ? roles.join(" / ") : "暂不设置岗位，后续配置"}
        </span>
        <span>⌄</span>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-40 mt-1 p-2"
          style={{
            background: S.surface,
            border: `1px solid ${S.borderMed}`,
            borderRadius: S.radiusSm,
            boxShadow: "0 12px 28px rgba(0,0,0,.14)",
          }}
        >
          {options.map((role) => (
            <label
              key={role}
              className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer"
              style={{ color: S.textSec }}
            >
              <input
                type="checkbox"
                checked={roles.includes(role)}
                onChange={() => toggle(role)}
              />
              {role}
              {!roleOptions.includes(role) && (
                <button
                  type="button"
                  className="ml-auto text-[10px]"
                  style={{ color: "#c2410c" }}
                  onClick={(event) => {
                    event.preventDefault();
                    setOptions((current) =>
                      current.filter((item) => item !== role),
                    );
                    onChange(roles.filter((item) => item !== role));
                  }}
                >
                  删除
                </button>
              )}
            </label>
          ))}
          <div
            className="flex gap-1 mt-2 pt-2"
            style={{ borderTop: `1px solid ${S.border}` }}
          >
            <input
              value={newRole}
              onChange={(event) => setNewRole(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addRole();
              }}
              placeholder="新增岗位"
              className="flex-1 px-2 py-1.5 text-[10px] outline-none"
              style={{
                background: S.bg,
                border: `1px solid ${S.borderMed}`,
                borderRadius: 4,
              }}
            />
            <button
              type="button"
              className="px-2 py-1 text-[10px] font-semibold"
              onClick={addRole}
              style={{ background: S.ink, color: S.accent, borderRadius: 4 }}
            >
              新增
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewStaffModal({
  suggestedNo,
  onClose,
  onSave,
}: {
  suggestedNo: string;
  onClose: () => void;
  onSave: (form: {
    gender: string;
    name: string;
    phone: string;
    account: string;
    password: string;
    roles: string[];
    templateIds: string[];
    permissionFeatures: string[];
  }) => void;
}) {
  const [form, setForm] = useState({
    gender: "男",
    name: "",
    phone: "",
    account: "",
    password: "",
    roles: [] as string[],
    templateIds: [] as string[],
  });
  const [extraFeatures, setExtraFeatures] = useState<string[]>([]);
  const [showOptionalSetup, setShowOptionalSetup] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const inheritedFeatures = Array.from(
    new Set([...featuresForTemplates(form.templateIds), ...extraFeatures]),
  );
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const canCreate = Boolean(form.name.trim() && form.phone.trim());
  const hasUnsavedChanges = Boolean(
    form.name ||
    form.phone ||
    form.account ||
    form.password ||
    form.roles.length,
  );
  const requestClose = () =>
    hasUnsavedChanges ? setConfirmDiscard(true) : onClose();
  const createEmployee = () => {
    setSubmitAttempted(true);
    if (!canCreate) return;
    onSave({ ...form, permissionFeatures: inheritedFeatures });
  };
  const inputStyle = {
    background: "#f1f5f9",
    border: `1px solid rgba(15,23,42,0.12)`,
    color: S.text,
    borderRadius: S.radiusSm,
    fontFamily: "monospace",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-[620px] max-w-[calc(100vw-32px)] max-h-[84vh] overflow-hidden flex flex-col"
        style={{
          background: "#ffffff",
          borderRadius: S.radiusLg,
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
          style={{
            borderBottom: `1px solid rgba(0,0,0,0.08)`,
            background: "#f1f5f9",
          }}
        >
          <div>
            <div
              className="font-semibold"
              style={{ color: S.text, fontFamily: "monospace" }}
            >
              新建员工
            </div>
            <div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>
              先建立基础档案；岗位、权限和服务关系均可后续配置
            </div>
          </div>
          <button
            onClick={requestClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <X size={15} style={{ color: S.muted }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 overflow-auto">
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {[
              {
                label: "系统工号",
                key: "no",
                placeholder: suggestedNo,
                type: "readonly",
              },
              {
                label: "姓名",
                key: "name",
                placeholder: "请输入姓名",
                type: "text",
                required: true,
              },
              {
                label: "手机",
                key: "phone",
                placeholder: "请输入手机号",
                type: "text",
                required: true,
              },
              { label: "性别", key: "gender", type: "select" },
              {
                label: "登录账号",
                key: "account",
                placeholder: "可选，留空自动生成",
                type: "text",
              },
              {
                label: "初始密码",
                key: "password",
                placeholder: "可选",
                type: "password",
              },
            ].map((field) => (
              <label key={field.key} className="block">
                <span
                  className="block mb-1 text-[10px]"
                  style={{ color: S.muted }}
                >
                  {field.label}
                  {field.required ? (
                    <b style={{ color: "#dc2626" }}> *</b>
                  ) : field.type === "readonly" ? (
                    <span>（自动生成）</span>
                  ) : (
                    <span>（可选）</span>
                  )}
                </span>
                {field.type === "select" ? (
                  <select
                    className="w-full px-3 py-2 text-xs outline-none"
                    style={inputStyle}
                    value={form.gender}
                    onChange={(event) => set("gender", event.target.value)}
                  >
                    {["男", "女"].map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "readonly" ? "text" : field.type}
                    readOnly={field.type === "readonly"}
                    className="w-full px-3 py-2 text-xs outline-none"
                    style={{
                      ...inputStyle,
                      border:
                        field.required &&
                        submitAttempted &&
                        !(form as any)[field.key].trim()
                          ? "1px solid #dc2626"
                          : inputStyle.border,
                      opacity: field.type === "readonly" ? 0.72 : 1,
                      cursor:
                        field.type === "readonly" ? "not-allowed" : "text",
                    }}
                    placeholder={field.placeholder}
                    value={
                      field.type === "readonly"
                        ? suggestedNo
                        : (form as any)[field.key]
                    }
                    onChange={(event) => set(field.key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          {submitAttempted && !canCreate && (
            <div
              role="alert"
              className="px-3 py-2 text-xs"
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                borderRadius: S.radiusSm,
              }}
            >
              请先填写姓名和手机号，再创建员工。
            </div>
          )}

          <div
            className="p-3"
            style={{
              background: S.bg,
              border: `1px solid ${S.border}`,
              borderRadius: S.radiusSm,
            }}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between text-left"
              onClick={() => setShowOptionalSetup((current) => !current)}
            >
              <span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: S.text }}
                >
                  岗位、权限与服务关系
                </span>
                <span
                  className="block mt-0.5 text-[10px]"
                  style={{ color: S.muted }}
                >
                  选填；创建后可在员工台账的“查看”中随时补齐
                </span>
              </span>
              <span className="text-sm" style={{ color: S.textSec }}>
                {showOptionalSetup ? "⌃" : "⌄"}
              </span>
            </button>
            {showOptionalSetup && (
              <div
                className="mt-3 pt-3 space-y-3"
                style={{ borderTop: `1px solid ${S.border}` }}
              >
                <div>
                  <span
                    className="block mb-1 text-[10px]"
                    style={{ color: S.muted }}
                  >
                    岗位角色（可多选）
                  </span>
                  <RolePicker
                    roles={form.roles}
                    onChange={(roles) => {
                      setExtraFeatures([]);
                      setEditingPermissions(false);
                      setForm((current) => ({
                        ...current,
                        roles,
                        templateIds: templateForRoles(roles),
                      }));
                    }}
                  />
                </div>
                {form.roles.length > 0 && (
                  <>
                    <div
                      className="px-2.5 py-2 text-[10px] leading-relaxed"
                      style={{
                        background: S.accentLight,
                        border: `1px solid ${S.accentMid}`,
                        borderRadius: S.radiusSm,
                      }}
                    >
                      <b style={{ color: S.text }}>岗位继承：</b>
                      {form.roles
                        .map(
                          (role) =>
                            `${role}（${roleTemplates[role] || "自定义岗位"}）`,
                        )
                        .join("；")}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className="text-[10px]"
                          style={{ color: S.muted }}
                        >
                          权限表单
                        </span>
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-2 py-1 text-[10px] font-semibold"
                          style={{
                            background: editingPermissions
                              ? S.accentLight
                              : "#1e293b",
                            color: editingPermissions ? S.textSec : S.accent,
                          }}
                          onClick={() =>
                            setEditingPermissions((current) => !current)
                          }
                        >
                          {editingPermissions ? "完成编辑" : "编辑权限"}
                        </button>
                      </div>
                      <PermissionTable
                        compact
                        editable={editingPermissions}
                        selected={inheritedFeatures}
                        onToggle={(feature) =>
                          setExtraFeatures((current) =>
                            current.includes(feature)
                              ? current.filter((item) => item !== feature)
                              : [...current, feature],
                          )
                        }
                      />
                      <div
                        className="mt-1 text-[10px]"
                        style={{ color: S.muted }}
                      >
                        {editingPermissions
                          ? "正在编辑“查看”权限；敏感操作仍需在员工配置中单独授权。"
                          : "岗位自动带出权限；点击“编辑权限”后可调整例外权益。"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-3 px-5 py-3.5 flex-shrink-0"
          style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}
        >
          {confirmDiscard ? (
            <>
              <span className="text-[10px]" style={{ color: "#b45309" }}>
                已填写内容尚未保存，确定放弃吗？
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 text-xs"
                  style={{
                    background: S.surface,
                    border: `1px solid ${S.borderMed}`,
                    color: S.textSec,
                    borderRadius: S.radiusSm,
                  }}
                  onClick={() => setConfirmDiscard(false)}
                >
                  继续填写
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-xs font-semibold"
                  style={{
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    color: "#be123c",
                    borderRadius: S.radiusSm,
                  }}
                  onClick={onClose}
                >
                  放弃并关闭
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-[10px]" style={{ color: S.muted }}>
                创建后可在员工台账继续配置服务关系
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 text-xs"
                  style={{
                    background: S.surface,
                    border: `1px solid ${S.borderMed}`,
                    color: S.textSec,
                    borderRadius: S.radiusSm,
                  }}
                  onClick={requestClose}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 text-xs font-bold"
                  style={{
                    background: "#1e293b",
                    color: S.accent,
                    borderRadius: S.radiusSm,
                    fontFamily: "monospace",
                  }}
                  onClick={createEmployee}
                >
                  创建员工
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeConfigModal({
  staff,
  officerNames,
  onClose,
  onSave,
}: {
  staff: EmployeeRow;
  officerNames: string[];
  onClose: () => void;
  onSave: (draft: {
    roles: string[];
    templateIds: string[];
    permissionFeatures: string[];
    projects: string[];
    area2: string;
    serviceOfficer: string;
  }) => void;
}) {
  const [roles, setRoles] = useState<string[]>(
    ("roles" in staff && Array.isArray(staff.roles)
      ? staff.roles
      : staff.role.split(" / ")
    ).filter(Boolean),
  );
  const [templateIds, setTemplateIds] = useState<string[]>(
    "templateIds" in staff && Array.isArray(staff.templateIds)
      ? staff.templateIds
      : templateForRoles(roles),
  );
  const [permissionOverrides, setPermissionOverrides] = useState<string[]>(
    "permissionFeatures" in staff && Array.isArray(staff.permissionFeatures)
      ? staff.permissionFeatures
      : [],
  );
  const setRolesAndTemplates = (role: string, active: boolean) =>
    setRoles((current) => {
      const next = active
        ? current.filter((item) => item !== role)
        : [...current, role];
      setTemplateIds(templateForRoles(next));
      return next;
    });
  const [projects, setProjects] = useState<string[]>(
    (staff.projects || []).map(projectLabel),
  );
  const [area, setArea] = useState(
    staff.area2 === "待配置服务范围" ? "" : staff.area2,
  );
  const [serviceOfficer, setServiceOfficer] = useState(
    staff.serviceOfficer === "—" ? "" : staff.serviceOfficer,
  );
  const serviceRole = roles.some((role) =>
    ["客服专员", "服务老师", "社群运营", "探哥", "假面"].includes(role),
  );
  const effectiveFeatures = Array.from(
    new Set([...featuresForTemplates(templateIds), ...permissionOverrides]),
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="w-[600px] max-w-[calc(100vw-32px)] max-h-[88vh] overflow-hidden flex flex-col"
        style={{
          background: S.surface,
          borderRadius: S.radiusLg,
          boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background: "#f1f5f9",
            borderBottom: `1px solid ${S.border}`,
          }}
        >
          <div>
            <div className="font-semibold" style={{ color: S.text }}>
              员工配置 · {staff.name}
            </div>
            <div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>
              岗位角色自动继承默认权限；服务关系决定项目、地区和责任归属
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭员工配置">
            <X size={15} style={{ color: S.muted }} />
          </button>
        </div>
        <div className="p-5 overflow-auto space-y-4">
          <section>
            <div className="text-xs font-semibold" style={{ color: S.text }}>
              岗位角色与个人例外权益
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {roleOptions.map((role) => {
                const active = roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      setRoles((current) =>
                        active
                          ? current.filter((item) => item !== role)
                          : [...current, role],
                      )
                    }
                    className="px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: active ? "#1e293b" : S.bg,
                      color: active ? S.accent : S.textSec,
                      border: `1px solid ${active ? "#1e293b" : S.border}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
            <div className="mt-2">
              <PermissionTable
                compact
                editable
                selected={effectiveFeatures}
                onToggle={(feature) =>
                  setPermissionOverrides((current) =>
                    current.includes(feature)
                      ? current.filter((item) => item !== feature)
                      : [...current, feature],
                  )
                }
              />
            </div>
            <div className="mt-1 text-[10px]" style={{ color: S.muted }}>
              岗位角色自动带出默认权限；点击“查看”列可补充个人例外权益。
            </div>
          </section>
          <section
            className="pt-4"
            style={{ borderTop: `1px solid ${S.border}` }}
          >
            <div className="text-xs font-semibold" style={{ color: S.text }}>
              服务关系
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="block col-span-2">
                <span
                  className="block mb-1 text-[10px]"
                  style={{ color: S.muted }}
                >
                  服务项目
                </span>
                <input
                  value={projects.join("、")}
                  onChange={(event) =>
                    setProjects(
                      event.target.value
                        .split("、")
                        .map((value) => value.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="北京 PRO 会员、上海体验官"
                  className="w-full px-3 py-2 text-xs outline-none"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderMed}`,
                    borderRadius: S.radiusSm,
                  }}
                />
              </label>
              <label className="block col-span-2">
                <span
                  className="block mb-1 text-[10px]"
                  style={{ color: S.muted }}
                >
                  服务地区
                </span>
                <input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="北京、上海、吉林市"
                  className="w-full px-3 py-2 text-xs outline-none"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderMed}`,
                    borderRadius: S.radiusSm,
                  }}
                />
              </label>
              {serviceRole && (
                <label className="block col-span-2">
                  <span
                    className="block mb-1 text-[10px]"
                    style={{ color: S.muted }}
                  >
                    主服务官
                  </span>
                  <select
                    value={serviceOfficer}
                    onChange={(event) => setServiceOfficer(event.target.value)}
                    className="w-full px-3 py-2 text-xs outline-none"
                    style={{
                      background: S.bg,
                      border: `1px solid ${S.borderMed}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    <option value="">待配置</option>
                    {officerNames.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            {!serviceRole && (
              <div className="mt-2 text-[10px]" style={{ color: S.muted }}>
                当前岗位不属于服务类岗位，不需要配置主服务官。
              </div>
            )}
          </section>
        </div>
        <div
          className="flex justify-end gap-2 px-5 py-4 flex-shrink-0"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs"
            style={{
              background: S.bg,
              color: S.textSec,
              border: `1px solid ${S.borderMed}`,
              borderRadius: S.radiusSm,
            }}
          >
            取消
          </button>
          <button
            type="button"
            disabled={!roles.length}
            onClick={() =>
              onSave({
                roles,
                templateIds,
                permissionFeatures: effectiveFeatures,
                projects,
                area2: area || "待配置服务范围",
                serviceOfficer: serviceRole ? serviceOfficer || "待配置" : "—",
              })
            }
            className="px-3 py-2 text-xs font-bold"
            style={{
              background: roles.length ? "#1e293b" : "#ddd",
              color: roles.length ? S.accent : "#888",
              borderRadius: S.radiusSm,
            }}
          >
            保存员工配置
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 客服详情页 ───────────────────────────────────────────────
function StaffDetail({
  staff,
  onBack,
}: {
  staff: (typeof csStaff)[0];
  onBack: () => void;
}) {
  const initialWechatIds = getAssignedWechatIds(staff);
  const [configuredWechatIds, setConfiguredWechatIds] =
    useState(initialWechatIds);
  const tabOptions =
    configuredWechatIds.length > 1
      ? ["全部", ...configuredWechatIds]
      : configuredWechatIds;
  const [activeTab, setActiveTab] = useState<string | null>(
    tabOptions[0] ?? null,
  );
  const [showPwd, setShowPwd] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [draftWechatIds, setDraftWechatIds] = useState(initialWechatIds);
  const [page, setPage] = useState(1);
  const GRP_PAGE = 8;

  useLayoutEffect(() => {
    document
      .querySelector<HTMLElement>("[data-pc-content]")
      ?.scrollTo({ top: 0, left: 0 });
  }, []);

  const statusCfg: Record<string, { bg: string; color: string }> = {
    配置完成: { bg: "#f0fff4", color: "#276749" },
    待配置: { bg: "#fffbeb", color: "#b45309" },
  };

  const filteredGroups =
    activeTab === "全部"
      ? groupDetail.filter((group) =>
          configuredWechatIds.includes(group.wechat),
        )
      : activeTab
        ? groupDetail.filter((group) => group.wechat === activeTab)
        : [];
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / GRP_PAGE));
  const paged = filteredGroups.slice((page - 1) * GRP_PAGE, page * GRP_PAGE);
  const hasWechat = configuredWechatIds.length > 0;
  const openConfig = () => {
    setDraftWechatIds(configuredWechatIds);
    setShowConfig(true);
  };
  const saveConfig = () => {
    const nextIds = Array.from(new Set(draftWechatIds));
    setConfiguredWechatIds(nextIds);
    setActiveTab(nextIds.length > 1 ? "全部" : (nextIds[0] ?? null));
    setPage(1);
    setShowConfig(false);
  };

  const detailCols: [string, number, string][] = [
    ["群号", 70, ""],
    ["群名", 150, ""],
    ["社名", 90, ""],
    ["所在群数量", 80, "hidden lg:block"],
    ["微信账号", 90, ""],
    ["服务员", 80, ""],
    ["群主", 120, "hidden lg:block"],
    ["人工", 60, "hidden lg:block"],
    ["二维码", 60, "hidden lg:block"],
    ["微信好友数量", 90, ""],
    ["数量", 60, "hidden lg:block"],
    ["实际数量", 70, "hidden lg:block"],
    ["更新时间", 95, "hidden lg:block"],
    ["状态", 80, ""],
  ];

  return (
    <div
      className="p-6 h-full flex flex-col gap-4"
      style={{ background: S.bg }}
    >
      {showConfig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <div
            className="w-[360px] max-w-[calc(100vw-32px)] overflow-hidden"
            style={{
              background: S.surface,
              borderRadius: S.radiusLg,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${S.border}` }}
            >
              <div>
                <div className="font-semibold" style={{ color: S.text }}>
                  配置微信号
                </div>
                <div
                  className="mt-0.5 text-xs"
                  style={{ color: S.muted, fontFamily: "monospace" }}
                >
                  为 {staff.name} 选择可管理的微信号
                </div>
              </div>
              <button
                type="button"
                aria-label="关闭配置微信号"
                onClick={() => setShowConfig(false)}
                className="w-7 h-7 flex items-center justify-center"
                style={{ color: S.muted }}
              >
                <X size={15} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-2">
              {wechatTabs.map((id) => {
                const checked = draftWechatIds.includes(id);
                return (
                  <label
                    key={id}
                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
                    style={{
                      background: checked ? S.accentLight : "#f1f5f9",
                      border: `1px solid ${checked ? "rgba(204,255,0,0.35)" : S.border}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: S.text, fontFamily: "monospace" }}
                    >
                      {id}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDraftWechatIds((current) =>
                          checked
                            ? current.filter((value) => value !== id)
                            : [...current, id],
                        )
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div
              className="flex justify-end gap-2 px-5 py-4"
              style={{ borderTop: `1px solid ${S.border}` }}
            >
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-3 py-2 text-xs"
                style={{
                  background: "#f1f5f9",
                  color: S.textSec,
                  borderRadius: S.radiusSm,
                }}
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveConfig}
                className="px-3 py-2 text-xs font-bold"
                style={{
                  background: "#1e293b",
                  color: S.accent,
                  borderRadius: S.radiusSm,
                }}
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 面包屑 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: S.muted, fontFamily: "monospace" }}
          onClick={onBack}
        >
          <ArrowLeft size={14} /> 客服管理
        </button>
        <span style={{ color: S.mutedLight }}>›</span>
        <span
          className="text-sm font-semibold"
          style={{ color: S.text, fontFamily: "monospace" }}
        >
          客服：{staff.name}
        </span>
        <span
          className="px-2 py-0.5 text-xs font-bold"
          style={{
            background: S.accent,
            color: S.onPrimary,
            borderRadius: S.radiusSm,
            fontFamily: "monospace",
          }}
        >
          绑定微信
        </span>
      </div>

      {/* 档案卡 */}
      <div
        className="flex-shrink-0"
        style={{
          background: S.surface,
          border: `1px solid ${S.border}`,
          borderRadius: S.radius,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* 头部信息 */}
        <div className="flex flex-wrap items-start gap-5 p-5">
          <img
            src={getAvatar(staff.id - 1)}
            alt={staff.name}
            style={{
              width: 60,
              height: 60,
              borderRadius: S.radius,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-semibold"
                style={{
                  fontSize: "17px",
                  color: S.text,
                  fontFamily: "monospace",
                }}
              >
                {staff.name}
              </span>
              <span
                className="px-2 py-0.5 text-xs"
                style={{
                  background: staff.gender === "女" ? "#fff0f6" : "#eff8ff",
                  color: staff.gender === "女" ? "#d53f8c" : "#3182ce",
                  borderRadius: S.radiusSm,
                  fontFamily: "monospace",
                }}
              >
                {staff.gender}
              </span>
              <span
                className="px-2 py-0.5 text-xs font-bold"
                style={{
                  background: S.accentMid,
                  color: S.onPrimary,
                  borderRadius: S.radiusSm,
                  fontFamily: "monospace",
                }}
              >
                {staff.role}
              </span>
            </div>
            {/* 基础信息网格 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1.5">
              {[
                ["工号", staff.no],
                ["查看账号", staff.account],
                ["电话", staff.phone],
                ["管理地区", staff.area2],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-1.5 text-xs">
                  <span
                    style={{
                      color: S.muted,
                      fontFamily: "monospace",
                      flexShrink: 0,
                    }}
                  >
                    {k}：
                  </span>
                  <span style={{ color: S.textSec, fontFamily: "monospace" }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div
              className="text-center px-4 py-2.5"
              style={{
                background: hasWechat ? S.accentMid : "#fff7ed",
                border: `1px solid ${hasWechat ? "rgba(204,255,0,0.3)" : "#fed7aa"}`,
                borderRadius: S.radius,
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{
                  color: hasWechat ? S.text : "#c2410c",
                  fontFamily: "monospace",
                }}
              >
                {configuredWechatIds.length}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{
                  color: hasWechat ? S.textSec : "#9a3412",
                  fontFamily: "monospace",
                }}
              >
                已配置微信号
              </div>
            </div>
            <div
              className="text-center px-4 py-2.5"
              style={{
                background: "#f1f5f9",
                border: `1px solid ${S.border}`,
                borderRadius: S.radius,
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: S.text, fontFamily: "monospace" }}
              >
                {
                  groupDetail.filter((group) =>
                    configuredWechatIds.includes(group.wechat),
                  ).length
                }
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: S.muted, fontFamily: "monospace" }}
              >
                关联群数
              </div>
            </div>
          </div>
        </div>

        {/* 微信绑定信息 */}
        <div
          className="px-5 pb-4"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          <div
            className="text-xs font-semibold pt-3 pb-2"
            style={{ color: S.muted, fontFamily: "monospace" }}
          >
            微信绑定信息
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
            {[
              ["QQ账号", staff.qqNo],
              ["QQ邮件", staff.qqEmail],
              ["QQ账号群", staff.qqGroup],
              ["微信账号", staff.wechatId],
              ["招募时间", staff.recruitTime],
              ["二维码链接", staff.qrLink !== "暂无" ? "已配置" : "暂无"],
              ["密码", staff.password],
              ["二维码", staff.qrLink !== "暂无" ? "已生成" : "暂无"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs">
                <span
                  style={{
                    color: S.muted,
                    fontFamily: "monospace",
                    flexShrink: 0,
                  }}
                >
                  {k}：
                </span>
                {k === "密码" ? (
                  <>
                    <span style={{ color: S.textSec, fontFamily: "monospace" }}>
                      {showPwd ? v : "••••••••"}
                    </span>
                    <button
                      type="button"
                      aria-label={showPwd ? "隐藏密码" : "显示密码"}
                      onClick={() => setShowPwd((value) => !value)}
                    >
                      {showPwd ? (
                        <EyeOff size={12} style={{ color: S.muted }} />
                      ) : (
                        <Eye size={12} style={{ color: S.muted }} />
                      )}
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      color:
                        k === "二维码链接" && v !== "暂无"
                          ? "#3182ce"
                          : S.textSec,
                      fontFamily: "monospace",
                    }}
                  >
                    {v}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 微信 Tab 栏 */}
        <div
          className="flex items-center gap-0 px-5 pb-4 pt-1 flex-wrap"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          {tabOptions.map((t) => (
            <button
              key={t}
              className="px-3 py-1.5 text-xs transition-all"
              style={{
                background: activeTab === t ? "#1e293b" : "#f1f5f9",
                color: activeTab === t ? S.accent : S.muted,
                border: `1px solid ${S.border}`,
                borderRadius: S.radiusSm,
                fontFamily: "monospace",
                margin: "2px",
              }}
              onClick={() => {
                setActiveTab(t);
                setPage(1);
              }}
            >
              {t}
            </button>
          ))}
          {!hasWechat && (
            <span
              className="text-xs px-2 py-1.5"
              style={{ color: "#9a3412", fontFamily: "monospace" }}
            >
              尚未配置微信号，请先完成绑定
            </span>
          )}
          <button
            type="button"
            onClick={openConfig}
            className="px-3 py-1.5 text-xs font-bold ml-auto"
            style={{
              background: S.accent,
              color: S.onPrimary,
              borderRadius: S.radiusSm,
              fontFamily: "monospace",
              margin: "2px",
            }}
          >
            配置微信
          </button>
        </div>
      </div>

      {/* 群组表格 */}
      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{
          background: S.surface,
          border: `1px solid ${S.border}`,
          borderRadius: S.radius,
        }}
      >
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: "100%", width: "max-content" }}>
            {hasWechat && (
              <div
                className="flex items-center px-4 py-2.5 flex-shrink-0 text-xs"
                style={{
                  background: "#f1f5f9",
                  borderBottom: `1px solid ${S.border}`,
                  fontFamily: "monospace",
                }}
              >
                {detailCols.map(([l, w, visibility]) => (
                  <div
                    key={l}
                    className={`${visibility} flex-shrink-0 font-semibold`}
                    style={{ width: w, color: "#475569" }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            )}
            {paged.map((g) => {
              const st = statusCfg[g.status] || {
                bg: "#f1f5f9",
                color: "#888",
              };
              return (
                <div
                  key={g.groupNo}
                  className="flex items-center px-4 text-xs transition-all"
                  style={{
                    background: "transparent",
                    borderBottom: `1px solid ${S.border}`,
                    minWidth: "fit-content",
                    paddingTop: "9px",
                    paddingBottom: "9px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(0,0,0,0.018)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 70,
                      color: S.mutedLight,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.groupNo}
                  </div>
                  <div
                    className="flex-shrink-0 font-medium"
                    style={{
                      width: 150,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.name}
                  </div>
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 90,
                      color: S.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.orgName}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0 font-medium"
                    style={{
                      width: 80,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.groupInCount}
                  </div>
                  <div
                    className="flex-shrink-0 font-medium"
                    style={{
                      width: 90,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.wechat}
                  </div>
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 80,
                      color: S.textSec,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.serviceStaff}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0"
                    style={{
                      width: 120,
                      color: S.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.groupOwner}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0 font-medium"
                    style={{
                      width: 60,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.manualCount}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0"
                    style={{ width: 60 }}
                  >
                    <div
                      className="w-6 h-6 flex items-center justify-center"
                      style={{
                        background: "#f1f5f9",
                        border: `1px solid ${S.border}`,
                        borderRadius: S.radiusSm,
                      }}
                    >
                      <QrCode size={13} style={{ color: S.textSec }} />
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 font-medium"
                    style={{
                      width: 90,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.friendCount}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0 font-medium"
                    style={{
                      width: 60,
                      color: S.text,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.memberCount}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0"
                    style={{
                      width: 70,
                      color:
                        g.actualCount < g.memberCount ? "#c53030" : S.textSec,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.actualCount}
                  </div>
                  <div
                    className="hidden lg:block flex-shrink-0"
                    style={{
                      width: 95,
                      color: S.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {g.updatedAt}
                  </div>
                  <div className="flex-shrink-0" style={{ width: 80 }}>
                    <span
                      className="px-1.5 py-0.5 font-medium"
                      style={{
                        background: st.bg,
                        color: st.color,
                        borderRadius: S.radiusSm,
                        fontFamily: "monospace",
                      }}
                    >
                      {g.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {paged.length === 0 && (
              <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: S.text }}
                  >
                    暂无关联群组
                  </div>
                  <div
                    className="mt-1 text-xs"
                    style={{ color: S.muted, fontFamily: "monospace" }}
                  >
                    {hasWechat
                      ? "当前微信号还没有关联群组"
                      : "完成微信绑定后，这里会显示关联群组"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 分页 */}
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          style={{ borderTop: `1px solid ${S.border}`, background: "#f8fafc" }}
        >
          <div
            className="text-xs"
            style={{ color: S.muted, fontFamily: "monospace" }}
          >
            共 {filteredGroups.length} 条
          </div>
          <div className="flex items-center gap-1">
            <button
              className="w-7 h-7 flex items-center justify-center"
              style={{
                background: page === 1 ? S.bg : "#1e293b",
                color: page === 1 ? S.muted : S.accent,
                border: `1px solid ${S.border}`,
                borderRadius: S.radiusSm,
              }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className="w-7 h-7 text-xs"
                style={{
                  background: page === p ? "#1e293b" : S.surface,
                  color: page === p ? S.accent : S.muted,
                  border: `1px solid ${S.border}`,
                  borderRadius: S.radiusSm,
                  fontFamily: "monospace",
                }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="w-7 h-7 flex items-center justify-center"
              style={{
                background: page === totalPages ? S.bg : "#1e293b",
                color: page === totalPages ? S.muted : S.accent,
                border: `1px solid ${S.border}`,
                borderRadius: S.radiusSm,
              }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div
            className="text-xs"
            style={{ color: S.muted, fontFamily: "monospace" }}
          >
            每页 {GRP_PAGE} 条
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 主列表页 ─────────────────────────────────────────────────
export default function CustomerService() {
  useThemeSingleton();
  const [section, setSection] = useState<
    "employees" | "relationships" | "permissions"
  >("employees");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [configStaff, setConfigStaff] = useState<EmployeeRow | null>(null);
  const setDetailStaff = setConfigStaff;
  const [employeeRows, setEmployeeRows] = useState(employeeStaff);
  const [statusFilter, setStatusFilter] = useState("全部状态");
  const [roleFilter, setRoleFilter] = useState("全部岗位");
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, string>
  >({});
  const [archivedStaff, setArchivedStaff] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [officerOverrides, setOfficerOverrides] = useState<
    Record<string, { projects: string; cities: string; backup: string }>
  >({});
  const [qualifiedOfficerIds, setQualifiedOfficerIds] = useState<string[]>([
    "acc_wusiyuan",
    "acc_linxiaoyan",
    "acc_limenghua",
  ]);
  const [officerDraftUid, setOfficerDraftUid] = useState<string | null>(null);
  const [officerDraft, setOfficerDraft] = useState({
    projects: "",
    cities: "",
    backup: "",
    qualified: true,
  });
  const serviceTeam = useMemo(
    () =>
      employeeRows.filter(
        (staff) =>
          staff.source === "service" ||
          staff.role.includes("客服") ||
          staff.role.includes("服务老师"),
      ),
    [employeeRows],
  );
  const qualifiedOfficers = useMemo(
    () =>
      serviceOfficerRows.filter((officer) =>
        qualifiedOfficerIds.includes(officer.uid),
      ),
    [qualifiedOfficerIds],
  );
  const getEmployeeStatus = (staff: EmployeeRow) => {
    if (statusOverrides[staff.no] === "停用") return "停用";
    return !staff.projects.length || staff.area2.includes("待配置")
      ? "待配置"
      : "启用";
  };
  const listSource = employeeRows;

  const filtered = listSource.filter((staff) => {
    const status = getEmployeeStatus(staff);
    const staffRoles = (
      "roles" in staff && Array.isArray(staff.roles)
        ? staff.roles
        : staff.role.split(" / ")
    ).filter(Boolean);
    return (
      !archivedStaff.includes(staff.no) &&
      (statusFilter === "全部状态" || status === statusFilter) &&
      (roleFilter === "全部岗位" || staffRoles.includes(roleFilter)) &&
      [staff.name, staff.no, staff.area2, staff.account, staff.role]
        .join(" ")
        .includes(search)
    );
  });
  const roleFilters = unifiedRoleOptions;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tabs = [
    { key: "employees", label: "员工台账", icon: Users },
    { key: "relationships", label: "服务关系", icon: UserRoundCog },
    { key: "permissions", label: "岗位权限模板", icon: ShieldCheck },
  ] as const;
  const saveEmployee = (form: {
    gender: string;
    name: string;
    phone: string;
    account: string;
    password: string;
    roles: string[];
    templateIds: string[];
    permissionFeatures: string[];
  }) => {
    if (!form.name.trim() || !form.phone.trim()) {
      setNotice("请先填写员工姓名和手机号");
      return;
    }
    const nextId =
      employeeRows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
    const newEmployee = {
      id: nextId,
      no: getNextEmployeeNo(employeeRows),
      gender: form.gender,
      name: form.name,
      phone: form.phone,
      account: form.account || `user${nextId}`,
      password: form.password,
      area: "待配置",
      area2: "待配置服务范围",
      role: form.roles.join(" / ") || "待配置",
      roles: form.roles,
      templateIds: form.templateIds,
      permissionFeatures: form.permissionFeatures,
      wechatCount: 0,
      groupCount: 0,
      qqNo: "—",
      qqEmail: "—",
      qqGroup: "—",
      wechatId: "—",
      recruitTime: new Date().toISOString().slice(0, 10),
      qrLink: "—",
      wechats: [],
      source: "employee" as const,
      serviceOfficer: "—",
      projects: [],
      department: "待配置",
    };
    setEmployeeRows((current) => [newEmployee, ...current]);
    setShowModal(false);
    setNotice(
      `${form.name} 已加入员工台账，工号为 ${newEmployee.no}，待后续配置岗位与服务关系`,
    );
  };
  const saveEmployeeConfig = (draft: {
    roles: string[];
    templateIds: string[];
    permissionFeatures: string[];
    projects: string[];
    area2: string;
    serviceOfficer: string;
  }) => {
    if (!configStaff) return;
    setEmployeeRows((current) =>
      current.map((staff) =>
        staff.no === configStaff.no
          ? {
              ...staff,
              role: draft.roles.join(" / "),
              roles: draft.roles,
              templateIds: draft.templateIds,
              permissionFeatures: draft.permissionFeatures,
              projects: draft.projects,
              area2: draft.area2,
              area: draft.area2,
              serviceOfficer: draft.serviceOfficer,
            }
          : staff,
      ),
    );
    setConfigStaff(null);
    setNotice(`${configStaff.name} 的岗位、权限继承与服务关系已保存`);
  };
  const officerFor = (officer: (typeof serviceOfficerRows)[number]) =>
    officerOverrides[officer.uid] || {
      projects: officer.projects.map(projectLabel).join("、") || "待配置",
      cities: officer.cities.join("、") || "跨项目 / 待配置",
      backup: "未设置",
    };
  const openOfficerConfig = (officer: (typeof serviceOfficerRows)[number]) => {
    const current = officerFor(officer);
    setOfficerDraft({
      projects: current.projects,
      cities: current.cities,
      backup: current.backup === "未设置" ? "" : current.backup,
      qualified: qualifiedOfficerIds.includes(officer.uid),
    });
    setOfficerDraftUid(officer.uid);
  };
  const saveOfficerConfig = () => {
    if (!officerDraftUid) return;
    setOfficerOverrides((current) => ({
      ...current,
      [officerDraftUid]: { ...officerDraft },
    }));
    setQualifiedOfficerIds((current) =>
      officerDraft.qualified
        ? Array.from(new Set([...current, officerDraftUid]))
        : current.filter((id) => id !== officerDraftUid),
    );
    const officer = serviceOfficerRows.find(
      (item) => item.uid === officerDraftUid,
    );
    setOfficerDraftUid(null);
    setNotice(`${officer?.name || "服务官"} 的服务范围与备份服务官已保存`);
  };

  return (
    <div
      className="p-6 h-full flex flex-col gap-4"
      style={{ background: S.bg }}
    >
      {showModal && (
        <NewStaffModal
          suggestedNo={getNextEmployeeNo(employeeRows)}
          onClose={() => setShowModal(false)}
          onSave={saveEmployee}
        />
      )}
      {configStaff && (
        <EmployeeConfigModal
          staff={configStaff}
          officerNames={qualifiedOfficers.map((officer) => officer.name)}
          onClose={() => setConfigStaff(null)}
          onSave={saveEmployeeConfig}
        />
      )}
      {officerDraftUid && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="w-[440px] max-w-[calc(100vw-32px)] overflow-hidden"
            style={{
              background: S.surface,
              borderRadius: S.radiusLg,
              boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: `1px solid ${S.border}`,
                background: "#f1f5f9",
              }}
            >
              <div>
                <div className="font-semibold" style={{ color: S.text }}>
                  配置服务官范围
                </div>
                <div className="mt-0.5 text-[10px]" style={{ color: S.muted }}>
                  决定可分配的项目、地区与备份服务官
                </div>
              </div>
              <button
                type="button"
                aria-label="关闭配置"
                onClick={() => setOfficerDraftUid(null)}
              >
                <X size={15} style={{ color: S.muted }} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
                style={{
                  background: officerDraft.qualified ? S.accentLight : S.bg,
                  border: `1px solid ${officerDraft.qualified ? S.accentMid : S.border}`,
                  borderRadius: S.radiusSm,
                }}
              >
                <span>
                  <span
                    className="block text-xs font-semibold"
                    style={{ color: S.text }}
                  >
                    服务官资格
                  </span>
                  <span
                    className="block mt-0.5 text-[10px]"
                    style={{ color: S.muted }}
                  >
                    启用后才可被匹配为客服的主服务官
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={officerDraft.qualified}
                  onChange={(event) =>
                    setOfficerDraft((current) => ({
                      ...current,
                      qualified: event.target.checked,
                    }))
                  }
                />
              </label>
              <label className="block">
                <span
                  className="block mb-1.5 text-xs"
                  style={{ color: S.muted }}
                >
                  服务项目
                </span>
                <input
                  value={officerDraft.projects}
                  onChange={(event) =>
                    setOfficerDraft((current) => ({
                      ...current,
                      projects: event.target.value,
                    }))
                  }
                  placeholder="例如：北京PRO会员、上海体验官"
                  className="w-full px-3 py-2 text-xs outline-none"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderMed}`,
                    borderRadius: S.radiusSm,
                    color: S.text,
                  }}
                />
              </label>
              <label className="block">
                <span
                  className="block mb-1.5 text-xs"
                  style={{ color: S.muted }}
                >
                  服务地区
                </span>
                <input
                  value={officerDraft.cities}
                  onChange={(event) =>
                    setOfficerDraft((current) => ({
                      ...current,
                      cities: event.target.value,
                    }))
                  }
                  placeholder="例如：北京、上海、吉林市"
                  className="w-full px-3 py-2 text-xs outline-none"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderMed}`,
                    borderRadius: S.radiusSm,
                    color: S.text,
                  }}
                />
              </label>
              <label className="block">
                <span
                  className="block mb-1.5 text-xs"
                  style={{ color: S.muted }}
                >
                  备份服务官
                </span>
                <select
                  value={officerDraft.backup}
                  onChange={(event) =>
                    setOfficerDraft((current) => ({
                      ...current,
                      backup: event.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs outline-none"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.borderMed}`,
                    borderRadius: S.radiusSm,
                    color: S.text,
                  }}
                >
                  <option value="">未设置</option>
                  {serviceOfficerRows
                    .filter(
                      (officer) =>
                        officer.uid !== officerDraftUid &&
                        qualifiedOfficerIds.includes(officer.uid),
                    )
                    .map((officer) => (
                      <option key={officer.uid} value={officer.name}>
                        {officer.name}
                      </option>
                    ))}
                </select>
              </label>
              <div
                className="px-3 py-2 text-[10px] leading-relaxed"
                style={{
                  background: S.accentLight,
                  border: `1px solid ${S.accentMid}`,
                  borderRadius: S.radiusSm,
                  color: S.textSec,
                }}
              >
                新建客服时，系统只会匹配具有服务官资格且服务范围相符的人员；备份服务官仅在主服务官不可用时接管。
              </div>
            </div>
            <div
              className="flex justify-end gap-2 px-5 py-4"
              style={{ borderTop: `1px solid ${S.border}` }}
            >
              <button
                type="button"
                onClick={() => setOfficerDraftUid(null)}
                className="px-3 py-2 text-xs"
                style={{
                  background: S.bg,
                  color: S.textSec,
                  border: `1px solid ${S.borderMed}`,
                  borderRadius: S.radiusSm,
                }}
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveOfficerConfig}
                className="px-3 py-2 text-xs font-bold"
                style={{
                  background: "#1e293b",
                  color: S.accent,
                  borderRadius: S.radiusSm,
                }}
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-2 px-4 py-2.5 flex-shrink-0"
          style={{
            background: S.accentLight,
            border: `1px solid ${S.accentMid}`,
            borderRadius: S.radius,
            color: S.text,
            fontFamily: "monospace",
          }}
        >
          <span className="text-xs">{notice}</span>
          <button
            type="button"
            aria-label="关闭提示"
            onClick={() => setNotice("")}
          >
            <X size={13} />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2
            className="font-semibold"
            style={{
              color: S.text,
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            员工与服务资源
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ color: S.muted, fontFamily: "monospace" }}
          >
            统一管理员工档案、岗位角色、服务官覆盖范围与客服服务关系
          </p>
        </div>
        {section !== "permissions" && (
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold"
            style={{
              background: "#1e293b",
              color: S.accent,
              borderRadius: S.radius,
              fontFamily: "monospace",
            }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} /> 新建员工
          </button>
        )}
      </div>
      <div
        className="flex items-center gap-2 flex-shrink-0"
        role="tablist"
        aria-label="员工与服务资源视图"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = section === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setSection(tab.key);
                setPage(1);
                setSearch("");
                setRoleFilter("全部岗位");
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
              style={{
                background: active ? "#1e293b" : S.surface,
                color: active ? S.accent : S.textSec,
                border: `1px solid ${active ? "#1e293b" : S.border}`,
                borderRadius: S.radius,
                fontFamily: "monospace",
              }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>
      {section === "permissions" ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <Permissions embedded />
        </div>
      ) : section === "relationships" ? (
        <div className="flex-1 min-h-0 overflow-auto space-y-4">
          <div
            className="p-4"
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: S.radius,
            }}
          >
            <div className="text-sm font-semibold" style={{ color: S.text }}>
              服务官覆盖
            </div>
            <div className="mt-1 text-xs" style={{ color: S.muted }}>
              只有已启用“服务官资格”的员工，才能被客服关系匹配为主服务官。
            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              {qualifiedOfficers.map((officer, index) => (
                <div
                  key={officer.uid}
                  className="p-4"
                  style={{
                    background: S.bg,
                    border: `1px solid ${S.border}`,
                    borderRadius: S.radiusSm,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatar(index)}
                      alt={officer.name}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: S.radiusSm,
                        objectFit: "cover",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-semibold text-sm"
                        style={{ color: S.text }}
                      >
                        {officer.name}
                      </div>
                      <div
                        className="mt-0.5 text-[10px]"
                        style={{ color: S.muted }}
                      >
                        {officer.roles.join(" / ")}
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-[10px] font-bold"
                      style={{
                        background: S.accentMid,
                        color: S.onPrimary,
                        borderRadius: S.radiusSm,
                      }}
                    >
                      服务官
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span style={{ color: S.muted }}>服务项目：</span>
                      <span style={{ color: S.textSec }}>
                        {officerFor(officer).projects}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: S.muted }}>服务地区：</span>
                      <span style={{ color: S.textSec }}>
                        {officerFor(officer).cities}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: S.muted }}>备份服务官：</span>
                      <span style={{ color: S.textSec }}>
                        {officerFor(officer).backup}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full py-2 text-xs font-semibold"
                    style={{
                      background: S.surface,
                      border: `1px solid ${S.borderMed}`,
                      color: S.textSec,
                      borderRadius: S.radiusSm,
                    }}
                    onClick={() => openOfficerConfig(officer)}
                  >
                    配置服务范围
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div
            className="p-4"
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: S.radius,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: S.text }}
                >
                  客服与服务团队
                </div>
                <div className="mt-1 text-xs" style={{ color: S.muted }}>
                  按主服务官聚合，避免与员工台账重复展示。
                </div>
              </div>
              <span className="text-xs" style={{ color: S.muted }}>
                共 {serviceTeam.length} 名服务成员
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              {qualifiedOfficers.map((officer) => {
                const members = serviceTeam.filter(
                  (member) => member.serviceOfficer === officer.name,
                );
                return (
                  <div
                    key={officer.uid}
                    className="p-3"
                    style={{
                      background: S.bg,
                      border: `1px solid ${S.border}`,
                      borderRadius: S.radiusSm,
                    }}
                  >
                    <div className="flex justify-between gap-2">
                      <b className="text-xs" style={{ color: S.text }}>
                        {officer.name}
                      </b>
                      <span className="text-[10px]" style={{ color: S.muted }}>
                        {members.length} 名成员
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {members.length ? (
                        members.map((member) => (
                          <button
                            key={member.no}
                            type="button"
                            className="w-full flex justify-between px-2 py-1.5 text-left text-xs"
                            style={{
                              background: S.surface,
                              borderRadius: 4,
                              color: S.textSec,
                            }}
                            onClick={() => setDetailStaff(member)}
                          >
                            <span>
                              {member.name} · {member.role}
                            </span>
                            <span style={{ color: S.muted }}>
                              {member.wechatCount} 个账号
                            </span>
                          </button>
                        ))
                      ) : (
                        <div
                          className="px-2 py-2 text-xs"
                          style={{ color: S.muted }}
                        >
                          暂无已分配服务成员
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="flex-1 flex items-center gap-2 px-3 py-2"
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                borderRadius: S.radius,
              }}
            >
              <Search size={13} style={{ color: S.muted }} />
              <input
                className="bg-transparent outline-none text-xs flex-1"
                style={{ color: S.textSec, fontFamily: "monospace" }}
                placeholder="搜索工号、姓名、账号、岗位或服务范围…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={12} style={{ color: S.muted }} />
                </button>
              )}
            </div>
            <select
              className="px-3 py-2 text-xs outline-none"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                color: S.textSec,
                borderRadius: S.radius,
                fontFamily: "monospace",
              }}
            >
              <option>全部状态</option>
              <option>启用</option>
              <option>待配置</option>
              <option>停用</option>
            </select>
            <select
              className="px-3 py-2 text-xs outline-none"
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                color: S.textSec,
                borderRadius: S.radius,
                fontFamily: "monospace",
              }}
            >
              <option>全部岗位</option>
              {roleFilters.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
            <div
              className="text-xs px-3 py-2"
              style={{
                background: S.surface,
                border: `1px solid ${S.border}`,
                color: S.muted,
                borderRadius: S.radius,
                fontFamily: "monospace",
              }}
            >
              共 {filtered.length} 名
            </div>
          </div>
          <div
            className="flex-1 overflow-hidden flex flex-col"
            style={{
              background: S.surface,
              border: `1px solid ${S.border}`,
              borderRadius: S.radius,
            }}
          >
            <div className="flex-1 overflow-auto">
              <div style={{ minWidth: 1080, width: "max-content" }}>
                <div
                  className="sticky top-0 z-10 flex items-center px-4 py-2.5 text-xs"
                  style={{
                    background: "#f1f5f9",
                    borderBottom: `1px solid ${S.border}`,
                    color: "#475569",
                    fontFamily: "monospace",
                  }}
                >
                  {[
                    ["工号", 82],
                    ["员工", 150],
                    ["手机", 130],
                    ["员工账号", 130],
                    ["岗位/身份", 180],
                    ["服务范围", 190],
                    ["主服务官", 100],
                    ["账号资产", 90],
                    ["状态", 70],
                    ["操作", 170],
                  ].map(([label, width]) => (
                    <div
                      key={label as string}
                      className="flex-shrink-0 font-semibold"
                      style={{ width: width as number }}
                    >
                      {label as string}
                    </div>
                  ))}
                </div>
                {paged.map((staff) => {
                  const status = getEmployeeStatus(staff);
                  return (
                    <div
                      key={staff.no}
                      className="flex items-center px-4 py-3 text-xs"
                      style={{ borderBottom: `1px solid ${S.border}` }}
                    >
                      <div
                        className="flex-shrink-0"
                        style={{
                          width: 82,
                          color: S.muted,
                          fontFamily: "monospace",
                        }}
                      >
                        {staff.no}
                      </div>
                      <div
                        className="flex-shrink-0 flex items-center gap-2"
                        style={{ width: 150 }}
                      >
                        <img
                          src={getAvatar(staff.id - 1)}
                          alt={staff.name}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: S.text }}
                        >
                          {staff.name}
                        </span>
                      </div>
                      <div
                        className="flex-shrink-0"
                        style={{ width: 130, color: S.muted }}
                      >
                        {staff.phone}
                      </div>
                      <div
                        className="flex-shrink-0"
                        style={{
                          width: 130,
                          color: S.textSec,
                          fontFamily: "monospace",
                        }}
                      >
                        {staff.account}
                      </div>
                      <div
                        className="flex-shrink-0 truncate"
                        style={{ width: 180, color: S.textSec }}
                        title={staff.role}
                      >
                        {staff.role}
                      </div>
                      <div
                        className="flex-shrink-0 truncate"
                        style={{ width: 190, color: S.muted }}
                        title={
                          (staff as any).projects?.join("、") || staff.area2
                        }
                      >
                        {(staff as any).projects?.join("、") || staff.area2}
                      </div>
                      <div
                        className="flex-shrink-0"
                        style={{ width: 100, color: S.textSec }}
                      >
                        {(staff as any).serviceOfficer || "—"}
                      </div>
                      <div
                        className="flex-shrink-0"
                        style={{ width: 90, color: S.textSec }}
                      >
                        {staff.wechatCount || 0} 个
                      </div>
                      <div className="flex-shrink-0" style={{ width: 70 }}>
                        <span
                          className="px-1.5 py-0.5 text-xs font-bold"
                          style={{
                            background:
                              status === "启用" ? "#f0fff4" : "#f1f5f9",
                            color: status === "启用" ? "#276749" : S.muted,
                            borderRadius: S.radiusSm,
                          }}
                        >
                          {status}
                        </span>
                      </div>
                      <div
                        className="flex-shrink-0 flex gap-1.5"
                        style={{ width: 170 }}
                      >
                        <button
                          className="px-2.5 py-1.5 text-xs font-bold"
                          style={{
                            background: "#1e293b",
                            color: S.accent,
                            borderRadius: S.radiusSm,
                          }}
                          onClick={() => setDetailStaff(staff)}
                        >
                          查看
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1.5 text-xs"
                          style={{
                            background: S.surface,
                            color: S.textSec,
                            border: `1px solid ${S.borderMed}`,
                            borderRadius: S.radiusSm,
                          }}
                          onClick={() =>
                            setStatusOverrides((current) => ({
                              ...current,
                              [staff.no]: status === "启用" ? "停用" : "启用",
                            }))
                          }
                        >
                          {status === "启用" ? "停用" : "启用"}
                        </button>
                        <button
                          type="button"
                          title="归档员工"
                          className="w-7 h-7 grid place-items-center"
                          style={{
                            background: S.surface,
                            color: S.muted,
                            border: `1px solid ${S.border}`,
                            borderRadius: S.radiusSm,
                          }}
                          onClick={() => {
                            if (
                              staff.wechatCount ||
                              getManagedGroupCount(staff)
                            ) {
                              setNotice(
                                `${staff.name} 仍有关联资源，请先完成交接后归档`,
                              );
                              return;
                            }
                            setArchivedStaff((current) => [
                              ...current,
                              staff.no,
                            ]);
                            setNotice(`${staff.name} 已归档`);
                          }}
                        >
                          <Archive size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                borderTop: `1px solid ${S.border}`,
                background: "#f8fafc",
              }}
            >
              <div className="text-xs" style={{ color: S.muted }}>
                第 {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} 条，共{" "}
                {filtered.length} 条
              </div>
              <div className="flex gap-1">
                <button
                  className="w-7 h-7 grid place-items-center"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((value) => (
                  <button
                    key={value}
                    className="w-7 h-7 text-xs"
                    style={{
                      background: page === value ? "#1e293b" : S.surface,
                      color: page === value ? S.accent : S.muted,
                      borderRadius: S.radiusSm,
                    }}
                    onClick={() => setPage(value)}
                  >
                    {value}
                  </button>
                ))}
                <button
                  className="w-7 h-7 grid place-items-center"
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                  disabled={page === totalPages}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
              <div className="text-xs" style={{ color: S.muted }}>
                每页 {PAGE_SIZE} 条
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
