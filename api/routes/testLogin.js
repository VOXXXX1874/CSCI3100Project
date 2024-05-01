var express = require('express');
var router = express.Router();
const sendTestUserInformation = require('../controllers/testLoginCtrl')


// just a simple router for testing
router.get('/', async(req,res,next) => {
    try{
        sendTestUserInformation(res);
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

