import { test, expect } from '../fixtures/base-test';
import { WincorePage } from '../pages/wincore-page';
import { AutorizacionAPI } from '../api/autorizacion.api';
import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';
import * as mysql from 'mysql2/promise';

// ========== CONFIGURACIÓN INICIAL ==========
const MODO_INTERACTIVO = true; // Forzar modo interactivo

// ========== FUNCIONES COMPARTIDAS ==========

// Función para generar número de pedido automático de 7 dígitos
function generarNumeroPedido(): string {
  let npedido = '';
  for (let i = 0; i < 7; i++) {
    npedido += Math.floor(Math.random() * 10).toString();
  }
  return npedido;
}

// Función para generar NC aleatoria
function generarNCAleatoria(): string {
  const caracteres = '0123456789ABCDEF';
  let nc = '';
  for (let i = 0; i < 16; i++) {
    nc += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return nc;
}

// Función para cargar la NC desde el archivo JSON
function cargarNC(): string | null {
  try {
    const ncFilePath = path.join(__dirname, 'nc.json');
    if (fs.existsSync(ncFilePath)) {
      const ncData = JSON.parse(fs.readFileSync(ncFilePath, 'utf8'));
      return ncData.nserie || null;
    }
  } catch (error) {
    console.log('❌ Error al cargar el archivo nc.json:', error);
  }
  return null;
}

// Función para guardar la NC en el archivo JSON
function guardarNC(nserie: string): void {
  try {
    const ncFilePath = path.join(__dirname, 'nc.json');
    const ncData = {
      nserie: nserie,
      //timestamp: new Date().toISOString(),
      //descripcion: "Número de serie de ONT actualizado"
    };
    fs.writeFileSync(ncFilePath, JSON.stringify(ncData, null, 2), 'utf8');
    console.log(`✅ NC guardada en: ${ncFilePath}`);
  } catch (error) {
    console.log('❌ Error al guardar el archivo nc.json:', error);
  }
}

// Función MEJORADA para validar NC con mensaje detallado
function validarNCConMensaje(nc: string): { esValida: boolean; mensaje: string } {
  const ncLimpia = nc.trim();
  const longitud = ncLimpia.length;

  if (longitud === 0) {
    return {
      esValida: false,
      mensaje: '❌ La NC no puede estar vacía'
    };
  }

  if (longitud !== 16) {
    return {
      esValida: false,
      mensaje: `❌ La NC debe tener exactamente 16 caracteres (como: 485754430E7289A9)\n   - Tu entrada tiene: ${longitud} caracteres\n   - Debe tener: 16 caracteres\n   - Ejemplo válido: 485754430E7289A9`
    };
  }

  if (!/^[0-9A-Fa-f]+$/.test(ncLimpia)) {
    return {
      esValida: false,
      mensaje: '❌ La NC solo puede contener números (0-9) y letras (A-F)\n   - Caracteres permitidos: 0-9, A, B, C, D, E, F\n   - Ejemplo válido: 485754430E7289A9'
    };
  }

  return {
    esValida: true,
    mensaje: `✅ NC válida: ${ncLimpia.toUpperCase()} (16 caracteres correctos)`
  };
}

// Función para cargar el código de pedido desde el archivo JSON
function cargarCodigoPedido(): string | null {
  try {
    const codPedidoFilePath = path.join(__dirname, 'codpedido.json');
    if (fs.existsSync(codPedidoFilePath)) {
      const codPedidoData = JSON.parse(fs.readFileSync(codPedidoFilePath, 'utf8'));
      return codPedidoData.codigoPedido || null;
    }
  } catch (error) {
    console.log('❌ Error al cargar el archivo codpedido.json:', error);
  }
  return null;
}

// Función para ejecutar DELETE en todas las bases de datos
async function eliminarRegistrosONT(nserie: string): Promise<void> {
  console.log(`🗑️  INICIANDO ELIMINACIÓN DE REGISTROS PARA NC: ${nserie}`);

  const config = {
    host: '10.23.100.13',
    port: 3306,
    user: 'qauser',
    password: 'Opticaldb123+',
    connectTimeout: 60000,
  };

  const databases = [
    'wincore_AT',
    'wincore_JC',
    'wincore_PC',
    'wincore_RM',
    'wincore_SVA',
    'wincore_release'
  ];

  let connection;

  try {
    // Crear conexión
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión a la base de datos establecida');

    for (const database of databases) {
      try {
        const deleteQuery = `DELETE FROM ${database}.co_activacion_ont WHERE n_serie = ?`;

        console.log(`🔍 Ejecutando DELETE en ${database}...`);
        const [result] = await connection.execute(deleteQuery, [nserie]);

        const affectedRows = (result as any).affectedRows;
        console.log(`✅ ${database}: ${affectedRows} registro(s) eliminado(s)`);

      } catch (error) {
        console.log(`❌ Error en ${database}:`, error instanceof Error ? error.message : error);
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión a la base de datos:', error instanceof Error ? error.message : error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Función para procesar y guardar la potencia
function procesarYGuardarPotencia(potencia: number): number {
  const potenciaRedondeada = Math.round(potencia);

  const datosPotencia = {
    potencia_ont: potenciaRedondeada,
    potencia_original: potencia,
    timestamp: new Date().toISOString(),
    descripcion: "Potencia ONT redondeada a entero manteniendo signo original"
  };

  const targetFolder = 'D:\\PlayWrightWin\\test\\specs';

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
    console.log(`📁 Carpeta creada: ${targetFolder}`);
  }

  const filePath = path.join(targetFolder, 'potencia-ont.json');

  fs.writeFileSync(filePath, JSON.stringify(datosPotencia, null, 2), 'utf8');

  console.log(`💾 Potencia guardada en: ${filePath}`);
  console.log(`📊 Valor guardada: ${potenciaRedondeada} (original: ${potencia})`);

  return potenciaRedondeada;
}

// Función auxiliar para delays
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========== NUEVA FUNCIÓN MEJORADA PARA EJECUTAR STEPS CON MANEJO ESPECÍFICO DE "BUSCAR PEDIDO" ==========

async function executeStep(stepName: string, stepFunction: () => Promise<void>, codigoPedido?: string) {
    try {
        await test.step(stepName, stepFunction);
        console.log(`✅ ${stepName} - COMPLETADO`);
        return { success: true, error: null };
    } catch (error) {
        console.error(`❌ ${stepName} - FALLÓ:`, error instanceof Error ? error.message : error);

        // Manejo específico para el error de "Buscar pedido"
        if (stepName === 'Buscar pedido' && error instanceof Error && error.message.includes('Timeout')) {
            console.log('⚠️ Continuando con el siguiente paso...');
            return {
                success: false,
                error: 'TIMEOUT_BUSCAR_PEDIDO',
                message: `Código de pedido no se encontró información: ${codigoPedido}`
            };
        }

        console.log('⚠️ Continuando con el siguiente paso...');
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

// ========== FUNCIONES MEJORADAS CON MANEJO DE CTRL+C ==========

// Función MEJORADA para hacer clic en el botón "Instalado"
async function hacerClicEnInstalado(wincorePage: WincorePage): Promise<void> {
    try {
        console.log('🖱️ Buscando botón "Instalado"...');
        await wincorePage.hacerClicEnInstalado();
    } catch (error) {
        console.error('❌ Error al hacer clic en el botón Instalado:', error instanceof Error ? error.message : error);
        throw error;
    }
}

// Función MEJORADA para configuración de NC con manejo de Ctrl+C
function configurarNCInteractiva(): string {
    console.log('\n🎯 CONFIGURACIÓN DE NÚMERO DE SERIE (NC)');
    console.log('📝 Formato requerido: 16 caracteres hexadecimales (ej: 485754430E7289A9)');
    console.log('💡 Presione Ctrl+C para salir');

    const ncActual = cargarNC();
    if (ncActual) {
        console.log(`📋 NC actual guardada: ${ncActual}`);
    } else {
        console.log('📋 No hay NC guardada previamente');
    }

    let nserieFinal: string;

    // SIEMPRE PREGUNTAR interactivamente
    console.log('\n¿Qué desea hacer con la NC?');
    console.log('1: Usar una NC nueva');
    console.log('2: Usar la NC existente');
    console.log('💡 Presione Ctrl+C para salir');

    let opcionValida = false;
    let opcion = '';

    while (!opcionValida) {
        try {
            opcion = readlineSync.question('Seleccione una opción (1 o 2): ').trim();

            if (opcion === '1' || opcion === '2') {
                opcionValida = true;
            } else if (opcion === 'exit' || opcion === 'quit') {
                console.log('🛑 Saliendo...');
                process.exit(0);
            } else {
                console.log('❌ Opción inválida. Por favor ingrese 1 o 2.');
                console.log('   También puede escribir "exit" para salir');
            }
        } catch (error) {
            // Si es Ctrl+C, salir del proceso
            if (error.message && error.message.includes('SIGINT')) {
                console.log('\n🛑 Ejecución cancelada por el usuario');
                process.exit(0);
            }
            throw error;
        }
    }

    if (opcion === '1') {
        console.log('\n🔄 USAR NC NUEVA');
        console.log('📝 Ingrese una NC de 16 caracteres hexadecimales (ej: 485754430E7289A9)');
        console.log('💡 Presione Ctrl+C para salir');

        let ncValida = false;
        while (!ncValida) {
            try {
                const nuevaNC = readlineSync.question('Escriba la nueva NC: ');

                // Permitir salir con "exit" o "quit"
                if (nuevaNC.trim().toLowerCase() === 'exit' || nuevaNC.trim().toLowerCase() === 'quit') {
                    console.log('🛑 Saliendo...');
                    process.exit(0);
                }

                // Usar la validación mejorada con mensaje detallado
                const validacion = validarNCConMensaje(nuevaNC);

                if (validacion.esValida) {
                    nserieFinal = nuevaNC.trim().toUpperCase();
                    guardarNC(nserieFinal);
                    console.log(validacion.mensaje);
                    ncValida = true;
                } else {
                    console.log(validacion.mensaje);
                    console.log('🔄 Por favor, intente nuevamente...\n');
                    console.log('💡 También puede escribir "exit" para salir');
                }
            } catch (error) {
                // Si es Ctrl+C, salir del proceso
                if (error.message && error.message.includes('SIGINT')) {
                    console.log('\n🛑 Ejecución cancelada por el usuario');
                    process.exit(0);
                }
                throw error;
            }
        }
    } else {
        // Opción 2: Usar NC existente
        if (ncActual) {
            nserieFinal = ncActual;
            console.log(`✅ Usando NC existente: ${nserieFinal}`);
        } else {
            console.log('❌ No hay NC guardada. Generando una nueva automáticamente...');
            nserieFinal = generarNCAleatoria();
            guardarNC(nserieFinal);
            console.log(`✅ NC automática generada: ${nserieFinal}`);
        }
    }

    return nserieFinal;
}

// ========== TESTS UNIFICADOS ==========

test.describe('Flujo completo Wincore - Potencia + Activación', () => {
  // CONFIGURACIÓN PARA EJECUCIÓN SERIAL - ESTO ES CLAVE
  test.describe.configure({ mode: 'serial' });

  test('1. Flujo completo de potencia y autorización', async ({ request }) => {
    test.setTimeout(600000);

    console.log('🚀 INICIANDO TEST 1 - FLUJO DE POTENCIA');
    console.log('════════════════════════════════════════════════════════════════════════════════');

    let potenciaEncontrada = false;
    let nserieFinal: string;
    let npedido: string;

    while (!potenciaEncontrada) {
        try {
            // === GENERAR NÚMERO DE PEDIDO AUTOMÁTICO ===
            npedido = generarNumeroPedido();
            console.log(`🎯 NÚMERO DE PEDIDO GENERADO: ${npedido}`);

            // === CONFIGURACIÓN DE NC (siempre interactiva) ===
            nserieFinal = configurarNCInteractiva();

            // === ELIMINACIÓN DE REGISTROS EN BASES DE DATOS ===
            console.log('\n🚀 INICIANDO ELIMINACIÓN DE REGISTROS EXISTENTES');
            await eliminarRegistrosONT(nserieFinal);

            // === INICIO DEL FLUJO PRINCIPAL ===
            const autorizacionAPI = new AutorizacionAPI(request);
            const liberarData = {
              nserie: nserieFinal,
              ticked: "b99a20873abf2089562eea0dde99d1c2.78789008c5dfbc2b59ce3ab526666821.c7a3247008d30afd73d9cd0312083fe9"
            };

            // === PRIMERA FASE: LIBERACIÓN INICIAL ===
            console.log('\n🔄 INICIANDO PRIMERA FASE: LIBERACIÓN INICIAL');

            // PRIMERA LIBERACIÓN
            console.log('🕒 Ejecutando PRIMERA liberación...');
            const primeraLiberacion = await autorizacionAPI.liberar(liberarData);
            console.log('✅ Respuesta de PRIMERA liberación:');
            console.log(JSON.stringify(primeraLiberacion, null, 2));

            // ESPERA DE 2 MINUTOS
            console.log('⏰ Esperando 2 minutos antes de la segunda liberación...');
            await delay(2 * 45 * 1000);

            // SEGUNDA LIBERACIÓN
            console.log('🕒 Ejecutando SEGUNDA liberación...');
            const segundaLiberacion = await autorizacionAPI.liberar(liberarData);
            console.log('✅ Respuesta de SEGUNDA liberación:');
            console.log(JSON.stringify(segundaLiberacion, null, 2));

            // === SEGUNDA FASE: AUTORIZACIÓN ===
            console.log('\n🔄 INICIANDO SEGUNDA FASE: AUTORIZACIÓN');

            const requestBody = {
              method: "logserviciosnce.authont",
              params: {
                npedido: npedido,
                nserie: nserieFinal,
                subida: "WIN_300MBPS_PLUS",
                bajada: "WIN_300MBPS_PLUS",
                vlan: "10",
                zona: "WIN",
                ticked: "b99a20873abf2089562eea0dde99d1c2.78789008c5dfbc2b59ce3ab526666821.c7a3247008d30afd73d9cd0312083fe9"
              }
            };

            console.log('📤 Enviando request de autorización...');
            console.log('URL: http://10.23.100.27/frameservice/php/index.php');
            console.log('Body:', JSON.stringify(requestBody, null, 2));

            const response = await request.post('http://10.23.100.27/frameservice/php/index.php', {
              headers: {
                'Content-Type': 'application/json',
              },
              data: requestBody
            });

            console.log('📥 Status de respuesta:', response.status());
            expect(response.status()).toBe(200);

            const responseBody = await response.json();
            console.log('✅ Respuesta de autorización:');
            console.log(JSON.stringify(responseBody, null, 2));

            // VERIFICAR SI SE ENCONTRÓ POTENCIA
            if (responseBody && responseBody.data && responseBody.data.potencia_ont !== undefined) {
              const potenciaProcesada = procesarYGuardarPotencia(responseBody.data.potencia_ont);
              console.log(`🔋 Potencia procesada y guardada: ${potenciaProcesada}`);
              potenciaEncontrada = true;

              // === TERCERA FASE: LIBERACIÓN FINAL ===
              console.log('\n🔄 INICIANDO TERCERA FASE: LIBERACIÓN FINAL');

              // ESPERA DE 2 MINUTOS DESPUÉS DE AUTORIZACIÓN
              console.log('⏰ Esperando 2 minutos después de la autorización...');
              await delay(2 * 30 * 1000);

              // TERCERA LIBERACIÓN (después de autorización)
              console.log('🕒 Ejecutando TERCERA liberación (después de autorización)...');
              const terceraLiberacion = await autorizacionAPI.liberar(liberarData);
              console.log('✅ Respuesta de TERCERA liberación:');
              console.log(JSON.stringify(terceraLiberacion, null, 2));

              // ESPERA DE 2 MINUTOS
              console.log('⏰ Esperando 2 minutos antes de la CUARTA liberación...');
              await delay(2 * 30 * 1000);

              // CUARTA LIBERACIÓN (final)
              console.log('🕒 Ejecutando CUARTA liberación (final)...');
              const cuartaLiberacion = await autorizacionAPI.liberar(liberarData);
              console.log('✅ Respuesta de CUARTA liberación:');
              console.log(JSON.stringify(cuartaLiberacion, null, 2));

              console.log('\n🎉 FLUJO DE POTENCIA COMPLETADO EXITOSAMENTE');
              console.log(`📝 Número de pedido utilizado: ${npedido}`);
              console.log('════════════════════════════════════════════════════════════════════════════════\n');

            } else {
              console.log('❌ No se encontró potencia_ont en la respuesta.data');
              throw new Error('No se encontró potencia_ont en la respuesta de autorización');
            }

        } catch (error) {
            console.error('❌ ERROR en el flujo de potencia:', error instanceof Error ? error.message : error);
            throw error; // Propagar el error para que falle el test
        }
    }
  });

  test('2. Flujo completo de activación Wincore con validación', async ({ page }) => {
    console.log('🚀 INICIANDO TEST 2 - FLUJO DE ACTIVACIÓN WINCORE CON VALIDACIÓN');
    console.log('════════════════════════════════════════════════════════════════════════════════');

    const wincorePage = new WincorePage(page);

    // Cargar CODIGO_PEDIDO desde el archivo JSON
    const CODIGO_PEDIDO = cargarCodigoPedido();

    // Cargar MAC_ADDRESS desde el archivo JSON
    const MAC_ADDRESS = cargarNC();

    // Validar que se cargaron correctamente los datos
    if (!CODIGO_PEDIDO) {
        throw new Error('No se pudo cargar el CODIGO_PEDIDO desde codpedido.json');
    }

    if (!MAC_ADDRESS) {
        throw new Error('No se pudo cargar la MAC_ADDRESS desde nc.json');
    }

    console.log(`📋 CODIGO_PEDIDO cargado desde JSON: ${CODIGO_PEDIDO}`);
    console.log(`📋 MAC_ADDRESS cargada desde JSON: ${MAC_ADDRESS}`);

    // === PUNTO DE ENTRADA A LA PÁGINA ===
    await executeStep('Navegar a Wincore', async () => {
        console.log('🌐 Navegando a Wincore...');
        await wincorePage.navigateToWincore();
        console.log('✅ Navegación a Wincore completada');
    });

    await executeStep('Iniciar sesión', async () => {
        console.log('🔐 Iniciando sesión...');
        await wincorePage.login();

        // Verificar que estamos en la página después del login
        const currentUrl = await wincorePage.getCurrentUrl();
        expect(currentUrl).toContain('wincoreRM');
        console.log('✅ Sesión iniciada correctamente');
    });

    await executeStep('Navegar a casos pendientes', async () => {
        console.log('📋 Navegando a Casos Pendientes...');
        await wincorePage.navigateToCasosPendientes();
        console.log('✅ Navegado a Casos Pendientes correctamente');
    });

    // ========== PASO CRÍTICO: BUSCAR PEDIDO CON MANEJO ESPECÍFICO ==========
    const resultadoBuscarPedido = await executeStep('Buscar pedido', async () => {
        console.log(`🔍 Buscando pedido: ${CODIGO_PEDIDO}`);
        await wincorePage.buscarPedido(CODIGO_PEDIDO);
        console.log('✅ Pedido encontrado y seleccionado');
    }, CODIGO_PEDIDO);

    // ========== VALIDACIÓN CRÍTICA: SI NO SE ENCUENTRA EL PEDIDO, TERMINAR EL TEST ==========
    if (!resultadoBuscarPedido.success && resultadoBuscarPedido.error === 'TIMEOUT_BUSCAR_PEDIDO') {
        console.log('\n💥💥💥 ERROR CRÍTICO - PEDIDO NO ENCONTRADO 💥💥💥');
        console.log('════════════════════════════════════════════════════════════════════════════════');
        console.log(`❌ CÓDIGO DE PEDIDO NO SE ENCONTRÓ INFORMACIÓN: ${CODIGO_PEDIDO}`);
        console.log('🛑 FINALIZANDO TEST - No se puede continuar sin el pedido');
        console.log('════════════════════════════════════════════════════════════════════════════════\n');
        throw new Error(`Código de pedido no se encontró información: ${CODIGO_PEDIDO}`);
    }

    // Si llegamos aquí, continuar con los demás pasos
    await executeStep('Registrar activación', async () => {
        console.log('📝 Registrando activación...');
        await wincorePage.registrarActivacion(CODIGO_PEDIDO);
        console.log('✅ Activación registrada correctamente');
    });

    await executeStep('Seleccionar contrata', async () => {
        console.log('🏢 Seleccionando contrata...');
        await wincorePage.seleccionarContrata();
        console.log('✅ Contrata seleccionada correctamente');
    });

    await executeStep('Ingresar MAC y serial', async () => {
        console.log(`💾 Ingresando MAC: ${MAC_ADDRESS}`);
        await wincorePage.ingresarMacYSerial(MAC_ADDRESS);
        console.log('✅ MAC y Serial ingresados correctamente');
    });

    // ========== ⭐ NUEVA POSICIÓN: PROCESAR SVA DESPUÉS DE INGRESAR MAC ⭐ ==========
    await executeStep('Procesar SVA', async () => {
        console.log('🔧 Procesando SVA...');
        await wincorePage.procesarSVASimple();
        console.log('✅ SVA procesados correctamente');
    });

    await executeStep('Buscar y seleccionar CTO', async () => {
        console.log('🏗️ Buscando CTO/NAP...');
        await wincorePage.buscarYSeleccionarCTO();
        console.log('✅ CTO/NAP seleccionado correctamente');
    });

    await executeStep('Seleccionar puerto disponible', async () => {
        console.log('🔌 Seleccionando puerto disponible...');
        await wincorePage.seleccionarPuertoDisponible();
        console.log('✅ Puerto seleccionado correctamente');
    });

    await executeStep('Configurar potencia y activar ONT', async () => {
        console.log('⚡ Configurando potencia y activando ONT...');
        await wincorePage.configurarPotenciaYActivarONT();
        console.log('✅ ONT activado correctamente');
    });

    // === VALIDACIÓN DESPUÉS DEL MODAL ===
    console.log('\n🔍 INICIANDO VALIDACIÓN POST-ACTIVACIÓN');

    // Esperar un poco después del modal para que cargue la página
    await delay(5000);

    // Validar activación exitosa
    const validacionExitosa = await wincorePage.validarActivacionExitosaSimple();

    if (validacionExitosa) {
        console.log('✅ ACTIVACIÓN EXITOSA - Texto de validación encontrado');

        await executeStep('Presionar botón Instalado', async () => {
            await wincorePage.hacerClicEnInstalado();
        });

        // Esperar 1 minuto final
        await executeStep('Espera final de 1 minuto', async () => {
            console.log('⏰ Esperando 1 minuto antes de cerrar...');
            await delay(60000);
            console.log('✅ Espera completada');
        });

        console.log('🎉 FLUJO DE ACTIVACIÓN COMPLETADO EXITOSAMENTE');

    } else {
        console.log('❌ ACTIVACIÓN FALLIDA - No se encontró el texto de validación');
        throw new Error('Activación fallida - No se encontró el texto de validación esperado');
    }

    console.log('════════════════════════════════════════════════════════════════════════════════\n');
  });
});