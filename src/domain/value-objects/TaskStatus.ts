/**
 * Value Object para status de tarefa
 * - Enum de valores permitidos
 * - Transições válidas de estado
 * - Validações de negócio
 */
export enum TaskStatusType {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class TaskStatus {
  private readonly value: TaskStatusType;

  constructor(value: string | TaskStatusType) {
    this.value = this.parseStatus(value);
    this.validate();
  }

  /**
   * Converte string para TaskStatusType
   */
  private parseStatus(value: string | TaskStatusType): TaskStatusType {
    if (typeof value === 'string') {
      const normalizedValue = value.toLowerCase().trim();
      
      switch (normalizedValue) {
        case 'pending':
          return TaskStatusType.PENDING;
        case 'in_progress':
        case 'in-progress':
        case 'inprogress':
          return TaskStatusType.IN_PROGRESS;
        case 'completed':
        case 'done':
        case 'finished':
          return TaskStatusType.COMPLETED;
        case 'cancelled':
        case 'canceled':
          return TaskStatusType.CANCELLED;
        default:
          throw new Error(`Invalid task status: ${value}`);
      }
    }
    
    return value;
  }

  /**
   * Valida o status
   */
  private validate(): void {
    if (!Object.values(TaskStatusType).includes(this.value)) {
      throw new Error(`Invalid task status: ${this.value}`);
    }
  }

  /**
   * Retorna o valor do status
   */
  public getValue(): TaskStatusType {
    return this.value;
  }

  /**
   * Verifica se é status específico
   */
  public isPending(): boolean {
    return this.value === TaskStatusType.PENDING;
  }

  public isInProgress(): boolean {
    return this.value === TaskStatusType.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.value === TaskStatusType.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.value === TaskStatusType.CANCELLED;
  }

  /**
   * Verifica se a tarefa está ativa (não finalizada)
   */
  public isActive(): boolean {
    return this.isPending() || this.isInProgress();
  }

  /**
   * Verifica se a tarefa está finalizada
   */
  public isFinalized(): boolean {
    return this.isCompleted() || this.isCancelled();
  }

  /**
   * Valida se transição de status é permitida
   */
  public canTransitionTo(newStatus: TaskStatus): boolean {
    const transitions: Record<TaskStatusType, TaskStatusType[]> = {
      [TaskStatusType.PENDING]: [
        TaskStatusType.IN_PROGRESS, 
        TaskStatusType.CANCELLED
      ],
      [TaskStatusType.IN_PROGRESS]: [
        TaskStatusType.COMPLETED, 
        TaskStatusType.CANCELLED,
        TaskStatusType.PENDING // Permitir voltar para pending
      ],
      [TaskStatusType.COMPLETED]: [
        TaskStatusType.PENDING // Permitir reabrir tarefa
      ],
      [TaskStatusType.CANCELLED]: [
        TaskStatusType.PENDING // Permitir reativar tarefa cancelada
      ]
    };

    return transitions[this.value].includes(newStatus.getValue());
  }

  /**
   * Retorna próximos status válidos
   */
  public getValidTransitions(): TaskStatusType[] {
    const transitions: Record<TaskStatusType, TaskStatusType[]> = {
      [TaskStatusType.PENDING]: [TaskStatusType.IN_PROGRESS, TaskStatusType.CANCELLED],
      [TaskStatusType.IN_PROGRESS]: [TaskStatusType.COMPLETED, TaskStatusType.CANCELLED, TaskStatusType.PENDING],
      [TaskStatusType.COMPLETED]: [TaskStatusType.PENDING],
      [TaskStatusType.CANCELLED]: [TaskStatusType.PENDING]
    };

    return transitions[this.value];
  }

  /**
   * Retorna representação humanizada
   */
  public getDisplayName(): string {
    const displayNames: Record<TaskStatusType, string> = {
      [TaskStatusType.PENDING]: 'Pending',
      [TaskStatusType.IN_PROGRESS]: 'In Progress',
      [TaskStatusType.COMPLETED]: 'Completed',
      [TaskStatusType.CANCELLED]: 'Cancelled'
    };

    return displayNames[this.value];
  }

  /**
   * Compara dois status
   */
  public equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Factory methods para criação de status específicos
   */
  public static pending(): TaskStatus {
    return new TaskStatus(TaskStatusType.PENDING);
  }

  public static inProgress(): TaskStatus {
    return new TaskStatus(TaskStatusType.IN_PROGRESS);
  }

  public static completed(): TaskStatus {
    return new TaskStatus(TaskStatusType.COMPLETED);
  }

  public static cancelled(): TaskStatus {
    return new TaskStatus(TaskStatusType.CANCELLED);
  }

  /**
   * Cria TaskStatus a partir de string
   */
  public static fromString(value: string): TaskStatus {
    return new TaskStatus(value);
  }

  /**
   * Retorna todos os tipos de status disponíveis
   */
  public static getAllTypes(): TaskStatusType[] {
    return Object.values(TaskStatusType);
  }
}
