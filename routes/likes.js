const express= require('express');
const router=express.Router();
const likecontroller =require('../controllers/like_controller');

router.post('/toggle',likecontroller.toggleLike);

module.exports=router;