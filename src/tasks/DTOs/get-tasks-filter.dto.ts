import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString({ message: 'The search term cannot be empty' })
  search?: string;
}
