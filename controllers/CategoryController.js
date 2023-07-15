const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename
  }
});

// Create an instance of multer with the storage configuration
const upload = multer({ storage: storage });

// Create a category
exports.createCategory = async (req, res) => {
  try {
    upload.single('coverImage')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred
        console.log(err);
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred
        console.log(err);
        return res.status(400).json({ error: 'Something went wrong' });
      }

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
    });
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
