const express = require('express');
const User = require('./model/user');
const Expense = require('./model/expense')
const app = express();
const sequelize = require('./util/database');


const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors());

const userRoutes = require('./routes/user');
app.use('/user',userRoutes);

const expenseRoutes = require('./routes/expense');
app.use('/expense',expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync().then(result =>{
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})