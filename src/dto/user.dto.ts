
import { IsNotEmpty, MinLength, IsEmail, IsEnum, isEmpty, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export class UserDto {
    @ApiProperty({ 
        description: 'The Name of user',
        default: "Shahin",
    })
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Gender, {
        message: 'gender must be either male or female',
    })
    readonly gender: Gender;
}

export class UserEmailDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}