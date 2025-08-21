import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import {CampaignGroupModel, CampaignGroupHistoryModel, CampaignGroupTempModel, GroupBaseTempModel, GroupBaseModel, CampaignConfigModel} from '../../models'
import {CAMPAIGN_GROUP, CAMPAIGN_GROUP_HISTORY, CAMPAIGN_GROUP_TEMP, GROUP_BASE_TEMP, GROUP_BASE, CampaignConfigModel_REPOSITORY} from '../../config/constants'
import { Sequelize } from 'sequelize-typescript';
import { MinioClientService } from '../minio-client/minio-client.service'
import fs from 'fs'
import csv from 'csv-parser'
import axios from 'axios'
import Minio from 'minio'
import { base64fileUpload, validateEmail, validateNumber } from '../../helpers/utils'
import { Op } from 'sequelize';
import { BufferedFile } from '../minio-client/file.model'
import * as csve from 'fast-csv';
import 'dotenv/config'


import {winstonLog} from '../../config/winstonLog'
import { databaseConfig } from 'src/config/database/database.config';
import { create } from 'domain';
import { group } from 'console';


@Injectable()
export class CampaignManagementGroupService {

    constructor(
        @Inject(CAMPAIGN_GROUP) private readonly campaignGroup: typeof CampaignGroupModel,
        @Inject(CAMPAIGN_GROUP_HISTORY) private readonly campaignGroupHistory: typeof CampaignGroupHistoryModel,
        @Inject(CAMPAIGN_GROUP_TEMP) private readonly campaignGroupTemp: typeof CampaignGroupTempModel,
        @Inject(GROUP_BASE_TEMP) private readonly groupBaseTemp: typeof GroupBaseTempModel,
        @Inject(CampaignConfigModel_REPOSITORY) private readonly campaignConfig: typeof CampaignConfigModel,
        @Inject(GROUP_BASE) private readonly groupBase: typeof GroupBaseModel,
        private readonly minioClientService: MinioClientService
      
    ) { }
     
  publicDir = process.env.publicDir
  //process csv file and after process insert into table.....
  processcsvfile = async (csvurl, group_id, group_name) => {
        return new Promise((resolve, reject) => {
          const fullurl = csvurl
          csvurl = csvurl.split(process.env.host)
          csvurl = csvurl[1]
          csvurl = `${this.publicDir}/${csvurl}`
      
          const dataforupload = []
      
          fs.createReadStream(csvurl)
            .pipe(csv())
            .on('data', (row) => {
              let rowdata = {
                  msisdn: row['MSISDN'] || "",
                  email: row['EMAIL'] || "",
                  device_id: row['DEVICEID'] || "",
                  group_id,
                  group_name

              }
              winstonLog.log('info', 'Pulling Group info From CSV :  %o', rowdata)
              dataforupload.push(rowdata)
            })
            .on('end', () => {

                let dataforupload2 = [...dataforupload],
                mobiles = [], emails = []
                dataforupload.map((item) => {
                  mobiles.push(item.msisdn)
                  emails.push(item.email)
                })
              
                let dataforupload3 = [], i = 0, errordata = [], ei = 0, mailCheck = false, numberCheck = false, mobilenumWithZero

                dataforupload2.forEach((item, index) => {

                  if (item.msisdn.startsWith('0')) {
                    winstonLog.log('info', '%s MSISDN start with 0.', item.msisdn)
                      mailCheck = validateEmail(item.email)
                      numberCheck = validateNumber(item.msisdn)
                      if (mailCheck == true && numberCheck == true) {
                        winstonLog.log('info', '%s MSISDN and %s EMAIL is valid', item.msisdn, item.email)
                          dataforupload3.push({
                            msisdn: item.msisdn,
                            email: item.email,
                            device_id: item.device_id,
                            group_id: item.group_id,
                            group_name:item.group_name
                          })
                        } else {
                          winstonLog.log('info', '%s MSISDN or %s EMAIL is Invalid', item.msisdn, item.email)
                          errordata.push({ ...item })
                        }
                    } else {
                      
                      mobilenumWithZero = '0' + item.msisdn
                      winstonLog.log('info', '%s MSISDN start without 0 . so we added 0. After added 0 MSISDN is %s ', item.msisdn, mobilenumWithZero)
                      mailCheck = validateEmail(item.email)
                      numberCheck = validateNumber(mobilenumWithZero)
                        if (mailCheck == true && numberCheck == true) {
                          winstonLog.log('info', '%s MSISDN and %s EMAIL is valid', item.msisdn, item.email)
                          dataforupload3.push({
                            msisdn: mobilenumWithZero,
                            email: item.email,
                            device_id: item.device_id,
                            group_id: item.group_id,
                            group_name:item.group_name
                          })
                        } else {
                          winstonLog.log('info', '%s MSISDN or %s EMAIL is Invalid', item.msisdn, item.email)
                          errordata.push({ ...item })
                        }
                  }
                  
                })

                const dataLength = dataforupload3.length
      
                winstonLog.log('info', 'Trying to insert %d data into groupbasetemp', dataLength)

                if (!dataLength) {

                  resolve({ fileuploaderror: true, errormsg: 'System is not found any valid MSISDN and EMAIL combination row inside CSV file'})
                }
                this.groupBaseTemp.bulkCreate(dataforupload3).then(async (data) => {

                    winstonLog.log('info', 'CSV file successfully processed %d data', dataLength)
                    resolve({ data, errordata})

                  }) .catch((e) => {

                    winstonLog.log('error', 'CSV file Processing Error Occurred %o', e)
                    resolve({ fileuploaderror: true, errormsg: 'CSV file Processing Error Occurred'})
                  })
                })
        })
  }

