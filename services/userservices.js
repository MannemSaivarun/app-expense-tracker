exports.getExpenses = async (req,where)=>{
    
    return await req.user.getExpenses(where)
    
}