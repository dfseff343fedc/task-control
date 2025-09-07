import { IncomingMessage, ServerResponse } from 'node:http';

export interface ExtendedRequest extends IncomingMessage {
  body?: any;
}

export interface MiddlewareFunction {
  (req: ExtendedRequest, res: ServerResponse, next: () => void | Promise<void>): void | Promise<void>;
}

/**
 * Middleware para processar requisições JSON
 * - Processa o body da requisição convertendo stream para JSON
 * - Define headers de resposta padrão
 * - Adiciona validação de Content-Type
 */
export const jsonMiddleware: MiddlewareFunction = async (req: ExtendedRequest, res: ServerResponse, next) => {
  try {
    // Configurar headers de resposta padrão
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Processar body apenas para métodos que enviam dados
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    
    if (methodsWithBody.includes(req.method || '')) {
      const buffers: Buffer[] = [];
      
      // Ler dados do stream
      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const body = Buffer.concat(buffers).toString();

      // Tentar parsear como JSON
      if (body.trim()) {
        try {
          req.body = JSON.parse(body);
        } catch (parseError) {
          // Se não conseguir parsear, retornar erro 400
          res.writeHead(400);
          res.end(JSON.stringify({ 
            error: 'Invalid JSON format',
            message: 'Request body must be valid JSON'
          }));
          return;
        }
      } else {
        req.body = {};
      }
    } else {
      // Para métodos GET, DELETE, etc., não há body
      req.body = {};
    }

    // Continuar para próximo middleware/handler
    await next();

  } catch (error) {
    // Em caso de erro, passar para o middleware de tratamento de erro
    throw error;
  }
};
