import { randomUUID } from 'node:crypto';

/**
 * Dados necessários para criar uma nova tarefa
 */
export interface CreateTaskData {
  title: string;
  description: string;
}

/**
 * Dados para atualizar uma tarefa existente
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
}

/**
 * Entidade Task - Simples e focada
 * 
 * Campos baseados no projeto de exemplo:
 * - id, title, description, completed, createdAt, updatedAt
 */
export class Task {
  public readonly id: string;
  public title: string;
  public description: string;
  public completed: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    completed: boolean = false,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  /**
   * Validações básicas
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Description is required');
    }
  }

  /**
   * Atualiza informações da tarefa
   */
  public update(data: UpdateTaskData): void {
    if (data.title !== undefined) {
      this.title = data.title;
    }

    if (data.description !== undefined) {
      this.description = data.description;
    }

    this.updatedAt = new Date();
    this.validate();
  }

  /**
   * Alterna status de completada
   */
  public toggleComplete(): void {
    this.completed = !this.completed;
    this.updatedAt = new Date();
  }

  /**
   * Marca como completada
   */
  public markAsCompleted(): void {
    this.completed = true;
    this.updatedAt = new Date();
  }

  /**
   * Marca como não completada
   */
  public markAsIncomplete(): void {
    this.completed = false;
    this.updatedAt = new Date();
  }

  /**
   * Factory method: Cria nova tarefa
   */
  public static create(data: CreateTaskData): Task {
    return new Task(
      randomUUID(),
      data.title,
      data.description
    );
  }
}