// routes/themeRoutes.js
const express = require('express');
const router = express.Router();
const { createTheme, getThemes } = require('../controllers/ThemeController');
const { authenticateUser, authorizeUser } = require('../middlewares/auth');

router.post('/', authenticateUser, authorizeUser(['admin', 'creador']), createTheme);
router.get('/', authenticateUser, getThemes);

module.exports = router;
