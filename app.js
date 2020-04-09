const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', { layout: false });
});

app.post('/send', (req, res) => {
  const output = `
    <html>
      <head>
        <style>
          h3 {
            color: red;
          }
        </style>
      </head>
      <body>
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
          <li>Name: ${req.body.name}</li>
          <li>Company: ${req.body.company}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
      </body>
    </html>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp-237070.m70.wedos.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lukas.rac@lukis-dev.cz', // generated ethereal user
      pass: '`5:iI2^S9J1mt', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: '"Lukáš Rác 👻" <lukas.rac@lukis-dev.cz>', // sender address
    to: 'lukas.rac@lukis-dev.cz', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', { layout: false, msg: 'Email has been sent' });
  });
});

app.listen(3000, () => console.log('Server started...'));
