// utilities/FileManager.ts
import * as fs from 'fs';
import * as path from 'path';
import { DriverProvider } from './DriverProvider';
import { Logs } from './Logs';

export class FileManager {
private static readonly screenshotPath: string = "test-results/screenshots";
private static readonly pageStructurePath: string = "test-results/pageStructure";

public static async getScreenshot(screenshotName: string): Promise<void> {
        Logs.debug("Tomando screenshot");

        try {
            const driver = DriverProvider.get();
            const screenshot = await driver.takeScreenshot();
            const filePath = path.join(this.screenshotPath, `${screenshotName}-${Date.now()}.png`);

            // Crear directorio si no existe
            await this.ensureDirectoryExists(this.screenshotPath);

            // Guardar screenshot
            fs.writeFileSync(filePath, screenshot, 'base64');
            Logs.debug(`Screenshot guardado en: ${filePath}`);

        } catch (error: any) {
            Logs.error(`Error al tomar screenshot: ${error.message}`);
        }
    }

    public static async getPageSource(fileName: string): Promise<void> {
        Logs.debug("Tomando page source");

        try {
            const driver = DriverProvider.get();
            const pageSource = await driver.getPageSource();
            const filePath = path.join(this.pageStructurePath, `${fileName}-${Date.now()}.xml`);

            // Crear directorio si no existe
            await this.ensureDirectoryExists(this.pageStructurePath);

            if (pageSource) {
                fs.writeFileSync(filePath, pageSource, 'utf8');
                Logs.debug(`Page source guardado en: ${filePath}`);
            } else {
                Logs.error("Page source está vacío");
            }

        } catch (error: any) {
            Logs.error(`Error al tomar el page source: ${error.message}`);
        }
    }

    public static async deletePreviousEvidence(): Promise<void> {
        try {
            Logs.debug("Borrando las carpetas de evidencias anteriores");

            await this.deleteDirectory(this.screenshotPath);
            await this.deleteDirectory(this.pageStructurePath);

            Logs.debug("Evidencias anteriores eliminadas");

        } catch (error: any) {
            Logs.error(`Error al borrar carpeta de evidencias: ${error.message}`);
        }
    }

    // Método para Allure Reports - Screenshot
    public static async getScreenshotForAllure(): Promise<Buffer> {
        try {
            const driver = DriverProvider.get();
            const screenshot = await driver.takeScreenshot();
            return Buffer.from(screenshot, 'base64');

        } catch (error: any) {
            Logs.error(`Error al tomar screenshot para Allure: ${error.message}`);
            return Buffer.from('');
        }
    }

    // Método para Allure Reports - Page Source
    public static async getPageSourceForAllure(): Promise<string> {
        try {
            const driver = DriverProvider.get();
            const pageSource = await driver.getPageSource();

            return pageSource || "Error: Page source está vacío";

        } catch (error: any) {
            Logs.error(`Error al tomar page source para Allure: ${error.message}`);
            return `Error al tomar page source: ${error.message}`;
        }
    }

    // Métodos helper privados
    private static async ensureDirectoryExists(dirPath: string): Promise<void> {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            Logs.debug(`Directorio creado: ${dirPath}`);
        }
    }

    private static async deleteDirectory(dirPath: string): Promise<void> {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);

            for (const file of files) {
                const filePath = path.join(dirPath, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    await this.deleteDirectory(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            }

            fs.rmdirSync(dirPath);
            Logs.debug(`Directorio eliminado: ${dirPath}`);
        }
    }

    // Métodos adicionales útiles
    public static async takeScreenshotOnFailure(testName: string): Promise<void> {
        await this.getScreenshot(`FAILED-${testName}`);
        await this.getPageSource(`FAILED-${testName}`);
    }

    public static async takeScreenshotOnSuccess(testName: string): Promise<void> {
        await this.getScreenshot(`PASSED-${testName}`);
    }

    public static async cleanupTestResults(): Promise<void> {
        const directoriesToClean = [
            this.screenshotPath,
            this.pageStructurePath,
            'test-results',
            'allure-results'
        ];

        for (const dir of directoriesToClean) {
            if (fs.existsSync(dir)) {
                await this.deleteDirectory(dir);
            }
        }
    }

    // Método para obtener lista de screenshots
    public static getScreenshotList(): string[] {
        if (!fs.existsSync(this.screenshotPath)) {
            return [];
        }

        return fs.readdirSync(this.screenshotPath)
            .filter(file => file.endsWith('.png'))
            .map(file => path.join(this.screenshotPath, file));
    }

    // Método para obtener el screenshot más reciente
    public static getLatestScreenshot(): string | null {
        const screenshots = this.getScreenshotList();
        if (screenshots.length === 0) {
            return null;
        }

        return screenshots
            .map(file => ({ file, time: fs.statSync(file).mtime }))
            .sort((a, b) => b.time.getTime() - a.time.getTime())[0].file;
    }
}