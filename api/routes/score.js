var express = require("express");
var router = express.Router();
const { getScoreForGame} = require("../controllers/scoreCtrl");

/* Get the score for the player and opponent of the game
    Input: request to '/score'
 */
router.post("/",function(req,res,next){
    try{
        // Pass the request to the controller
        getScoreForGame(req,res)
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;