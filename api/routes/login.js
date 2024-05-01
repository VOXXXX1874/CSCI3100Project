var express = require("express");
var router = express.Router();
const {verifyLoginInformation} = require("../controllers/loginCtrl")

/* Login to the account
    Input: POST request to '/login' with the login information
*/
router.post("/",function(req,res,next){
    try{
        // Pass the request to the controller
        verifyLoginInformation(req,res);
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;