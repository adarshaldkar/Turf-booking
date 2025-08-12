const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email server connection verified successfully');
  } catch (error) {
    console.error('Email server connection failed:', error);
  }
};

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  // Welcome email for new user registration
  welcomeEmail: (userName) => ({
    subject: 'Welcome to Turf Booking!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to Turf Booking!</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for registering with Turf Booking. We're excited to have you on board!</p>
        <p>You can now:</p>
        <ul>
          <li>Browse available turfs</li>
          <li>Book your favorite sports ground</li>
          <li>Manage your bookings</li>
          <li>View your booking history</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>Turf Booking Team</p>
      </div>
    `
  }),

  // Booking confirmation email
  bookingConfirmation: (bookingDetails) => ({
    subject: 'Booking Confirmation - Turf Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">Booking Confirmed!</h2>
        <p>Your turf booking has been confirmed successfully.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Turf Name:</strong> ${bookingDetails.turfName}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.time}</p>
          <p><strong>Duration:</strong> ${bookingDetails.duration}</p>
          <p><strong>Amount:</strong> ₹${bookingDetails.amount}</p>
          <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        </div>
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to cancel or modify your booking, please contact us.</p>
        <p>Best regards,<br>Turf Booking Team</p>
      </div>
    `
  }),

  // Password reset email
  passwordReset: (resetLink) => ({
    subject: 'Password Reset Request - Turf Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Turf Booking Team</p>
      </div>
    `
  }),

  // Contact form submission
  contactForm: (contactDetails) => ({
    subject: 'New Contact Form Submission - Turf Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactDetails.name}</p>
          <p><strong>Email:</strong> ${contactDetails.email}</p>
          <p><strong>Mobile:</strong> ${contactDetails.mobile}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: white; padding: 15px; border-radius: 5px;">${contactDetails.message}</p>
        </div>
        <p>Please respond to this inquiry as soon as possible.</p>
      </div>
    `
  })
};

module.exports = {
  transporter,
  verifyConnection,
  sendEmail,
  emailTemplates
};
