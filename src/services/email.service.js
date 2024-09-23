'use strict';
const { randomInt } = require('crypto');
const { newOtp } = require('./otp.service');
const templateModel = require('../models/template.model');
const { getTemplate } = require('./template.service');
const transporter = require('../configs/nodemailer.config');
const { NotFoundError } = require('../core/error.response');
const { replaceTemplatePlaceholder } = require('../utils');

const sendEmailLinkVerify = async ({ html, toEmail, subject, text }) => {
  try {
    const mailOptions = {
      from: `"Quangdvn" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: html,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendEmailToken = async ({ email = null }) => {
  try {
    // 1. Get token
    const otp = await newOtp({ email });

    // 2. Get template
    const template = await getTemplate({ name: 'EMAIL_TOKEN' });

    if (!template) {
      throw new NotFoundError('Error: Template not found');
    }

    // 3. Replace placeholder with params
    const content = replaceTemplatePlaceholder(template.html, {
      link_verify: `http://localhost:3333/cgp/welcome-back?token=${otp.token}`,
    });

    // 3. Send email
    sendEmailLinkVerify({
      toEmail: email,
      subject: 'Verify your email',
      text: 'Verify your email',
      html: content,
    }).catch((err) => console.error(err));

    return 1;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  sendEmailToken,
};
