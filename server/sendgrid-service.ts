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

// Interface matching SendGrid's MailDataRequired format
interface SendGridMailData {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  [key: string]: any; // Allow additional properties
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
    
    // DEBUGGING: Let's output the current VERIFIED_EMAIL value
    console.log('VERIFIED_EMAIL environment variable is:', process.env.VERIFIED_EMAIL);
    
    // Use the verified sender email address from environment variables
    // This must be an email that you've manually verified in SendGrid dashboard
    const verifiedEmail = process.env.VERIFIED_EMAIL || 'customer@nftfolio.app';
    
    console.log(`Using verified sender address: ${verifiedEmail}`);
    
    // Create the email with the verified sender
    // Use the exact same structure as the working direct API calls
    const mailData = {
      personalizations: [
        {
          to: [
            {
              email: params.to
            }
          ]
        }
      ],
      from: {
        email: verifiedEmail
      },
      subject: params.subject,
      content: [
        {
          type: "text/plain",
          value: params.text || ''
        }
      ]
    };
    
    // Add HTML content if provided
    if (params.html) {
      mailData.content.push({
        type: "text/html",
        value: params.html
      });
    }
    
    // Add reply-to if provided
    if (params.replyTo) {
      (mailData as any).replyTo = {
        email: params.replyTo
      };
    }
    
    // Send the email
    console.log('Sending email with SendGrid...');
    console.log('Mail data being sent:', JSON.stringify(mailData, null, 2));
    await mailService.send(mailData as any);
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
  // Log the message details to the console for debugging purposes
  console.log("======= CONTACT FORM SUBMISSION =======");
  console.log(`From: ${name} (${email})`);
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("=======================================");
  
  const subject = `New Contact Form Submission from ${name}`;
  const text = `Name: ${name}
Email: ${email}

Message:
${message}`;
  
  // Use the same simple format as the API tests with required HTML content
  return await sendEmail({
    to,
    from: process.env.VERIFIED_EMAIL || 'customer@nftfolio.app',
    subject,
    text,
    html: text.replace(/\n/g, '<br>'), // Convert text to simple HTML
    replyTo: email // Allow direct reply to the sender
  });
}