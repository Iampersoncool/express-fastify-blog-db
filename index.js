if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const path = require('path');

const Fastify = require('fastify').default;
const fastifyCompress = require('@fastify/compress').default;
const fastifyStatic = require('@fastify/static').default;
const fastifyView = require('@fastify/view').default;
const fastifyCors = require('@fastify/cors').default;
const fastifyHelmet = require('@fastify/helmet').default;
const fastifyFormBody = require('@fastify/formbody');

const ejs = require('ejs');
const moment = require('moment');

const db = require('./db');
const Posts = require('./models/Post');

const postsRoute = require('./routes/posts');

const app = Fastify({
  ignoreTrailingSlash: true,
});
const port = process.env.PORT || 3000;

app.register(fastifyCompress, {
  global: true,
});

app.register(fastifyCors);
app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
    },
  },
});

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/static',
});

app.register(fastifyView, {
  engine: {
    ejs,
  },
});

app.register(fastifyFormBody);

//routes
app.register(postsRoute, { prefix: '/posts' });

app.addHook('preHandler', (request, reply, done) => {
  reply.locals = {
    truncateString(str, length) {
      if (str.length > length) return str.slice(0, length) + '...';

      return str;
    },

    formatDate(date, mode) {
      return moment.utc(date).format(mode);
    },
  };

  done();
});

app.get('/', async (request, reply) => {
  const posts = await Posts.find();

  return reply.view('./views/index.ejs', { posts });
});

app
  .listen({ port })
  .then((adress) => console.log(`app listening on ${adress}`))
  .catch(console.log);
