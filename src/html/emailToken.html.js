'use strict';

const emailToken = () => {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .email-container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                      overflow: hidden;
                  }
                  .email-header {
                      background-color: #007bff;
                      color: #ffffff;
                      text-align: center;
                      padding: 20px;
                  }
                  .email-body {
                      padding: 20px;
                      color: #333333;
                  }
                  .email-body p {
                      line-height: 1.5;
                  }
                  .email-footer {
                      text-align: center;
                      padding: 20px;
                      background-color: #f1f1f1;
                      font-size: 12px;
                      color: #777777;
                  }
                  .btn {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 4px;
                  }
                  .btn:hover {
                      background-color: #0056b3;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">
                      <h1>Verify Your Email</h1>
                  </div>
                  <div class="email-body">
                      <p>Hello,</p>
                      <p>Thank you for signing up! To complete your registration, please verify your email by clicking the button below:</p>
                      <p>
                          <a href="{{link_verify}}" class="btn">Verify Email</a>
                      </p>
                      <p>If you did not request this, please ignore this email.</p>
                      <p>Best regards,<br>Your Company Name</p>
                  </div>
                  <div class="email-footer">
                      <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`;
};

module.exports = {
  emailToken,
};
