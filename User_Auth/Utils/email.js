const nodemailer = require('nodemailer');

/*
  Use MailTrap for sending mail 
*/
const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    const emailOptions = {
        from:"Cineflex support",
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(emailOptions)
}
module.exports = sendEmail;