// tests/base-test.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { WinforcePage } from '../pages/winforce';
import { DatabaseUtils } from '../utils/database-utils';
import { AppiumDriver } from '../utils/appium-driver'; // Nuevo
import { AppLoginPage } from '../pagesapp/app-login-page'; // Nuevo
import { SolicitudesPage } from '../pagesapp/app-solicitudes-page'; // Nuevo

export const test = base.extend<{
// Fixtures existentes de Playwright
loginPage: LoginPage;
winforcePage: WinforcePage;
dbUtils: DatabaseUtils;

// Nuevos fixtures para Appium
appiumDriver: AppiumDriver;
appLoginPage: AppLoginPage;
appSolicitudesPage: SolicitudesPage;
isMobileTest: boolean;
}>({
// Fixtures existentes (mantener igual)
loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);

        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.evaluate(() => sessionStorage.clear());
    },

    winforcePage: async ({ page }, use) => {
        const winforcePage = new WinforcePage(page);
        await use(winforcePage);
    },

    dbUtils: async ({}, use) => {
        await use(DatabaseUtils);
    },

    // NUEVOS FIXTURES PARA APPIUM
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

    isMobileTest: [false, { option: true }]
});

export { expect } from '@playwright/test';