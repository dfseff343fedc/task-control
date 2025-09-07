import { createServer, ServerResponse } from 'node:http';
import { 
  jsonMiddleware, 
  errorMiddleware, 
  asyncErrorHandler, 
  type ExtendedRequest 
} from './infrastructure/http/middlewares/index.js';

interface Route {
  method: string;
  path: RegExp;
  handler: (req: ExtendedRequest, res: ServerResponse, params?: any) => Promise<void> | void;
}

class HttpServer {
  private routes: Route[] = [];
  private readonly port: number;

  constructor(port: number = 3333) {
    this.port = port;
  }

  public addRoute(method: string, path: string, handler: Route['handler']): void {
    const pathRegex = this.buildRoutePath(path);
    this.routes.push({
      method: method.toUpperCase(),
      path: pathRegex,
      handler
    });
  }

  private buildRoutePath(path: string): RegExp {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)');
    return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
  }

  private findRoute(method: string, url: string): { route: Route; params: any } | null {
    const route = this.routes.find(route => 
      route.method === method && route.path.test(url)
    );

    if (!route) return null;

    const match = url.match(route.path);
    const params = match?.groups || {};

    return { route, params };
  }

  public async start(): Promise<void> {
    const server = createServer(async (req: ExtendedRequest, res: ServerResponse) => {
      try {
        // Aplicar middleware JSON
        await jsonMiddleware(req, res, async () => {
          const { method = 'GET', url = '/' } = req;
          const routeMatch = this.findRoute(method, url);

          if (!routeMatch) {
            res.writeHead(404);
            res.end(JSON.stringify({ 
              error: 'Route not found',
              message: `Route ${method} ${url} not found`,
              statusCode: 404,
              timestamp: new Date().toISOString()
            }));
            return;
          }

          // Executar handler com tratamento de erro
          await routeMatch.route.handler(req, res, routeMatch.params);
        });
      } catch (error) {
        // Aplicar middleware de tratamento de erro
        errorMiddleware(error as any, req, res);
      }
    });

    server.listen(this.port, () => {
      console.log(`🚀 Server running at http://localhost:${this.port}`);
    });
  }
}

// Criando instância do servidor
const app = new HttpServer(3333);

// Rota Hello World
app.addRoute('GET', '/', asyncErrorHandler(async (_req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ 
    message: 'Hello World! 👋',
    project: 'Task Control API',
    version: '1.0.0',
    architecture: 'Domain-Driven Design with Middlewares',
    features: [
      'TypeScript strict mode',
      'Clean Architecture',
      'Custom JSON middleware',
      'Error handling middleware',
      'CORS support'
    ],
    timestamp: new Date().toISOString()
  }));
}));

// Rota de health check
app.addRoute('GET', '/health', asyncErrorHandler(async (_req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ 
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  }));
}));

// Rota para testar processamento de JSON (POST)
app.addRoute('POST', '/test-json', asyncErrorHandler(async (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ 
    message: 'JSON middleware working!',
    receivedBody: req.body,
    bodyType: typeof req.body,
    timestamp: new Date().toISOString()
  }));
}));

// Rota para testar erro (desenvolvimento)
app.addRoute('GET', '/test-error', asyncErrorHandler(async (_req, _res) => {
  throw new Error('This is a test error to validate error middleware');
}));

// Iniciar servidor
app.start().catch(console.error);