import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development' && !process.env.SMTP_PASS) {
        console.log('Email Service (Development Mode):');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html.replace(/<[^>]*>/g, ''));
        return true;
      }

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@smecertification.ae',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string, fullName: string): Promise<boolean> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${fullName}!</h2>
            <p>Thank you for setting up your account with SME Readiness Portal. Please verify your email address to complete your setup.</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #3a736d;">${verifyUrl}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>If you did not create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify your email - SME Readiness Portal',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string, fullName: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${fullName},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #3a736d;">${resetUrl}</p>
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
          </div>
          <div class="footer">
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset your password - SME Readiness Portal',
      html,
    });
  }

  // Welcome email - sent after account is verified
  async sendWelcomeEmail(email: string, fullName: string, role: string): Promise<boolean> {
    const dashboardUrl = role === 'sme'
      ? `${process.env.FRONTEND_URL}/sme`
      : `${process.env.FRONTEND_URL}/user/dashboard`;

    const roleMessage = role === 'sme'
      ? 'You can now complete your company profile and submit for certification.'
      : 'You can now browse certified businesses and send introduction requests through our official registry.';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .highlight { background: #e6f4f1; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3a736d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Welcome to SME Readiness Portal!</h2>
            <p>Hello ${fullName},</p>
            <p>Your account has been successfully set up and verified. You now have full access to the SME Readiness Portal.</p>
            <div class="highlight">
              <strong>What's Next?</strong><br>
              ${roleMessage}
            </div>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to SME Readiness Portal - Setup Complete',
      html,
    });
  }

  // Application Submitted - sent when SME submits certification
  async sendApplicationSubmittedEmail(email: string, fullName: string, companyName: string): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL}/sme/certification`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .info-box { background: #e6f4f1; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3a736d; }
          .steps { margin: 20px 0; }
          .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
          .step-number { background: #3a736d; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Certification Application Received</h2>
            <p>Hello ${fullName},</p>
            <p>We have received the certification application for <strong>${companyName}</strong>. Your application is now in the review queue.</p>
            <div class="info-box">
              <strong>Application Status:</strong> Submitted for Review<br>
              <strong>Expected Review Time:</strong> 24-48 business hours
            </div>
            <p><strong>What happens next?</strong></p>
            <div class="steps">
              <div class="step">
                <span class="step-number">1</span>
                <span>Our team will review your submitted documents and company information.</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span>You will receive an email notification when the review begins.</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span>Once approved, your certification will be issued and your business will be listed in the official registry.</span>
              </div>
            </div>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Track Application Status</a>
            </p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SME Readiness Portal for your certification needs.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Certification Application Received - SME Readiness Portal',
      html,
    });
  }

  // Verification In Progress - sent when admin starts reviewing
  async sendVerificationInProgressEmail(email: string, fullName: string, companyName: string): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL}/sme/certification`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .status-box { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Verification In Progress</h2>
            <p>Hello ${fullName},</p>
            <p>Good news! Our certification team has begun reviewing your application for <strong>${companyName}</strong>.</p>
            <div class="status-box">
              <strong>Current Status:</strong> Under Review<br>
              <strong>What this means:</strong> A member of our team is actively reviewing your documents and company information.
            </div>
            <p>You will receive another notification once the review is complete. This typically takes 24-48 business hours from the start of review.</p>
            <p>Please ensure your contact information is up to date in case we need to reach you.</p>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">View Application Status</a>
            </p>
          </div>
          <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your Application is Under Review - SME Readiness Portal',
      html,
    });
  }

  // Certification Issued - sent when application is approved
  async sendCertificationIssuedEmail(email: string, fullName: string, companyName: string): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL}/sme`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .success-box { background: #d1fae5; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; text-align: center; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .benefits { margin: 20px 0; }
          .benefit { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .benefit:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <div class="success-icon">&#10003;</div>
              <h2 style="margin: 0; color: #065f46;">Certification Approved!</h2>
            </div>
            <p>Hello ${fullName},</p>
            <p>Congratulations! We are pleased to inform you that <strong>${companyName}</strong> has been successfully certified and is now listed in the official UAE SME Registry.</p>
            <p><strong>Your certification benefits:</strong></p>
            <div class="benefits">
              <div class="benefit">&#10003; Listed in the Official UAE SME Registry</div>
              <div class="benefit">&#10003; Verified business credibility badge</div>
              <div class="benefit">&#10003; Access to registry users and introduction requests</div>
              <div class="benefit">&#10003; Enhanced visibility for your business</div>
            </div>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>Thank you for being part of the SME Readiness Portal.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Congratulations! Your Certification is Approved - SME Readiness Portal',
      html,
    });
  }

  // Revision Required - sent when additional information is needed
  async sendRevisionRequiredEmail(email: string, fullName: string, companyName: string, revisionNotes: string): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL}/sme/certification`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .warning-box { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .revision-notes { background: #fff; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Additional Information Required</h2>
            <p>Hello ${fullName},</p>
            <p>We have reviewed the certification application for <strong>${companyName}</strong> and require some additional information or revisions before we can proceed.</p>
            <div class="warning-box">
              <strong>Action Required:</strong> Please review the notes below and update your application accordingly.
            </div>
            <div class="revision-notes">
              <strong>Reviewer Notes:</strong>
              <p style="white-space: pre-wrap;">${revisionNotes}</p>
            </div>
            <p>Please log in to your dashboard to make the necessary updates and resubmit your application.</p>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Update Application</a>
            </p>
          </div>
          <div class="footer">
            <p>If you have any questions about the required changes, please contact our support team.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Action Required: Additional Information Needed - SME Readiness Portal',
      html,
    });
  }

  // Application Rejected - sent when application is rejected
  async sendApplicationRejectedEmail(email: string, fullName: string, companyName: string, rejectionReason: string): Promise<boolean> {
    const supportUrl = `${process.env.FRONTEND_URL}/sme/support`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3a736d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          .rejection-box { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .reason-notes { background: #fff; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SME Readiness Portal</h1>
          </div>
          <div class="content">
            <h2>Application Update</h2>
            <p>Hello ${fullName},</p>
            <p>We regret to inform you that the certification application for <strong>${companyName}</strong> could not be approved at this time.</p>
            <div class="rejection-box">
              <strong>Application Status:</strong> Not Approved
            </div>
            <div class="reason-notes">
              <strong>Reason:</strong>
              <p style="white-space: pre-wrap;">${rejectionReason}</p>
            </div>
            <p>If you believe this decision was made in error or would like to discuss your application further, please contact our support team.</p>
            <p style="text-align: center;">
              <a href="${supportUrl}" class="button">Contact Support</a>
            </p>
          </div>
          <div class="footer">
            <p>Thank you for your interest in SME Readiness Portal.</p>
            <p>SME Readiness Portal - UAE</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Certification Application Update - SME Readiness Portal',
      html,
    });
  }
}

export const emailService = new EmailService();
