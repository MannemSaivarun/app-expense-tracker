const express = require('express');
const router = express.Router();

const expenseControllers = require("../controllers/expense");

router.post('/add-expense',expenseControllers.addExpense)
router.use('/get-allcategories',expenseControllers.getexpenses)

module.exports =router;
