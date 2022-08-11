const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require("mongoose")

//config
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
    //Middleware
    app.use((req,res,next) => {
        console.log("Middleware on")
        next()
    })
//routes
app.use('/admin',admin)
//others
const PORT = 4001
app.listen(PORT, () => {
    console.log('Server is running')
})