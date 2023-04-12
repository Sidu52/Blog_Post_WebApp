const mongoose=require('mongoose');

const forgotpassword=new mongoose.Schema({
    email:String,
    resetToken:String,
    tokenExpiry:Number,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{
    timestamps:true
})

const pass=mongoose.model('Resetpass',forgotpassword);
module.exports=pass;