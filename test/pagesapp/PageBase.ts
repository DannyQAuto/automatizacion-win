// pagesapp/PageBase.ts
export class PageBase {
    // Variable para almacenar la ruta de ADB
    protected adbPath: string | null = null;

constructor() {
        this.detectADBPath();
    }

    // ========== DETECCIÓN AUTOMÁTICA DE ADB ==========

    private detectADBPath(): void {
        const { execSync } = require('child_process');
        const os = require('os');
        const path = require('path');

        console.log('🔍 Detectando ruta de ADB automáticamente...');

        const possiblePaths = this.getPossibleADBPaths();

        for (const adbPath of possiblePaths) {
            try {
                execSync(`"${adbPath}" version`, { stdio: 'pipe' });
                this.adbPath = adbPath;
                console.log(`✅ ADB detectado en: ${adbPath}`);
                return;
            } catch (error) {
                continue;
            }
        }

        try {
            execSync('adb version', { stdio: 'pipe' });
            this.adbPath = 'adb';
            console.log('✅ ADB detectado en PATH del sistema');
        } catch (error) {
            console.warn('⚠️ ADB no encontrado. Se usará Appium como fallback');
            this.adbPath = null;
        }
    }

    private getPossibleADBPaths(): string[] {
        const os = require('os');
        const path = require('path');
        const platform = os.platform();
        const homeDir = os.homedir();

        const paths = [];

        if (platform === 'win32') {
            paths.push(
                path.join(homeDir, 'AppData', 'Local', 'Android', 'Sdk', 'platform-tools', 'adb.exe'),
                path.join(homeDir, 'AppData', 'Local', 'Android', 'Sdk', 'tools', 'adb.exe'),
                path.join('C:', 'Program Files', 'Android', 'Android Studio', 'platform-tools', 'adb.exe'),
                path.join('C:', 'Program Files (x86)', 'Android', 'android-sdk', 'platform-tools', 'adb.exe'),
                path.join('D:', 'Android', 'Sdk', 'platform-tools', 'adb.exe')
            );
        } else if (platform === 'darwin') {
            paths.push(
                path.join(homeDir, 'Library', 'Android', 'sdk', 'platform-tools', 'adb'),
                path.join('/Applications', 'Android Studio.app', 'Contents', 'platform-tools', 'adb'),
                path.join('/usr', 'local', 'bin', 'adb')
            );
        } else if (platform === 'linux') {
            paths.push(
                path.join(homeDir, 'Android', 'Sdk', 'platform-tools', 'adb'),
                path.join('/usr', 'lib', 'android-sdk', 'platform-tools', 'adb'),
                path.join('/usr', 'local', 'bin', 'adb')
            );
        }

        return paths;
    }

    // ========== MÉTODOS DE UTILIDAD BÁSICOS ==========

    async waitForElement(selector: string, timeout: number = 15000): Promise<WebdriverIO.Element> {
        console.log(`⏳ Esperando elemento: ${selector}`);
        const element = await $(selector);
        await element.waitForDisplayed({ timeout });
        console.log(`✅ Elemento encontrado: ${selector}`);
        return element;
    }

    async click(selector: string, timeout: number = 15000): Promise<void> {
        const element = await this.waitForElement(selector, timeout);
        console.log(`🖱️ Haciendo click en: ${selector}`);
        await element.click();
    }

    async setValue(selector: string, value: string, timeout: number = 15000): Promise<void> {
        const element = await this.waitForElement(selector, timeout);
        console.log(`⌨️ Escribiendo en ${selector}: ${value}`);
        await element.clearValue();
        await element.setValue(value);
    }

    async takeScreenshot(name: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `./screenshots/${name}-${timestamp}.png`;
        await driver.saveScreenshot(filename);
        console.log(`📸 Screenshot guardado: ${filename}`);
    }

    async pressEnter(): Promise<void> {
        console.log('↵ Presionando ENTER');
        await browser.pressKeyCode(66);
    }

    async scrollToElement(element: WebdriverIO.Element): Promise<void> {
        console.log('🔄 Haciendo scroll al elemento');
        await element.scrollIntoView();
    }

    async waitForPageLoad(selector: string, timeout: number = 2000): Promise<void> {
        console.log(`⏳ Esperando que cargue la página...`);
        await this.waitForElement(selector, timeout);
        console.log('✅ Página cargada');
    }

    // ========== MÉTODO ADB CON ESPERA INTELIGENTE ==========

