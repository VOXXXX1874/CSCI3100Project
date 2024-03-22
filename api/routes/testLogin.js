var express = require('express');
var router = express.Router();
const sendTestUserInformation = require('../controllers/testLoginCtrl')


// Send the Username and password in the database for test purpose. The router pass the request
// to correct controller instead of process the request by itself.
// ** All the files with name starts with 'test' are for test and will be deleted in the future **
router.get('/', async(req,res,next) => {
    try{
        sendTestUserInformation(res);
    }catch(error){
        console.error('Error executing query:',error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

