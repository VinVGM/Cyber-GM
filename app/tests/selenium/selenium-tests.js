const assert = require("assert");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:3000";
const defaultTimeout = 10000;
const reportPath = path.join(__dirname, "report", "selenium-report.json");
const testResults = [];

async function ensureServerIsRunning(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method: "GET", timeout }, (res) => {
      res.resume();
      resolve(true);
    });

    request.on("error", (err) => {
      reject(err);
    });

    request.on("timeout", () => {
      request.destroy(new Error("Server check timed out"));
    });

    request.end();
  });
}

async function findElement(driver, locator, timeout = defaultTimeout) {
  return driver.wait(until.elementLocated(locator), timeout);
}

async function assertElementText(driver, locator, expectedText, timeout = defaultTimeout) {
  const element = await findElement(driver, locator, timeout);
  const text = await element.getText();
  assert(
    text.toLowerCase().includes(expectedText.toLowerCase()),
    `Expected text '${expectedText}' in '${text}'`
  );
}

async function testLandingPage(driver) {
  console.log("[Selenium] Testing landing page...");
  await driver.get(baseUrl);

  await findElement(driver, By.css("nav"));
  await assertElementText(driver, By.css("nav"), "CYBER-GM");
  await findElement(driver, By.css("a[href='/login']"));
  await assertElementText(driver, By.css("a[href='/login']"), "LOGIN");

  const heroText = await driver.findElement(By.css("h1")).getText();
  assert(heroText.includes("Elite Cybersecurity"), "Landing hero text not found");
  console.log("[Selenium] Landing page verified.");
}

async function testLoginPageElements(driver) {
  console.log("[Selenium] Testing login page elements...");
  await driver.get(`${baseUrl}/login`);

  await findElement(driver, By.id("email"));
  await findElement(driver, By.id("password"));
  await findElement(driver, By.css("button[type='submit']"));
  await assertElementText(driver, By.css("h2, h1, .card-title, .text-2xl"), "LOGIN");

  console.log("[Selenium] Login page elements are present.");
}

async function testLoginInvalidCredentials(driver) {
  console.log("[Selenium] Testing login with invalid credentials...");
  await driver.get(`${baseUrl}/login`);

  await driver.findElement(By.id("email")).sendKeys("invalid@example.com");
  await driver.findElement(By.id("password")).sendKeys("wrongpassword");
  await driver.findElement(By.css("button[type='submit']")).click();

  const errorElement = await findElement(driver, By.css("div.text-destructive, .text-destructive, .error"), 15000);
  const errorText = await errorElement.getText();
  assert(
    errorText.trim().length > 0,
    `Expected a login error message, got: ${errorText}`
  );

  console.log("[Selenium] Invalid login error displayed.");
}

async function testForgotPasswordFlow(driver) {
  console.log("[Selenium] Testing forgot password flow...");
  await driver.get(`${baseUrl}/login`);

  const forgotLink = await findElement(driver, By.linkText("FORGOT PASSWORD?"));
  await forgotLink.click();

  await driver.wait(until.urlContains("/forgot-password"), defaultTimeout);
  await findElement(driver, By.id("email"));
  await findElement(driver, By.xpath("//*[contains(normalize-space(text()), 'RECOVER ACCESS')]") );

  console.log("[Selenium] Forgot password navigation is successful.");
}

async function testRegisterPageFlow(driver) {
  console.log("[Selenium] Testing register page flow...");
  await driver.get(`${baseUrl}/login`);

  const registerLink = await findElement(driver, By.linkText("CREATE AN ACCOUNT HERE"));
  await registerLink.click();

  await driver.wait(until.urlContains("/register"), defaultTimeout);
  await findElement(driver, By.id("full_name"));
  await findElement(driver, By.id("designation"));
  await findElement(driver, By.id("sector"));
  await findElement(driver, By.id("email"));
  await findElement(driver, By.id("password"));

  console.log("[Selenium] Register page flow is successful.");
}

async function testLoginSuccess(driver) {
  console.log("[Selenium] Testing login with valid credentials...");
  await driver.get(`${baseUrl}/login`);

  await driver.findElement(By.id("email")).sendKeys("wow2@gmail.com");
  await driver.findElement(By.id("password")).sendKeys("lmao123!@");
  await driver.findElement(By.css("button[type='submit']")).click();

  await driver.wait(until.urlContains("/dashboard"), 20000);
  await assertElementText(driver, By.css("span, h1, h2"), "DASHBOARD");
  await findElement(driver, By.xpath("//button[contains(., 'PROFILE') or contains(., 'Profile') or contains(., 'profile') ]"));
  await findElement(driver, By.xpath("//button[contains(., 'ISSUE TRACKER') or contains(., 'Issue Tracker') or contains(., 'issue tracker') ]"));

  console.log("[Selenium] Login and dashboard navigation succeeded.");
}

