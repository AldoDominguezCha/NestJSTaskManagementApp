import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './DTOs/update-task-status.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(@Query() filterDto: GetTasksFilterDTO): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    }

    return this.tasksService.getAllTasks();
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  public getTaskById(@Param('id') targetId: string): Task {
    return this.tasksService.getTaskById(targetId);
  }

  @Delete('/:id')
  public deleteTaskById(@Param('id') id: string): Task {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  public updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatusById(id, status);
  }
}
