const getUserReplays = require('../controllers/dbControllers/replayDbCtrl')

// This controller is called by the router, ask database controller for user information, and send the user information back
async function accessReplays(req,res){
    // Read the username and password from the request
    const {username} = req.body;
    console.log(req.body)
    console.log('Username:',username);
    resFromDb = await getUserReplays(username)
    console.log('response from db:',resFromDb)
    // Send a success response along with the database response
    res.status(200).json({ message: 'Successfully accessed replays', replays: resFromDb });}

module.exports = {accessReplays};