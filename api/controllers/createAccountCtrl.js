const {getUsername,createAccount} = require('./dbControllers/createAccountDbCtrl')

/* Function to create a new account
    Input: request contains username, password
    Output: response contains a message
*/
async function createANewAccount(req,res){
    // read data from request
    const {username,password} = req.body;

    // Get the corresponding user name from db and check duplication
    getUsername(username).then((result)=>{
        if(result.length>0){ // If the username has been used
            // Return a 400 status code and a message
            res.status(400).json({message:'This username has been used by others'})
        }
        else{ // If the username has not been used
            // Create an account
            createAccount(username,password).then((result)=>{
                console.log(result)
                res.status(200).json({ message: 'Successfully create account' });
            }).catch((err)=>{
                res.status(500).json({message:err})
            })
        }
    }).catch((err)=>{
        res.status(500).json({message:err})
    })
}

module.exports = createANewAccount;