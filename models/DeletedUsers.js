const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
  fullName: String,
  faculty: String,
  year: Number,
  email: String,
  password: String,
});

module.exports = mongoose.model('DeletedUsers', deletedUserSchema);
