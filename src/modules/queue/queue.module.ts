import { Module, forwardRef } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { ConsumerProcessor} from './queue.processor'
import { REDIS_CONNECTION, QUEUE_NAME} from '../../config/constants'
import 'dotenv/config'
import {NotificationManagementModule} from '../notification-management/notification-management.module'


@Module({
  imports : [


    BullModule.forRoot({ redis: { connectionName : REDIS_CONNECTION, host : process.env.REDIS_HOST, port : parseInt(process.env.REDIS_PORT) } }),
    //BullModule.forRoot({ redis: { connectionName : REDIS_CONNECTION, host : 'localhost', port : 6379 } }),
    BullModule.registerQueue({ name: QUEUE_NAME }),
    NotificationManagementModule
    
  
    
  ],
  providers: [QueueService, ConsumerProcessor],
  exports : [BullModule]
})
export class QueueModule {}
