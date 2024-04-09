const {states} = require('./loginCtrl')

var gamePool = {}

async function createGame(match){  
    game = {playerWhite: match.player1, playerBlack:match.player2, gameState:0, gameHistory:[]}
    gamePool[match.player1+"vs"+match.player2] = game
    states[match.player1].game=match.player1+"vs"+match.player2
    states[match.player2].game=match.player1+"vs"+match.player2
    // console.log("game pool:",gamePool)
    // console.log("states:",states)
}

async function getOpponent(username){
    console.log('getOpponent')
    gameId = states[username].game
    if (gamePool[gameId].playerBlack === username){
        return gamePool[gameId].playerWhite
    } 
    return gamePool[gameId].playerBlack
}

async function placeStone(username,place){
    return new Promise((resolve,reject)=>{
        try{
            gameId = states[username].game
            // gameState===0 means it is black turn now
            if(gamePool[gameId].playerBlack === username && gamePool[gameId].gameState===0){
                gamePool[gameId].gameHistory.push({playerBlack:place})
                gamePool[gameId].gameState=1
                resolve({anotherPlayer:gamePool[gameId].playerWhite,color:false})
            }// gameState===1 means it is white turn now
            else if (gamePool[gameId].playerWhite === username&& gamePool[gameId].gameState===1){
                gamePool[gameId].gameHistory.push({playerWhite:place})
                gamePool[gameId].gameState=0
                resolve({anotherPlayer:gamePool[gameId].playerBlack,color:true})
            }
            else{
                reject("Not this player's turn")
            }
            console.log("game pool:",gamePool)
        }catch(error){
            reject(error)
        }
    })
}

async function summaryGame(username,winner){
    return new Promise((resolve,reject)=>{
        try{
            gameId = states[username].game
            states[username].game = ''
            // gameState===2 means one player has left the game
            if(gamePool[gameId].gameState!=2){
                gamePool[gameId].gameState=2
                reject("This game"+gameId+"will be clean after another user leave")
            }
            else{
                delete gamePool[gameId]
                resolve("The game"+gameId+"is cleaned")
            }
        }catch(err){
            reject(err)
        }
    })
}

module.exports = {createGame,placeStone,summaryGame,getOpponent}