    async enterCode(codigo: string): Promise<void> {
        console.log(`⚡ PREPARANDO ESCRITURA DE CÓDIGO: ${codigo}`);



        if (!this.adbPath) {
            console.log('❌ ADB no disponible, usando Appium...');
            await this.writeCodeWithAppium(codigo);
            return;
        }

        try {
            console.log('🚀 EJECUTANDO ADB...');
            await this.writeCodeWithADB(codigo);
            console.log('✅ Código escrito con ADB exitosamente');

        } catch (error) {
            console.error('❌ Error con ADB, intentando método alternativo...');
            await this.writeCodeWithAppium(codigo);
        }
    }

    private async writeCodeWithADB(codigo: string): Promise<void> {
        if (!this.adbPath) return;

        const { execSync } = require('child_process');

        console.log(`🎯 ADB: Enfocando campo y escribiendo código...`);

        // Estrategia mejorada: Hacer tap en ubicaciones específicas
        const coordinates = [
            '500 800',  // Centro-abajo (campo de código típico)
            '500 700',  // Un poco más arriba
            '500 600',  // Centro
            '300 800',  // Izquierda-abajo
            '700 800'   // Derecha-abajo
        ];

        let exito = false;

        for (const coord of coordinates) {
            try {
                console.log(`🔧 Intentando coordenadas: ${coord}`);

                // 1. Hacer tap para enfocar
                const tapCommand = this.adbPath === 'adb'
                    ? `adb shell input tap ${coord}`
                    : `"${this.adbPath}" shell input tap ${coord}`;

                execSync(tapCommand, { stdio: 'inherit' });


                // 2. Escribir código
                const textCommand = this.adbPath === 'adb'
                    ? `adb shell input text "${codigo}"`
                    : `"${this.adbPath}" shell input text "${codigo}"`;

                console.log(`⌨️ Escribiendo: ${codigo}`);
                execSync(textCommand, { stdio: 'inherit' });


                console.log('✅ Texto inyectado con ADB');
                exito = true;
                break;

            } catch (error) {
                console.log(`❌ Coordenadas ${coord} fallaron`);
                continue;
            }
        }

        if (!exito) {
            throw new Error('No se pudo escribir con ADB en ninguna coordenada');
        }

        // Ocultar teclado al final
        try {
            console.log('🔒 Ocultando teclado...');
            const hideCommand = this.adbPath === 'adb'
                ? 'adb shell input keyevent 4'
                : `"${this.adbPath}" shell input keyevent 4`;
            execSync(hideCommand, { stdio: 'inherit' });
            await browser.pause(1000);
        } catch (error) {
            console.log('⚠️ No se pudo ocultar teclado, continuando...');
        }
    }

    private async writeCodeWithAppium(codigo: string): Promise<void> {
        console.log('🔄 Usando Appium como fallback...');

        // Buscar campo de código
        const selectors = [
            '//android.widget.EditText[@index="4"]',
            '//android.widget.EditText[4]',
            '//android.widget.EditText[3]',
            '//android.widget.EditText[2]',
            '//android.widget.EditText[1]',
            '//android.widget.EditText'
        ];

        let campo: WebdriverIO.Element | undefined;
        for (const selector of selectors) {
            try {
                campo = await $(selector);
                if (await campo.isDisplayed()) {
                    console.log(`✅ Campo encontrado: ${selector}`);
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (campo) {
            await campo.click();
            await browser.pause(1000);
            await campo.clearValue();
            await browser.pause(500);
            const keys = codigo.split('') as any[];
            await browser.keys(keys);
            console.log('✅ Código escrito con Appium');
        } else {
            console.log('⚠️ No se encontró campo, escribiendo directamente...');
            const keys = codigo.split('') as any[];
            await browser.keys(keys);
        }
    }

    // ========== MÉTODOS DE COMPATIBILIDAD ==========

    async waitPageToLoad(): Promise<void> {
        await this.waitForLoginPage();
    }

    async waitPageToLoad0(): Promise<void> {
        await this.waitForLoginPage();
    }

    async waitPageToLoad1(): Promise<void> {
        await this.waitForMainPage();
    }



    // Métodos abstractos que deben implementarse en las clases hijas
    async waitForLoginPage(): Promise<void> {
        throw new Error('Método waitForLoginPage debe implementarse en la clase hija');
    }

    async waitForMainPage(): Promise<void> {
        throw new Error('Método waitForMainPage debe implementarse en la clase hija');
    }
}