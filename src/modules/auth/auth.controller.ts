import { Controller, Body, Post, UseGuards, Request, Injectable,UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginAuthDto} from '../../dto'
import {UNAUTHORIZED} from '../../helpers/responseHelper'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('v1/login')
    async login(@Request() req, @Body() login :LoginAuthDto) {
        const user = await this.authService.validateUser(login.username,login.password);
        if (!user) {
         throw new UnauthorizedException(UNAUTHORIZED(req.i18n.__('invalidusercredentials'),req));
        }
        return await this.authService.login(user);
         
    }

    @Post('v1/token_generate')
    async tokenGenerate(@Request() req, @Body() login :LoginAuthDto) {
        const user = {username : login.username, login_time : Date.now()};
        return await this.authService.login(user);
    }

}