import { Task } from '../../domain/entities/index.js';
import { ITaskRepository } from '../../domain/repositories/index.js';
import { CreateTaskRequest, CreateTaskResponse } from '../dtos/index.js';

/**
 * Use Case para criar uma nova tarefa
 * 
 * Responsabilidades:
 * - Validar dados de entrada
 * - Criar entidade Task
 * - Persistir via repository
 * - Retornar resposta formatada
 */
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    // Validar entrada
    this.validateRequest(request);

    // Verificar se já existe tarefa com o mesmo título (opcional)
    const existingTasks = await this.taskRepository.searchByTerm(request.title.trim());
    const duplicateTask = existingTasks.find(task => 
      task.title.toLowerCase() === request.title.trim().toLowerCase()
    );

    if (duplicateTask) {
      throw new Error(`Task with title "${request.title}" already exists`);
    }

    // Criar nova tarefa
    const task = Task.create({
      title: request.title.trim(),
      description: request.description.trim()
    });

    // Persistir tarefa
    await this.taskRepository.save(task);

    // Retornar resposta
    return this.mapToResponse(task);
  }

  /**
   * Valida os dados da requisição
   */
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

  /**
   * Mapeia entidade para response DTO
   */
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
