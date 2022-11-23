const Post = require('../../models/Post');
const compareString = require('../../utils/compareString');
const getCode = require('../../utils/getCode');

const createPost = async (request, reply) => {
  try {
    const { secretCode, title, date, description, rawMarkdown } = request.body;
    const string = getCode();

    const match = await compareString(secretCode, string);

    if (match) {
      const createdPost = await Post.create({
        title,
        date,
        description,
        rawMarkdown,
      });

      return reply.redirect(`/posts/${createdPost.slug}`);
    }

    return reply.status(403).send('Invalid Code');
  } catch (e) {
    console.error(e);
    reply.status(500).send('An error occured creating the post.');
  }
};

module.exports = createPost;
