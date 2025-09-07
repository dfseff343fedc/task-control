import { DomainException } from './DomainException.js';

/**
 * Exceção lançada quando há falha na validação de dados da tarefa
 */
export class TaskValidationException extends DomainException {
  public readonly field?: string;
  public readonly validationErrors: string[];

  constructor(message: string, field?: string, errors: string[] = []) {
    super(message, 'TASK_VALIDATION_ERROR');
    this.field = field;
    this.validationErrors = errors;
  }

  /**
   * Factory method para erro de campo específico
   */
  public static forField(field: string, error: string): TaskValidationException {
    return new TaskValidationException(
      `Validation failed for field '${field}': ${error}`,
      field,
      [error]
    );
  }

  /**
   * Factory method para múltiplos erros
   */
  public static forMultipleErrors(errors: Record<string, string>): TaskValidationException {
    const errorList = Object.entries(errors).map(([field, error]) => `${field}: ${error}`);
    return new TaskValidationException(
      `Validation failed: ${errorList.join(', ')}`,
      undefined,
      errorList
    );
  }

  /**
   * Factory method para título inválido
   */
  public static invalidTitle(error: string): TaskValidationException {
    return this.forField('title', error);
  }

  /**
   * Factory method para descrição inválida
   */
  public static invalidDescription(error: string): TaskValidationException {
    return this.forField('description', error);
  }

  /**
   * Factory method para status inválido
   */
  public static invalidStatus(error: string): TaskValidationException {
    return this.forField('status', error);
  }

  /**
   * Factory method para prioridade inválida
   */
  public static invalidPriority(error: string): TaskValidationException {
    return this.forField('priority', error);
  }

  /**
   * Factory method para data inválida
   */
  public static invalidDate(field: string, error: string): TaskValidationException {
    return this.forField(field, error);
  }

  /**
   * Adiciona novo erro de validação
   */
  public addError(field: string, error: string): void {
    this.validationErrors.push(`${field}: ${error}`);
  }

  /**
   * Verifica se há erros para um campo específico
   */
  public hasErrorForField(field: string): boolean {
    return this.validationErrors.some(error => error.startsWith(`${field}:`));
  }

  /**
   * Retorna representação JSON com erros detalhados
   */
  public toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      validationErrors: this.validationErrors
    };
  }
}
