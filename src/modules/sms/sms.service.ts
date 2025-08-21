import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {

  async send_sms(data){
    let sms_data = {
      msisdn : data['msisdn'],
      text : data['text'],
      keyword: "True",
      user: "headerbw26",
      password: "lms115_bds109==34"

    }
    //  const result = await axios.post('https://lms.robi.com.bd/api/ByBds/send_sms',sms_data)
     const result = await axios.post(process.env.SMS_API_URL,sms_data)

    // console.log(result.data);
    return(result.data)
    
    }
}
