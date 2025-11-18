// test/specsapp/solicitudeswin.spec.ts
import { LoginPage } from '../pagesapp/LoginPage';
import { SuspensionPage } from '../pagesapp/app-suspension-page';
const documentos = require("./documento.json");

describe('Solicitudes Win - Regression and Smoke Tests', () => {
    let loginPage: LoginPage;
    let suspensionPage: SuspensionPage;

    before(async () => {
        loginPage = new LoginPage();
        suspensionPage = new SuspensionPage();
        console.log('🚀 Inicializando tests...');
        await browser.pause(5000);
    });

    it('should login and validate all solicitudes types - @Regression @Smoke @mobile', async function() {
        this.timeout(300000);

        console.log('🔐 INICIANDO TEST COMPLETO');

            // ========== LOGIN (LoginPage) ==========
            console.log('📱 FASE 1: LOGIN');
            await loginPage.completeLoginFlow(documentos.dni.toString(), '123456');
            console.log('✅ LOGIN COMPLETADO');

            console.log('📋 FASE 2: SUSPENSION');
                await suspensionPage.IngresarSuspension('952101487');
            // Procesar cada solicitud individualmente
            // await ProcesarSuspension('1. Inicio de Suspensión', async () => {
//
            // });
//
            });




        after(async () => {console.log('🧹 Finalizado');});});

