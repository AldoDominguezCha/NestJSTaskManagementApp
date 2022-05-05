import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (t) => t.title.includes(search) || t.description.includes(search),
      );
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDTO): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  public getTaskById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(
        `The task with the '${id}' could not be found`,
      );
    }

    return task;
  }

  public deleteTaskById(id: string): Task {
    this.getTaskById(id);
    const targetIndex = this.tasks.findIndex((t) => t.id === id);
    return this.tasks.splice(targetIndex, 1)[0];
  }

  public updateTaskStatusById(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
