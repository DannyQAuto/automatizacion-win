// pages/crmExperienciaPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import * as fs from 'fs';
import * as path from 'path';

export class CrmExpSuspension extends BasePage {
// Locators del login
readonly usernameInput: Locator;
readonly passwordInput: Locator;
readonly ingresarButton: Locator;

// Locators del menú
readonly crmExperienciaOption: Locator;
readonly crmAtcOption: Locator;
readonly crmtContactoOption: Locator;

// Locators de la página de validación
readonly crmdni: Locator;
readonly crmSearch: Locator;
readonly pedidoDiv: Locator;
readonly comentarioDiv: Locator;

constructor(page: Page) {
        super(page);

        // Configurar URL para CRM Experiencia
        this.setCrmExperienciaUrl();

        // Inicializar locators del login
        this.usernameInput = page.locator("//input[@placeholder='Nombre usuario']");
        this.passwordInput = page.locator("//input[@placeholder='Clave']");
        this.ingresarButton = page.locator("//button[normalize-space()='INGRESAR']");

        // Inicializar locators del menú
        this.crmExperienciaOption = page.locator("//body/section/aside[@id='leftsidebar']/div[@class='menu']/div[@class='slimScrollDiv']/ul[@class='list']/li[4]/a[1]");
        this.crmAtcOption = page.locator("//body/section/aside[@id='leftsidebar']/div[@class='menu']/div[@class='slimScrollDiv']/ul[@class='list']/li/ul[@class='ml-menu']/li[2]/a[1]");
        this.crmtContactoOption = page.locator("//a[normalize-space()='CONTACTOS']");

        this.crmdni = page.locator("//input[@id='txt_busca']");
        this.crmSearch = page.locator("//button[contains(@onclick,'ajax_cliente();')]//i[@class='glyphicon glyphicon-search']");

        // Locator que funciona con cualquier código de pedido
        this.pedidoDiv = page.locator("//div[@class='panel-body overflow-panel']//div[contains(text(), 'Pedido:')]");
        this.comentarioDiv = page.locator("//a[contains(@class, 'list-group-item')]").first().locator("//div[contains(@class, 'col-md-12') and contains(., 'Comentario de la llamada')]");
    }

    // ►►► MÉTODO PARA NAVEGAR AL LOGIN ESPECÍFICO DE CRM EXPERIENCIA
    async navigateToCrmExperienciaLogin(): Promise<void> {
        console.log('🌐 Navegando al login de CRM Experiencia...');
        await this.navigateTo();
    }

    // Método para realizar login
    async login(username: string = '73451263', password: string = '73451263'): Promise<void> {
        console.log('🔐 Realizando login en CRM Experiencia...');
        await this.navigateToCrmExperienciaLogin();
        await this.fillField(this.usernameInput, username);
        await this.fillField(this.passwordInput, password);
        await this.waitAndClick(this.ingresarButton);
        await this.waitForPageLoad();
        console.log('✅ Login en CRM Experiencia completado');
    }

    // Método para navegar al módulo de validación asesor
    async navegarAValidacionAsesor(): Promise<void> {
  const datos = await this.leerDatosJSONdni();

        // Obtener DNI directamente del JSON
        const dniABuscar = datos.dni;

        console.log('🧭 Navegando al módulo de validación asesor...');

        await this.waitAndClick(this.crmExperienciaOption);
        await this.waitAndClick(this.crmAtcOption);
        await this.waitAndClick(this.crmtContactoOption);
        await this.waitForPageLoad();
        await this.fillField(this.crmdni, dniABuscar);
        await this.waitAndClick(this.crmSearch);

        console.log('✅ Navegación completada');

        // VALIDAR CÓDIGO DE PEDIDO DIRECTAMENTE AQUÍ
        console.log('🔍 Validando código de pedido...');

        const texto = await this.pedidoDiv.textContent();
        console.log(`📄 Texto del pedido: "${texto}"`);

        // Extraer el código (primer número después de "Pedido:")
        const codigoEncontrado = texto?.match(/Pedido:\s*(\d+)/)?.[1];
        console.log(`🎯 Código extraído: ${codigoEncontrado}`);
        console.log(`🎯 Código esperado: 2082719`);

        // Validar con expect
        expect(codigoEncontrado).toBe('2082719');

        console.log('✅ ✅ ✅ CÓDIGO DE PEDIDO VALIDADO CORRECTAMENTE');
    }
  // Método para leer datos desde el archivo JSON
    async leerDatosJSONdni(ruta: string = './test/specsapp/documento.json'): Promise<any> {
        try {
            const rutaCompleta = path.resolve(process.cwd(), ruta);
            console.log(`📁 Leyendo datos desde: ${rutaCompleta}`);

            const datosJSON = fs.readFileSync(rutaCompleta, 'utf8');
            const datos= JSON.parse(datosJSON);

            console.log('✅ Datos cargados desde JSON:', datos);
            return datos;
        } catch (error) {
            console.error('❌ Error al leer el archivo JSON:', error);
            throw error;
        }
    }
    // Método para leer datos desde el archivo JSON
    async leerDatosJSON(ruta: string = './test/specsapp/datos.json'): Promise<any> {
        try {
            const rutaCompleta = path.resolve(process.cwd(), ruta);
            console.log(`📁 Leyendo datos desde: ${rutaCompleta}`);

            const datosJSON = fs.readFileSync(rutaCompleta, 'utf8');
            const datos = JSON.parse(datosJSON);

            console.log('✅ Datos cargados desde JSON:', datos);
            return datos;
        } catch (error) {
            console.error('❌ Error al leer el archivo JSON:', error);
            throw error;
        }
    }

