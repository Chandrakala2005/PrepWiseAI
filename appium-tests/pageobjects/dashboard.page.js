const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class DashboardPage extends BasePage {
    async getGreetingText() {
        return await helper.getText(locators.dashboard.greetingBanner);
    }

    async getStreakCount() {
        return await helper.getText(locators.dashboard.streakCounter);
    }

    async clickStartMockInterview() {
        await helper.waitAndClick(locators.dashboard.startMockInterviewCard);
    }

    async clickPracticeCoding() {
        await helper.waitAndClick(locators.dashboard.practiceCodingCard);
    }
}

module.exports = new DashboardPage();
