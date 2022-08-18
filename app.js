const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require("mongoose")
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Post")
const Post = mongoose.model("posts")
require("./models/Category")
const Category = mongoose.model("categories")
const users = require("./routes/user")
const passport = require("passport")
require("./config/authentication")(passport)

//config
    //Session
    app.use(session({
        secret: "secret7",
        resave: true,
        saveUninitialized: true 
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    //Middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //Body Parse/Express
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log("connected with mongoDB")
    }).catch((err) => {
        console.log("error connecting: "+err)
    })
    //Public
    app.use(express.static(path.join(__dirname,'public')))
    
//routes
app.get("/", (req,res) => {
    Post.find().lean().populate("category").sort({date:"desc"}).then((posts) => {
        res.render("index", {posts: posts})
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error")
        res.redirect("/404")
    })
})
app.get("/post/:slug", (req,res) => {
    Post.findOne({slug: req.params.slug}).lean().then((post) => {
        if(post){
            res.render("post/index", {post:post})
        }else{
            req.flash("error_msg", "This post does not exist")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error")
        res.redirect("/")
    })
})
app.get("/categories", (req,res) => {
    Category.find().lean().then((categories) => {
        res.render("categories/index", {categories:categories})
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error while listing categories")
        res.redirect("/")
    })
})
app.get("/categories/:slug", (req,res) => {
    Category.findOne({slug: req.params.slug}).lean().then((category) => {
        if(category){
            Post.find({category: category._id}).lean().then((posts) => {
                res.render("categories/posts", {posts: posts, category:category})
            }).catch((err) => {
                req.flash("error_msg", "There was an internal error when listing the posts")
                res.redirect("/")
            })
            
        }else{
            req.flash("error_msg", "This category does not exist")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "There was an internal error")
        res.redirect("/")
    })
})
app.get("/404", (req, res) => {
    res.send("error 404")
})
app.use('/admin',admin)
app.use('/users', users)
//others
const PORT = 4001
app.listen(PORT, () => {
    console.log('Server is running')
})