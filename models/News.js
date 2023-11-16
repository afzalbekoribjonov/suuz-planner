const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  image: String,
  title: String,
  date: String,
  description: String,
  owner: String
});

module.exports = mongoose.model('News', newsSchema);