const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: "surafelwondu47@gmail.com", // Your email address
    pass: "HEAVY123addis$@", // Your email password or app-specific password
  },
});

module.exports = transporter;