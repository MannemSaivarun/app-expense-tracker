const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense')
const userController = require('../controllers/user');
const authentication = require('../middlewares/Auth')

router.post('/add-user',userController.addUser);
router.post('/login',userController.loginUser);
router.get('/download',authentication.authenticate, expenseController.downloadexpense);
router.get('/get-alldownloadedfiles',authentication.authenticate,expenseController.getdownloadfiles);

module.exports =router