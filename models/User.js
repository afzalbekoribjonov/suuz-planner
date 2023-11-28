const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  faculty: String,
  year: Number,
  email: String,
  password: String,
  role: String,
});

module.exports = mongoose.model('User', userSchema);
