// test/specs/crm-exp-suspension.spec.ts
import { test } from '@playwright/test';
import { CrmExpSuspension } from '../pages/CrmExp-Suspension-page';

test('Flujo completo de validación CRM Experiencia con último DNI', async ({ page }) => {
    const crmPage = new CrmExpSuspension(page);

    await test.step('Login en CRM Experiencia', async () => {
        await crmPage.login();
    });

    await test.step('Navegar al módulo de validación asesor', async () => {
        await crmPage.navegarAValidacionAsesor();
    });

    await test.step('Validar todos los datos de suspensión desde JSON', async () => {
        await crmPage.validarDatosCompletosSuspension();
    });

    console.log('✅ FLUJO CRM EXPERIENCIA COMPLETADO');

    // Esperar 5 minutos (300,000 milisegundos)
    await test.step('Espera de 5 minutos', async () => {
        console.log('⏰ Esperando 5 minutos...');
        await page.waitForTimeout(300000); // 300,000 ms = 5 minutos
        console.log('⏰ Espera completada');
    });
});

