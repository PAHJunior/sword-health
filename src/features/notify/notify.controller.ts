import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotifyService } from './notify.service';
import { NotifyDto } from './dto/notify.dto';

@Controller()
export class NotifyController {
  public constructor(
    private notifyService: NotifyService,
    private logger: Logger,
  ) {}

  @MessagePattern('send_notification')
  handleMessage(@Payload() data: NotifyDto): void {
    const messageId = data.properties.messageId;
    this.logger.log(
      `Received messageId ${messageId} from queue: ${JSON.stringify(data)}`,
    );

    this.notifyService.handleNotification(data);
    try {
      this.logger.log(`Successfully processed message (ID: ${messageId})`);
    } catch (error) {
      this.logger.log(
        `Error processing message (ID: ${messageId}): ${error.message}`,
      );
    }
  }
}
