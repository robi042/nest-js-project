import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {QUEUE_NAME} from '../../config/constants'

import { BulkNotificationService} from '../notification-management/bulk-notification.service'


@Processor(QUEUE_NAME)
export class ConsumerProcessor {

  constructor(
     private readonly bulkNotificationService: BulkNotificationService,
  
 ) { }

  @Process('job-name')
  async jobProcess(job: Job) {
    let progress = 0;
     console.log(job.data)
    return {};
  }



  @Process('notificatiion-action')
  async offerAction(job: Job) {

    this.bulkNotificationService.action(job.data)
    return true
  }
}