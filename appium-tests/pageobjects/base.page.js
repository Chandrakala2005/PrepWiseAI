const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

module.exports = class BasePage {
    async navigateToHome() {
        await helper.waitAndClick(locators.dashboard.navHome);
    }

    async navigateToInterviews() {
        await helper.waitAndClick(locators.dashboard.navInterviews);
    }

    async navigateToAnalytics() {
        await helper.waitAndClick(locators.dashboard.navAnalytics);
    }

    async navigateToProfile() {
        await helper.waitAndClick(locators.dashboard.navProfile);
    }

    async hideKeyboard() {
        await helper.hideKeyboardIfShown();
    }
};
