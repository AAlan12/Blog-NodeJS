const express = require("express")
const handlebars = require("express-handlebars")
const bodyParse = require("body-parser")
const app = express()
// const mongoose = require("mongoose")

//config
    //Body Parser
    app.use(bodyParse.urlencoded({extended:true}))
    app.use(bodyParse.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
//routes

//others
const PORT = 4001
app.listen(PORT, ()=>{
    console.log("Server is running")
})