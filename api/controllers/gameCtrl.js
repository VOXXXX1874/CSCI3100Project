const {states} = require('./loginCtrl')

var gamePool = {}

async function createGame(match){  
    game = {playerBlack: match.player1, playerWhite:match.player2, gameState:0, gameHistory:[]}
    gamePool[match.player1+"vs"+match.player2] = game
    states[match.player1].game=match.player1+"vs"+match.player2
    states[match.player2].game=match.player1+"vs"+match.player2
    console.log("game pool:",gamePool)
    console.log("states:",states)
}

async function placeStone(username,place){
    gameId = states[username].game
    if(gamePool[gameId].playerBlack === username){
        gamePool[gameId].gameHistory.push({playerBlack:place})
    }
    else if (gamePool[gameId].playerWhite === username){
        gamePool[gameId].gameHistory.push({playerWhite:place})
    }
    console.log("game pool:",gamePool)
}

module.exports = {createGame,placeStone}