const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:3002";
const shots = [
  { path: "/", file: "/tmp/sentinel-dashboard.png", wait: "text=What this means for you" },
  { path: "/playbooks", file: "/tmp/sentinel-playbooks.png", wait: "text=The knowledge base" },
  { path: "/agents", file: "/tmp/sentinel-agents.png", wait: "text=Built for AI agents" },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });
  for (const s of shots) {
    await page.goto(BASE + s.path, { waitUntil: "networkidle" });
    await page.waitForSelector(s.wait);
    await page.screenshot({ path: s.file, fullPage: true });
    console.log("shot:", s.file);
  }
  // personal lens on dashboard
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.click("text=For my money");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/tmp/sentinel-dashboard-personal.png", fullPage: true });
  console.log("shot: /tmp/sentinel-dashboard-personal.png");
  await browser.close();
})();
