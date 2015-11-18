var nodemailer = require('nodemailer');
var fs = require('fs');
var ejs = require('ejs');

var CustomMail = function (to, subject, template, content){
    this.to = to;
    this.subject = subject;
    this.template = template;
    this.content = content;
};

ejs.open = '{{';
ejs.close = '}}';

//Put here your Gmail credentials

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'no-reply@emakers.es',
        pass: 'H153g7Z2'
    }
});

CustomMail.prototype.send = function (callback){
    //Get email template path
    var template = this.template+'.ejs';
    var content = this.content;
    var to = this.to;
    var subject = this.subject;

    // Use fileSystem module to read template file

    fs.readFile(template, 'utf8', function (err, file){
        if(err) return callback (err);

        var html = ejs.render(file, content);

        //ejs.render(file, content); returns a string that will set in mailOptions

        var mailOptions = {
            from: 'no-reply@emakers.es',
            to: to,
            subject: subject,
            html: html
        };
        transporter.sendMail(mailOptions, function (err, info){
            // If a problem occurs, return callback with the error
            if(err) return callback(err);
            console.log(info);
            callback();
        });
    });
};

//We export our custom module

module.exports = CustomMail;