const {getUserInformation} = require('../controllers/dbControllers/loginDbCtrl')

/* Sessions is an object to maintain the session of each online user
    The key is the session id, the value is an object containing the authentication status and the username
*/
var sessions = {};

/* States is an object to maintain the state of each online user
    The key is the username, the value is an object containing the waitingMatch, match, and game properties
    waitingMatch: a boolean value indicating whether the user is waiting for a match
    match: the username of the opponent
    game: the game id
*/
var states = {};

/* Function to verify the login information
    Input: request contains username, password
    Output: response contains a message
*/
async function verifyLoginInformation(req,res){
    // Read the username and password from the request
    const {username,password} = req.body;
    if(!username || !password){
        if (Object.getPrototypeOf(req.cookies) !== null){
            if(sessions.hasOwnProperty(req.cookies.session_id)){
                console.log(states[sessions[req.cookies.session_id].username])
                res.status(200).json({ username: sessions[req.cookies.session_id].username, state: states[sessions[req.cookies.session_id].username] });
                return;
            }
        }
    }
    // For convenience, any username and password will pass the comment out code
    //const sessionId = Math.random().toString(36).substring(7);
    //sessions[sessionId] = { authenticated: true, username: username}
    //states[username] = {waitingMatch:false, match:'', game:''}
    //res.cookie('session_id', sessionId, { maxAge: 60000, secure:true, httpOnly:true });
    //res.status(200).json({ message: 'Successfully login' });

    // Get the user information from the database
    getUserInformation(username).then((result)=>{
        // If the username does not exist
        if(result.length<1){
            res.status(401).json({message:'Wrong username or password'})
        }
        else if(result[0].password!==password){ // If the password is wrong
            res.status(401).json({message:"Wrong username or password"})
        }
        else{ // If the username and password are correct
            // Generate a session id
            const sessionId = Math.random().toString(36).substring(7);
            // Store the session id in the sessions object
            sessions[sessionId] = { authenticated: true, username: username}
            // Initialize the state of the user
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