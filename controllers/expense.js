// const { stringify } = require("uuid");
const downloadFile = require('../model/download');
const Expense = require("../model/expense");
const User = require("../model/user");
const sequelize = require("../util/database");
const AWS = require('aws-sdk');
const UserServices = require('../services/userservices');
const S3Services = require('../services/s3sevices');
require('dotenv').config();



exports.downloadexpense = async (req,res)=>{
   try {
    // const expenses = await Expense.findAll({where : {userId : req.user.id}});
    // const expenses  = await req.user.getExpenses();
    const expenses  = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    console.log(fileURL)
    downloadFile.create({fileUrl:fileURL, userId:req.user.id})
    res.status(201).json({fileURL:fileURL, success: true})
   } catch (error) {
    console.log(error)
    res.status(500).json({fileURL:'',success:false,error:error})
   }
}
exports.getdownloadfiles = async(req,res)=>{
    try {
        const alldownloads = await downloadFile.findAll({where : {userId : req.user.id}});
        console.log("alldownloads",alldownloads)
        res.status(200).json({alldownloaddetails: alldownloads});
    } catch (error) {
        console.log("error at getting all downloadfiles")
        res.status(500).json({error: error})  
    }
}

exports.addExpense = async (req,res,next)=>{
        const t = await sequelize.transaction();
        console.log('expense path is called', req.body);
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        Expense.create({expense: expense, description: description, category: category,userId : req.user.id},{transaction:t})
         .then(oneexpense =>{
            const totalexpense = Number(req.user.totalexpense) + Number(expense)
            User.update({
                totalexpense : totalexpense
            },{
                where:{id: req.user.id},
                transaction: t
            }).then(async()=>{
                await t.commit();
                res.status(200).json({expense:oneexpense})
            }).catch(async(err)=>{
                await t.rollback();
                return res.status(500).json({success : false, error:err})
            })
        }).catch(async(err)=>{
            await t.rollback();
            return res.status(500).json({success : false, error:err})
        })
        
    
}

exports.getexpenses = async (req,res)=>{
    try {
        console.log("user is ",req.user.id)
        const categories = await Expense.findAll({where : {userId : req.user.id}});
        console.log("categories",categories)
        res.status(200).json({allcategorydetails: categories});
    } catch (error) {
        console.log("error at getting all categories")
        res.status(500).json({error: error})   
    } 
}

// exports.deleteExpense = async(req,res)=>{
//     try {
//         const expenseId = req.params.id;
//         await Expense.destroy({where : {id : expenseId}})
//         console.log("one record deleted")
//         res.sendStatus(200)
//     } catch (error) {
//         console.log("error at deleting user")
//         res.status(500).json({error: error})
//     }
// }

exports.deleteExpense = async(req,res)=>{
    const transaction = await sequelize.transaction();
  try {
    // Find the expense and get the userId
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId, { transaction });
    if (!expense) {
      throw new Error('Expense not found.');
    }
    const userId = expense.userId;
    console.log("expense found", expense)

    // Delete the expense
    await Expense.destroy({ where: { id: expenseId }, transaction });
    console.log("expense deleted")

    // Calculate the new total expense for the user
    const totalExpense = await Expense.sum('expense', {
      where: { userId },
      transaction,
    });

    // Update the User model with the new total expense
    await User.update({ totalexpense: totalExpense }, { where: { id: userId }, transaction });

    // Commit the transaction
    await transaction.commit();
    res.sendStatus(200) 
    } catch (error) {
        await transaction.rollback();
        console.log("error at deleting user")
        res.status(500).json({error: error})
    }
}
exports.getPagewiseExpenses = async(req,res)=>{
    try {
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);
        // const {page,pageSize}=req.query;
        console.log(page,pageSize)
        const offset = (page-1)*pageSize
        const limits = pageSize
        const {count,rows} = await Expense.findAndCountAll({
            offset:offset,
            limit:limits,
            where:{userId:req.user.id}
           
        })
        //console.log("data",count , rows)
        res.json({Data:rows, totalCount: count})

        // const alldata = await UserServices.getExpenses(req)
        // if(alldata.length <= pageSize - (page-1)*pageSize){
        //     console.log("data",alldata)
        //     res.json({Data:alldata})
        // }
        // else{
            
        // }

    } catch (error) {
        console.log("something error occured in pagination",error)
    }
}
exports.getSelectedRangeExpenses = async(req,res)=>{
    try {
        const { dateRange } = req.params;
        const data = await UserServices.getExpenses(req)
        console.log("Data",data);
        const today = new Date();

        const filteredData = data.filter(item => {
            const itemDate = new Date(item.updatedAt);
            console.log(item.updatedAt, itemDate.toDateString(),today.toDateString())
            if (dateRange === 'daily') {
                return itemDate.toDateString() === today.toDateString();
            } else if (dateRange === 'weekly') {
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return itemDate >= oneWeekAgo;
            } else {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                return itemDate >= startOfMonth;
            }
        });
        console.log("filteredData------->",filteredData)
        res.json({filteredData:filteredData});
    } catch (error) {
        console.log("something error occured in Rangebasis getusers",error)
    }
}
