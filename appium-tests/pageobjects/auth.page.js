const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class AuthPage extends BasePage {
    async login(email, password) {
        await helper.waitAndSendKeys(locators.auth.emailInput, email);
        await helper.waitAndSendKeys(locators.auth.passwordInput, password);
        await this.hideKeyboard();
        await helper.waitAndClick(locators.auth.loginButton);
    }

    async signup(email, password) {
        await helper.waitAndSendKeys(locators.auth.emailInput, email);
        await helper.waitAndSendKeys(locators.auth.passwordInput, password);
        await this.hideKeyboard();
        await helper.waitAndClick(locators.auth.signupButton);
    }

    async loginWithGoogle() {
        await helper.waitAndClick(locators.auth.googleAuthButton);
    }

    async enterOtp(otp) {
        await helper.waitAndSendKeys(locators.auth.otpInput, otp);
        await helper.waitAndClick(locators.auth.verifyOtpButton);
    }

    async getErrorMessage() {
        return await helper.getText(locators.auth.errorMessageText);
    }
}

module.exports = new AuthPage();
