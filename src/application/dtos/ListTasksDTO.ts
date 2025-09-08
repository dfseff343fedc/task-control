
export interface ListTasksRequest {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean;
}


interface ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface ListTasksResponse {
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}