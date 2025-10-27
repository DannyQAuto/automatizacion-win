import { test, expect } from '@playwright/test';
import { AutorizacionAPI } from '../api/autorizacion.api';
import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';
import * as mysql from 'mysql2/promise';

// Función para generar número de pedido automático de 7 dígitos
function generarNumeroPedido(): string {
  let npedido = '';
  for (let i = 0; i < 7; i++) {
    npedido += Math.floor(Math.random() * 10).toString();
  }
  return npedido;
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
      timestamp: new Date().toISOString(),
      descripcion: "Número de serie de ONT actualizado"
    };
    fs.writeFileSync(ncFilePath, JSON.stringify(ncData, null, 2), 'utf8');
    console.log(`✅ NC guardada en: ${ncFilePath}`);
  } catch (error) {
    console.log('❌ Error al guardar el archivo nc.json:', error);
  }
}

// Función para validar el formato de la NC
function validarNC(nc: string): boolean {
  return /^[0-9A-Fa-f]{16}$/.test(nc);
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
    acquireTimeout: 60000,
    timeout: 60000
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

test.describe('Flujo completo Liberación - Autorización - Liberación', () => {
  test.only('debería ejecutar liberación, autorización y luego liberación nuevamente', async ({ request }) => {
    test.setTimeout(600000);

    // === GENERAR NÚMERO DE PEDIDO AUTOMÁTICO ===
    const npedido = generarNumeroPedido();
    console.log(`🎯 NÚMERO DE PEDIDO GENERADO: ${npedido}`);

    // === CONFIGURACIÓN INTERACTIVA DE NC ===
    console.log('\n🎯 CONFIGURACIÓN DE NÚMERO DE SERIE (NC)');

    const ncActual = cargarNC();
    if (ncActual) {
      console.log(`📋 NC actual guardada: ${ncActual}`);
    } else {
      console.log('📋 No hay NC guardada previamente');
    }

    let nserieFinal: string;

    const respuesta = readlineSync.question('¿Desea cambiar la NC o usar una nueva? (1: Sí, 2: No): ');

    if (respuesta.trim() === '1') {
      console.log('\n🔄 MODIFICACIÓN DE NC');

      let ncValida = false;
      while (!ncValida) {
        const nuevaNC = readlineSync.question('Escriba la nueva NC (ej: 485754430E7289A9): ');

        if (validarNC(nuevaNC.trim())) {
          nserieFinal = nuevaNC.trim().toUpperCase();
          guardarNC(nserieFinal);
          console.log(`✅ Nueva NC configurada: ${nserieFinal}`);
          ncValida = true;
        } else {
          console.log('❌ Formato de NC inválido. Debe ser 16 caracteres hexadecimales (ej: 485754430E7289A9)');
        }
      }
    } else if (respuesta.trim() === '2' && ncActual) {
      nserieFinal = ncActual;
      console.log(`✅ Usando NC existente: ${nserieFinal}`);
    } else {
      if (!ncActual) {
        console.log('❌ No hay NC guardada y seleccionó no ingresar una nueva. Saliendo...');
        return;
      }
      nserieFinal = ncActual;
      console.log(`✅ Usando NC por defecto: ${nserieFinal}`);
    }

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
    await delay(2 * 60 * 1000);

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

    // PROCESAR Y GUARDAR LA POTENCIA
    if (responseBody && responseBody.data && responseBody.data.potencia_ont !== undefined) {
      const potenciaProcesada = procesarYGuardarPotencia(responseBody.data.potencia_ont);
      console.log(`🔋 Potencia procesada y guardada: ${potenciaProcesada}`);
    } else {
      console.log('❌ No se encontró potencia_ont en la respuesta.data');
    }

    // === TERCERA FASE: LIBERACIÓN FINAL ===
    console.log('\n🔄 INICIANDO TERCERA FASE: LIBERACIÓN FINAL');

    // ESPERA DE 2 MINUTOS DESPUÉS DE AUTORIZACIÓN
    console.log('⏰ Esperando 2 minutos después de la autorización...');
    await delay(2 * 60 * 1000);

    // TERCERA LIBERACIÓN (después de autorización)
    console.log('🕒 Ejecutando TERCERA liberación (después de autorización)...');
    const terceraLiberacion = await autorizacionAPI.liberar(liberarData);
    console.log('✅ Respuesta de TERCERA liberación:');
    console.log(JSON.stringify(terceraLiberacion, null, 2));

    // ESPERA DE 2 MINUTOS
    console.log('⏰ Esperando 2 minutos antes de la CUARTA liberación...');
    await delay(2 * 60 * 1000);

    // CUARTA LIBERACIÓN (final)
    console.log('🕒 Ejecutando CUARTA liberación (final)...');
    const cuartaLiberacion = await autorizacionAPI.liberar(liberarData);
    console.log('✅ Respuesta de CUARTA liberación:');
    console.log(JSON.stringify(cuartaLiberacion, null, 2));

    console.log('\n🎉 FLUJO COMPLETADO EXITOSAMENTE');
    console.log(`📝 Número de pedido utilizado: ${npedido}`);
  });
});

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