const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const RunServer = require('./database/connection');
const Image = require('./model/Image');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');

// ✅ Initialize DB
RunServer();

// ✅ Create app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// ✅ Image generation (protected route)
app.post('/api/generate', protect, async (req, res) => {
  const { prompt, tags = [] } = req.body;
  const userId = req.user._id;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const form = new FormData();
  form.append('prompt', prompt);

  try {
    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'x-api-key': process.env.CLIPDROP_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    // ✅ Save image to local uploads folder
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const imageName = `${uuidv4()}.png`;
    const imagePath = path.join(uploadsDir, imageName);
    fs.writeFileSync(imagePath, response.data);

    // ✅ Save to MongoDB
    const newImage = new Image({
      prompt,
      imageUrl: `/uploads/${imageName}`, // Stored path for frontend use
      tags,
      userId,
    });

    await newImage.save();

    // ✅ Return image path (relative to frontend access)
    res.status(201).json({ image: `/uploads/${imageName}` });

  } catch (error) {
    console.error(
      '❌ Image generation failed:',
      error.response?.status,
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Image generation failed. Try again.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});