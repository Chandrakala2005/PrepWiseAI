# PrepWiseAI - Appium E2E Automation Testing Framework

Comprehensive Appium E2E testing framework for the **PrepWiseAI** Android application.

## Directory Structure

- `wdio.conf.js` - WebdriverIO & Appium test configuration
- `helpers/` - Centralized driver helpers & locator registry
- `pageobjects/` - Modular Page Object Models (Auth, Onboarding, Dashboard, Interview, Feedback, Profile)
- `specs/` - End-to-end test scenarios
- `scripts/generate_excel.js` - Generator script producing `PrepWiseAI_Appium_Test_Cases.xlsx` with **300+ test cases**
- `reports/` - Output directory for Excel test case reports and failure screenshots

## Prerequisites

1. **Node.js** (v18+) & **npm**
2. **Android SDK** with `platform-tools` (`adb`) and UIAutomator2
3. **Appium Server** (`npm install -g appium` & `appium driver install uiautomator2`)

## Installation

```bash
cd appium-tests
npm install
```

## How to Generate the Excel Test Suite (300+ Test Cases)

```bash
npm run generate-excel
```
This generates `PrepWiseAI_Appium_Test_Cases.xlsx` inside `appium-tests/reports/`.

## Running Appium Tests

```bash
# Run all test suites
npm test

# Run specific suite
npm run test:auth
npm run test:interview
npm run test:feedback
npm run test:profile
npm run test:edge
```
