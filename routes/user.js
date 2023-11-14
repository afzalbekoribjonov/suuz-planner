const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
require('dotenv').config();

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

    const token = jwt.sign({ userId: user._id, email: user.email }, "your-secret-key", { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during login.' });
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