const Content = require('../models/Content');
const multer = require('multer');
const path = require('path');
const Theme = require('../models/Theme');


// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
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
    upload.single('file')(req, res, async function (err) {
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
      const { type, themeId, userId, credits, text, videoUrl } = req.body;

      const theme = await Theme.findByPk(themeId);

      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }

      const allowImages = theme.allowImages;
      const allowVideos = theme.allowVideos;
      const allowTexts = theme.allowTexts;

      let filePath = '';

      if (type === 'image' && allowImages) {
        if (req.file) {
          filePath = req.file.filename;
        }
        await createContent();
      } else if (type === 'video' && allowVideos) {
        filePath = videoUrl;
        await createContent();
      } else if (type === 'text' && allowTexts) {
        await createContent();
      } else {
        return res.status(403).json({ message: 'Content type not allowed for this theme' });
      }

      async function createContent() {
        let content;
        if (type === 'text') {
          content = await Content.create({ type, themeId, userId, credits, text, filePath });
        } else if (type === 'video') {
          content = await Content.create({ type, themeId, userId, credits, videoUrl, filePath });
        } else {
          content = await Content.create({ type, themeId, userId, credits, filePath });
        }
        res.status(201).json(content);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};





// Get all contents
exports.getContents = async (req, res) => {
  try {
    const contents = await Content.findAll();
    const modifiedContents = contents.map((content) => {
      if (content.type === 'image' && content.filePath) {
        return {
          ...content.toJSON(),
          filePath: `http://localhost:3000/uploads/${content.filePath}` // Replace with the appropriate base URL
        };
      }
      return content;
    });
    res.json(modifiedContents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

