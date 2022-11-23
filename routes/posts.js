const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Post = require('../models/Post');

const createPost = require('./posts/createPost');
const editPost = require('./posts/editPost');
const deletePost = require('./posts/deletePost');

const postsRoute = async (app, opts, done) => {
  process.env.SECRET_STRING = crypto.randomBytes(48).toString('hex');

  // sendMail(uuid, hash);

  app.get('/new', (request, reply) => {
    return reply.view('./views/new.ejs');
  });

  app.get('/:slug', async (request, reply) => {
    const post = await Post.findOne({ slug: request.params.slug });

    if (post === null) return reply.status(404).send('Post not found');
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

async function sendMail(uuid) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: 'token@superidol.com',
      to: process.env.SEND_TO_USER,
      subject: 'Token for express-fastify-blog-db',
      text: 'Token: ' + uuid,
    });

    console.log('Sucesfully sent email!');
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  postsRoute,
};
