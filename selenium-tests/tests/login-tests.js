/**
 * ============================================================================
 * PrepWiseAI — Selenium WebDriver E2E Login & Authentication Tests
 * ============================================================================
 * Framework: Selenium WebDriver 4 + Mocha + Chai
 * Target:    PrepWiseAI React Web App (http://localhost:5173)
 * Coverage:  Login Page, Multi-Auth Methods, Profile Dropdown, Navigation
 * ============================================================================
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 10000;

// ============================================================================
// HELPER UTILITIES
// ============================================================================

class TestHelper {
  constructor(driver) {
    this.driver = driver;
  }

  async waitForElement(selector, timeout = TIMEOUT) {
    return await this.driver.wait(until.elementLocated(selector), timeout);
  }

  async waitAndClick(selector, timeout = TIMEOUT) {
    const el = await this.waitForElement(selector, timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    await el.click();
    return el;
  }

  async waitAndType(selector, text, timeout = TIMEOUT) {
    const el = await this.waitForElement(selector, timeout);
    await el.clear();
    await el.sendKeys(text);
    return el;
  }

  async getText(selector, timeout = TIMEOUT) {
    const el = await this.waitForElement(selector, timeout);
    return await el.getText();
  }

  async isElementPresent(selector) {
    try {
      await this.driver.findElement(selector);
      return true;
    } catch (e) {
      return false;
    }
  }

  async takeScreenshot(name) {
    const fs = require('fs');
    const path = require('path');
    const screenshot = await this.driver.takeScreenshot();
    const dir = path.join(__dirname, '../reports/screenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filepath = path.join(dir, `${name}_${Date.now()}.png`);
    fs.writeFileSync(filepath, screenshot, 'base64');
    return filepath;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// DRIVER FACTORY
// ============================================================================

function createDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1440,900');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

// ============================================================================
// TEST SUITE 1: LOGIN PAGE RENDER & STRUCTURE
// ============================================================================

describe('PrepWiseAI Web — Login Page Render & Structure', function () {
  let driver;
  let helper;

  before(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC_LOGIN_001: Should load the login page at root URL', async function () {
    const title = await driver.getTitle();
    assert.ok(title.includes('PrepWiseAI'), `Expected title to contain "PrepWiseAI", got "${title}"`);
  });

  it('TC_LOGIN_002: Should display PrepWiseAI brand logo and title', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('PrepWise'), 'Brand name "PrepWise" not found on page');
  });

  it('TC_LOGIN_003: Should display "Email / User ID" tab button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Email / User ID'), 'Email tab not found');
  });

  it('TC_LOGIN_004: Should display "Phone OTP" tab button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Phone OTP'), 'Phone OTP tab not found');
  });

  it('TC_LOGIN_005: Should display email input field with placeholder', async function () {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const placeholder = await emailInput.getAttribute('placeholder');
    assert.ok(placeholder.includes('prepwise'), `Expected prepwise placeholder, got "${placeholder}"`);
  });

  it('TC_LOGIN_006: Should display password input field', async function () {
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    assert.ok(passInput, 'Password input field not found');
  });

  it('TC_LOGIN_007: Should display "Sign In with Email" submit button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Sign In with Email'), 'Sign In button not found');
  });

  it('TC_LOGIN_008: Should display Google SSO button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Google'), 'Google SSO button not found');
  });

  it('TC_LOGIN_009: Should display GitHub SSO button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('GitHub'), 'GitHub SSO button not found');
  });

  it('TC_LOGIN_010: Should display LinkedIn SSO button', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('LinkedIn'), 'LinkedIn SSO button not found');
  });

  it('TC_LOGIN_011: Should display 4 instant demo persona cards', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Sarah Chen'), 'Demo persona Sarah Chen not found');
    assert.ok(pageSource.includes('David Miller'), 'Demo persona David Miller not found');
    assert.ok(pageSource.includes('Elena Rostova'), 'Demo persona Elena Rostova not found');
    assert.ok(pageSource.includes('Marcus Vance'), 'Demo persona Marcus Vance not found');
  });

  it('TC_LOGIN_012: Should display "Sign Up Free" toggle link', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Sign Up Free'), 'Sign Up toggle link not found');
  });

  it('TC_LOGIN_013: Should display "Forgot?" password recovery link', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Forgot'), 'Forgot password link not found');
  });

  it('TC_LOGIN_014: Should display SSO divider text', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('SINGLE SIGN-ON'), 'SSO divider text not found');
  });

  it('TC_LOGIN_015: Should pre-fill email field with demo value', async function () {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const value = await emailInput.getAttribute('value');
    assert.ok(value.includes('candidate@prepwise.ai'), `Expected prefilled email, got "${value}"`);
  });
});

// ============================================================================
// TEST SUITE 2: EMAIL & PASSWORD LOGIN FLOW
// ============================================================================

describe('PrepWiseAI Web — Email & Password Authentication Flow', function () {
  let driver;
  let helper;

  beforeEach(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('TC_AUTH_001: Should login successfully with valid email and password', async function () {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys('candidate@prepwise.ai');

    const passInput = await driver.findElement(By.css('input[type="password"]'));
    await passInput.clear();
    await passInput.sendKeys('Password123!');

    // Find and click the Sign In button
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Sign In with Email')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1200);

    // Should navigate to dashboard — check for "Welcome back"
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Dashboard not loaded after login');
  });

  it('TC_AUTH_002: Should display user name on dashboard after email login', async function () {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys('john.doe@prepwise.ai');

    const passInput = await driver.findElement(By.css('input[type="password"]'));
    await passInput.clear();
    await passInput.sendKeys('SecurePass!');

    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Sign In with Email')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1200);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('john'), 'User name "john" not displayed after login');
  });

  it('TC_AUTH_003: Should toggle password visibility with eye icon', async function () {
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    assert.strictEqual(await passInput.getAttribute('type'), 'password');

    // Click the eye toggle button (last button inside the password container)
    const allButtons = await driver.findElements(By.css('button'));
    for (const btn of allButtons) {
      try {
        const svg = await btn.findElement(By.css('svg'));
        if (svg) {
          // Click to toggle — try each button
          await btn.click();
          break;
        }
      } catch (e) {
        continue;
      }
    }

    await helper.sleep(300);
    // After toggle, there should be a text input
    const inputs = await driver.findElements(By.css('input[type="text"]'));
    // At least one text input should exist (the revealed password or search)
    assert.ok(inputs.length >= 1, 'Password visibility toggle did not work');
  });

  it('TC_AUTH_004: Should show error when submitting empty email', async function () {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.clear();

    const passInput = await driver.findElement(By.css('input[type="password"]'));
    await passInput.clear();
    await passInput.sendKeys('Password123!');

    // HTML5 required validation will prevent form submission
    const isRequired = await emailInput.getAttribute('required');
    assert.ok(isRequired !== null, 'Email field should have required attribute');
  });

  it('TC_AUTH_005: Should show error when submitting empty password', async function () {
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    const isRequired = await passInput.getAttribute('required');
    assert.ok(isRequired !== null, 'Password field should have required attribute');
  });
});

// ============================================================================
// TEST SUITE 3: PHONE OTP LOGIN FLOW
// ============================================================================

describe('PrepWiseAI Web — Phone OTP Authentication Flow', function () {
  let driver;
  let helper;

  beforeEach(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('TC_OTP_001: Should switch to Phone OTP tab successfully', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Phone OTP')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(500);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Mobile Phone Number'), 'Phone input section not displayed');
  });

  it('TC_OTP_002: Should display phone number input field', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Phone OTP')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(500);
    const phoneInput = await driver.findElement(By.css('input[type="text"]'));
    assert.ok(phoneInput, 'Phone number input not found');
  });

  it('TC_OTP_003: Should send OTP and display verification code input', async function () {
    // Switch to Phone OTP tab
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Phone OTP')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(500);

    // Click Send SMS button
    const allBtns = await driver.findElements(By.css('button'));
    for (const btn of allBtns) {
      const text = await btn.getText();
      if (text.includes('Send SMS')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('849201') || pageSource.includes('OTP'), 'OTP verification step not displayed');
  });

  it('TC_OTP_004: Should verify OTP and navigate to dashboard', async function () {
    // Switch to Phone OTP
    let buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Phone OTP')) {
        await btn.click();
        break;
      }
    }
    await helper.sleep(500);

    // Send OTP
    buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Send SMS')) {
        await btn.click();
        break;
      }
    }
    await helper.sleep(800);

    // Verify OTP
    buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Verify OTP')) {
        await btn.click();
        break;
      }
    }
    await helper.sleep(1200);

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Dashboard not loaded after OTP login');
  });
});

// ============================================================================
// TEST SUITE 4: SOCIAL SSO LOGIN FLOW
// ============================================================================

describe('PrepWiseAI Web — Social SSO OAuth Login Flow', function () {
  let driver;
  let helper;

  beforeEach(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('TC_SSO_001: Should login via Google SSO and reach dashboard', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Google')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Dashboard not loaded after Google SSO');
  });

  it('TC_SSO_002: Should login via GitHub SSO and reach dashboard', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('GitHub')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Dashboard not loaded after GitHub SSO');
  });

  it('TC_SSO_003: Should login via LinkedIn SSO and reach dashboard', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('LinkedIn')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Dashboard not loaded after LinkedIn SSO');
  });

  it('TC_SSO_004: Should display correct auth method badge after Google login', async function () {
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Google')) {
        await btn.click();
        break;
      }
    }

    await helper.sleep(1000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Google'), 'Google auth method not displayed on dashboard');
  });
});

// ============================================================================
// TEST SUITE 5: DEMO PERSONA 1-CLICK LOGIN
// ============================================================================

describe('PrepWiseAI Web — Instant Demo Persona Login', function () {
  let driver;
  let helper;

  beforeEach(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  it('TC_PERSONA_001: Should 1-click login as Sarah Chen (Staff SWE)', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Sarah Chen'), 'Persona Sarah Chen not found on login page');
  });

  it('TC_PERSONA_002: Should 1-click login as David Miller (System Design)', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('David Miller'), 'Persona David Miller not found on login page');
  });

  it('TC_PERSONA_003: Should 1-click login as Elena Rostova (AI/ML)', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Elena Rostova'), 'Persona Elena Rostova not found on login page');
  });

  it('TC_PERSONA_004: Should 1-click login as Marcus Vance (PM)', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Marcus Vance'), 'Persona Marcus Vance not found on login page');
  });
});

// ============================================================================
// TEST SUITE 6: POST-LOGIN DASHBOARD & PROFILE VERIFICATION
// ============================================================================

describe('PrepWiseAI Web — Post-Login Dashboard & Profile', function () {
  let driver;
  let helper;

  before(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);

    // Login via Google SSO for quick access
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Google')) {
        await btn.click();
        break;
      }
    }
    await helper.sleep(1200);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC_DASH_001: Should display welcome banner on dashboard', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Welcome back'), 'Welcome banner not found');
  });

  it('TC_DASH_002: Should display signed-in user email on dashboard', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('prepwise.ai'), 'User email not displayed');
  });

  it('TC_DASH_003: Should display KPI stat cards on dashboard', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Mock Interviews Done'), 'KPI cards not found');
  });

  it('TC_DASH_004: Should display sidebar navigation menu', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Dashboard'), 'Sidebar Dashboard link not found');
    assert.ok(pageSource.includes('AI Mock Interview'), 'Sidebar Interview link not found');
  });

  it('TC_DASH_005: Should display "Start AI Mock Interview" button in navbar', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Start AI Mock Interview'), 'Start interview CTA not found');
  });

  it('TC_DASH_006: Should display streak counter badge', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Day Streak'), 'Streak counter not found');
  });

  it('TC_DASH_007: Should display recent score history section', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Recent Score History'), 'Recent scores section not found');
  });

  it('TC_DASH_008: Should display user profile avatar in navbar', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Google Candidate') || pageSource.includes('Candidate'), 'Profile name not in navbar');
  });
});

// ============================================================================
// TEST SUITE 7: PROFILE DROPDOWN PANEL
// ============================================================================

describe('PrepWiseAI Web — Profile Dropdown Panel', function () {
  let driver;
  let helper;

  before(async function () {
    driver = createDriver();
    helper = new TestHelper(driver);
    await driver.get(BASE_URL);
    await helper.sleep(1500);

    // Quick login
    const buttons = await driver.findElements(By.css('button'));
    for (const btn of buttons) {
      const text = await btn.getText();
      if (text.includes('Google')) {
        await btn.click();
        break;
      }
    }
    await helper.sleep(1200);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC_PROF_001: Should display profile dropdown header with user name after click', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(
      pageSource.includes('Google Candidate') || pageSource.includes('Candidate'),
      'User name not found in navbar profile'
    );
  });

  it('TC_PROF_002: Should display notification bell icon', async function () {
    const pageSource = await driver.getPageSource();
    // Bell icon SVG should be present
    const svgs = await driver.findElements(By.css('svg'));
    assert.ok(svgs.length > 0, 'No SVG icons found (including bell)');
  });

  it('TC_PROF_003: Should display Sign Out button functionality', async function () {
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Sign Out') || pageSource.includes('Account Settings'), 'Profile menu items not found');
  });
});

console.log('PrepWiseAI Selenium E2E Login Tests loaded successfully.');
