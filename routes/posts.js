const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Post = require('../models/Post');
const cache = require('../cache');

const createPost = require('./posts/createPost');
const editPost = require('./posts/editPost');
const deletePost = require('./posts/deletePost');

const postsRoute = async (app, opts, done) => {
  process.env.SECRET_STRING = crypto.randomBytes(48).toString('hex');

  if (process.env.NODE_ENV === 'production') {
    sendMail(process.env.SECRET_STRING);
  } else {
    console.log(process.env.SECRET_STRING);
  }

  app.get('/new', (request, reply) => {
    return reply.view('./views/new.ejs');
  });

  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    if (cache.has(slug)) {
      const post = cache.get(slug);
      console.log('using cache on route /posts/' + slug);
      return reply.view('./views/showPost.ejs', { post });
    }

    const post = await Post.findOne({ slug });
    if (post === null) return reply.status(404).send('Post not found');

    cache.set(post.slug, post);
    return reply.view('./views/showPost.ejs', { post });
  });

  app.get('/edit/:slug', async (request, reply) => {
    const { slug } = request.params;
    const post = await Post.findOne({ slug });

    if (post === null) return reply.status(404).send("Post doesn't exist");

    return reply.view('./views/edit.ejs', { post });
  });

  app.post('/new', createPost);
  app.put('/edit', editPost);
  app.delete('/delete', deletePost);

  done();
};

async function sendMail(string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: 'token@lol.com',
      to: process.env.SEND_TO_USER,
      subject: 'Token for express-fastify-blog-db',
      text: 'Token: ' + string,
    });

    console.log('Sucesfully sent email!');
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  postsRoute,
};
