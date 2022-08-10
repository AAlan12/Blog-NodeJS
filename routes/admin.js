const express = require("express")
const router = express.Router()

router.get('/', (req,res) => {
    res.send("Admin dashboard main page")
})

router.get('/posts', (req,res) => {
    res.send("Posts page")
})

module.exports = router