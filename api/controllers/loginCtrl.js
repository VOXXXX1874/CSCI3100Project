const getUserInformation = require('../controllers/dbControllers/loginDbCtrl')

async function getUserInformation_test(username){
    return Array(
        {password: '123456'}
    );
}

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
    res.status(200).json({ message: 'Successfully login' });
}

module.exports = verifyLoginInformation;