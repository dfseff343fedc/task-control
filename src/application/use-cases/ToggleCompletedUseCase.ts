import { ITaskRepository } from "@/domain/index.js";
import { ToggleTaskRequest, ToggleTaskResponse, ToggleTaskMapper } from "../dtos/ToggleTaskDTO.js";

export class ToggleCompletedUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(request: ToggleTaskRequest): Promise<ToggleTaskResponse> {
    const task = await this.taskRepository.getById(request.id);

    task.toggleComplete();
    await this.taskRepository.update(task);

    return ToggleTaskMapper.toResponse(task);
  }
}