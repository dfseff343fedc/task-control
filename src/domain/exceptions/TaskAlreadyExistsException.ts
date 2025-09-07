import { DomainException } from './DomainException.js';
import { TaskId } from '../value-objects/index.js';

/**
 * Exceção lançada quando há tentativa de criar tarefa que já existe
 */
export class TaskAlreadyExistsException extends DomainException {
  constructor(taskId: TaskId | string) {
    const id = typeof taskId === 'string' ? taskId : taskId.getValue();
    super(`Task with id '${id}' already exists`, 'TASK_ALREADY_EXISTS');
  }

  /**
   * Factory method para criar com TaskId
   */
  public static withId(taskId: TaskId): TaskAlreadyExistsException {
    return new TaskAlreadyExistsException(taskId);
  }

  /**
   * Factory method para criar com string ID
   */
  public static withStringId(id: string): TaskAlreadyExistsException {
    return new TaskAlreadyExistsException(id);
  }
}
