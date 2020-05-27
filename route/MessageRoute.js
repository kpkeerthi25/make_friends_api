const express=require('express')
const router=new express.Router();
const Message=require('../models/Message')
const auth=require('../middleware/auth')

router.post('/createroom',async(req,res)=>{
    try{
        const p1 = (req.body.p1<req.body.p2)?req.body.p1:req.body.p2
        const p2 =(req.body.p1>req.body.p2)?req.body.p1:req.body.p2
        const message=new Message({p1,p2});
        //console.log(message)
        await message.save();
        res.send(message);
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/me/myrooms',auth,async(req,res)=>{
    try{
    const rooms=await Message.find( { $or: [ { p1: req.user.regno }, { p2: req.user.regno  } ] })
    if(!rooms)
    throw "no rooms available";
    res.send(rooms)
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/me/sendmsg',auth,async(req,res)=>{
    try{
        const person1 = req.user.regno
        const person2 =req.body.person2
        const room=await Message.getRoom(person1,person2)
        const msg={
            from:person1,
            to:person2,
            content:req.body.content
        }
        room.msgs=room.msgs.concat({msg});
        await room.save()
        res.send(room)
    }catch(e){
        res.status(400).send(e)
    }
    
})

module.exports=router;