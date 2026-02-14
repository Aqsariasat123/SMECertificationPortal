import nodemailer from 'nodemailer';
import { PrismaClient, EmailStatus } from '@prisma/client';
import { logAuditAction, AuditAction } from '../utils/auditLogger';

const prisma = new PrismaClient();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface EmailContext {
  entityType?: string;  // 'SMEProfile', 'Certificate', 'User'
  entityId?: string;
  userId?: string;
  emailType: string;    // 'verification', 'password_reset', 'welcome', etc.
  recipientName?: string;
  metadata?: Record<string, unknown>;
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

  private async sendEmail(options: EmailOptions, context?: EmailContext): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development' && !process.env.SMTP_PASS) {
        console.log('Email Service (Development Mode):');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html.replace(/<[^>]*>/g, ''));

        // Log email even in dev mode
        if (context) {
          await this.logEmailAudit(true, options, context, undefined);
        }
        return true;
      }

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@naiwa.ae',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      // Log successful email
      if (context) {
        await this.logEmailAudit(true, options, context, undefined);
      }
      return true;
    } catch (error) {
      console.error('Email send failed:', error);

      // Log failed email
      if (context) {
        await this.logEmailAudit(false, options, context, error instanceof Error ? error.message : 'Unknown error');
      }
      return false;
    }
  }

  private async logEmailAudit(
    success: boolean,
    options: EmailOptions,
    context: EmailContext,
    errorMessage?: string
  ): Promise<void> {
    try {
      // Log to AuditLog table
      await logAuditAction({
        userId: context.userId || 'SYSTEM',
        actionType: success ? AuditAction.EMAIL_SENT : AuditAction.EMAIL_FAILED,
        actionDescription: success
          ? `Email sent: ${context.emailType} to ${options.to}`
          : `Email failed: ${context.emailType} to ${options.to}`,
        targetType: context.entityType,
        targetId: context.entityId,
        newValue: {
          recipientEmail: options.to,
          subject: options.subject,
          emailType: context.emailType,
          status: success ? 'sent' : 'failed',
          ...(errorMessage && { error: errorMessage }),
        },
      });

      // Also log to EmailLog table for dedicated email tracking
      await prisma.emailLog.create({
        data: {
          recipientEmail: options.to,
          recipientName: context.recipientName,
          entityType: context.entityType || 'unknown',
          entityId: context.entityId,
          eventType: context.emailType,
          subject: options.subject,
          status: success ? EmailStatus.sent : EmailStatus.failed,
          errorMessage: errorMessage,
          metadata: context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : undefined,
        },
      });
    } catch (err) {
      console.error('Failed to log email audit:', err);
    }
  }

  // Email Verification - sent when user sets up account
  async sendVerificationEmail(email: string, token: string, fullName: string, userId?: string): Promise<boolean> {
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
              <h1>Naiwa</h1>
              <p>SME Readiness & Certification Platform</p>
            </div>
            <div class="content">
              <div class="title">Verify Your Credentials</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">You have initiated account setup for the Naiwa platform.</p>
              <p class="text">To secure your account and proceed, please verify your email address by clicking the button below.</p>
              <div class="button-wrap">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </div>
              <p class="text" style="font-size: 12px; color: #6b7280;">If the button doesn't work, copy and paste this link:</p>
              <div class="link-box">${verifyUrl}</div>
              <div class="note">This verification link expires in 24 hours.</div>
            </div>
            <div class="footer">
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Credentials - Naiwa',
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: 'verification',
      recipientName: fullName,
    });
  }

  // Password Reset Email
  async sendPasswordResetEmail(email: string, token: string, fullName: string, userId?: string): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - Naiwa',
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: 'password_reset',
      recipientName: fullName,
    });
  }

  // Welcome Email - sent after account is verified
  async sendWelcomeEmail(email: string, fullName: string, role: string, userId?: string): Promise<boolean> {
    const dashboardUrl = role === 'sme'
      ? `${process.env.FRONTEND_URL}/sme`
      : `${process.env.FRONTEND_URL}/user/dashboard`;

    const roleContent = role === 'sme' ? {
      title: 'Account Verified: Ready for Certification',
      subtitle: '',
      message: 'Your account has been successfully verified.\n\nYou may now complete your business profile and submit your documentation for review by the certification committee.',
      featuresTitle: 'NEXT STEPS',
      features: [
        'Complete your business profile',
        'Upload verification documents',
        'Submit for certification',
        'Get listed in the official registry',
      ],
      buttonText: 'Proceed to Application',
    } : {
      title: 'Registry Access Granted',
      subtitle: '',
      message: 'Your account credentials have been verified.\n\nYou now have read-only access to the official SME Registry to browse certified businesses and view verified profiles.',
      featuresTitle: 'AVAILABLE ACTIONS',
      features: [
        'Browse certified businesses',
        'View verified company profiles',
        'Access business credentials',
        'Access the official SME registry',
      ],
      buttonText: 'Access Registry',
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
              <h1>Naiwa</h1>
              <p>SME Readiness & Certification Platform</p>
            </div>
            <div class="content">
              <div class="title">${roleContent.title}</div>
              ${roleContent.subtitle ? `<div class="subtitle">${roleContent.subtitle}</div>` : ''}
              <p class="text">Hello ${fullName},</p>
              <p class="text" style="white-space: pre-line;">${roleContent.message}</p>
              <div class="divider"></div>
              <div class="features-title">${roleContent.featuresTitle}</div>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: role === 'sme' ? 'Account Verified - Naiwa' : 'Registry Access Granted - Naiwa',
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: 'welcome',
      recipientName: fullName,
      metadata: { role },
    });
  }

  // Application Submitted - sent when SME submits certification
  async sendApplicationSubmittedEmail(email: string, fullName: string, companyName: string, context?: { userId?: string; smeProfileId?: string }): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Application Received - Naiwa',
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'application_submitted',
      recipientName: fullName,
      metadata: { companyName },
    });
  }

  // Submission Received - sent when SME submits documents for certification review
  async sendSubmissionReceivedEmail(
    email: string,
    fullName: string,
    companyName: string,
    applicationId: string,
    context?: { userId?: string; smeProfileId?: string }
  ): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL}/sme/certification`;
    const timestamp = new Date().toLocaleString('en-AE', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A2A2A; margin: 0; padding: 0; background: #F5FAFA; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(45,106,106,0.08); }
          .header { background: #2D6A6A; color: white; padding: 40px 35px; }
          .header h1 { margin: 0 0 6px; font-size: 22px; font-weight: 600; }
          .header p { margin: 0; opacity: 0.75; font-size: 13px; }
          .status-badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 12px; letter-spacing: 0.3px; }
          .content { padding: 40px 35px; }
          .title { font-size: 18px; font-weight: 600; color: #111C1C; margin-bottom: 16px; }
          .text { color: #5A7070; font-size: 14px; margin-bottom: 16px; line-height: 1.75; }
          .meta-box { background: #F5FAFA; border: 1px solid #D0E4E4; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E8F4F4; }
          .meta-row:last-child { border-bottom: none; }
          .meta-label { color: #5A7070; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta-value { color: #111C1C; font-size: 13px; font-weight: 600; }
          .divider { height: 1px; background: #D0E4E4; margin: 28px 0; }
          .section-title { font-size: 14px; font-weight: 600; color: #2D6A6A; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .review-item { display: flex; align-items: flex-start; margin-bottom: 10px; padding-left: 16px; }
          .review-dash { color: #2D6A6A; margin-right: 10px; font-weight: 600; }
          .review-text { color: #5A7070; font-size: 13px; line-height: 1.5; }
          .outcomes-grid { margin: 20px 0; }
          .outcome-item { background: #F5FAFA; border-radius: 10px; padding: 16px 20px; margin-bottom: 12px; }
          .outcome-title { font-size: 14px; font-weight: 600; color: #111C1C; margin-bottom: 6px; }
          .outcome-title.certified { color: #059669; }
          .outcome-title.deferred { color: #D97706; }
          .outcome-title.declined { color: #DC2626; }
          .outcome-desc { color: #5A7070; font-size: 13px; line-height: 1.5; }
          .next-box { background: #E8F4F4; border-left: 4px solid #2D6A6A; border-radius: 0 10px 10px 0; padding: 18px 22px; margin: 24px 0; }
          .next-title { font-size: 12px; font-weight: 600; color: #2D6A6A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .next-text { color: #111C1C; font-size: 14px; line-height: 1.6; margin: 0; }
          .button-wrap { text-align: center; margin: 32px 0 10px; }
          .button { display: inline-block; padding: 14px 40px; background: #2D6A6A; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; }
          .disclaimer { background: #F5FAFA; border-top: 1px solid #D0E4E4; padding: 24px 35px; }
          .disclaimer p { color: #5A7070; font-size: 11px; line-height: 1.6; margin: 0; }
          .footer { padding: 20px 35px; text-align: center; }
          .footer p { color: #5A7070; font-size: 12px; margin: 0; }
          .auto-note { color: #5A7070; font-size: 11px; margin-top: 20px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Naiwa Certification</h1>
              <p>certification@naiwa.ae</p>
              <div class="status-badge">Status: Under Review</div>
            </div>
            <div class="content">
              <p class="text">We confirm receipt of your documentation package. Your submission has entered the independent certification review phase.</p>

              <div class="meta-box">
                <div class="meta-row">
                  <span class="meta-label">Timestamp</span>
                  <span class="meta-value">${timestamp}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Reference ID</span>
                  <span class="meta-value">${applicationId}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Estimated Completion</span>
                  <span class="meta-value">3–5 business days</span>
                </div>
              </div>

              <div class="divider"></div>

              <p class="section-title">Assessment Process</p>
              <p class="text">Your file will be evaluated across Naiwa's Five-Pillar Framework in accordance with our structured assessment criteria. Review covers:</p>

              <div class="review-item">
                <span class="review-dash">—</span>
                <span class="review-text">Structural completeness of submitted documentation</span>
              </div>
              <div class="review-item">
                <span class="review-dash">—</span>
                <span class="review-text">Internal consistency across submitted records</span>
              </div>
              <div class="review-item">
                <span class="review-dash">—</span>
                <span class="review-text">Alignment with institutional documentation and disclosure standards</span>
              </div>

              <div class="divider"></div>

              <p class="section-title">Possible Outcomes</p>
              <p class="text">Upon completion, a formal determination will be recorded in Naiwa's certification register:</p>

              <div class="outcomes-grid">
                <div class="outcome-item">
                  <p class="outcome-title certified">Certified</p>
                  <p class="outcome-desc">Operational readiness confirmed across assessed pillars. Certification issued and recorded.</p>
                </div>
                <div class="outcome-item">
                  <p class="outcome-title deferred">Deferred</p>
                  <p class="outcome-desc">Documentation gaps or inconsistencies identified. Additional information will be requested within a defined remediation window.</p>
                </div>
                <div class="outcome-item">
                  <p class="outcome-title declined">Declined</p>
                  <p class="outcome-desc">Critical deficiencies identified across one or more pillars. Re-application permitted after a minimum 30-day review interval.</p>
                </div>
              </div>

              <div class="divider"></div>

              <p class="section-title">What Happens Next</p>
              <div class="next-box">
                <p class="next-text">You will be notified by email once a determination has been recorded. You may monitor your application status at any time via your workspace.</p>
              </div>

              <div class="button-wrap">
                <a href="${dashboardUrl}" class="button">View Application Status</a>
              </div>

              <p class="auto-note">This is an automated notification. For support, contact support@naiwa.ae.</p>
            </div>
            <div class="disclaimer">
              <p>Naiwa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.</p>
            </div>
            <div class="footer">
              <p><strong>Naiwa</strong> — United Arab Emirates</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Submission Received — Certification Review Initiated (Ref: ${context?.userId || applicationId})`,
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'submission_received',
      recipientName: fullName,
      metadata: { companyName, applicationId, timestamp },
    });
  }

  // Verification In Progress - sent when admin starts reviewing
  async sendVerificationInProgressEmail(email: string, fullName: string, companyName: string, context?: { userId?: string; smeProfileId?: string }): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your Application is Under Review - Naiwa',
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'verification_in_progress',
      recipientName: fullName,
      metadata: { companyName },
    });
  }

  // Certification Issued - sent when application is approved
  async sendCertificationIssuedEmail(email: string, fullName: string, companyName: string, context?: { userId?: string; smeProfileId?: string }): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
                <div class="benefit-text">Access to Business Network</div>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Congratulations! Your Business is Certified - Naiwa',
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'certification_issued',
      recipientName: fullName,
      metadata: { companyName },
    });
  }

  // Revision Required - sent when additional information is needed
  async sendRevisionRequiredEmail(email: string, fullName: string, companyName: string, revisionNotes: string, context?: { userId?: string; smeProfileId?: string }): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Action Required: Update Your Application - Naiwa',
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'revision_required',
      recipientName: fullName,
      metadata: { companyName, revisionNotes },
    });
  }

  // Application Rejected - sent when application is rejected
  async sendApplicationRejectedEmail(email: string, fullName: string, companyName: string, rejectionReason: string, context?: { userId?: string; smeProfileId?: string }): Promise<boolean> {
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
              <h1>Naiwa</h1>
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
              <p>We appreciate your interest in the Naiwa.</p>
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Application Status Update - Naiwa',
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: 'application_rejected',
      recipientName: fullName,
      metadata: { companyName, rejectionReason },
    });
  }
  // Legal Update Notification - sent when admin updates legal pages
  async sendLegalUpdateNotification(
    email: string,
    fullName: string,
    pageName: string,
    pageUrl: string,
    userId?: string
  ): Promise<boolean> {
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
          .info-box { background: #f0f9ff; border-left: 4px solid #3a736d; border-radius: 6px; padding: 15px 20px; margin: 25px 0; }
          .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .info-value { font-size: 16px; font-weight: 600; color: #3a736d; }
          .button-wrap { text-align: center; margin: 30px 0 10px; }
          .button { display: inline-block; padding: 14px 35px; background: #3a736d; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Naiwa</h1>
              <p>Policy Update Notice</p>
            </div>
            <div class="content">
              <div class="title">Policy Document Updated</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">We are writing to inform you that we have updated one of our policy documents. We encourage you to review the changes at your earliest convenience.</p>

              <div class="info-box">
                <div class="info-label">Updated Document</div>
                <div class="info-value">${pageName}</div>
              </div>

              <p class="text">Your continued use of our platform constitutes acceptance of the updated terms.</p>

              <div class="button-wrap">
                <a href="${pageUrl}" class="button">Review Changes</a>
              </div>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Policy Update: ${pageName} - Naiwa`,
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: 'legal_update',
      recipientName: fullName,
      metadata: { pageName, pageUrl },
    });
  }

  // Bulk send legal update to all users
  async sendBulkLegalUpdateNotification(
    pageName: string,
    pageSlug: string,
    adminUserId: string
  ): Promise<{ sent: number; failed: number }> {
    const pageUrl = `${process.env.FRONTEND_URL}/${pageSlug}`;

    // Get all verified users
    const users = await prisma.user.findMany({
      where: {
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const success = await this.sendLegalUpdateNotification(
        user.email,
        user.fullName,
        pageName,
        pageUrl,
        user.id
      );

      if (success) {
        sent++;
      } else {
        failed++;
      }
    }

    // Log the bulk action
    await logAuditAction({
      userId: adminUserId,
      actionType: AuditAction.LEGAL_UPDATE_NOTIFIED,
      actionDescription: `Sent legal update notification for "${pageName}" to ${sent} users`,
      targetType: 'LegalPage',
      newValue: { pageName, pageSlug, sent, failed, totalUsers: users.length },
    });

    return { sent, failed };
  }

  // Send 2FA OTP Email
  async sendTwoFactorOTPEmail(
    email: string,
    fullName: string,
    otpCode: string,
    userId?: string
  ): Promise<boolean> {
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
          .otp-box { background: #f9fafb; border: 2px solid #3a736d; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; }
          .otp-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
          .otp-code { font-size: 36px; font-weight: 700; color: #3a736d; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .note { background: #fef3c7; border-radius: 6px; padding: 12px 15px; font-size: 13px; color: #92400e; margin: 20px 0; }
          .footer { padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Naiwa</h1>
              <p>Two-Factor Authentication</p>
            </div>
            <div class="content">
              <div class="title">Your Verification Code</div>
              <p class="text">Hello ${fullName},</p>
              <p class="text">You are attempting to sign in to your Naiwa account. Use the verification code below to complete the process:</p>

              <div class="otp-box">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code">${otpCode}</div>
              </div>

              <div class="note">This code will expire in 5 minutes. If you did not request this code, please ignore this email and secure your account.</div>

              <p class="text" style="font-size: 13px; color: #6b7280;">Do not share this code with anyone. Our team will never ask for your verification code.</p>
            </div>
            <div class="footer">
              <p>This is an automated security notification.</p>
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your Verification Code - Naiwa',
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: '2fa_otp',
      recipientName: fullName,
    });
  }

  // SME Workspace Activated - sent when SME account is verified
  async sendSMEWorkspaceActivatedEmail(
    email: string,
    fullName: string,
    userId: string,
    companyName?: string
  ): Promise<boolean> {
    const workspaceUrl = `${process.env.FRONTEND_URL}/sme`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A2A2A; margin: 0; padding: 0; background: #F5FAFA; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(45,106,106,0.08); }
          .header { background: #2D6A6A; color: white; padding: 40px 35px; }
          .header h1 { margin: 0 0 6px; font-size: 22px; font-weight: 600; }
          .header p { margin: 0; opacity: 0.75; font-size: 13px; }
          .content { padding: 40px 35px; }
          .welcome { font-size: 15px; color: #2D6A6A; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
          .text { color: #5A7070; font-size: 14px; margin-bottom: 20px; line-height: 1.75; }
          .divider { height: 1px; background: #D0E4E4; margin: 28px 0; }
          .pillars-title { font-size: 13px; font-weight: 600; color: #111C1C; margin-bottom: 16px; }
          .pillar-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
          .pillar-bullet { width: 6px; height: 6px; background: #2D6A6A; border-radius: 50%; margin-top: 7px; margin-right: 12px; flex-shrink: 0; }
          .pillar-text { color: #5A7070; font-size: 13px; line-height: 1.5; }
          .pillar-text strong { color: #111C1C; font-weight: 600; }
          .next-step-box { background: #E8F4F4; border-radius: 12px; padding: 20px 24px; margin: 28px 0; }
          .next-step-label { font-size: 11px; font-weight: 600; color: #2D6A6A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .next-step-text { color: #111C1C; font-size: 14px; line-height: 1.6; margin: 0; }
          .button-wrap { text-align: center; margin: 32px 0 10px; }
          .button { display: inline-block; padding: 14px 40px; background: #2D6A6A; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; }
          .disclaimer { background: #F5FAFA; border-top: 1px solid #D0E4E4; padding: 24px 35px; }
          .disclaimer p { color: #5A7070; font-size: 11px; line-height: 1.6; margin: 0; }
          .footer { padding: 20px 35px; text-align: center; }
          .footer p { color: #5A7070; font-size: 12px; margin: 0; }
          .ref { color: #5A7070; font-size: 11px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Naiwa</h1>
              <p>SME Certification Platform</p>
            </div>
            <div class="content">
              <p class="welcome">Welcome to Naiwa.</p>
              <p class="text">Your entity profile has been successfully created. Your certification workspace is now active.</p>
              <p class="text">Naiwa operates as a structured, documentation-based assessment of operational readiness. To achieve certification, your business must demonstrate compliance across five pillars:</p>

              <div style="margin: 24px 0;">
                <div class="pillar-item">
                  <div class="pillar-bullet"></div>
                  <div class="pillar-text"><strong>Legal & Ownership Readiness</strong> (Trade License, MOA, UBO)</div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-bullet"></div>
                  <div class="pillar-text"><strong>Financial Discipline</strong> (Bank Statements, Audited Financials)</div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-bullet"></div>
                  <div class="pillar-text"><strong>Business Model & Unit Economics</strong> (Margin Analysis, Cost Structure)</div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-bullet"></div>
                  <div class="pillar-text"><strong>Governance & Controls</strong> (Signing Authority, Internal Controls)</div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-bullet"></div>
                  <div class="pillar-text"><strong>Data Integrity, Auditability & Information Reliability</strong> (VAT Reconciliation, Record Consistency)</div>
                </div>
              </div>

              <div class="next-step-box">
                <p class="next-step-label">Next Step</p>
                <p class="next-step-text">Your document vault is now open. Please begin by uploading your Trade License and the last six months of bank statements to initiate your preliminary certification review.</p>
              </div>

              <div class="button-wrap">
                <a href="${workspaceUrl}" class="button">Enter Workspace</a>
              </div>

              <p class="ref">Ref: ${userId}</p>
            </div>
            <div class="disclaimer">
              <p><strong>Note:</strong> Naiwa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution.</p>
            </div>
            <div class="footer">
              <p><strong>Naiwa</strong> — United Arab Emirates</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Naiwa Certification – Assessment Workspace Activated (Ref: ${userId})`,
      html,
    }, {
      entityType: 'User',
      entityId: userId,
      userId: userId,
      emailType: 'sme_workspace_activated',
      recipientName: fullName,
      metadata: { companyName },
    });
  }

  // Send document notification email (for missing docs, expiry warnings, etc.)
  async sendDocumentNotificationEmail(
    email: string,
    fullName: string,
    companyName: string,
    subject: string,
    content: string,
    notificationType: string,
    context?: { userId?: string; smeProfileId?: string }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #4a8f87 0%, #357a6d 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
          .content { padding: 40px 30px; }
          .title { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
          .text { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 15px; }
          .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 25px 0; }
          .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .info-value { font-size: 16px; color: #1f2937; font-weight: 500; }
          .button-wrap { text-align: center; margin: 30px 0; }
          .button { display: inline-block; background: #4a8f87; color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; }
          .footer { background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 0; font-size: 13px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Naiwa</h1>
              <p>SME Certification Portal</p>
            </div>
            <div class="content">
              <div class="title">${subject}</div>
              <p class="text">Dear ${fullName},</p>
              ${content.split('\n').filter(line => line.trim()).map(line => `<p class="text">${line}</p>`).join('')}

              <div class="info-box">
                <div class="info-label">Company</div>
                <div class="info-value">${companyName}</div>
              </div>

              <div class="button-wrap">
                <a href="${process.env.FRONTEND_URL}/sme" class="button">Go to Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
              <p style="margin-top: 10px;"><strong>Naiwa</strong> - UAE</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `${subject} - Naiwa`,
      html,
    }, {
      entityType: 'SMEProfile',
      entityId: context?.smeProfileId,
      userId: context?.userId,
      emailType: `document_notification_${notificationType}`,
      recipientName: fullName,
      metadata: { companyName, notificationType },
    });
  }
}

export const emailService = new EmailService();
