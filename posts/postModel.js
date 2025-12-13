 const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      default: "",
      trim: true
    },
    mediaUrl: {
      type: String,
      default: null
    },
    votesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
