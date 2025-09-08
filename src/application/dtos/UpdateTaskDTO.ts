export interface UpdateTaskRequest {
  title?: string;
  description?: string;

}

export interface UpdateTaskResponse {
  status: 'success' | 'error';
  message: string;
  
}