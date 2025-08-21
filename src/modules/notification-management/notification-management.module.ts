import { Module,forwardRef,Logger } from '@nestjs/common';
import { NotificationManagmentService } from './notificationManagment.service'
import { NotificationManagmentProviders } from './notificationManagment.providers'
import {NotificationManagmentController} from './notificationManagment.controller'
import { ClientsModule, Transport } from '@nestjs/microservices';
import {BulkNotificationController} from './bulk-notification.controller'
import {BulkNotificationService} from './bulk-notification.service'
import {QueueModule } from '../queue/queue.module'
import { RedisModule} from '../../config/redis/redis.module'

// import { EmailModule } from '../email/email.module';
// import { SmsModule } from '../sms/sms.module';

@Module({
    imports : [RedisModule,forwardRef(() => QueueModule),ClientsModule.register([
        {
          name: 'kafka_module',
          transport: Transport.KAFKA,
          options: {
            client: {
              // clientId: 'kafka_client',
              // ssl: true,
              brokers: [process.env.KAFKA_BROKERS],
            },
            consumer: {
              groupId: process.env.KAFKA_GROUP_ID,
            },
          },
        },
      ]),],
    providers: [BulkNotificationService,NotificationManagmentService,Logger, ...NotificationManagmentProviders],
    controllers: [NotificationManagmentController, BulkNotificationController],
    exports:[BulkNotificationService]
})

export class NotificationManagementModule {}
