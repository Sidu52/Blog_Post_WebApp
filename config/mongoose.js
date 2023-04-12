const mongoose=require('mongoose');
const url = 'mongodb://0.0.0.0:27017/Newuserpage';

mongoose.connect(url);
const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',()=>{
    console.log("Connected to Database :: MongoDB ")
});

module.exports=db;