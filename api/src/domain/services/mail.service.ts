import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { SendMailDto } from '../dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(sendMailDto: SendMailDto): Promise<any> {
    return await this.mailerService.sendMail({
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      html: sendMailDto.html,
      template: sendMailDto.template,
      context: sendMailDto.context,
    });
  }
}
