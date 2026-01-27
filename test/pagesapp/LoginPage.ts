// pagesapp/LoginPage.ts
import { PageBase } from './PageBase';

export class LoginPage extends PageBase {

    public readonly dniInput =
    '//android.widget.EditText[@hint="Ingresa tu número de documento"]';

    public readonly ingresarButton = '~Ingresar';

    public readonly smartWifi =
    '//android.widget.ImageView[@content-desc="Smart WiFi"]';

    async waitForLoginPage(): Promise<void> {
        console.log('⏳ Esperando página de login...');
        await this.waitForPageLoad(this.dniInput, 45000);
    }

    async waitForMainPage(): Promise<void> {
        console.log('⏳ Esperando página principal...');
        await this.waitForPageLoad(this.smartWifi, 45000);
        console.log('✅ Página principal cargada');
    }

    async completeLoginFlow(dni: string, codigo: string): Promise<void> {
        console.log('🔐 INICIANDO LOGIN');

        await this.waitForLoginPage();

        await this.click(this.dniInput);
        await this.setValue(this.dniInput, dni);

        await this.click(this.ingresarButton);
        console.log('✅ DNI enviado');
        await browser.pause(15000);
        console.log('🔐 ESPERA DE 15 SEGUNDOS');

        await this.enterCode(codigo);
        console.log('✅ Código ingresado');

        await this.waitForMainPage();
        console.log('🎉 LOGIN COMPLETADO');
        await browser.pause(15000);
        console.log('🔐 ESPERA DE 15 SEGUNDOS');
    }
}
