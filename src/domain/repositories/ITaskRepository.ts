import { Task } from '../entities/index.js';


export interface TaskSearchCriteria {
  completed?: boolean;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface TaskSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
  direction: 'asc' | 'desc';
}


export interface TaskPaginationOptions {
  page?: number;
  limit?: number;
}


export interface TaskPaginatedResult {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface ITaskRepository {

  save(task: Task): Promise<void>;


  update(task: Task): Promise<void>;


  findById(id: string): Promise<Task | null>;

  
  getById(id: string): Promise<Task>;

 
  delete(id: string): Promise<boolean>;

 
  findAll(): Promise<Task[]>;


  findByCriteria(criteria: TaskSearchCriteria): Promise<Task[]>;

  findWithPagination(
    criteria?: TaskSearchCriteria,
    sort?: TaskSortOptions,
    pagination?: TaskPaginationOptions
  ): Promise<TaskPaginatedResult>;


  findCompleted(): Promise<Task[]>;


  findIncomplete(): Promise<Task[]>;

 
  searchByTerm(searchTerm: string): Promise<Task[]>;


  count(): Promise<number>;

 
  exists(id: string): Promise<boolean>;

  
  clear(): Promise<void>;
}
