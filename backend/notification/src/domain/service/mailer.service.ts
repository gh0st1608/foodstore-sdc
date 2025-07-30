import { Mailer } from "../interfaces/mailer.interface";

export interface MailerService {
  sendEmail(mailer : Mailer): Promise<void>;
}

export const MailerServiceSymbol = Symbol('MailerService');
