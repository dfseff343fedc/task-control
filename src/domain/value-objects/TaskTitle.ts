/**
 * Value Object para título de tarefa
 * - Validações de negócio
 * - Imutável
 * - Normalização automática
 */
export class TaskTitle {
  private readonly value: string;
  
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  constructor(value: string) {
    this.value = this.normalize(value);
    this.validate();
  }

  /**
   * Normaliza o título
   */
  private normalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Title must be a string');
    }
    
    return value.trim();
  }

  /**
   * Valida as regras de negócio do título
   */
  private validate(): void {
    if (!this.value) {
      throw new Error('Title is required');
    }

    if (this.value.length < TaskTitle.MIN_LENGTH) {
      throw new Error(`Title must have at least ${TaskTitle.MIN_LENGTH} characters`);
    }

    if (this.value.length > TaskTitle.MAX_LENGTH) {
      throw new Error(`Title must have at most ${TaskTitle.MAX_LENGTH} characters`);
    }

    // Não permitir apenas espaços em branco
    if (this.value.replace(/\s/g, '').length === 0) {
      throw new Error('Title cannot contain only whitespace');
    }

    // Validações adicionais de negócio
    const forbiddenPatterns = [
      /^TODO:?\s*/i, // Evitar prefixos redundantes
      /^TASK:?\s*/i
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(this.value)) {
        throw new Error('Title should not contain redundant prefixes like "TODO:" or "TASK:"');
      }
    }
  }

  /**
   * Retorna o valor do título
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Retorna versão resumida do título
   */
  public getShort(maxLength: number = 50): string {
    if (this.value.length <= maxLength) {
      return this.value;
    }
    
    return this.value.substring(0, maxLength - 3) + '...';
  }

  /**
   * Verifica se contém termo de busca
   */
  public contains(searchTerm: string): boolean {
    return this.value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  /**
   * Compara dois títulos
   */
  public equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Cria TaskTitle a partir de string
   */
  public static create(value: string): TaskTitle {
    return new TaskTitle(value);
  }
}
