import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/pages/notifications.html"),
  "utf8",
);

function count(pattern: RegExp): number {
  return (page.match(pattern) || []).length;
}

describe("主理人1 消息页 · 统一会话列表", () => {
  it("不再区分已加入群与社群广场分区", () => {
    expect(page).not.toContain("wx-section-label");
    expect(page).not.toContain("已加入的群");
    expect(page).not.toContain("社群广场 · 推荐动态");
  });

  it("所有会话行使用完全统一的样式，无推荐或锁定变体", () => {
    expect(count(/class="wx-row wx-view mp-nav"/g)).toBe(15);
    expect(page).not.toContain("wx-row--recommended");
    expect(page).not.toContain("wx-row--locked");
    expect(page).not.toContain("wx-recommend-tag");
    expect(page).not.toContain("msg-hint");
    expect(page).not.toContain("wx-ava-cell--wait");
    expect(page).not.toContain("高级 · 会员专享");
    expect(page).not.toContain("升级后解锁完整记录");
    expect(page).not.toContain("升级会员后查看圈层名单");
    expect(page).not.toContain("待解锁 · 由服务老师分配权益后开始同步");
  });

  it("5 个已加入群携带群标识直接进入群聊页", () => {
    expect(count(/data-nav="group-chat"/g)).toBe(5);
    ["ca1-growth", "selection", "homework", "baokuan", "neirong"].forEach(
      (groupId) => {
        expect(page).toContain(`data-g="${groupId}"`);
      },
    );
  });

  it("3 个会员群以相同样式展示，仅通过 data-vip 标记权限差异", () => {
    expect(count(/data-vip="/g)).toBe(3);
    ["私域续费实战营", "城市主理人峰会群", "商家联盟交流群"].forEach((name) => {
      expect(page).toContain(`data-nav="group--社群广场" data-vip="${name}"`);
    });
    expect(page).toContain("联盟助手：本周跨城货源对接清单已更新");
  });

  it("点击分流：会员群弹升级提示且立即返回，不继续导航", () => {
    expect(page).toMatch(/if \(vip\) \{\s*showVipToast\(vip\);\s*return;\s*\}/);
  });

  it("会员 toast 弹出后 2800ms 自动复位为服务通知默认文案", () => {
    expect(page).toContain('name + "为会员专享社群，请升级会员后加入"');
    expect(page).toContain(
      'toastText.textContent = "请在微信小程序内完成服务通知授权"',
    );
  });

  it("会员 toast 提供「去升级」出口跳转会员页，服务通知 toast 不显示该按钮", () => {
    expect(page).toContain('id="toast-action"');
    expect(page).toContain('data-nav="member"');
    expect(page).toContain("toastAction.hidden = false");
    expect(page).toContain("toastAction.hidden = true");
  });

  it("搜索同时覆盖待办卡、通知卡与会话行", () => {
    expect(page).toContain('querySelectorAll(".todo-card")');
    expect(page).toContain("visibleTodos");
    expect(page).toContain(
      "emptyState.hidden = !query || visibleNotes + visibleRows + visibleTodos > 0;",
    );
  });

  it("消息 tab 角标口径统一为 17", () => {
    expect(page).toContain('<span class="tab-badge wx-text">17</span>');
    expect(page).not.toContain('<span class="tab-badge wx-text">3</span>');
  });

  it("服务通知 banner 仅一份且位于会话列表上方", () => {
    expect(count(/id="service-notification-enable"/g)).toBe(1);
    const bannerPos = page.indexOf("sub-banner gap");
    const listPos = page.indexOf('<div class="wx-list wx-view">');
    expect(bannerPos).toBeGreaterThan(-1);
    expect(listPos).toBeGreaterThan(-1);
    expect(bannerPos).toBeLessThan(listPos);
  });
});

const messagePage = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/pages/message.html"),
  "utf8",
);

const groupChatPage = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/pages/group-chat.html"),
  "utf8",
);

describe("主理人1 通知中心页（message）", () => {
  it("覆盖平台公告、服务通知、交易通知三类", () => {
    expect(messagePage).toContain("平台公告");
    expect(messagePage).toContain("服务通知");
    expect(messagePage).toContain("交易通知");
  });

  it("通知条目跳转到已存在的页面", () => {
    expect(messagePage).toContain('data-nav="message--班级公告"');
    expect(messagePage).toContain('data-nav="ticket--我的工单"');
    expect(messagePage).toContain('data-nav="orders"');
  });
});

