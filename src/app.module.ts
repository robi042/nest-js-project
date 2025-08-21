import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module'
import {LoggerMiddleware} from './middleware'
import { RedisModule } from './config/redis/redis.module'
import { QueueModule} from './modules/queue/queue.module'
import { MinioClientModule } from './modules/minio-client/minio-client.module'
import { interceptorProviders } from './helpers/interceptor'
import { NotificationManagementModule } from './modules/notification-management/notification-management.module';
import { AuthModule } from './modules/auth/auth.module';
import { CampaignManagementModule } from './modules/campaign-management/campaign-management.module'
import { CostmanagementModule } from './modules/cost-management/cost-management.module'
import { SingleNotificationModule } from './modules/single-notification/single-notification.module'
import { ComplainModule } from './modules/complain-management/complain.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    AuthModule,
    // ApifetchModule,
    MinioClientModule,
    NotificationManagementModule,
    RedisModule,
    QueueModule,
    CampaignManagementModule,
    CostmanagementModule,
    SingleNotificationModule,
    ComplainModule

  ],
  controllers: [

  ],
  providers: [

     ...interceptorProviders,

    
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

