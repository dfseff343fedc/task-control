/**
 * Value Object para prioridade de tarefa
 * - Níveis de prioridade bem definidos
 * - Comparação numérica para ordenação  
 * - Validações e métodos de conveniência
 */
export enum TaskPriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  URGENT = 'urgent'
}

export class TaskPriority {
  private readonly value: TaskPriorityLevel;

  constructor(value: string | TaskPriorityLevel) {
    this.value = this.parsePriority(value);
    this.validate();
  }

  /**
   * Converte string para TaskPriorityLevel
   */
  private parsePriority(value: string | TaskPriorityLevel): TaskPriorityLevel {
    if (typeof value === 'string') {
      const normalizedValue = value.toLowerCase().trim();
      
      switch (normalizedValue) {
        case 'low':
        case 'baixa':
        case '1':
          return TaskPriorityLevel.LOW;
        case 'medium':
        case 'normal':
        case 'média':
        case '2':
          return TaskPriorityLevel.MEDIUM;
        case 'high':
        case 'alta':
        case '3':
          return TaskPriorityLevel.HIGH;
        case 'urgent':
        case 'urgente':
        case 'critical':
        case '4':
          return TaskPriorityLevel.URGENT;
        default:
          throw new Error(`Invalid task priority: ${value}`);
      }
    }
    
    return value;
  }

  /**
   * Valida a prioridade
   */
  private validate(): void {
    if (!Object.values(TaskPriorityLevel).includes(this.value)) {
      throw new Error(`Invalid task priority: ${this.value}`);
    }
  }

  /**
   * Retorna o valor da prioridade
   */
  public getValue(): TaskPriorityLevel {
    return this.value;
  }

  /**
   * Verifica se é prioridade específica
   */
  public isLow(): boolean {
    return this.value === TaskPriorityLevel.LOW;
  }

  public isMedium(): boolean {
    return this.value === TaskPriorityLevel.MEDIUM;
  }

  public isHigh(): boolean {
    return this.value === TaskPriorityLevel.HIGH;
  }

  public isUrgent(): boolean {
    return this.value === TaskPriorityLevel.URGENT;
  }

  /**
   * Retorna valor numérico para ordenação (maior = mais prioritário)
   */
  public getNumericValue(): number {
    const priorityValues: Record<TaskPriorityLevel, number> = {
      [TaskPriorityLevel.LOW]: 1,
      [TaskPriorityLevel.MEDIUM]: 2,
      [TaskPriorityLevel.HIGH]: 3,
      [TaskPriorityLevel.URGENT]: 4
    };

    return priorityValues[this.value];
  }

  /**
   * Compara duas prioridades (retorna -1, 0, 1)
   */
  public compareTo(other: TaskPriority): number {
    const thisValue = this.getNumericValue();
    const otherValue = other.getNumericValue();
    
    if (thisValue < otherValue) return -1;
    if (thisValue > otherValue) return 1;
    return 0;
  }

  /**
   * Verifica se é maior prioridade que outra
   */
  public isHigherThan(other: TaskPriority): boolean {
    return this.getNumericValue() > other.getNumericValue();
  }

  /**
   * Verifica se é menor prioridade que outra
   */
  public isLowerThan(other: TaskPriority): boolean {
    return this.getNumericValue() < other.getNumericValue();
  }

  /**
   * Retorna representação humanizada
   */
  public getDisplayName(): string {
    const displayNames: Record<TaskPriorityLevel, string> = {
      [TaskPriorityLevel.LOW]: 'Low Priority',
      [TaskPriorityLevel.MEDIUM]: 'Medium Priority',
      [TaskPriorityLevel.HIGH]: 'High Priority',
      [TaskPriorityLevel.URGENT]: 'Urgent'
    };

    return displayNames[this.value];
  }

  /**
   * Retorna emoji representativo
   */
  public getEmoji(): string {
    const emojis: Record<TaskPriorityLevel, string> = {
      [TaskPriorityLevel.LOW]: '🟢',
      [TaskPriorityLevel.MEDIUM]: '🟡', 
      [TaskPriorityLevel.HIGH]: '🟠',
      [TaskPriorityLevel.URGENT]: '🔴'
    };

    return emojis[this.value];
  }

  /**
   * Compara duas prioridades
   */
  public equals(other: TaskPriority): boolean {
    return this.value === other.value;
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Factory methods para criação de prioridades específicas
   */
  public static low(): TaskPriority {
    return new TaskPriority(TaskPriorityLevel.LOW);
  }

  public static medium(): TaskPriority {
    return new TaskPriority(TaskPriorityLevel.MEDIUM);
  }

  public static high(): TaskPriority {
    return new TaskPriority(TaskPriorityLevel.HIGH);
  }

  public static urgent(): TaskPriority {
    return new TaskPriority(TaskPriorityLevel.URGENT);
  }

  /**
   * Cria TaskPriority a partir de string
   */
  public static fromString(value: string): TaskPriority {
    return new TaskPriority(value);
  }

  /**
   * Retorna todos os níveis de prioridade disponíveis
   */
  public static getAllLevels(): TaskPriorityLevel[] {
    return Object.values(TaskPriorityLevel);
  }
}
