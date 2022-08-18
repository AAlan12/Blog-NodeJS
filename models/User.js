const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    isAdmin:{
        type: Number,
        default: 0
    },
    password:{
        type: String
    }
})

mongoose.model("users", User)