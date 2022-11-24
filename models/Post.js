const mongoose = require('mongoose');
const slugify = require('slugify');
const moment = require('moment');
const { marked } = require('marked');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const cache = require('../cache');
const domPurify = createDOMPurify(new JSDOM().window);

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
});

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
  parseMarkdownAndSlugify(this);

  next();
});

postSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  parseMarkdownAndSlugify(update);
  update.date = moment.utc(update.date).toISOString();

  cache.set(update.slug, update);

  next();
});

function parseMarkdownAndSlugify(update) {
  update.slug = slugify(update.title, { lower: true, strict: true });
  update.sanitizedHtml = domPurify.sanitize(marked(update.rawMarkdown));
}

module.exports = mongoose.model('Post', postSchema);
