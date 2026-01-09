const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: String,
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    replies: [
      {
        content: String,
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);

CommentModel.repo = {
  create(data) {
    return CommentModel.create(data);
  },
  findByPropertyWithAuthors(propertyId) {
    return CommentModel.find({ propertyId })
      .populate("author", "username")
      .populate("replies.author", "username")
      .sort({ createdAt: -1 });
  },
  async addReply(commentId, reply) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;
    comment.replies.push(reply);
    await comment.save();
    return comment;
  },
  async updateContentIfAuthor(commentId, userId, content) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return { updated: false, reason: "not_found" };
    if (comment.author.toString() !== userId) return { updated: false, reason: "forbidden" };
    comment.content = content;
    await comment.save();
    return { updated: true, comment };
  },
  async deleteIfAuthor(commentId, userId) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return { deleted: false, reason: "not_found" };
    if (comment.author.toString() !== userId) return { deleted: false, reason: "forbidden" };
    await comment.deleteOne();
    return { deleted: true };
  },
  async toggleLike(commentId, userId) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;
    if (!comment.likes.map(String).includes(userId)) comment.likes.push(userId);
    comment.dislikes = comment.dislikes.filter((id) => id.toString() !== userId);
    await comment.save();
    return comment;
  },
  async toggleDislike(commentId, userId) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;
    if (!comment.dislikes.map(String).includes(userId)) comment.dislikes.push(userId);
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    await comment.save();
    return comment;
  },
  findById(id) {
    return CommentModel.findById(id);
  }
};

module.exports = CommentModel;