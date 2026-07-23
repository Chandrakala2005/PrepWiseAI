const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class InterviewPage extends BasePage {
    async configureInterview(difficulty = 'Medium') {
        await helper.waitAndClick(locators.interview.topicSelector);
        if (difficulty === 'Hard') {
            await helper.waitAndClick(locators.interview.difficultyHard);
        } else {
            await helper.waitAndClick(locators.interview.difficultyMedium);
        }
        await helper.waitAndClick(locators.interview.startSessionButton);
    }

    async getCurrentQuestionText() {
        return await helper.getText(locators.interview.questionText);
    }

    async toggleMic() {
        await helper.waitAndClick(locators.interview.micToggleButton);
    }

    async submitTextAnswer(answer) {
        await helper.waitAndSendKeys(locators.interview.textAnswerInput, answer);
        await this.hideKeyboard();
        await helper.waitAndClick(locators.interview.submitAnswerButton);
    }

    async proceedToNextQuestion() {
        await helper.waitAndClick(locators.interview.nextQuestionButton);
    }

    async endInterview() {
        await helper.waitAndClick(locators.interview.endInterviewButton);
    }
}

module.exports = new InterviewPage();
