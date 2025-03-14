import { RmqOptions, Transport } from '@nestjs/microservices';

export const RmqOptionsConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'send_notification',
    queueOptions: {
      durable: true,
    },
    noAck: true,
  },
};
