const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Post = require('../models/Post');
const compareString = require('../utils/compareString');

const postsRoute = async (app, opts, done) => {
  const string = crypto.randomBytes(48).toString('hex');

  // sendMail(uuid, hash);

  app
    .get('/new', (request, reply) => {
      return reply.view('./views/new.ejs');
    })
    .post('/new', async (request, reply) => {
      try {
        const { secretCode, title, date, description, rawMarkdown } =
          request.body;
        const match = await compareString(secretCode, string);

        if (match) {
          await Post.create({
            title,
            date,
            description,
            rawMarkdown,
          });

          return reply.send('Successfully created post!');
        }

        return reply.status(403).send('Invalid Code');
      } catch (e) {
        console.log(e);
        reply.status(500).send('An error occured creating the post.');
      }
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

  app.put('/edit', async (request, reply) => {
    try {
      const { secretCode } = request.body;
      const { title, date, description, rawMarkdown, slug } =
        request.body.stuff;
      const match = await compareString(secretCode, string);

      if (match) {
        await Post.findOneAndUpdate(
          { slug },
          {
            title,
            date,
            description,
            rawMarkdown,
          }
        );

        return reply.send('Successfully updated post!');
      }

      return reply.status(403).send('Invalid Code');
    } catch (e) {
      console.error(e);
      reply.status(500).send('Error updating ');
    }
  });

  app.delete('/delete', async (request, reply) => {
    try {
      const { secretCode, slug } = request.body;

      const match = await compareString(secretCode, string);
      if (!match) return reply.status(403).send('Invalid code');

      await Post.findOneAndDelete({ slug });
    } catch (e) {
      console.error(e);
      reply.status(500).send('Error deleting');
    }
  });

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

module.exports = postsRoute;
