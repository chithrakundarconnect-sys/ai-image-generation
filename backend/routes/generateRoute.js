const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Image = require('../model/Image');
const { protect } = require('../middleware/authMiddleware'); // ✅ Added

router.post('/', protect, async (req, res) => { // ✅ Middleware added
  const { prompt, tags = [] } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const form = new FormData();
  form.append('prompt', prompt);

  try {
    const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
      headers: {
        ...form.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const imageName = `${uuidv4()}.png`;
    const imagePath = path.join(uploadsDir, imageName);
    fs.writeFileSync(imagePath, response.data);

    const newImage = new Image({
      prompt,
      imageUrl: `/uploads/${imageName}`,
      tags,
      userId: req.user._id, // ✅ Fixed here
    });

    await newImage.save();

    res.json({ image: `/uploads/${imageName}` });
  } catch (error) {
    console.error(
      '❌ Error generating image:',
      error.response?.status,
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to generate image using Clipdrop API' });
  }
});

module.exports = router;