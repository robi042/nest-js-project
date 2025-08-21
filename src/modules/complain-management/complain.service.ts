import { Injectable, Inject, BadRequestException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import {ComplainModel} from '../../models'
import {Complain} from '../../config/constants'
import { Sequelize} from 'sequelize-typescript';
import { Op } from 'sequelize';


import {winstonLog} from '../../config/winstonLog'


@Injectable()
export class ComplainService {

    constructor(
        @Inject(Complain) private readonly complain: typeof ComplainModel
      
    ) { }

    async createComplain(reqbody, userinfo) {

        let {id, username = null, roleid = 0, mobile=null, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile

        const {complain_title = '', complain_description = '', complain_priority = '', image_url = '', category = ''} = reqbody

        const createBody = {
            complain_title,
            complain_description,
            complain_priority,
            image_url,
            category,
            created_by,
            created_by_name,
            created_user_type,
            action : "INSERT",
            status: "pending",
            idx
        }

        return await this.complain.create(createBody)
    }

    //by admin/admin user..
    async getAllComplain(userinfo) {

        let {id, username = null, roleid = 0, idx = 0} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`

        idx = (created_user_type == 2 && idx) ? idx  : (created_user_type == 1) ? 0 : -1

        if(created_user_type == 1) {

            return this.complain.findAll<ComplainModel>({ order : [['id','DESC']] })

        }
        else {

            return this.complain.findAll<ComplainModel>({ where : { created_by}, order :[['id','DESC']]})

        }
    }

    // edit..
    async editComplain(reqbody, userinfo) {

        let {id, username = null, roleid = 0, mobile=null} = userinfo

        const created_user_type = (username && roleid) ? 1 : 2
        const created_by = `${id}`, created_by_name = username ? username : mobile
       
        const {id:compId, complain_title, complain_description, complain_priority, image_url, category, status, assign_to, idx} = reqbody

        const compInfo=await this.complain.findOne({where: {
            [Op.and]: [
              { id: compId }
            ],
        }
        })

        const createBody = {
            complain_title,
            complain_description,
            complain_priority,
            image_url,
            category,
            status,
            assign_to,
            idx,
            created_by,
            created_by_name,
            created_user_type,
            action : "UPDATE",
        }
        
        if (compInfo) {
            
            return this.complain.update( createBody , { where: { id: compId } })
            
        } else {
            return 'No Complain found'
        }
    }

    // delete..
    async deleteComplain(reqbody){
        const {complain_id} = reqbody

        const complaininfo = await this.complain.findOne({ where : { id : complain_id} })

        if(!complaininfo) {

            throw new NotFoundException()
        }

        this.complain.destroy({ where : { id : complain_id}})
        return "Successfully deleted"

    }
}