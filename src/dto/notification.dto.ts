import { IsNotEmpty, MinLength, IsDate, IsEmail, IsEnum, isEmpty, isBoolean, IsBoolean, IsNumber,IsString,IsNumberString, IsOptional, IsArray , ValidateNested, ArrayMinSize} from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationCreateDto{
    
    readonly id

    @IsNotEmpty()
    readonly  Notification_Title

    @IsNotEmpty()
    readonly Notification_Body

    readonly viaSMS
    readonly viaEmail
    readonly viaPushNotification
    readonly Created_By
    readonly Created_Date
}



export class FacebookCampaignConfigObj {

    @IsNotEmpty()
    @IsNumberString()
    readonly app_id: string;

    @IsNotEmpty()
    readonly app_secret: string;

    @IsNotEmpty()
    readonly user_token: string;


    @IsNotEmpty()
    @IsNumberString()
    readonly pageId: string;

    @IsNotEmpty()
    @IsNumberString()
    readonly adAccountId: string;
}

export class BulkNotificationGroupGroupMapDto{

    @IsNotEmpty()
    readonly msisdn: string;

    @IsOptional()
    readonly email: string;
}
export class BulkNotificationGroupDto {

    @IsNotEmpty()
    readonly group_name: string;

    @IsOptional()
    @IsNumber()
    readonly idx: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => BulkNotificationGroupGroupMapDto)
    readonly group_map: BulkNotificationGroupGroupMapDto[];

}

export class BulkNotificationGroupDetailsDto {

    @IsNotEmpty()
    @IsNumber()
    readonly group_id: string;

    @IsOptional()
    @IsBoolean()
    readonly is_pending: boolean;

}

export class BulkNotificationDto {

    @IsNotEmpty()
    @IsNumber()
    readonly group_id: string;

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly body: string;

    @IsOptional()
    @IsBoolean()
    readonly fb_page_post: boolean;

    @IsOptional()
    @IsBoolean()
    readonly sms: boolean;

    @IsOptional()
    @IsBoolean()
    readonly push_notification: boolean;

    @IsOptional()
    @IsBoolean()
    readonly email: boolean;

    @IsOptional()
    @IsBoolean()
    readonly whatsapp: boolean;

    @IsOptional()
    @IsBoolean()
    readonly instagram: boolean;

    @IsOptional()
    @IsBoolean()
    readonly twitter: boolean;

}