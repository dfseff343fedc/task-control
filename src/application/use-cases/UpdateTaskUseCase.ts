import { ITaskRepository } from "@/domain/index.js";
import { UpdateTaskRequest, UpdateTaskResponse } from "../dtos/UpdateTaskDTO.js";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, request: UpdateTaskRequest): Promise<UpdateTaskResponse> {
     // Busca a task existente
     const existingTask = await this.taskRepository.getById(id);
     
     // Atualiza os campos fornecidos
     existingTask.update(request);
     
     // Salva a task atualizada
     await this.taskRepository.update(existingTask);

     return {
      status: 'success',
      message: 'Task updated successfully'
     };
  }
}