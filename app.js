const express = require("express")
const handlebars = require("express-handlebars")
const app = express()
const admin = require("./routes/admin")
// const mongoose = require("mongoose")

//config
    //Body Parser
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
//routes
app.use('/admin',admin)
//others
const PORT = 4001
app.listen(PORT, () => {
    console.log("Server is running")
})