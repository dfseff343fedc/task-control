/**
 * Value Object para datas relacionadas a tarefas
 * - Imutável
 * - Validações de negócio para datas
 * - Métodos de conveniência para comparação
 */
export class TaskDate {
  private readonly value: Date;

  constructor(date?: Date | string | number) {
    this.value = this.parseDate(date);
    this.validate();
  }

  /**
   * Converte diferentes tipos para Date
   */
  private parseDate(date?: Date | string | number): Date {
    if (!date) {
      return new Date();
    }

    if (date instanceof Date) {
      return new Date(date.getTime()); // Clone para imutabilidade
    }

    const parsed = new Date(date);
    
    if (isNaN(parsed.getTime())) {
      throw new Error('Invalid date format');
    }

    return parsed;
  }

  /**
   * Valida a data
   */
  private validate(): void {
    if (isNaN(this.value.getTime())) {
      throw new Error('Invalid date');
    }
  }

  /**
   * Retorna o valor da data
   */
  public getValue(): Date {
    return new Date(this.value.getTime()); // Clone para imutabilidade
  }

  /**
   * Verifica se é data futura
   */
  public isFuture(): boolean {
    return this.value.getTime() > Date.now();
  }

  /**
   * Verifica se é data passada
   */
  public isPast(): boolean {
    return this.value.getTime() < Date.now();
  }

  /**
   * Verifica se é hoje
   */
  public isToday(): boolean {
    const today = new Date();
    return this.value.toDateString() === today.toDateString();
  }

  /**
   * Retorna diferença em dias para outra data
   */
  public daysDifference(other: TaskDate): number {
    const diffTime = this.value.getTime() - other.value.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se está vencido (considerando hora)
   */
  public isOverdue(): boolean {
    return this.isPast();
  }

  /**
   * Verifica se vence em breve (próximos N dias)
   */
  public isDueSoon(days: number = 7): boolean {
    if (this.isPast()) return false;
    
    const daysUntilDue = this.daysDifference(new TaskDate());
    return daysUntilDue <= days;
  }

  /**
   * Compara duas datas
   */
  public equals(other: TaskDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  /**
   * Verifica se é antes de outra data
   */
  public isBefore(other: TaskDate): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  /**
   * Verifica se é depois de outra data
   */
  public isAfter(other: TaskDate): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  /**
   * Formata a data para string
   */
  public format(locale: string = 'en-US'): string {
    return this.value.toLocaleDateString(locale);
  }

  /**
   * Formata data e hora para string
   */
  public formatDateTime(locale: string = 'en-US'): string {
    return this.value.toLocaleString(locale);
  }

  /**
   * Retorna ISO string
   */
  public toISOString(): string {
    return this.value.toISOString();
  }

  /**
   * Representação string
   */
  public toString(): string {
    return this.value.toISOString();
  }

  /**
   * Cria TaskDate para agora
   */
  public static now(): TaskDate {
    return new TaskDate();
  }

  /**
   * Cria TaskDate a partir de string ISO
   */
  public static fromISOString(iso: string): TaskDate {
    return new TaskDate(iso);
  }

  /**
   * Cria TaskDate a partir de timestamp
   */
  public static fromTimestamp(timestamp: number): TaskDate {
    return new TaskDate(timestamp);
  }
}
