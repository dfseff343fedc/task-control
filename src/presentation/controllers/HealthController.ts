import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';

export class HealthController {
  /**
   * Retorna status de saúde da aplicação
   * GET /health
   */
  public async getHealth(_req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const healthData = {
      status: 'OK',
      service: 'Task Control API',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env['NODE_ENV'] || 'development',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify(healthData, null, 2));
  }
}
