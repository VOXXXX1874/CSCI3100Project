const {getUsername,createAccount} = require('./dbControllers/createAccountDbCtrl')

async function createANewAccount(req,res){
    // read data from request
    const {username,password} = req.body;

    // Get the corresponding user name from db and check duplication
    getUsername(username).then((result)=>{
        if(result.length>0){
            res.status(400).json({message:'This username has been used by others'})
        }
        else{
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