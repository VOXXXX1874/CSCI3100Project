var express = require("express");
var router = express.Router();

// When the frontend sends request to /testAPI, it sends a response to prove the backend is working
// ** All the files with name starts with 'test' are for test and will be deleted in the future **
router.get("/",function(req,res,next){
    res.send("API is working properly")
});

module.exports = router;