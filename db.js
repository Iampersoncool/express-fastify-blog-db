const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('err', console.log);
db.once('open', () => console.log('Connected to mongodb database'));

module.exports = db;
