const Expense = require("../model/expense");

exports.addExpense = async (req,res,next)=>{
    try {
        console.log('expense path is called', req.body);
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        //console.log("post request");
        const data = await Expense.create({expense: expense, description: description, category: category})
        res.status(201).json({Newexpensedetails:data, message:"succesfully added new expense"});
        

    } catch (error) {
            res.status(500).json({
            error: error
        })
    }
}

exports.getexpenses = async (req,res,next)=>{
    try {
        const categories = await Expense.findAll();
        res.status(200).json({allcategorydetails: categories});
    } catch (error) {
        console.log("error at getting all categories")
        res.status(500).json({error: error})   
    } 
}