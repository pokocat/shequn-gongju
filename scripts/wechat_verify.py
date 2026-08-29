"""Verify WeChatManagement: 3 view dimensions + 5-stage lifecycle + project/person grouping"""
from playwright.sync_api import sync_playwright
import sys

URL = "http://127.0.0.1:5184/?view=pc&module=wechat"
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
    console_errors = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type in ("error", "warning") else None)

    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    page.screenshot(path="/tmp/wechat_1_type_view.png", full_page=False)

    # 1. 验证主标题和生命周期进度条
    title = page.locator("text=微信台账 · 账号资产融合视图")
    if not title.is_visible():
        errors.append("主标题「微信台账 · 账号资产融合视图」不可见")
    else:
        print("✓ 主标题可见")

    lifecycle_labels = ["注册入库", "养号期", "分配到项目", "发放到人", "归档停用"]
    for label in lifecycle_labels:
        if not page.get_by_text(label, exact=False).first.is_visible():
            errors.append(f"5阶段进度条缺少「{label}」")
        else:
            print(f"✓ 生命周期阶段「{label}」可见")

    # 2. 验证三维度切换 Tab
    dim_tabs = ["按账号类型", "按项目", "按人"]
    for tab in dim_tabs:
        if not page.get_by_text(tab, exact=True).first.is_visible():
            errors.append(f"缺少三维度切换「{tab}」")
        else:
            print(f"✓ 维度 Tab「{tab}」可见")

    # 3. 验证5阶段筛选条（全部阶段 + 5个）
    lc_filters = ["全部阶段", "注册入库", "养号期", "分配到项目", "发放到人", "归档停用"]
    for f in lc_filters:
        if not page.get_by_text(f, exact=False).first.is_visible():
            errors.append(f"缺少生命周期筛选「{f}」")
        else:
            print(f"✓ 生命周期筛选「{f}」可见")

    # 4. 按项目视图切换
    print("\n→ 切换到按项目视图")
    page.get_by_text("按项目", exact=True).click()
    page.wait_for_timeout(1500)
    page.screenshot(path="/tmp/wechat_2_project_view.png", full_page=False)
    idle_pool = page.get_by_text("空闲号池")
    if idle_pool.is_visible():
        print("✓ 按项目视图：空闲号池分区可见")
    else:
        errors.append("按项目视图：未发现空闲号池分区")
    project_cards = page.locator("section").count()
    print(f"  项目分组数量（含空闲号池）: {project_cards}")
    if project_cards < 3:
        errors.append(f"按项目视图分组过少（{project_cards}），期望至少 3 组（空闲号池 + 项目们）")

    # 5. 按人视图切换
    print("\n→ 切换到按人视图")
    page.get_by_text("按人", exact=True).click()
    page.wait_for_timeout(1500)
    page.screenshot(path="/tmp/wechat_3_person_view.png", full_page=False)
    unassigned = page.get_by_text("空闲未分配")
    if unassigned.is_visible():
        print("✓ 按人视图：空闲未分配池可见")
    else:
        errors.append("按人视图：未发现「空闲未分配」分区")
    person_count = page.locator("section").count()
    print(f"  人员分组数量（含空闲未分配）: {person_count}")
    if page.get_by_text("容量用率").first.is_visible():
        print("✓ 按人视图：容量用率 KPI 可见")
    if page.get_by_text("名下工具").first.is_visible():
        print("✓ 按人视图：名下工具 KPI 可见")

    # 6. 回到按账号类型测试筛选
    print("\n→ 切换回按账号类型")
    page.get_by_text("按账号类型", exact=True).click()
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/wechat_4_type_personal.png", full_page=False)

    print("\n→ 点击「养号期」筛选")
    try:
        page.locator("button").filter(has_text="养号期").nth(0).click()
        page.wait_for_timeout(1000)
        print("✓ 养号期筛选按钮可点击")
    except Exception as e:
        errors.append(f"点击养号期筛选失败: {e}")

    page.screenshot(path="/tmp/wechat_5_final.png", full_page=True)
    browser.close()

print("\n" + "=" * 60)
print("Console errors/warnings:", len(console_errors))
for e in console_errors[:6]:
    print("  console:", e[:200])
if errors:
    print("\n❌ FAIL 项:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
print("\n✅ 全部验证通过：三维度切换 + 5阶段生命周期 + 分组视图均正常")
