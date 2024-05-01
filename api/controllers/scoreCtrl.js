const {getUserScore,getLeaderBoardScore} = require('../controllers/dbControllers/loginDbCtrl')
const { getOpponent} =  require("../controllers/gameCtrl")

async function getScoreForGame(req,res){
    const {thisPlayer} = req.body;
    const opponent = await getOpponent(thisPlayer)
    var score1 = 0
    var score2 = 0
    try{
        score1 = await getUserScore(thisPlayer)
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

async function getScoreForLeaderBoard(req, res){
    getLeaderBoardScore().then((result)=>{
        console.log(result)
        res.status(200).json({ leaderBoard:result });
    }).catch((err)=>{
        res.status(500).json({message:err})
        return
    })
}

module.exports = {getScoreForGame, getScoreForLeaderBoard};