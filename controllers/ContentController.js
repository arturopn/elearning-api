const Content = require('../models/Content');
const multer = require('multer');
const Theme = require('../models/Theme');

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
exports.createContent = async (req, res) => {
  try {
    console.log(req.body);
    const { type, themeId, userId, credits, text, videoUrl } = req.body;
    console.log(type);
    const theme = await Theme.findByPk(themeId);

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const allowImages = theme.allowImages;
    const allowVideos = theme.allowVideos;
    const allowTexts = theme.allowTexts;

    let filePath = '';

    // Check the content type and handle file upload or create content accordingly
    if (type === 'image' && allowImages) {
      // Upload the image file
      await upload.single('file')(req, res);
      filePath = req.file.path;
      createContent();
    } else if (type === 'video' && allowVideos) {
      // Upload the video file
      await upload.single('file')(req, res);
      filePath = req.file.path;
      createContent();
    } else if (type === 'text' && allowTexts) {
      // Create content without file upload
      createContent();
    } else {
      return res.status(403).json({ message: 'Content type not allowed for this theme' });
    }

    async function createContent() {
      let content;
      if (type === 'text') {
        // Save the text content
        content = await Content.create({ type, themeId, userId, credits, text });
      } else if (type === 'video') {
        // Save the video URL
        content = await Content.create({ type, themeId, userId, credits, videoUrl });
      } else {
        // Save the file path
        content = await Content.create({ type, themeId, userId, credits, filePath });
      }
      res.status(201).json(content);
    }
  } catch (error) {
    console.log(error);
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
