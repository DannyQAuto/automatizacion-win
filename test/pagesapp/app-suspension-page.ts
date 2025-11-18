import { PageBase } from './PageBase';

export class SuspensionPage extends PageBase {
    public readonly MisSolicitudes = '//android.widget.ImageView[@content-desc="Mis Solicitudes"]';

    public readonly AgregarSolicitud = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(0)';
    //public readonly celularPrincipal = '-android uiautomator:new UiSelector().className("android.widget.EditText")';
    public readonly SeleccionarTelefono = '-android uiautomator:new UiSelector().className("android.widget.EditText")';
    //public readonly SeleccionarSuspension = '-android uiautomator:new UiSelector().description("Tipo de solicitud")';
    //public readonly SeleccionarAtras = '-android uiautomator:new UiSelector().description("Back")';
    public readonly comboTipoSolicitud = '-android uiautomator:new UiSelector().descriptionContains("Tipo de solicitud")';
    public readonly SeleccionarSuspension = '-android uiautomator:new UiSelector().description("Suspensión Temporal")';
    public readonly SeleccionarFechaIni = '-android uiautomator:new UiSelector().descriptionContains("Inicio de la suspensión")';
    public readonly SeleccionarDiaIni = '-android uiautomator:new UiSelector().description("19, Wednesday, November 19, 2025")';
    public readonly SeleccionarFlecha = '-android uiautomator:new UiSelector().className("android.widget.Button").instance(3)';
    public readonly SeleccionarFechaFin = '-android uiautomator:new UiSelector().description("9, Tuesday, December 9, 2025")';
    public readonly SeleccionarBtnListo = '-android uiautomator:new UiSelector().description("Listo")';
    public readonly comboMotivo = '-android uiautomator:new UiSelector().descriptionContains("Elige")';
    public readonly SeleccionarMotivo = '-android uiautomator:new UiSelector().description("Viaje")';
    public readonly CheckBox = '-android uiautomator:new UiSelector().className("android.widget.CheckBox")';
    public readonly SeleccionarBtnEnviar = '-android uiautomator:new UiSelector().description("Enviar")';
    public readonly SeleccionarBtnConfirmar = '-android uiautomator:new UiSelector().description("Confirmar")';
    public readonly ObtenerCodigoPedido = '-android uiautomator:new UiSelector().description("Código de pedido")';


    async IngresarSuspension(celular: string): Promise<void> {
            console.log('📋 Navegando a solicitudes...');
            await this.click(this.MisSolicitudes);
            await browser.pause(1000);
            await this.click(this.AgregarSolicitud);
            await browser.pause(1000);
            await this.click(this.SeleccionarTelefono);
            await browser.pause(1000);
            await this.setValue(this.SeleccionarTelefono, celular);
            console.log('✅ Teléfono escrito:', celular);
            await browser.pause(3000);
            //await this.click(this.SeleccionarAtras);
            //await browser.pause(3000);
            await this.click(this.comboTipoSolicitud);
            await browser.pause(1000);
            await this.click(this.SeleccionarSuspension);
            await browser.pause(1000);
            await this.click(this.SeleccionarFechaIni);
            await browser.pause(1000);
            await this.click(this.SeleccionarDiaIni);
            await browser.pause(1000);
            await this.click(this.SeleccionarFlecha);
            await browser.pause(1000);
            await this.click(this.SeleccionarFechaFin);
            await browser.pause(1000);
            await this.click(this.SeleccionarBtnListo);
            await browser.pause(1000);
            await this.click(this.comboMotivo);
            await browser.pause(1000);
            await this.click(this.SeleccionarMotivo);
            await browser.pause(1000);
            await this.click(this.CheckBox);
            await browser.pause(1000);
            await this.click(this.SeleccionarBtnEnviar);
            await browser.pause(1000);
            await this.click(this.SeleccionarBtnConfirmar);
            await browser.pause(1000);
            await this.click(this.ObtenerCodigoPedido);
            const codigo = await $(this.ObtenerCodigoPedido).getText();
            console.log('📦 CÓDIGO DE PEDIDO:', codigo);
            await browser.pause(10000);
            //await this.waitForElement(this.AgregarSolicitud);
            //console.log('✅ En página de solicitudes');
        }
    }
//await this.click(this.celularPrincipal);
 //await this.setValue(this.celularPrincipal, celular);
 //    console.log('✅ Teléfono escrito:', celular);
 //}

export default SuspensionPage;