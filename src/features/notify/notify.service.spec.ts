import { Test, TestingModule } from '@nestjs/testing';
import { NotifyService } from './notify.service';
import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotifyDto } from './dto/notify.dto';
import { NotifyTypeEnum } from './dto/notify-type.enum';
import { TaskDto } from '../task/dto/task.dto';

describe('NotifyService', () => {
  let service: NotifyService;
  let logger: Logger;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    logger = { log: jest.fn() } as any;
    clientProxy = { emit: jest.fn(), connect: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyService,
        { provide: Logger, useValue: logger },
        { provide: 'NOTIFY_SERVICE', useValue: clientProxy },
      ],
    }).compile();

    service = module.get<NotifyService>(NotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleNotification', () => {
    it('should log CREATE notification message', () => {
      const task: TaskDto = { taskId: 1, username: 'John Doe' } as TaskDto;
      const notifyDto: NotifyDto = { notifyType: NotifyTypeEnum.CREATE, task };

      service.handleNotification(notifyDto);

      expect(logger.log).toHaveBeenCalledWith(
        `A new task has been created. Task ID: 1, performed by John Doe`,
      );
    });

    it('should log UPDATE notification message', () => {
      const task: TaskDto = { taskId: 1, username: 'John Doe' } as TaskDto;
      const notifyDto: NotifyDto = { notifyType: NotifyTypeEnum.UPDATE, task };

      service.handleNotification(notifyDto);

      expect(logger.log).toHaveBeenCalledWith(
        `A task has been updated. Task ID: 1, performed by John Doe`,
      );
    });

    it('should log DELETE notification message', () => {
      const task: TaskDto = { taskId: 1, username: 'John Doe' } as TaskDto;
      const notifyDto: NotifyDto = { notifyType: NotifyTypeEnum.DELETE, task };

      service.handleNotification(notifyDto);

      expect(logger.log).toHaveBeenCalledWith(
        `A task has been deleted. Task ID: 1`,
      );
    });

    it('should log unknown notification type message', () => {
      const task: TaskDto = { taskId: 1, username: 'John Doe' } as TaskDto;
      const notifyDto: NotifyDto = { notifyType: 'UNKNOWN' as any, task };

      service.handleNotification(notifyDto);

      expect(logger.log).toHaveBeenCalledWith(
        `Received an unknown notification type with data: ${JSON.stringify(
          notifyDto,
        )}`,
      );
    });
  });

  describe('sendTaskNotification', () => {
    it('should emit a notification message', () => {
      const task: TaskDto = { taskId: 1, username: 'John Doe' } as TaskDto;
      const notifyType = NotifyTypeEnum.CREATE;

      service.sendTaskNotification(task, notifyType);

      expect(clientProxy.emit).toHaveBeenCalledWith('send_notification', {
        task,
        notifyType,
      });
    });
  });
});
