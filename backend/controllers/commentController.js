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


