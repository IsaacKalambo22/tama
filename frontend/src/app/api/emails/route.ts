import {
  sendMail,
  SendMailTo,
} from '@/lib/mailer';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

export const config = {
  runtime: 'nodejs', // Make sure to set the runtime correctly
};

export async function POST(req: NextRequest) {
  // Read and parse the body of the request
  const body = await req.json();

  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: 'Method not allowed' },
      { status: 405 }
    );
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    message,
  } = body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !message
  ) {
    return NextResponse.json(
      { message: 'All fields are required' },
      { status: 400 }
    );
  }

  try {
    const mailData: SendMailTo = {
      sender: email,
      recipients: [
        {
          name: 'Resten Madzalo',
          address: 'madzaloresten8@gmail.com',
        },
      ],
      subject: `Contact Form Submission from ${firstName} ${lastName}`,
      message: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const res = await sendMail(mailData);
    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email' },
      { status: 500 }
    );
  }
}
