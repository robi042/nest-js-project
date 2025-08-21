import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import nodemailer from 'nodemailer'
import { CampaignConfigModel_REPOSITORY } from 'src/config/constants';
import { CampaignConfigModel } from 'src/models';


@Injectable()
export class EmailService {
  constructor(
    @Inject(CampaignConfigModel_REPOSITORY) private readonly campaignConfigRepo: typeof CampaignConfigModel,
  ) {}

  async get_config(){

    const result_email_config = await this.campaignConfigRepo.findOne({where:{created_user_type: 1}}) 

    
    const email_config_type = result_email_config['dataValues']['email_config_type'] || null
    const email_host = result_email_config['dataValues']['email_host'] || null
    const email_service = result_email_config['dataValues']['email_service'] || null
    const email_port = result_email_config['dataValues']['email_port'] || null
    const email_password = result_email_config['dataValues']['email_password'] || null
    const email_address = result_email_config['dataValues']['email_address'] || null

    return {email_config_type, email_host, email_service, email_port, email_password, email_address}
  }


  async get_transport(){

    let transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "intesarcc1@gmail.com", // generated ethereal user
        pass: "gtdbwawwssdspdsc", // generated ethereal password
      },
    });

    return transport
  }

  async send_email(data,config = null){

    if (config === null){
      config = await this.get_config()
    }

    const to = data.to || null
    const from = data.from || 'test@mail.com'
    const subject = data.subject || 'test subject'
    const body = data.text || null

    if (to === null || from === null || subject === null || body === null ){
        throw new BadRequestException("to, from, subject, body cannot be null")
    }


    let transport

    if(config.email_config_type === 1){
      
    transport = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      service: config.email_service,
      port: config.email_port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email_address, // generated ethereal user
        pass: config.email_password, // generated ethereal password
      },
    });
    }

    if(config.email_config_type === 2){
      
      transport = nodemailer.createTransport({
        host: config.email_service,
        // service: config.email_service,
        port: config.email_port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.email_address, // generated ethereal user
          pass: config.email_password, // generated ethereal password
        },
      });
      }
  
    const response = await transport.sendMail({
          to: to,
          from: from,
          subject: subject,
          text : body,
        })
        if(response){
            return({message:'email sent', response})
        }
        // console.log('Email response : ', response)
}
}