    // Método para validar todos los datos de suspensión leyendo desde JSON
    async validarDatosCompletosSuspension(): Promise<void> {
        console.log('🔍 Validando todos los datos de suspensión...');

        // Leer datos desde el archivo JSON
        const datos = await this.leerDatosJSON();

        // Validar código de pedido
        const textoPedido = await this.pedidoDiv.textContent();
        console.log(`📄 Texto del pedido: "${textoPedido}"`);

        const codigoPedidoEncontrado = textoPedido?.match(/Pedido:\s*(\d+)/)?.[1];
        console.log(`🎯 Código de pedido extraído: ${codigoPedidoEncontrado}`);
        console.log(`🎯 Código de pedido esperado: ${datos.CodigoPedido}`);

        expect(codigoPedidoEncontrado).toBe(datos.CodigoPedido);
        console.log('✅ CÓDIGO DE PEDIDO VALIDADO CORRECTAMENTE');

        // Validar datos del comentario
        const textoSolicitud = await this.comentarioDiv.textContent();
        console.log(`📄 Texto completo del comentario: "${textoSolicitud}"`);

        // Extraer todos los datos del comentario
        const codigoSolicitudEncontrado = textoSolicitud?.match(/Código de solicitud:\s*([^|]+)/)?.[1]?.trim();
         const FechayHoraSolicitud = textoSolicitud?.match(/Fecha y hora de la solicitud:\s*([^|]+)/)?.[1]?.trim();
        const fechaInicioEncontrada = textoSolicitud?.match(/Fecha de inicio de suspensión:\s*([^|]+)/)?.[1]?.trim();
        const fechaFinEncontrada = textoSolicitud?.match(/Fecha fin suspensión:\s*([^|]+)/)?.[1]?.trim();
        const diasSuspensionEncontrados = textoSolicitud?.match(/Días de suspensión:\s*([^|]+)/)?.[1]?.trim();

        console.log(`📋 Datos extraídos del comentario:`);
        console.log(`   🎯 Código solicitud: "${codigoSolicitudEncontrado}"`);
        console.log(`   📅 Fecha y hora solicitud: "${FechayHoraSolicitud}"`);
        console.log(`   📅 Fecha inicio: "${fechaInicioEncontrada}"`);
        console.log(`   📅 Fecha fin: "${fechaFinEncontrada}"`);
        console.log(`   📅 Días suspensión: "${diasSuspensionEncontrados}"`);

        console.log(`📋 Datos esperados desde JSON:`);
        console.log(`   🎯 Código solicitud: "${datos.CodigoSolicitud}"`);
        console.log(`   📅 Fecha y hora solicitud: "${datos.FechayHoraSolicitud}"`);
        console.log(`   📅 Fecha inicio: "${datos.FechaInicio}"`);
        console.log(`   📅 Fecha fin: "${datos.FechaFin}"`);
        console.log(`   📅 Días suspensión: "${datos.DiasSuspendidos}"`);

        // Validaciones con expect (CORREGIDAS según el JSON)
        expect(codigoSolicitudEncontrado).toBe(datos.CodigoSolicitud);
        expect(fechaInicioEncontrada).toBe(datos.FechaInicio);
        expect(fechaFinEncontrada).toBe(datos.FechaFin);
        expect(diasSuspensionEncontrados).toBe(datos.DiasSuspendidos);

        console.log('✅ ✅ ✅ TODOS LOS DATOS DE SUSPENSIÓN VALIDADOS CORRECTAMENTE');
    }




    // ►►► MÉTODO ADICIONAL: Para cambiar específicamente a la URL de CRM Experiencia
    async setCrmExperienciaUrl(): Promise<void> {
        this.setBaseUrl('http://10.23.100.24/proy_at/Win.CRM_EXPERIENCIA/pages/login_form.php');
        console.log('✅ URL configurada específicamente para CRM Experiencia');
    }
}