const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authentication = require('../middlewares/Auth')

router.post('/add-user',userController.addUser);
router.post('/login',userController.loginUser);

module.exports =router