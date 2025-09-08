import { randomUUID } from 'node:crypto';

export class TaskId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value || randomUUID();
    this.validate();
  }

  private validate(): void {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('TaskId must be a valid string');
    }

    if (this.value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(this.value)) {
      throw new Error('TaskId must be a valid UUID format');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public static generate(): TaskId {
    return new TaskId();
  }

  public static fromString(value: string): TaskId {
    return new TaskId(value);
  }
}
