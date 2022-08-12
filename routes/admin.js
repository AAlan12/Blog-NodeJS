const express = require("express")
const { unregisterDecorator } = require("handlebars")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Category")
const Category = mongoose.model("categories")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/posts', (req,res) => {
    res.send("Posts page")
})

router.get('/categories', (req,res) => {
    Category.find().lean().sort({date:'desc'}).then((categories) => {
        res.render("admin/categories", {categories: categories})
    }).catch((err) => {
        req.flash("error_msg", "There was an error trying to list the categories")
        res.redirect("/admin")
    })
    
})

router.get('/categories/add', (req,res) => {
    res.render("admin/addCategories")
})

router.post('/categories/new', (req,res) => {
    
    let error = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        error.push({text: "invalid name"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        error.push({text: "invalid slug"})
    }
    if(req.body.name.length < 2){
        error.push({text: "category name is too small"})
    }
    if(error.length > 0){
        res.render("admin/addCategories", {error: error})
    }else{
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new Category(newCategory).save().then(()=>{
            req.flash("success_msg", "Category created successfully")
            res.redirect("/admin/categories")
        }).catch((err) => {
            req.flash("error_msg", "There was an error trying to save the category, please try again")
            res.redirect("/admin")
        })
    } 
})
module.exports = router