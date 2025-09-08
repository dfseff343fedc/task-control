export interface ToggleTaskRequest {
  id: string;
}

export interface ToggleTaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ToggleTaskMapper {
  public static toResponse(task: any): ToggleTaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}

