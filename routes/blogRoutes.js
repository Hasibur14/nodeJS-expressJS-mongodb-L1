const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

router.route("/").get(getBlogs).post(createBlog);

router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

module.exports = router;
