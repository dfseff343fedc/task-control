import { ITaskRepository } from '../../domain/index.js';
import { CreateTaskUseCase, ListTasksUseCase, ToggleCompletedUseCase, UpdateTaskUseCase, DeleteTaskUseCase   } from '../../application/index.js';

/**
 * Factory para criar use cases sob demanda
 */
export class UseCaseFactory {
  private static taskRepository: ITaskRepository;
  
  // Cache dos use cases
  private static createTaskUseCase?: CreateTaskUseCase;
  private static listTasksUseCase?: ListTasksUseCase;
  private static toggleCompletedUseCase?: ToggleCompletedUseCase;
  private static updateTaskUseCase?: UpdateTaskUseCase;
  private static deleteTaskUseCase?: DeleteTaskUseCase;
  public static setTaskRepository(repository: ITaskRepository): void {
    this.taskRepository = repository;
  }

  public static getCreateTaskUseCase(): CreateTaskUseCase {
    if (!this.createTaskUseCase) {
      this.createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
    }
    return this.createTaskUseCase;
  }

  public static getListTasksUseCase(): ListTasksUseCase {
    if (!this.listTasksUseCase) {
      this.listTasksUseCase = new ListTasksUseCase(this.taskRepository);
    }
    return this.listTasksUseCase;
  }

  public static getToggleCompletedUseCase(): ToggleCompletedUseCase {
    if (!this.toggleCompletedUseCase) {
      this.toggleCompletedUseCase = new ToggleCompletedUseCase(this.taskRepository);
    }
    return this.toggleCompletedUseCase;
  }

  public static getUpdateTaskUseCase(): UpdateTaskUseCase {
    if (!this.updateTaskUseCase) {
      this.updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
    }
    return this.updateTaskUseCase;
  }

  public static getDeleteTaskUseCase(): DeleteTaskUseCase {
    if (!this.deleteTaskUseCase) {
      this.deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
    }
    return this.deleteTaskUseCase;
  }
}
