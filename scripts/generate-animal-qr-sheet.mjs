import { mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const { chromium } = require("@playwright/test");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/generate-animal-qr-sheet.mjs <app-url>");
  process.exit(1);
}

const baseUrl = new URL(input);
if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
  console.error("App URL must use http: or https:.");
  process.exit(1);
}

const animals = [
  ["panda", "糯糯", "小白熊", "#f1eadf", "#303a31"],
  ["red-panda", "栗栗", "小橘猫", "#e7c5b4", "#794c39"],
  ["tiger", "阿呜", "小老虎", "#ead29d", "#76542e"],
  ["sheep", "棉棉", "小羊", "#efdcd6", "#815d57"],
  ["capybara", "泡芙", "小狗", "#d7c0a1", "#6c513b"],
  ["rabbit", "米粒", "兔子", "#eee9e0", "#66544b"],
  ["fox", "小焰", "小鹿", "#e1b092", "#7d4835"],
  ["penguin", "豆丁", "小鼠", "#c9d5d8", "#354c54"],
  ["bear-pie", "团团", "小棕熊", "#d4b7a0", "#624638"],
  ["mirror-rabbit", "雪球", "小白兔", "#efe8dc", "#655149"],
  ["pig", "桃桃", "小猪", "#efcbd2", "#7b4d55"],
  ["book-dog", "阿卷", "小狗", "#ddc49f", "#62513d"],
];

const cards = await Promise.all(
  animals.map(async ([id, name, species, background, ink]) => {
    const sticker = await readFile(resolve("public/stickers", `${id}.png`));
    const stickerUrl = `data:image/png;base64,${sticker.toString("base64")}`;
    const url = new URL(baseUrl);
    url.search = "";
    url.searchParams.set("animal", `preset-${id}`);
    url.searchParams.set("source", "park");
    const svg = await QRCode.toString(url.toString(), {
      type: "svg",
      width: 230,
      margin: 0,
      errorCorrectionLevel: "H",
      color: { dark: "#18382a", light: "#fffaf0" },
    });
    return `
      <article class="animal-card" style="--animal-bg:${background};--animal-ink:${ink}">
        <div class="animal-label">
          <span><img src="${stickerUrl}" alt="" /></span>
          <div><strong>${name}</strong><small>${species}</small></div>
        </div>
        <div class="qr">${svg}</div>
        <p>扫描进入${name}的专属页面</p>
      </article>`;
  }),
);

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { width: 100%; min-height: 100%; margin: 0; }
          body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; }
          .sheet {
            width: 1200px;
            height: 1600px;
            padding: 70px 64px;
            color: #f8f4e7;
            background:
              radial-gradient(circle at 78% 4%, rgba(245, 231, 197, 0.16), transparent 27%),
              linear-gradient(145deg, #3c6149, #1b4130 58%, #102f22);
          }
          header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: 32px;
          }
          .eyebrow {
            margin: 0 0 8px;
            color: #cbd8b1;
            font-size: 15px;
            font-weight: 800;
          }
          h1 {
            margin: 0;
            font-family: "STSong", "Songti SC", serif;
            font-size: 54px;
            line-height: 1.2;
          }
          header p:last-child {
            max-width: 430px;
            margin: 0;
            color: rgba(248, 244, 231, 0.62);
            font-size: 16px;
            line-height: 1.7;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 19px;
          }
          .animal-card {
            padding: 18px;
            border-radius: 8px;
            color: #25362a;
            background: #fbf6e7;
            box-shadow: 0 16px 35px rgba(4, 22, 11, 0.2);
          }
          .animal-label {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .animal-label > span {
            display: grid;
            width: 54px;
            height: 54px;
            place-items: center;
            border-radius: 50%;
            color: var(--animal-ink);
            background: var(--animal-bg);
            overflow: hidden;
          }
          .animal-label img {
            display: block;
            width: 62px;
            height: 62px;
            object-fit: contain;
          }
          .animal-label strong,
          .animal-label small {
            display: block;
          }
          .animal-label strong {
            font-family: "STSong", "Songti SC", serif;
            font-size: 21px;
          }
          .animal-label small {
            margin-top: 3px;
            color: #7b8578;
            font-size: 11px;
          }
          .qr {
            display: grid;
            height: 238px;
            margin-top: 14px;
            place-items: center;
            border: 1px solid #d4ccb7;
            background: #fffaf0;
          }
          .qr svg {
            display: block;
            width: 215px;
            height: 215px;
          }
          .animal-card > p {
            margin: 12px 0 0;
            color: #7d867a;
            font-size: 11px;
            text-align: center;
          }
          footer {
            display: flex;
            justify-content: space-between;
            margin-top: 31px;
            color: rgba(247, 243, 227, 0.48);
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          <header>
            <div>
              <p class="eyebrow">PARK ANIMAL QR · NEARER</p>
              <h1>扫描动物牌，直接去见它。</h1>
            </div>
            <p>十二个园区二维码对应十二个独立详情页。首次访问可先建立本地身份，之后扫码会直接进入对应动物。</p>
          </header>
          <section class="grid">${cards.join("")}</section>
          <footer>
            <span>近一点 · 我的动物世界</span>
            <span>比赛原型二维码测试页</span>
          </footer>
        </main>
      </body>
    </html>`,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(() => document.fonts.ready);
  const output = resolve("outputs/preset-animal-qr-sheet.png");
  await mkdir(resolve("outputs"), { recursive: true });
  await page.screenshot({ path: output });
  console.log(output);
} finally {
  await browser.close();
}
