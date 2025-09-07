import { Task } from '../entities/index.js';
import { TaskStatus, TaskPriority, TaskDate } from '../value-objects/index.js';
import { ITaskRepository } from '../repositories/index.js';

/**
 * Estatísticas de tarefas
 */
export interface TaskStatistics {
  total: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdue: number;
  dueSoon: number;
  completionRate: number; // Percentual de conclusão
  averageCompletionTime: number; // Em dias
}

/**
 * Análise de produtividade
 */
export interface ProductivityAnalysis {
  totalCompleted: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  averageDailyCompletion: number;
  averageWeeklyCompletion: number;
  overdueTasks: number;
  upcomingTasks: number;
  productivityTrend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Serviço de domínio para lógicas de negócio complexas relacionadas a tarefas
 * 
 * Responsabilidades:
 * - Calcular estatísticas e métricas
 * - Validações que envolvem múltiplas tarefas
 * - Análises de produtividade
 * - Regras de negócio que não cabem na entidade
 */
export class TaskDomainService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * Calcula estatísticas gerais das tarefas
   */
  public async calculateStatistics(): Promise<TaskStatistics> {
    const allTasks = await this.taskRepository.findAll();
    
    const stats: TaskStatistics = {
      total: allTasks.length,
      byStatus: {
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      overdue: 0,
      dueSoon: 0,
      completionRate: 0,
      averageCompletionTime: 0
    };

    if (allTasks.length === 0) {
      return stats;
    }

    let totalCompletionTime = 0;
    let completedTasksCount = 0;
    const now = TaskDate.now();

    for (const task of allTasks) {
      // Estatísticas por status
      const status = task.getStatus().getValue();
      stats.byStatus[status]++;

      // Estatísticas por prioridade
      const priority = task.getPriority().getValue();
      stats.byPriority[priority]++;

      // Tarefas vencidas
      if (task.isOverdue()) {
        stats.overdue++;
      }

      // Tarefas que vencem em breve
      if (task.isDueSoon()) {
        stats.dueSoon++;
      }

      // Tempo médio de conclusão
      if (task.getStatus().isCompleted() && task.getCompletedAt()) {
        const completionTime = task.getCreatedAt().daysDifference(task.getCompletedAt()!);
        totalCompletionTime += Math.abs(completionTime);
        completedTasksCount++;
      }
    }

    // Taxa de conclusão
    const completedAndCancelled = stats.byStatus.completed + stats.byStatus.cancelled;
    stats.completionRate = stats.total > 0 
      ? Math.round((stats.byStatus.completed / stats.total) * 100) 
      : 0;

    // Tempo médio de conclusão
    stats.averageCompletionTime = completedTasksCount > 0 
      ? Math.round(totalCompletionTime / completedTasksCount * 10) / 10
      : 0;

    return stats;
  }

  /**
   * Analisa produtividade do usuário
   */
  public async analyzeProductivity(): Promise<ProductivityAnalysis> {
    const allTasks = await this.taskRepository.findAll();
    const completedTasks = allTasks.filter(task => task.getStatus().isCompleted());
    
    const now = TaskDate.now();
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedToday = completedTasks.filter(task => {
      const completedAt = task.getCompletedAt();
      return completedAt && completedAt.isToday();
    });

    const completedThisWeek = completedTasks.filter(task => {
      const completedAt = task.getCompletedAt();
      return completedAt && completedAt.getValue() >= startOfWeek;
    });

    const completedThisMonth = completedTasks.filter(task => {
      const completedAt = task.getCompletedAt();
      return completedAt && completedAt.getValue() >= startOfMonth;
    });

    // Análise de tendência (simplificada)
    const completedLastWeek = completedTasks.filter(task => {
      const completedAt = task.getCompletedAt()?.getValue();
      if (!completedAt) return false;
      
      const lastWeekStart = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
      return completedAt >= lastWeekStart && completedAt < startOfWeek;
    });

    let productivityTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (completedThisWeek.length > completedLastWeek.length) {
      productivityTrend = 'increasing';
    } else if (completedThisWeek.length < completedLastWeek.length) {
      productivityTrend = 'decreasing';
    }

    return {
      totalCompleted: completedTasks.length,
      completedToday: completedToday.length,
      completedThisWeek: completedThisWeek.length,
      completedThisMonth: completedThisMonth.length,
      averageDailyCompletion: Math.round((completedThisMonth.length / 30) * 10) / 10,
      averageWeeklyCompletion: Math.round((completedThisMonth.length / 4) * 10) / 10,
      overdueTasks: allTasks.filter(task => task.isOverdue()).length,
      upcomingTasks: allTasks.filter(task => task.isDueSoon()).length,
      productivityTrend
    };
  }

  /**
   * Valida se é possível deletar uma tarefa
   */
  public canDeleteTask(task: Task): { canDelete: boolean; reason?: string } {
    // Regra de negócio: tarefas em progresso não podem ser deletadas
    if (task.getStatus().isInProgress()) {
      return {
        canDelete: false,
        reason: 'Cannot delete task in progress. Complete or cancel it first.'
      };
    }

    // Outras regras de negócio podem ser adicionadas aqui
    return { canDelete: true };
  }

  /**
   * Sugere prioridade baseada em data de vencimento
   */
  public suggestPriorityBasedOnDueDate(dueDate: TaskDate | null): TaskPriority {
    if (!dueDate) {
      return TaskPriority.medium();
    }

    const daysUntilDue = dueDate.daysDifference(TaskDate.now());

    if (daysUntilDue < 0) {
      // Já vencida
      return TaskPriority.urgent();
    } else if (daysUntilDue <= 1) {
      // Vence hoje ou amanhã
      return TaskPriority.high();
    } else if (daysUntilDue <= 7) {
      // Vence na próxima semana
      return TaskPriority.medium();
    } else {
      // Vence em mais de uma semana
      return TaskPriority.low();
    }
  }

  /**
   * Encontra tarefas similares baseado no título
   */
  public async findSimilarTasks(task: Task): Promise<Task[]> {
    const allTasks = await this.taskRepository.findAll();
    const taskTitle = task.getTitle().getValue().toLowerCase();
    
    return allTasks.filter(t => {
      if (t.equals(task)) return false; // Não incluir a própria tarefa
      
      const otherTitle = t.getTitle().getValue().toLowerCase();
      
      // Lógica simples de similaridade - pode ser melhorada
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
      task.getTitle().getValue().toLowerCase() === searchTerm
    );
  }

  /**
   * Calcula prioridade sugerida baseada em múltiplos fatores
   */
  public calculateSuggestedPriority(
    dueDate: TaskDate | null,
    existingTasksCount: number,
    hasKeywords: boolean = false
  ): TaskPriority {
    let score = 2; // Medium por padrão

    // Fator data de vencimento
    if (dueDate) {
      const daysUntilDue = dueDate.daysDifference(TaskDate.now());
      if (daysUntilDue < 0) score += 2;      // Vencida
      else if (daysUntilDue <= 1) score += 1.5; // Vence em 1 dia
      else if (daysUntilDue <= 7) score += 0.5; // Vence em 1 semana
      else if (daysUntilDue > 30) score -= 0.5; // Vence em mais de 1 mês
    }

    // Fator carga de trabalho
    if (existingTasksCount > 20) score -= 0.5; // Muitas tarefas
    else if (existingTasksCount < 5) score += 0.5; // Poucas tarefas

    // Fator palavras-chave importantes
    if (hasKeywords) score += 0.5;

    // Converter score para prioridade
    if (score >= 3.5) return TaskPriority.urgent();
    if (score >= 2.5) return TaskPriority.high();
    if (score >= 1.5) return TaskPriority.medium();
    return TaskPriority.low();
  }
}
