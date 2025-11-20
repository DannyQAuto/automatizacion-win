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
    public readonly SeleccionarDiaIni = '-android uiautomator:new UiSelector().description("21, Friday, November 21, 2025")';
    public readonly SeleccionarFlecha = '-android uiautomator:new UiSelector().className("android.widget.Button").instance(3)';
    public readonly SeleccionarFechaFin = '-android uiautomator:new UiSelector().description("9, Tuesday, December 9, 2025")';
    public readonly SeleccionarBtnListo = '-android uiautomator:new UiSelector().description("Listo")';
    public readonly comboMotivo = '-android uiautomator:new UiSelector().descriptionContains("Elige")';
    public readonly SeleccionarMotivo = '-android uiautomator:new UiSelector().description("Viaje")';
    public readonly CheckBox = '-android uiautomator:new UiSelector().className("android.widget.CheckBox")';
    public readonly SeleccionarBtnEnviar = '-android uiautomator:new UiSelector().description("Enviar")';
    public readonly SeleccionarBtnConfirmar = '-android uiautomator:new UiSelector().description("Confirmar")';
    //public readonly ObtenerCodigoPedido = '-android uiautomator:new UiSelector().description("Código de pedido")';
    //public readonly ObtenerCodigoPedido = '//android.view.View[@content-desc="Código de pedido"]/following-sibling::*[1]';
    public readonly ObtenerCodigoPedido = '-android uiautomator:new UiSelector().descriptionMatches("^[0-9]+$")';
    public readonly obtenerCodigoSolicitud = '-android uiautomator:new UiSelector().descriptionContains("WIN-RQ-")';
    public readonly ObtenerEstado = '//android.view.View[@content-desc="Estado"]/following-sibling::*[1]';
    public readonly ObtenerFechaInicio = '//android.view.View[@content-desc="Inicio de suspensión temporal"]/following-sibling::*[1]';
    public readonly ObtenerFechaFin = '//android.view.View[@content-desc="Fin de suspensión temporal"]/following-sibling::*[1]';
    public readonly ObtenerDiasSuspen = '//android.view.View[@content-desc="Días suspendidos"]/following-sibling::*[1]';
    public readonly ObtenerDiasDisponi = '//android.view.View[@content-desc="Días disponibles"]/following-sibling::*[1]';




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
            await browser.pause(10000);
            //await this.click(this.ObtenerCodigoPedido);
            //const codigo = await $(this.ObtenerCodigoPedido).getText();
            //console.log('📦 CÓDIGO DE PEDIDO:', codigo);
            //const codigo = await $(this.ObtenerCodigoPedido).getText();
            const solicitud = await $(this.obtenerCodigoSolicitud).getAttribute('content-desc');
            console.log("📦 CÓDIGO DE SOLICITUD:", solicitud);
            expect(solicitud).toBeDefined();
            expect(solicitud).not.toBe('');
            expect(solicitud).toMatch(/^WIN-RQ-\d{4}-\d{5}$/);
            console.log('✅ Validación exitosa: Código de Solicitud es válido:', solicitud);
            await browser.pause(1000);
            const codigo = await $(this.ObtenerCodigoPedido).getAttribute('content-desc');
            console.log("📦 CÓDIGO DE PEDIDO:", codigo);
            expect(codigo).toBeDefined();
            expect(codigo).not.toBe('');
            console.log('✅ Validación exitosa: Código de Pedido es válido:', codigo);
            await browser.pause(1000);
            const estado = await $(this.ObtenerEstado).getAttribute('content-desc');
            console.log("📦 ESTADO:", estado);
            expect(estado).toBeDefined();
            expect(estado).not.toBe('');
            console.log('✅ Validación exitosa: Estado es válido:', estado);
            await browser.pause(1000);
            const fechaini = await $(this.ObtenerFechaInicio).getAttribute('content-desc');
            console.log("📦 FECHA DE INICIO:", fechaini);
            expect(fechaini).toBeDefined();
            expect(fechaini).not.toBe('');
            console.log('✅ Validación exitosa: Fecha de Inicio es válido:', fechaini);
            await browser.pause(1000);
            const fechafin = await $(this.ObtenerFechaFin).getAttribute('content-desc');
            console.log("📦 FECHA FIN:", fechafin);
            expect(fechafin).toBeDefined();
            expect(fechafin).not.toBe('');
            console.log('✅ Validación exitosa: Fecha Fin es válido:', fechafin);
            await browser.pause(1000);
            const diassuspendidos = await $(this.ObtenerDiasSuspen).getAttribute('content-desc');
            console.log("📦 CANTIDAD DE DÍAS SUSPENDIDOS:", diassuspendidos);
            expect(diassuspendidos).toBeDefined();
            expect(diassuspendidos).not.toBe('');
            console.log('✅ Validación exitosa: Cantidad de Días suspendidos es válido:', diassuspendidos);
            await browser.pause(1000);
            const diasdisponibles = await $(this.ObtenerDiasDisponi).getAttribute('content-desc');
            console.log("📦 CANTIDAD DE DÍAS DISPONIBLES:", diasdisponibles);
            expect(diasdisponibles).toBeDefined();
            expect(diasdisponibles).not.toBe('');
            console.log('✅ Validación exitosa: Cantidad de Días disponibles es válido:', diasdisponibles);
            await browser.pause(1000);
            //await this.waitForElement(this.AgregarSolicitud);
            //console.log('✅ En página de solicitudes');
        }
    }
//await this.click(this.celularPrincipal);
 //await this.setValue(this.celularPrincipal, celular);
 //    console.log('✅ Teléfono escrito:', celular);
 //}

export default SuspensionPage;