import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CampaignConfigModel_REPOSITORY } from 'src/config/constants';
import { CampaignConfigModel } from 'src/models';

import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class SingleNotificationService {

  constructor(
    private mailerService: EmailService,
    private smsService : SmsService,
    @Inject(CampaignConfigModel_REPOSITORY) private readonly campaignConfigRepo: typeof CampaignConfigModel,

  ) {}

  async sendNotification(data){


    const result_config = await this.campaignConfigRepo.findOne({where:{created_user_type: 1}}) 

    
    const email_config_type = result_config['dataValues']['email_config_type'] || null
    const email_host = result_config['dataValues']['email_host'] || null
    const email_service = result_config['dataValues']['email_service'] || null
    const email_port = result_config['dataValues']['email_port'] || null
    const email_password = result_config['dataValues']['email_password'] || null
    const email_address = result_config['dataValues']['email_address'] || null
    const push_config = result_config['dataValues']['fcm_server_ring']

    let config = {email_config_type, email_host, email_service, email_port, email_password, email_address}



    // get data from req body
    const isEmail = data['isEmail'] || 0
    const isSms = data['isSms'] || 0
    const isPush = data['isPush'] || 0

    const email = data['email'] || null
    const msisdn = data['msisdn'] || null
    const device_id = data['device_id'] || null
    
    const title = data['title'] || "upay notification"
    const body = data['body'] || null


    let result_email, result_sms, result_push


    // check nulls
    if(body === null){

      throw new BadRequestException('body can not be empty')
    }

    if(isEmail === 1 && email === null){

      throw new BadRequestException ('email can not be empty when isEmail is 1')
    }

    if(isSms === 1 && msisdn === null){
      
      throw new BadRequestException('msisdn can not be empty when isSms is 1')
      
    }
    if(isPush === 1 && device_id === null){

      throw new BadRequestException('device_id can not be empty when isPush is 1')

    }


    // send email
    if(isEmail === 1 ){

      let email_data={
        to: email,
        from: "",
        subject:title,
        text: body,
    }
      console.log('printed');
    
      result_email =await this.mailerService.send_email(email_data,config)

      
    }

    //send sms
    if(isSms === 1){

      let sms_data = {
        msisdn: msisdn,
        text: body
    }

     result_sms = await this.smsService.send_sms(sms_data)

    }

    //send push
    if(isPush === 1){

    
      try {
          
        const payload = { to: device_id, data: { title, body }, notification: { title, body } }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': push_config
        }
        
         await axios.post(`https://fcm.googleapis.com/fcm/send`, payload, { headers: headers })
            .then(response => {
              
                // console.log(response)
                console.log('Notification send successful')
                result_push = response.data
            })
            .catch(error => {

              // console.log(error)
              result_push = {response: error.response.status , statusText: error.response.statusText }
            })    
          } catch (e) { 

          
            result_push = e
          } 
    }


    let result = {result_email,result_sms,result_push}

    return result

  }


  async sendNotificationMerchant(data){

    
    // get data from req body
    const isEmail = data['isEmail'] || 0
    const isSms = data['isSms'] || 0
    const isPush = data['isPush'] || 0

    const email = data['email'] || null
    const msisdn = data['msisdn'] || null
    const device_id = data['device_id'] || null
    
    const title = data['title'] || "upay notification"
    const body = data['body'] || null
    const merchant_name = data['merchant_name'] || null

    let push_config, email_config_type, email_host, email_service, email_port, email_password, email_address, config
    
    let result_email, result_sms, result_push
    
    // check nulls

    if(merchant_name === null){
      throw new BadRequestException('merchant_name can not be empty ')
    }

    if(body === null){

      throw new BadRequestException('body can not be empty')
    }

    if(isEmail === 1 && email === null){

      throw new BadRequestException ('email can not be empty when isEmail is 1')
    }

    if(isSms === 1 && msisdn === null){
      
      throw new BadRequestException('msisdn can not be empty when isSms is 1')
      
    }
    if(isPush === 1 && device_id === null){

      throw new BadRequestException('device_id can not be empty when isPush is 1')

    }

    
    // const result_push_config_merchant = await this.campaignConfigRepo.findOne({attributes:['fcm_server_ring'],where:{created_by: merchant_name}})
    const result_config = await this.campaignConfigRepo.findOne({attributes:['fcm_server_ring'],where:{created_by: merchant_name}})

    if(!result_config){
      const result_push_config = await this.campaignConfigRepo.findOne({attributes:['fcm_server_ring'],where:{created_user_type: 1}}) 
      push_config = result_push_config['dataValues']['fcm_server_ring']
      email_config_type = result_config['dataValues']['email_config_type'] || null
      email_host = result_config['dataValues']['email_host'] || null
      email_service = result_config['dataValues']['email_service'] || null
      email_port = result_config['dataValues']['email_port'] || null
      email_password = result_config['dataValues']['email_password'] || null
      email_address = result_config['dataValues']['email_address'] || null

      config = {email_config_type, email_host, email_service, email_port, email_password, email_address}

      
    }else {
      push_config = result_config['dataValues']['fcm_server_ring']
      email_config_type = result_config['dataValues']['email_config_type'] || null
      email_host = result_config['dataValues']['email_host'] || null
      email_service = result_config['dataValues']['email_service'] || null
      email_port = result_config['dataValues']['email_port'] || null
      email_password = result_config['dataValues']['email_password'] || null
      email_address = result_config['dataValues']['email_address'] || null
      push_config = result_config['dataValues']['fcm_server_ring']

    config = {email_config_type, email_host, email_service, email_port, email_password, email_address}

    }

    // send email
    if(isEmail === 1 ){

      let email_data={
        to: email,
        from: "",
        subject:title,
        text: body,
    }
      console.log('printed');
    
      result_email =await this.mailerService.send_email(email_data,config)

      
    }

    //send sms
    if(isSms === 1){

      let sms_data = {
        msisdn: msisdn,
        text: body
    }

     result_sms = await this.smsService.send_sms(sms_data)

    }

    //send push
    if(isPush === 1){

    
      try {
          
        const payload = { to: device_id, data: { title, body }, notification: { title, body } }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': push_config
        }
        
         await axios.post(`https://fcm.googleapis.com/fcm/send`, payload, { headers: headers })
            .then(response => {
              
                // console.log(response)
                console.log('Notification send successful')
                result_push = response.data
            })
            .catch(error => {

              // console.log(error)
              result_push = {response: error.response.status , statusText: error.response.statusText }
            })    
          } catch (e) { 

          
            result_push = e
          } 
    }


    let result = {result_email,result_sms,result_push}

    return result

  }


}
