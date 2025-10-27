// test/specsapp/simple-test.spec.ts
import { test, expect } from '../fixtures/base-test';

test.describe('Win App - Simple Test', () => {

    test('should verify UI elements - @Smoke @mobile', async ({ solicitudesPage, isMobileTest }) => {
        test.skip(!isMobileTest, 'Este test es solo para mobile');

        await test.step('Verificar elementos de la UI', async () => {
            await solicitudesPage.verifyPage();
            console.log('✅ UI verificada correctamente');
        });
    });

    test('should enter app code - @Regression @mobile', async ({ solicitudesPage, isMobileTest }) => {
        test.skip(!isMobileTest, 'Este test es solo para mobile');

        await test.step('Ingresar código de aplicación', async () => {
            await solicitudesPage.codigoApp('123456');
            console.log('✅ Código ingresado correctamente');
        });
    });
});