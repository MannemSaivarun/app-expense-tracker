const express = require('express');
const router = express.Router();

const expenseControllers = require("../controllers/expense");
const UserAuthentication = require("../middlewares/Auth")

router.post('/add-expense', UserAuthentication.authenticate ,expenseControllers.addExpense)

router.get('/get-allcategories',UserAuthentication.authenticate ,expenseControllers.getexpenses)

router.delete('/delete-category/:id', expenseControllers.deleteExpense)

module.exports =router;
