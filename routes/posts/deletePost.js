const Post = require('../../models/Post');
const compareString = require('../../utils/compareString');

const deletePost = async (request, reply, string) => {
  try {
    const { secretCode, slug } = request.body;

    const match = await compareString(secretCode, string);
    if (!match) return reply.status(403).send('Invalid code');

    await Post.findOneAndDelete({ slug });
  } catch (e) {
    console.error(e);
    reply.status(500).send('Error deleting');
  }
};

module.exports = deletePost;
