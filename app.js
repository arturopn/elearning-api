const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./config/db');

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
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
