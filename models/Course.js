const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  time: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  faculty: {
    type: String, 
    required: true
  },
  room: {
    type: Number,
    required: false,
  },
  day: {
    type: String,
    required: true
  }
});

module.exports = model('Course', courseSchema);
