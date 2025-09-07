import { createServer, Server, ServerResponse } from 'node:http';
import { 
  jsonMiddleware, 
  errorMiddleware, 
  type ExtendedRequest 
} from './middlewares/index.js';
import { Route, RouteDefinition } from '../../shared/types/index.js';

export class HttpServer {
  private routes: Route[] = [];
  private server?: Server;
  private readonly port: number;

  constructor(port: number = 3333) {
    this.port = port;
  }

  /**
   * Adiciona uma rota ao servidor
   */
  public addRoute(routeDefinition: RouteDefinition): void {
    const pathRegex = this.buildRoutePath(routeDefinition.path);
    this.routes.push({
      method: routeDefinition.method.toUpperCase(),
      path: pathRegex,
      handler: routeDefinition.handler
    });
  }

  /**
   * Adiciona múltiplas rotas de uma vez
   */
  public addRoutes(routeDefinitions: RouteDefinition[]): void {
    routeDefinitions.forEach(route => this.addRoute(route));
  }

  /**
   * Constrói regex para matching de rotas com parâmetros
   */
  private buildRoutePath(path: string): RegExp {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)');
    return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);
  }

  /**
   * Encontra rota correspondente à requisição
   */
  private findRoute(method: string, url: string): { route: Route; params: any } | null {
    const route = this.routes.find(route => 
      route.method === method && route.path.test(url)
    );

    if (!route) return null;

    const match = url.match(route.path);
    const params = match?.groups || {};

    return { route, params };
  }

  /**
   * Manipula requisições HTTP
   */
  private async handleRequest(req: ExtendedRequest, res: ServerResponse): Promise<void> {
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

        // Executar handler da rota
        await routeMatch.route.handler(req, res, routeMatch.params);
      });
    } catch (error) {
      // Aplicar middleware de tratamento de erro
      errorMiddleware(error as any, req, res);
    }
  }

  /**
   * Inicia o servidor HTTP
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = createServer((req, res) => {
          this.handleRequest(req as ExtendedRequest, res).catch(error => {
            console.error('Unhandled request error:', error);
          });
        });

        this.server.listen(this.port, () => {
          console.log(`🚀 Server running at http://localhost:${this.port}`);
          console.log(`📋 Routes registered: ${this.routes.length}`);
          resolve();
        });

        this.server.on('error', (error) => {
          console.error('❌ Server error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Para o servidor HTTP
   */
  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          console.log('🛑 Server stopped');
          resolve();
        }
      });
    });
  }

  /**
   * Retorna informações do servidor
   */
  public getInfo() {
    return {
      port: this.port,
      routesCount: this.routes.length,
      running: !!this.server?.listening
    };
  }
}
