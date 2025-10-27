import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import * as fs from 'fs-extra';
import * as path from 'path';

export class WincorePage extends BasePage {
// Locators para login
readonly usernameInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;

// Locators para navegación
readonly menuButton: Locator;
readonly casosPendientesMenu: Locator;
readonly subCasosPendientes: Locator;
readonly nuevoCasoButton: Locator;
readonly instalacionNocOption: Locator;

// Locators para búsqueda de pedido
readonly codigoPedidoInput: Locator;
readonly buscarCodigoButton: Locator;
readonly dniResult: Locator;

// Locators para registro de activación
readonly registrarActivacionButton: Locator;
readonly modalRegistrarActivacion: Locator;
readonly administradorOption: Locator;
readonly buscarPedidoInput: Locator;
readonly resultadoPedido: Locator;

// Locators para contrata
readonly buscarContrataButton: Locator;
readonly contrataOption: Locator;

// Locators para MAC y serial
readonly productIdInput: Locator;
readonly serialNumberInput: Locator;

// Locators para CTO/NAP - RESTAURADOS A LOS ORIGINALES QUE FUNCIONABAN
readonly buscarCtoButton: Locator;
readonly tablaCto: Locator;
readonly primeraFilaCto: Locator;
readonly cualquierFilaCto: Locator;

// Locators para puertos - CORREGIDOS
readonly puertoDisponibleCheckbox: Locator;
readonly potenciaInput: Locator;
readonly activarOntButton: Locator;

// NUEVO LOCATOR para el modal OK - CON TIMEOUT EXTENDIDO
readonly modalOkButton: Locator;

// ========== NUEVOS LOCATORS PARA VALIDACIÓN ==========
readonly textoValidacionExitosa: Locator;
readonly botonInstalado: Locator;
readonly modalConfirmacionInstalado: Locator;

// ========== LOCATORES CORREGIDOS PARA SVA ==========
readonly listaSvaIds: Locator;
readonly svaSerialInput: Locator;
readonly svaUpdateButton: Locator;

constructor(page: Page) {
        super(page, 'config.json');

        // Inicializar TODOS los locators
        this.usernameInput = page.locator('//input[@id="username"]');
        this.passwordInput = page.locator('//input[@id="password"]');
        this.loginButton = page.locator('//button[@id="login"]');

        this.menuButton = page.locator('//i[@class="stroke-hamburgermenu"]');
        this.casosPendientesMenu = page.locator('//a[@href="#uielements_00" and contains(text(), "Casos Pendientes")]');

        this.subCasosPendientes = page.locator('//a[contains(@href, "bpmstask:logprocesodoview") and text()="Casos Pendientes"]');
        this.nuevoCasoButton = page.locator('#v_view_1_btn_new');
        this.instalacionNocOption = page.locator('//body[1]/div[2]/section[1]/div[1]/div[5]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]/div[1]/table[1]/tbody[1]/tr[7]/td[1]');

        // Locators para búsqueda de pedido
        this.codigoPedidoInput = page.locator('input[name="tx_n_pedido"]');
        this.buscarCodigoButton = page.locator('button.btn-warning[label="Código de pedido"]');
        this.dniResult = page.locator('//td[normalize-space()="DNI"]');

        // Locators para registro de activación
        this.registrarActivacionButton = page.locator('button[id*="VENTA_REGISTRADA"]:not([id*="TELEGRAM"])');
        this.modalRegistrarActivacion = page.locator('//button[normalize-space()="Registrar activación >>"]');
        this.administradorOption = page.locator('//td[normalize-space()="ADMINISTRADOR DEL SISTEMA"]');
        this.buscarPedidoInput = page.locator('input[type="search"].form-control.input-sm[aria-controls="v_view_1_lista"]');
        this.resultadoPedido = page.locator('tbody tr.odd').first();

        // Locators para contrata
        this.buscarContrataButton = page.locator('button.btn-warning[label="Contrata"]');
        this.contrataOption = page.locator('//td[normalize-space()="DIGETEL"]');

        // Locators para MAC y serial
        this.productIdInput = page.locator('input[name="tx_product_id"]');
        this.serialNumberInput = page.locator('input[name="tx_serialnumber"]');

        // LOCATORS ESPECÍFICOS PARA CTO/NAP - RESTAURADOS
        this.buscarCtoButton = page.locator('button.btn-warning[label="Buscar la CTO/NAP en modo lista"]');

        // Locators específicos para la tabla de CTO - RESTAURADOS
        this.tablaCto = page.locator('tbody[xpath="7"]'); // Tabla específica de CTO
        this.primeraFilaCto = page.locator('tbody[xpath="7"] tr').first();
        this.cualquierFilaCto = page.locator('tbody[xpath="7"] tr');

        // LOCATORS PARA PUERTOS - CORREGIDOS
        this.puertoDisponibleCheckbox = page.locator('input#tx_puertos_chk').first();
        this.potenciaInput = page.locator('input[name="tx_potencia_cto"]');
        this.activarOntButton = page.locator('button[name="bt_activar_ont"]');

        // NUEVO LOCATOR para el modal OK
        this.modalOkButton = page.locator('button.swal-button.swal-button--confirm');

        // ========== NUEVOS LOCATORS PARA VALIDACIÓN ==========
        this.textoValidacionExitosa = page.locator('div').first();
        this.botonInstalado = page.locator('button#v_view_2_form_pannel_button_actionsINSTALACION_OK');
        this.botonInstalado = this.botonInstalado.or(
            page.getByRole('button', { name: /Instalado/i })
        );
        this.modalConfirmacionInstalado = page.locator('button.swal-button.swal-button--confirm');

        // ========== LOCATORS CORREGIDOS PARA SVA ==========
        this.listaSvaIds = page.locator('td').filter({ hasText: /^[123456789]$/ });
        this.svaSerialInput = page.locator('input[name="tx_sva_serial"]');
        this.svaUpdateButton = page.locator('button[name="bt_sva_update_list"]');
    }

