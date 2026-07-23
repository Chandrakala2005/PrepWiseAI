const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class FeedbackPage extends BasePage {
    async getOverallScore() {
        return await helper.getText(locators.feedback.overallScoreText);
    }

    async downloadPdfReport() {
        await helper.waitAndClick(locators.feedback.downloadPdfReportBtn);
    }

    async shareResults() {
        await helper.waitAndClick(locators.feedback.shareResultsBtn);
    }
}

module.exports = new FeedbackPage();
