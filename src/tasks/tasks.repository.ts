import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './DTOs/create-task.dto';
import { GetTasksFilterDTO } from './DTOs/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  public async createTask(
    createTaskDto: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    return await this.save(task);
  }

  public async getTasks(
    filterDto: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { search, status } = filterDto;
    let query = this.createQueryBuilder('target').where({ user });
    if (status) {
      query = query.andWhere('target.status = :status', { status });
    }
    if (search) {
      query = query.andWhere(
        '(LOWER(target.title) LIKE :search OR LOWER(target.description) LIKE :search)',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  public async getTaskById(taskId: string, user: User): Promise<Task> {
    return await this.createQueryBuilder('task')
      .where({ user })
      .andWhere('task.id = :taskId', { taskId })
      .getOne();
  }
}
