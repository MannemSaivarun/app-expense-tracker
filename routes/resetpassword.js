const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');

const router = express.Router();
router.post('/forgotpassword', resetpasswordController.forgotpassword)
router.get('/resetpassword/:id',resetpasswordController.resetpassword)
router.get('/updatepassword/:id',resetpasswordController.updatepassword)

module.exports = router;