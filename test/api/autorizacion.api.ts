import { APIRequestContext } from '@playwright/test';
import {
AutorizacionRequest,
AutorizacionResponse,
AutorizacionParams,
LiberarRequest,
LiberarResponse,
LiberarParams
} from '../types/autorizacion.types';

export class AutorizacionAPI {
private readonly baseURL = 'http://10.23.100.27/frameservice/php/index.php';
private readonly baseURL_AT = 'http://10.23.100.27/frameservice/php/index.php';

constructor(private request: APIRequestContext) {}

  async autorizar(params: AutorizacionParams): Promise<AutorizacionResponse> {
    const requestBody: AutorizacionRequest = {
      method: 'logserviciosnce.authont',
      params: params
    };

    const response = await this.request.post(this.baseURL, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody
    });

    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()}: ${await response.text()}`);
    }

    return await response.json();
  }

  async liberar(params: LiberarParams): Promise<LiberarResponse> {
    const requestBody: LiberarRequest = {
      method: 'logserviciosnce.unauth',
      params: params
    };

    console.log('🔓 Ejecutando liberación...');
    console.log('URL:', this.baseURL_AT);
    console.log('Body:', JSON.stringify(requestBody, null, 2));

    const response = await this.request.post(this.baseURL_AT, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody
    });

    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()}: ${await response.text()}`);
    }

    return await response.json();
  }
}