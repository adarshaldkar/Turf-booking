const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTP(email, otp) {
    const mailOptions = {
      from: `"QuickCourt" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - QuickCourt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">QuickCourt</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p style="color: #666; font-size: 16px;">
              Please use the following OTP to verify your email address:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              This code will expire in 5 minutes. If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              © 2025 QuickCourt. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"QuickCourt" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset - QuickCourt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">QuickCourt</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="color: #666; font-size: 16px;">
              You requested a password reset for your QuickCourt account. Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              If you can't click the button, copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; word-break: break-all; font-size: 12px;">
              ${resetUrl}
            </p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              © 2025 QuickCourt. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }
}

module.exports = new EmailService();