import { DomainException } from './DomainException.js';
import { TaskId } from '../value-objects/index.js';

/**
 * Exceção lançada quando uma tarefa não é encontrada
 */
export class TaskNotFoundException extends DomainException {
  constructor(taskId: TaskId | string) {
    const id = typeof taskId === 'string' ? taskId : taskId.getValue();
    super(`Task with id '${id}' was not found`, 'TASK_NOT_FOUND');
  }

  /**
   * Factory method para criar com TaskId
   */
  public static withId(taskId: TaskId): TaskNotFoundException {
    return new TaskNotFoundException(taskId);
  }

  /**
   * Factory method para criar com string ID
   */
  public static withStringId(id: string): TaskNotFoundException {
    return new TaskNotFoundException(id);
  }
}
