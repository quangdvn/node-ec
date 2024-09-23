'use strict';
const { newTemplate } = require('../services/template.service');
const { SuccessResponse } = require('../core/success.response');

class EmailController {
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: 'Template created successfully',
      metadata: await newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
