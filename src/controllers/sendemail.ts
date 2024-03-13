import { PASS, USER } from "../secrets";
const nodemailer = require("nodemailer");


// Send OTP to the user's email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER,
      pass: PASS
    }
  });
  
// Verify transporter configuration
transporter.verify((err: any) => {
    if (err) {
      console.log('Error in email transporter configuration:', err);
    } else {
      console.log('Email transporter is ready');
    }
});


  
  // FUNCTION TO GET THE NODEMAILER READY AND SEND OTP TO ADMIN
  // Send welcome email function
export const sendEmail = async (email: string, studentID: string, password: string) => {
    const mailOptions = {
        from: USER,
        to: email,
        subject: 'Welcome to DGHCS',
        html: `
            <p>Dear ${email},</p>
            <p>Welcome to DGHCS! Your student ID is: ${studentID}</p>
            <p>Please keep your password (${password}) confidential.</p>
            <p>Best regards,</p>
            <p>The DGHCS Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email.');
    }
};

// FUNCTION TO SEND EMAIL FOR FORGOT PASSWORD
export const sendForgotPasswordEmail = async (email: string, newPassword: string) => {
    const mailOptions = {
        from: USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Dear ${email},</p>
            <p>We received a request to reset your password. Your new password is: ${newPassword}</p>
            <p>If you did not request this change, please ignore this email.</p>
            <p>Best regards,</p>
            <p>The DGHCS Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email.');
    }
};