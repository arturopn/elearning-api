// controllers/CategoryController.js
const Category  = require('../models/Category');

// Create a category
exports.createCategory = async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    let coverImage;

    // Check if the request contains a file
    if (req.file) {
      // Get the file path
      const filePath = req.file.path;
      // Set the cover image to the file path
      coverImage = filePath;
    }

    const category = await Category.create({ name, coverImage });

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
