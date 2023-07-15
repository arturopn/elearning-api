const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./config/db');
const User = require('./models/User');
const Theme = require('./models/Theme');
const Content = require('./models/Content');

// Enable CORS
app.use(cors());

// Middleware to parse the request body as JSON
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const themeRoutes = require('./routes/themeRoutes');
const contentRoutes = require('./routes/contentRoutes');
const userRoutes = require('./routes/userRoutes');

// Use the routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/themes', themeRoutes);
app.use('/contents', contentRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Port on which the server will listen
const port = 3000;

// Create a user, themes, and content on server startup
sequelize.sync({ force: true }).then(async () => {
  try {
    // Create a user
    const user = await User.create({
      username: 'example_user',
      email: 'example@example.com',
      password: 'password',
      role: 'user', // Add the role field with a valid value
    });

    // Create themes
    const themes = await Theme.bulkCreate([
      { name: 'Theme 1', allowImages: true, allowVideos: true, allowTexts: true },
      { name: 'Theme 2', allowImages: false, allowVideos: true, allowTexts: false },
      { name: 'Theme 3', allowImages: true, allowVideos: false, allowTexts: true },
      { name: 'Theme 4', allowImages: false, allowVideos: false, allowTexts: true },
      { name: 'Theme 5', allowImages: true, allowVideos: true, allowTexts: false },
    ]);

    // Create content with text
    await Content.create({
      type: 'text',
      themeId: themes[0].id,
      userId: user.id,
      credits: 0,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    });

    // Create content with video
    await Content.create({
      type: 'video',
      themeId: themes[1].id,
      userId: user.id,
      credits: 0,
      videoUrl: 'https://www.youtube.com/watch?v=-nNgJ-rY8Yk&t=465&ab_channel=kikinossj',
    });

    // Create more content with text and video as desired

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
});
