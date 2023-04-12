const express= require('express');
const passport = require('passport');
const router=express.Router();

const homecontroller=require('../controllers/homecontroll');
const { route } = require('./page');

router.use('/page',require('./page'));
router.use('/post',require('./post'));
router.use('/likes',require('./likes'));

router.use('/api',require('./api/index'));

router.get('/passwordchange/resetpass/:id',homecontroller.resetpassword);
router.get('/userprofile/:id', passport.checkAuthentication, homecontroller.userprofile);
router.get('/',homecontroller.home);
router.get('/profile',passport.checkAuthentication,homecontroller.profile);
router.post('/update/:id',passport.checkAuthentication,homecontroller.update);
module.exports=router;