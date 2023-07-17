const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporterProd = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_POST,
    auth: {
      user: process.env.BREVO_USERNAME,
      pass: process.env.BREVO_PASSWORD,
    },
  });

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email address
  const mailOptions = {
    from: 'Alptem Tech <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  if (process.env.NODE_ENV === 'production') {
    // Production
    await transporterProd.sendMail(mailOptions);
  } else {
    await transporter.sendMail(mailOptions);
  }
  // Send mail
};

module.exports = sendEmail;
