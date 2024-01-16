import { TaskStatus } from '../task.status.enum';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
