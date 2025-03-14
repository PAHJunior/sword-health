import { TaskDto } from 'src/features/task/dto/task.dto';
import { NotifyTypeEnum } from './notify-type.enum';

export class NotifyPropertiesDto {
  messageId: string;
}

export class NotifyDto {
  properties: NotifyPropertiesDto;
  task: TaskDto;
  notifyType: NotifyTypeEnum;
}
