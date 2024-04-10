const getUserReplays = require('../controllers/dbControllers/replayDbCtrl')

function test(){
    const finalGoBoard = Array(361).fill(null)
    finalGoBoard[30] = "X"
    finalGoBoard[31] = "X"
    finalGoBoard[32] = "X"
    finalGoBoard[20] = "O"
    finalGoBoard[21] = "O"
    finalGoBoard[22] = "O"
    /* null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, 'X',  'X',  'X',  'X',  'X',  null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    'O',  'O',  'O',  'O',  null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    ... 261 more items */
    return [
        {
          gameId: 'kst6u',
          startTime: new Date(),
          elapsedTime: 0,
          playerBlack: 'voxx',
          playerWhite: 'aaa',
          winner: 'playerBlack',
          finalGoBoard: finalGoBoard
        }
    ]
}

// This controller is called by the router, ask database controller for user information, and send the user information back
async function accessReplays(req,res){
    // Read the username and password from the request
    const {username} = req.body;
    console.log(req.body)
    console.log('Username:',username);
    // resFromDb = await test()
    resFromDb = await getUserReplays(username)
    console.log('response from db:',resFromDb)
    // Send a success response along with the database response
    res.status(200).json({ message: 'Successfully accessed replays', replays: resFromDb });}

module.exports = {accessReplays};