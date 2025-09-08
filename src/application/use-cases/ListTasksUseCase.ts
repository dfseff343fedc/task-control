import { ITaskRepository, TaskSearchCriteria, TaskPaginationOptions } from "@/domain/index.js";
import { ListTasksRequest, ListTasksResponse } from "../dtos/ListTasksDTO.js";

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(request: ListTasksRequest = {}): Promise<ListTasksResponse> {
    console.log('🔍 ListTasksUseCase - Request received:', request);
     
    const cleanCriteria: TaskSearchCriteria | undefined = (() => {
      const result: TaskSearchCriteria = {};
      if (request.search !== undefined) result.search = request.search;
      if (request.completed !== undefined) result.completed = request.completed;
      return Object.keys(result).length > 0 ? result : undefined;
    })();

    console.log('🔍 ListTasksUseCase - Clean criteria:', cleanCriteria);

    const cleanPagination: TaskPaginationOptions | undefined = (() => {
      const result: TaskPaginationOptions = {};
      if (request.page !== undefined) result.page = request.page;
      if (request.limit !== undefined) result.limit = request.limit;
      return Object.keys(result).length > 0 ? result : undefined;
    })();

    const tasks = await this.taskRepository.findWithPagination(
      cleanCriteria,
      undefined, // sort
      cleanPagination
    );

    return {
      tasks: tasks.tasks.map(({ id, title, description, completed, createdAt, updatedAt }) => ({
        id, title, description, completed, createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString()
      })),
      total: tasks.total,
      page: tasks.page,
      limit: tasks.limit,
      totalPages: tasks.totalPages
    };
  }

}