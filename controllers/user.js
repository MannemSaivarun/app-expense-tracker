const User = require('../model/user');
// add-user 
exports.addUser = async (req,res,next)=>{
        try {
            console.log('path is called', req.body);
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            //console.log("post request");
            const data = await User.create({name: name, email: email, password: password})
            res.status(201).json({newUserdetail: data});
    
        } catch (error) {
                res.status(500).json({
                error: "User already exists"
            })
        }
    }