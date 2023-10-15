const Razorpay = require('razorpay');
const Order = require('../model/orders');
const jwt = require('jsonwebtoken'); 
const userController = require('../controllers/user')
require('dotenv').config(); // Load environment variables from .env file


exports.purchasepremium = async (req,res)=>{
    try {
        
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status:'PENDING'}).then(()=>{
                return res.status(201).json({order, key_id : rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })
    } catch (error) {
        console.log(error);
        res.status(403).json({messag : 'Something went wrong', error:error})
        
    }
}
function generateAccessToken(id, ispremiumuser){
    return jwt.sign({userId: id, ispremiumuser}, 'secretkey')
}
exports.updateTransactionStatus = async (req,res)=>{
    try {
        console.log("----->entered step 1")
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}})
        const promise1 =  order.update({paymentid : payment_id, status: 'SUCCESSFUL'})
        const promise2 =  req.user.update({ispremiumuser: true})
        Promise.all([promise1, promise2]).then(()=>{
            return res.status(202).json({success: true, message: "Transaction Successful", token: generateAccessToken(req.user.id, true)});
        }).catch((err)=>{
            throw new Error(err)
        })
                
    } catch (error) {
        console.log(error)
        res.status(403).json({error:error, message:'Somwthing went wrong'})
    }
}