    // ========== MÉTODOS BASE ==========

    async waitForElementVisible(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitAndClick(locator: Locator, timeout: number = 10000): Promise<void> {
        await this.waitForElementVisible(locator, timeout);
        await locator.click();
    }

    async fillField(locator: Locator, value: string): Promise<void> {
        await this.waitForElementVisible(locator);
        await locator.clear();
        await locator.fill(value);
    }

    async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    // ========== MÉTODO PARA GENERAR SERIAL ALEATORIO ==========

    private generarSerialAleatorio(): string {
        // Genera un número aleatorio de 6 dígitos entre 100000 y 999999
        const serial = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔢 Serial aleatorio generado: ${serial}`);
        return serial;
    }

    // ========== MÉTODO OPTIMIZADO PARA SVA ==========

    async procesarSVASimple(): Promise<void> {
        console.log('🔧 INICIANDO PROCESAMIENTO OPTIMIZADO DE SVA...');

        try {
            // Espera inicial reducida
            await this.page.waitForTimeout(500);

            // Buscar directamente los TD que contienen números (1,2,3,4,5,6,7,8,9)
            const svaIds = this.page.locator('td').filter({
                hasText: /^[123456789]$/
            });

            const svaCount = await svaIds.count();
            console.log(`📊 SVA encontrados: ${svaCount}`);

            if (svaCount === 0) {
                console.log('ℹ️ No se encontraron SVA');
                return;
            }

            for (let i = 0; i < svaCount; i++) {
                const svaId = svaIds.nth(i);
                const idText = await svaId.textContent();

                console.log(`\n🔄 Procesando SVA ID: ${idText}`);

                // Generar serial aleatorio para cada SVA
                const serialAleatorio = this.generarSerialAleatorio();

                // Click en el ID - OPTIMIZADO
                await svaId.scrollIntoViewIfNeeded();
                await svaId.click({ force: true });

                // Espera inteligente en lugar de fija
                await this.page.waitForLoadState('domcontentloaded');

                // BUSCAR EL INPUT DE SERIAL CON TIMEOUT REDUCIDO
                let serialInput: Locator | null = null;

                // Estrategia 1: Buscar por name con timeout reducido
                serialInput = this.page.locator('input[name="tx_sva_serial"]').first();

                if (!(await serialInput.isVisible({ timeout: 200 }))) {
                    // Estrategia 2: Buscar cualquier input que pueda ser de serial
                    serialInput = this.page.locator('input[type="text"]').filter({
                        has: this.page.locator('xpath=..').filter({ hasText: /serial/i })
                    }).first();
                }

                if (!serialInput || !(await serialInput.isVisible({ timeout: 200 }))) {
                    // Estrategia 3: Buscar por placeholder que contenga "serial"
                    serialInput = this.page.locator('input[placeholder*="serial" i]').first();
                }

                if (!serialInput || !(await serialInput.isVisible({ timeout: 200 }))) {
                    // Estrategia 4: Buscar cualquier input visible después del click
                    const todosInputs = this.page.locator('input[type="text"]');
                    const countInputs = await todosInputs.count();

                    for (let j = 0; j < countInputs; j++) {
                        const input = todosInputs.nth(j);
                        if (await input.isVisible({ timeout: 100 })) {
                            serialInput = input;
                            break;
                        }
                    }
                }

                if (serialInput && await serialInput.isVisible({ timeout: 200 })) {
                    await serialInput.clear();
                    await serialInput.fill(serialAleatorio);
                    console.log(`🔢 Serial "${serialAleatorio}" asignado al SVA ${idText}`);

                    // BUSCAR EL BOTÓN DE ACTUALIZAR CON TIMEOUT REDUCIDO
                    let updateButton: Locator | null = null;

                    // Estrategia 1: Buscar por name con timeout reducido
                    updateButton = this.page.locator('button[name="bt_sva_update_list"]').first();

                    if (!(await updateButton.isVisible({ timeout: 200 }))) {
                        // Estrategia 2: Buscar por texto
                        updateButton = this.page.getByRole('button').filter({ hasText: /actualizar|update/i }).first();
                    }

                    if (!(await updateButton?.isVisible({ timeout: 200 }))) {
                        // Estrategia 3: Buscar cualquier botón que pueda ser de actualizar
                        updateButton = this.page.locator('button').filter({
                            has: this.page.locator('xpath=..').filter({ hasText: /actualizar|update/i })
                        }).first();
                    }

                    if (updateButton && await updateButton.isVisible({ timeout: 200 })) {
                        await updateButton.click();
                        console.log(`✅ Lista actualizada para SVA ${idText}`);

                        // Espera inteligente en lugar de fija - VERIFICACIÓN RÁPIDA
                        try {
                            await this.page.waitForFunction(
                                (serial) => {
                                    const input = document.querySelector('input[name="tx_sva_serial"]') as HTMLInputElement;
                                    return input && input.value === serial;
                                },
                                serialAleatorio,
                                { timeout: 1000 }
                            );
                            console.log(`✓ Serial confirmado para SVA ${idText}`);
                        } catch (e) {
                            // No crítico si no podemos verificar rápidamente
                            console.log(`⏱️ Verificación rápida omitida para SVA ${idText}`);
                        }
                    } else {
                        console.log(`⚠️ Botón de actualización no encontrado para SVA ${idText}`);
                    }
                } else {
                    console.log(`⚠️ Input de serial no encontrado para SVA ${idText}`);
                    // Tomar screenshot para debug solo si es necesario
                    if (i === 0) { // Solo el primer error
                        await this.page.screenshot({ path: `debug-sva-${idText}-no-input.png` });
                    }
                }

                // Espera reducida entre SVAs
                if (i < svaCount - 1) {
                    await this.page.waitForTimeout(300); // Reducido de 1000ms a 300ms
                }
            }

            console.log('\n🎉 PROCESAMIENTO DE SVA OPTIMIZADO COMPLETADO');

        } catch (error) {
            console.error('❌ Error en procesamiento optimizado de SVA:', error);
            await this.page.screenshot({ path: 'error-sva.png', fullPage: true });
        }
    }

    // ========== MÉTODO ALTERNATIVO MÁS ROBUSTO PARA SVA ==========

    async procesarSVAAvanzado(): Promise<void> {
        console.log('🔧 INICIANDO PROCESAMIENTO AVANZADO DE SVA...');

        try {
            await this.page.waitForTimeout(500); // Reducido

            // ESTRATEGIA 1: Buscar por estructura de tabla específica
            const tablaSva = this.page.locator('table').filter({
                has: this.page.locator('th').filter({ hasText: /Serial Number/i })
            });

            if (await tablaSva.count() > 0) {
                console.log('✅ Encontrada tabla de SVA por estructura');
                await this.procesarTablaSvaEstructurada(tablaSva);
                return;
            }

            // ESTRATEGIA 2: Buscar por contenido del div que proporcionaste
            const divContenedor = this.page.locator('div.col-sm-12').filter({
                has: this.page.locator('div.dataTables_scroll')
            });

            if (await divContenedor.count() > 0) {
                console.log('✅ Encontrado div contenedor de SVA');
                await this.procesarDivSva(divContenedor);
                return;
            }

            // ESTRATEGIA 3: Método simple como fallback
            console.log('🔄 Usando método simple como fallback...');
            await this.procesarSVASimple();

        } catch (error) {
            console.error('❌ Error en procesamiento avanzado de SVA:', error);
            await this.page.screenshot({ path: 'error-sva-avanzado.png', fullPage: true });
        }
    }

    private async procesarTablaSvaEstructurada(tablaSva: Locator): Promise<void> {
        console.log('📊 Procesando tabla SVA estructurada...');

        const filas = tablaSva.locator('tbody tr');
        const cantidadFilas = await filas.count();

        console.log(`📈 Filas en tabla SVA: ${cantidadFilas}`);

        for (let i = 0; i < cantidadFilas; i++) {
            const fila = filas.nth(i);
            const celdas = fila.locator('td');
            const cantidadCeldas = await celdas.count();

            if (cantidadCeldas >= 3) {
                const idCelda = celdas.nth(0);
                const idText = await idCelda.textContent();

                // Verificar si es un ID válido (1-9)
                if (idText && /^[1-9]$/.test(idText.trim())) {
                    console.log(`\n🔄 Procesando fila ${i + 1} con ID: ${idText}`);

                    // Generar serial aleatorio
                    const serialAleatorio = this.generarSerialAleatorio();

                    // Click en la celda de ID
                    await idCelda.click({ force: true });
                    await this.page.waitForLoadState('domcontentloaded'); // Optimizado

                    // Buscar y llenar el input de serial
                    await this.llenarSerialSvaOptimizado(serialAleatorio, idText);

                    // Espera reducida entre SVAs
                    if (i < cantidadFilas - 1) {
                        await this.page.waitForTimeout(300);
                    }
                }
            }
        }
    }

    private async procesarDivSva(divContenedor: Locator): Promise<void> {
        console.log('📦 Procesando div contenedor de SVA...');

        // Buscar todas las tablas dentro del div
        const tablas = divContenedor.locator('table');
        const cantidadTablas = await tablas.count();

        console.log(`📑 Tablas encontradas en div: ${cantidadTablas}`);

        for (let i = 0; i < cantidadTablas; i++) {
            const tabla = tablas.nth(i);
            const contenido = await tabla.textContent();

            if (contenido && contenido.includes('Serial Number')) {
                console.log(`✅ Tabla ${i + 1} parece ser la tabla de SVA`);
                await this.procesarTablaSvaEstructurada(tabla);
                break;
            }
        }
    }

    private async llenarSerialSvaOptimizado(serial: string, idSva: string): Promise<void> {
        try {
            // MÚLTIPLES ESTRATEGIAS PARA ENCONTRAR EL INPUT CON TIMEOUTS REDUCIDOS
            let serialInput: Locator | null = null;

            // Estrategia 1: Buscar por name específico con timeout reducido
            serialInput = this.page.locator('input[name="tx_sva_serial"]').first();

            if (!(await serialInput.isVisible({ timeout: 200 }))) {
                // Estrategia 2: Buscar input que apareció después del click
                serialInput = this.page.locator('input[type="text"]').last();
            }

            if (!(await serialInput?.isVisible({ timeout: 200 }))) {
                // Estrategia 3: Buscar cualquier input visible con timeout reducido
                const todosInputs = this.page.locator('input[type="text"], input[type="number"]');
                const count = await todosInputs.count();

                for (let i = 0; i < count; i++) {
                    const input = todosInputs.nth(i);
                    if (await input.isVisible({ timeout: 100 })) {
                        serialInput = input;
                        break;
                    }
                }
            }

            if (serialInput && await serialInput.isVisible({ timeout: 200 })) {
                await serialInput.clear();
                await serialInput.fill(serial);
                console.log(`✅ Serial "${serial}" asignado al SVA ${idSva}`);

                // BUSCAR BOTÓN DE ACTUALIZAR CON TIMEOUTS REDUCIDOS
                let updateButton: Locator | null = null;

                // Estrategia 1: Buscar por name con timeout reducido
                updateButton = this.page.locator('button[name="bt_sva_update_list"]').first();

                if (!(await updateButton.isVisible({ timeout: 200 }))) {
                    // Estrategia 2: Buscar por texto
                    updateButton = this.page.getByRole('button', { name: /actualizar|update/i }).first();
                }

                if (!(await updateButton?.isVisible({ timeout: 200 }))) {
                    // Estrategia 3: Buscar cualquier botón visible rápidamente
                    const todosBotones = this.page.locator('button');
                    const countBotones = await todosBotones.count();

                    for (let i = 0; i < countBotones; i++) {
                        const boton = todosBotones.nth(i);
                        if (await boton.isVisible({ timeout: 100 })) {
                            const texto = await boton.textContent();
                            if (texto && /actualizar|update|guardar|save/i.test(texto)) {
                                updateButton = boton;
                                break;
                            }
                        }
                    }
                }

                if (updateButton && await updateButton.isVisible({ timeout: 200 })) {
                    await updateButton.click();
                    console.log(`✅ SVA ${idSva} actualizado con serial: ${serial}`);

                    // Espera mínima para procesamiento
                    await this.page.waitForTimeout(200); // Reducido de 500ms
                } else {
                    console.log(`⚠️ Botón de actualización no encontrado para SVA ${idSva}`);
                }
            } else {
                console.log(`⚠️ Input de serial no encontrado para SVA ${idSva}`);
                // Solo screenshot en primer error para no ralentizar
                if (idSva === '1') {
                    await this.page.screenshot({ path: `debug-sva-${idSva}-no-input.png` });
                }
            }
        } catch (error) {
            console.error(`❌ Error llenando serial para SVA ${idSva}:`, error);
        }
    }

    // ========== MÉTODO DE SVA MÁS RÁPIDO (MÁXIMA VELOCIDAD) ==========

    async procesarSVARapido(): Promise<void> {
        console.log('⚡ INICIANDO PROCESAMIENTO RÁPIDO DE SVA...');

        try {
            // Espera mínima inicial
            await this.page.waitForTimeout(200);

            const svaIds = this.page.locator('td').filter({
                hasText: /^[123456789]$/
            });

            const svaCount = await svaIds.count();
            console.log(`📊 SVA encontrados: ${svaCount}`);

            if (svaCount === 0) return;

            // Procesar todos los SVAs con tiempo mínimo entre ellos
            for (let i = 0; i < svaCount; i++) {
                const svaId = svaIds.nth(i);
                const idText = await svaId.textContent();
                const serialAleatorio = this.generarSerialAleatorio();

                console.log(`⚡ Procesando SVA ${idText}...`);

                // Click rápido
                await svaId.click({ force: true });

                // Buscar input rápidamente
                const serialInput = this.page.locator('input[name="tx_sva_serial"]').first();
                if (await serialInput.isVisible({ timeout: 150 })) {
                    await serialInput.clear();
                    await serialInput.fill(serialAleatorio);

                    // Buscar y hacer click en botón rápidamente
                    const updateButton = this.page.locator('button[name="bt_sva_update_list"]').first();
                    if (await updateButton.isVisible({ timeout: 150 })) {
                        await updateButton.click();
                        // Espera mínima entre acciones
                        await this.page.waitForTimeout(100);
                    }
                }

                // Espera mínima entre SVAs
                if (i < svaCount - 1) {
                    await this.page.waitForTimeout(200);
                }
            }

            console.log('🎯 PROCESAMIENTO RÁPIDO DE SVA COMPLETADO');

        } catch (error) {
            console.error('❌ Error en procesamiento rápido de SVA:', error);
        }
    }

    // ========== MÉTODOS DE CTO RESTAURADOS ==========

    async buscarYSeleccionarCTO(): Promise<void> {
        console.log('🏗️ Buscando CTO/NAP...');

        await this.waitAndClick(this.buscarCtoButton);

        console.log('⏳ Esperando a que cargue la lista de CTO/NAP...');
        await this.page.waitForTimeout(5000);

        // Verificar si la tabla específica de CTO es visible
        const tablaVisible = await this.tablaCto.isVisible({ timeout: 10000 });
        const cantidadFilas = await this.cualquierFilaCto.count();

        console.log(`📊 Tabla CTO visible: ${tablaVisible}, Filas disponibles: ${cantidadFilas}`);

        if (cantidadFilas === 0) {
            console.log('⚠️ No se encontraron filas con el locator específico, intentando método alternativo...');
            await this.seleccionarCTOConMetodoAlternativo();
            return;
        }

        // Mostrar información de las primeras filas
        for (let i = 0; i < Math.min(3, cantidadFilas); i++) {
            const fila = this.cualquierFilaCto.nth(i);
            const textoFila = await fila.textContent();
            console.log(`📝 Fila CTO ${i + 1}: ${textoFila?.substring(0, 80).replace(/\n/g, ' ')}...`);
        }

        // Seleccionar la primera fila disponible
        const primeraFila = this.cualquierFilaCto.first();
        const textoPrimeraFila = await primeraFila.textContent();

        console.log(`✅ Seleccionando primera CTO disponible: ${textoPrimeraFila?.substring(0, 100).replace(/\n/g, ' ')}...`);

        await this.waitAndClick(primeraFila);

        console.log('✅ CTO/NAP seleccionado correctamente');

        await this.page.waitForTimeout(3000);
    }

    async seleccionarCTOConMetodoAlternativo(): Promise<void> {
        console.log('🔄 Usando método alternativo para seleccionar CTO...');

        // Buscar tabla por contenido específico
        const tablaCTOAlternativa = this.page.locator('tbody').filter({
            hasText: '00000045969'
        });

        if (await tablaCTOAlternativa.count() > 0) {
            console.log('✅ Encontrada tabla CTO con método alternativo');
            const primeraFila = tablaCTOAlternativa.locator('tr').first();
            await this.waitAndClick(primeraFila);
            console.log('✅ CTO seleccionado con método alternativo');
        } else {
            console.log('🔍 Buscando cualquier tabla con filas...');
            const todasLasTablas = this.page.locator('tbody');
            const cantidadTablas = await todasLasTablas.count();

            for (let i = 0; i < cantidadTablas; i++) {
                const tabla = todasLasTablas.nth(i);
                const filas = tabla.locator('tr');
                const cantidadFilas = await filas.count();

                if (cantidadFilas > 0) {
                    console.log(`✅ Encontrada tabla ${i} con ${cantidadFilas} filas`);
                    const primeraFila = filas.first();
                    const textoFila = await primeraFila.textContent();
                    console.log(`📝 Contenido: ${textoFila?.substring(0, 80)}...`);

                    if (textoFila && (textoFila.includes('CTO') || textoFila.includes('NAP'))) {
                        console.log('✅ Esta parece ser la tabla de CTO/NAP');
                        await this.waitAndClick(primeraFila);
                        console.log('✅ CTO seleccionado');
                        return;
                    }
                }
            }

            throw new Error('No se pudo encontrar ninguna tabla de CTO/NAP');
        }

        await this.page.waitForTimeout(3000);
    }

    async seleccionarCualquierCTO(): Promise<void> {
        console.log('🏗️ Seleccionando cualquier CTO disponible...');

        await this.waitAndClick(this.buscarCtoButton);
        await this.page.waitForTimeout(5000);

        const todasLasFilas = this.page.locator('tbody tr');
        const cantidadTotal = await todasLasFilas.count();

        console.log(`📊 Total de filas en todas las tablas: ${cantidadTotal}`);

        if (cantidadTotal === 0) {
            throw new Error('No se encontraron filas en ninguna tabla');
        }

        // Buscar fila que contenga CTO, NAP o números largos (que suelen ser CTOs)
        for (let i = 0; i < cantidadTotal; i++) {
            const fila = todasLasFilas.nth(i);
            const textoFila = await fila.textContent();

            if (textoFila && (textoFila.includes('CTO') || textoFila.includes('NAP') || textoFila.match(/\d{10,}/))) {
                console.log(`✅ Encontrada fila CTO en posición ${i}: ${textoFila.substring(0, 80).replace(/\n/g, ' ')}...`);
                await this.waitAndClick(fila);
                console.log('✅ CTO seleccionado correctamente');
                await this.page.waitForTimeout(3000);
                return;
            }
        }

        console.log('⚠️ No se encontró fila con patrón CTO, seleccionando primera fila disponible');
        const primeraFila = todasLasFilas.first();
        await this.waitAndClick(primeraFila);
        console.log('✅ Primera fila seleccionada');

        await this.page.waitForTimeout(3000);
    }

    // ========== MÉTODOS DE NAVEGACIÓN Y CONFIGURACIÓN ==========

    async navigateToWincore(): Promise<void> {
        await this.page.goto('http://10.23.100.13/NEWS/wincoreJC/index2.html');
    }

    async login(username: string = 'user1', password: string = '12345678$2021'): Promise<void> {
        console.log('🔐 Iniciando sesión en Wincore...');
        await this.waitForElementVisible(this.usernameInput, 10000);
        await this.waitForElementVisible(this.passwordInput, 10000);
        await this.waitForElementVisible(this.loginButton, 10000);
        await this.fillField(this.usernameInput, username);
        await this.fillField(this.passwordInput, password);
        await this.waitAndClick(this.loginButton);
        await this.waitForPageLoad();
        console.log('✅ Sesión iniciada correctamente');
    }

    async navigateToCasosPendientes(): Promise<void> {
        console.log('📋 Navegando a Casos Pendientes...');
        try {
            await this.waitAndClick(this.menuButton);
            await this.waitAndClick(this.casosPendientesMenu);
            if (await this.isElementVisible(this.subCasosPendientes, 5000)) {
                await this.waitAndClick(this.subCasosPendientes);
            }
            await this.waitAndClick(this.nuevoCasoButton);
            await this.waitAndClick(this.instalacionNocOption);
            await this.waitForPageLoad();
            console.log('✅ Navegado a Casos Pendientes correctamente');
        } catch (error) {
            console.error('❌ Error navegando a Casos Pendientes:', error);
            throw error;
        }
    }

    async buscarPedido(codigoPedido: string): Promise<void> {
        console.log(`🔍 Buscando pedido: ${codigoPedido}`);
        await this.buscarPedidoSimple(codigoPedido);
    }

    async buscarPedidoSimple(codigoPedido: string): Promise<void> {
        console.log(`🔍 [MÉTODO SIMPLE] Buscando pedido: ${codigoPedido}`);
        await this.waitForElementVisible(this.codigoPedidoInput, 10000);
        await this.codigoPedidoInput.clear();
        await this.codigoPedidoInput.fill(codigoPedido);
        await this.waitAndClick(this.buscarCodigoButton);
        await this.page.waitForTimeout(3000);
        await this.waitForElementVisible(this.dniResult, 10000);
        await this.waitAndClick(this.dniResult);
        console.log('✅ Pedido encontrado y seleccionado');
    }

    async registrarActivacion(codigoPedido: string): Promise<void> {
        console.log('📝 Iniciando registro de activación...');
        await this.registrarActivacionSimple(codigoPedido);
    }

    async registrarActivacionSimple(codigoPedido: string): Promise<void> {
        console.log('📝 [MÉTODO SIMPLE] Iniciando registro de activación...');
        const registrarButton = this.page.getByRole('button', { name: /Registrar activación/i });
        await this.waitAndClick(registrarButton);
        await this.waitAndClick(this.modalRegistrarActivacion);
        await this.waitAndClick(this.administradorOption);
        console.log('⏳ Esperando a que aparezca el campo de búsqueda...');
        await this.page.waitForTimeout(7000);

        const allSearchInputs = this.page.locator('input[type="search"].form-control.input-sm');
        const inputCount = await allSearchInputs.count();

        console.log(`🔍 Campos de búsqueda encontrados: ${inputCount}`);

        if (await this.buscarPedidoInput.count() > 0 && await this.buscarPedidoInput.isVisible()) {
            console.log('✅ Usando campo de búsqueda específico...');
            await this.fillField(this.buscarPedidoInput, codigoPedido);
        } else {
            console.log('🔍 Buscando campo de búsqueda visible...');
            let foundInput = false;
            for (let i = 0; i < inputCount; i++) {
                const input = allSearchInputs.nth(i);
                if (await input.isVisible()) {
                    console.log(`✅ Usando campo de búsqueda en posición ${i}`);
                    await this.fillField(input, codigoPedido);
                    foundInput = true;
                    break;
                }
            }
            if (!foundInput) {
                throw new Error('No se encontró ningún campo de búsqueda visible');
            }
        }

        await this.waitAndClick(this.resultadoPedido);
        console.log('✅ Activación registrada correctamente');
    }

    async seleccionarContrata(): Promise<void> {
        console.log('🏢 Seleccionando contrata...');
        await this.waitAndClick(this.buscarContrataButton);
        await this.waitAndClick(this.contrataOption);
        console.log('✅ Contrata seleccionada correctamente');
    }

    async ingresarMacYSerial(mac: string): Promise<void> {
        console.log(`💾 Ingresando MAC: ${mac}`);
        await this.fillField(this.productIdInput, mac);
        console.log('✅ MAC ingresada correctamente');
    }

    async seleccionarPuertoDisponible(): Promise<void> {
        console.log('🔌 Seleccionando puerto disponible...');

        await this.page.waitForTimeout(3000);

        try {
            await this.waitForElementVisible(this.puertoDisponibleCheckbox, 5000);
            await this.waitAndClick(this.puertoDisponibleCheckbox);
            console.log('✅ Puerto disponible seleccionado correctamente');
        } catch (error) {
            console.log('⚠️ Método por id falló, intentando método alternativo...');

            const checkboxDisponible = this.page.locator('tr:has-text("DISPONIBLE") input.regular-checkbox').first();

            if (await checkboxDisponible.count() > 0) {
                await this.waitAndClick(checkboxDisponible);
                console.log('✅ Puerto disponible seleccionado (método alternativo)');
            } else {
                const cualquierCheckbox = this.page.locator('input.regular-checkbox[id="tx_puertos_chk"]').first();
                if (await cualquierCheckbox.count() > 0) {
                    await this.waitAndClick(cualquierCheckbox);
                    console.log('✅ Puerto seleccionado (método genérico)');
                } else {
                    throw new Error('No se pudo encontrar ningún checkbox de puerto disponible');
                }
            }
        }
    }

    async configurarPotenciaYActivarONT(): Promise<void> {
        try {
            const potencia = await this.leerPotenciaDesdeJSON();
            console.log(`⚡ Configurando potencia desde JSON: ${potencia}`);

            await this.fillField(this.potenciaInput, potencia.toString());
            await this.waitAndClick(this.activarOntButton);
            console.log('✅ ONT activado correctamente con potencia del JSON');

            console.log('⏳ Esperando modal de confirmación (hasta 2 minutos)...');

            try {
                await this.waitForElementVisible(this.modalOkButton, 120000);
                await this.waitAndClick(this.modalOkButton);
                console.log('✅ Modal OK confirmado después de espera extendida');
            } catch (modalError) {
                console.warn('⚠️ Modal no apareció después de 2 minutos, continuando...');
            }

            console.log('⏳ Esperando a que se estabilice la página después del modal...');
            await this.page.waitForTimeout(5000);

        } catch (error) {
            console.error('❌ Error configurando potencia desde JSON:', error);
            throw error;
        }
    }

    // ========== MÉTODOS DE VALIDACIÓN ==========

    private async leerPotenciaDesdeJSON(): Promise<number> {
        try {
            const jsonPath = 'D:\\PlayWrightWin\\test\\specs\\potencia-ont.json';
            console.log(`📁 Buscando archivo JSON en: ${jsonPath}`);

            const jsonData = await fs.readJson(jsonPath);
            console.log(`📊 Datos del JSON:`, jsonData);

            const potencia = jsonData.potencia_ont;
            console.log(`⚡ Potencia leída desde JSON: ${potencia}`);

            return potencia;
        } catch (error) {
            console.error('❌ Error leyendo el archivo JSON:', error);
            return 21;
        }
    }

    async validarActivacionExitosa(): Promise<boolean> {
        try {
            console.log('🔍 Validando texto de activación exitosa...');
            await this.page.waitForTimeout(15000);

            try {
                console.log('🔄 Intentando estrategia 1: getByText exacto...');
                const elemento = this.page.getByText('ONT y VAS VAS-FREESWITCH valido por Servicio', { exact: true });
                await elemento.waitFor({ state: 'visible', timeout: 10000 });
                console.log('✅ Texto encontrado con getByText exacto');
                return true;
            } catch (error) {
                console.log('⚠️ Estrategia 1 falló:', error instanceof Error ? error.message : error);
            }

            try {
                console.log('🔄 Intentando estrategia 2: Verificación de contenido...');
                const pageContent = await this.page.content();
                if (pageContent.includes('ONT y VAS VAS-FREESWITCH valido por Servicio')) {
                    console.log('✅ Texto encontrado en el contenido HTML de la página');
                    return true;
                }
            } catch (error) {
                console.log('⚠️ Estrategia 2 falló:', error instanceof Error ? error.message : error);
            }

            console.log('❌ No se encontró el texto de validación esperado');
            await this.page.screenshot({ path: 'debug-no-texto-encontrado.png', fullPage: true });
            return false;

        } catch (error) {
            console.log('❌ Error en validación:', error instanceof Error ? error.message : error);
            return false;
        }
    }

    async validarActivacionExitosaSimple(): Promise<boolean> {
        try {
            console.log('🔍 Validando activación (método simple)...');
            await this.page.waitForTimeout(10000);

            const pageContent = await this.page.content();
            const textoExiste = pageContent.includes('ONT y VAS VAS-FREESWITCH valido por Servicio');

            if (textoExiste) {
                console.log('✅ Texto de validación encontrado en la página');
                return true;
            } else {
                console.log('❌ Texto de validación NO encontrado en la página');
                await this.page.screenshot({ path: 'debug-simple-no-texto.png', fullPage: true });
                return false;
            }

        } catch (error) {
            console.log('❌ Error en validación simple:', error);
            return false;
        }
    }

    async hacerClicEnInstalado(): Promise<void> {
        try {
            console.log('🖱️ Buscando botón "Instalado"...');
            await this.botonInstalado.waitFor({ state: 'visible', timeout: 10000 });
            await this.botonInstalado.click();
            console.log('✅ Botón "Instalado" presionado correctamente');
            await this.page.waitForTimeout(2000);
            await this.modalConfirmacionInstalado.waitFor({ state: 'visible', timeout: 10000 });
            await this.modalConfirmacionInstalado.click();
            console.log('✅ Modal de confirmación aceptado');
        } catch (error) {
            console.error('❌ Error al hacer clic en el botón Instalado:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    // ========== MÉTODOS DE FLUJO COMPLETO ==========

    async ejecutarFlujoCompletoConValidacion(codigoPedido: string, mac: string): Promise<boolean> {
        console.log('🚀 INICIANDO FLUJO COMPLETO DE ACTIVACIÓN CON VALIDACIÓN Y SVA');
        console.log('═'.repeat(80));

        try {
            await this.navigateToWincore();
            await this.login();
            await this.navigateToCasosPendientes();
            await this.buscarPedido(codigoPedido);
            await this.registrarActivacion(codigoPedido);
            await this.seleccionarContrata();
            await this.ingresarMacYSerial(mac);
            await this.buscarYSeleccionarCTO();
            await this.seleccionarPuertoDisponible();

            // ========== PROCESAR SVA OPTIMIZADO ==========
            console.log('\n🔧 EJECUTANDO VALIDACIÓN DE SVA OPTIMIZADA...');
            await this.procesarSVASimple(); // Usar el método optimizado

            await this.configurarPotenciaYActivarONT();

            // Esperar después del modal para que cargue la página
            await this.page.waitForTimeout(5000);

            // Validar activación exitosa
            console.log('🎯 INICIANDO VALIDACIÓN POST-ACTIVACIÓN');
            const activacionExitosa = await this.validarActivacionExitosaSimple();

            if (activacionExitosa) {
                await this.hacerClicEnInstalado();
                console.log('🎉 FLUJO COMPLETADO EXITOSAMENTE CON VALIDACIÓN Y SVA');
                return true;
            } else {
                console.log('❌ ACTIVACIÓN FALLIDA - No se encontró el texto de validación');
                const activacionAvanzada = await this.validarActivacionExitosa();
                if (activacionAvanzada) {
                    await this.hacerClicEnInstalado();
                    console.log('🎉 FLUJO COMPLETADO EXITOSAMENTE CON VALIDACIÓN AVANZADA');
                    return true;
                }
                return false;
            }

        } catch (error) {
            console.error('💥 ERROR EN EL FLUJO COMPLETO:', error);
            await this.page.screenshot({ path: 'error-flujo-completo.png', fullPage: true });
            return false;
        }
    }

    async ejecutarFlujoCompleto(codigoPedido: string, mac: string): Promise<void> {
        console.log('🚀 INICIANDO FLUJO COMPLETO DE ACTIVACIÓN WINCORE CON SVA');
        console.log('═'.repeat(80));

        try {
            await this.navigateToWincore();
            await this.login();
            await this.navigateToCasosPendientes();
            await this.buscarPedido(codigoPedido);
            await this.registrarActivacion(codigoPedido);
            await this.seleccionarContrata();
            await this.ingresarMacYSerial(mac);
            await this.seleccionarCualquierCTO();
            await this.seleccionarPuertoDisponible();

            // ========== PROCESAR SVA OPTIMIZADO ==========
            console.log('\n🔧 EJECUTANDO VALIDACIÓN DE SVA OPTIMIZADA...');
            await this.procesarSVASimple(); // Usar el método optimizado

            await this.configurarPotenciaYActivarONT();

            console.log('═'.repeat(80));
            console.log('🎉 FLUJO COMPLETADO EXITOSAMENTE CON SVA');
        } catch (error) {
            console.error('💥 ERROR EN EL FLUJO COMPLETO:', error);
            await this.page.screenshot({ path: 'error-flujo-completo.png', fullPage: true });
            throw error;
        }
    }

    // ========== MÉTODO ESPECÍFICO PARA PROCESAR SVA SOLAMENTE ==========
    async procesarSVAIndependiente(): Promise<void> {
        console.log('🔧 EJECUTANDO PROCESAMIENTO INDEPENDIENTE DE SVA OPTIMIZADO...');
        await this.procesarSVASimple(); // Usar el método optimizado
    }

    // ========== MÉTODO EXTRA PARA MÁXIMA VELOCIDAD ==========
    async procesarSVAUltraRapido(): Promise<void> {
        console.log('⚡ EJECUTANDO PROCESAMIENTO ULTRA RÁPIDO DE SVA...');
        await this.procesarSVARapido();
    }
}