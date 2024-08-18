'use strict';
const {
  SuccessResponse,
  CreatedResponse,
} = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
  createComment = async (req, res, next) => {
    new CreatedResponse({
      message: 'Comment created successfully',
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all children comments',
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
