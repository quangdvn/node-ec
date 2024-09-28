'use strict';
const _ = require('lodash');
const { Types } = require('mongoose');
const getUserInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

const removeNestedUndefinedObject = (obj) => {
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeUndefinedObject(obj[key]);
    }
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj || {}).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response || {}).forEach((k) => {
        final[`${key}.${k}`] = response[k];
      });
    } else if (obj[key] !== undefined && obj[key] !== null) {
      final[key] = obj[key];
    }
  });
  return final;
};

const convertToMongoDBObjectId = (id) => {
  return Types.ObjectId.createFromHexString(id);
};

const replaceTemplatePlaceholder = (template, params) => {
  let str = template;
  Object.keys(params).forEach((key) => {
    str = str.replace(`{{${key}}}`, params[key]);
  });
  return str;
};

const randomProductId = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

module.exports = {
  getUserInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  removeNestedUndefinedObject,
  convertToMongoDBObjectId,
  replaceTemplatePlaceholder,
  randomProductId,
};
