var nodemailer = require("nodemailer");
var pathFile = "./Mobile/MobileList.xlsx";

function sendMail() {
  var transporter = nodemailer.createTransport({
    service: "gmail.com",
    auth: {
      user: "ankitdhariwal2@gmail.com",
      pass: ""
    },
  });

  var mailOptions = {
    from: "ankitdhariwal2@gmail.com",
    to: "ankitdhariwal2@gmail.com",
    subject: "P-MOBILE LIST",
    text: `HELLO!!`,
    attachments: [{ fileName: "MobileList", path: pathFile }],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendMail;
