import { IsNotEmpty } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty({
    message: 'You need to provide a value for the title',
  })
  title: string;

  @IsNotEmpty({
    message: 'You need to provide a value for the description',
  })
  description: string;
}
