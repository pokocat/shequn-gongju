import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const notificationsPage = readFileSync(
  resolve(process.cwd(), "public/member-app/pages/notifications.html"),
  "utf8",
);

describe("消息页社群三 Tab", () => {
  it("将对话、我的微信群和社群广场保留在同一个页面内", () => {
    expect(notificationsPage).toContain('data-section="dialogues"');
    expect(notificationsPage).toContain('data-section="my-groups"');
    expect(notificationsPage).toContain('data-section="community-square"');
    expect(notificationsPage).toContain('data-panel="dialogues"');
    expect(notificationsPage).toContain('data-panel="my-groups"');
    expect(notificationsPage).toContain('data-panel="community-square"');
  });

  it("仅传递群会话页支持的群标识", () => {
    ["ca1", "xuanke", "hudong", "baokuan", "neirong"].forEach((groupId) => {
      expect(notificationsPage).toContain(`data-g="${groupId}"`);
    });

    expect(notificationsPage).not.toContain('data-g="xuanpin"');
    expect(notificationsPage).not.toContain('data-g="homework"');
    expect(notificationsPage).not.toContain('data-g="content"');
  });

  it("保留群详情跳转和高级群升级入口", () => {
    expect(notificationsPage).toContain('data-nav="group-chat"');
    expect(notificationsPage).toContain('data-nav="benefits"');
    expect(notificationsPage).not.toContain('data-nav="member"');
    expect(notificationsPage).toContain('data-vip="私域续费实战营"');
    expect(notificationsPage).toContain('id="community-vip-sheet"');
  });
});
