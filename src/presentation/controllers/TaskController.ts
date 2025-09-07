import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';
import { CreateTaskUseCase } from '../../application/index.js';
import { CreateTaskRequest } from '../../application/index.js';

export class TaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  /**
   * Cria uma nova tarefa
   * POST /tasks
   */
  public async createTask(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {
      // Validar se body existe
      if (!req.body) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Request body is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Extrair dados da requisição
      const requestData: CreateTaskRequest = {
        title: req.body.title,
        description: req.body.description
      };

      // Executar use case
      const result = await this.createTaskUseCase.execute(requestData);

      // Retornar sucesso
      res.writeHead(201);
      res.end(JSON.stringify(result));

    } catch (error) {
      console.error('Error creating task:', error);
      
      // Tratar diferentes tipos de erro
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      let statusCode = 500;
      
      // Erros de validação
      if (errorMessage.includes('required') || 
          errorMessage.includes('must have') ||
          errorMessage.includes('already exists')) {
        statusCode = 400;
      }

      res.writeHead(statusCode);
      res.end(JSON.stringify({
        error: statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
        message: errorMessage,
        statusCode,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Lista todas as tarefas
   * GET /tasks
   */
  public async listTasks(_req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {
      // TODO: Implementar ListTasksUseCase
      res.writeHead(200);
      res.end(JSON.stringify({
        message: 'List tasks endpoint - To be implemented',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error listing tasks:', error);
      
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to list tasks',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Busca tarefa por ID
   * GET /tasks/:id
   */
  public async getTaskById(_req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> {
    try {
      const taskId = params?.id;
      
      if (!taskId) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Task ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // TODO: Implementar GetTaskByIdUseCase
      res.writeHead(200);
      res.end(JSON.stringify({
        message: `Get task ${taskId} endpoint - To be implemented`,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting task:', error);
      
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to get task',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Atualiza uma tarefa
   * PUT /tasks/:id
   */
  public async updateTask(_req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> {
    try {
      const taskId = params?.id;
      
      if (!taskId) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Task ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // TODO: Implementar UpdateTaskUseCase
      res.writeHead(200);
      res.end(JSON.stringify({
        message: `Update task ${taskId} endpoint - To be implemented`,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to update task',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Remove uma tarefa
   * DELETE /tasks/:id
   */
  public async deleteTask(_req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> {
    try {
      const taskId = params?.id;
      
      if (!taskId) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Task ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // TODO: Implementar DeleteTaskUseCase
      res.writeHead(200);
      res.end(JSON.stringify({
        message: `Delete task ${taskId} endpoint - To be implemented`,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to delete task',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Alterna status de conclusão da tarefa
   * PATCH /tasks/:id/complete
   */
  public async toggleTaskComplete(_req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> {
    try {
      const taskId = params?.id;
      
      if (!taskId) {
        res.writeHead(400);
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Task ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // TODO: Implementar ToggleTaskCompleteUseCase
      res.writeHead(200);
      res.end(JSON.stringify({
        message: `Toggle complete task ${taskId} endpoint - To be implemented`,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to toggle task completion',
        statusCode: 500,
        timestamp: new Date().toISOString()
      }));
    }
  }
}
