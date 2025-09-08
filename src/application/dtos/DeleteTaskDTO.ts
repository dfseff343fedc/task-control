export interface DeleteTaskRequest {
  id: string;
}

export interface DeleteTaskResponse {
  status: 'success';
  message: string;
  deletedTaskId: string;
}
