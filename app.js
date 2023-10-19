const express = require('express');
const User = require('./model/user');
const Expense = require('./model/expense')
const Order = require('./model/orders');
const app = express();
const sequelize = require('./util/database');
const Forgotpassword = require('./model/forgotpassword');
const downloadFile =require('./model/download');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors());

const userRoutes = require('./routes/user');

app.use('/user',userRoutes);

const expenseRoutes = require('./routes/expense');
app.use('/expense',expenseRoutes);

const purchaseRoutes = require('./routes/purchase')
app.use('/purchase',purchaseRoutes);

const premiumRoutes = require('./routes/premiumfeatures')
app.use('/premium',premiumRoutes);


const forgotpasswordRoutes = require('./routes/resetpassword');
app.use('/password',forgotpasswordRoutes)

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);
app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream:accessLogStream}))

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(downloadFile);
downloadFile.belongsTo(User);

sequelize.sync().then(result =>{
    app.listen(process.env.PORT || 3000);
}).catch(err =>{
    console.log(err);
})