import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';
import { CreateTaskRequest } from '../../application/index.js';
import { QueryParamsUtils, UseCaseFactory } from '../../shared/index.js';

export class TaskController {
  

  public async createTask(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {
      
      
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

      
      
      const requestData: CreateTaskRequest = {
        title: req.body.title,
        description: req.body.description
      };

      
      
      const result = await UseCaseFactory.getCreateTaskUseCase().execute(requestData);

      
      
      res.writeHead(201);
      res.end(JSON.stringify(result));

    } catch (error) {
      console.error('Error creating task:', error);
      
      
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      let statusCode = 500;
      
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


  public async listTasks(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    try {
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

      const result = await UseCaseFactory.getDeleteTaskUseCase().execute({ id: taskId });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error('Error deleting task:', error);
      
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
          message: 'Failed to delete task',
          statusCode: 500,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }

  
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
