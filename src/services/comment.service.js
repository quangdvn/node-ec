'use strict';

const { NotFoundError } = require('../core/error.response');
const commentModel = require('../models/comment.model');
const { findProduct } = require('../repositories/product.repo');
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

    //TODO: Read this algorithm again
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
    let query;
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment)
        throw new NotFoundError('Error: Parent comment not found');

      query = {
        product: convertToMongoDBObjectId(productId),
        left: { $gt: parentComment.left },
        right: { $lte: parentComment.right },
      };
    } else {
      // Get root comment
      query = {
        product: convertToMongoDBObjectId(productId),
        parent: null,
      };
    }

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

  static async deleteComment({ commentId, productId }) {
    const foundProduct = await findProduct({ productId });
    if (!foundProduct) throw new NotFoundError('Error: Product not found');

    // 1. Check for left and right values of the comment to delete
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError('Error: Comment not found');

    const { left: leftValue, right: rightValue } = comment;

    // 2. Check comment width
    const width = rightValue - leftValue + 1;

    // 3. Delete all sub-comments
    await commentModel.deleteMany({
      product: convertToMongoDBObjectId(productId),
      left: { $gte: leftValue, $lte: rightValue },
    });

    // 4. Update left and right of other nodes to the right
    await commentModel.updateMany(
      {
        product: convertToMongoDBObjectId(productId),
        right: { $gt: rightValue },
      },
      {
        $inc: { right: -width },
      }
    );
    await commentModel.updateMany(
      {
        product: convertToMongoDBObjectId(productId),
        left: { $gt: rightValue },
      },
      {
        $inc: { left: -width },
      }
    );
    return true;
  }
}

module.exports = CommentService;
