const Post = require('../../models/Post');
const compareString = require('../../utils/compareString');

const createPost = async (request, reply, string) => {
  try {
    const { secretCode, title, date, description, rawMarkdown } = request.body;
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
};

module.exports = createPost;
