/**
 * DTO para requisição de criação de tarefa
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
}

/**
 * DTO para resposta de criação de tarefa
 */
export interface CreateTaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
