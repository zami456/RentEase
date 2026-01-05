const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/:propertyId", commentController.createComment);
router.get("/:propertyId", commentController.getCommentsByProperty);
router.post("/:commentId/reply", commentController.replyToComment);
router.put("/:commentId", commentController.editComment);
router.delete("/:commentId", commentController.deleteComment);
router.post("/like/:commentId", commentController.likeComment);
router.post("/dislike/:commentId", commentController.dislikeComment);

module.exports = router;