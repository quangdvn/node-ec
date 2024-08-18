'use strict';

const { NotFoundError } = require('../core/error.response');
const commentModel = require('../models/comment.model');
const { convertToMongoDBObjectId } = require('../utils');

/**
 * Key features
 * 1. Add comment [User, Shop]
 * 2. Get list of comments [User, Shop]
 * 3. Delete a comment [User, Shop, Admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new commentModel({
      product: productId,
      user: userId,
      content: content,
      parent: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // Reply comment
      // const parentComment = await commentModel.findById(parentCommentId);
      // rightValue = parentComment.right;
      // await commentModel.updateMany(
      //   {
      //     product: productId,
      //     right: { $gte: rightValue },
      //   },
      //   { $inc: { right: 2 } }
      // );
      // await commentModel.updateMany(
      //   {
      //     product: productId,
      //     left: { $gte: rightValue },
      //   },
      //   { $inc: { left: 2 } }
      // );
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment)
        throw new NotFoundError('Error: Parent comment not found');

      rightValue = parentComment.right;

      // Update many comments
      await commentModel.updateMany(
        {
          product: convertToMongoDBObjectId(productId),
          right: { $gte: rightValue },
        },
        { $inc: { right: 2 } }
      );
      await commentModel.updateMany(
        {
          product: convertToMongoDBObjectId(productId),
          left: { $gt: rightValue },
        },
        { $inc: { left: 2 } }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          product: convertToMongoDBObjectId(productId),
        },
        'right',
        { sort: { right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }

      // const count = await commentModel.countDocuments({ product: productId });
      // rightValue = count * 2 + 1;
    }

    // Insert to comment
    comment.left = rightValue;
    comment.right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId,
    limit = 50,
    skip = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment)
        throw new NotFoundError('Error: Parent comment not found');

      const query = {
        product: convertToMongoDBObjectId(productId),
        left: { $gt: parentComment.left },
        right: { $lte: parentComment.right },
      };
    }
    // Get root comments
    const query = {
      product: convertToMongoDBObjectId(productId),
      parent: null,
    };

    const comments = await commentModel
      .find(query)
      .select({ left: 1, right: 1, content: 1, parent: 1 })
      .sort({ left: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return comments;
  }
}

module.exports = CommentService;
