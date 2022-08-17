const cron = require('node-cron');
const nodemailer = require('nodemailer');
const mysqlCon = require('./conn')
var handlebars = require('handlebars');
var fs = require('fs');

module.exports = () => {

  cron.schedule('1 * * * *', function () { // (* * * * *) use for 1
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'simbac2002@gmail.com',
        pass: 'yllnaffdzdurquxo'
      }
    });

    d = new Date();
    d.setMonth(d.getMonth() + 2);
    d.setFullYear(d.getUTCFullYear() - 60);
    d = d.toISOString().substring(0, 10);

    // get employees being retired in next 2 months      
    let sql = "SELECT * FROM employee where DOB < '" + d + "';"
    mysqlCon.query(sql,
      function (err, result) {
        if (result) {
          employees = result;
        } else {
          throw err;
        }
      });



    employees.forEach(element => {
      var emailId;
      let sql = "SELECT recruiter.email FROM recruiter inner join college on recruiter.collegeId = college.id where college.id=? limit 1";
      mysqlCon.query(sql,[element.collegeId],
        function (err, result) {
          if (result) {
            
            var readHTMLFile = function (path, callback) {
              fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                  callback(err);
                  throw err;
                }
                else {
                  callback(null, html);
                }
              });
            };
            
            readHTMLFile(__dirname + '/retirement_email_template.html', function (err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                username: element.name
              };
              emailId = result[0]['email'];
              var htmlToSend = template(replacements);            
              var messageOptions = {
                from: 'localhost@gmail.com',
                to: emailId,
                subject: "Retirement Notification - " + element.name,
                html: htmlToSend,
              };
              // transporter.sendMail(messageOptions, function (error, info) {
              //   if (error) {
              //     throw error;
              //   } else {
              //     console.log('Email successfully sent!');
              //   }
              // });
            });

          } else {
            throw err;
          }
        });
    });
  });
}
