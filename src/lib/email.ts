// Simple email service using Gmail API

import { createTransport } from 'nodemailer';

// Configure Gmail transport with App Password (for 2FA accounts)
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App password generated for Gmail with 2FA
  },
});

// Email templates
export const emailTemplates = {
  welcomeEmail: (name: string) => ({
    subject: 'Welcome to LearnHub!',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Welcome to LearnHub!</h2>
        <p>Hi ${name},</p>
        <p>Welcome to LearnHub! We're excited to have you on board.</p>
        <p>Get started by exploring our courses and start your learning journey today.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Explore Courses
          </a>
        </div>
        <p>Best regards,<br>The LearnHub Team</p>
      </div>
    `,
  }),
  
  courseEnrollment: (userName: string, courseName: string, courseId: string) => ({
    subject: `Enrolled: ${courseName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Course Enrollment Confirmation</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for enrolling in <strong>"${courseName}"</strong>.</p>
        <p>You can start learning right away!</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${courseId}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Start Learning
          </a>
        </div>
        <p>Happy learning!<br>The LearnHub Team</p>
      </div>
    `,
  }),
  
  certificateAchieved: (userName: string, courseName: string, certificateId: string) => ({
    subject: `Certificate: ${courseName}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Certificate Achievement</h2>
        <p>Hi ${userName},</p>
        <p>Congratulations on completing <strong>"${courseName}"</strong>!</p>
        <p>Your certificate is ready. You can view and download it now.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/certificates/${certificateId}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Certificate
          </a>
        </div>
        <p>Keep up the great work!<br>The LearnHub Team</p>
      </div>
    `,
  }),
  
  resetPassword: (userName: string, resetToken: string) => ({
    subject: 'Reset Your Password',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Reset Your Password</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The LearnHub Team</p>
      </div>
    `,
  }),

  magicLink: (userName: string, magicLinkUrl: string) => ({
    subject: 'Your Magic Sign-In Link',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Sign In to LearnHub</h2>
        <p>Hi ${userName},</p>
        <p>Here's your magic link to sign in to LearnHub. It's valid for 10 minutes.</p>
        <div style="margin: 30px 0;">
          <a href="${magicLinkUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Sign In to LearnHub
          </a>
        </div>
        <p>If you didn't request this link, you can safely ignore this email.</p>
        <p>The LearnHub Team</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  try {
    // For development, log the email (this can be removed in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('==== EMAIL PREVIEW ====');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('Body (preview): ', body.substring(0, 100) + '...');
      console.log('=======================');
    }
    
    // Send the actual email
    const info = await transporter.sendMail({
      from: `"LearnHub" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: body,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (name: string, email: string) => {
  const template = emailTemplates.welcomeEmail(name);
  return sendEmail({
    to: email,
    subject: template.subject,
    body: template.body,
  });
};

// Send course enrollment email
export const sendCourseEnrollmentEmail = async (
  userName: string,
  email: string,
  courseName: string,
  courseId: string
) => {
  const template = emailTemplates.courseEnrollment(userName, courseName, courseId);
  return sendEmail({
    to: email,
    subject: template.subject,
    body: template.body,
  });
};

// Send certificate email
export const sendCertificateEmail = async (
  userName: string,
  email: string,
  courseName: string,
  certificateId: string
) => {
  const template = emailTemplates.certificateAchieved(userName, courseName, certificateId);
  return sendEmail({
    to: email,
    subject: template.subject,
    body: template.body,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  userName: string,
  email: string,
  resetToken: string
) => {
  const template = emailTemplates.resetPassword(userName, resetToken);
  return sendEmail({
    to: email,
    subject: template.subject,
    body: template.body,
  });
};

// Send magic link email
export const sendMagicLinkEmail = async (
  userName: string,
  email: string,
  magicLinkUrl: string
) => {
  const template = emailTemplates.magicLink(userName, magicLinkUrl);
  return sendEmail({
    to: email,
    subject: template.subject,
    body: template.body,
  });
}; 