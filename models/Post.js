const mongoose = require('mongoose');
const slugify = require('slugify');
const moment = require('moment');
const { marked } = require('marked');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDOMPurify(new JSDOM().window);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rawMarkdown: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

postSchema.pre('validate', function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.sanitizedHtml = domPurify.sanitize(marked(this.rawMarkdown));

  next();
});

postSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  update.slug = slugify(update.title, { lower: true, strict: true });
  update.sanitizedHtml = domPurify.sanitize(marked(update.rawMarkdown));
  update.date = moment.utc(update.date).toISOString();

  next();
});

module.exports = mongoose.model('Post', postSchema);
