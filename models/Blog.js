const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate a URL-friendly slug from the title before saving
blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
