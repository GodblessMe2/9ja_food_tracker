const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the email address
  const mailOptions = {
    from: 'Alptem Tech <test@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send mail
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;