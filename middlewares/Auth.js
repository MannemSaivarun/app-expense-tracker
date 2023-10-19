const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token,process.env.SECRET_TOKEN_KEY)
        console.log("user details",user.userId)
        User.findByPk(user.userId).then(user=>{
            console.log("decrypted user details",user.id)
            req.user = user
            next();
        })
    } catch (error) {
        console.log("error at auth.js" ,error)
        return res.status(401).json({success:false});
    }
}

module.exports = {
    authenticate
    }