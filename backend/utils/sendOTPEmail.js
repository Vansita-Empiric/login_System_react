import nodemailer from 'nodemailer';

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey', // This is always 'apikey' for SendGrid
        pass: process.env.SENDGRID_API_KEY, // Your generated API key
      },
    });

    const mailOptions = {
      from: 'vansita.empiric@gmail.com', // Sender address
      to: email, // Receiver's email
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. This code will expire in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default sendOTPEmail;
