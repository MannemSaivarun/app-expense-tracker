const User = require('../model/user');
// add-user 
exports.addUser = async (req,res,next)=>{
        try {
            console.log('path is called', req.body);
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            //console.log("post request");
            // if(isstringinvalid(name)|| isstringinvalid(email) || isstringinvalid(password)){
            //     return res.status(400).json({err:"bad parameters. Something is missing"})
            // }
            await User.create({name: name, email: email, password: password})
            res.status(201).json({message:"succesfully created new user"});
    
        } catch (error) {
                res.status(500).json({
                error: "User already exists"
            })
        }
    }

//login
exports.loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body;
        // console.log(req.body)
        // if(isstringinvalid(email)||isstringinvalid(password)){
        //     console.log('Email or password is missing')
        //    return res.status(400).json({message:'Email or password is missing',success:false})
        // }
        const user = await User.findAll({where : {email}})
        console.log(user)
        if(user.length>0){
            console.log('user',user.length)
            if(user[0].password===password){

                res.status(200).json({success:true,message:"User loged in succefully"})
            }else{
                 res.status(201).json({success:false, message:"password doesnot matched"})
            }
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