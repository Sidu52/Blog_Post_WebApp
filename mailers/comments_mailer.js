const nodeMailer = require('../config/nodemailer');

// module.exports = newComment

// this is another way of exporting a method
exports.newComment = (comment)=>{
   let htmlString = nodeMailer.renderTemplate({comment: comment},'/comment/new_comment.ejs')
    nodeMailer.transporter.sendMail({
        from:'alstonsid9@gmail.com',
        to:comment.user.email,
        subject:"New Comment Published!",
        html:htmlString
    },(err,info)=>{
        if(err){console.log("Error in sending mail ",err);return;}
        console.log('Message sent',info)
    });
}