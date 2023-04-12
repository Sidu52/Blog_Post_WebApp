const express = require('express');
const app = express();
const port = 8000;
const path =require('path')
var EJSLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookie = require('cookie-parser');
const { findById } = require('./models/userschema');
const User = require('./models/userschema');
const session =require('express-session');

const passport=require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const customMware=require('./config/middleware');
// I used this when i use (req.body.password) and i find TypeError 
app.use(express.urlencoded());

// Set extrnal css in ejs
app.use(express.static('./assets'));
app.use(express.static('./img'));
// make a upload path avatar to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use(cookie());
app.use(EJSLayout);

// Set EJS view engine and path
app.set('view engine', 'ejs');
app.set('views', './views');

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Make Session authenticate
app.use(session({
    name:'Alston',
    secret: 'sidlston',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    
    (err=>{
        console.log(err || "connect mongodb setup ok")
    })
    )
  }))
   app.use(passport.initialize());
   app.use(passport.session());

   app.use(passport.setAuthenticatedUser)

   app.use(flash());
   app.use(customMware.setFlash);
  
   // Make Manuall Authenticte By The Cookies
// 1.Decode cookie using variable
// 2.Find cookie in database
// 3.Check user if exists or not its exists than send than req.(Any)var-name=true
// app.use((req, res, next) => {
//     let user_id = req.cookies.user_id;
//     User.findById(user_id,(err, user)=>{
//         if (err) { console.log("Error in findig cokkie in database: ", err); next(); return }
//         if (user) {
//             req.isauthenticate = true;
//             req.user = user;
//             next()
//             return;
//         }
//         req.isauthenticate = false;
//         req.user = null;
//         next()
//     })
// })
// Set route
app.use('/', require('./routes/index'));


// Set server for port 8000
app.listen(port, (err) => {
    if (err) { console.log('Error in server run: ', err) }
    console.log('Server run sucessfull for port ', port);
});










