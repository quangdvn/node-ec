'use strict';
const AccessControl = require('accesscontrol');

// let grantList = [
//   {
//     role: 'ADMIN',
//     resource: 'profile',
//     action: 'read:any',
//     attributes: '*, !views',
//   },
//   { role: 'SHOP', resource: 'profile', action: 'read:own', attributes: '*,' },
// ];

module.exports = new AccessControl();
