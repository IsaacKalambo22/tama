import nodemailer from 'nodemailer';
import {
  CONTACT_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  SET_PASSWORD_REQUEST_TEMPLATE,
} from '../email-templates';

// Define email options interface
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
}

const DOMAIN_EMAIL = process.env.EMAIL_USER;
const DOMAIN_FULL_EMAIL = `Resten Madzalo <${process.env.EMAIL_USER}>`;
// Configure the transporter with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587, // Default to 587 if not specified
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Reusable function to send emails.
 * Accepts an object containing email parameters.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from = 'Resten Madzalo <resten.madzalo@infi-tech.net>',
}: EmailOptions): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log(DOMAIN_EMAIL);
  console.log(DOMAIN_FULL_EMAIL);

  try {
    console.log({ to, subject });

    const response = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', response);
    return {
      success: true,
      message: 'Email sent successfully!',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message:
        'Failed to send email. Please try again later.',
    };
  }
};

/**
 * Function to send a "set password" email.
 */
export const setPasswordRequestEmail = async (
  email: string,
  setPasswordURL: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const emailBody =
      SET_PASSWORD_REQUEST_TEMPLATE.replace(
        '{setPasswordURL}',
        setPasswordURL
      );
    const result = await sendEmail({
      to: email,
      subject: 'Set your password',
      text: 'Please set your password using the link below',
      html: emailBody,
    });

    if (result.success) {
      console.log(
        'Set password email sent successfully'
      );
      return {
        success: true,
        message:
          'Set password email sent successfully!',
      };
    } else {
      console.error(
        'Failed to send set password email:',
        result.message
      );
      return {
        success: false,
        message: result.message,
      };
    }
  } catch (error) {
    console.error(
      'Error sending set password email:',
      error
    );
    return {
      success: false,
      message:
        'Failed to send set password email. Please try again later.',
    };
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const emailBody =
      PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        '{resetURL}',
        resetURL
      );
    const result = await sendEmail({
      to: email,
      subject: 'Reset your password',
      text: 'Click the link below to reset your password.',
      html: emailBody,
    });

    if (result.success) {
      console.log(
        'Password reset email sent successfully'
      );
      return {
        success: true,
        message:
          'Password reset email sent successfully!',
      };
    } else {
      console.error(
        'Failed to send password reset email:',
        result.message
      );
      return {
        success: false,
        message: result.message,
      };
    }
  } catch (error) {
    console.error(
      'Error sending password reset email:',
      error
    );
    return {
      success: false,
      message:
        'Failed to send password reset email. Please try again later.',
    };
  }
};

export const sendResetSuccessEmail = async (
  email: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const result = await sendEmail({
      to: email,
      subject: 'Password Reset Successful',
      text: 'Your password has been successfully reset.',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    if (result.success) {
      console.log(
        'Password reset success email sent successfully'
      );
      return {
        success: true,
        message:
          'Password reset success email sent successfully!',
      };
    } else {
      console.error(
        'Failed to send password reset success email:',
        result.message
      );
      return {
        success: false,
        message: result.message,
      };
    }
  } catch (error) {
    console.error(
      'Error sending password reset success email:',
      error
    );
    return {
      success: false,
      message:
        'Failed to send password reset success email. Please try again later.',
    };
  }
};

/**
 * Function to send a contact email using a template.
 */
export const sendContactEmail = async (
  senderEmail: string,
  senderName: string,
  message: string,
  senderPhone: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const contactEmailBody =
      CONTACT_EMAIL_TEMPLATE.replace(
        '{senderName}',
        senderName
      )
        .replace('{senderEmail}', senderEmail)
        .replace('{senderPhone}', senderPhone)
        .replace('{message}', message);

    const result = await sendEmail({
      to: DOMAIN_EMAIL!, // Replace with your support email
      subject: 'New Contact Form Submission',
      text: `Name: ${senderName}\nEmail: ${senderEmail}\nPhone: ${senderPhone}\nMessage: ${message}`,
      html: contactEmailBody,
      from: `${senderName} <${senderEmail}>`,
    });

    if (result.success) {
      console.log(
        'Contact email sent successfully'
      );
      return {
        success: true,
        message:
          'Contact email sent successfully!',
      };
    } else {
      console.error(
        'Failed to send contact email:',
        result.message
      );
      return {
        success: false,
        message: result.message,
      };
    }
  } catch (error) {
    console.error(
      'Error sending contact email:',
      error
    );
    return {
      success: false,
      message:
        'Failed to send contact email. Please try again later.',
    };
  }
};
