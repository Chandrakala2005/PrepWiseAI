/**
 * Appium Driver Interaction Helper Utilities
 * Provides swipe, scroll, element waits, keyboard interactions, and screenshot capture.
 */
class DriverHelper {
    /**
     * Wait for an element to be displayed and return it
     */
    async waitForElement(selector, timeout = 10000) {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }

    /**
     * Safely click on an element after waiting for display
     */
    async waitAndClick(selector, timeout = 10000) {
        const element = await this.waitForElement(selector, timeout);
        await element.click();
    }

    /**
     * Clear and send keys to an input element
     */
    async waitAndSendKeys(selector, text, timeout = 10000) {
        const element = await this.waitForElement(selector, timeout);
        await element.clearValue();
        await element.setValue(text);
    }

    /**
     * Extract text from an element
     */
    async getText(selector, timeout = 10000) {
        const element = await this.waitForElement(selector, timeout);
        return await element.getText();
    }

    /**
     * Swipe vertical (down to up / up to down)
     */
    async swipeVertical(direction = 'down', distanceRatio = 0.5) {
        const { width, height } = await driver.getWindowSize();
        const startX = width / 2;
        let startY, endY;

        if (direction === 'down') {
            startY = height * 0.8;
            endY = height * (0.8 - distanceRatio);
        } else {
            startY = height * 0.2;
            endY = height * (0.2 + distanceRatio);
        }

        await driver.action('pointer')
            .move({ duration: 0, x: startX, y: startY })
            .down({ button: 0 })
            .move({ duration: 800, x: startX, y: endY })
            .up({ button: 0 })
            .perform();
    }

    /**
     * Scroll until an element with text is visible
     */
    async scrollToText(text) {
        return await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}"))`);
    }

    /**
     * Hide keyboard if visible
     */
    async hideKeyboardIfShown() {
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
    }
}

module.exports = new DriverHelper();
