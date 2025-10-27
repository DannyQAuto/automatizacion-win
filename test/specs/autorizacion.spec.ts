import { test, expect } from '@playwright/test';

test.only('Autorización - Test exacto del curl', async ({ request }) => {
  // EXACTAMENTE los mismos datos del curl
  const requestBody = {
    method: "logserviciosnce.authont",
    params: {
      npedido: "205381",
      nserie: "485754438E6619A7",
      subida: "WIN_300MBPS_PLUS",
      bajada: "WIN_300MBPS_PLUS",
      vlan: "10",
      zona: "WIN",
      ticked: "b99a20873abf2089562eea0dde99d1c2.78789008c5dfbc2b59ce3ab526666821.c7a3247008d30afd73d9cd0312083fe9"
    }
  };

  console.log('📤 Enviando request IDÉNTICO al curl...');
  console.log('URL: http://10.23.100.27/frameservice/php/index.php');
  console.log('Body:', JSON.stringify(requestBody, null, 2));

  // Act - llamada IDÉNTICA al curl
  const response = await request.post('http://10.23.100.27/frameservice/php/index.php', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody
  });

  console.log('📥 Status de respuesta:', response.status());
  // Assert
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log('✅ Respuesta del servidor:');
  console.log(JSON.stringify(responseBody, null, 2));


});