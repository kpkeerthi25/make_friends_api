const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/make_friends',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log('connected successfully')
}).catch((e)=>{
    console.log(e)
})