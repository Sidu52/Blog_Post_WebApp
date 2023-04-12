const express = require('express');
const router = express.Router();
const passport = require('passport');

const actioncontrller = require('../controllers/singinsingup');

router.get('/singup', actioncontrller.Singup);
router.get('/singin', actioncontrller.Singin);
router.post('/create-singup', actioncontrller.createsingup);
router.post('/singout', actioncontrller.singout);
router.get('/forgotpassword', actioncontrller.forgotpassword);
router.post('/sendemail', actioncontrller.sendemail);
router.post('/createnewpassword/:userid', actioncontrller.createnewpassword);


router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/page/singin'}),actioncontrller.createsingin)

router.post('/create-singin',passport.authenticate(
    'local',
    {failureRedirect:'/page/singin'},
),actioncontrller.createsingin);

module.exports = router