const express = require('express');
const router = express.Router();
const passport = require('passport');

const postcontroller = require('../controllers/postcontroller');

router.post("/createpost",passport.checkAuthentication,postcontroller.createpost);
router.post("/comment",postcontroller.comment);
router.get('/destroy/:id',passport.checkAuthentication,postcontroller.destroy);
router.get('/destoyecomment/:id',passport.checkAuthentication,postcontroller.deletecomment);
module.exports = router;