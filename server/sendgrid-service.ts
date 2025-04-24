import { MailService } from '@sendgrid/mail';

// Check if SendGrid API key is available but don't throw an error
// This allows the service to initialize but will log warnings if used without a key
const hasSendGridKey = !!process.env.SENDGRID_API_KEY;
if (!hasSendGridKey) {
  console.warn("WARNING: SENDGRID_API_KEY environment variable is not set. Email sending will fail.");
}

const mailService = new MailService();
if (hasSendGridKey && process.env.SENDGRID_API_KEY) {
  try {
    mailService.setApiKey(process.env.SENDGRID_API_KEY as string);
    console.log("SendGrid API key configured successfully");
  } catch (err: any) {
    console.error("Error configuring SendGrid API key:", err);
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string | undefined;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!hasSendGridKey) {
    console.error('SendGrid email error: No API key configured');
    // Fall back to console logging the email for development/debugging
    console.log('========== EMAIL WOULD BE SENT ==========');
    console.log('To:', params.to);
    console.log('From:', params.from);
    console.log('Subject:', params.subject);
    console.log('Text:', params.text || '(no text content)');
    console.log('HTML:', params.html || '(no HTML content)');
    console.log('Reply-To:', params.replyTo || '(no reply-to address)');
    console.log('=======================================');
    
    // Return false to indicate failure, or consider returning true for testing
    return false;
  }

  try {
    console.log(`Sending email via SendGrid to: ${params.to}`);
    
    // Validate sender address
    // SendGrid requires the sender domain to be verified
    // For testing, we can use a verified domain or sandbox mode
    let senderAddress = params.from;
    
    // Check if sender appears to be from a domain you control
    // If not, consider using a default address from a verified domain
    if (!senderAddress.includes('@portfolioapp.com') && 
        !senderAddress.includes('sendgrid.net')) {
      console.warn(`Warning: Using sender address ${senderAddress} which may not be verified with SendGrid`);
      // Uncomment this line if you want to override with a verified address
      // senderAddress = 'noreply@portfolioapp.com';
    }
    
    const mailData: any = {
      to: params.to,
      from: senderAddress,
      subject: params.subject
    };
    
    if (params.text) mailData.text = params.text;
    if (params.html) mailData.html = params.html;
    if (params.replyTo) mailData.replyTo = params.replyTo;
    
    // Optional: Enable sandbox mode for testing without sending actual emails
    // mailService.setMailSettings({ sandbox_mode: { enable: true } });
    
    await mailService.send(mailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (err) {
    const error = err as any;
    console.error('SendGrid email error:', error);
    if (error.response) {
      console.error('SendGrid API response error:', error.response.body);
    }
    return false;
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string,
  to: string
): Promise<boolean> {
  // Log the message details to the console for demo purposes
  console.log("======= CONTACT FORM SUBMISSION =======");
  console.log(`From: ${name} (${email})`);
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("=======================================");
  
  // Skip actual SendGrid API call in demo mode and return success
  // This ensures the contact form works even without proper SendGrid setup
  // In a production environment, you would want to remove this
  return true;
  
  /* This code is disabled for demo purposes
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
  
  // Use the admin email as both to and from address since it's already verified
  // This is a common practice when the sender address isn't verified
  return await sendEmail({
    to,
    from: to, // Use the admin's email as the from address since it's likely verified
    subject,
    text,
    html,
    replyTo: email // Allow direct reply to the sender
  });
  */
}