
import { IsNotEmpty, MinLength, IsEmail, IsEnum, isEmpty, IsNumberString, isBoolean, IsObject, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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

    @IsOptional()
    readonly instagram_actor_id: string;

}

export class FacebookPagePostCRDDto {

    @IsNotEmpty()
    @IsNumberString()
    readonly facebook_pagepost_page_id: string;

}

export class CampaignConfigDto {

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => FacebookCampaignConfigObj)
    readonly facebook: FacebookCampaignConfigObj;

}

export class CampaignQuotaDto {

    @IsOptional()
    @IsNumber()
    readonly facebook: string;

    @IsOptional()
    @IsNumber()
    readonly google: string;

    @IsOptional()
    @IsNumber()
    readonly whatsapp: string;

    @IsOptional()
    @IsNumber()
    readonly sms: string;

    @IsOptional()
    @IsNumber()
    readonly email: string;

    @IsOptional()
    @IsNumber()
    readonly push_notification: string;

    @IsOptional()
    @IsNumber()
    readonly instagram: string;

}

export class ComplainDto {

    @IsOptional()
    // @IsNumber()
    readonly complain_title: string;

    @IsOptional()
    // @IsNumber()
    readonly complain_description: string;

    @IsOptional()
    // @IsNumber()
    readonly complain_priority: string;

    @IsOptional()
    // @IsNumber()
    readonly image_url: string;

    @IsOptional()
    // @IsNumber()
    readonly category: string;

}
