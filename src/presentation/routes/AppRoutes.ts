import { asyncErrorHandler } from '../../infrastructure/http/index.js';
import { RouteDefinition } from '../../shared/types/index.js';
import { HealthController, HelloController, TestController } from '../controllers/index.js';

// Instanciar controllers
const healthController = new HealthController();
const helloController = new HelloController();
const testController = new TestController();

/**
 * Definições de rotas da aplicação
 */
export const appRoutes: RouteDefinition[] = [
  // Rota principal - Hello World
  {
    method: 'GET',
    path: '/',
    handler: asyncErrorHandler(helloController.getHello.bind(helloController))
  },

  // Health check
  {
    method: 'GET',
    path: '/health',
    handler: asyncErrorHandler(healthController.getHealth.bind(healthController))
  },

  // Rotas de teste para desenvolvimento
  {
    method: 'POST',
    path: '/test-json',
    handler: asyncErrorHandler(testController.testJson.bind(testController))
  },

  {
    method: 'GET',
    path: '/test-error',
    handler: asyncErrorHandler(testController.testError.bind(testController))
  },

  {
    method: 'GET',
    path: '/test-request',
    handler: asyncErrorHandler(testController.testRequest.bind(testController))
  }
];
