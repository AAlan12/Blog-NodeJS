const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")

router.get("/record", (req, res) => {
    res.render("users/record")
})

router.post("/record", (req,res) => {
    let error = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        error.push({text: "Invalid name"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        error.push({text: "Invalid email"})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        error.push({text: "Invalid password"})
    }
    if(req.body.password.length < 4){
        error.push({text: "Very short password"})
    }
    if(req.body.password != req.body.password2){
        error.push({text: "Different passwords"})
    }
    if(error.length > 0){
        res.render("users/record", {error: error})
    }else{
        
    }
})


module.exports = router