var express = require("express");
var router = express.Router();

// A login router for receiving the post request. It is for testing and practicing
router.post("/",function(req,res,next){
    // Read the username and password from the request
    const {username,password} = req.body;
    console.log('Username:',username);
    console.log('Password:',password);
    // TO DO: call dbController to verify the account
    // Always return true
    res.status(200).json({ message: 'Login successful' });
});

module.exports = router;