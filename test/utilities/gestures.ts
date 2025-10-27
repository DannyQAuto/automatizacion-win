// utilities/Gestures.ts
import { Logs } from './Logs';

export class Gestures {

public static async tap(element: WebdriverIO.Element): Promise<void> {
        await Logs.debug('Tocando elemento');
        await element.click();
    }

    public static async longTap(element: WebdriverIO.Element, duration: number = 3000): Promise<void> {
        await Logs.debug(`Tap largo por ${duration}ms`);

        const location = await element.getLocation();
        const size = await element.getSize();

        const centerX = location.x + size.width / 2;
        const centerY = location.y + size.height / 2;

        await driver.touchAction([
            { action: 'press', x: centerX, y: centerY },
            { action: 'wait', ms: duration },
            { action: 'release' }
        ]);
    }

    public static async doubleTap(element: WebdriverIO.Element): Promise<void> {
        await Logs.debug('Doble tap en elemento');

        const location = await element.getLocation();
        const size = await element.getSize();

        const centerX = location.x + size.width / 2;
        const centerY = location.y + size.height / 2;

        // WebdriverIO no tiene doubleTap nativo, simulamos con dos taps rápidos
        await driver.touchAction([
            { action: 'tap', x: centerX, y: centerY },
            { action: 'tap', x: centerX, y: centerY }
        ]);
    }

    public static async dragTo(elementoOrigen: WebdriverIO.Element, elementoDestino: WebdriverIO.Element): Promise<void> {
        await Logs.debug('Arrastrando elemento');

        const locationOrigen = await elementoOrigen.getLocation();
        const sizeOrigen = await elementoOrigen.getSize();
        const locationDestino = await elementoDestino.getLocation();
        const sizeDestino = await elementoDestino.getSize();

        const startX = locationOrigen.x + sizeOrigen.width / 2;
        const startY = locationOrigen.y + sizeOrigen.height / 2;
        const endX = locationDestino.x + sizeDestino.width / 2;
        const endY = locationDestino.y + sizeDestino.height / 2;

        await driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 1000 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    public static async swipeGeneral(
        porcentajeXInicial: number,
        porcentajeYInicial: number,
        porcentajeXFinal: number,
        porcentajeYFinal: number,
        element: WebdriverIO.Element
    ): Promise<void> {
        await Logs.debug(`Swiping desde (${porcentajeXInicial}%, ${porcentajeYInicial}%) hasta (${porcentajeXFinal}%, ${porcentajeYFinal}%)`);

        const location = await element.getLocation();
        const size = await element.getSize();

        const startX = location.x + (porcentajeXInicial / 100) * size.width;
        const startY = location.y + (porcentajeYInicial / 100) * size.height;
        const endX = location.x + (porcentajeXFinal / 100) * size.width;
        const endY = location.y + (porcentajeYFinal / 100) * size.height;

        await this.swipeGeneralPuntos(startX, startY, endX, endY);
    }

    public static async swipeHorizontal(
        porcentajeY: number,
        porcentajeXInicial: number,
        porcentajeXFinal: number,
        element: WebdriverIO.Element
    ): Promise<void> {
        await this.swipeGeneral(porcentajeXInicial, porcentajeY, porcentajeXFinal, porcentajeY, element);
    }

    public static async swipeVertical(
        porcentajeX: number,
        porcentajeYInicial: number,
        porcentajeYFinal: number,
        element: WebdriverIO.Element
    ): Promise<void> {
        await this.swipeGeneral(porcentajeX, porcentajeYInicial, porcentajeX, porcentajeYFinal, element);
    }

    public static async swipeVerticalPercentage(
        startPercentage: number,
        endPercentage: number,
        element: WebdriverIO.Element
    ): Promise<void> {
        await this.swipeVertical(50, startPercentage, endPercentage, element);
    }

    private static async swipeGeneralPuntos(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        await Logs.debug(`Swiping desde (${startX}, ${startY}) hasta (${endX}, ${endY})`);

        await driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    // Método adicional para swipe en toda la pantalla
    public static async swipeScreen(
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ): Promise<void> {
        await Logs.debug(`Swiping en pantalla desde (${startX}, ${startY}) hasta (${endX}, ${endY})`);

        await driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    // Método para swipe up (deslizar hacia arriba)
    public static async swipeUp(element?: WebdriverIO.Element): Promise<void> {
        if (element) {
            await this.swipeVerticalPercentage(80, 20, element);
        } else {
            const { width, height } = await driver.getWindowSize();
            await this.swipeScreen(width / 2, height * 0.8, width / 2, height * 0.2);
        }
    }

    // Método para swipe down (deslizar hacia abajo)
    public static async swipeDown(element?: WebdriverIO.Element): Promise<void> {
        if (element) {
            await this.swipeVerticalPercentage(20, 80, element);
        } else {
            const { width, height } = await driver.getWindowSize();
            await this.swipeScreen(width / 2, height * 0.2, width / 2, height * 0.8);
        }
    }

    // Método para swipe left (deslizar hacia izquierda)
    public static async swipeLeft(element?: WebdriverIO.Element): Promise<void> {
        if (element) {
            await this.swipeHorizontal(50, 80, 20, element);
        } else {
            const { width, height } = await driver.getWindowSize();
            await this.swipeScreen(width * 0.8, height / 2, width * 0.2, height / 2);
        }
    }

    // Método para swipe right (deslizar hacia derecha)
    public static async swipeRight(element?: WebdriverIO.Element): Promise<void> {
        if (element) {
            await this.swipeHorizontal(50, 20, 80, element);
        } else {
            const { width, height } = await driver.getWindowSize();
            await this.swipeScreen(width * 0.2, height / 2, width * 0.8, height / 2);
        }
    }

    // Método para scroll hasta encontrar un elemento
    public static async scrollToElement(
        element: WebdriverIO.Element,
        maxSwipes: number = 10
    ): Promise<boolean> {
        await Logs.debug(`Buscando elemento con máximo ${maxSwipes} swipes`);

        for (let i = 0; i < maxSwipes; i++) {
            if (await element.isDisplayed()) {
                await Logs.debug(`Elemento encontrado después de ${i} swipes`);
                return true;
            }
            await this.swipeUp();
            await driver.pause(1000); // Esperar entre swipes
        }

        await Logs.debug('Elemento no encontrado después de máximo de swipes');
        return false;
    }
}