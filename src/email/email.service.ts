export const MAILER_TOKEN = 'MAILER_SERVICE';

export abstract class Mailer {
  abstract sendNewMatchEmail(data: NewMatchEmailData): Promise<void>;
  // You could add other email types here in the future
  // abstract sendPasswordResetEmail(email: string, token: string): Promise<void>;
}

export interface NewMatchEmailData {
  clientEmail: string;
  clientName: string;
  projectId: number;
  vendorName: string;
  matchScore: number;
}
