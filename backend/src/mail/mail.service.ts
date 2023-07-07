import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailData } from './interfaces/mail-data.interface';

// TODO: Add translations
@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async confirmEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const emailConfirmTitle = 'Confirma tu email';
    const text1 = 'Hola!';
    const text2 = 'Necesitamos que confirmes tu correo electrónico.';
    const text3 =
      'Simplemente haz clic en el botón de abajo para confirmar tu dirección de correo electrónico.';
    const hash = mailData.data.hash;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      // text: `${this.configService.get('app.frontendDomain', {
      //   infer: true,
      // })}/confirm-email/${mailData.data.hash} ${emailConfirmTitle}`,
      text: 'confirm-email',
      template: 'activation',
      context: {
        title: emailConfirmTitle,
        // url: `${this.configService.get('app.frontendDomain', {
        //   infer: true,
        // })}/confirm-email/${mailData.data.hash}`,
        url: '#',
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
        hash,
      },
    });
  }

  async newStore(
    mailData: MailData<{
      name: string;
      email: string;
      NIF: string;
      phone_number: string;
      hash: string;
    }>,
  ): Promise<void> {
    const newStoreTitle = 'Una nueva tienda se ha registrado';
    const text1 = `Librería: ${mailData.data.name}`;
    const text2 = `Email: ${mailData.data.email}`;
    const text3 = `NIF: ${mailData.data.NIF}`;
    const text4 = `Número de teléfono: ${mailData.data.phone_number}`;
    const approveText = 'Aprobar';
    const rejectText = 'Rechazar';
    const hash = mailData.data.hash;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: newStoreTitle,
      // text: `${this.configService.get('app.frontendDomain', {
      //   infer: true,
      // })}/approve-store/${mailData.data.hash} ${newStoreTitle}`,
      text: 'new-store',
      template: 'approve-store',
      context: {
        title: newStoreTitle,
        // url: `${this.configService.get('app.frontendDomain', {
        //   infer: true,
        // })}/confirm-email/${mailData.data.hash}`,
        url_approve: '#',
        url_reject: '#',
        actionTitle: newStoreTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
        text4,
        approveText,
        rejectText,
        hash,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const resetPasswordTitle = 'Restablecer contraseña';
    const text1 = 'Hola!';
    const text2 = 'Recibimos una solicitud para restablecer la contraseña.';
    const text3 =
      'Simplemente presione el botón de abajo y siga las instrucciones.';
    const text4 =
      'Si no realizó esta solicitud, ignore este correo electrónico.';
    const hash = mailData.data.hash;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      // text: `${this.configService.get('app.frontendDomain', {
      //   infer: true,
      // })}/password-change/${mailData.data.hash} ${resetPasswordTitle}`,
      text: 'forgot-password',
      template: 'reset-password',
      context: {
        title: resetPasswordTitle,
        // url: `${this.configService.get('app.frontendDomain', {
        //   infer: true,
        // })}/password-change/${mailData.data.hash}`,
        url: '#',
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
        hash,
      },
    });
  }
}
