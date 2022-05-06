import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepo: TasksRepository,
  ) {}

  public getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepo.getTasks(filterDto);
  }

  public async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepo.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ID '${id}' could not be found`);
    }
    return task;
  }

  public createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.tasksRepo.createTask(createTaskDto);
  }

  public async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepo.delete(id);

    if (result?.affected === 0) {
      throw new NotFoundException(`Task with ID '${id}' could not be found`);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    return await this.tasksRepo.save(task);
  }
}
