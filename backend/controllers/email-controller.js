const { sendEmail, emailTemplates } = require('../config/email');

// Send welcome email to new user
const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, firstName } = req.body;
    
    const template = emailTemplates.welcomeEmail(firstName);
    const result = await sendEmail(email, template.subject, template.html);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Welcome email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send welcome email' 
      });
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (req, res) => {
  try {
    const { email, bookingDetails } = req.body;
    
    const template = emailTemplates.bookingConfirmation(bookingDetails);
    const result = await sendEmail(email, template.subject, template.html);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Booking confirmation email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send booking confirmation email' 
      });
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Send password reset email
const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email, resetLink } = req.body;
    
    const template = emailTemplates.passwordReset(resetLink);
    const result = await sendEmail(email, template.subject, template.html);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Password reset email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send password reset email' 
      });
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Send contact form email
const sendContactFormEmail = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    
    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USERNAME;
    const template = emailTemplates.contactForm({ name, email, mobile, message });
    const result = await sendEmail(adminEmail, template.subject, template.html);
    
    if (result.success) {
      // Send confirmation email to user
      const userTemplate = {
        subject: 'Thank you for contacting us - Turf Booking',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Thank you for contacting us!</h2>
            <p>Hello ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Your message:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p>${message}</p>
            </div>
            <p>Best regards,<br>Turf Booking Team</p>
          </div>
        `
      };
      
      await sendEmail(email, userTemplate.subject, userTemplate.html);
      
      res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit contact form' 
      });
    }
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Test email functionality
const testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    const testTemplate = {
      subject: 'Test Email - Turf Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Test Email</h2>
          <p>This is a test email to verify that the email functionality is working correctly.</p>
          <p>If you received this email, the email integration is successful!</p>
          <p>Best regards,<br>Turf Booking Team</p>
        </div>
      `
    };
    
    const result = await sendEmail(email, testTemplate.subject, testTemplate.html);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Test email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send test email' 
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendContactFormEmail,
  testEmail
};
