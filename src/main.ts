import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express'
import {expressBind} from 'i18n-2'
import {localize} from './middleware'
import { ValidateInputPipe } from './middleware/validate';
import {AuthModuleGuard} from './middleware/guards'
import {nestwinstonLog, HttpPortLog} from './config/winstonLog'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

 const app = await NestFactory.create<NestExpressApplication>(AppModule,{
  logger:  nestwinstonLog,
})
 // global prefix
  app.setGlobalPrefix('pmnsapi')
  
   expressBind(app, {locales: [ 'en' ] })
 
   app.use(localize)

   //handle browser cros..
   app.enableCors()
  // handle all user input validation globally

  app.useGlobalPipes(new ValidateInputPipe());

  //use globally to check auth module from request header
  app.useGlobalGuards(new AuthModuleGuard())

  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .addBearerAuth(
    { 
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header',
    }
  )
  .addBearerAuth(
    { 
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Module',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header',
    }
  )
  .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, () => HttpPortLog(process.env.PORT || 3000));
}

bootstrap();
