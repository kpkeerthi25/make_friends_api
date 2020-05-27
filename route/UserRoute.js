const express=require('express')
const router=new express.Router();
const User=require('../models/User')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')

const upload=multer({
        
    fileFilter(req,file,cb){
    const parts=(file.originalname.split('.'))
    if(!(parts[1]==='png'))
    {
        cb(new Error('send pdf file'));
    }
    cb(undefined,true)
}
})

router.post('/adduser',async(req,res)=>{
    try{
        const user=new User(req.body);
        await user.save();
        res.send(user);
    }catch(e){
        res.status(400).send(e)
    }
    
})


router.get('/users',async(req,res)=>{
    try{
    const user=await User.find({})
    res.send(user);
    }catch{
        res.status(400).send()
    }
})

router.get('/me',auth,(req,res)=>{
    res.send(req.user);
})


router.post('/user/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.regno,req.body.password)
        const token=await user.generateAuthToken();
        res.send({user,token})
    }catch(e){
        res.status(401).send(e)
    }
})

router.post('/user/logout',auth,async(req,res)=>{
    try{
        
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })

        await req.user.save();
        res.status(200).send("logged out");
    }catch(e){

    }
})

router.post("/user/logoutall",auth,(req,res)=>{
    try{
        req.user.tokens=[];
        req.user.save();
        res.send("logged out of all devices");
    }catch(e)
    {
        res.status(503);
    }
})

router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar=await sharp(req.file.buffer).resize({height:250}).png().toBuffer();
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})

})

router.delete('/user/me/avatar',auth,async(req,res)=>{
    try{
        req.user.avatar=undefined;
        await req.user.save();
        res.send();
    }catch(e){
        res.sendStatus(400)
    }
    
})

router.get('/user/:id/avatar',async(req,res)=>{
    try{
        
        const user=await User.findById(req.params.id);
        if(!user||!user.avatar)
        {
            throw new Error();
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e)
    {
        res.sendStatus(404);
    }
})

router.patch('/user/me',auth,async(req,res)=>{
    try{
        const toUpadate=Object.keys(req.body)
        const available=['name','password','email']
        const isValid=toUpadate.every((item)=>available.includes(item))
        if(!isValid)
        return res.sendStatus(400)
        const user=req.user
        toUpadate.forEach(toup => {
            user[toup]=req.body[toup]
        });
        await user.save();
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports=router;