const express = require('express');
const News = require('../models/News');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

router.post('/post-news', isAdmin, async (req, res) => {
    const { image, title, date, description, owner } = req.body;

    const newNews = new News({
        image,
        title,
        date,
        description,
        owner
    });

    try {
        await newNews.save();
        return res.status(201).json({ message: 'news posted successfully.', newNews });
    } catch (error) {
        return res.status(500).json({ message: 'Error posting news.' });
    }

});

router.get('/get-news', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news).status(201);
    } catch (e) {
        console.log(e)
    }
}); 

module.exports = router;