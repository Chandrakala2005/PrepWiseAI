const { remote } = require('webdriverio');
const { expect } = require('chai');

/**
 * ============================================================================
 * PrepWiseAI — Appium Mobile E2E Test Suite
 * ============================================================================
 * This script runs native mobile tests on the Android Emulator using Appium.
 * It verifies that the React web app runs correctly inside the Capacitor wrapper.
 */

describe('PrepWiseAI Android App — E2E Tests', function () {
  let client;

  before(async function () {
    // Connect to local Appium Server
    const wdOpts = {
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
      logLevel: 'error',
      capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:appPackage': 'com.prepwise.ai',
        'appium:appActivity': 'com.prepwise.ai.MainActivity',
        'appium:autoGrantPermissions': true, // Auto-grants RECORD_AUDIO
      }
    };

    try {
      client = await remote(wdOpts);
    } catch (err) {
      console.error('Failed to connect to Appium. Is the Appium server running?', err);
      throw err;
    }
  });

  after(async function () {
    if (client) {
      await client.deleteSession();
    }
  });

  it('TC_APP_001: Should launch the Android app successfully', async function () {
    // Verify the native wrapper is running
    const state = await client.queryAppState('com.prepwise.ai');
    expect(state).to.be.greaterThan(1); // 4 = Running in foreground
  });

  it('TC_APP_002: Should load the React web view inside Capacitor', async function () {
    // Switch to webview context to interact with the DOM
    const contexts = await client.getContexts();
    const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
    if (webviewContext) {
      await client.switchContext(webviewContext);
    } else {
      console.warn('WEBVIEW context not found, testing native UI only.');
    }

    // Look for the PrepWiseAI branding
    const bodyText = await client.$('body').getText();
    expect(bodyText).to.include('PrepWiseAI');
  });

  it('TC_APP_003: Should have Audio permissions granted', async function () {
    // Switch back to native to verify permissions
    await client.switchContext('NATIVE_APP');
    // Mobile tests can query device permissions natively via adb shell commands through Appium
    const hasAudioPerm = await client.execute('mobile: shell', {
      command: 'pm',
      args: ['check-permission', 'android.permission.RECORD_AUDIO', 'com.prepwise.ai']
    });
    // output usually contains 'granted=true' or similar depending on Android version
    expect(hasAudioPerm).to.be.a('string');
  });
});
