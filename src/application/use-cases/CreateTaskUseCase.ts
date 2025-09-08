import { Task } from '../../domain/entities/index.js';
import { ITaskRepository } from '../../domain/repositories/index.js';
import { CreateTaskRequest, CreateTaskResponse } from '../dtos/index.js';


export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    this.validateRequest(request);

    const existingTasks = await this.taskRepository.searchByTerm(request.title.trim());
    const duplicateTask = existingTasks.find(task => 
      task.title.toLowerCase() === request.title.trim().toLowerCase()
    );

    if (duplicateTask) {
      throw new Error(`Task with title "${request.title}" already exists`);
    }

    const task = Task.create({
      title: request.title.trim(),
      description: request.description.trim()
    });

    await this.taskRepository.save(task);

    return this.mapToResponse(task);
  }


  private validateRequest(request: CreateTaskRequest): void {
    if (!request.title || request.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    if (request.title.trim().length < 3) {
      throw new Error('Title must have at least 3 characters');
    }

    if (request.title.trim().length > 200) {
      throw new Error('Title must have at most 200 characters');
    }

    if (request.description.trim().length > 1000) {
      throw new Error('Description must have at most 1000 characters');
    }
  }

 
  private mapToResponse(task: Task): CreateTaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    };
  }
}
