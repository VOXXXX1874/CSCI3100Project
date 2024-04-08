const getTestUserInformation = require('./dbControllers/testLoginDbCtrl')

// This controller is called by the router, ask database controller for user information, and send the user information back
async function sendTestUserInformation(res){
    getTestUserInformation().then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log("DATABASE ERROR:",err);
        res.send("DATABASE ERROR");
    });
}

module.exports = sendTestUserInformation;