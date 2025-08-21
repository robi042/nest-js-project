import { Module } from '@nestjs/common';
import { ComplainService } from './complain.service'
import { ComplainController } from './complain.controller';
import {ComplainProviders} from './complain.providers'

@Module({
  providers: [ ComplainService,  ...ComplainProviders],
  controllers: [ComplainController]
})
export class ComplainModule {}
