import { ITaskRepository } from "@/domain/index.js";
import { DeleteTaskRequest, DeleteTaskResponse } from "../dtos/DeleteTaskDTO.js";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    await this.taskRepository.getById(request.id);
    
    await this.taskRepository.delete(request.id);
    
    return {
      status: 'success',
      message: 'Task deleted successfully',
      deletedTaskId: request.id
    };
  }
}