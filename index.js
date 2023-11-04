const puppeteerExtra = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
require('dotenv').config();


const websiteURL = process.env.WEBSITE.toString();
const userEmail = process.env.EMAIL.toString();
const userPassword = process.env.PASSWORD.toString();
const capId = process.env.CAP_ID;
const capToken = process.env.CAP_TOKEN;


puppeteerExtra.use(
  RecaptchaPlugin({
    provider: {
      id: capId,
      token: capToken
    },
    visualFeedBack: true
  })
)


const doSomething = async () => {
  const browser = await puppeteerExtra.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(websiteURL);
  await page.waitForSelector(".mdl-button");

  await page.type("#email", userEmail);
  await page.type("#password", userPassword);


  const { solved, error } = await page.solveRecaptchas();
  if (solved) {
    console.log("Solved", solved)
  } else {
    console.log("Not solved", error)
  }

  const btn = await page.$(".mdl-button--raised");

  await btn.click();

  await page.goto(`${websiteURL}/ideas`);

  const btns = await page.$$("button");

  for (const bt of btns) {
    const buttonClass = await bt.evaluate(el => console.log(el))
    console.log(buttonClass)
  }


  await page.screenshot({ path: "pic.png" });
  await browser.close()
}

doSomething();