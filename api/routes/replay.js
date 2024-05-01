var express = require("express");
var router = express.Router();
const {sessions} = require('../controllers/loginCtrl')
const {accessReplays} = require('../controllers/replayCtrl')

/* Get the replays
    Input: request to '/replay' with the replay information
 */
router.post("/",function(req,res,next){
    try{
        console.log('replay route')
        console.log(req.body)
        // Pass the request to the controller
        accessReplays(req,res);
        console.log("Replays accessed!")
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;