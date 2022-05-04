import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  public getTaskById(@Param('id') targetId: string) {
    const task = this.tasksService.getTaskById(targetId);
    if (task === undefined) {
      throw new BadRequestException(
        `The task with id '${targetId}' could not be found`,
      );
    }
    return task;
  }
}
