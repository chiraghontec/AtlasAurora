const express = require('express')
const app = express()
const mongoose = require("mongoose")
const ejs = require('ejs')
const passport = require("passport")
const bodyParser =require("body-parser")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const User = require("./models/user")


//Connecting database
mongoose.connect("mongodb://localhost/atlas_db");
app.use(require("express-session")({
    secret: "Shinekonoyaro",       
    resave: false,
    saveUninitialized: false
}));
passport.serializeUser(User.serializeUser());       //encoding the session
passport.deserializeUser(User.deserializeUser());   //decoding the session
passport.use(new LocalStrategy(User.authenticate()));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded(
    { extended: true }
))

//Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get("/userprofile", isLoggedIn, (req, res) => {
    res.render("userprofile");
})
//Auth Routes
app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/login", 
    passport.authenticate("local", {
    successRedirect: "/userprofile",
    failureRedirect: "/login" })
);

app.get("/signup", (req, res) => {
    res.render("signup")
});

app.post("/signup", (req, res) => {

    User.register(new User({ username: req.body.username, age: req.body.age, name: req.body.name }), req.body.password,(err, user) =>{
        if (err) {
            console.log(err);
            res.render("error");
        }
        passport.authenticate("local",(req, res)=>{
            res.redirect("/login");
        })
    })
})

app.get('/', (req, res) => {
    res.render('index', { page: 'index' })
})

app.get('/index', (req, res) => {
    res.render('index', { page: 'index' })
})

app.get('/vote', (req, res) => {
    res.render('vote', { page: 'vote' })
})

app.get('/statistics', (req, res) => {
    res.render('statistics', { page: 'statistics' })
})

app.get('/contact', (req, res) => {
    res.render('contact', { page: 'contact' })
})

app.get('/admin_login', (req, res) => {
    res.render('admin_login', { page: 'admin_login' })
})

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("vote");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
app.listen(3000, (err)=> {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is listening at 3000");
    }
});