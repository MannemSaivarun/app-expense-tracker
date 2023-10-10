const User = require('../model/user');
const Expense = require("../model/expense");
const sequelize = require("../util/database");
const e = require('express');

exports.getUserLeaderboard = async (req,res)=>{
    try {
        console.log('leaderboardofusers')
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expense')), 'total_cost']],
            include : [
                {
                    model : Expense,
                    attributes:[]
                }
            ],
            group:['users.id'],
            order:[['total_cost', 'DESC']]
        })
        console.log(leaderboardofusers)
        res.status(200).json(leaderboardofusers)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        
    }
}