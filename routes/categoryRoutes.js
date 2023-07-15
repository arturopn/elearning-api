// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/CategoryController');
const { authenticateUser, authorizeUser } = require('../middlewares/auth');

router.post('/', authenticateUser, authorizeUser(['admin']), createCategory);
router.get('/', authenticateUser, getCategories);

module.exports = router;
