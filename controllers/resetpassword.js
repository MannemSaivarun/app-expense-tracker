const expense = require("../model/expense");
const user = require("../model/user"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const RazorPay = require('razorpay');
const order = require("../model/orders");
const sequelize = require("../util/database");
const Forgotpassword = require("../model/forgotpassword");
const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
require('dotenv').config();

exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        // console.log(email);
        const User = await user.findOne({where : { 
            email: email
         }});
        // console.log(User);
        if(User){
            const id = uuid.v4();
            console.log("id",id);   
            const result = await User.createForgotpassword({ id , active: true })
            
            console.log('result'); 
            const client= Sib.ApiClient.instance
            
        const apiKey=client.authentications['api-key']
        apiKey.apiKey=process.env.SENDINBLUE_API_KEY
        var partnerKey = client.authentications['partner-key'];
        partnerKey.apiKey = process.env.SENDINBLUE_API_KEY;
        
        const transEmailApi=new Sib.TransactionalEmailsApi();
        const sender={
            email:"mannemsaivarun992@gmail.com"
        }
    
        const receivers=[
            {
                email:email
            }
        ]
        const data= await transEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:`this is the test subject`,
            textcontent:`reset password`,
            htmlContent:`<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            
        })
        console.log('data',data);
        res.json({msg:"Mail sent successfully", success:true});
        }
        else{
         console.log('no data');
            res.json({msg:"User doesnt exist", success:false});
        }
    }catch(error){
        console.log(error);
    }
}

exports.resetpassword = async(req, res) => {
    try{
        const id =  req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({ where : 
        { 
            id: id
         }})
    console.log("forgotpasswordrequest",forgotpasswordrequest);
        if(forgotpasswordrequest){
            await forgotpasswordrequest.update({ active: false});
            res.send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                    </html>`
                    )
            res.end()


    }
    }catch(err){
        console.log(err);
    }

}

exports.updatepassword = async(req, res) => {

    try {
        // console.log("request.query",req.query,req.params.id)
        const { newpassword } = req.query;
        const { id } = req.params;
        const resetpasswordrequest = await Forgotpassword.findOne({ where : { id: id }})

        const User = await user.findOne({where: { id : resetpasswordrequest.userId}})
                // console.log('userDetails', user)
                if(User) {
                    //encrypt the password
                        bcrypt.hash(newpassword, 5, async(err, hash)=>{
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            await User.update({ password: hash })
                                res.json({message: 'Successfuly update the new password', success: true});

                    });
            } else{
                return res.json({ error: 'No user Exists', success: false})
            }
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}