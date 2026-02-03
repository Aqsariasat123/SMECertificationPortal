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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0; word-break: break-all; font-size: 13px; color: #3a736d; }
          .expire-note { background: #fef3c7; border-radius: 8px; padding: 12px 15px; font-size: 13px; color: #92400e; margin: 20px 0; }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
          .footer a { color: #3a736d; text-decoration: none; }
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
              <div class="greeting">Hello ${fullName}!</div>
              <p class="text">Thank you for choosing SME Readiness Portal. You're just one step away from accessing the UAE's trusted platform for SME certification and verification.</p>
              <p class="text">Please verify your email address to complete your secure account setup:</p>
              <div class="button-wrap">
                <a href="${verifyUrl}" class="button">Verify My Email</a>
              </div>
              <p class="text" style="font-size: 13px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="link-box">${verifyUrl}</div>
              <div class="expire-note">
                <strong>Security Notice:</strong> This verification link expires in 24 hours for your protection.
              </div>
            </div>
            <div class="footer">
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0; word-break: break-all; font-size: 13px; color: #3a736d; }
          .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 15px; font-size: 14px; color: #92400e; margin: 25px 0; }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Secure Password Reset</p>
            </div>
            <div class="content">
              <div class="greeting">Hello ${fullName},</div>
              <p class="text">We received a request to reset your password for your SME Readiness Portal account.</p>
              <p class="text">Click the secure button below to set a new password:</p>
              <div class="button-wrap">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              <p class="text" style="font-size: 13px; color: #6b7280;">Or copy this link into your browser:</p>
              <div class="link-box">${resetUrl}</div>
              <div class="warning-box">
                <strong>Important:</strong> This link expires in 1 hour for security. If you didn't request this reset, please ignore this email - your account remains secure.
              </div>
            </div>
            <div class="footer">
              <p>Need help? Contact our support team anytime.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
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
      title: 'Your Business Journey Starts Here',
      message: 'Your account is now verified and ready. Complete your company profile and submit for certification to join the UAE\'s official SME Registry.',
      features: [
        { icon: '&#128196;', text: 'Complete your business profile' },
        { icon: '&#128203;', text: 'Upload verification documents' },
        { icon: '&#9989;', text: 'Get certified and listed' },
        { icon: '&#127775;', text: 'Gain visibility to verified users' },
      ],
      buttonText: 'Complete My Profile',
    } : {
      title: 'Welcome to the UAE SME Registry',
      message: 'Your account is verified and you now have full access to browse certified businesses and connect with verified SMEs across the UAE.',
      features: [
        { icon: '&#128269;', text: 'Browse certified businesses' },
        { icon: '&#128172;', text: 'Send introduction requests' },
        { icon: '&#9989;', text: 'View verified company profiles' },
        { icon: '&#128274;', text: 'Secure and trusted platform' },
      ],
      buttonText: 'Explore Registry',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .success-banner { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
          .success-banner .icon { font-size: 40px; margin-bottom: 10px; }
          .success-banner h2 { margin: 0; font-size: 20px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .features { margin: 30px 0; }
          .feature { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .feature:last-child { border-bottom: none; }
          .feature-icon { font-size: 20px; margin-right: 15px; min-width: 30px; }
          .feature-text { color: #374151; font-size: 14px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Official UAE SME Certification Platform</p>
            </div>
            <div class="success-banner">
              <div class="icon">&#10003;</div>
              <h2>Account Verified Successfully!</h2>
            </div>
            <div class="content">
              <div class="greeting">${roleContent.title}</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">${roleContent.message}</p>
              <div class="features">
                ${roleContent.features.map(f => `
                  <div class="feature">
                    <span class="feature-icon">${f.icon}</span>
                    <span class="feature-text">${f.text}</span>
                  </div>
                `).join('')}
              </div>
              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">${roleContent.buttonText}</a>
              </div>
            </div>
            <div class="footer">
              <p>Questions? Our support team is here to help.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: role === 'sme'
        ? 'Welcome! Start Your Certification Journey - SME Readiness Portal'
        : 'Welcome to SME Readiness Portal - Account Verified',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .status-card { background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
          .status-icon { font-size: 50px; margin-bottom: 15px; }
          .status-title { font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 5px; }
          .status-subtitle { font-size: 14px; color: #3b82f6; }
          .timeline { margin: 30px 0; }
          .timeline-item { display: flex; margin-bottom: 20px; }
          .timeline-dot { width: 32px; height: 32px; background: #3a736d; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px; flex-shrink: 0; }
          .timeline-content { margin-left: 15px; padding-top: 5px; }
          .timeline-title { font-weight: 600; color: #111827; font-size: 14px; }
          .timeline-desc { color: #6b7280; font-size: 13px; margin-top: 3px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Certification Application Update</p>
            </div>
            <div class="content">
              <div class="greeting">Application Submitted!</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">Great news! We have received the certification application for <strong>${companyName}</strong>. Your application is now queued for review by our verification team.</p>

              <div class="status-card">
                <div class="status-icon">&#128203;</div>
                <div class="status-title">Application Received</div>
                <div class="status-subtitle">Expected review time: 24-48 business hours</div>
              </div>

              <p class="text"><strong>What happens next?</strong></p>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot">1</div>
                  <div class="timeline-content">
                    <div class="timeline-title">Document Review</div>
                    <div class="timeline-desc">Our team reviews your submitted documents and company information</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot">2</div>
                  <div class="timeline-content">
                    <div class="timeline-title">Verification Process</div>
                    <div class="timeline-desc">You'll receive an email when your review begins</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot">3</div>
                  <div class="timeline-content">
                    <div class="timeline-title">Certification Issued</div>
                    <div class="timeline-desc">Once approved, your business joins the official UAE SME Registry</div>
                  </div>
                </div>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">Track Application Status</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for choosing SME Readiness Portal for your certification.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Application Received - Your Certification Journey Has Begun',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .progress-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
          .progress-icon { font-size: 50px; margin-bottom: 15px; }
          .progress-title { font-size: 18px; font-weight: 600; color: #92400e; margin-bottom: 5px; }
          .progress-subtitle { font-size: 14px; color: #b45309; }
          .info-box { background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0; }
          .info-box p { margin: 0; color: #166534; font-size: 14px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
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
              <div class="greeting">Verification In Progress!</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">Exciting news! Our certification team has begun reviewing your application for <strong>${companyName}</strong>.</p>

              <div class="progress-card">
                <div class="progress-icon">&#128270;</div>
                <div class="progress-title">Under Review</div>
                <div class="progress-subtitle">A verification specialist is reviewing your application</div>
              </div>

              <div class="info-box">
                <p><strong>What this means:</strong> Your documents and company information are being carefully verified. You'll receive a notification once the review is complete - typically within 24-48 business hours.</p>
              </div>

              <p class="text">Please ensure your contact details are up to date in case our team needs to reach you for any clarifications.</p>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">View Application Status</a>
              </div>
            </div>
            <div class="footer">
              <p>Questions? Our support team is ready to assist you.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Good News! Your Application is Being Reviewed',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .celebration-banner { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 35px; text-align: center; }
          .celebration-icon { font-size: 60px; margin-bottom: 15px; }
          .celebration-title { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
          .celebration-subtitle { font-size: 16px; opacity: 0.95; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .benefits { margin: 30px 0; }
          .benefit { display: flex; align-items: center; padding: 15px; background: #f0fdf4; border-radius: 10px; margin-bottom: 12px; }
          .benefit-icon { font-size: 24px; margin-right: 15px; color: #10b981; }
          .benefit-text { color: #166534; font-size: 14px; font-weight: 500; }
          .highlight-box { background: linear-gradient(135deg, #e6f4f1 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
          .highlight-text { color: #065f46; font-size: 16px; font-weight: 600; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16,185,129,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>SME Readiness Portal</h1>
              <p>Official UAE SME Certification Platform</p>
            </div>
            <div class="celebration-banner">
              <div class="celebration-icon">&#127881;</div>
              <div class="celebration-title">Congratulations!</div>
              <div class="celebration-subtitle">Your Business is Now Certified</div>
            </div>
            <div class="content">
              <div class="greeting">Welcome to the UAE SME Registry!</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We are thrilled to inform you that <strong>${companyName}</strong> has been successfully verified and certified. Your business is now officially listed in the UAE SME Registry!</p>

              <div class="benefits">
                <div class="benefit">
                  <span class="benefit-icon">&#9989;</span>
                  <span class="benefit-text">Listed in the Official UAE SME Registry</span>
                </div>
                <div class="benefit">
                  <span class="benefit-icon">&#128737;</span>
                  <span class="benefit-text">Verified Business Credibility Badge</span>
                </div>
                <div class="benefit">
                  <span class="benefit-icon">&#128101;</span>
                  <span class="benefit-text">Access to Introduction Requests from Verified Users</span>
                </div>
                <div class="benefit">
                  <span class="benefit-icon">&#127775;</span>
                  <span class="benefit-text">Enhanced Visibility Across the Platform</span>
                </div>
              </div>

              <div class="highlight-box">
                <div class="highlight-text">Your certification is active and your business is now visible to all registry users!</div>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">View My Certified Profile</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for being part of the UAE's trusted SME ecosystem.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Congratulations! Your Business is Now Certified - SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .action-banner { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
          .action-icon { font-size: 40px; margin-bottom: 10px; }
          .action-title { font-size: 16px; font-weight: 600; color: #92400e; }
          .notes-box { background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .notes-header { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 15px; display: flex; align-items: center; }
          .notes-header-icon { margin-right: 10px; }
          .notes-content { color: #4b5563; font-size: 14px; white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
          .help-box { background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .help-text { color: #1e40af; font-size: 13px; margin: 0; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(245,158,11,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
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
              <div class="greeting">Additional Information Needed</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We've reviewed the certification application for <strong>${companyName}</strong> and need some additional information before we can proceed with verification.</p>

              <div class="action-banner">
                <div class="action-icon">&#128221;</div>
                <div class="action-title">Action Required: Please Update Your Application</div>
              </div>

              <div class="notes-box">
                <div class="notes-header">
                  <span class="notes-header-icon">&#128172;</span>
                  Reviewer Feedback:
                </div>
                <div class="notes-content">${revisionNotes}</div>
              </div>

              <div class="help-box">
                <p class="help-text"><strong>Need help?</strong> Our support team is available to assist you with any questions about the required changes.</p>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">Update My Application</a>
              </div>
            </div>
            <div class="footer">
              <p>We're here to help you get certified successfully.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Action Required: Please Update Your Application - SME Readiness Portal',
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
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 20px; }
          .text { color: #4b5563; font-size: 15px; margin-bottom: 20px; }
          .status-card { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin: 25px 0; }
          .status-title { font-size: 14px; font-weight: 600; color: #991b1b; margin-bottom: 5px; }
          .status-subtitle { font-size: 13px; color: #dc2626; }
          .reason-box { background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .reason-header { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 15px; }
          .reason-content { color: #4b5563; font-size: 14px; white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px; }
          .help-box { background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
          .help-text { color: #166534; font-size: 14px; margin: 0 0 10px; }
          .button-wrap { text-align: center; margin: 35px 0; }
          .button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3a736d 0%, #2d5a55 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(58,115,109,0.4); }
          .footer { padding: 25px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
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
              <div class="greeting">Application Update</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We have completed our review of the certification application for <strong>${companyName}</strong>. Unfortunately, we are unable to approve the application at this time.</p>

              <div class="status-card">
                <div class="status-title">Application Status: Not Approved</div>
                <div class="status-subtitle">Please review the details below</div>
              </div>

              <div class="reason-box">
                <div class="reason-header">Reason for Decision:</div>
                <div class="reason-content">${rejectionReason}</div>
              </div>

              <div class="help-box">
                <p class="help-text"><strong>Have questions about this decision?</strong></p>
                <p class="help-text" style="margin: 0;">Our support team is available to discuss your application and provide guidance on next steps.</p>
              </div>

              <div class="button-wrap">
                <a href="${supportUrl}" class="button">Contact Support</a>
              </div>
            </div>
            <div class="footer">
              <p>We appreciate your interest in the SME Readiness Portal.</p>
              <p style="margin-top: 15px;"><strong>SME Readiness Portal</strong> - UAE</p>
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
