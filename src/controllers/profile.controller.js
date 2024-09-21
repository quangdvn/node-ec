'use strict';
const {
  CreatedResponse,
  SuccessResponse,
} = require('../core/success.response');

const profiles = [
  {
    id: 1,
    name: 'Quang1',
    image: 'XXXXXXXXXXXXXXXX',
  },
  {
    id: 2,
    name: 'Quang2',
    image: 'XXXXXXXXXXXXXXXX',
  },
  {
    id: 3,
    name: 'Quang3',
    image: 'XXXXXXXXXXXXXXXX',
  },
];

class ProfileController {
  // Admin
  profiles = async (req, res, next) => {
    return new SuccessResponse({
      message: 'View all profiles',
      metadata: profiles,
    }).send(res);
  };
  // Shop
  profile = async (req, res, next) => {
    return new SuccessResponse({
      message: 'View one profiles',
      metadata: {
        id: 3,
        name: 'Quang3',
        image: 'XXXXXXXXXXXXXXXX',
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
