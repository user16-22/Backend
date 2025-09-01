const mongoose= require("mongoose") ;
const UserSchema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    mobilenumber:{
        type:String
    },
    createdAt: { type: Date, default: Date.now }
    
});
module.exports=mongoose.model('details',UserSchema);