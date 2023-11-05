import { Browser } from "puppeteer";

const puppeteerExtra = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
require("dotenv").config();

const websiteURL = process.env.WEBSITE;
const userEmail = process.env.EMAIL ?? "";
const userPassword = process.env.PASSWORD ?? "";
const capId = process.env.CAP_ID;
const capToken = process.env.CAP_TOKEN;

puppeteerExtra.use(
  RecaptchaPlugin({
    provider: {
      id: capId,
      token: capToken,
    },
    visualFeedBack: true,
  })
);

(async () => {
  const browser: Browser = await puppeteerExtra.launch({ headless: false });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(`${websiteURL}/auth`);
  await page.waitForSelector(".mdl-button");

  await page.type("#email", userEmail);
  await page.type("#password", userPassword);

  const { solved, error } = await page.solveRecaptchas();
  if (solved) {
    console.log("Solved", solved);
  } else {
    console.log("Not solved", error);
  }

  await page.$(".mdl-button--raised").then(async (btn) => await btn?.click());

  await page.waitForNavigation();

  await page.goto(`${websiteURL}/my/ideas`);

  await page.waitForSelector(".mdl-button--disabled");

  const activeBtns = await page.$$(".mdl-button--disabled");

  for (const t of activeBtns) {
    await t.click();
    await t.click();
  }

  await page.screenshot({ path: `pic.png` });
  await browser.close();
})();
