export class TaskDate {
  private readonly value: Date;

  constructor(date?: Date | string | number) {
    this.value = this.parseDate(date);
    this.validate();
  }

  private parseDate(date?: Date | string | number): Date {
    if (!date) {
      return new Date();
    }

    if (date instanceof Date) {
      return new Date(date.getTime());
    }

    const parsed = new Date(date);
    
    if (isNaN(parsed.getTime())) {
      throw new Error('Invalid date format');
    }

    return parsed;
  }

  private validate(): void {
    if (isNaN(this.value.getTime())) {
      throw new Error('Invalid date');
    }
  }

  public getValue(): Date {
    return new Date(this.value.getTime());
  }

  public isFuture(): boolean {
    return this.value.getTime() > Date.now();
  }

  public isPast(): boolean {
    return this.value.getTime() < Date.now();
  }

  public isToday(): boolean {
    const today = new Date();
    return this.value.toDateString() === today.toDateString();
  }

  public daysDifference(other: TaskDate): number {
    const diffTime = this.value.getTime() - other.value.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  public isOverdue(): boolean {
    return this.isPast();
  }

  public isDueSoon(days: number = 7): boolean {
    if (this.isPast()) return false;
    
    const daysUntilDue = this.daysDifference(new TaskDate());
    return daysUntilDue <= days;
  }

  public equals(other: TaskDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  public isBefore(other: TaskDate): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  public isAfter(other: TaskDate): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  public format(locale: string = 'en-US'): string {
    return this.value.toLocaleDateString(locale);
  }

  public formatDateTime(locale: string = 'en-US'): string {
    return this.value.toLocaleString(locale);
  }

  public toISOString(): string {
    return this.value.toISOString();
  }

  public toString(): string {
    return this.value.toISOString();
  }

  public static now(): TaskDate {
    return new TaskDate();
  }

  public static fromISOString(iso: string): TaskDate {
    return new TaskDate(iso);
  }

  public static fromTimestamp(timestamp: number): TaskDate {
    return new TaskDate(timestamp);
  }
}
