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