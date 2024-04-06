var express = require("express");
var router = express.Router();
const {sessions} = require('../controllers/loginCtrl')
const {accessReplays} = require('../controllers/replayCtrl')

// After client click replay past games, request will be posted and some authentication will be performed
router.post("/",function(req,res,next){
    try{
        console.log('replay route')
        console.log(req.body)
        accessReplays(req,res);
        console.log("Replays accessed!")
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;