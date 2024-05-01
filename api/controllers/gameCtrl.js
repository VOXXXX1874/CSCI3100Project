const {states} = require('./loginCtrl')
const storeGameRecord = require('./dbControllers/gameRecordDbCtrl')
const {modifyUserScore} = require('./dbControllers/loginDbCtrl')

/* The game pool for storing the game information
    The key is the gameId, which is the concatenation of player1 and player2   
    The value is the game object containing the playerWhite, playerBlack, gameState, gameHistory, startTime
*/
var gamePool = {}

/* The function to create a game and pull it into the game pool
    Input: match object containing player1, player2
    Output: None
*/
async function createGame(match){  
    // Create a game object and store it in the game pool
    game = {playerWhite: match.player1, playerBlack:match.player2, gameState:0, gameHistory:[], startTime:new Date()}
    gamePool[match.player1+"vs"+match.player2] = game

    // Update the user state in the states
    if(match.player1!=='machine'){
        states[match.player1].game=match.player1+"vs"+match.player2
    }
    states[match.player2].game=match.player1+"vs"+match.player2

    // For debugging
    console.log("game pool:",gamePool)
    console.log("states:",states)
}

/* The function to get the opponent of a player
    Input: username
    Output: the opponent of the player
*/
async function getOpponent(username){
    gameId = states[username].game
    if (gamePool[gameId].playerBlack === username){
        return gamePool[gameId].playerWhite
    } 
    return gamePool[gameId].playerBlack
}

/* The function to place a stone on the board
    Input: username, place
    Output: the opponent of the player
*/
async function placeStone(username,place){
    // Return a promise
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            // gameState===0 means it is black turn now
            if(gamePool[gameId].playerBlack === username && gamePool[gameId].gameState===0){
                // Update the game history and game state
                gamePool[gameId].gameHistory.push({playerBlack:place})
                gamePool[gameId].gameState=1
                resolve({anotherPlayer:gamePool[gameId].playerWhite,color:false})
            }// gameState===1 means it is white turn now
            else if (gamePool[gameId].playerWhite === username&& gamePool[gameId].gameState===1){
                // Update the game history and game state
                gamePool[gameId].gameHistory.push({playerWhite:place})
                gamePool[gameId].gameState=0
                resolve({anotherPlayer:gamePool[gameId].playerBlack,color:true})
            }
            else{
                reject("Not this player's turn or during retraction")
            }
            // For debugging
            console.log("game pool:",gamePool)
        }catch(error){
            reject(error)
        }
    })
}

/* The function to check if the random placed stone is duplicated
    Input: randomNum, gameId
    Output: true if the random placed stone is duplicated, false otherwise
*/
function checkDuplication(randomNum,gameId){
    // Get the length of the game history
    const historyLength = gamePool[gameId].gameHistory.length

    // Iterate through the history in reverse order
    for(let i=historyLength-1;i>=0;i--){
        // If the history has a retractStep, go back retractStep steps
        if(gamePool[gameId].gameHistory[i].hasOwnProperty('retractStep')){
            i-=gamePool[gameId].gameHistory[i]['retractStep']
        }
        else{// Otherwise, check if the random placed stone is duplicated
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

/* The function to randomly place a stone on the board
    Input: username, which must be the machine
    Output: the opponent of the machine, which is the player, and the place of the stone
*/
async function randomlyPlaceStone(username){
    // Return a promise
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game

            // If the gameId is empty, it means the game is over when the machine places stone. Return an err
            if(!gamePool[gameId]){
                reject("The game is over")
                return
            }

            // Generate a random number between 0 and 360
            let randomNum = Math.floor(Math.random() * 361);

            // Check if the random placed stone is duplicated
            while(checkDuplication(randomNum,gameId)){
                randomNum = Math.floor(Math.random() * 361);
            }

            // Update the game history and game state
            gamePool[gameId].gameHistory.push({playerWhite:randomNum})
            gamePool[gameId].gameState=0

            // Resolve the promise
            resolve({anotherPlayer:username,place:randomNum,color:true})
        }catch(err){
            reject(err)
        }
    })
}


