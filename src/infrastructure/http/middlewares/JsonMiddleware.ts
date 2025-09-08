import { IncomingMessage, ServerResponse } from 'node:http';

export interface ExtendedRequest extends IncomingMessage {
  body?: any;
}

export interface MiddlewareFunction {
  (req: ExtendedRequest, res: ServerResponse, next: () => void | Promise<void>): void | Promise<void>;
}


export const jsonMiddleware: MiddlewareFunction = async (req: ExtendedRequest, res: ServerResponse, next) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    
    if (methodsWithBody.includes(req.method || '')) {
      const buffers: Buffer[] = [];
      
      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const body = Buffer.concat(buffers).toString();

      if (body.trim()) {
        try {
          req.body = JSON.parse(body);
        } catch (parseError) {
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
      req.body = {};
    }

    await next();

  } catch (error) {

    throw error;
  }
};
