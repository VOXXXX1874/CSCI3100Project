var express = require("express");
var router = express.Router();
const {sessions} = require('../controllers/loginCtrl')

// After client click start game, request will be posted and some authentication will be performed
router.post("/",function(req,res,next){
    try{
        if(sessions[req.cookies.session_id].authenticated){
            console.log('Receive game start from', sessions[req.cookies.session_id].username)
            res.status(200).json({ message: 'Successfully start game' });
        }
        else{
            res.status(401).json({ message: 'Unauthorized' });
        }
    }catch(err){
        res.status(401).json({ message: 'Please Login First' });
    }
});

module.exports = router;