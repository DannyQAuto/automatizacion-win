// pages/app-login-page.ts
import { BasePage } from '../pages/base-page';
import { Logs } from '../utilities/logs';

export class AppLoginPage extends BasePage {
// Selectores convertidos de Java
private readonly textoRevisa = '//android.view.View[@content-desc="Revisa tu correo"]';
private readonly texto = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]';
private readonly dniInput = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]';
private readonly ingresarButton = '~Ingresar';
private readonly codigo = '//android.widget.EditText';
private readonly miCuenta = '//android.widget.ImageView[@content-desc="Mi cuenta"]';
private readonly metodoPagos = '//android.view.View[@content-desc="Métodos de pago"]';
private readonly smartWifi = '//android.widget.ImageView[@content-desc="Smart WiFi"]';
private readonly home = '//android.widget.ImageView[@content-desc="Inicio"]';
private readonly miCuenta2 = '//android.widget.ImageView[@content-desc="Mi cuenta"]';
private readonly metodoPago = '//android.view.View[@content-desc="Métodos de pago"]';
private readonly backMetodo = '~Back';
private readonly ayuda = '//android.view.View[@content-desc="Ayuda"]';
private readonly recibo = '//android.view.View[@content-desc="Pagar Recibos"]/android.widget.ImageView';
private readonly cerrarRecibo = '~Cerrar';
private readonly regresarRecibo = '~Back';
private readonly nitro = '//android.view.View[@content-desc="Activar Nitro"]/android.widget.ImageView';
private readonly ip = '//android.view.View[@content-desc="Cambiar IP"]/android.widget.ImageView';
private readonly cerrarNitro = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.widget.ImageView';
private readonly cerrarIp = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.widget.ImageView';
private readonly cerrarSesion = '~Cerrar sesión';
private readonly salir = '~Salir';
private readonly banner1 = '-android uiautomator:new UiSelector().className("android.view.View").instance(19)';
private readonly banner2 = '-android uiautomator:new UiSelector().className("android.view.View").instance(22)';
private readonly bannerCampana = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[6]/android.view.View/android.view.View[1]';
private readonly salirBanner = '//android.view.View[@content-desc="Dismiss"]/android.view.View';
private readonly cerrarCampana = '//android.widget.ImageView';

async waitPageToLoad(): Promise<void> {
        await test.step('Esperando que cargue la página de Login', async () => {
            await this.waitPage(this.dniInput, 'LoginPageWin');
        });
    }

    async waitPageToLoad0(): Promise<void> {
        await test.step('Esperando que cargue la página de código', async () => {
            await this.waitPage(this.codigo, 'LoginPageWin');
        });
    }

    async waitPageToLoad1(): Promise<void> {
        await test.step('Esperando que cargue la página principal', async () => {
            await this.waitPage(this.smartWifi, 'LoginPageWin');
        });
    }

    async verifyPage(): Promise<void> {
        await test.step('Verificando la página de login', async () => {
            Logs.info('Verificando la página de login');
            // Verificaciones específicas aquí
        });
    }

    async fillData(dni: string): Promise<void> {
        await test.step(`Rellenando formulario de login con DNI: ${dni}`, async () => {
            Logs.info('Escribiendo el dni');
            await this.setValue(this.dniInput, dni);
            Logs.info('Haciendo click en ingresar');
            await this.click(this.ingresarButton);
        });
    }

    async fillText(dni: string): Promise<void> {
        await test.step(`Logueando y autenticándose con DNI: ${dni}`, async () => {
            Logs.info('LOGIN');
            await this.click(this.texto);
            await this.setValue(this.dniInput, dni);
            await this.click(this.ingresarButton);
        });
    }

    async verifyRecibo(codigo: string): Promise<void> {
        await test.step(`Ingresando a Recibo con código: ${codigo}`, async () => {
            Logs.info('VALIDACION DE CODIGO');
            await this.sleep(70000);
            await this.setValue(this.codigo, codigo);
            await this.sleep(2000);

            for (let i = 0; i < 1; i++) {
                await this.click(this.smartWifi);
                await this.sleep(1000);
                await this.click(this.home);
                await this.sleep(1000);
            }
        });
    }

    async metodoPago(): Promise<void> {
        await test.step('Validar método de pago', async () => {
            Logs.info('Validar Metodo de pago');
            await this.click(this.miCuenta2);

            for (let i = 0; i < 1; i++) {
                await this.click(this.metodoPagos);
                await this.sleep(1000);
                await this.click(this.backMetodo);
                await this.sleep(1000);
            }
            await this.click(this.backMetodo);
        });
    }

    async ayuda(): Promise<void> {
        await test.step('Validar ayuda', async () => {
            Logs.info('Validar Ayuda');
            await this.click(this.miCuenta2);

            for (let i = 0; i < 1; i++) {
                await this.click(this.ayuda);
                await this.sleep(1000);
                await this.click(this.backMetodo);
                await this.sleep(1000);
            }
            await this.click(this.backMetodo);
        });
    }

    async recibo(): Promise<void> {
        await test.step('Validar recibo', async () => {
            Logs.info('Validar Recibo');

            for (let i = 0; i < 1; i++) {
                await this.click(this.recibo);
                await this.sleep(1000);
                await this.click(this.regresarRecibo);
                await this.sleep(1000);
            }
        });
    }

    async nitro(): Promise<void> {
        await test.step('Validar nitro', async () => {
            Logs.info('Validar Nitro');

            for (let i = 0; i < 1; i++) {
                await this.click(this.nitro);
                await this.sleep(1000);
                await this.click(this.cerrarNitro);
                await this.sleep(1000);
            }
        });
    }

    async ip(): Promise<void> {
        await test.step('Validar IP', async () => {
            Logs.info('Validar Ip');

            for (let i = 0; i < 1; i++) {
                await this.click(this.ip);
                await this.sleep(1000);
                await this.click(this.cerrarIp);
                await this.sleep(1000);
            }
        });
    }

    async banner1(): Promise<void> {
        await test.step('Validar banner', async () => {
            Logs.info('Validar Banner');

            for (let i = 0; i < 1; i++) {
                await this.click(this.banner1);
                await this.sleep(1000);
                await this.click(this.salirBanner);
                await this.sleep(1000);
            }
        });
    }

    async campana(): Promise<void> {
        await test.step('Validar campana', async () => {
            Logs.info('Validar Banner');

            for (let i = 0; i < 2; i++) {
                await this.click(this.bannerCampana);
                await this.sleep(1000);
                await this.click(this.cerrarCampana);
                await this.sleep(1000);
            }
        });
    }

    async cerrarSesion(): Promise<string> {
        await test.step('Cerrar sesión', async () => {
            Logs.info('Cerrar Sesión');
            await this.click(this.miCuenta2);

            // Verificación del texto (equivalente a softAssert)
            const cerrarSesionText = await this.getText(this.cerrarSesion);
            if (cerrarSesionText !== 'Cerrar sesión') {
                throw new Error(`El mensaje de éxito no coincide. Esperado: "Cerrar sesión", Obtenido: "${cerrarSesionText}"`);
            }

            await this.click(this.cerrarSesion);
            await this.click(this.salir);
        });

        return null;
    }

    // Helper method para sleep
    private async sleep(timeMs: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, timeMs));
    }
}