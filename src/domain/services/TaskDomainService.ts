import { Task } from '../entities/index.js';
import { ITaskRepository } from '../repositories/index.js';

/**
 * Estatísticas simples de tarefas
 */
export interface TaskStatistics {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number; // Percentual de conclusão
}

/**
 * Serviço de domínio simplificado para tarefas
 */
export class TaskDomainService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * Calcula estatísticas simples das tarefas
   */
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

  /**
   * Busca tarefas similares baseado no título
   */
  public async findSimilarTasks(task: Task): Promise<Task[]> {
    const allTasks = await this.taskRepository.findAll();
    const taskTitle = task.title.toLowerCase();
    
    return allTasks.filter(t => {
      if (t.id === task.id) return false; // Não incluir a própria tarefa
      
      const otherTitle = t.title.toLowerCase();
      
      // Lógica simples de similaridade
      const titleWords = taskTitle.split(/\s+/);
      const otherWords = otherTitle.split(/\s+/);
      
      const commonWords = titleWords.filter(word => 
        word.length > 3 && otherWords.includes(word)
      );
      
      // Considera similar se têm pelo menos 2 palavras em comum
      return commonWords.length >= 2;
    });
  }

  /**
   * Verifica se há tarefas duplicadas (mesmo título)
   */
  public async findDuplicateTasks(title: string): Promise<Task[]> {
    const searchTerm = title.trim().toLowerCase();
    const allTasks = await this.taskRepository.findAll();
    
    return allTasks.filter(task => 
      task.title.toLowerCase() === searchTerm
    );
  }
}