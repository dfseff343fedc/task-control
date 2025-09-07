import { HttpServer } from './infrastructure/http/index.js';
import { appRoutes } from './presentation/routes/index.js';

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

    // Registrar todas as rotas da aplicação
    server.addRoutes(appRoutes);

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
    console.log('📋 Available endpoints:');
    console.log('   GET  /           - Hello World');
    console.log('   GET  /health     - Health check');
    console.log('   POST /test-json  - Test JSON middleware');
    console.log('   GET  /test-error - Test error handling');
    console.log('   GET  /test-request - Test request info');

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