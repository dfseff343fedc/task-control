import { asyncErrorHandler } from '../../infrastructure/http/index.js';
import { RouteDefinition } from '../../shared/types/index.js';
import { TaskController } from '../controllers/index.js';


export function createTaskRoutes(taskController: TaskController): RouteDefinition[] {
  return [
    {
      method: 'GET',
      path: '/health',
      handler: asyncErrorHandler(async (_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'ok', 
          service: 'task-control-api',
          timestamp: new Date().toISOString() 
        }));
      })
    },

    {
      method: 'POST',
      path: '/tasks',
      handler: asyncErrorHandler(taskController.createTask.bind(taskController))
    },

    {
      method: 'GET',
      path: '/tasks',
      handler: asyncErrorHandler(taskController.listTasks.bind(taskController))
    },

 

    {
      method: 'PUT',
      path: '/tasks/:id',
      handler: asyncErrorHandler(taskController.updateTask.bind(taskController))
    },

    {
      method: 'DELETE',
      path: '/tasks/:id',
      handler: asyncErrorHandler(taskController.deleteTask.bind(taskController))
    },

    {
      method: 'PATCH',
      path: '/tasks/:id/complete',
      handler: asyncErrorHandler(taskController.toggleTaskComplete.bind(taskController))
    }
  ];
}
