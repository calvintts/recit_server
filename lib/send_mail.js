var nodemailer = require('nodemailer');

send_mail = (firstname, email) => {
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'calvinteytaisoon@gmail.com',
    pass: 'Ca1vintts'
  }
});
let url = `https://recipefinder2018.herokuapp.com/users/validate/email=${email}`;
let mailOptions = {
  from: 'calvinteytaisoon@gmail.com',
  to: `${email}`,
  subject: 'Sending Email For Fun',
  html: `<h1>hello ${firstname},</h1>
  <p> Thank you for signing up on Recip </p>
  <p> To verify your email : </p>
  <a href="${url}" >Click Here</a>
  <p> Thank you, </p>
  <p> Recip </p>`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})
};

module.exports = send_mail;
