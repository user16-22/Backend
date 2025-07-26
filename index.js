const express = require("express");
const cors = require('cors');
const mongoose= require("mongoose");
const app=express();
const PORT=3001;
// const userRouter=require('./router/user');
// const contactRouter=require('./router/contact');
app.use(cors());

// mongoose.connect("mongodb://localhost:27017/admin",{

// })
// .then(()=> console.log("Sucess"))
// .catch(error =>console.error("error"));
// app.use(express.json());


// app.use("/api/user",userRouter);
// app.use("/api/contact",contactRouter);



app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});