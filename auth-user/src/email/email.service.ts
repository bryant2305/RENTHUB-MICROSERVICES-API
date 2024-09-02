import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// ...

// EmailService

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to my ApiWithMicroservice App!',
        template: './welcome',
        context: {
          name: `${name}`,
          email: `${email}`,
        },
      });
      return true;
    } catch (error) {
      console.log(error, 'error al mandar el correo');
      return error;
    }
  }
}
