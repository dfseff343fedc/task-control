import { Task } from '../../domain/entities/index.js';
import { 
  ITaskRepository, 
  TaskSearchCriteria, 
  TaskSortOptions, 
  TaskPaginationOptions, 
  TaskPaginatedResult 
} from '../../domain/repositories/index.js';
import { JsonDatabase } from '../database/index.js';

/**
 * Implementação do repositório de tarefas usando JsonDatabase
 */
export class TaskRepository implements ITaskRepository {
  private readonly tableName = 'tasks';

  constructor(private readonly database: JsonDatabase) {}

  /**
   * Salva uma nova tarefa
   */
  public async save(task: Task): Promise<void> {
    const taskData = {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    };

    await this.database.insert(this.tableName, taskData);
  }

  /**
   * Atualiza uma tarefa existente
   */
  public async update(task: Task): Promise<void> {
    const taskData = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      updatedAt: task.updatedAt.toISOString()
    };

    const updated = await this.database.update(this.tableName, task.id, taskData);
    
    if (!updated) {
      throw new Error(`Task with id ${task.id} not found for update`);
    }
  }

  /**
   * Busca tarefa por ID
   */
  public async findById(id: string): Promise<Task | null> {
    const results = this.database.select(this.tableName, { id });
    
    if (results.length === 0) {
      return null;
    }

    return this.mapToEntity(results[0]);
  }

  /**
   * Busca tarefa por ID (lança exceção se não encontrar)
   */
  public async getById(id: string): Promise<Task> {
    const task = await this.findById(id);
    
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return task;
  }

  /**
   * Remove uma tarefa
   */
  public async delete(id: string): Promise<boolean> {
    return await this.database.delete(this.tableName, id);
  }

  /**
   * Busca todas as tarefas
   */
  public async findAll(): Promise<Task[]> {
    const results = this.database.select(this.tableName);
    return results.map(data => this.mapToEntity(data));
  }

  /**
   * Busca tarefas com critérios
   */
  public async findByCriteria(criteria: TaskSearchCriteria): Promise<Task[]> {
    let results = this.database.select(this.tableName);

    // Filtrar por completed
    if (criteria.completed !== undefined) {
      results = results.filter(task => task.completed === criteria.completed);
    }

    // Filtrar por termo de busca (título ou descrição)
    if (criteria.search) {
      const searchTerm = criteria.search.toLowerCase();
      results = results.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por data de criação
    if (criteria.createdAfter) {
      const afterDate = criteria.createdAfter.toISOString();
      results = results.filter(task => task.createdAt >= afterDate);
    }

    if (criteria.createdBefore) {
      const beforeDate = criteria.createdBefore.toISOString();
      results = results.filter(task => task.createdAt <= beforeDate);
    }

    return results.map(data => this.mapToEntity(data));
  }

  /**
   * Busca tarefas com paginação
   */
  public async findWithPagination(
    criteria?: TaskSearchCriteria,
    sort?: TaskSortOptions,
    pagination?: TaskPaginationOptions
  ): Promise<TaskPaginatedResult> {
    let results = criteria 
      ? await this.findByCriteria(criteria)
      : await this.findAll();

    // Aplicar ordenação
    if (sort) {
      results = this.applySorting(results, sort);
    }

    // Aplicar paginação
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const total = results.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedResults,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Busca tarefas completadas
   */
  public async findCompleted(): Promise<Task[]> {
    return this.findByCriteria({ completed: true });
  }

  /**
   * Busca tarefas não completadas
   */
  public async findIncomplete(): Promise<Task[]> {
    return this.findByCriteria({ completed: false });
  }

  /**
   * Busca tarefas por termo de busca
   */
  public async searchByTerm(searchTerm: string): Promise<Task[]> {
    return this.findByCriteria({ search: searchTerm });
  }

  /**
   * Conta total de tarefas
   */
  public async count(): Promise<number> {
    const results = this.database.select(this.tableName);
    return results.length;
  }

  /**
   * Verifica se existe tarefa com ID
   */
  public async exists(id: string): Promise<boolean> {
    const task = await this.findById(id);
    return task !== null;
  }

  /**
   * Remove todas as tarefas
   */
  public async clear(): Promise<void> {
    await this.database.clear(this.tableName);
  }

  /**
   * Mapeia dados do database para entidade Task
   */
  private mapToEntity(data: any): Task {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.completed,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  /**
   * Aplica ordenação aos resultados
   */
  private applySorting(tasks: Task[], sort: TaskSortOptions): Task[] {
    return tasks.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
