const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/admin');
const DeletedUsers = require('../models/DeletedUsers');
require('dotenv').config();

const jwt_secret_key = process.env.JWT_KEY;

router.post('/register', async (req, res) => {
  const { fullName, faculty, year, email, password } = req.body;

  if (!fullName || !faculty || !year || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@ug\.shardauniversity\.uz$/;
    return emailRegex.test(email);
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please use an email address given by Sharda University' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use. Please choose a different email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      faculty,
      year,
      email,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully.', newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, jwt_secret_key);

    return res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during login.' });
  }
});


router.delete('/delete-account/:userId', authenticateToken || isAdmin, async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(deletedUser)
    const achievedUser = new DeletedUsers({
      fullName: deletedUser.fullName,
      faculty: deletedUser.faculty,
      year: deletedUser.year,
      email: deletedUser.email,
      password: deletedUser.password,
    });

    await achievedUser.save()

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/get-deleted-users', isAdmin, async (req, res) => {
  const userId = req.params.userId;

  try {
    const users = await DeletedUsers.find();

    if (!users) {
      return res.status(404).json({ message: 'Deleted users not found' });
    }

    res.json({ message: 'Deleted account users', users }).status(200);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get("/user", authenticateToken, async (req, res) => {
  try {
    const response = await User.findById(req.user._id)
    res.json(response)
  } catch (er) {
    res.json(er)
  }
})

module.exports = router;