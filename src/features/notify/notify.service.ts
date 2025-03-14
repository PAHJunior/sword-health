import { Inject, Injectable, Logger } from '@nestjs/common';
import { TaskDto } from '../task/dto/task.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NotifyTypeEnum } from './dto/notify-type.enum';
import { NotifyDto } from './dto/notify.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotifyService {
  public constructor(
    private logger: Logger,
    @Inject('NOTIFY_SERVICE') private client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  public handleNotification(data: NotifyDto) {
    const { notifyType, task } = data;
    let message: string;

    switch (notifyType) {
      case NotifyTypeEnum.CREATE:
        message = `A new task has been created. Task ID: ${task.taskId}, performed by ${task.username}`;
        break;

      case NotifyTypeEnum.UPDATE:
        message = `A task has been updated. Task ID: ${task.taskId}, performed by ${task.username}`;
        break;

      case NotifyTypeEnum.DELETE:
        message = `A task has been deleted. Task ID: ${task.taskId}`;
        break;

      default:
        message = `Received an unknown notification type with data: ${JSON.stringify(data)}`;
    }

    this.logger.log(message);
  }

  public sendTaskNotification(task: TaskDto, notifyType: NotifyTypeEnum) {
    // TODO: We can save this message in the database
    const messageId = uuidv4();
    this.client.emit('send_notification', {
      properties: {
        messageId,
      },
      task,
      notifyType,
    });
  }
}
