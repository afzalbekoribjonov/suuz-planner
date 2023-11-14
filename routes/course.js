const express = require('express');
const Course = require('../models/Course');
const { isAdmin } = require('../middleware/admin');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-course', isAdmin, async (req, res) => {
  const { time, courseCode, fullName, teacher, year, faculty, room } = req.body;

  const newCourse = new Course({
    time,
    courseCode,
    fullName,
    teacher,
    year,
    faculty,
    room,
  });

  try {
    await newCourse.save();

    return res.status(201).json({ message: 'Course added successfully.', newCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding course.' });
  }
});

router.get('/courses', authenticateToken,async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching courses.' });
  }
});

module.exports = router;
