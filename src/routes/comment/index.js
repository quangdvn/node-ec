'use strict';
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');
const router = express.Router();

router.use(authorizationV2);

router.post('/', asyncHandler(commentController.createComment));
router.get('/', asyncHandler(commentController.getCommentsByParentId));

module.exports = router;
