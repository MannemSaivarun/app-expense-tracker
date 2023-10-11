const Expense = require("../model/expense");
const User = require("../model/user");
const sequelize = require("../util/database");

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

