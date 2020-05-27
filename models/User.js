const mongoose = require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const userSchema=mongoose.Schema({
    name:{
        type:String,

    },
    regno:{
        type:String,
        unique:true,
        validate(s){
            if(s.length!=10)
            throw new Error("age cannot be negative");
            }
        },
    email:{
        type:String,
        validate(email){
            if(!validator.isEmail(email))
            throw new Error("invalid Email");
        }
    },
    password:{
        type:String,
        //default:"password",
        validate(pass){
            if(pass.length<8)
                throw new Error("password shd be atleast of 8 characters")
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer,
    }
    
},{
    timestamps:true
})
// userSchema.virtual('tasks',{
//     ref:'Task',
//     localField:'_id',
//     foreignField:'owner'
// })

userSchema.methods.toJSON=function(){
    const user=this;
    const userObj=user.toObject()
    delete userObj.password;
    delete userObj.tokens;
    return userObj;

}

userSchema.methods.generateAuthToken = async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},"thisismysign");
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (regno,pass)=>{
    const user=await User.findOne({regno});
    if(!user)
    throw "regNo not found"
    const isMatch=await bcrypt.compare(pass,user.password)
    if(!isMatch)
    throw "invalid password"
    return user;
    
}

userSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8);
    }
    next()
})

// userSchema.pre('remove',async function(next){
    
//     const user=this;
//     const task=await Task.deleteMany({owner:user._id});
//     console.log(task)
    
//     next()
// })

const User = new mongoose.model('User',userSchema)

module.exports=User;