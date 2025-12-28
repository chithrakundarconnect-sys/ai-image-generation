const Image = require('../model/Image');
const generateImage = require('../utils/clipdropAPI');
const fs = require('fs');
const path = require('path');

// 🔄 Generate image using ClipDrop API and save to MongoDB
exports.createImage = async (req, res) => {
  const { prompt, tags } = req.body;

  try {
    const imageUrl = await generateImage(prompt);

    const newImage = await Image.create({
      prompt,
      imageUrl,
      tags,
      userId: req.user._id,
      favorite: false,
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error in createImage:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

// 📥 Get all images (for public gallery or admin view)
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error in getAllImages:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// 👤 Get images uploaded by the logged-in user
exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error in getUserImages:', error);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
};

// ⭐ Toggle favorite status of an image
exports.toggleFavorite = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this image' });
    }

    image.favorite = !image.favorite;
    await image.save();

    res.status(200).json({ message: 'Favorite status updated', favorite: image.favorite });
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

// ❌ Delete image and remove the file from the server
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this image' });
    }

    // Remove image file from disk
    const imagePath = path.join(__dirname, `../${image.imageUrl}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await image.deleteOne();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};