describe("主理人1 群会话页（group-chat）", () => {
  it("按 ?g= 参数渲染对应群，覆盖消息页全部 5 个群", () => {
    expect(groupChatPage).toContain('new URLSearchParams(location.search).get("g")');
    ["ca1-growth", "selection", "homework", "baokuan", "neirong"].forEach(
      (groupId) => {
        expect(groupChatPage).toContain(`"${groupId}"`);
      },
    );
    ["CA1 · 主理人成长营 1 期", "私域选品共学营", "CA1 · 作业互助小组", "选品天团 · 私域爆品共创群", "内容工厂 · 朋友圈文案互助群"].forEach(
      (name) => {
        expect(groupChatPage).toContain(name);
      },
    );
  });

  it("不再是群列表页：无页内 Tab、无待分配矛盾文案", () => {
    expect(groupChatPage).not.toContain("社群广场");
    expect(groupChatPage).not.toContain("待分配");
    expect(groupChatPage).not.toContain("待确认入群");
    expect(groupChatPage).not.toContain("群聊同步记录");
  });

  it("提供返回消息列表的入口", () => {
    expect(groupChatPage).toContain('data-nav="__back__"');
  });
});

describe("主理人1 群会话页（group-chat）设计升级", () => {
  it("头部与私聊页统一：subbar 返回栏 + 群人数角标", () => {
    expect(groupChatPage).toContain('class="wxc wxc-subhead"');
    expect(groupChatPage).toContain('id="chat-count"');
  });

  it("每个群附带富卡片：直播 / 投票 / 作业 / 复盘 / 报名", () => {
    [
      "今晚直播 · 连麦复盘",
      "9 月爆款候选投票",
      "本周复盘作业 · 第 2 期",
      "滞销换品复盘结论",
      "下期文案共创 · 报名",
    ].forEach((t) => {
      expect(groupChatPage).toContain(t);
    });
    expect(groupChatPage).toContain("chat-cta--pri");
    expect(groupChatPage).toContain("以下是新消息");
  });

  it("自己气泡统一为「我」环形头像，不再复用联系人照片", () => {
    expect(groupChatPage).toContain("avatar--ring");
    expect(groupChatPage).not.toContain("../assets/avatars/people/avatar-18.jpg");
  });

  it("引入共享会话交互脚本（卡片弹窗 + 本地发送）", () => {
    expect(groupChatPage).toContain("../js/chat-interactions.js");
  });
});

const chatInteractions = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/js/chat-interactions.js"),
  "utf8",
);

describe("主理人1 会话交互脚本（chat-interactions）", () => {
  it("群页按 ?g= 解析各群卡片跳转映射", () => {
    expect(chatInteractions).toContain("GROUP_NAV");
    ["ca1-growth", "selection", "homework", "baokuan", "neirong"].forEach(
      (id) => {
        expect(chatInteractions).toContain(`"${id}"`);
      },
    );
  });

  it("会话页输入栏升级为本地演示发送：div 输入框自动转换 + 发送按钮", () => {
    expect(chatInteractions).toContain('field.tagName !== "INPUT"');
    expect(chatInteractions).toContain("chat-sendpill");
    expect(chatInteractions).toContain("function sendCurrent");
  });
});

const chatPageNames = [
  "成长教练",
  "课程顾问",
  "社群运营",
  "财务官",
  "班班",
  "服务导师",
  "专属顾问",
];

describe("主理人1 私聊会话页（chat--*）", () => {
  it("7 个私聊页均引入共享交互脚本", () => {
    chatPageNames.forEach((name) => {
      const p = readFileSync(
        resolve(process.cwd(), `public/principal-1-h5/pages/chat--${name}.html`),
        "utf8",
      );
      expect(p).toContain("../js/chat-interactions.js");
    });
  });

  it("专属顾问头像与消息列表一致（avatar-18）", () => {
    const p = readFileSync(
      resolve(process.cwd(), "public/principal-1-h5/pages/chat--专属顾问.html"),
      "utf8",
    );
    expect(p).toContain("avatars/people/avatar-18.jpg");
    expect(p).not.toContain("avatars/people/avatar-13.jpg");
  });
});

const groupPage = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/pages/group.html"),
  "utf8",
);

describe("主理人1 项目页（group）", () => {
  it("消息 tab 角标与消息页口径一致为 17", () => {
    expect(groupPage).toContain('<span class="tab-badge wx-text">17</span>');
  });
});

const shellPage = readFileSync(
  resolve(process.cwd(), "public/principal-1-h5/shell.html"),
  "utf8",
);

describe("主理人1 预览壳（shell）", () => {
  it("注册数字会员卡页，消息页「去升级」与我的页会员入口可直达", () => {
    expect(shellPage).toContain('data-slug="member"');
    expect(shellPage).toContain('"slug":"member"');
    expect(shellPage).toContain('"route":"/pages/member/index"');
  });
});
