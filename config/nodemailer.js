const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  service: 'gmail',
  auth: {
    user: "alstonsid9@gmail.com",
    pass: "dcziouyymdzrpsxc"
  }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) { console.log("Error! in rendering template",err); return; }

            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}