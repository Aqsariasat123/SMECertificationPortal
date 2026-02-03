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

  // Email Verification - sent when user sets up account
  async sendVerificationEmail(email: string, token: string, fullName: string): Promise<boolean> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .button-wrap { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin: 20px 0; word-break: break-all; font-size: 12px; color: #3a736d; }
          .note { background: #fef3c7; border-radius: 6px; padding: 12px 15px; font-size: 13px; color: #92400e; margin: 20px 0; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Official UAE SME Certification Platform</p>
            </div>
            <div class="content">
              <div class="title">Verify Your Email</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">Thank you for choosing SME Readiness Portal. Please verify your email address to complete your account setup.</p>
              <div class="button-wrap">
                <a href="${verifyUrl}" class="button">Verify My Email</a>
              </div>
              <p class="text" style="font-size: 12px; color: #6b7280;">If the button doesn't work, copy and paste this link:</p>
              <div class="link-box">${verifyUrl}</div>
              <div class="note">This verification link expires in 24 hours.</div>
            </div>
            <div class="footer">
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email - SME Readiness Portal',
      html,
    });
  }

  // Password Reset Email
  async sendPasswordResetEmail(email: string, token: string, fullName: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .button-wrap { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin: 20px 0; word-break: break-all; font-size: 12px; color: #3a736d; }
          .note { background: #fef3c7; border-radius: 6px; padding: 12px 15px; font-size: 13px; color: #92400e; margin: 20px 0; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Password Reset</p>
            </div>
            <div class="content">
              <div class="title">Reset Your Password</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We received a request to reset your password. Click the button below to set a new password.</p>
              <div class="button-wrap">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p class="text" style="font-size: 12px; color: #6b7280;">Or copy and paste this link:</p>
              <div class="link-box">${resetUrl}</div>
              <div class="note">This link expires in 1 hour. If you didn't request this, please ignore this email.</div>
            </div>
            <div class="footer">
              <p>Need help? Contact our support team.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - SME Readiness Portal',
      html,
    });
  }

  // Welcome Email - sent after account is verified
  async sendWelcomeEmail(email: string, fullName: string, role: string): Promise<boolean> {
    const dashboardUrl = role === 'sme'
      ? `${process.env.FRONTEND_URL}/sme`
      : `${process.env.FRONTEND_URL}/user/dashboard`;

    const roleContent = role === 'sme' ? {
      title: 'Welcome to SME Readiness Portal',
      subtitle: 'Your certification journey begins now',
      message: 'Your account has been verified successfully. You can now complete your company profile and submit your application to join the UAE\'s official SME Registry.',
      features: [
        'Complete your business profile',
        'Upload verification documents',
        'Submit for certification',
        'Get listed in the official registry',
      ],
      buttonText: 'Complete My Profile',
    } : {
      title: 'Welcome to SME Readiness Portal',
      subtitle: 'Your gateway to verified UAE businesses',
      message: 'Your account has been verified successfully. You now have full access to browse certified businesses and connect with verified SMEs across the UAE.',
      features: [
        'Browse certified businesses',
        'Send introduction requests',
        'View verified company profiles',
        'Access the official SME registry',
      ],
      buttonText: 'Explore Registry',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #3a736d; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
          .features-title { font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .feature-row { display: table; width: 100%; margin-bottom: 12px; }
          .feature-check { display: table-cell; width: 24px; vertical-align: top; padding-top: 2px; }
          .feature-check span { display: inline-block; width: 18px; height: 18px; background: #e6f4f1; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; color: #3a736d; }
          .feature-text { display: table-cell; color: #374151; font-size: 14px; padding-left: 10px; vertical-align: top; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Official UAE SME Certification Platform</p>
            </div>
            <div class="content">
              <div class="title">${roleContent.title}</div>
              <div class="subtitle">${roleContent.subtitle}</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">${roleContent.message}</p>
              <div class="divider"></div>
              <div class="features-title">What you can do</div>
              ${roleContent.features.map(f => `
                <div class="feature-row">
                  <div class="feature-check"><span>&#10003;</span></div>
                  <div class="feature-text">${f}</div>
                </div>
              `).join('')}
              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">${roleContent.buttonText}</a>
              </div>
            </div>
            <div class="footer">
              <p>Questions? Contact our support team anytime.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #3a736d; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .status-box { background: #e6f4f1; border-left: 4px solid #3a736d; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .status-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .status-value { font-size: 16px; font-weight: 600; color: #3a736d; }
          .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
          .steps-title { font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .step { display: table; width: 100%; margin-bottom: 15px; }
          .step-num { display: table-cell; width: 28px; vertical-align: top; }
          .step-num span { display: inline-block; width: 24px; height: 24px; background: #3a736d; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: white; font-weight: 600; }
          .step-content { display: table-cell; padding-left: 12px; vertical-align: top; }
          .step-title { font-weight: 600; color: #111827; font-size: 14px; }
          .step-desc { color: #6b7280; font-size: 13px; margin-top: 2px; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Certification Application</p>
            </div>
            <div class="content">
              <div class="title">Application Submitted</div>
              <div class="subtitle">Your certification journey has begun</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We have received the certification application for <strong>${companyName}</strong>. Your application is now queued for review.</p>

              <div class="status-box">
                <div class="status-label">Application Status</div>
                <div class="status-value">Submitted - Awaiting Review</div>
              </div>

              <div class="divider"></div>
              <div class="steps-title">What happens next</div>

              <div class="step">
                <div class="step-num"><span>1</span></div>
                <div class="step-content">
                  <div class="step-title">Document Review</div>
                  <div class="step-desc">Our team reviews your documents and company information</div>
                </div>
              </div>
              <div class="step">
                <div class="step-num"><span>2</span></div>
                <div class="step-content">
                  <div class="step-title">Verification</div>
                  <div class="step-desc">You'll receive an email when your review begins</div>
                </div>
              </div>
              <div class="step">
                <div class="step-num"><span>3</span></div>
                <div class="step-content">
                  <div class="step-title">Certification</div>
                  <div class="step-desc">Once approved, your business joins the official registry</div>
                </div>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">Track Application</a>
              </div>
            </div>
            <div class="footer">
              <p>Expected review time: 24-48 business hours</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Application Received - SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #3a736d; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .status-box { background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .status-label { font-size: 12px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .status-value { font-size: 16px; font-weight: 600; color: #92400e; }
          .info-box { background: #f0fdf4; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .info-text { color: #166534; font-size: 13px; margin: 0; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Certification Status Update</p>
            </div>
            <div class="content">
              <div class="title">Verification In Progress</div>
              <div class="subtitle">Your application is being reviewed</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">Our certification team has begun reviewing your application for <strong>${companyName}</strong>.</p>

              <div class="status-box">
                <div class="status-label">Application Status</div>
                <div class="status-value">Under Review</div>
              </div>

              <div class="info-box">
                <p class="info-text">Your documents and company information are being carefully verified. You'll receive a notification once the review is complete.</p>
              </div>

              <p class="text">Please ensure your contact details are up to date in case our team needs to reach you.</p>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">View Status</a>
              </div>
            </div>
            <div class="footer">
              <p>Expected completion: 24-48 business hours</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #10b981; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .status-box { background: #d1fae5; border-left: 4px solid #10b981; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .status-label { font-size: 12px; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .status-value { font-size: 16px; font-weight: 600; color: #065f46; }
          .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
          .benefits-title { font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .benefit-row { display: table; width: 100%; margin-bottom: 12px; }
          .benefit-check { display: table-cell; width: 24px; vertical-align: top; padding-top: 2px; }
          .benefit-check span { display: inline-block; width: 18px; height: 18px; background: #d1fae5; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; color: #10b981; }
          .benefit-text { display: table-cell; color: #374151; font-size: 14px; padding-left: 10px; vertical-align: top; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #10b981; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Certification Approved</p>
            </div>
            <div class="content">
              <div class="title">Congratulations!</div>
              <div class="subtitle">Your business is now certified</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We are pleased to inform you that <strong>${companyName}</strong> has been successfully verified and certified. Your business is now listed in the UAE SME Registry.</p>

              <div class="status-box">
                <div class="status-label">Certification Status</div>
                <div class="status-value">Certified & Active</div>
              </div>

              <div class="divider"></div>
              <div class="benefits-title">Your benefits</div>

              <div class="benefit-row">
                <div class="benefit-check"><span>&#10003;</span></div>
                <div class="benefit-text">Listed in the Official UAE SME Registry</div>
              </div>
              <div class="benefit-row">
                <div class="benefit-check"><span>&#10003;</span></div>
                <div class="benefit-text">Verified Business Credibility Badge</div>
              </div>
              <div class="benefit-row">
                <div class="benefit-check"><span>&#10003;</span></div>
                <div class="benefit-text">Access to Introduction Requests</div>
              </div>
              <div class="benefit-row">
                <div class="benefit-check"><span>&#10003;</span></div>
                <div class="benefit-text">Enhanced Visibility on the Platform</div>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">View My Profile</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for being part of the UAE SME ecosystem.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Congratulations! Your Business is Certified - SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #f59e0b; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .status-box { background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .status-label { font-size: 12px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .status-value { font-size: 16px; font-weight: 600; color: #92400e; }
          .notes-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 25px 0; }
          .notes-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
          .notes-content { color: #374151; font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #f59e0b; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Application Update Required</p>
            </div>
            <div class="content">
              <div class="title">Additional Information Needed</div>
              <div class="subtitle">Action required to proceed</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We've reviewed the certification application for <strong>${companyName}</strong> and need some additional information before we can proceed.</p>

              <div class="status-box">
                <div class="status-label">Application Status</div>
                <div class="status-value">Revision Requested</div>
              </div>

              <div class="notes-box">
                <div class="notes-label">Reviewer Feedback</div>
                <div class="notes-content">${revisionNotes}</div>
              </div>

              <p class="text">Please update your application with the requested information and resubmit.</p>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">Update Application</a>
              </div>
            </div>
            <div class="footer">
              <p>Need help? Contact our support team.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Action Required: Update Your Application - SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
          .header { background: #3a736d; color: white; padding: 35px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 6px 0 0; opacity: 0.85; font-size: 13px; }
          .content { padding: 35px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 25px; font-weight: 500; }
          .text { color: #4b5563; font-size: 14px; margin-bottom: 20px; line-height: 1.7; }
          .status-box { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .status-label { font-size: 12px; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .status-value { font-size: 16px; font-weight: 600; color: #991b1b; }
          .notes-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 25px 0; }
          .notes-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
          .notes-content { color: #374151; font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
          .info-box { background: #f0fdf4; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .info-text { color: #166534; font-size: 13px; margin: 0; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Application Status Update</p>
            </div>
            <div class="content">
              <div class="title">Application Update</div>
              <div class="subtitle">Review completed</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We have completed our review of the certification application for <strong>${companyName}</strong>. Unfortunately, we are unable to approve the application at this time.</p>

              <div class="status-box">
                <div class="status-label">Application Status</div>
                <div class="status-value">Not Approved</div>
              </div>

              <div class="notes-box">
                <div class="notes-label">Reason</div>
                <div class="notes-content">${rejectionReason}</div>
              </div>

              <div class="info-box">
                <p class="info-text">If you have questions about this decision, our support team is available to help.</p>
              </div>

              <div class="button-wrap">
                <a href="${supportUrl}" class="button">Contact Support</a>
              </div>
            </div>
            <div class="footer">
              <p>We appreciate your interest in the SME Readiness Portal.</p>
              <p style="margin-top: 10px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Application Status Update - SME Readiness Portal',
      html,
    });
  }
}

export const emailService = new EmailService();
