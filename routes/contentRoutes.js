// routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const { createContent, getContents } = require('../controllers/ContentController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/', authenticateUser, createContent);
router.get('/', authenticateUser, getContents);

module.exports = router;
