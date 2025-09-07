/**
 * Value Object para descrição de tarefa
 * - Pode ser opcional (null/undefined)
 * - Validações de tamanho
 * - Normalização de conteúdo
 */
export class TaskDescription {
  private readonly value: string | null;
  
  private static readonly MAX_LENGTH = 2000;

  constructor(value?: string | null) {
    this.value = this.normalize(value);
    this.validate();
  }

  /**
   * Normaliza a descrição
   */
  private normalize(value?: string | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value !== 'string') {
      throw new Error('Description must be a string');
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

  /**
   * Valida as regras de negócio da descrição
   */
  private validate(): void {
    if (this.value !== null) {
      if (this.value.length > TaskDescription.MAX_LENGTH) {
        throw new Error(`Description must have at most ${TaskDescription.MAX_LENGTH} characters`);
      }
    }
  }

  /**
   * Verifica se a descrição existe
   */
  public hasValue(): boolean {
    return this.value !== null;
  }

  /**
   * Retorna o valor da descrição
   */
  public getValue(): string | null {
    return this.value;
  }

  /**
   * Retorna valor ou string padrão
   */
  public getValueOrDefault(defaultValue: string = 'No description provided'): string {
    return this.value ?? defaultValue;
  }

  /**
   * Retorna versão resumida da descrição
   */
  public getShort(maxLength: number = 100): string {
    if (!this.value) {
      return 'No description';
    }

    if (this.value.length <= maxLength) {
      return this.value;
    }
    
    return this.value.substring(0, maxLength - 3) + '...';
  }

  /**
   * Verifica se contém termo de busca
   */
  public contains(searchTerm: string): boolean {
    if (!this.value) {
      return false;
    }
    
    return this.value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  /**
   * Conta palavras na descrição
   */
  public getWordCount(): number {
    if (!this.value) {
      return 0;
    }
    
    return this.value.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Compara duas descrições
   */
  public equals(other: TaskDescription): boolean {
    return this.value === other.value;
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value ?? 'No description';
  }

  /**
   * Cria TaskDescription vazia
   */
  public static empty(): TaskDescription {
    return new TaskDescription();
  }

  /**
   * Cria TaskDescription a partir de string
   */
  public static create(value?: string): TaskDescription {
    return new TaskDescription(value);
  }
}
