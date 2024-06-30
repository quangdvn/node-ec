'use strict';
const _ = require('lodash');

const getUserInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = {
  getUserInfoData,
};
