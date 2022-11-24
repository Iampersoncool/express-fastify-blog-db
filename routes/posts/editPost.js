const cache = require('../../cache');
const Post = require('../../models/Post');
const compareString = require('../../utils/compareString');
const getCode = require('../../utils/getCode');

const editPost = async (request, reply) => {
  try {
    const { secretCode } = request.body;
    const string = getCode();

    const { title, date, description, rawMarkdown, slug } = request.body.stuff;
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
};

module.exports = editPost;
