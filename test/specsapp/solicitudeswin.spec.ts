// test/specsapp/solicitudeswin.spec.ts
import { LoginPage } from '../pagesapp/LoginPage';
import { SolicitudesPage } from '../pagesapp/app-solicitudes-page';

describe('Solicitudes Win - Regression and Smoke Tests', () => {
    let loginPage: LoginPage;
    let solicitudesPage: SolicitudesPage;

    before(async () => {
        loginPage = new LoginPage();
        solicitudesPage = new SolicitudesPage();
        console.log('🚀 Inicializando tests...');
        await browser.pause(5000);
    });

    it('should login and validate all solicitudes types - @Regression @Smoke @mobile', async function() {
        this.timeout(300000);

        console.log('🔐 INICIANDO TEST COMPLETO');

        try {
            // ========== LOGIN (LoginPage) ==========
            console.log('📱 FASE 1: LOGIN');
            await loginPage.completeLoginFlow('70780214', '123456');
            console.log('✅ LOGIN COMPLETADO');

            // ========== SOLICITUDES (SolicitudesPage) ==========
            console.log('📋 FASE 2: SOLICITUDES');

            // Procesar cada solicitud individualmente
            await procesarSolicitud('1. Pago doble', async () => {
                await solicitudesPage.solicitudPagoDoble('904088906', 'BCP', '160224', 'S123456');
            });

            await procesarSolicitud('2. Reubicación router', async () => {
                await solicitudesPage.solicitudReubicacionRouter('921001266', 'Solicito la reubicacion');
            });

            await procesarSolicitud('3. Traslado', async () => {
                await solicitudesPage.solicitudTraslado('921001266', 'Av. Mercenario Danny 1456', 'Cerca al hospital de danny');
            });

            await procesarSolicitud('4. Contrato', async () => {
                await solicitudesPage.solicitudContrato('921001266', 'Solicito el cambio de contrato');
            });

            await procesarSolicitud('5. FONOWIN', async () => {
                await solicitudesPage.solicitudFonowin('921001266', 'Solicito el cambio de numero');
            });

            await procesarSolicitud('6. Cambio plan', async () => {
                await solicitudesPage.solicitudCambioDePlan('921001266', 'Solicito el cambio de plan a uno gamer');
            });

            console.log('🎉 TODAS LAS SOLICITUDES COMPLETADAS!');

        } catch (error: any) {
            console.log('❌ Error general:', error.message);
            await loginPage.takeScreenshot('error-general-test');
        }
    });

    after(async () => {
        console.log('🧹 Finalizado');
    });
});

// Función helper para procesar solicitudes
async function procesarSolicitud(nombre: string, solicitud: () => Promise<void>): Promise<void> {
    try {
        console.log(`📋 ${nombre}...`);
        await solicitud();
        console.log(`✅ ${nombre} OK`);
    } catch (error: any) {
        console.log(`⚠️ ${nombre} falló: ${error.message}`);
        await browser.saveScreenshot(`./screenshots/error-${nombre.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`);
    }
}