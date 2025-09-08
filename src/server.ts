import { HttpServer, TaskRepository } from './infrastructure/http/index.js';
import { createTaskRoutes } from './presentation/routes/index.js';
import { TaskController } from './presentation/controllers/index.js';
import { UseCaseFactory } from './shared/index.js';

/**
 * Task Control API Server
 * 
 * Ponto de entrada da aplicação seguindo arquitetura DDD:
 * - Domain: Lógica de negócio pura
 * - Application: Casos de uso e DTOs  
 * - Infrastructure: HTTP server, middlewares, repositórios
 * - Presentation: Controllers e definição de rotas
 */

async function bootstrap() {
  try {
    // Criar instância do servidor HTTP
    const server = new HttpServer(3333);
    
    // Configurar dependências
    const database = server.getDatabase();
    const taskRepository = new TaskRepository(database);
    
    // Configurar factory com repositório
    UseCaseFactory.setTaskRepository(taskRepository);
    
    // Configurar controllers (não precisa de dependências!)
    const taskController = new TaskController();
    
    // Registrar rotas de tarefas
    const taskRoutes = createTaskRoutes(taskController);
    server.addRoutes(taskRoutes);

    // Iniciar servidor
    await server.start();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Inicializar aplicação
bootstrap();