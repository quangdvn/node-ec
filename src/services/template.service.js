'use strict';

const { emailToken } = require('../html/emailToken.html');
const templateModel = require('../models/template.model');

const newTemplate = async ({ name, html = '' }) => {
  // 1. Check if template exists

  // 2. Create new template
  const newTemplate = await templateModel.create({
    name, // unique
    html: emailToken(),
  });
  return newTemplate;
};

const getTemplate = async ({ name }) => {
  const foundTemplate = await templateModel.findOne({
    name,
  });
  return foundTemplate;
};

module.exports = {
  newTemplate,
  getTemplate,
};
