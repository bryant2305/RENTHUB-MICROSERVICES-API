import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('MailService', 'sendWelcomeEmail')
  async create(@Payload() createEmailDto: CreateEmailDto) {
    console.log('eee');
    return this.emailService.sendWelcomeEmail(
      createEmailDto.name,
      createEmailDto.email,
    );
  }
}
