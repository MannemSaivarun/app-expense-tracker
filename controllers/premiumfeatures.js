const User = require('../model/user');
const Expense = require("../model/expense");
const sequelize = require("../util/database");
const e = require('express');

exports.getUserLeaderboard = async (req,res)=>{
    try {
        console.log('leaderboardofusers')
        const leaderboardofusers = await User.findAll({
            order:[['totalexpense', 'DESC']]
        })
        console.log(leaderboardofusers)
        res.status(200).json(leaderboardofusers)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        
    }
}