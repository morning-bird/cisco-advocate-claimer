import playwright from "playwright";
const signInUrl1 = "https://id.cisco.com";
const signInUrl2 = "https://id.cisco.com/signin";
const profileUrl = "https://id.cisco.com/ui/v1.0/profile-ui";
const url = "https://insideradvocates.cisco.com/challenges";

export async function CiscoAdvocates() {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
  });

  const page = await context.newPage();
  let isClaimButtonError = false;

  try {
    await page.goto(url, {
      waitUntil: "networkidle0",
    });
    let doLoginPhase = false;
    if (page.url().startsWith(signInUrl1)) {
      doLoginPhase = true;
    }
    if (doLoginPhase) {
      console.log("Need to login");
      await page.goto(signInUrl2);
      await page.waitForSelector("#okta-signin-username", {
        timeout: 10000,
      });
      await page.fill("#okta-signin-username", process.env.CISCO_USER);
      await page;
      await page.fill("#okta-signin-password", process.env.CISCO_PASS);
      await page.click("#okta-signin-submit");
      await page.waitForURL(profileUrl, {
        waitUntil: "networkidle0",
      });
      console.log("Login completed, go to primary page");
      await page.goto(url);
      isClaimButtonError = true;
      await page.waitForSelector("button[data-qa=STREAKS-QA_claim-button]", {
        timeout: 10000,
      });
      await page.click("button[data-qa=STREAKS-QA_claim-button]");
    }
    console.log("Task done");
    await browser.close();
  } catch (err) {
    // kalau hanya claim button-nya saja yang tidak ketemu, biarkan saja
    if (!isClaimButtonError) {
      console.error(err);
    } else {
      console.log("Claim button not found");
    }
    await browser.close();
  }
}