  getAccessToken =  async () => {
  
        return new Promise((resolve, reject) => {
            
          console.log({
            "username": `${process.env.USERNAME}`,
            "password": `${process.env.PASSWORD}`,
            
        });
          
            axios.post(`${process.env.BMS_BASE_URL}/bms/crud/v1/token`,{
                "username": `${process.env.USERNAME}`,
                "password": `${process.env.PASSWORD}`,
                
            }).then(response => {
        

              
                resolve(response.data.jwtToken)
        
            }).catch(e => {
        
        
                reject(e.response)
        
            })
    
        })

  }

  //re arrange code.....
  async createCampaignGroup(reqbody, userinfo) {

        let {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, division, connection_type, report_file, member_list  } = reqbody

        let createBody = { }, created_group = { }
        /*
        (creation_type == 1) => Bulk Upload
        (creation_type == 3) => Account Base Profiling
        (creation_type == 2) => Group Profiling
         */
        if (creation_type == 3 || creation_type == 4) {
             createBody = {
                group_name,
                type,
                isDefault,
                status,
                creation_type,
                csv_file_name,
                carrier,
                hand_set_type,
                age,
                gender,
                income,
                location,
                division,
                member_list,
                connection_type,
                created_by,
                created_by_name,
                created_user_type,
                action : "INSERT",
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                idx
            }
        }
        
        else if (creation_type == 1) {
            createBody = {
              group_name,
              type,
              isDefault,
              status,
              creation_type,
              created_by,
              created_by_name,
              created_user_type,
              member_list,
              action : "INSERT",
              action_by : created_by,
              action_by_name : created_by_name,
              action_by_user_type : created_user_type,
              idx
            }
            if(!report_file) {
               winstonLog.log('error', `creation_type == 1 but System didn't find any CSV file. Please upload a valid CSV file`) 
              throw new BadRequestException(`System didn't find any CSV file. Please upload a valid CSV file`)
            }
        }
      
        else {
            createBody = {
                group_name,
                type,
                isDefault,
                status,
                creation_type,
                csv_file_name,
                carrier,
                hand_set_type,
                age,
                gender,
                income,
                location,
                division,
                connection_type,
                created_by,
                member_list,
                created_by_name,
                created_user_type,
                action : "INSERT",
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                idx
            }   
        }
       
      if ( !(creation_type == 1) ) {
          winstonLog.log('info', 'No CSV file Found')
          created_group = await this.campaignGroupTemp.create(createBody)
      }
      else {
        winstonLog.log('info', 'CSV file is Found, we are processing this................')
        let Url = await base64fileUpload(report_file, 'csv')
        const autoID = Date.now()
        const dataforupload = await this.processcsvfile(Url, autoID, createBody['group_name'])

        if (dataforupload['fileuploaderror']) {
          throw new BadRequestException(dataforupload['errormsg'] || 'System is not found any valid MSISDN and EMAIL combination row inside CSV file')
        }
        await this.campaignGroupTemp.create({...createBody, group_member_count:dataforupload['data'].length, id: autoID})

      }

      await this.campaignGroupHistory.create(createBody)
      return created_group
  }
  

