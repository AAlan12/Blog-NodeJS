const express = require("express")
const handlebars = require("express-handlebars")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
// const mongoose = require("mongoose")

//config
    //Body Parser
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
    //Public
    // app.use(express.static(path.join(__dirname,"public")))
    // app.use(express.static(path.join( 'public/css')))
    // app.use(express.static(path.join(__dirname + "/public")))
    app.use(express.static(__dirname + '/public'))
//routes
app.use('/admin',admin)
//others
const PORT = 4001
app.listen(PORT, () => {
    console.log("Server is running")
})