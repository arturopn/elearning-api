// controllers/ThemeController.js
const Theme  = require('../models/Theme');

// Create a theme
exports.createTheme = async (req, res) => {
  try {
    const { name, categoryId, allowImages, allowVideos, allowTexts } = req.body;

    const theme = await Theme.create({ name, categoryId, allowImages, allowVideos, allowTexts });

    res.status(201).json(theme);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all themes
exports.getThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll();
    res.json(themes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
