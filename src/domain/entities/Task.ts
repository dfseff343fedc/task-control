import {
  TaskId,
  TaskTitle,
  TaskDescription,
  TaskStatus,
  TaskStatusType,
  TaskPriority,
  TaskPriorityLevel,
  TaskDate
} from '../value-objects/index.js';

/**
 * Dados necessários para criar uma nova tarefa
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriorityLevel | string;
  dueDate?: Date | string;
}

/**
 * Dados para atualizar uma tarefa existente
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriorityLevel | string;
  dueDate?: Date | string;
}

/**
 * Representação serializada de uma tarefa
 */
export interface TaskSnapshot {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusType;
  priority: TaskPriorityLevel;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  dueDate: string | null;
}

/**
 * Entidade Task - Agregado raiz do domínio de tarefas
 * 
 * Responsabilidades:
 * - Manter consistência dos dados
 * - Aplicar regras de negócio
 * - Gerenciar transições de estado
 * - Validar operações
 */
export class Task {
  private readonly id: TaskId;
  private title: TaskTitle;
  private description: TaskDescription;
  private status: TaskStatus;
  private priority: TaskPriority;
  private readonly createdAt: TaskDate;
  private updatedAt: TaskDate;
  private completedAt: TaskDate | null;
  private dueDate: TaskDate | null;

  /**
   * Constructor privado - use factory methods
   */
  private constructor(
    id: TaskId,
    title: TaskTitle,
    description: TaskDescription,
    status: TaskStatus,
    priority: TaskPriority,
    createdAt: TaskDate,
    updatedAt: TaskDate,
    completedAt: TaskDate | null = null,
    dueDate: TaskDate | null = null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
    this.dueDate = dueDate;

    this.validateBusinessRules();
  }

  /**
   * Valida regras de negócio da entidade
   */
  private validateBusinessRules(): void {
    // Regra: tarefa completada deve ter data de conclusão
    if (this.status.isCompleted() && !this.completedAt) {
      throw new Error('Completed task must have completion date');
    }

    // Regra: tarefa não completada não deve ter data de conclusão
    if (!this.status.isCompleted() && this.completedAt) {
      throw new Error('Non-completed task cannot have completion date');
    }

    // Regra: data de criação não pode ser futura
    if (this.createdAt.isFuture()) {
      throw new Error('Creation date cannot be in the future');
    }

    // Regra: data de atualização não pode ser anterior à criação
    if (this.updatedAt.isBefore(this.createdAt)) {
      throw new Error('Update date cannot be before creation date');
    }
  }

  /**
   * Getters públicos
   */
  public getId(): TaskId {
    return this.id;
  }

  public getTitle(): TaskTitle {
    return this.title;
  }

  public getDescription(): TaskDescription {
    return this.description;
  }

  public getStatus(): TaskStatus {
    return this.status;
  }

  public getPriority(): TaskPriority {
    return this.priority;
  }

  public getCreatedAt(): TaskDate {
    return this.createdAt;
  }

  public getUpdatedAt(): TaskDate {
    return this.updatedAt;
  }

  public getCompletedAt(): TaskDate | null {
    return this.completedAt;
  }

  public getDueDate(): TaskDate | null {
    return this.dueDate;
  }

