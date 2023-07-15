// controllers/ContentController.js
const Content  = require('../models/Content');
const multer = require('multer');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

// Configure Multer upload
const upload = multer({ storage: storage });

// Create content
exports.createContent = upload.single('file'), async (req, res) => {
  try {
    const { type, themeId, userId, credits } = req.body;
    const filePath = req.file.path;

    const theme = await Theme.findByPk(themeId);

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const allowImages = theme.allowImages;
    const allowVideos = theme.allowVideos;
    const allowTexts = theme.allowTexts;

    if (
      (type === 'image' && !allowImages) ||
      (type === 'video' && !allowVideos) ||
      (type === 'text' && !allowTexts)
    ) {
      return res.status(403).json({ message: 'Content type not allowed for this theme' });
    }

    const content = await Content.create({ type, themeId, userId, credits, filePath });

    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all contents
exports.getContents = async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
