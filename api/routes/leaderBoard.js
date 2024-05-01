var express = require("express");
var router = express.Router();
const { getScoreForLeaderBoard} = require("../controllers/scoreCtrl");

router.post("/",function(req,res,next){
    try{
        getScoreForLeaderBoard(req,res)
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;