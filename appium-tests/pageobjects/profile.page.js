const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class ProfilePage extends BasePage {
    async toggleDarkMode() {
        await helper.waitAndClick(locators.profile.darkModeSwitch);
    }

    async toggleNotifications() {
        await helper.waitAndClick(locators.profile.notificationsSwitch);
    }

    async logout() {
        await helper.waitAndClick(locators.profile.logoutButton);
    }
}

module.exports = new ProfilePage();
