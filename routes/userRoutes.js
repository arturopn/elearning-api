const express = require('express');
const router = express.Router();
const { getUserByEmail, getUserByUsername } = require('../controllers/UserController');

router.get('/:email', getUserByEmail);
router.get('/byusername/:username', getUserByUsername);

module.exports = router;
