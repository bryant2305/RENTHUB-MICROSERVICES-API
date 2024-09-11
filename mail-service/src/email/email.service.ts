import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// ...

// EmailService

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(name: string, email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to my RENT-HUB App!',
        template: '../../../src/email/templates/welcome',
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
