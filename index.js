require('./db/mongoose')
const cors=require('cors')
const express=require('express')
const app=express()
const UserRoute=require('./route/UserRoute')
const MessageRoute=require('./route/MessageRoute')

app.use(cors())
app.use(express.json())
app.use(UserRoute);
app.use(MessageRoute)

app.listen(3001,()=>{
    console.log("serving")
})