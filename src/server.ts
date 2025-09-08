import { HttpServer, TaskRepository } from './infrastructure/http/index.js';
import { createTaskRoutes } from './presentation/routes/index.js';
import { TaskController } from './presentation/controllers/index.js';
import { UseCaseFactory } from './shared/index.js';



async function bootstrap() {
  try {

    const server = new HttpServer(3333);
    

    const database = server.getDatabase();
    const taskRepository = new TaskRepository(database);
    

    UseCaseFactory.setTaskRepository(taskRepository);
    

    const taskController = new TaskController();
    

    const taskRoutes = createTaskRoutes(taskController);
    server.addRoutes(taskRoutes);


    await server.start();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});
bootstrap();