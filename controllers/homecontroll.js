const Post = require("../models/post");
const User = require('../models/userschema');
const Resetuser = require('../models/forgotpassword');
const fs = require('fs');
const path = require('path');
module.exports.home = (req, res) => {
    // if(!req.checkuser){
    //     return res.redirect("/page/singin");
    // }
    return res.render('home', {
        title: "Sign In & Sign Up Page",
        imagePath: "6191846-removebg-preview.png"
    });
}

module.exports.userprofile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log("Multer Error: ", err) }
                user.username = req.body.username;
                user.email = req.body.email;
                if (req.file) {
                    // this is saving the path of the uploaded file into the avatar file
                    // user.avatar= User.avatarPath + '/' + req.file.filename;
                    //removing previousely present avatar before adding new one
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //this is saving the path of uploaded file into the avatar field in User
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.profile = async (req, res) => {
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('likes');

        let users = await User.find({});
        return res.render('profile', {
            title: "Profile-page",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log("Error", err);
        return;
    }

}

module.exports.resetpassword = async (req, res) => {
    let user = await Resetuser.findById(req.params.id);
    const tokenExpiration = user.tokenExpiry;
    if (new Date() > tokenExpiration) {
        req.flash('error', 'Link has expired');
        res.redirect('/page/singin')
        return;
    }
    res.render('mailers/passwordchange/resetpass', {
        title: "Reset Password",
        user:user
    });
}