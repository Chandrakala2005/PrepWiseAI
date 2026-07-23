const feedbackPage = require('../pageobjects/feedback.page');

describe('PrepWiseAI - AI Feedback & Score Analytics E2E Suite', () => {
    it('TC_FDBK_001: Should display overall score breakdown after interview completion', async () => {
        const score = await feedbackPage.getOverallScore();
        expect(score).toBeDefined();
    });

    it('TC_FDBK_002: Should trigger PDF report download', async () => {
        await feedbackPage.downloadPdfReport();
    });

    it('TC_FDBK_003: Should trigger share results dialog', async () => {
        await feedbackPage.shareResults();
    });
});
