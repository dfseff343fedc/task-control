import { createServer, Server, ServerResponse } from 'node:http';
import { 
  jsonMiddleware, 
  errorMiddleware, 
  type ExtendedRequest 
} from './middlewares/index.js';
import { Route, RouteDefinition } from '../../shared/types/index.js';
import { JsonDatabase } from '../database/index.js';

export class HttpServer {
  private routes: Route[] = [];
  private server?: Server;
  private readonly port: number;
  private readonly database: JsonDatabase;

  constructor(port: number = 3333, databasePath?: string) {
    this.port = port;
    this.database = new JsonDatabase({ 
      filename: 'db.json',
      directory: databasePath || process.cwd()
    });
  }


  public addRoute(routeDefinition: RouteDefinition): void {
    const pathRegex = this.buildRoutePath(routeDefinition.path);
    this.routes.push({
      method: routeDefinition.method.toUpperCase(),
      path: pathRegex,
      handler: routeDefinition.handler
    });
  }

 
  public addRoutes(routeDefinitions: RouteDefinition[]): void {
    routeDefinitions.forEach(route => this.addRoute(route));
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

  
  private async handleRequest(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {

      (req as any).database = this.database;
      

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


        await routeMatch.route.handler(req, res, routeMatch.params);
      });
    } catch (error) {

      errorMiddleware(error as any, req, res);
    }
  }


  public async start(): Promise<void> {
    try {

      await this.database.initialize();
      
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
            

            const dbInfo = this.database.getInfo();
            console.log(`🗄️  Database: ${dbInfo.tables.length} tables, ${dbInfo.totalRecords} records`);
            
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
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }


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


  public getDatabase(): JsonDatabase {
    return this.database;
  }


  public getInfo() {
    return {
      port: this.port,
      routesCount: this.routes.length,
      running: !!this.server?.listening,
      database: this.database.getInfo()
    };
  }
}
