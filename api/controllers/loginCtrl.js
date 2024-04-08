const getUserInformation = require('../controllers/dbControllers/loginDbCtrl')

async function getUserInformation_test(username){
    return Array(
        {password: '123456'}
    );
}

// sessions is an object to maintain all the sessions
var sessions = {};

// states is an object to maintain states of each online user
var states = {};

// This controller is called by the router, ask database controller for user information, and send the user information back
async function verifyLoginInformation(req,res){
    // Read the username and password from the request
    const {username,password} = req.body;
    console.log('Username:',username);
    console.log('Password:',password);
    resFromDb = await getUserInformation_test(username)
    console.log('response from db:',resFromDb)
    // TO DO: call dbController to get the account information to verify the username and password.
    // Always return true
    // After passing the verification, a random session id is generated and stored in session
    // with some related infomations about the user
    const sessionId = Math.random().toString(36).substring(7);
    sessions[sessionId] = { authenticated: true, username: username}
    // Vox: I will make use of the waitingMatch and match later
    states[username] = {waitingMatch:false, match:'', game:''}
    // Send the session id to client by cookie
    res.cookie('session_id', sessionId, { maxAge: 60000, secure:true, httpOnly:true });
    res.status(200).json({ message: 'Successfully login' });
}

module.exports = {verifyLoginInformation,sessions,states};

