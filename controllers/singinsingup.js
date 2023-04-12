const User = require("../models/userschema");
const usercheck = require("../models/forgotpassword");//Chek user exit or not 
const forgotpasswordmailer = require('../mailers/forgotpassword');
const crypto = require('crypto');
// Singup page
module.exports.Singup = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render('singup', {
        title: "Singup"
    });
}

//Singin page
module.exports.Singin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render('singin', {
        title: "Singin"
    });
}

// Create a SingUP Entry in Database
module.exports.createsingup = (req, res) => {
    if (req.body.password != req.body.Conformpassword) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { console.log('Error in finding user in mongoose'); return };
        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) { console.log('Error in creating User in mongoose', err); return res.redirect('back') };
                return res.redirect('/page/singin');
            })
        }
        else {
            return res.redirect('back')
        }
    });
}
//Create singin
module.exports.createsingin = (req, res) => {
    req.flash('success', 'Logged-In-Successfully');
    return res.redirect('/profile');
}
//Forgot Password
module.exports.forgotpassword = (req, res) => {
    return res.render('forgot_password', {
        title: "Reset-Password"
    })
}
//Send Email
module.exports.sendemail = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        if (user) {
            crypto.randomBytes(48, function (err, buffer) {
                let token = buffer.toString('hex');
                usercheck.findOne({ email: req.body.email }, (err, users) => {
                    if (!users) {
                        let forgotpassword = usercheck.create({
                            email: req.body.email,
                            resetToken: token,
                            tokenExpiry: Date.now() + 300000,
                            user: user._id
                        }).then(forgotpassword => {
                            forgotpassword.save();
                        }).catch(err => {
                            console.log("Error in creating Forgotpassword document!", err);
                        });
                    }
                    else {
                        usercheck.findByIdAndUpdate({ _id: users.id }, {
                            resetToken: token,
                            tokenExpiry: Date.now() + 300000,
                        }).then((result) => {
                            console.log(result);
                        })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    forgotpasswordmailer.newPassword(users);
                })
            })

        }
        return res.redirect('back')

    } catch (err) {
        console.log("Error in finding User!", err)
        return res.redirect('back');
    }


}
// SingOut
module.exports.singout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
}

//Reset password
module.exports.createnewpassword = async (req, res) => {
    if (req.body.password != req.body.conformpassword) {
        req.flash('error', 'Password not match');
        return res.redirect('back');
    }
    let user = await User.findByIdAndUpdate(req.params.userid, {
        password: req.body.password
    });
    req.flash('success',"Password change sucessful");
    return res.redirect('/page/singin');
}