var express = require("express");
var router = express.Router();
const createANewAccount = require("../controllers/createAccountCtrl")

// Just a simple router for testing
router.post("/",function(req,res,next){
    try{
        createANewAccount(req,res);
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;