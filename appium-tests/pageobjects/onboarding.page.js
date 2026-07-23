const BasePage = require('./base.page');
const helper = require('../helpers/driver');
const locators = require('../helpers/locators');

class OnboardingPage extends BasePage {
    async selectTargetRole() {
        await helper.waitAndClick(locators.onboarding.roleDropdown);
        await helper.waitAndClick(locators.onboarding.roleOptionSoftwareEngineer);
    }

    async selectSkills() {
        await helper.waitAndClick(locators.onboarding.skillChipJava);
        await helper.waitAndClick(locators.onboarding.skillChipSystemDesign);
    }

    async enterTargetCompany(companyName) {
        await helper.waitAndSendKeys(locators.onboarding.targetCompanyInput, companyName);
        await this.hideKeyboard();
    }

    async finishOnboarding() {
        await helper.waitAndClick(locators.onboarding.completeOnboardingButton);
    }
}

module.exports = new OnboardingPage();