/* The function to summarize the game
    Input: username
    Output: the result of the game (cleaned or not)
*/
async function summaryGame(username){
    // Return a promise
    return new Promise((resolve,reject)=>{
        try{
            // Get the gameId and modify the state of the user
            const gameId = states[username].game
            states[username].game = ''

            // gameState===2 means one player has left the game
            if(gamePool[gameId].gameState!=2){
                // If one of the players is the machine, clean the game without record
                if(gamePool[gameId].playerWhite==='machine'){
                    delete gamePool[gameId]
                    resolve("Game with random machine player is cleaned without record")
                    return
                }
                // Other wise, if the winner is playerBlack, modify the score of playerBlack and playerWhite
                if(gamePool[gameId].gameState==1){
                    console.log("Modify score. PlayerBlack+ and PlayerWhite-")
                    // Modify the score of playerBlack and playerWhite
                    modifyUserScore(gamePool[gameId].playerBlack,true).then((result)=>{
                        console.log(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                    modifyUserScore(gamePool[gameId].playerWhite,false).then((result)=>{
                        console.log(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                    // Update the winner of the game
                    gamePool[gameId]['winner'] = 'playerBlack'
                }
                else{ // Otherwise, if the winner is playerWhite, modify the score of playerWhite and playerBlack
                    console.log("Modify score. PlayerWhite+ and PlayerBlack-")
                    // Modify the score of playerWhite and playerBlack
                    modifyUserScore(gamePool[gameId].playerWhite,true).then((result)=>{
                        console.log(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                    modifyUserScore(gamePool[gameId].playerBlack,false).then((result)=>{
                        console.log(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                    // Update the winner of the game
                    gamePool[gameId]['winner'] = 'playerWhite'
                }
                // Set the game state to 2, which mean the game will be cleaned after another user leave
                gamePool[gameId].gameState=2
                reject("This game"+gameId+"will be clean after another user leave")
            }
            else{ // If the game state is 2, clean the game and store the game record
                // Update the end time of the game
                gamePool[gameId]['endTime'] = new Date()
                // Store the game record
                storeGameRecord(gamePool[gameId]).then((result)=>{
                    resolve(result)
                }).catch((err)=>{
                    reject(err)
                })
                // Clean the game
                delete gamePool[gameId]
                resolve("The game"+gameId+"is cleaned")
            }
        }catch(err){
            reject(err)
        }
    })
}

/* The function to retract a request
    Input: username
    Output: the opponent of the player
*/
async function retractRequest(username){
    // Return a promise
    return new Promise((resolve,reject)=>{
        try{
            // Get the gameId
            const gameId = states[username].game
            // Update the game state 3, which means the player has requested to retract a step and waiting for the response
            gamePool[gameId].gameState= gamePool[gameId].playerWhite==='machine'? 0:3

            // Resolve the promise
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

/* The function to response to a retract request
    Input: username, message
    Output: the result of the response
*/
async function responseRetractRequest(username,message){
    // Return a promise
    return new Promise((resolve,reject)=>{
        try{
            const gameId = states[username].game
            // If the game state is 3, which means the player has requested to retract a step and waiting for the response
            if(gamePool[gameId].gameState===3){
                // Restore the game state
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
                // If the message is true, update the game history and game state
                if(message){
                    gamePool[gameId].gameHistory.push({retractStep:2})
                }
                // If the message is false, do nothing
                // Resolve the promise
                resolve({playerWhite:gamePool[gameId].playerWhite,playerBlack:gamePool[gameId].playerBlack,result:message})
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

module.exports = {createGame,placeStone,summaryGame,retractRequest,responseRetractRequest,getOpponent,randomlyPlaceStone,gamePool}