  /**
   * Atualiza informações da tarefa
   */
  public update(data: UpdateTaskData): void {
    let hasChanges = false;

    if (data.title && data.title !== this.title.getValue()) {
      this.title = TaskTitle.create(data.title);
      hasChanges = true;
    }

    if (data.description !== undefined) {
      const newDescription = TaskDescription.create(data.description);
      if (!this.description.equals(newDescription)) {
        this.description = newDescription;
        hasChanges = true;
      }
    }

    if (data.priority) {
      const newPriority = TaskPriority.fromString(data.priority.toString());
      if (!this.priority.equals(newPriority)) {
        this.priority = newPriority;
        hasChanges = true;
      }
    }

    if (data.dueDate !== undefined) {
      const newDueDate = data.dueDate ? new TaskDate(data.dueDate) : null;
      if (!this.areDatesEqual(this.dueDate, newDueDate)) {
        this.dueDate = newDueDate;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.updatedAt = TaskDate.now();
      this.validateBusinessRules();
    }
  }

  /**
   * Altera status da tarefa
   */
  public changeStatus(newStatus: TaskStatus): void {
    // Validar transição
    if (!this.status.canTransitionTo(newStatus)) {
      throw new Error(
        `Cannot transition from ${this.status.getDisplayName()} to ${newStatus.getDisplayName()}`
      );
    }

    const previousStatus = this.status;
    this.status = newStatus;

    // Gerenciar data de conclusão
    if (newStatus.isCompleted() && !previousStatus.isCompleted()) {
      this.completedAt = TaskDate.now();
    } else if (!newStatus.isCompleted() && previousStatus.isCompleted()) {
      this.completedAt = null;
    }

    this.updatedAt = TaskDate.now();
    this.validateBusinessRules();
  }

  /**
   * Marca tarefa como concluída
   */
  public complete(): void {
    this.changeStatus(TaskStatus.completed());
  }

  /**
   * Marca tarefa como cancelada
   */
  public cancel(): void {
    this.changeStatus(TaskStatus.cancelled());
  }

  /**
   * Inicia trabalho na tarefa
   */
  public startProgress(): void {
    this.changeStatus(TaskStatus.inProgress());
  }

  /**
   * Retorna tarefa para pending
   */
  public resetToPending(): void {
    this.changeStatus(TaskStatus.pending());
  }

  /**
   * Verifica se a tarefa está vencida
   */
  public isOverdue(): boolean {
    return this.dueDate !== null && 
           this.dueDate.isOverdue() && 
           this.status.isActive();
  }

  /**
   * Verifica se a tarefa vence em breve
   */
  public isDueSoon(days: number = 7): boolean {
    return this.dueDate !== null && 
           this.dueDate.isDueSoon(days) && 
           this.status.isActive();
  }

  /**
   * Calcula tempo decorrido desde a criação
   */
  public getAge(): number {
    return this.createdAt.daysDifference(TaskDate.now()) * -1;
  }

  /**
   * Verifica se contém termo de busca
   */
  public matches(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return this.title.contains(term) || this.description.contains(term);
  }

  /**
   * Compara duas datas (null-safe)
   */
  private areDatesEqual(date1: TaskDate | null, date2: TaskDate | null): boolean {
    if (date1 === null && date2 === null) return true;
    if (date1 === null || date2 === null) return false;
    return date1.equals(date2);
  }

  /**
   * Serializa a tarefa para snapshot
   */
  public toSnapshot(): TaskSnapshot {
    return {
      id: this.id.getValue(),
      title: this.title.getValue(),
      description: this.description.getValue(),
      status: this.status.getValue(),
      priority: this.priority.getValue(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      completedAt: this.completedAt?.toISOString() || null,
      dueDate: this.dueDate?.toISOString() || null
    };
  }

  /**
   * Verifica igualdade com outra tarefa
   */
  public equals(other: Task): boolean {
    return this.id.equals(other.id);
  }

  /**
   * Factory method: Cria nova tarefa
   */
  public static create(data: CreateTaskData): Task {
    const now = TaskDate.now();
    
    return new Task(
      TaskId.generate(),
      TaskTitle.create(data.title),
      TaskDescription.create(data.description),
      TaskStatus.pending(),
      TaskPriority.fromString(data.priority?.toString() || 'medium'),
      now, // createdAt
      now, // updatedAt
      null, // completedAt
      data.dueDate ? new TaskDate(data.dueDate) : null // dueDate
    );
  }

  /**
   * Factory method: Reconstrói tarefa a partir de snapshot
   */
  public static fromSnapshot(snapshot: TaskSnapshot): Task {
    return new Task(
      TaskId.fromString(snapshot.id),
      TaskTitle.create(snapshot.title),
      TaskDescription.create(snapshot.description),
      TaskStatus.fromString(snapshot.status),
      TaskPriority.fromString(snapshot.priority),
      TaskDate.fromISOString(snapshot.createdAt),
      TaskDate.fromISOString(snapshot.updatedAt),
      snapshot.completedAt ? TaskDate.fromISOString(snapshot.completedAt) : null,
      snapshot.dueDate ? TaskDate.fromISOString(snapshot.dueDate) : null
    );
  }
}
