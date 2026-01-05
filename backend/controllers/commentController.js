const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      propertyId: req.params.propertyId,
      author: req.session.user.id,
    });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

exports.getCommentsByProperty = async (req, res) => {
  try {
    const comments = await Comment.find({ propertyId: req.params.propertyId })
      .populate("author", "username")
      .populate("replies.author", "username")
      .sort({ createdAt: -1 });
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

    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    
    // If the comment is not found, return a 404 error
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Add the reply to the comment's replies array
    comment.replies.push({
      content,
      author: req.session.user.id,
    });

    // Save the updated comment with the reply
    await comment.save();

    // Respond with the updated comment
    res.json(comment);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};
