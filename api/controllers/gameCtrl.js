const {states} = require('./loginCtrl')
const storeGameRecord = require('./dbControllers/gameRecordDbCtrl')

var gamePool = {}

async function createGame(match){  
    game = {playerWhite: match.player1, playerBlack:match.player2, gameState:0, gameHistory:[], startTime:new Date()}
    gamePool[match.player1+"vs"+match.player2] = game
    if(match.player1!=='machine'){
        states[match.player1].game=match.player1+"vs"+match.player2
    }
    states[match.player2].game=match.player1+"vs"+match.player2
    console.log("game pool:",gamePool)
    console.log("states:",states)
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
            const gameId = states[username].game
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
                reject("Not this player's turn or during retraction")
            }
            console.log("game pool:",gamePool)
        }catch(error){
            reject(error)
        }
    })
}

function checkDuplication(randomNum,gameId){
    const historyLength = gamePool[gameId].gameHistory.length
    for(let i=historyLength-1;i>=0;i--){
        if(gamePool[gameId].gameHistory[i].hasOwnProperty('retractStep')){
            i-=gamePool[gameId].gameHistory[i]['retractStep']
        }
        else{
            if(gamePool[gameId].gameHistory[i].hasOwnProperty('playerBlack')
            &&gamePool[gameId].gameHistory[i]['playerBlack']===randomNum){
                return true
            }
            else if(gamePool[gameId].gameHistory[i].hasOwnProperty('playerWhite')
            &&gamePool[gameId].gameHistory[i]['playerWhite']===randomNum){
                return true
            }
        }
    }
    return false
}

async function randomlyPlaceStone(username){
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            let randomNum = Math.floor(Math.random() * 361);
            while(checkDuplication(randomNum,gameId)){
                randomNum = Math.floor(Math.random() * 361);
            }
            gamePool[gameId].gameHistory.push({playerWhite:randomNum})
            gamePool[gameId].gameState=0
            resolve({anotherPlayer:username,place:randomNum,color:true})
        }catch(err){
            reject(err)
        }
    })
}

async function summaryGame(username){
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            states[username].game = ''
            // gameState===2 means one player has left the game
            if(gamePool[gameId].gameState!=2){
                if(gamePool[gameId].gameState==1){
                    gamePool[gameId]['winner'] = 'playerBlack'
                }
                else{
                    gamePool[gameId]['winner'] = 'playerWhite'
                }
                gamePool[gameId].gameState=2
                reject("This game"+gameId+"will be clean after another user leave")
            }
            else{
                gamePool[gameId]['endTime'] = new Date()
                storeGameRecord(gamePool[gameId]).then((result)=>{

                }).catch((err)=>{

                })
                delete gamePool[gameId]
                resolve("The game"+gameId+"is cleaned")
            }
        }catch(err){
            reject(err)
        }
    })
}

async function retractRequest(username){
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            gamePool[gameId].gameState= gamePool[gameId].playerWhite==='machine'? 0:3
            if(gamePool[gameId].playerBlack === username){
                resolve(gamePool[gameId].playerWhite)
            }
            else if(gamePool[gameId].playerWhite === username){
                resolve(gamePool[gameId].playerBlack)
            }
            else{
                reject("unknow error")
            }
            console.log(gamePool)
        }catch(err){
            reject(err)
        }
    })
}

async function responseRetractRequest(username,message){
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            if(gamePool[gameId].gameState===3){
                if(username === gamePool[gameId].playerBlack){
                    gamePool[gameId].gameState=1
                }
                else if(username === gamePool[gameId].playerWhite){
                    gamePool[gameId].gameState=0
                }
                else{
                    reject("Unexpected error. Response from unknow user")
                    return
                }
                if(message){
                    gamePool[gameId].gameHistory.push({retractStep:2})
                    resolve({playerWhite:gamePool[gameId].playerWhite,playerBlack:gamePool[gameId].playerBlack})
                }
                else{
                    reject("The opposite player "+username+" refuse the retraction")
                }
                console.log(gamePool)
            }
            else{
                reject("Unknow error. The game state is not 3")
            }
        }catch(err){
            reject(err)
        }
    })
}

module.exports = {createGame,placeStone,summaryGame,retractRequest,responseRetractRequest,getOpponent,randomlyPlaceStone}
