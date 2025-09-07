import { DomainException } from './DomainException.js';
import { TaskStatus } from '../value-objects/index.js';

/**
 * Exceção lançada quando há tentativa de transição inválida de estado
 */
export class InvalidTaskStateException extends DomainException {
  constructor(
    currentStatus: TaskStatus,
    targetStatus: TaskStatus,
    reason?: string
  ) {
    const message = reason 
      ? `Cannot transition from '${currentStatus.getDisplayName()}' to '${targetStatus.getDisplayName()}': ${reason}`
      : `Cannot transition from '${currentStatus.getDisplayName()}' to '${targetStatus.getDisplayName()}'`;
    
    super(message, 'INVALID_TASK_STATE_TRANSITION');
  }

  /**
   * Factory method para transição inválida
   */
  public static forTransition(
    from: TaskStatus, 
    to: TaskStatus, 
    reason?: string
  ): InvalidTaskStateException {
    return new InvalidTaskStateException(from, to, reason);
  }
}
