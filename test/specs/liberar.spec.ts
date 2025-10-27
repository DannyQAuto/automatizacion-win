import { test, expect } from '@playwright/test';
import { AutorizacionAPI } from '../api/autorizacion.api';

test.describe('Liberación - FrameServiceAT', () => {
  test.only('debería liberar correctamente una ONT', async ({ request }) => {
    // Arrange
    const autorizacionAPI = new AutorizacionAPI(request);

    const liberarData = {
      nserie: "485754438E6619A7",
      ticked: "b99a20873abf2089562eea0dde99d1c2.78789008c5dfbc2b59ce3ab526666821.c7a3247008d30afd73d9cd0312083fe9"
    };

    // Act
    const response = await autorizacionAPI.liberar(liberarData);

    // Assert
    console.log('✅ Respuesta de liberación:');
    console.log(JSON.stringify(response, null, 2));


  });
});