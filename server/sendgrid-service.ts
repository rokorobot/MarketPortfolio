import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string | undefined;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const mailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject
    };
    
    if (params.text) mailData.text = params.text;
    if (params.html) mailData.html = params.html;
    if (params.replyTo) mailData.replyTo = params.replyTo;
    
    await mailService.send(mailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string,
  to: string
): Promise<boolean> {
  const subject = `New Contact Form Submission from ${name}`;
  const text = `
Name: ${name}
Email: ${email}

Message:
${message}
  `;
  
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <p><strong>From:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
    <h3 style="color: #555;">Message:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
</div>
  `;
  
  return await sendEmail({
    to,
    from: 'no-reply@portfolioshowcase.com', // This should be a verified sender in your SendGrid account
    subject,
    text,
    html,
    replyTo: email // Allow direct reply to the sender
  });
}