  async editCampaignGroup(reqbody, userinfo) {

    let {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

    const created_user_type = (username && roleid) ? 1 : 2
    const created_by = `${id}`, created_by_name = username ? username : mobile

    const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, division, connection_type, report_file, member_list, id:group_id } = reqbody

    if (creation_type == 1) {

      const rule=await this.campaignGroup.findOne({where: {
        [Op.and]: [
          { id: group_id },
          { is_approved: true },
        ],
    }
      })
      const createBody = {
          group_name,
          type,
          isDefault,
          status,
          creation_type,
          csv_file_name,
          carrier,
          hand_set_type,
          age,
          gender,
          income,
          location,
          division,
          connection_type,
          created_by,
          created_by_name,
          created_user_type,
          action : "UPDATE",
          action_by : created_by,
          action_by_name : created_by_name,
          action_by_user_type : created_user_type,
          idx,
          is_approved: false,
          is_rejected: false,
          approved_by: null,
          approved_at: null
      }

     console.log(rule);
      if (rule) {
        if (!report_file) {
          console.log('CSV FILE MISSING')
          this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
   
          this.campaignGroupTemp.create({...createBody, update_id:group_id})
          
          this.campaignGroupHistory.create(createBody)
          
          return 'updated'
     
        } else {
        
         
           this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
   
           this.campaignGroupTemp.create({...createBody, update_id:group_id})
           
           const updated_group=await this.campaignGroup.findOne({where:{id:group_id}})
           
           this.campaignGroupHistory.create(createBody)
 
           let Url = await base64fileUpload(report_file, 'csv')
 
           const dataforupload = await this.processcsvfile(Url, updated_group['id'], updated_group['group_name'])
           
           return 'updated'
           
        }
      } else {
        return 'No group Found'
     }
           
  
       }

    if (creation_type == 3) {

      const rule=await this.campaignGroup.findOne({where: {
        [Op.and]: [
          { id: group_id },
          { is_approved: true },
        ],
    }
      })
      const createBody = {
          group_name,
          type,
          isDefault,
          status,
          creation_type,
          member_list,
          created_by,
          created_by_name,
          created_user_type,
          action : "UPDATE",
          action_by : created_by,
          action_by_name : created_by_name,
          action_by_user_type : created_user_type,
          idx,
          is_approved: false,
          is_rejected: false,
          approved_by: null,
          approved_at: null
      }

     console.log(rule);
     if (rule) {
      if (!report_file) {
        console.log('CSV FILE MISSING')
        this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
 
        this.campaignGroupTemp.create({...createBody, update_id:group_id})
        
        this.campaignGroupHistory.create(createBody)
        
        return 'updated'
   
      } else {
      
       
         this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
 
         this.campaignGroupTemp.create({...createBody, update_id:group_id})
         
         const updated_group=await this.campaignGroup.findOne({where:{id:group_id}})
         
         this.campaignGroupHistory.create(createBody)

         let Url = await base64fileUpload(report_file, 'csv')

         const dataforupload = await this.processcsvfile(Url, updated_group['id'], updated_group['group_name'])
         
         return 'updated'
         
      }
    } else {
      return 'No group Found'
   }
     
    }

    if (creation_type == 4) {

      const rule=await this.campaignGroup.findOne({where: {
        [Op.and]: [
          { id: group_id },
          { is_approved: true },
        ],
    }
      })
      const createBody = {
          group_name,
          type,
          isDefault,
          status,
          creation_type,
          csv_file_name,
          carrier,
          hand_set_type,
          age,
          gender,
          income,
          location,
          division,
          connection_type,
          created_by,
          created_by_name,
          created_user_type,
          action : "INSERT",
          action_by : created_by,
          action_by_name : created_by_name,
          action_by_user_type : created_user_type,
          idx,
          is_approved: false,
          is_rejected: false,
          approved_by: null,
          approved_at: null
      }

     console.log(rule);
     
           
     if (rule) {
      if (!report_file) {
        console.log('CSV FILE MISSING')
        this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
 
        this.campaignGroupTemp.create({...createBody, update_id:group_id})
        
        this.campaignGroupHistory.create(createBody)
        
        return 'updated'
   
      } else {
      
       
         this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action : "UPDATE" }, { where: { id: group_id } })
 
         this.campaignGroupTemp.create({...createBody, update_id:group_id})
         
         const updated_group=await this.campaignGroup.findOne({where:{id:group_id}})
         
         this.campaignGroupHistory.create(createBody)

         let Url = await base64fileUpload(report_file, 'csv')

         const dataforupload = await this.processcsvfile(Url, updated_group['id'], updated_group['group_name'])
         
         return 'updated'
         
      }
    } else {
      return 'No group Found'
   }
       }
    
    else {
     const rule=await this.campaignGroup.findOne({where: {
        [Op.and]: [
         { id: group_id },
          { is_approved: true },
         ],
    }
    })

    const createBody = {
      group_name,
      type,
      isDefault,
      status,
      creation_type,
      csv_file_name,
      carrier,
      hand_set_type,
      age,
      gender,
      income,
      location,
      division,
      connection_type,
      report_file,
        created_by,
        created_by_name,
        created_user_type,
        action : "UPDATE",
        action_by : created_by,
        action_by_name : created_by_name,
        action_by_user_type: created_user_type,
        idx,
        is_approved: false,
        is_rejected: false,
        approved_by: null,
        approved_at: null
    }
    
    if (rule) {
      if (!report_file) {
        console.log('CSV FILE MISSING')
        this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null }, { where: { id: group_id } })
 
        this.campaignGroupTemp.create({...createBody, update_id:group_id})
        
        this.campaignGroupHistory.create(createBody)
        
        return 'updated'
   
      } else {
      
       
         this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null }, { where: { id: group_id } })
 
         this.campaignGroupTemp.create({...createBody, update_id:group_id})
         
         const updated_group=await this.campaignGroup.findOne({where:{id:group_id}})
         
         this.campaignGroupHistory.create(createBody)

         let Url = await base64fileUpload(report_file, 'csv')

         const dataforupload = await this.processcsvfile(Url, updated_group['id'], updated_group['group_name'])
         
         return 'updated'
         
        }
      } else {
        return 'No group Found'
    }
    }
    

    

    //return await this.campaignRule.create(createBody)
  }
  
  async writeContactsToCsv(reqbody, userinfo) {
    const { group_id } = reqbody
    let list=[]
    const contact_list = await this.groupBase.findAll({ where: { group_id }, attributes: ['msisdn', 'email', 'device_id'] })
    if (contact_list.length==0) {
      return 'No contact list found for this Group'
    } else {
      contact_list.map((item) => {
        list.push({MSISDN: item.msisdn, EMAIL:item.email, DEVICEID: item.device_id })
      })
  
  
      const date=Date.now()
      const ws = fs.createWriteStream(`${this.publicDir}/${date}.csv`)
      csve
        .write(list, { headers: true })
        .on("finish", function () {
          console.log('file exported');
        })
        .pipe(ws)
        let filePath
        const stream=fs.createReadStream(`${this.publicDir}/${date}.csv`)
                    .pipe(csv())
                    .on('data', (row) => {
                      console.log(row);
                      filePath=`${this.publicDir}/${date}.csv`
                      console.log('file',`${this.publicDir}/${date}.csv`)
                    })
                    .on('end', () => {
                      console.log('CSV file successfully processed');
                    });
        
                    const buffers = [];
  
                    // node.js readable streams implement the async iterator protocol
                    for await (const data of stream) {
                      buffers.push(data);
                    }
          
      let uploadImage = await this.minioClientService.csvUpload(filePath)
      
      return { image_url:uploadImage.url }
    }

    
  
    }

    //by admin/admin user..
    async getAllCampaignGroupList(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.campaignGroup.findAll<CampaignGroupModel>({ order : [['id','DESC']] })

        }
        else {

            return this.campaignGroup.findAll<CampaignGroupModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

        }
  }
  
  async getPendingGroupList(userinfo) {

    let {id, username = null, roleid = 0, idx = 0} = userinfo

    const created_user_type = (username && roleid) ? 1 : 2
    const created_by = `${id}`

    idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

    if(created_user_type == 1) {

        return this.campaignGroupTemp.findAll<CampaignGroupTempModel>({ order : [['id','DESC']] })

    }
    else {

        return this.campaignGroupTemp.findAll<CampaignGroupTempModel>({ where : { created_by, created_user_type, idx}, order :[['id','DESC']]})

    }
}

    //approve, reject, delete..
    async campaignGroupAction(reqbody,userinfo){
        
        let {id, username = null, roleid = 0} = userinfo, action = 'REJECTED'

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
        const {action_id = 2, group_id, reject_msg = null} = reqbody

        action = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'

       

      if (action_id == 1) {
        const approvedGroup = await this.campaignGroup.findOne({ where: { id: group_id } })
        const groupinfo = await this.campaignGroupTemp.findOne({ where: { id: group_id } })
        
          if (groupinfo['dataValues'].action == 'DELETE') {

            const groupinfo=await this.campaignGroupTemp.findOne({where:{id:group_id}})
            const saved_id = groupinfo.update_id
            console.log(saved_id);
            
          if(!groupinfo) {
  
              throw new NotFoundException()
          }
  
      
          if( groupinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
  
            throw new BadRequestException('You cannot Approve/Reject it')
        }
            console.log(groupinfo);
          
            this.campaignGroup.destroy({ where: { id: groupinfo['dataValues']['update_id'] } })
            this.campaignGroupTemp.destroy({ where: { id: group_id } })
            this.groupBase.destroy({where:{group_id:groupinfo['dataValues']['update_id']}})
  
  
          
          const header = {
            'Authorization': `Bearer ${await this.getAccessToken()}`
          }
          
            const response = await axios.get(`${process.env.BMS_BASE_URL}/bms/crud/v1/group-profile-map/ext-group/delete/id/${saved_id}?force=true`, { headers: header })
            console.log(response.data)
            return true
           }
       
          if (groupinfo['dataValues'].action == 'UPDATE') {

            const groupinfo = await this.campaignGroupTemp.findOne({ where: { id: group_id } })
            const saved_id=groupinfo.update_id
    
            if(!groupinfo) {
    
                throw new NotFoundException()
            }
    
      
            if( groupinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
              throw new BadRequestException('You cannot Approve/Reject it')
          }
            
          
            const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, connection_type, facebook_campaign_id, google_campaign_id, created_by_name, update_id, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = groupinfo['dataValues']
            let data = []
            const createBody = {
                group_name,
                type,
                isDefault,
                status,
                creation_type,
                csv_file_name,
                carrier,
                hand_set_type,
                age,
                gender,
                income,
                facebook_campaign_id,
                google_campaign_id,
                location,
                connection_type,
                created_by : old_created_by,
                created_by_name : old_created_by_name,
                created_user_type : old_created_user_type,
                action,
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                approved_by : username,
                idx
            }
    
            this.campaignGroupHistory.create(createBody)
  
            this.campaignGroup.update({ ...createBody,is_approved: true, is_rejected: false, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") }, { where: { id: update_id } })
  
            
            
            const per_group_id= await this.campaignGroupTemp.findOne({where:{update_id:update_id}})

            this.groupBaseTemp.findAll({
              where: { group_id:update_id }
            })
              .then((newValue) => {
              
                //data.push({id:item['dataValues']['id'],msisdn:item['dataValues']['msisdn'], email:item['dataValues']['email'], device_id:item['dataValues']['deviice_id'], group_id:per_group_id['dataValues']['id'], created_at:item['dataValues']['created_at'], group_name:item['dataValues']['group_name']})

                newValue.map((item) => {
                  data.push({msisdn:item['dataValues']['msisdn'], email:item['dataValues']['email'], device_id:item['dataValues']['deviice_id'], group_id:per_group_id['dataValues']['update_id'], created_at:item['dataValues']['created_at'], group_name:item['dataValues']['group_name']})
                })
                console.log('data', data)
                this.groupBase.destroy({ where: { group_id:update_id  } })
                .then(async (data) => {
                  
                })
                .catch((e) => {
                  console.log(e)
                 
                })
               
                 this.groupBase.bulkCreate(data).then(async (data) => {
                  console.log('CSV file successfully processed', data)
                  
                })
                .catch((e) => {
                  console.log(e)
                  
                })
        
                this.groupBaseTemp.destroy({ where: { group_id:update_id  } })
                  .then(async (data) => {
                    
                  })
                  .catch((e) => {
                    console.log(e)
                   
                  })
              })
              .catch((e) => {
                console.log(e)
                
              })
        
              
              
              this.campaignGroupTemp.destroy( { where: { id: group_id } })
            const header = {
              'Authorization': `Bearer ${await this.getAccessToken()}`
            }
            
            const response = await axios.get(`${process.env.BMS_BASE_URL}/bms/crud/v1/group-profile-map/ext-group/update/id/${saved_id}?force=true`, { headers: header })
            console.log(response.data)
            return 'Group Updated'
          }
          else {
  
            const groupinfo = await this.campaignGroupTemp.findOne({ where: { id: group_id } })
        
    
            if(!groupinfo) {
    
                throw new NotFoundException()
            }
    
  
            if( groupinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
    
              throw new BadRequestException('You cannot Approve/Reject it')
           }
         
          
            const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, connection_type, facebook_campaign_id, google_campaign_id, created_by_name, update_id, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = groupinfo['dataValues']
        
            const createBody = {
                group_name,
                type,
                isDefault,
                status,
                creation_type,
                csv_file_name,
                carrier,
                hand_set_type,
                age,
                gender,
                income,
                facebook_campaign_id,
                google_campaign_id,
                location,
                connection_type,
                created_by : old_created_by,
                created_by_name : old_created_by_name,
                created_user_type : old_created_user_type,
                action,
                action_by : created_by,
                action_by_name : created_by_name,
                action_by_user_type : created_user_type,
                approved_by : username,
                idx
            }
    
            this.campaignGroupHistory.create(createBody)
            let data = []
             
              
              const per_group=await this.campaignGroup.create({...createBody, is_approved: true, is_rejected: false, approved_by: username, approved_at: Sequelize.literal("(now() at time zone 'utc')") })

              const per_group_id = await this.campaignGroup.findOne({ where: { group_name }, attributes: ['id'] })
              console.log('per',per_group_id['dataValues']['id']);
              this.groupBaseTemp.findAll({
                  where: { group_id:group_id }
                })
                  .then((newValue) => {
                  
                    //data.push({id:item['dataValues']['id'],msisdn:item['dataValues']['msisdn'], email:item['dataValues']['email'], device_id:item['dataValues']['deviice_id'], group_id:per_group_id['dataValues']['id'], created_at:item['dataValues']['created_at'], group_name:item['dataValues']['group_name']})

                    newValue.map((item) => {
                      data.push({msisdn:item['dataValues']['msisdn'], email:item['dataValues']['email'], device_id:item['dataValues']['deviice_id'], group_id:per_group_id['dataValues']['id'], created_at:item['dataValues']['created_at'], group_name:item['dataValues']['group_name']})
                    })
                    
                    
                     this.groupBase.bulkCreate(data).then(async (data) => {
                       console.log('CSV file successfully processed', data)
                       this.campaignGroup.update({group_member_count:data.length},{where:{id:per_group['id']}})
                      
                    })
                    .catch((e) => {
                      console.log(e)
                      
                    })
            
                    this.groupBaseTemp.destroy({ where: { group_id:group_id  } })
                      .then(async (data) => {
                        
                      })
                      .catch((e) => {
                        console.log(e)
                       
                      })
                  })
                  .catch((e) => {
                    console.log(e)
                    
                  })
            
                  
                  
                  this.campaignGroupTemp.destroy( { where: { id: group_id } })
            
            return true
          }
              
          
        }
       
       
        else if(action_id == 2) {

          const groupinfo = await this.campaignGroupTemp.findOne({ where: { id: group_id } })
        
          if (groupinfo['dataValues'].action == 'DELETE') {

            const groupinfo=await this.campaignGroupTemp.findOne({where:{id:group_id}})
            const saved_id = groupinfo.update_id
            console.log(saved_id);
            
          if(!groupinfo) {
  
              throw new NotFoundException()
          }
  
      
          if( groupinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {
  
            throw new BadRequestException('You cannot Approve/Reject it')
        }
            console.log(groupinfo);
          
            this.campaignGroup.update({ is_approved: true, is_rejected: true, approved_by: null, approved_at: null, action: 'APPROVED' }, { where: { id: saved_id } })
           
            this.campaignGroupTemp.destroy({ where: { id: group_id } })
            
  
  
          return true
        
        }
        
        if (groupinfo['dataValues'].action == 'UPDATE') {

          const groupinfo=await this.campaignGroupTemp.findOne({where:{id:group_id}})
          const saved_id = groupinfo.update_id
          console.log(saved_id);
          
        if(!groupinfo) {

            throw new NotFoundException()
        }

    
        if( groupinfo['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

          throw new BadRequestException('You cannot Approve/Reject it')
      }
          console.log(groupinfo);
        
          this.campaignGroup.update({ is_approved: true, is_rejected: true, approved_by: null, approved_at: null, action: 'APPROVED' }, { where: { id: saved_id } })
         
          this.campaignGroupTemp.destroy({ where: { id: group_id } })
          


        return true
      
        } if (groupinfo['dataValues'].action == 'INSERT') { 
          const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, connection_type, facebook_campaign_id, google_campaign_id, created_by_name, update_id, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = groupinfo['dataValues']
      
          const createBody = {
              group_name,
              type,
              isDefault,
              status,
              creation_type,
              csv_file_name,
              carrier,
              hand_set_type,
              age,
              gender,
              income,
              facebook_campaign_id,
              google_campaign_id,
              location,
              connection_type,
              created_by : old_created_by,
              created_by_name : old_created_by_name,
              created_user_type : old_created_user_type,
              action,
              action_by : created_by,
              action_by_name : created_by_name,
              action_by_user_type : created_user_type,
              approved_by : username,
              idx
          }
  
          this.campaignGroupHistory.create(createBody)
          this.campaignGroupTemp.destroy({ where: { id: group_id } })
        
        return true

        }
      
        
         
        }
      else {
        
      
        const approvedGroup=await this.campaignGroup.findOne({where:{id:group_id}})

        if(!approvedGroup) {

            throw new NotFoundException()
        }

        if( approvedGroup['dataValues']['created_by'] == created_by && (action_id == 1 || action_id == 2)) {

          throw new BadRequestException('You cannot Approve/Reject it')
      }
        
      
        const {group_name, type, isDefault, status, creation_type, csv_file_name, carrier , hand_set_type, age, gender,  income, location, connection_type, facebook_campaign_id, google_campaign_id, created_by_name, update_id, created_by : old_created_by = null, created_by_name: old_created_by_name = null, created_user_type : old_created_user_type = null, idx } = approvedGroup['dataValues']
    
        const createBody = {
            group_name,
            type,
            isDefault,
            status,
            creation_type,
            csv_file_name,
            carrier,
            hand_set_type,
            age,
            gender,
            income,
            facebook_campaign_id,
            google_campaign_id,
            location,
            connection_type,
            created_by : old_created_by,
            created_by_name : old_created_by_name,
            created_user_type : old_created_user_type,
            action,
            action_by : created_by,
            action_by_name : created_by_name,
            action_by_user_type : created_user_type,
            approved_by : username,
            idx
        }

        this.campaignGroupHistory.create(createBody)

        this.campaignGroup.update({ is_approved: false, is_rejected: false, approved_by: null, approved_at: null, action: 'DELETE' }, { where: { id: group_id } })
        
        this.campaignGroupTemp.create({...createBody, is_approved: false, is_rejected: false, update_id:approvedGroup.id ,approved_by: null, approved_at: null, action: 'DELETE'})
        
        }

        

  }
  

}
