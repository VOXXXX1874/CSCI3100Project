var express = require("express");
var router = express.Router();
const { getScoreForLeaderBoard} = require("../controllers/scoreCtrl");

/* Get the leader board score
    Input: request to '/leaderBoard'
 */
router.post("/",function(req,res,next){
    try{
        // Pass the request to the controller
        getScoreForLeaderBoard(req,res)
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;