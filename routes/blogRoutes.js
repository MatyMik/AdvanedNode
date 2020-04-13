const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require("../middlewares/clearCache");

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    /*const redis = reuire("redis");
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);
    const util = require("util");
    client.get = util.promisify(client.get);

    const cachedBlogs = await client.get(req.user.id)

    // Do we have any cached data in redis related to this query

    // if yes respond right away and return

    if (cachedBlogs) {
      console.log("serving from Cache!");
      return res.send(JSON.parse(cachedBlogs));
    }*/
    // if no, respond toreuest from database and update redis


    const blogs = await Blog.find({ _user: req.user.id });
    //client.set(req.user.id, JSON.stringify(blogs));
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
