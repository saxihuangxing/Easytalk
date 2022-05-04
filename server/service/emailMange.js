
const nodemailer = require('nodemailer');
const Logger = require('../utils/Logger');
const moment = require('moment');

const addSendMail = "nayusanrebecca31@gmail.com"
const sendEmail = (sendto, subject, content) => {
    const transporter = nodemailer.createTransport({
            service: 'QQ',
            port: 465,
            secureConnection: true,
            auth: {
                user: '1229958344@qq.com',
                pass: 'ctfmrvlefmkzjjcj'
            }
        })
        let mailOptions = {
        from: 'funtalk English',
        to: `${sendto},${addSendMail}`,
        subject,
        html: `<b>${content}</b>`
    }      
    transporter.sendMail(mailOptions, (err, info) => {
        if (!err) {
            Logger.info('sendMail to ' + sendto + " successful!");
        }
    });
}

const bookLessonNotify = (sendto,stuName,lessonTime) => {
    const subject = 'fun talk: New book lesson notify';
    const strTime = moment(lessonTime).format('MM:DD HH:mm');
    const content = `${student} ${stdName} make reservation at ${strTime}} , don't miss the time`;
    sendEmail(sendto,subject,content);
}

const cancelLessonNotify = (sendto, stuName, lessonTime) => {
    const subject = 'fun talk: Cancel book lesson notify';
    const strTime = moment(lessonTime).format('MM:DD HH:mm');
    const content = `${student} ${stdName} cancel reservation at ${strTime}}`;
    sendEmail(sendto,subject,content);
}

module.exports = {
    bookLessonNotify,
    cancelLessonNotify
}