// One-off visual check: screenshots the scissors scroll section at several
// progress fractions. Usage: node scripts/shoot-scissors.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

page.on("console", (msg) => {
  if (msg.type() === "error") console.log("[console.error]", msg.text());
});
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2500);

const section = await page.evaluate(() => {
  const el = [...document.querySelectorAll("section")].find((s) =>
    s.className.includes("260vh")
  );
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top + window.scrollY, height: rect.height };
});
if (!section) {
  console.log("section not found");
  await browser.close();
  process.exit(1);
}
console.log("section", JSON.stringify(section));

const vh = 900;
for (const f of [0.0, 0.2, 0.42, 0.52, 0.62, 0.8, 1.0]) {
  const y = section.top + f * (section.height - vh);
  await page.evaluate((top) => window.scrollTo(0, top), y);
  // let the damped 3D animation settle
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/p${String(f).replace(".", "_")}.png` });
  console.log("shot", f);
}

await browser.close();
console.log("done");
