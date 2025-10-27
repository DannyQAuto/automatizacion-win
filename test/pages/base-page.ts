// pages/base-page.ts
import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Tipo para soportar ambos drivers
type DriverType = Page | any; // 'any' para WebdriverIO Browser

export class BasePage {
readonly page: DriverType;
baseUrl: string;
private configFile: string;
private readonly environment: string;
private static urlLogged = false;
private readonly isMobile: boolean;

constructor(driver: DriverType, configFile: string = 'config.json') {
        this.page = driver;
        this.configFile = configFile;
        this.environment = configFile.includes('experiencia') ? 'experiencia' : 'winforce';
        this.isMobile = this.isAppiumDriver(driver);

        this.baseUrl = this.obtenerUrlGuardada() || this.getDefaultUrl();

        if (!BasePage.urlLogged) {
            this.showInitialDashboard();
            BasePage.urlLogged = true;
        }
    }

    // ►►► DETECTAR TIPO DE DRIVER
    private isAppiumDriver(driver: any): boolean {
        return driver &&
               typeof driver.$ === 'function' &&
               typeof driver.setValue === 'function' &&
               !('goto' in driver); // Playwright tiene goto, Appium no
    }

    // ►►► MÉTODOS COMPATIBLES CON AMBOS DRIVERS

    // Click genérico
    async click(selector: string): Promise<void> {
        if (this.isMobile) {
            // Appium
            const element = await this.page.$(selector);
            await element.click();
        } else {
            // Playwright
            const locator = (this.page as Page).locator(selector);
            await locator.waitFor({ state: 'visible' });
            await locator.click();
        }
    }

    // Set value genérico
    async setValue(selector: string, value: string): Promise<void> {
        if (this.isMobile) {
            // Appium
            const element = await this.page.$(selector);
            await element.setValue(value);
        } else {
            // Playwright
            const locator = (this.page as Page).locator(selector);
            await locator.waitFor({ state: 'visible' });
            await locator.fill(value);
        }
    }

