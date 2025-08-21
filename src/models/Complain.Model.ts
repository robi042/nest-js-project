import { Table, Column, Model, Sequelize, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'complain' })
export class ComplainModel extends Model {
    @Column({
        type: DataType.BIGINT,
        autoIncrement : true,
        primaryKey: true
    })
    id: bigint;

    @Column({
        type: DataType.TEXT,
    })
    complain_title : string
    
    @Column({
        type: DataType.TEXT,
    })
    complain_description : string
  
    @Column({
        type: DataType.TEXT,
    })
    complain_priority : string
    
    @Column({
        type: DataType.TEXT,
    })
    image_url : string
   
    @Column({
        type: DataType.TEXT,
    })
    category : string

    @Column({
        type: DataType.TEXT,
    })
    status : string

    @Column({
        type: DataType.TEXT,
    })
    assign_to : string
    
    @Column({
        type: DataType.INTEGER,
        defaultValue : 0
    })
    idx : number

    @Column({
        type: DataType.TEXT
    })  
    created_by : string
    
    @Column({
        type: DataType.TEXT
    })  
    created_by_name : string

   //1 = admin/admin users, 2 = merchant/merchent users
    @Column({
        type: DataType.SMALLINT,
        defaultValue : 2
    })
    created_user_type : number


    @Column({
        type: DataType.DATE,
        defaultValue : Sequelize.literal("(now() at time zone 'utc')")
    })
    created_at : Date

    @Column({
        type: DataType.TEXT
    })
    action : string

}