// utils/appium-driver.ts
import { remote, RemoteOptions } from 'webdriverio';
import * as path from 'path';
import * as fs from 'fs';

export class AppiumDriver {
public driver!: WebdriverIO.Browser;
private readonly appiumUrl: string = 'http://127.0.0.1:4723';

async initialize(): Promise<void> {
        try {
            const driverOptions = this.getDriverOptions();

            console.log('🚀 Inicializando Appium Driver...');
            console.log(`📍 Conectando a: ${this.appiumUrl}`);

            this.driver = await remote(driverOptions);

            console.log('✅ Appium Driver inicializado exitosamente');
            console.log(`📱 Sesión ID: ${this.driver.sessionId}`);

        } catch (error: any) {
            console.error('❌ Error al inicializar Appium Driver:', error.message);
            throw error;
        }
    }

    async cleanup(): Promise<void> {
        if (this.driver) {
            try {
                console.log('🔄 Cerrando sesión de Appium...');
                await this.driver.deleteSession();
                console.log('✅ Sesión de Appium cerrada exitosamente');
            } catch (error: any) {
                console.error('❌ Error al cerrar sesión:', error.message);
            }
        }
    }

    private getDriverOptions(): RemoteOptions {
        const fileAPK = path.join(process.cwd(), 'apps/win.apk');

        // Verificar que el APK existe
        if (!fs.existsSync(fileAPK)) {
            throw new Error(`❌ APK no encontrado en: ${fileAPK}`);
        }

        console.log(`📦 APK encontrado: ${fileAPK}`);

        return {
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': process.env.APPIUM_DEVICE || 'emulator-5554',
                'appium:platformVersion': process.env.APPIUM_PLATFORM_VERSION || '13.0',
                'appium:automationName': 'UiAutomator2',
                'appium:app': fileAPK,
                'appium:appPackage': 'com.win.miwin_app',
                'appium:appActivity': 'com.win.miwin_app.MainActivity',
                'appium:autoGrantPermissions': true,
                'appium:appWaitActivity': 'com.win.miwin_app.MainActivity',
                'appium:noReset': false,
                'appium:fullReset': false,
                'appium:newCommandTimeout': 300,
                'appium:unicodeKeyboard': true,
                'appium:resetKeyboard': true,
                'appium:autoAcceptAlerts': true
            },
            protocol: 'http',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/wd/hub',
            logLevel: 'info' as const,
            connectionRetryCount: 3,
            connectionRetryTimeout: 120000,
            waitforTimeout: 10000,
            commandTimeout: 60000
        };
    }

    // ►►► MÉTODOS HELPER PARA APPIUM

    async waitForElement(selector: string, timeout: number = 10000): Promise<WebdriverIO.Element> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }

    async click(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.click();
    }

    async setValue(selector: string, value: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.setValue(value);
    }

    async getText(selector: string): Promise<string> {
        const element = await this.waitForElement(selector);
        return await element.getText();
    }

    async isDisplayed(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    async isEnabled(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isEnabled();
        } catch {
            return false;
        }
    }

    async isExisting(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isExisting();
        } catch {
            return false;
        }
    }

    // ►►► MÉTODOS DE ACCIONES TÁCTILES

    async swipe(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        await this.driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    async swipeUp(percentage: number = 50): Promise<void> {
        const { width, height } = await this.driver.getWindowSize();
        const startX = width / 2;
        const startY = height * (percentage / 100);
        const endY = height * ((100 - percentage) / 100);

        await this.swipe(startX, startY, startX, endY);
    }

    async swipeDown(percentage: number = 50): Promise<void> {
        const { width, height } = await this.driver.getWindowSize();
        const startX = width / 2;
        const startY = height * ((100 - percentage) / 100);
        const endY = height * (percentage / 100);

        await this.swipe(startX, startY, startX, endY);
    }

    async tap(x: number, y: number): Promise<void> {
        await this.driver.touchAction({
            action: 'tap',
            x: x,
            y: y
        });
    }

    // ►►► MÉTODOS DE TECLADO

    async pressKey(keyCode: number): Promise<void> {
        await this.driver.pressKeyCode(keyCode);
    }

    async hideKeyboard(): Promise<void> {
        try {
            await this.driver.hideKeyboard();
        } catch (error) {
            console.log('ℹ️  Teclado ya estaba oculto o no estaba visible');
        }
    }

    // ►►► MÉTODOS DE NAVEGACIÓN

    async back(): Promise<void> {
        await this.driver.back();
    }

    async startActivity(appPackage: string, appActivity: string): Promise<void> {
        await this.driver.startActivity(appPackage, appActivity);
    }

    async getCurrentActivity(): Promise<string> {
        return await this.driver.getCurrentActivity();
    }

    async getCurrentPackage(): Promise<string> {
        return await this.driver.getCurrentPackage();
    }

    // ►►► MÉTODOS DE CONTEXTO

    async getContexts(): Promise<string[]> {
        return await this.driver.getContexts();
    }

    async switchContext(context: string): Promise<void> {
        await this.driver.switchContext(context);
    }

    async getCurrentContext(): Promise<string> {
        return await this.driver.getContext();
    }

    // ►►► MÉTODOS DE ORIENTACIÓN

    async setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE'): Promise<void> {
        await this.driver.setOrientation(orientation);
    }

    async getOrientation(): Promise<string> {
        return await this.driver.getOrientation();
    }

    // ►►► MÉTODOS DE SCREENSHOT Y LOGS

    async takeScreenshot(name: string): Promise<void> {
        const screenshot = await this.driver.takeScreenshot();
        const screenshotPath = path.join(process.cwd(), 'screenshots', `${name}-${Date.now()}.png`);

        // Crear directorio si no existe
        const screenshotsDir = path.dirname(screenshotPath);
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        fs.writeFileSync(screenshotPath, screenshot, 'base64');
        console.log(`📸 Screenshot guardado: ${screenshotPath}`);
    }

    async getDeviceLogs(): Promise<any[]> {
        return await this.driver.getLogs('logcat');
    }

    // ►►► MÉTODOS DE ESPERA

    async pause(milliseconds: number): Promise<void> {
        await this.driver.pause(milliseconds);
    }

    async waitForCondition(condition: () => Promise<boolean>, timeout: number = 10000, interval: number = 500): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return true;
            }
            await this.pause(interval);
        }

        return false;
    }

    // ►►► MÉTODOS DE INFORMACIÓN DEL DISPOSITIVO

    async getDeviceSize(): Promise<{ width: number; height: number }> {
        return await this.driver.getWindowSize();
    }

    async getDeviceInfo(): Promise<{ platform: string; version: string; device: string }> {
        const caps: any = this.driver.capabilities;
        return {
            platform: caps.platformName,
            version: caps.platformVersion,
            device: caps.deviceName
        };
    }

    async getBatteryInfo(): Promise<any> {
        return await this.driver.executeScript('mobile: batteryInfo', []);
    }

    // ►►► MÉTODOS DE GESTIÓN DE APPS

    async installApp(appPath: string): Promise<void> {
        await this.driver.installApp(appPath);
    }

    async removeApp(appId: string): Promise<void> {
        await this.driver.removeApp(appId);
    }

    async isAppInstalled(appId: string): Promise<boolean> {
        return await this.driver.isAppInstalled(appId);
    }

    async launchApp(): Promise<void> {
        await this.driver.launchApp();
    }

    async closeApp(): Promise<void> {
        await this.driver.closeApp();
    }

    async resetApp(): Promise<void> {
        await this.driver.reset();
    }

    async activateApp(appId: string): Promise<void> {
        await this.driver.activateApp(appId);
    }

    async terminateApp(appId: string): Promise<void> {
        await this.driver.terminateApp(appId);
    }

    async queryAppState(appId: string): Promise<number> {
        return await this.driver.queryAppState(appId);
    }

    // ►►► MÉTODOS DE EJECUCIÓN DE COMANDOS NATIVOS

    async executeScript(script: string, args: any[] = []): Promise<any> {
        return await this.driver.executeScript(script, args);
    }

    async executeCommand(command: string, params: any = {}): Promise<any> {
        return await this.driver.execute(command, params);
    }
}

// ►►► CONSTANTES DE TECLAS ANDROID
export const AndroidKeyCodes = {
    BACK: 4,
    HOME: 3,
    MENU: 82,
    VOLUME_UP: 24,
    VOLUME_DOWN: 25,
    ENTER: 66,
    SEARCH: 84,
    CAMERA: 27,
    POWER: 26,
    CLEAR: 28,
    SPACE: 62,
    DEL: 67,
    TAB: 61
} as const;