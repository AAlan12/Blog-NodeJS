const express = require("express")
const { unregisterDecorator } = require("handlebars")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Category")
const Category = mongoose.model("categories")
require("../models/Post")
const Post = mongoose.model("posts")

router.get('/', (req,res) => {
    res.render("admin/index")
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

router.get("/categories/edit/:id",(req,res) =>{
    Category.findOne({_id:req.params.id}).lean().then((category) =>{
        res.render("admin/editCategories", {category: category})
    }).catch((err) => {
        req.flash("error_msg", "This category does not exist")
        res.redirect("/admin/categories")
    })
})

router.post("/categories/edit", (req,res) => {
    Category.findOne({_id: req.body.id}).then((category) => {
        
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
        Category.findOne({_id: req.body.id}).lean().then((category) => {
            res.render("admin/editCategories", {category: category, error: error})
        }).catch((err) => {
            req.flash("error_msg", "Error getting data")
            res.redirect("admin/categories")
        })   
    }else{
        category.name = req.body.name
        category.slug = req.body.slug

        category.save().then(() => {
            req.flash("success_msg", "Category edited successfully")
            res.redirect("/admin/categories")
        }).catch((err) => {
            req.flash("error_msg", "There was an error saving the category")
            res.redirect("admin/categories")
        })
    }       
    }).catch((err) => {
        req.flash("error_msg", "There was an error editing the category")
        res.redirect("/admin/categories")
    })
})

router.post("/categories/delete", (req,res) => {
    Category.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Category deleted successfully")
        res.redirect("/admin/categories")
    }).catch((err) => {
        req.flash("error_msg", "There was an error trying to delete the category")
        res.redirect("/admin/categories")
    })
})

router.get("/posts", (req,res) => {
    Post.find().lean().populate("category").sort({data: "desc"}).then((posts) =>{
        res.render("admin/posts", {posts: posts})
    }).catch((err) => {
        req.flash("error_msg", "There was an error listing the posts")
        res.redirect("/admin")
    })
})

router.get("/posts/add", (req,res) => {
    Category.find().lean().then((categories) => {
        res.render("admin/addPosts", {categories: categories})
    }).catch((err) => {
        req.flash("error_msg", "There was an error loading the category form")
        res.redirect("/admin")
    })
})

router.post("/posts/new", (req,res) => {
    
    let error = []

    if(req.body.category == "0"){
        error.push({text: "Invalid category, register a category"})
    }
    if(error.length > 0){
        res.render("admin/addPosts", {error: error})
    }else{
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }
        new Post(newPost).save().then(()=>{
            req.flash("success_msg", "Post created successfully")
            res.redirect("/admin/posts")
        }).catch((err) => {
            req.flash("error_msg", "There was an error while saving the post")
            res.redirect("/admin/posts")
        })
    }
})
module.exports = router