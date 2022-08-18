const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")

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
        User.findOne({email: req.body.email}).lean().then((user) => {
            if(user){
                req.flash("error_msg", "An account with this email already exists in our system")
                res.redirect("/users/record")
            }else{
                const newUser = User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.password,salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "There was an error saving the user")
                            res.redirect("/")
                        }
                        newUser.password = hash
                        newUser.save().then(() =>{
                            req.flash("success_msg", "User created successfully")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "There was an error creating the user")
                            res.redirect("/users/record")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "There was an internal error")
            res.redirect("/")
        })
    }
})


module.exports = router