import { Mailer } from "../interfaces/mailer.interface";

export interface SesMailerService {
  sendEmail(mailer : Mailer): Promise<void>;
}

export const SesMailerServiceSymbol = Symbol('SesMailerService');
