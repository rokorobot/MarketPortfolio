import nodemailer from 'nodemailer';

// Create a transporter - for demo/dev environments we can use a test account
let transporter: nodemailer.Transporter;

// Initialize the transporter - using Ethereal Mail for testing
// Ethereal is a fake SMTP service that captures emails instead of sending them
async function initializeTransporter() {
  // Create a test account at Ethereal
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a transporter using the test account credentials
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  
  console.log('Nodemailer initialized with Ethereal test account');
  console.log('Test emails can be viewed at: https://ethereal.email/login');
  console.log('Username:', testAccount.user);
  console.log('Password:', testAccount.pass);
  
  return transporter;
}

// Function to get or initialize the transporter
async function getTransporter() {
  if (!transporter) {
    return await initializeTransporter();
  }
  return transporter;
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const transport = await getTransporter();
    
    const info = await transport.sendMail({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo
    });
    
    console.log('Message sent: %s', info.messageId);
    
    // If using Ethereal, show the preview URL
    if (info.envelope.from.includes('ethereal.email')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Nodemailer email error:', error);
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
    from: to, // Use the admin's email as the from address
    subject,
    text,
    html,
    replyTo: email // Allow direct reply to the sender
  });
}