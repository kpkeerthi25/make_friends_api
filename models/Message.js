const mongoose=require('mongoose')

const MessageSchema=mongoose.Schema({
    p1:{
        type:String,
        required:true
    },
    p2:{
        type:String,
        required:true
    },
    msgs:[{
            msg:{
                from:{
                    type:String,
                },
                to:{
                    type:String,
                },
                content:{
                    type:String,
                },
                createdAt: { type: Date, default: Date.now 
                }
            }
    }]
})

MessageSchema.index({ p1: 1, p2: 1}, { unique: true });

MessageSchema.statics.getRoom=async(per1,per2)=>{
    const message=await Message.findOne({ $or: [ { p1: per1,p2:per2 }, { p1: per2 ,p2:per1 } ] })
    if(!message)
    throw "room not found"
    return message;
}

const Message=new mongoose.model('Message',MessageSchema)



module.exports = Message;
