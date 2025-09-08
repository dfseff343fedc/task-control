import { ITaskRepository } from "@/domain/index.js";
import { UpdateTaskRequest, UpdateTaskResponse } from "../dtos/UpdateTaskDTO.js";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, request: UpdateTaskRequest): Promise<UpdateTaskResponse> {
     const existingTask = await this.taskRepository.getById(id);
     
     existingTask.update(request);
     
     await this.taskRepository.update(existingTask);

     return {
      status: 'success',
      message: 'Task updated successfully'
     };
  }
}