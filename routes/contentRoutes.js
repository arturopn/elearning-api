// routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const { createContent, getContents } = require('../controllers/ContentController');
const { authenticateUser, authorizeUser } = require('../middlewares/auth');

router.post('/', authenticateUser, authorizeUser(['admin', 'creador']), createContent);
router.get('/', authenticateUser, getContents);

module.exports = router;
