import { storage } from './adminStorage';

export interface EmailResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendAdminEmail(to: string, subject: string, text: string): Promise<EmailResult> {
  const mailgun = storage.get('fk_mailgun_config');
  
  if (!mailgun || !mailgun.domain || !mailgun.apiKey || !mailgun.senderEmail) {
    console.warn('Mailgun SMTP is not configured. Email was not sent.');
    return { success: false, error: 'Mailgun SMTP not configured in Admin Settings' };
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        text,
        mailgunDomain: mailgun.domain,
        mailgunApiKey: mailgun.apiKey,
        mailgunSender: mailgun.senderEmail
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'API Error' };
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error('Failed to send email via API:', error);
    return { success: false, error: error.message };
  }
}
