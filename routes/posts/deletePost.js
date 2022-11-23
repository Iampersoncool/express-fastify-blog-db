const Post = require('../../models/Post');
const compareString = require('../../utils/compareString');
const getCode = require('../../utils/getCode');

const deletePost = async (request, reply) => {
  try {
    const { secretCode, slug } = request.body;
    const string = getCode();

    const match = await compareString(secretCode, string);
    if (!match) return reply.status(403).send('Invalid code');

    await Post.findOneAndDelete({ slug });
  } catch (e) {
    console.error(e);
    reply.status(500).send('Error deleting');
  }
};

module.exports = deletePost;
