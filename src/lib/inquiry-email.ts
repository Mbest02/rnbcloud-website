import nodemailer from 'nodemailer';
export type Inquiry = { name: string; organization: string; email: string; phone: string; interest: string; message: string };
type Mail = { from: { name: string; address: string }; to: string; replyTo: string; subject: string; text: string };
type Sender = (mail: Mail) => Promise<{ accepted?: unknown[] }>;

// Once the sales message is accepted, acknowledgment failure must not encourage
// resubmission of an inquiry already delivered to the mail server.
export async function sendInquiryEmails(inquiry: Inquiry, send: Sender) {
  const from = { name: 'RnB Cloud', address: process.env.GOOGLE_SMTP_USER || 'support@rnbcloud.com' };
  const sales = 'sales@rnbcloud.com';
  const result = await send({ from, to: sales, replyTo: inquiry.email,
    subject: 'New website consultation request',
    text: `A new inquiry was submitted through rnbcloud.com.\n\nName: ${inquiry.name}\nOrganization: ${inquiry.organization || 'Not provided'}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || 'Not provided'}\nService: ${inquiry.interest || 'General inquiry'}\n\nMessage:\n${inquiry.message}\n\nUnconverted inquiry retention: 12 months after the last inquiry-related contact.\n`,
  });
  if (!result.accepted?.some(address => String(address).toLowerCase() === sales)) throw new Error('Sales recipient not accepted');
  try {
    const acknowledgment = await send({ from, to: inquiry.email, replyTo: sales,
      subject: 'We received your request — RnB Cloud',
      text: 'Thank you for contacting RnB Cloud.\n\nWe have received your request and will review it shortly. Our team will follow up to discuss your needs and the next step.\n\nIf you need to add anything, reply to this email or call 502-440-1380.\n\nRnB Cloud\nrnbcloud.com\n',
    });
    if (!acknowledgment.accepted?.some(address => String(address).toLowerCase() === inquiry.email.toLowerCase())) throw new Error('Acknowledgment not accepted');
    return { acknowledgmentSent: true };
  } catch {
    console.warn('inquiry_acknowledgment_failed'); // No inquiry content or credentials in logs.
    return { acknowledgmentSent: false };
  }
}
export async function deliverGoogleInquiry(inquiry: Inquiry) {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: process.env.GOOGLE_SMTP_USER, pass: process.env.GOOGLE_SMTP_APP_PASSWORD },
    connectionTimeout: 7000, greetingTimeout: 7000, socketTimeout: 10000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try { return await sendInquiryEmails(inquiry, mail => transport.sendMail(mail)); }
  finally { transport.close(); }
}
