const dashboardPage = require('../pageobjects/dashboard.page');
const interviewPage = require('../pageobjects/interview.page');

describe('PrepWiseAI - AI Mock Interview Session E2E Suite', () => {
    it('TC_INTV_001: Should launch AI Mock Interview setup from dashboard', async () => {
        await dashboardPage.clickStartMockInterview();
        await interviewPage.configureInterview('Medium');
    });

    it('TC_INTV_002: Should present AI technical question and accept answer input', async () => {
        const questionText = await interviewPage.getCurrentQuestionText();
        expect(questionText.length).toBeGreaterThan(0);

        await interviewPage.submitTextAnswer('A binary search tree is a node-based binary tree data structure.');
        await interviewPage.proceedToNextQuestion();
    });

    it('TC_INTV_003: Should toggle microphone during live speech response', async () => {
        await interviewPage.toggleMic();
        await interviewPage.endInterview();
    });
});
