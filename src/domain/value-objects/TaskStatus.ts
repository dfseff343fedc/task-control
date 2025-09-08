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

  private validate(): void {
    if (!Object.values(TaskStatusType).includes(this.value)) {
      throw new Error(`Invalid task status: ${this.value}`);
    }
  }

  public getValue(): TaskStatusType {
    return this.value;
  }

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

  public isActive(): boolean {
    return this.isPending() || this.isInProgress();
  }

  public isFinalized(): boolean {
    return this.isCompleted() || this.isCancelled();
  }

  public canTransitionTo(newStatus: TaskStatus): boolean {
    const transitions: Record<TaskStatusType, TaskStatusType[]> = {
      [TaskStatusType.PENDING]: [
        TaskStatusType.IN_PROGRESS, 
        TaskStatusType.CANCELLED
      ],
      [TaskStatusType.IN_PROGRESS]: [
        TaskStatusType.COMPLETED, 
        TaskStatusType.CANCELLED,
        TaskStatusType.PENDING
      ],
      [TaskStatusType.COMPLETED]: [
        TaskStatusType.PENDING
      ],
      [TaskStatusType.CANCELLED]: [
        TaskStatusType.PENDING
      ]
    };

    return transitions[this.value].includes(newStatus.getValue());
  }

  public getValidTransitions(): TaskStatusType[] {
    const transitions: Record<TaskStatusType, TaskStatusType[]> = {
      [TaskStatusType.PENDING]: [TaskStatusType.IN_PROGRESS, TaskStatusType.CANCELLED],
      [TaskStatusType.IN_PROGRESS]: [TaskStatusType.COMPLETED, TaskStatusType.CANCELLED, TaskStatusType.PENDING],
      [TaskStatusType.COMPLETED]: [TaskStatusType.PENDING],
      [TaskStatusType.CANCELLED]: [TaskStatusType.PENDING]
    };

    return transitions[this.value];
  }

  public getDisplayName(): string {
    const displayNames: Record<TaskStatusType, string> = {
      [TaskStatusType.PENDING]: 'Pending',
      [TaskStatusType.IN_PROGRESS]: 'In Progress',
      [TaskStatusType.COMPLETED]: 'Completed',
      [TaskStatusType.CANCELLED]: 'Cancelled'
    };

    return displayNames[this.value];
  }

  public equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

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

  public static fromString(value: string): TaskStatus {
    return new TaskStatus(value);
  }

  public static getAllTypes(): TaskStatusType[] {
    return Object.values(TaskStatusType);
  }
}
