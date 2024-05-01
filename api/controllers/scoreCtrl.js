const {getUserScore,getLeaderBoardScore} = require('../controllers/dbControllers/loginDbCtrl')
const { getOpponent} =  require("../controllers/gameCtrl")

/* Function to get the the score of the player and the opponent of the game
    Input: request that contains the player
    Output: response that contains the score of the player and the opponent
*/
async function getScoreForGame(req,res){
    // Initialize the variables
    const {thisPlayer} = req.body;
    const opponent = await getOpponent(thisPlayer)
    var score1 = 0
    var score2 = 0
    try{
        // Get the score of the player
        score1 = await getUserScore(thisPlayer)
        // Get the score of the opponent
        if (opponent!=='machine'){
            score2 = await getUserScore(opponent)
        }
        else{
            score2 = 0
        }
    }catch(err){
        res.status(500).json({message:err})
        return
    }
    res.status(200).json({ thisPlayerScore: score1, theOpponentScore: score2 });
}

/* Function to get the score for the leader board
    Input: request
    Output: response that contains the leader board
*/
async function getScoreForLeaderBoard(req, res){
    // Get the leader board score
    getLeaderBoardScore().then((result)=>{
        console.log(result)
        res.status(200).json({ leaderBoard:result });
    }).catch((err)=>{
        res.status(500).json({message:err})
        return
    })
}

module.exports = {getScoreForGame, getScoreForLeaderBoard};