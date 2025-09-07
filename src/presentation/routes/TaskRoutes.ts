import { asyncErrorHandler } from '../../infrastructure/http/index.js';
import { RouteDefinition } from '../../shared/types/index.js';
import { TaskController } from '../controllers/index.js';

/**
 * Função para criar rotas de tarefas
 * Recebe uma instância do TaskController configurado
 */
export function createTaskRoutes(taskController: TaskController): RouteDefinition[] {
  return [
    // Criar nova tarefa
    {
      method: 'POST',
      path: '/tasks',
      handler: asyncErrorHandler(taskController.createTask.bind(taskController))
    },

    // Listar todas as tarefas
    {
      method: 'GET',
      path: '/tasks',
      handler: asyncErrorHandler(taskController.listTasks.bind(taskController))
    },

    // Buscar tarefa por ID
    {
      method: 'GET',
      path: '/tasks/:id',
      handler: asyncErrorHandler(taskController.getTaskById.bind(taskController))
    },

    // Atualizar tarefa
    {
      method: 'PUT',
      path: '/tasks/:id',
      handler: asyncErrorHandler(taskController.updateTask.bind(taskController))
    },

    // Remover tarefa
    {
      method: 'DELETE',
      path: '/tasks/:id',
      handler: asyncErrorHandler(taskController.deleteTask.bind(taskController))
    },

    // Alternar status de conclusão
    {
      method: 'PATCH',
      path: '/tasks/:id/complete',
      handler: asyncErrorHandler(taskController.toggleTaskComplete.bind(taskController))
    }
  ];
}