async function testProfileNavigation(driver) {
  console.log("[Selenium] Testing profile navigation...");

  const profileButton = await findElement(driver, By.xpath("//button[contains(., 'PROFILE') or contains(., 'Profile') or contains(., 'profile') ]"));
  await profileButton.click();

  await driver.wait(until.urlContains("/profile"), defaultTimeout);
  await assertElementText(driver, By.css("h2, h1, .text-2xl, .text-xl"), "EMPLOYEE PROFILE");

  const cancelButton = await findElement(driver, By.xpath("//button[contains(., 'CANCEL') or contains(., 'Cancel') ]"));
  await cancelButton.click();
  await driver.wait(until.urlContains("/dashboard"), defaultTimeout);

  console.log("[Selenium] Profile page loaded and returned to dashboard successfully.");
}

async function testIssueTrackerCreateAndSearch(driver) {
  console.log("[Selenium] Testing issue tracker create and search...");

  const issueTrackerButton = await findElement(driver, By.xpath("//button[contains(., 'ISSUE TRACKER') or contains(., 'Issue Tracker') or contains(., 'issue tracker') ]"));
  await issueTrackerButton.click();

  await driver.wait(until.urlContains("/dashboard/issues"), defaultTimeout);
  await findElement(driver, By.xpath("//h1[contains(., 'ISSUE TRACKER') or contains(., 'Issue Tracker')]") );

  const issueTitle = `Selenium test issue ${Date.now()}`;
  const issueDescription = "Test issue created by Selenium automation.";

  const newIssueButton = await findElement(driver, By.xpath("//button[contains(., '+ NEW ISSUE') or contains(., 'NEW ISSUE') or contains(., 'New Issue')]"));
  await newIssueButton.click();

  await findElement(driver, By.xpath("//*[contains(normalize-space(.), 'REPORT VULNERABILITY') or contains(normalize-space(.), 'UPDATE VULNERABILITY')]") );
  const titleInput = await findElement(driver, By.id("title"));
  await titleInput.sendKeys(issueTitle);
  const descInput = await findElement(driver, By.id("desc"));
  await descInput.sendKeys(issueDescription);

  const submitButton = await findElement(driver, By.xpath("//button[contains(normalize-space(.), 'SUBMIT REPORT') or contains(normalize-space(.), 'UPDATE RECORD') ]"));
  await submitButton.click();

  await driver.wait(until.elementLocated(By.xpath(`//div[contains(., "${issueTitle}")]`)), 20000);
  await assertElementText(driver, By.xpath(`//div[contains(., "${issueTitle}")]`), issueTitle);

  const searchInput = await findElement(driver, By.xpath("//input[@placeholder='SEARCH PROTOCOLS...' or contains(@placeholder, 'SEARCH')]"));
  await searchInput.clear();
  await searchInput.sendKeys(issueTitle);

  await driver.wait(until.elementLocated(By.xpath(`//div[contains(., "${issueTitle}")]`)), 10000);
  await assertElementText(driver, By.xpath(`//div[contains(., "${issueTitle}")]`), issueTitle);

  console.log("[Selenium] Issue tracker create and search succeeded.");
}

async function testLogout(driver) {
  console.log("[Selenium] Testing logout flow...");

  await driver.get(`${baseUrl}/dashboard`);
  await driver.wait(until.urlContains("/dashboard"), defaultTimeout);

  const logoutButton = await findElement(driver, By.xpath("//button[contains(., 'LOGOUT') or contains(., 'Logout') or contains(., 'logout') ]"));
  await logoutButton.click();

  await driver.wait(until.urlContains("/login"), defaultTimeout);
  await findElement(driver, By.css("button[type='submit']"));

  console.log("[Selenium] Logout returned to login page.");
}

function recordResult(name, status, message, durationMs) {
  testResults.push({
    name,
    status,
    message,
    durationMs,
    timestamp: new Date().toISOString(),
  });
}

function writeReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    results: testResults,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`[Selenium] Test report written to ${reportPath}`);
}

async function runTest(name, fn, driver) {
  const start = Date.now();
  try {
    await fn(driver);
    recordResult(name, "passed", "Test passed", Date.now() - start);
  } catch (err) {
    recordResult(name, "failed", err.message || String(err), Date.now() - start);
    throw err;
  }
}

async function runAllTests() {
  try {
    await ensureServerIsRunning(baseUrl);
  } catch (error) {
    console.error(
      "[Selenium] Could not connect to the application server at",
      baseUrl,
      ". Start the app with 'npm run dev' and retry."
    );
    process.exitCode = 1;
    return;
  }

  const options = new chrome.Options();
  options.addArguments("--window-size=1600,1000");

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  try {
    await runTest("Landing page", testLandingPage, driver);
    await runTest("Login page elements", testLoginPageElements, driver);
    await runTest("Login invalid credentials", testLoginInvalidCredentials, driver);
    await runTest("Forgot password flow", testForgotPasswordFlow, driver);
    await runTest("Register page flow", testRegisterPageFlow, driver);
    await runTest("Login with valid credentials", testLoginSuccess, driver);
    await runTest("Profile navigation", testProfileNavigation, driver);
    await runTest("Issue tracker create and search", testIssueTrackerCreateAndSearch, driver);
    await runTest("Logout flow", testLogout, driver);
    console.log("[Selenium] All Selenium checks completed successfully.");
  } catch (error) {
    console.error("[Selenium] Test failed:", error);
    process.exitCode = 1;
  } finally {
    writeReport();
    await driver.quit();
  }
}

runAllTests();
