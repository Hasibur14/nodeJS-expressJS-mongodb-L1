const asyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");
const ApiError = require("../utils/ApiError");

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Public (add auth middleware later for real apps)
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, tags, published } = req.body;

  const blog = await Blog.create({ title, content, author, tags, published });

  res.status(201).json({ success: true, data: blog });
});

// @desc    Get all blogs (supports pagination, search, filter by tag)
// @route   GET /api/blogs?page=1&limit=10&search=node&tag=js&published=true
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
    ];
  }
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.published) filter.published = req.query.published === "true";

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: blogs.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: blogs,
  });
});

// @desc    Get single blog by id or slug
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

  const blog = await Blog.findOne(query);
  if (!blog) throw new ApiError(404, "Blog not found");

  res.status(200).json({ success: true, data: blog });
});

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Public
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  const { title, content, author, tags, published } = req.body;

  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (author !== undefined) blog.author = author;
  if (tags !== undefined) blog.tags = tags;
  if (published !== undefined) blog.published = published;

  const updatedBlog = await blog.save();

  res.status(200).json({ success: true, data: updatedBlog });
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Public
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  await blog.deleteOne();

  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
