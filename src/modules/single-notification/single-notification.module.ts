import { Module } from '@nestjs/common';
import { SingleNotificationService } from './single-notification.service';
import { SingleNotificationController } from './single-notification.controller';
import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';
import { singleNotificationProvider } from './single-notification.providers';

@Module({
  imports: [EmailModule,SmsModule],
  providers: [SingleNotificationService, ...singleNotificationProvider],
  controllers: [SingleNotificationController]
})
export class SingleNotificationModule {}
