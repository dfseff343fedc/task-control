import { Task, TaskSnapshot } from '../entities/index.js';
import { TaskId, TaskStatus, TaskPriority } from '../value-objects/index.js';

/**
 * Critérios de busca para tarefas
 */
export interface TaskSearchCriteria {
  status?: string | string[];
  priority?: string | string[];
  search?: string; // Busca por título ou descrição
  dueDateBefore?: Date;
  dueDateAfter?: Date;
  createdAfter?: Date;
  createdBefore?: Date;
  isOverdue?: boolean;
  isDueSoon?: boolean; // Próximos 7 dias
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
  findById(id: TaskId): Promise<Task | null>;

  /**
   * Busca tarefa por ID (lança exceção se não encontrar)
   */
  getById(id: TaskId): Promise<Task>;

  /**
   * Remove uma tarefa
   */
  delete(id: TaskId): Promise<boolean>;

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
   * Busca tarefas por status
   */
  findByStatus(status: TaskStatus): Promise<Task[]>;

  /**
   * Busca tarefas por prioridade
   */
  findByPriority(priority: TaskPriority): Promise<Task[]>;

  /**
   * Busca tarefas vencidas
   */
  findOverdueTasks(): Promise<Task[]>;

  /**
   * Busca tarefas que vencem em breve
   */
  findDueSoonTasks(days?: number): Promise<Task[]>;

  /**
   * Busca tarefas por termo de busca
   */
  searchByTerm(searchTerm: string): Promise<Task[]>;

  /**
   * Conta total de tarefas
   */
  count(): Promise<number>;

  /**
   * Conta tarefas por status
   */
  countByStatus(status: TaskStatus): Promise<number>;

  /**
   * Verifica se existe tarefa com ID
   */
  exists(id: TaskId): Promise<boolean>;

  /**
   * Remove todas as tarefas (cuidado!)
   */
  clear(): Promise<void>;

  /**
   * Operações em lote
   */
  saveBatch(tasks: Task[]): Promise<void>;
  updateBatch(tasks: Task[]): Promise<void>;
  deleteBatch(ids: TaskId[]): Promise<number>; // Retorna quantidade removida
}
