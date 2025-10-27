// pagesapp/LoginPage.ts
import { PageBase } from './PageBase';

export class LoginPage extends PageBase {
// ========== SELECTORS DE LOGIN ==========
public readonly dniInput = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]';
public readonly texto = this.dniInput;
public readonly ingresarButton = '~Ingresar';
public readonly smartWifi = '//android.widget.ImageView[@content-desc="Smart WiFi"]';

// ========== MÉTODOS DE LOGIN ==========

async waitForLoginPage(): Promise<void> {
        console.log('⏳ Esperando página de login...');
        await this.waitForPageLoad(this.dniInput, 45000);
    }

    async waitForMainPage(): Promise<void> {
        console.log('⏳ Esperando página principal después del login...');
        await this.waitForPageLoad(this.smartWifi, 45000);
        console.log('✅ Página principal cargada');
    }

    async completeLoginFlow(dni: string, codigo: string): Promise<void> {
        console.log('🔐 INICIANDO FLUJO COMPLETO DE LOGIN');

        // Paso 1: Esperar página de login
        await this.waitForLoginPage();

        // Paso 2: Ingresar DNI
        await this.click(this.texto);
        await this.setValue(this.dniInput, dni);
        await this.click(this.ingresarButton);
        console.log('✅ DNI ingresado y enviado');

        // Paso 3: Esperar y escribir código con ADB
        console.log('⏳ Esperando pantalla de código...');
          await browser.pause(2000);
        await this.enterCode(codigo);
        console.log('✅ Código escrito');

        // Paso 4: Esperar que procese el login
        await browser.pause(3000);

        // Paso 5: Verificar que estamos en la página principal
        await this.waitForMainPage();
        console.log('🎉 LOGIN EXITOSO COMPLETADO');
    }

    async quickLogin(dni: string, codigo: string): Promise<void> {
        console.log('⚡ LOGIN RÁPIDO');
        await this.completeLoginFlow(dni, codigo);
    }
}