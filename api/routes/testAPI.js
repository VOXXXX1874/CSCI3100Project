var express = require("express");
var router = express.Router();

// Just a simple router for testing
router.get("/",function(req,res,next){
    res.send("API is working properly")
});

module.exports = router;