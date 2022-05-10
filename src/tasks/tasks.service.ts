import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepo: TasksRepository,
  ) {}

  public getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepo.getTasks(filterDto, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepo.getTaskById(id, user);

    if (!task) {
      throw new NotFoundException(`Task with ID '${id}' could not be found`);
    }
    return task;
  }

  public createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepo.createTask(createTaskDto, user);
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepo.delete({ id, user });

    if (result?.affected === 0) {
      throw new NotFoundException(`Task with ID '${id}' could not be found`);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    return await this.tasksRepo.save(task);
  }
}
