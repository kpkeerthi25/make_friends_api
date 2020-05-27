const jwt=require('jsonwebtoken')
const User=require('../models/User')

const auth=async(req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ','');
    const decoded=jwt.verify(token,"thisismysign");
    const user=await User.findOne({_id:decoded._id,"tokens.token":token})
    if(!user)
    throw "invalid auth"
    req.user=user;
    req.token=token;
    next()
    }catch(e)
    {
        res.status(400).send(e);
    }
}

module.exports=auth;