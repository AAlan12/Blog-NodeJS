const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Post = new Schema({
    title:{
        type: String,
        
    },
    slug:{
        type: String,
        
    },
    description:{
        type: String,
        
    },
    content:{
        type: String,
        
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "categories",
        
    },
    date:{
        type: Date,
        default: Date.now()
    }
})
mongoose.model("posts", Post)
