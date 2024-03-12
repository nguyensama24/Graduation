const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const SendEmail = async (email, subject, text, next) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            port: Number(process.env.EMAI_SUPPORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
            // subject: 'dang ki tai khoan thanh cong',
            // text: 'Cam on ban da su dung dich vu cua chung toi',
        });

        console.log('Email sent Successfully');

        next();
    } catch (error) {
        console.log('Email not sent');
        console.error(error);
    }
};

module.exports = SendEmail;
