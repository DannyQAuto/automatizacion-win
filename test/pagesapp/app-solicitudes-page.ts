// pagesapp/SolicitudesPage.ts
import { PageBase } from './PageBase';

export class SolicitudesPage extends PageBase {
// ========== SELECTORS DE SOLICITUDES ==========

// Navegación
public readonly ingresarSolicitudes = '~Mis Solicitudes';
public readonly agregarSolicitud = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.ImageView';

// Formulario base
public readonly celularPrincipal = '-android uiautomator:new UiSelector().className("android.widget.EditText")';


public readonly comboTipoSolicitud = '~Tipo de solicitud';
public readonly terminos = '//android.widget.CheckBox';
public readonly enviarCambio = '~Enviar';
public readonly finalizar = '~Finalizar';

// Tipos de solicitud
public readonly cambioDePlan = '~Cambio de titularidad';
public readonly traslado = '~Traslado';
public readonly cambioDePlan1 = '~Cambio de plan';
public readonly reubicacion = '~Reubicación de router';
public readonly contrato = '~Solicitud de contrato';
public readonly fonowin = '~Cambio de número FONOWIN';
public readonly pagoDoble = '~Problemas con pago';
public readonly pagoOtraCuenta = '~Realizó pago a otra cuenta';

// Campos específicos
public readonly tipoCambio = '//android.widget.ImageView[@content-desc="Tipo de cambio\nPersona natural"]';
public readonly juridica = '~Persona jurídica';
public readonly nombreYApellido = '//android.widget.ScrollView/android.widget.EditText[2]';
public readonly dniSolicitud = '//android.widget.ScrollView/android.widget.EditText[3]';
public readonly emailSolicitud = '//android.widget.ScrollView/android.widget.EditText[4]';
public readonly nCelular = '//android.widget.ScrollView/android.widget.EditText[5]';
public readonly razonSocial = '//android.widget.ScrollView/android.widget.EditText[2]';
public readonly numeroRuc = '//android.widget.ScrollView/android.widget.EditText[3]';
public readonly nombreYApellidoJuridica = '//android.widget.ScrollView/android.widget.EditText[4]';
public readonly dniJuridica = '//android.widget.ScrollView/android.widget.EditText[5]';
public readonly emailJuridica = '//android.widget.ScrollView/android.widget.EditText[6]';
public readonly numeroJuridica = '//android.widget.ScrollView/android.widget.EditText[7]';
public readonly departamento = '~Departamento';
public readonly lima = '~Lima';
public readonly provincia = '~Provincia';
public readonly lima2 = '~Lima';
public readonly distrito = '~Distrito';
public readonly brena = '~Breña';
public readonly nuevaDireccion = '//android.widget.ScrollView/android.widget.EditText[2]';
public readonly referencia = '//android.widget.ScrollView/android.widget.EditText[3]';
public readonly detalle = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]';
public readonly entidad = '//android.widget.ScrollView/android.widget.EditText[2]';
public readonly operacion = '//android.widget.ScrollView/android.widget.EditText[3]';
public readonly reciboPago = '//android.widget.ScrollView/android.view.View[3]/android.widget.EditText';

// Documentos
public readonly verDocumentos = '//android.widget.ImageView[contains(@content-desc, "Documentos requeridos")]';
public readonly documentoIdentidad = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(2)';
public readonly selectPdf = '//android.widget.ImageView[@resource-id="com.google.android.documentsui:id/icon_thumb"]';
public readonly documentoNewTitular = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(4)';
public readonly documentoRuc = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(6)';
public readonly guardarArchivo = '~Guardar';

// ========== MÉTODOS DE NAVEGACIÓN ==========

async navigateToSolicitudes(): Promise<void> {
        console.log('📋 Navegando a solicitudes...');
        await this.click(this.ingresarSolicitudes);
        await this.waitForElement(this.agregarSolicitud);
        console.log('✅ En página de solicitudes');
    }
