const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');

const router = express.Router();
router.post('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;