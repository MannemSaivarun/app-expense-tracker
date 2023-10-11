const Expense = require("../model/expense");
const User = require("../model/user");

exports.addExpense = async (req,res,next)=>{
    
        console.log('expense path is called', req.body);
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        Expense.create({expense: expense, description: description, category: category,userId : req.user.id})
         .then(oneexpense =>{
            const totalexpense = Number(req.user.totalexpense) + Number(expense)
            User.update({
                totalexpense : totalexpense
            },{
                where:{id: req.user.id}
            }).then(async()=>{
                res.status(200).json({expense:oneexpense})
            }).catch(async(err)=>{
                return res.status(500).json({success : false, error:err})
            })
        }).catch(async(err)=>{
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

exports.deleteExpense = async(req,res)=>{
    try {
        const expenseId = req.params.id;
        await Expense.destroy({where : {id : expenseId}})
        console.log("one record deleted")
        res.sendStatus(200)
    } catch (error) {
        console.log("error at deleting user")
        res.status(500).json({error: error})
    }
}