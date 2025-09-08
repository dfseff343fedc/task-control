import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';
import { CreateTaskRequest } from '../../application/index.js';
import { QueryParamsUtils, UseCaseFactory } from '../../shared/index.js';

export class TaskController {
  // Não precisa de dependências injetadas!
  // Os use cases são criados sob demanda via factory



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

      // Executar use case (criado sob demanda)
      const result = await UseCaseFactory.getCreateTaskUseCase().execute(requestData);

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
  public async listTasks(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {
      // Extrai query parameters usando o utilitário
      const params = QueryParamsUtils.extractListTasksParams(req);
      
      
      
      const result = await UseCaseFactory.getListTasksUseCase().execute(params);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error listing tasks:', error);
      
      res.writeHead(500, { 'Content-Type': 'application/json' });
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
  public async updateTask(req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> {
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

      const result = await UseCaseFactory.getUpdateTaskUseCase().execute(taskId, req.body);
      res.writeHead(200);
      res.end(JSON.stringify(result));
      
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

      await UseCaseFactory.getDeleteTaskUseCase().execute(taskId);
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
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Task ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      const result = await UseCaseFactory.getToggleCompletedUseCase().execute({ id: taskId });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      
      if (error instanceof Error && error.message?.includes('not found')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Not Found',
          message: `Task with ID ${params?.id} not found`,
          statusCode: 404,
          timestamp: new Date().toISOString()
        }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Internal Server Error',
          message: 'Failed to toggle task completion',
          statusCode: 500,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }
}
