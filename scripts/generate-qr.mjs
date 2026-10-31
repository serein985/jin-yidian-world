import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const { chromium } = require("@playwright/test");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/generate-qr.mjs <http-url>");
  process.exit(1);
}

const url = new URL(input);
if (url.protocol !== "http:" && url.protocol !== "https:") {
  console.error("QR URL must use http: or https:.");
  process.exit(1);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const qrSvg = await QRCode.toString(url.toString(), {
  type: "svg",
  width: 510,
  margin: 1,
  errorCorrectionLevel: "H",
  color: {
    dark: "#173d2b",
    light: "#fbf7e8",
  },
});

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
          body {
            background: #d7dfca;
            font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
          }
          .poster {
            position: relative;
            width: 1200px;
            height: 1600px;
            overflow: hidden;
            padding: 82px 90px 70px;
            color: #f8f4e5;
            background:
              radial-gradient(circle at 80% 8%, rgba(240, 225, 194, 0.16), transparent 28%),
              linear-gradient(148deg, #365d44, #1d4331 58%, #123225);
          }
          .bamboo {
            position: absolute;
            top: -40px;
            right: -30px;
            width: 410px;
            height: 1080px;
            opacity: 0.16;
          }
          .bamboo span {
            position: absolute;
            width: 30px;
            height: 1150px;
            border-radius: 30px;
            background: #e3e8c8;
            transform-origin: top center;
          }
          .bamboo span:nth-child(1) { right: 235px; top: -160px; transform: rotate(8deg); }
          .bamboo span:nth-child(2) { right: 105px; top: -190px; width: 22px; transform: rotate(-7deg); }
          .bamboo span:nth-child(3) { right: 20px; top: -100px; width: 16px; transform: rotate(12deg); }
          .bamboo i {
            position: absolute;
            width: 132px;
            height: 34px;
            border-radius: 100% 0;
            background: #e3e8c8;
          }
          .bamboo i:nth-of-type(1) { top: 260px; right: 140px; transform: rotate(-36deg); }
          .bamboo i:nth-of-type(2) { top: 480px; right: 20px; transform: rotate(24deg); }
          .bamboo i:nth-of-type(3) { top: 680px; right: 195px; transform: rotate(160deg); }

          .brand-row {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 22px;
          }
          .brand-mark {
            position: relative;
            width: 74px;
            height: 86px;
          }
          .brand-mark::before {
            position: absolute;
            top: 4px;
            left: 37px;
            width: 5px;
            height: 76px;
            border-radius: 5px;
            background: #edf0d7;
            content: "";
            transform: rotate(12deg);
          }
          .brand-mark i {
            position: absolute;
            width: 37px;
            height: 18px;
            border: 3px solid #edf0d7;
            border-radius: 100% 0;
          }
          .brand-mark i:first-child { top: 11px; left: 4px; transform: rotate(22deg); }
          .brand-mark i:last-child { right: 1px; bottom: 11px; transform: rotate(198deg); }
          .brand-name {
            margin: 0;
            font-family: "STSong", "Songti SC", serif;
            font-size: 46px;
            font-weight: 700;
          }
          .brand-caption {
            margin: 7px 0 0;
            color: rgba(245, 242, 219, 0.62);
            font-size: 17px;
            font-weight: 600;
          }
          .code {
            padding: 12px 17px;
            border: 1px solid rgba(247, 243, 228, 0.24);
            border-radius: 8px;
            color: rgba(247, 243, 228, 0.8);
            font-size: 16px;
            font-weight: 700;
          }

          .hero-copy {
            position: relative;
            margin-top: 65px;
          }
          .eyebrow {
            margin: 0 0 16px;
            color: #cedbb3;
            font-size: 18px;
            font-weight: 800;
          }
          h1 {
            max-width: 840px;
            margin: 0;
            font-family: "STSong", "Songti SC", serif;
            font-size: 70px;
            font-weight: 700;
            line-height: 1.17;
          }
          .subtitle {
            width: 720px;
            margin: 23px 0 0;
            color: rgba(247, 243, 228, 0.7);
            font-size: 21px;
            line-height: 1.72;
          }

          .animal-row {
            display: flex;
            flex-wrap: wrap;
            gap: 13px;
            margin-top: 30px;
          }
          .animal {
            display: flex;
            min-height: 58px;
            align-items: center;
            gap: 11px;
            padding: 9px 16px 9px 9px;
            border: 1px solid rgba(252, 248, 232, 0.2);
            border-radius: 8px;
            background: rgba(17, 49, 32, 0.24);
          }
          .animal i {
            display: grid;
            width: 40px;
            height: 40px;
            place-items: center;
            border-radius: 50%;
            color: #303d31;
            font-family: "STSong", "Songti SC", serif;
            font-size: 19px;
            font-style: normal;
            font-weight: 700;
          }
          .animal--red i { background: #e3c0ae; }
          .animal--tiger i { background: #ead29b; }
          .animal--sheep i { background: #edd8d1; }
          .animal span { display: block; }
          .animal strong {
            display: block;
            font-size: 17px;
          }
          .animal small {
            display: block;
            margin-top: 3px;
            color: rgba(249, 245, 229, 0.58);
            font-size: 12px;
          }

          .scan-panel {
            position: relative;
            display: grid;
            grid-template-columns: 520px 1fr;
            gap: 48px;
            align-items: center;
            margin-top: 35px;
            padding: 48px;
            border: 1px solid rgba(255, 252, 236, 0.42);
            border-radius: 8px;
            color: #1f3325;
            background: #fbf7e8;
            box-shadow: 0 28px 80px rgba(5, 26, 14, 0.26);
          }
          .qr {
            display: grid;
            width: 458px;
            height: 458px;
            place-items: center;
            overflow: hidden;
            border: 1px solid #d6d0b9;
            background: #fbf7e8;
          }
          .qr svg { display: block; width: 430px; height: 430px; }
          .scan-copy strong {
            display: block;
            font-family: "STSong", "Songti SC", serif;
            font-size: 40px;
            line-height: 1.3;
          }
          .scan-copy p {
            margin: 22px 0 0;
            color: #62705e;
            font-size: 18px;
            line-height: 1.7;
          }
          .url {
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid #d7d1ba;
            color: #536350;
            font-size: 15px;
            line-height: 1.55;
            overflow-wrap: anywhere;
          }
          .footer {
            position: absolute;
            right: 90px;
            bottom: 50px;
            left: 90px;
            display: flex;
            justify-content: space-between;
            color: rgba(247, 243, 228, 0.53);
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <main class="poster">
          <div class="bamboo" aria-hidden="true">
            <span></span><span></span><span></span>
            <i></i><i></i><i></i>
          </div>
          <div class="brand-row">
            <div class="brand">
              <div class="brand-mark" aria-hidden="true"><i></i><i></i></div>
              <div>
                <p class="brand-name">近一点</p>
                <p class="brand-caption">我的动物世界</p>
              </div>
            </div>
            <span class="code">八种预设 · 自己画的也可以住进来</span>
          </div>
          <section class="hero-copy">
            <p class="eyebrow">选择、创作、陪伴、留下记录</p>
            <h1>把喜欢的动物，<br />放进今天的世界。</h1>
            <p class="subtitle">从八种动物中选择伙伴，或上传自己的画作，设置触摸点和动作，让它成为只属于你的动物。</p>
          </section>
          <div class="animal-row">
            <div class="animal animal--red"><i>糯</i><span><strong>糯糯</strong><small>大熊猫</small></span></div>
            <div class="animal animal--red"><i>栗</i><span><strong>栗栗</strong><small>小熊猫</small></span></div>
            <div class="animal animal--tiger"><i>呜</i><span><strong>阿呜</strong><small>小老虎</small></span></div>
            <div class="animal animal--sheep"><i>棉</i><span><strong>棉棉</strong><small>小羊</small></span></div>
            <div class="animal animal--red"><i>泡</i><span><strong>泡芙</strong><small>水豚</small></span></div>
            <div class="animal animal--sheep"><i>米</i><span><strong>米粒</strong><small>兔子</small></span></div>
            <div class="animal animal--tiger"><i>焰</i><span><strong>小焰</strong><small>狐狸</small></span></div>
            <div class="animal animal--red"><i>豆</i><span><strong>豆丁</strong><small>企鹅</small></span></div>
          </div>
          <section class="scan-panel">
            <div class="qr">${qrSvg}</div>
            <div class="scan-copy">
              <strong>用手机相机<br />对准二维码</strong>
              <p>打开后可以创建自己的动物世界、调整收藏、互动、查看日历和领取优惠券。</p>
              <div class="url">${escapeHtml(url.toString())}</div>
            </div>
          </section>
          <footer class="footer">
            <span>公网演示 · 手机可直接扫码访问</span>
            <span>近一点 · 2026</span>
          </footer>
        </main>
      </body>
    </html>`,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(() => document.fonts.ready);

  const output = resolve("outputs/world-entry-qr.png");
  await mkdir(resolve("outputs"), { recursive: true });
  await page.screenshot({ path: output });
  console.log(output);
} finally {
  await browser.close();
}
