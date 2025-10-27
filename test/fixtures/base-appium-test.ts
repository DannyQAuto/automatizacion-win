// test/fixtures/base-appium-test.ts
import { test as base } from '@playwright/test';
import { AppiumDriver } from '../utils/appium-driver';
import { AppLoginPage } from '../pagesapp/app-login-page';
import { SolicitudesPage } from '../pagesapp/app-solicitudes-page';

export const appiumTest = base.extend<{
appiumDriver: AppiumDriver;
appLoginPage: AppLoginPage;
appSolicitudesPage: SolicitudesPage;
}>({
appiumDriver: async ({}, use) => {
    const appiumDriver = new AppiumDriver();
    await appiumDriver.initialize();

    await use(appiumDriver);

    // Cleanup después del test
    await appiumDriver.cleanup();
  },

  appLoginPage: async ({ appiumDriver }, use) => {
    const appLoginPage = new AppLoginPage(appiumDriver);
    await use(appLoginPage);
  },

  appSolicitudesPage: async ({ appiumDriver }, use) => {
    const appSolicitudesPage = new SolicitudesPage(appiumDriver);
    await use(appSolicitudesPage);
  },
});

export { expect } from '@playwright/test';