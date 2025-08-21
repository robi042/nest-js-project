import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { emailProvider } from './email.providers';
import { EmailService } from './email.service';

@Module({
  // imports: [MailerModule.forRoot({
  //   // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
  //   transport: {
  //     service: 'gmail',
  //     //host: 'smtp.example.com',
  //     secure: false,
  //     port: 587,
  //     auth: {
  //       user: process.env.EMAIL,
  //       pass: process.env.EMAIL_PASSWORD
  //     },
  //     tls: {
  //       rejectUnauthorized: false
  //       }
  //   }})],
  providers: [EmailService,...emailProvider],
  exports: [EmailService]
})
export class EmailModule {}
