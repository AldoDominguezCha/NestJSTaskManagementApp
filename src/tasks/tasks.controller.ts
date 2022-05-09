import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './DTOs/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(@Query() filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  public async getTaskById(@Param('id') targetId: string): Promise<Task> {
    return this.tasksService.getTaskById(targetId);
  }

  @Delete('/:id')
  public async deleteTaskById(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  public updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatusById(id, status);
  }
}
