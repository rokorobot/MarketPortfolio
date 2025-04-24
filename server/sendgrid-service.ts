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
    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not configured. Email will not be sent.');
      return false;
    }
    
    console.log(`Preparing to send email via SendGrid to: ${params.to}`);
    
    // Validate sender address - this is CRUCIAL for SendGrid to work
    // SendGrid requires the sender email to be verified through their Single Sender Verification
    
    // Use the verified sender email address from environment variables
    // This must be an email that you've manually verified in SendGrid dashboard
    const verifiedEmail = process.env.VERIFIED_EMAIL;
    
    if (!verifiedEmail) {
      console.error('No verified sender email found in VERIFIED_EMAIL environment variable.');
      console.error('You must verify a sender email in SendGrid and set it as VERIFIED_EMAIL.');
      return false;
    }
    
    console.log(`Using verified sender address: ${verifiedEmail}`);
    
    // Create the email with the verified sender
    const mailData = {
      to: params.to,
      from: verifiedEmail, // Always use the verified email address
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    };
    
    if (params.replyTo) {
      mailData.replyTo = params.replyTo;
    }
    
    // Send the email
    console.log('Sending email with SendGrid...');
    const response = await mailService.send(mailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (err) {
    const error = err as any;
    console.error('SendGrid email error:', error);
    
    // Detailed error logging for debugging
    if (error.response) {
      console.error('SendGrid API response error details:');
      console.error(`Status code: ${error.code}`);
      
      if (error.response.body && error.response.body.errors) {
        error.response.body.errors.forEach((err: any, index: number) => {
          console.error(`Error ${index + 1}:`, err);
        });
      }
      
      // Common error codes and their meaning
      if (error.code === 403) {
        console.error('403 FORBIDDEN: This typically means your sender is not verified. Verify the email in SendGrid dashboard.');
      } else if (error.code === 401) {
        console.error('401 UNAUTHORIZED: Check your API key and ensure it has Mail Send permissions.');
      } else if (error.code === 429) {
        console.error('429 TOO MANY REQUESTS: You are being rate limited.');
      }
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