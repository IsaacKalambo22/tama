import {
  mailtrapClient,
  sender,
} from '../config';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  SET_PASSWORD_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from '../email-templates';

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken
      ),
      category: 'Email Verification',
    });

    console.log(
      'Email sent successfully',
      response
    );
  } catch (error) {
    console.error(
      `Error sending verification`,
      error
    );

    throw new Error(
      `Error sending verification email: ${error}`
    );
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid:
        'e65925d1-a9d1-4a40-ae7c-d92b37d593df',
      template_variables: {
        company_info_name: 'TAMA Farmers Trust',
        name: name,
      },
    });

    console.log(
      'Welcome email sent successfully',
      response
    );
  } catch (error) {
    console.error(
      `Error sending welcome email`,
      error
    );

    throw new Error(
      `Error sending welcome email: ${error}`
    );
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        '{resetURL}',
        resetURL
      ),
      category: 'Password Reset',
    });
    console.log({ response });
  } catch (error) {
    console.error(
      `Error sending password reset email`,
      error
    );

    throw new Error(
      `Error sending password reset email: ${error}`
    );
  }
};

export const setPasswordRequestEmail = async (
  email: string,
  setPasswordURL: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Set your password',
      html: SET_PASSWORD_REQUEST_TEMPLATE.replace(
        '{setPasswordURL}',
        setPasswordURL
      ),
      category: 'Set Password',
    });
    console.log({ response });
  } catch (error) {
    console.error(
      `Error sending set password email`,
      error
    );

    throw new Error(
      `Error sending set password email: ${error}`
    );
  }
};

export const sendResetSuccessEmail = async (
  email: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    });

    console.log(
      'Password reset email sent successfully',
      response
    );
  } catch (error) {
    console.error(
      `Error sending password reset success email`,
      error
    );

    throw new Error(
      `Error sending password reset success email: ${error}`
    );
  }
};
