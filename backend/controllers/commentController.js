const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.repo.create({
      content,
      propertyId: req.params.propertyId,
      author: req.session.user.id,
    });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

exports.getCommentsByProperty = async (req, res) => {
  try {
    const comments = await Comment.repo.findByPropertyWithAuthors(req.params.propertyId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.replyToComment = async (req, res) => {
  try {
    const { content } = req.body;

    // Ensure that content is not empty
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Reply content cannot be empty" });
    }

    const comment = await Comment.repo.addReply(req.params.commentId, {
      content,
      author: req.session.user.id,
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};


exports.editComment = async (req, res) => {
  try {
    const { updated, reason, comment } = await Comment.repo.updateContentIfAuthor(
      req.params.commentId,
      req.session.user.id,
      req.body.content
    );

    if (!updated && reason === "forbidden") return res.status(403).json({ error: "Unauthorized" });
    if (!updated && reason === "not_found") return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to edit comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { deleted, reason } = await Comment.repo.deleteIfAuthor(
      req.params.commentId,
      req.session.user.id
    );
    if (!deleted && reason === "forbidden") return res.status(403).json({ error: "Unauthorized" });
    if (!deleted && reason === "not_found") return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.repo.toggleLike(req.params.commentId, req.session.user.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to like comment" });
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.repo.toggleDislike(req.params.commentId, req.session.user.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to dislike comment" });
  }
};