// test/specsapp/basic-app-test.spec.ts
describe('Basic App Test - Open Win App', () => {

    before(async () => {
        console.log('🚀 Iniciando test básico de Appium...');
        // Esperar que la app cargue completamente
        await browser.pause(15000);
    });

    it('should open the Win app successfully', async () => {
        console.log('🧪 Test: Verificar que la app se abre correctamente');

        // 1. Obtener información del dispositivo desde capabilities
        const caps: any = browser.capabilities;
        console.log('📱 Información del dispositivo:');
        console.log('   Platform:', caps.platformName);
        console.log('   Device:', caps['appium:deviceName']);
        console.log('   Version:', caps['appium:platformVersion']);
        console.log('   App Package:', caps['appium:appPackage']);
        console.log('   App Activity:', caps['appium:appActivity']);

        // 2. Obtener actividad actual
        const currentActivity = await driver.getCurrentActivity();
        console.log('🔄 Actividad actual:', currentActivity);

        // 3. Obtener package actualz
        const currentPackage = await driver.getCurrentPackage();
        console.log('📦 Package actual:', currentPackage);

        // 4. Tomar screenshot
        try {
            await driver.saveScreenshot('./screenshots/app-opened.png');
            console.log('📸 Screenshot guardada: ./screenshots/app-opened.png');
        } catch (error) {
            console.log('⚠️ No se pudo tomar screenshot:', error.message);
        }

        // 5. Esperar para ver la app
        await browser.pause(5000);

        // 6. Verificaciones básicas
        expect(currentPackage).toContain('com.win.miwin_app');
        console.log('✅ Package verificado correctamente');

        // 7. Verificar que la actividad es la esperada
        expect(currentActivity).toContain('MainActivity');
        console.log('✅ Actividad verificada correctamente');
    });

    it('should find basic UI elements', async () => {
        console.log('🧪 Test: Buscar elementos básicos de UI');

        // Buscar diferentes tipos de elementos
        const elementTypes = [
            { type: 'TextView', selector: '//android.widget.TextView' },
            { type: 'Button', selector: '//android.widget.Button' },
            { type: 'EditText', selector: '//android.widget.EditText' },
            { type: 'ImageView', selector: '//android.widget.ImageView' },
            { type: 'Any View', selector: '//android.view.View' }
        ];

        for (const { type, selector } of elementTypes) {
            try {
                const elements = await driver.$$(selector);
                console.log(`   ${type}: ${elements.length} elementos encontrados`);

                // Mostrar texto de los primeros 3 elementos si existen
                if (elements.length > 0) {
                    for (let i = 0; i < Math.min(3, elements.length); i++) {
                        try {
                            const text = await elements[i].getText();
                            if (text) {
                                console.log(`     - "${text}"`);
                            }
                        } catch (e) {
                            // Algunos elementos no tienen texto
                        }
                    }
                }
            } catch (error) {
                console.log(`   ${type}: Error buscando elementos`);
            }
        }

        // Tomar otra screenshot
        await driver.saveScreenshot('./screenshots/ui-elements.png');
        console.log('📸 Screenshot de elementos UI guardada');
    });

    it('should test app responsiveness', async () => {
        console.log('🧪 Test: Verificar capacidad de respuesta de la app');

        // 1. Obtener tamaño de pantalla
        const windowSize = await driver.getWindowSize();
        console.log('📐 Tamaño de pantalla:', windowSize);
        expect(windowSize.width).toBeGreaterThan(0);
        expect(windowSize.height).toBeGreaterThan(0);

        // 2. Obtener orientación
        const orientation = await driver.getOrientation();
        console.log('🔄 Orientación:', orientation);

        // 3. Probar botón back
        console.log('🔙 Probando botón back...');
        await driver.back();
        await browser.pause(2000);

        // 4. Verificar que seguimos en la app
        const newActivity = await driver.getCurrentActivity();
        const newPackage = await driver.getCurrentPackage();
        console.log('🔄 Nueva actividad después de back:', newActivity);
        console.log('📦 Nuevo package después de back:', newPackage);

        expect(newPackage).toContain('com.win.miwin_app');
        console.log('✅ App sigue respondiendo después de back');

        // 5. Tomar screenshot final
        await driver.saveScreenshot('./screenshots/after-back.png');
    });

    after(async () => {
        console.log('🏁 Test básico completado exitosamente!');
        console.log('📁 Revisa las screenshots en la carpeta ./screenshots/');
    });
});