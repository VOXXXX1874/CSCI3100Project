const getTestUserInformation = require('./dbControllers/testLoginDbCtrl')

// Just a simple function to send the test user information
async function sendTestUserInformation(res){
    getTestUserInformation().then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log("DATABASE ERROR:",err);
        res.send("DATABASE ERROR");
    });
}

module.exports = sendTestUserInformation;