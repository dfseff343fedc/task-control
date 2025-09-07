import { createServer, IncomingMessage, ServerResponse } from 'node:http';

interface Route {
  method: string;
  path: RegExp;
  handler: (req: IncomingMessage, res: ServerResponse, params?: any) => Promise<void> | void;
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
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const { method = 'GET', url = '/' } = req;
        const routeMatch = this.findRoute(method, url);

        if (!routeMatch) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Route not found' }));
          return;
        }

        await routeMatch.route.handler(req, res, routeMatch.params);
      } catch (error) {
        console.error('Server Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
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
app.addRoute('GET', '/', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Hello World! 👋',
    project: 'Task Control API',
    version: '1.0.0',
    architecture: 'Domain-Driven Design',
    timestamp: new Date().toISOString()
  }));
});

// Rota de health check
app.addRoute('GET', '/health', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));
});

// Iniciar servidor
app.start().catch(console.error);