async startNewSolicitud(celular: string): Promise<void> {
    console.log('🆕 Iniciando nueva solicitud...');
    await this.click(this.agregarSolicitud);

    // ⭐ PRIMERO HACER CLICK PARA ENFOCAR EL CAMPO
    await this.click(this.celularPrincipal);



    // ⭐ LUEGO ESCRIBIR
    await this.setValue(this.celularPrincipal, celular);
    console.log('✅ Teléfono escrito:', celular);
}
    async selectSolicitudType(tipo: string): Promise<void> {
        console.log(`📝 Seleccionando tipo: ${tipo}`);
        await this.click(this.comboTipoSolicitud);
        await this.waitForElement(tipo);
        await this.click(tipo);
    }

    // ========== MÉTODOS DE SOLICITUDES ==========

    async cambioDeTitularidadNatural(
        celular1: string,
        nombre: string,
        dni: string,
        email: string,
        celular: string
    ): Promise<void> {
        console.log(`👤 Procesando cambio de titularidad natural para: ${nombre}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.cambioDePlan);

        await this.setValue(this.nombreYApellido, nombre);
        await this.setValue(this.dniSolicitud, dni);
        await this.setValue(this.emailSolicitud, email);
        await this.setValue(this.nCelular, celular);

        await this.pressEnter();
        await this.processDocuments();
        await this.submitRequest();
    }

    async cambioDeTitularidadJuridica(
        celular1: string,
        razon: string,
        ruc: string,
        nombre: string,
        dni: string,
        email: string,
        celular: string
    ): Promise<void> {
        console.log(`🏢 Procesando cambio de titularidad jurídica para: ${razon}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.cambioDePlan);

        await this.click(this.tipoCambio);
        await this.waitForElement(this.juridica);
        await this.click(this.juridica);

        await this.setValue(this.razonSocial, razon);
        await this.setValue(this.numeroRuc, ruc);
        await this.setValue(this.nombreYApellidoJuridica, nombre);
        await this.setValue(this.dniJuridica, dni);
        await this.setValue(this.emailJuridica, email);
        await this.setValue(this.numeroJuridica, celular);

        await this.pressEnter();
        await this.processJuridicaDocuments();
        await this.submitRequest();
    }

    async solicitudTraslado(celular1: string, nuevaDireccion: string, nuevaReferencia: string): Promise<void> {
        console.log(`🚚 Procesando solicitud de traslado para celular: ${celular1}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.traslado);

        await this.selectUbicacion();

        await this.setValue(this.nuevaDireccion, nuevaDireccion);
        await this.setValue(this.referencia, nuevaReferencia);

        await this.submitRequest();
    }

    async solicitudCambioDePlan(celular1: string, detalle1: string): Promise<void> {
        console.log(`📊 Procesando cambio de plan para celular: ${celular1}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.cambioDePlan1);

        await this.setValue(this.detalle, detalle1);
        await this.submitRequest();
    }

    async solicitudReubicacionRouter(celular1: string, detalle1: string): Promise<void> {
        console.log(`🔄 Procesando reubicación de router para celular: ${celular1}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.reubicacion);

        await this.setValue(this.detalle, detalle1);
        await this.submitRequest();
    }

    async solicitudContrato(celular1: string, detalle1: string): Promise<void> {
        console.log(`📝 Procesando solicitud de contrato para celular: ${celular1}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.contrato);

        await this.setValue(this.detalle, detalle1);
        await this.submitRequest();
    }

    async solicitudFonowin(celular1: string, detalle1: string): Promise<void> {
        console.log(`📞 Procesando cambio FONOWIN para celular: ${celular1}`);

        await this.navigateToSolicitudes();
        await this.startNewSolicitud(celular1);
        await this.selectSolicitudType(this.fonowin);

        await this.setValue(this.detalle, detalle1);
        await this.submitRequest();
    }

async solicitudPagoDoble(celular1: string, entidad1: string, operacion1: string, recibo1: string): Promise<void> {
    console.log(`💳 Procesando pago doble para celular: ${celular1}`);

    // ✅ ESPERA: Antes de navegar a solicitudes

    await this.navigateToSolicitudes();

    // ✅ ESPERA: Después de llegar a solicitudes
    await browser.pause(2000);
    await this.startNewSolicitud(celular1);

    // ✅ ESPERA: Después de escribir teléfono (en startNewSolicitud ya tiene espera)
    await this.selectSolicitudType(this.pagoDoble);

    // ✅ ESPERA: Después de seleccionar tipo de solicitud
    await browser.pause(3000);
    await this.click(this.pagoOtraCuenta);

    // ✅ ESPERA: Para que cargue los campos del formulario
    await browser.pause(2000);
    await this.waitForElement(this.entidad);

    // Llenar campos con pequeñas esperas entre ellos
    await this.setValue(this.entidad, entidad1);
    await browser.pause(1000);

    await this.setValue(this.operacion, operacion1);
    await browser.pause(1000);

    await this.setValue(this.reciboPago, recibo1);
    await browser.pause(1000);

    await this.submitRequest();
}

    // ========== MÉTODOS AUXILIARES ==========

    private async selectUbicacion(): Promise<void> {
        await this.click(this.departamento);
        await this.waitForElement(this.lima);
        await this.click(this.lima);

        await this.click(this.provincia);
        await this.waitForElement(this.lima2);
        await this.click(this.lima2);

        await this.click(this.distrito);
        await this.waitForElement(this.brena);
        await this.click(this.brena);
    }

    private async processDocuments(): Promise<void> {
        console.log('📎 Procesando documentos...');
        await this.click(this.verDocumentos);
        await this.waitForElement(this.documentoIdentidad);

        await this.click(this.documentoIdentidad);
        await this.waitForElement(this.selectPdf);
        await this.click(this.selectPdf);

        await this.click(this.documentoNewTitular);
        await this.waitForElement(this.selectPdf);
        await this.click(this.selectPdf);

        await this.click(this.guardarArchivo);
        await this.waitForElement(this.terminos);
    }

    private async processJuridicaDocuments(): Promise<void> {
        console.log('📎 Procesando documentos jurídicos...');
        await this.click(this.verDocumentos);
        await this.waitForElement(this.documentoIdentidad);

        await this.click(this.documentoIdentidad);
        await this.waitForElement(this.selectPdf);
        await this.click(this.selectPdf);

        await this.click(this.documentoNewTitular);
        await this.waitForElement(this.selectPdf);
        await this.click(this.selectPdf);

        await this.click(this.documentoRuc);
        await this.waitForElement(this.selectPdf);
        await this.click(this.selectPdf);

        await this.click(this.guardarArchivo);
        await this.waitForElement(this.terminos);
    }

    private async submitRequest(): Promise<void> {
        console.log('📤 Enviando solicitud...');
        const mainCanvas = await $('//android.widget.ScrollView');
        await this.scrollToElement(mainCanvas);

        await this.click(this.terminos);
        await this.click(this.enviarCambio);
        await this.waitForElement(this.finalizar);
        await this.click(this.finalizar);
    }

    // ========== MÉTODOS REQUERIDOS POR PageBase ==========

    async waitForLoginPage(): Promise<void> {
        // No se usa en SolicitudesPage, pero es requerido por PageBase
        throw new Error('Este método no debe usarse en SolicitudesPage');
    }

    async waitForMainPage(): Promise<void> {
        // No se usa en SolicitudesPage, pero es requerido por PageBase
        throw new Error('Este método no debe usarse en SolicitudesPage');
    }
}