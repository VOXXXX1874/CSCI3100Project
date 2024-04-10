const {getUserInformation} = require('../controllers/dbControllers/loginDbCtrl')

// sessions is an object to maintain all the sessions
var sessions = {};

// states is an object to maintain states of each online user
var states = {};

// This controller is called by the router, ask database controller for user information, and send the user information back
async function verifyLoginInformation(req,res){
    // Read the username and password from the request
    const {username,password} = req.body;

    // For convenience, any username and password will pass this function
    //const sessionId = Math.random().toString(36).substring(7);
    //sessions[sessionId] = { authenticated: true, username: username}
    //states[username] = {waitingMatch:false, match:'', game:''}
    //res.cookie('session_id', sessionId, { maxAge: 60000, secure:true, httpOnly:true });
    //res.status(200).json({ message: 'Successfully login' });

    // This is real login
    getUserInformation(username).then((result)=>{
        if(result.length<1){
            res.status(401).json({message:'Wrong username or password'})
        }
        else if(result[0].password!==password){
            res.status(401).json({message:"Wrong username or password"})
        }
        else{
            const sessionId = Math.random().toString(36).substring(7);
            sessions[sessionId] = { authenticated: true, username: username}
            // Vox: I will make use of the waitingMatch and match later
            states[username] = {waitingMatch:false, match:'', game:''}
            // Send the session id to client by cookie
            res.cookie('session_id', sessionId, { maxAge: 60000, secure:true, httpOnly:true });
            res.status(200).json({ message: 'Successfully login' });
        }
    }).catch((err)=>{
        res.status(500).json({message:err})
    })
}

module.exports = {verifyLoginInformation,sessions,states};