    // Wait for element genérico
    async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
        if (this.isMobile) {
            // Appium
            const element = await this.page.$(selector);
            await element.waitForDisplayed({ timeout });
        } else {
            // Playwright
            const locator = (this.page as Page).locator(selector);
            await locator.waitFor({ state: 'visible', timeout });
        }
    }

    // Get text genérico
    async getText(selector: string): Promise<string> {
        if (this.isMobile) {
            // Appium
            const element = await this.page.$(selector);
            return await element.getText();
        } else {
            // Playwright
            const locator = (this.page as Page).locator(selector);
            await locator.waitFor({ state: 'visible' });
            return await locator.textContent() ?? '';
        }
    }

    // Is visible genérico
    async isVisible(selector: string, timeout: number = 5000): Promise<boolean> {
        try {
            if (this.isMobile) {
                // Appium
                const element = await this.page.$(selector);
                return await element.isDisplayed();
            } else {
                // Playwright
                const locator = (this.page as Page).locator(selector);
                await locator.waitFor({ state: 'visible', timeout });
                return true;
            }
        } catch {
            return false;
        }
    }

    // ►►► MÉTODOS QUE FALTABAN DE TU BASE PAGE ORIGINAL

    // Método para navegar a una URL relativa (solo Playwright)
    async navigateTo(path: string = '', waitForLoad: boolean = true): Promise<void> {
        if (this.isMobile) {
            throw new Error('navigateTo solo disponible para Playwright');
        }

        const fullUrl = path ? `${this.baseUrl}/${path.replace(/^\//, '')}` : this.baseUrl;
        await (this.page as Page).goto(fullUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        if (waitForLoad) {
            await this.waitForPageLoad(30000);
        }
    }

    // Método para navegar al login específicamente
    async navigateToLogin(waitForLoad: boolean = true): Promise<void> {
        await this.navigateTo('login', waitForLoad);
    }

    // Método para navegar a nuevo seguimiento
    async navigateToNuevoSeguimiento(waitForLoad: boolean = true): Promise<void> {
        await this.navigateTo('nuevoSeguimiento', waitForLoad);
    }

    // Método para navegar a ventas
    async navigateToVentas(waitForLoad: boolean = true): Promise<void> {
        await this.navigateTo('ventas', waitForLoad);
    }

    // ►►► MÉTODOS CON LOCATOR (solo Playwright)
    async waitAndClick(locator: Locator): Promise<void> {
        if (this.isMobile) {
            throw new Error('waitAndClick con Locator solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fillField(locator: Locator, text: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('fillField con Locator solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }

    async getElementText(locator: Locator): Promise<string> {
        if (this.isMobile) {
            throw new Error('getElementText con Locator solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        return await locator.textContent() ?? '';
    }

    // ►►► MÉTODOS PARA DROPDOWN (solo Playwright)
    async selectOptionByValue(selectLocator: Locator, value: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('selectOptionByValue solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        await selectLocator.selectOption({ value: value });
    }

    async selectOptionByLabel(selectLocator: Locator, label: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('selectOptionByLabel solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        await selectLocator.selectOption({ label: label });
    }

    async selectOptionByIndex(selectLocator: Locator, index: number): Promise<void> {
        if (this.isMobile) {
            throw new Error('selectOptionByIndex solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        await selectLocator.selectOption({ index: index });
    }

    async selectOption(selectLocator: Locator, option: string | { value?: string, label?: string, index?: number }): Promise<void> {
        if (this.isMobile) {
            throw new Error('selectOption solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });

        if (typeof option === 'string') {
            try {
                await selectLocator.selectOption({ value: option });
            } catch {
                await selectLocator.selectOption({ label: option });
            }
        } else {
            await selectLocator.selectOption(option);
        }
    }

    async getSelectedOptionValue(selectLocator: Locator): Promise<string> {
        if (this.isMobile) {
            throw new Error('getSelectedOptionValue solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        return await selectLocator.inputValue();
    }

    async getSelectedOptionText(selectLocator: Locator): Promise<string> {
        if (this.isMobile) {
            throw new Error('getSelectedOptionText solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        const selectedOption = selectLocator.locator('option:checked');
        return await selectedOption.textContent() ?? '';
    }

    async isOptionSelected(selectLocator: Locator, value: string): Promise<boolean> {
        if (this.isMobile) {
            throw new Error('isOptionSelected solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        const selectedValue = await this.getSelectedOptionValue(selectLocator);
        return selectedValue === value;
    }

    // ►►► MÉTODOS PARA CHECKBOX (solo Playwright)
    async setCheckbox(locator: Locator, checked: boolean): Promise<void> {
        if (this.isMobile) {
            throw new Error('setCheckbox solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        const isChecked = await locator.isChecked();

        if (checked && !isChecked) {
            await locator.check();
        } else if (!checked && isChecked) {
            await locator.uncheck();
        }
    }

    async checkCheckbox(locator: Locator): Promise<void> {
        if (this.isMobile) {
            throw new Error('checkCheckbox solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.check();
    }

    async uncheckCheckbox(locator: Locator): Promise<void> {
        if (this.isMobile) {
            throw new Error('uncheckCheckbox solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.uncheck();
    }

    async isCheckboxChecked(locator: Locator): Promise<boolean> {
        if (this.isMobile) {
            throw new Error('isCheckboxChecked solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        return await locator.isChecked();
    }

    // ►►► MÉTODOS PARA TEXTAREA (solo Playwright)
    async fillTextarea(locator: Locator, text: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('fillTextarea solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }

    // ►►► MÉTODOS PARA OBTENER OPCIONES DE SELECT (solo Playwright)
    async getSelectOptions(selectLocator: Locator): Promise<Array<{value: string, text: string}>> {
        if (this.isMobile) {
            throw new Error('getSelectOptions solo disponible para Playwright');
        }
        await selectLocator.waitFor({ state: 'visible' });
        const options = await selectLocator.locator('option').all();

        const optionsData = [];
        for (const option of options) {
            const value = await option.getAttribute('value');
            const text = await option.textContent();
            optionsData.push({ value: value ?? '', text: text ?? '' });
        }

        return optionsData;
    }

    // ►►► MÉTODOS DE ESPERA (solo Playwright)
    async waitForElementVisible(locator: Locator, timeout: number = 10000): Promise<void> {
        if (this.isMobile) {
            throw new Error('waitForElementVisible solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForElementHidden(locator: Locator, timeout: number = 10000): Promise<void> {
        if (this.isMobile) {
            throw new Error('waitForElementHidden solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'hidden', timeout });
    }

    async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
        if (this.isMobile) {
            throw new Error('isElementVisible con Locator solo disponible para Playwright');
        }
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async isElementExists(locator: Locator, timeout: number = 5000): Promise<boolean> {
        if (this.isMobile) {
            throw new Error('isElementExists con Locator solo disponible para Playwright');
        }
        try {
            await locator.waitFor({ state: 'attached', timeout });
            return true;
        } catch {
            return false;
        }
    }

    // ►►► MÉTODOS PARA ATRIBUTOS (solo Playwright)
    async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
        if (this.isMobile) {
            throw new Error('getAttribute con Locator solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        return await locator.getAttribute(attribute);
    }

    // ►►► MÉTODOS DE INTERACCIÓN (solo Playwright)
    async hover(locator: Locator): Promise<void> {
        if (this.isMobile) {
            throw new Error('hover solo disponible para Playwright');
        }
        await locator.waitFor({ state: 'visible' });
        await locator.hover();
    }

    async pressKey(key: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('pressKey solo disponible para Playwright');
        }
        await (this.page as Page).keyboard.press(key);
    }

    async typeText(text: string): Promise<void> {
        if (this.isMobile) {
            throw new Error('typeText solo disponible para Playwright');
        }
        await (this.page as Page).keyboard.type(text);
    }

    // ►►► MÉTODOS DE NAVEGACIÓN (solo Playwright)
    async clearBrowserData(): Promise<void> {
        if (this.isMobile) {
            throw new Error('clearBrowserData solo disponible para Playwright');
        }
        await (this.page as Page).context().clearCookies();
        await (this.page as Page).evaluate(() => {
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (error) {
                console.log('⚠️ No se pudo limpiar storage');
            }
        });
    }

    async reloadPage(): Promise<void> {
        if (this.isMobile) {
            throw new Error('reloadPage solo disponible para Playwright');
        }
        await (this.page as Page).reload();
    }

    async goBack(): Promise<void> {
        if (this.isMobile) {
            throw new Error('goBack solo disponible para Playwright');
        }
        await (this.page as Page).goBack();
    }

    async goForward(): Promise<void> {
        if (this.isMobile) {
            throw new Error('goForward solo disponible para Playwright');
        }
        await (this.page as Page).goForward();
    }

    async getCurrentUrl(): Promise<string> {
        if (this.isMobile) {
            throw new Error('getCurrentUrl solo disponible para Playwright');
        }
        return (this.page as Page).url();
    }

    async getPageTitle(): Promise<string> {
        if (this.isMobile) {
            throw new Error('getPageTitle solo disponible para Playwright');
        }
        return await (this.page as Page).title();
    }

    // ►►► MÉTODOS EXCLUSIVOS DE APPIUM
    async mobileSwipe(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        if (!this.isMobile) {
            throw new Error('mobileSwipe solo disponible para Appium');
        }

        await this.page.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    async pressMobileKey(keyCode: number): Promise<void> {
        if (!this.isMobile) {
            throw new Error('pressMobileKey solo disponible para Appium');
        }
        await this.page.pressKeyCode(keyCode);
    }

    async hideKeyboard(): Promise<void> {
        if (!this.isMobile) {
            throw new Error('hideKeyboard solo disponible para Appium');
        }
        await this.page.hideKeyboard();
    }

    async getDeviceSize(): Promise<{ width: number; height: number }> {
        if (!this.isMobile) {
            throw new Error('getDeviceSize solo disponible para Appium');
        }
        return await this.page.getWindowSize();
    }

    // ►►► MÉTODOS DE CONFIGURACIÓN (comunes a ambos)
    private getDefaultUrl(): string {
        if (this.environment === 'experiencia') {
            return 'http://10.23.100.24/proy_JC/Win.CRM_EXPERIENCIA/pages';
        } else {
            return 'http://10.23.100.19:183/proy_JC';
        }
    }

    private showInitialDashboard(): void {
        const platform = this.isMobile ? '📱 MOBILE' : '🌐 WEB';
        console.log('\n' + '═'.repeat(80));
        console.log(`           🚀 AUTOMATIZACION ${platform}`);
        console.log('═'.repeat(80));
        console.log('  TEST: Flujo completo con múltiples ventas');
        console.log(`  ⏰ TIME: ${new Date().toLocaleTimeString()} | 📅 DATE: ${new Date().toLocaleDateString()}`);
        console.log('═'.repeat(80));
        console.log(`🎯 Ambiente: ${this.environment.toUpperCase()} && CRMEXPERIENCIA`);
        console.log(`✅ URL base configurada: ${this.baseUrl}`);
        console.log(`🔧 Plataforma: ${this.isMobile ? 'Appium (Mobile)' : 'Playwright (Web)'}`);
        console.log('═'.repeat(80));
    }

    private obtenerUrlGuardada(): string | null {
        try {
            const configPath = path.join(__dirname, this.configFile);
            if (fs.existsSync(configPath)) {
                const configData = fs.readFileSync(configPath, 'utf8');
                const config = JSON.parse(configData);
                const url = config.lastBaseUrl || null;
                if (url) {
                    console.log(`📖 URL recuperada de ${this.configFile}: ${url}`);
                }
                return url;
            }
        } catch (error: any) {
            console.log('⚠️ Error leyendo configuración:', error.message);
        }
        return null;
    }

    private guardarUrlEnConfig(nuevaUrl: string): void {
        try {
            const configPath = path.join(__dirname, this.configFile);
            const configData = {
                lastBaseUrl: nuevaUrl,
                updatedAt: new Date().toISOString(),
                environment: this.environment,
                platform: this.isMobile ? 'mobile' : 'web'
            };
            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
            console.log(`💾 URL guardada en ${this.configFile}`);
        } catch (error: any) {
            console.log('⚠️ Error guardando configuración:', error.message);
        }
    }

    private debeGuardarUrl(url: string): boolean {
        const esUrlWinforce = url.includes('10.23.100.19') || url.includes('proy_JC');
        const esUrlExperiencia = url.includes('10.23.100.24') || url.includes('EXPERIENCIA');

        if (this.environment === 'winforce' && esUrlWinforce) {
            return true;
        }
        if (this.environment === 'experiencia' && esUrlExperiencia) {
            return true;
        }
        return false;
    }

    setBaseUrl(newUrl: string): void {
        const urlLimpia = newUrl.replace(/\/\w+$/, '');
        this.baseUrl = urlLimpia;

        if (this.debeGuardarUrl(urlLimpia)) {
            this.guardarUrlEnConfig(urlLimpia);
            console.log(`✅ URL ${this.environment} actualizada a: ${urlLimpia}`);
        }
    }

    setAlternativeUrl(): void {
        const alternativeUrl = 'http://10.23.100.24/proy_RM/Win.CRM_EXPERIENCIA/pages';
        this.baseUrl = alternativeUrl;

        if (this.environment === 'experiencia') {
            this.guardarUrlEnConfig(alternativeUrl);
            console.log(`🔄 URL base cambiada a ruta alternativa: ${alternativeUrl}`);
        } else {
            console.log(`🚫 BLOQUEO: No se puede cambiar a URL alternativa desde ambiente ${this.environment}`);
        }
    }

    async navigateToAlternativeLogin(waitForLoad: boolean = true): Promise<void> {
        if (this.isMobile) {
            throw new Error('navigateToAlternativeLogin solo disponible para Playwright');
        }

        if (this.environment !== 'experiencia') {
            console.log(`🚫 BLOQUEO: navigateToAlternativeLogin solo disponible para ambiente experiencia`);
            return;
        }

        const alternativeLoginUrl = 'http://10.23.100.24/proy_RM/Win.CRM_EXPERIENCIA/pages/login_form.php';
        await (this.page as Page).goto(alternativeLoginUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        if (waitForLoad) {
            await this.waitForPageLoad(30000);
        }
        console.log(`🧭 Navegado a ruta alternativa de login: ${alternativeLoginUrl}`);
    }

    resetToDefaultUrl(): void {
        const defaultUrl = this.getDefaultUrl();
        this.baseUrl = defaultUrl;
        this.guardarUrlEnConfig(defaultUrl);
        console.log(`🔄 URL base restablecida a valor por defecto: ${defaultUrl}`);
    }

    getCurrentEnvironment(): string {
        return this.environment;
    }

    getCurrentConfigFile(): string {
        return this.configFile;
    }

    setConfigFile(newConfigFile: string): void {
        const oldEnvironment = this.environment;
        this.configFile = newConfigFile;

        const nuevaUrl = this.obtenerUrlGuardada() || this.getDefaultUrl();
        this.baseUrl = nuevaUrl;

        console.log(`📁 Archivo de configuración cambiado: ${oldEnvironment} → ${this.environment}`);
        console.log(`✅ URL base actual: ${this.baseUrl}`);
    }

    isUrlCompatible(url: string): boolean {
        return this.debeGuardarUrl(url);
    }

    // ►►► MÉTODOS ADICIONALES COMPATIBLES
    async takeScreenshot(name: string): Promise<void> {
        if (this.isMobile) {
            await this.page.saveScreenshot(`./screenshots/mobile-${name}.png`);
        } else {
            await (this.page as Page).screenshot({ path: `./screenshots/web-${name}.png` });
        }
    }

    async waitForPageLoad(timeout: number = 30000): Promise<void> {
        if (!this.isMobile) {
            await (this.page as Page).waitForLoadState('networkidle', { timeout });
        }
        // Para Appium, no hay equivalente directo
    }

    // Método para obtener información de la plataforma
    getPlatformInfo(): { isMobile: boolean; platform: string; environment: string } {
        return {
            isMobile: this.isMobile,
            platform: this.isMobile ? 'appium' : 'playwright',
            environment: this.environment
        };
    }
}