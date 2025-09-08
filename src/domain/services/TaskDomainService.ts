import { Task } from '../entities/index.js';
import { ITaskRepository } from '../repositories/index.js';


export interface TaskStatistics {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number; 
}

export class TaskDomainService {
  constructor(private readonly taskRepository: ITaskRepository) {}


  public async calculateStatistics(): Promise<TaskStatistics> {
    const allTasks = await this.taskRepository.findAll();
    
    const completed = allTasks.filter(task => task.completed).length;
    const incomplete = allTasks.length - completed;
    
    const completionRate = allTasks.length > 0 
      ? Math.round((completed / allTasks.length) * 100) 
      : 0;

    return {
      total: allTasks.length,
      completed,
      incomplete,
      completionRate
    };
  }


  public async findSimilarTasks(task: Task): Promise<Task[]> {
    const allTasks = await this.taskRepository.findAll();
    const taskTitle = task.title.toLowerCase();
    
    return allTasks.filter(t => {
      if (t.id === task.id) return false; 
      
      const otherTitle = t.title.toLowerCase();
      
    
      const titleWords = taskTitle.split(/\s+/);
      const otherWords = otherTitle.split(/\s+/);
      
      const commonWords = titleWords.filter(word => 
        word.length > 3 && otherWords.includes(word)
      );
      
      
      return commonWords.length >= 2;
    });
  }

 
  public async findDuplicateTasks(title: string): Promise<Task[]> {
    const searchTerm = title.trim().toLowerCase();
    const allTasks = await this.taskRepository.findAll();
    
    return allTasks.filter(task => 
      task.title.toLowerCase() === searchTerm
    );
  }
}