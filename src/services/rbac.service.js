'use strict';

const { BadRequestError } = require('../core/error.response');
const resourceModel = require('../models/resource.model');
const roleModel = require('../models/role.model');

class RBACService {
  static async createResource({
    name = 'profile',
    slug = 'R00001',
    description = '',
  }) {
    try {
      // 1. Check name or slug exists

      // 2. New resource
      const resource = await resourceModel.create({ name, slug, description });
      return resource;
    } catch (error) {
      console.error(error);
      throw new BadRequestError('Error: Failed to create resource');
    }
  }

  static async listResources({
    userId = 0,
    limit = 30,
    offset = 0,
    search = '',
  }) {
    try {
      // 1. Check admin middleware

      // 2. Get list resources
      const resources = await resourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: 1,
            slug: 1,
            description: 1,
            resourceId: '$_id',
            createdAt: 1,
          },
        },
      ]);
      return resources;
    } catch (error) {
      return error;
    }
  }

  static async createRole({
    name = 'ADMIN',
    slug = 'A00001',
    description = 'Highest role',
    grants = [],
  }) {
    try {
      // 1. Check if role exists

      // 2. Create role
      const role = await roleModel.create({ name, slug, description, grants });
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestError('Error: Failed to create resource');
    }
  }

  static async listRoles({ userId = 0, limit = 30, offset = 0, search = '' }) {
    // 1. check If userId exists

    // 2. List roles
    // const roles = await roleModel.find();

    const roles = await roleModel.aggregate([
      {
        $unwind: '$grants',
      },
      {
        $lookup: {
          from: 'Resources',
          localField: 'grants.resource',
          foreignField: '_id',
          as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
      {
        $project: {
          role: '$name',
          resources: '$resource.name',
          action: '$grants.actions',
          attributes: '$grants.attributes',
        },
      },
      {
        $unwind: '$action',
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resources: 1,
          action: 1,
          attributes: 1,
        },
      },
    ]);
    return roles;
  }
}

module.exports = RBACService;
