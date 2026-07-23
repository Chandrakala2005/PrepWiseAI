const profilePage = require('../pageobjects/profile.page');

describe('PrepWiseAI - Profile & Settings E2E Suite', () => {
    it('TC_PROF_001: Should toggle dark mode theme', async () => {
        await profilePage.navigateToProfile();
        await profilePage.toggleDarkMode();
    });

    it('TC_SETT_001: Should toggle notification preferences', async () => {
        await profilePage.toggleNotifications();
    });

    it('TC_PROF_002: Should logout candidate successfully', async () => {
        await profilePage.logout();
    });
});
