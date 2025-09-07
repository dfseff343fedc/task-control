import { randomUUID } from 'node:crypto';

/**
 * Value Object para identificador único de tarefa
 * - Imutável
 * - Auto-validação  
 * - Geração automática de UUID v4
 */
export class TaskId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value || randomUUID();
    this.validate();
  }

  /**
   * Valida o formato do ID
   */
  private validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('TaskId must be a valid string');
    }

    if (this.value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }

    // Validação básica de UUID (opcional, mais flexível)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(this.value)) {
      throw new Error('TaskId must be a valid UUID format');
    }
  }

  /**
   * Retorna o valor do ID
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Compara dois TaskIds
   */
  public equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Gera novo TaskId
   */
  public static generate(): TaskId {
    return new TaskId();
  }

  /**
   * Cria TaskId a partir de string
   */
  public static fromString(value: string): TaskId {
    return new TaskId(value);
  }
}
