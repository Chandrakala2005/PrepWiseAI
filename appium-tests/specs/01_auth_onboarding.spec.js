const authPage = require('../pageobjects/auth.page');
const onboardingPage = require('../pageobjects/onboarding.page');
const dashboardPage = require('../pageobjects/dashboard.page');

describe('PrepWiseAI - Authentication & Onboarding E2E Suite', () => {
    it('TC_AUTH_001: Should show validation error on invalid credentials', async () => {
        await authPage.login('invalid_user@test.com', 'wrongpass');
        const errorMsg = await authPage.getErrorMessage();
        expect(errorMsg).toContain('Invalid email or password');
    });

    it('TC_AUTH_002: Should successfully log in registered user', async () => {
        await authPage.login('candidate@prepwise.ai', 'Password123!');
        const greeting = await dashboardPage.getGreetingText();
        expect(greeting).toBeDefined();
    });

    it('TC_ONBD_001: Should complete new candidate onboarding workflow', async () => {
        await onboardingPage.selectTargetRole();
        await onboardingPage.selectSkills();
        await onboardingPage.enterTargetCompany('Google');
        await onboardingPage.finishOnboarding();
        const streak = await dashboardPage.getStreakCount();
        expect(streak).toBeDefined();
    });
});
