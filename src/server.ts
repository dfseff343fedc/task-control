import { HttpServer, TaskRepository } from './infrastructure/http/index.js';
import { appRoutes, createTaskRoutes } from './presentation/routes/index.js';
import { CreateTaskUseCase } from './application/index.js';
import { TaskController } from './presentation/controllers/index.js';

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
    
    // Configurar dependências - Injeção manual (DI Container seria ideal)
    const database = server.getDatabase();
    const taskRepository = new TaskRepository(database);
    
    // Configurar use cases
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);
    
    // Configurar controllers
    const taskController = new TaskController(createTaskUseCase);

    // Registrar rotas da aplicação
    server.addRoutes(appRoutes);
    
    // Registrar rotas de tarefas
    const taskRoutes = createTaskRoutes(taskController);
    server.addRoutes(taskRoutes);

    // Exibir informações do servidor
    const serverInfo = server.getInfo();
    console.log('🔧 Server Configuration:');
    console.log(`   Port: ${serverInfo.port}`);
    console.log(`   Routes: ${serverInfo.routesCount}`);
    console.log(`   Architecture: Clean Architecture + DDD`);
    console.log('');

    // Iniciar servidor
    await server.start();
    
    console.log('✅ Task Control API is ready!');
    console.log('');
    console.log('📋 System endpoints:');
    console.log('   GET  /              - Hello World');
    console.log('   GET  /health        - Health check');
    console.log('   POST /test-json     - Test JSON middleware');
    console.log('   GET  /test-error    - Test error handling');
    console.log('   GET  /test-request  - Test request info');
    console.log('');
    console.log('🗄️  Database endpoints:');
    console.log('   GET    /database/info - Database information');
    console.log('   POST   /database/test - Test CRUD operations');
    console.log('   DELETE /database/test - Clean test data');
    console.log('');
    console.log('📝 Task endpoints (CRUD):');
    console.log('   POST   /tasks         - Create new task');
    console.log('   GET    /tasks         - List all tasks');
    console.log('   GET    /tasks/:id     - Get task by ID');
    console.log('   PUT    /tasks/:id     - Update task');
    console.log('   DELETE /tasks/:id     - Delete task');
    console.log('   PATCH  /tasks/:id/complete - Toggle task completion');

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