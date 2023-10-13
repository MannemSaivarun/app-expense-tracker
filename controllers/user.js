const User = require('../model/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');


// console.log(secretKey);

// signup 
function isstringinvalid(string){
    if(string===undefined || string===0){
        return true
    }else{
        return false
    }
}
exports.addUser = async (req,res,next)=>{
        try {
            console.log('path is called', req.body);
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            
            //console.log("post request");
            if(isstringinvalid(name)|| isstringinvalid(email) || isstringinvalid(password)){
                return res.status(400).json({err:"bad parameters. Something is missing"})
            }
            const existingUser = await User.findAll({ where: { email } });
            if (existingUser.length>0) {
                console.log("user already exists", existingUser)
                return res.status(400).json({ error: 'User already exists' });
              }
            const saltrounds = 10 
            bcrypt.hash(password,saltrounds,async(err,hash)=>{
                await User.create({name: name, email: email, password: hash})
                res.status(201).json({message:"succesfully created new user"});
            })
            
    
        } catch (error) {
                res.status(500).json({
                error: error
            })
        }
    }
// Generate a random 256-bit (32-byte) secret key
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey.toString())
function generateAcessToken(id,name,ispremiumuser){
    return jwt.sign({userId : id, name : name, ispremiumuser },'secretkey')
}    

//login
exports.loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body;
        // console.log(req.body)
        if(isstringinvalid(email)||isstringinvalid(password)){
            console.log('Email or password is missing')
           return res.status(400).json({message:'Email or password is missing',success:false})
        }
        const user = await User.findAll({where : {email}})
        // const userId = user[0].id;
        // console.log("id:",userId);
        
        if(user.length>0){
            const storedHash = user[0].password
            bcrypt.compare(password, storedHash, (err, result) => {
                console.log("ENTERED")
                if (err) {
                  // Handle the error
                  res.status(202).json({success:false, message:"User doesnot exist"})
                } else if (result === true) {
                  // Passwords match, grant access to the user
                  res.status(200).json({success:true, message:"User loged in succefully", token: generateAcessToken(user[0].id, user[0].name, user[0].ispremiumuser)})
                } else {
                  // Passwords do not match, deny access
                  res.status(201).json({success:false, message:"password doesnot matched"})
                }
            });
        }else{
            res.status(202).json({success:false, message:"User doesnot exist"})
        }
           
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err
        })
    }
}
