import nodemailer from 'nodemailer';

const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASSWORD,
} = process.env;

export const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD
    }
});
