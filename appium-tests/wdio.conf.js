const path = require('path');

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    port: 4723,
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './specs/**/*.spec.js'
    ],
    exclude: [],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': path.join(__dirname, '../app/build/outputs/apk/debug/app-debug.apk'),
        'appium:appPackage': 'com.prepwise.ai',
        'appium:appActivity': '.MainActivity',
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: '',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // =====
    // Hooks
    // =====
    before: async function (capabilities, specs) {
        console.log('--- Starting PrepWiseAI Appium E2E Test Suite ---');
    },

    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const screenshotPath = path.join(__dirname, `./reports/screenshots/failure_${timestamp}.png`);
            await driver.saveScreenshot(screenshotPath);
            console.log(`[FAILURE] Screenshot captured: ${screenshotPath}`);
        }
    }
};
