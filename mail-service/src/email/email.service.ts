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

  async sendReservationEmail(
    name: string,
    email: string,
    title: string,
    address: string,
    checkIn: string,
    checkOut: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Thanks you for booking',
        template: '../../../src/email/templates/reservation',
        context: {
          name: `${name}`,
          email: `${email}`,
          title: `${title}`,
          address: `${address}`,
          checkIn: `${checkIn}`,
          checkOut: `${checkOut}`,
        },
      });
      return true;
    } catch (error) {
      console.log(error, 'error al mandar el correo');
      return error;
    }
  }
}
