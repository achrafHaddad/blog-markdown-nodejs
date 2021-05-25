const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true },
    html: String,
    imageLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);