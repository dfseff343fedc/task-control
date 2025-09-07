import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';

export class HelloController {
  /**
   * Rota de boas-vindas da API
   * GET /
   */
  public async getHello(_req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const helloData = {
      message: 'Hello World! 👋',
      project: 'Task Control API',
      version: '1.0.0',
      architecture: 'Domain-Driven Design with Clean Architecture',
      features: [
        'TypeScript strict mode',
        'Clean Architecture layers separation',
        'Custom HTTP server with middlewares',
        'JSON processing middleware',
        'Error handling middleware',
        'CORS support',
        'Route parameter extraction',
        'Async error handling'
      ],
      layers: {
        domain: 'Business logic and entities',
        application: 'Use cases and DTOs',
        infrastructure: 'HTTP server, middlewares, repositories',
        presentation: 'Controllers and route definitions'
      },
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify(helloData, null, 2));
  }
}
