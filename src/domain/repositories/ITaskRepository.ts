import { Task } from '../entities/index.js';

/**
 * Critérios de busca para tarefas
 */
export interface TaskSearchCriteria {
  completed?: boolean;
  search?: string; // Busca por título ou descrição
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Opções de ordenação
 */
export interface TaskSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
  direction: 'asc' | 'desc';
}

/**
 * Opções de paginação
 */
export interface TaskPaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Resultado paginado de tarefas
 */
export interface TaskPaginatedResult {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface do repositório de tarefas
 * 
 * Define o contrato para persistência de tarefas no domínio.
 * A implementação concreta ficará na camada de infrastructure.
 */
export interface ITaskRepository {
  /**
   * Salva uma nova tarefa
   */
  save(task: Task): Promise<void>;

  /**
   * Atualiza uma tarefa existente
   */
  update(task: Task): Promise<void>;

  /**
   * Busca tarefa por ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Busca tarefa por ID (lança exceção se não encontrar)
   */
  getById(id: string): Promise<Task>;

  /**
   * Remove uma tarefa
   */
  delete(id: string): Promise<boolean>;

  /**
   * Busca todas as tarefas
   */
  findAll(): Promise<Task[]>;

  /**
   * Busca tarefas com critérios
   */
  findByCriteria(criteria: TaskSearchCriteria): Promise<Task[]>;

  /**
   * Busca tarefas com paginação
   */
  findWithPagination(
    criteria?: TaskSearchCriteria,
    sort?: TaskSortOptions,
    pagination?: TaskPaginationOptions
  ): Promise<TaskPaginatedResult>;

  /**
   * Busca tarefas completadas
   */
  findCompleted(): Promise<Task[]>;

  /**
   * Busca tarefas não completadas
   */
  findIncomplete(): Promise<Task[]>;

  /**
   * Busca tarefas por termo de busca
   */
  searchByTerm(searchTerm: string): Promise<Task[]>;

  /**
   * Conta total de tarefas
   */
  count(): Promise<number>;

  /**
   * Verifica se existe tarefa com ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Remove todas as tarefas (cuidado!)
   */
  clear(): Promise<void>;
}
