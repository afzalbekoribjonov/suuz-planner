const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isAdmin } = require('../middleware/admin');

router.post("/create-user", isAdmin, async (req, res) => {
    const { fullName, faculty, year, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@ug\.shardauniversity\.uz$/;
        return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please use an email address given by Sharda University' });
    }

    if (role.toLowerCase() === 'teacher' || role.toLowerCase() === 'admin') {
        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use. Please choose a different email.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                role
            });

            await newUser.save();

            return res.status(201).json({ message: `${role} registered successfully.`, newUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error registering user.' });
        }
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

router.get('/get-users/:role?', isAdmin, async (req, res) => {
    try {
        let query = {};
        const requestedRole = req.params.role;

        if (requestedRole) {
            query = { role: requestedRole.toLowerCase() };
        }

        const users = await User.find(query);

        const sanitizedUsers = users.map(user => ({
            fullName: user.fullName,
            faculty: user.faculty,
            year: user.year,
            email: user.email,
            role: user.role,
            _id: user._id
        }));

        return res.status(200).json({ users: sanitizedUsers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting users.' });
    }
});

router.get('/get-count-all-users', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ count: userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
