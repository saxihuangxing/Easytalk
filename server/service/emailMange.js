const nodemailer = require("nodemailer");
const Logger = require("../utils/Logger");
const moment = require("moment");

const addSendMail = "nayusanrebecca31@gmail.com,1229958344@qq.com";
const sendEmail = (sendto, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "QQ",
    port: 465,
    secureConnection: true,
    auth: {
      user: "1229958344@qq.com",
      pass: "ctfmrvlefmkzjjcj",
    },
  });
  let mailOptions = {
    from: "fun talk  <1229958344@qq.com>",
    to: `${sendto},${addSendMail}`,
    subject,
    html: `<b>${content}</b>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (!err) {
      Logger.info("sendMail to " + sendto + " successful!");
    } else {
      Logger.error("send mail to  " + sendto + " failed , reason : " + err);
    }
  });
};

const bookLessonNotify = (sendto, tutorName, stuName, lessonTime) => {
  try {
    const subject = "fun talk: New book lesson notify";
    const strTime = moment(lessonTime * 60 * 1000).format("YYYY/MM/DD HH:mm");
    const content = `student ${stuName} make reservation with tutor ${tutorName} at ${strTime} , don't miss the time`;
    sendEmail(sendto, subject, content);
  } catch (err) {
    Logger.info(`bookLessonNotify err:${err}`);
  }
}

const cancelLessonNotify = (sendto, tutorName, stuName, lessonTime) => {
  try {
    const subject = "fun talk: Cancel book lesson notify";
    const strTime = moment(lessonTime * 60 * 1000).format("YYYY/MM/DD HH:mm");
    const content = `student ${stuName} cancel reservation with tutor ${tutorName} at ${strTime}`;
    sendEmail(sendto, subject, content);
  } catch (err) {
    Logger.info(`cancelLessonNotify err:${err}`);
  }
}

module.exports = {
  bookLessonNotify,
  cancelLessonNotify,
};
