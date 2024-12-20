'use server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  //   secure: process.env.NODE_ENV !== 'production',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

export type SendMailTo = {
  sender: Mail.Address;
  recipients: Mail.Address[];
  subject: string;
  message: string;
};

export const sendMail = async (
  dto: SendMailTo
) => {
  const { sender, recipients, subject, message } =
    dto;

  return await transport.sendMail({
    from: sender,
    to: recipients,
    subject,
    text: message,
    html: message,
  });
};
