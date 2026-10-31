import { expect, test, type Page } from "@playwright/test";
import { stat } from "node:fs/promises";

async function login(page: Page, nickname = "小满") {
  await page.getByLabel("游客昵称").fill(nickname);
  await page.getByRole("button", { name: "进入我的动物世界" }).click();
}

async function makeTestArtwork(page: Page) {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 520;
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#e9b4a7";
    context.beginPath();
    context.ellipse(240, 260, 155, 185, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f9f0df";
    context.beginPath();
    context.ellipse(240, 290, 105, 130, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#4a362e";
    context.beginPath();
    context.arc(185, 245, 26, 0, Math.PI * 2);
    context.arc(295, 245, 26, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#98665e";
    context.lineWidth = 7;
    context.beginPath();
    context.arc(240, 300, 38, 0.2, Math.PI - 0.2);
    context.stroke();
    return canvas.toDataURL("image/png");
  });
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

test("complete personalized animal and calendar flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?visit=habitat");
  await page.screenshot({ path: "work/personalized-login.png" });

  await page.getByRole("button", { name: "选择饲养员工作证风格" }).click();
  await login(page);

  await expect(page.getByRole("heading", { name: "栗栗" })).toBeVisible();
  await expect(page.locator(".painted-animal").first()).toBeVisible();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "work/personalized-home.png" });
  const portrait = await page.locator(".home-hero__stage").screenshot({
    path: "work/personalized-portrait-home.png",
  });
  expect(portrait.byteLength).toBeGreaterThan(10_000);
  const heroArt = await page.locator(".home-hero__stage img").evaluate((image) => ({
    loaded: (image as HTMLImageElement).complete &&
      (image as HTMLImageElement).naturalWidth > 0,
    animation: getComputedStyle(image).animationName,
  }));
  expect(heroArt.loaded).toBe(true);
  expect(heroArt.animation).not.toBe("none");
  const firstTransform = await page
    .locator(".home-hero__stage img")
    .evaluate((image) => getComputedStyle(image).transform);
  await page.waitForTimeout(420);
  const secondTransform = await page
    .locator(".home-hero__stage img")
    .evaluate((image) => getComputedStyle(image).transform);
  expect(secondTransform).not.toBe(firstTransform);

  await page.getByRole("button", { name: "进入栗栗的世界" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "work/sticker-detail-screen.png" });
  const detailIllustration = await page.locator(".detail-model").screenshot({
    path: "work/sticker-detail-red-panda.png",
  });
  expect(detailIllustration.byteLength).toBeGreaterThan(20_000);
  await page.getByRole("button", { name: "3D", exact: true }).click();
  await expect(page.locator(".animal-3d-stage canvas")).toBeVisible();
  await page.waitForTimeout(1200);
  const detail3D = await page.locator(".detail-model").screenshot({
    path: "work/personalized-3d-detail.png",
  });
  expect(detail3D.byteLength).toBeGreaterThan(20_000);
  await page.getByRole("button", { name: "返回" }).click();

  await page.getByRole("button", { name: "添加动物" }).click();
  await page.waitForTimeout(260);
  await page.screenshot({
    path: "work/sticker-library-390.png",
  });
  await page.getByRole("button", { name: "添加糯糯" }).click();
  await page.getByRole("button", { name: "关闭动物库" }).click();
  await expect(page.getByRole("button", { name: "切换到糯糯" })).toBeVisible();

  await page.getByRole("button", { name: "添加动物" }).click();
  await page.getByRole("button", { name: /带一张自己的画来/ }).click();
  await expect(page.getByRole("heading", { name: "原创动物创作台" })).toBeVisible();

  const artwork = await makeTestArtwork(page);
  await page.getByLabel("上传动物画作").setInputFiles({
    name: "my-animal.png",
    mimeType: "image/png",
    buffer: artwork,
  });
  await expect(page.locator(".artwork-stage")).toBeVisible();
  await page.getByLabel("动物名称").fill("小云");
  await page.getByLabel("物种").fill("云朵兽");
  await page.locator(".artwork-stage").click({ position: { x: 170, y: 145 } });
  await page.getByRole("button", { name: "局部弹跳" }).click();
  await expect(page.locator(".artwork-touchpoint")).toHaveCount(1);
  await page.screenshot({ path: "work/personalized-creator.png", fullPage: true });

  await page
    .getByRole("button", { name: "保存并进入它的世界" })
    .click();
  await expect(
    page.getByRole("heading", { name: "小云", level: 1 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "轻轻摸一下" }).click();
  await expect(page.getByRole("meter", { name: "小云的喂养值" })).toHaveAttribute(
    "aria-valuenow",
    "1",
  );

  await page.getByRole("button", { name: "打开日历" }).click();
  await page.getByRole("button", { name: "新建" }).click();
  const dialog = page.getByRole("dialog", { name: "添加日历事项" });
  await dialog.getByLabel("标题").fill("再来看小云");
  await dialog.getByRole("button", { name: "保存到日历" }).click();
  await expect(page.getByText("再来看小云").first()).toBeVisible();
  await page.screenshot({ path: "work/personalized-calendar.png", fullPage: true });

  await page.getByRole("button", { name: "打开我的券包" }).click();
  await expect(page.getByRole("heading", { name: "我的券包" })).toBeVisible();
  await expect(page.getByText("未解锁", { exact: true })).toHaveCount(5);

  await page.getByRole("button", { name: "返回" }).click();
  await page.getByRole("button", { name: "打开扫码" }).click();
  await page.getByLabel("手动输入动物编号").fill("preset-fox");
  await page.getByRole("button", { name: "打开", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "小焰", level: 1 }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

for (const viewport of [
  { width: 320, height: 700 },
  { width: 360, height: 800 },
  { width: 430, height: 932 },
]) {
  test(`login and home fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?visit=habitat");
    await expect(page.getByRole("heading", { name: /把喜欢的动物/ })).toBeVisible();
    await login(page);
    await expect(page.getByRole("heading", { name: "栗栗" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await page.screenshot({
      path: `work/personalized-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
  });
}
