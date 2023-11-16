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
    day,
  });

  try {
    await newCourse.save();

    return res.status(201).json({ message: 'Course added successfully.', newCourse });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding course.' });
  }
});

router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const { year, faculty, day } = req.query;

    const filter = {};
    if (year) filter.year = year;
    if (faculty) filter.faculty = faculty;
    if (day) filter.day = day;

    const courses = await Course.find(filter);

    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching courses.' });
  }
});


router.put('/update-course/:id', isAdmin, async (req, res) => {
  const courseId = req.params.id;
  const updateFields = req.body;

  try {
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    for (const key in updateFields) {
      if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
        existingCourse[key] = updateFields[key];
      }
    }

    const updatedCourse = await existingCourse.save();

    return res.status(200).json({ message: 'Course updated successfully.', updatedCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating course.' });
  }
});

module.exports = router;
