import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';

export class TestController {
  /**
   * Testa processamento de JSON pelo middleware
   * POST /test-json
   */
  public async testJson(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const response = {
      message: '✅ JSON middleware working perfectly!',
      receivedBody: req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      middleware: {
        jsonProcessing: 'OK',
        corsHeaders: 'OK',
        errorHandling: 'OK'
      },
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  }

  /**
   * Testa tratamento de erros pelo middleware
   * GET /test-error
   */
  public async testError(_req: ExtendedRequest, _res: ServerResponse): Promise<void> {
    // Simular diferentes tipos de erro
    const errorTypes = [
      () => { throw new Error('Generic test error for middleware validation') },
      () => { 
        const error = new Error('Not found test error') as any;
        error.statusCode = 404;
        error.name = 'NotFoundError';
        throw error;
      },
      () => {
        const error = new Error('Validation test error') as any;
        error.statusCode = 400;
        error.name = 'ValidationError';
        throw error;
      }
    ];

    // Escolher erro aleatório para testar
    const randomIndex = Math.floor(Math.random() * errorTypes.length);
    const randomError = errorTypes[randomIndex];
    
    if (randomError) {
      randomError();
    } else {
      throw new Error('Test error: could not select error type');
    }
  }

  /**
   * Testa informações de requisição
   * GET /test-request
   */
  public async testRequest(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const requestInfo = {
      message: '📋 Request information',
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      httpVersion: req.httpVersion,
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify(requestInfo, null, 2));
  }
}
