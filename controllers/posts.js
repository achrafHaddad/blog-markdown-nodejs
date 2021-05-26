const marked = require('marked');
const slugify = require('slugify');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const fs = require('fs').promises;

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const Post = require('../models/postSchema');

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      description: req.body.description,
    });

    const url = req.protocol + '://' + req.get('host');
    post.imageLink = req.file ? url + '/uploads/' + req.file.filename : null;

    const cleanHtml = DOMPurify.sanitize(post.content);
    const html = marked(cleanHtml);
    post.html = html;
    post.slug = slugify(req.body.title, { lower: true, strict: true });

    await post.save();
    res.send(post);
  } catch (error) {
    if (error.code === 11000) res.status(422).send('title must be unique');
    console.log(error);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    res.send(posts);
  } catch (error) {
    console.log(error);
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.send('post not found');

    res.send(post);
  } catch (error) {
    console.log(error);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const exist = await Post.findOne({ slug });
    if (exist && exist.slug != req.params.slug) return res.send('title must be unique');

    const post = await Post.findOne({ slug: req.params.slug });

    let imagePath;

    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = './uploads' + post.imageLink.split('uploads')[1];
      post.imageLink = url + '/uploads/' + req.file.filename;
    }

    post.title = req.body.title;
    post.content = req.body.content;
    const cleanHtml = DOMPurify.sanitize(req.body.content);
    post.html = marked(cleanHtml);
    post.slug = slug;

    await post.save();
    await fs.unlink(imagePath);

    res.send(post);
  } catch (error) {
    console.log(error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postDeleted = await Post.findByIdAndDelete(req.params.id);
    const path = postDeleted.imageLink.split('uploads')[1];
    await fs.unlink('./uploads' + path);

    res.send({ message: 'post deleted' });
  } catch (error) {
    console.log(error);
  }
};
