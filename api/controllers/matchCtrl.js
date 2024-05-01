const {states} = require('./loginCtrl')

/* Class to implement a queue
    Methods:
        enqueue(item): add an item to the queue
        dequeue(): remove the first item from the queue
        isEmpty(): check if the queue is empty
        size(): get the size of the queue
*/
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

/* The waiting player queue
    The queue is used to store the players who are waiting for matching
*/
const waitingPlayerQueue = new Queue();

/* The waiting player pool
    The pool is used to store the players who are waiting for matching
    The key is the username of the player and the value is the status of the player
    It can reduce the complexity of the queue
*/
var waitingPlayerPool = {};

/* The matched player pool
    The pool is used to store the matched players
    The key is the ID of the match (player1+player2) and the value is the status of the players
    The status is a dictionary with the key as the username of the player and the value as the confirmation status
*/
var matchedPlayerPool = {};

/* Function to start a game by beginning the matching process
    Input: username of the player
    Output: a promise that whether the player is matched
*/
async function startGame(username){
    console.log('Receive game start from', username)
    // Return a promise
    return new Promise((resolve,reject)=>{
        if(waitingPlayerPool.hasOwnProperty(username)){ // If the player is already in the pool (for the case that the player cancel the match)
            waitingPlayerPool[username] = 'Waiting for matching'
        }
        else{ // If the player is not in the pool
            waitingPlayerQueue.enqueue(username)
            waitingPlayerPool[username] = 'Waiting for matching'
        }
        // Everytime one player enter the queue, call the function to match two players
        matchTwoPlayers().then((result)=>{
            resolve(result)
        }).catch((err)=>{
            reject(err)
        })
        // For debugging
        console.log('(async) Queue:', waitingPlayerQueue)
        console.log('(async) Pool:', waitingPlayerPool)
    })
}

/* Function to cancel a match
    Input: username of the player
*/
async function cancelMatch(username){
    console.log('Receive cancel match from', username)
    // If the player is in the pool, set the status to 'Canceled'
    // Do not removed the player from queue to reduce the complexity
    if(waitingPlayerPool.hasOwnProperty(username)){
        waitingPlayerPool[username] = 'Canceled'
    }
    console.log('Queue:', waitingPlayerQueue)
    console.log('Pool:', waitingPlayerPool)
}

/* Function to match two players
    Output: a promise that resolves to the matched players
*/
async function matchTwoPlayers(){
    // Return a promise
    return new Promise((resolve,reject)=>{
        let counter = 0
        let player1 = ""
        let player2 = ""
        // Dequeue players until counter reaches 2 or the queue is empty
        while(counter<2&&!waitingPlayerQueue.isEmpty()){
            let player = waitingPlayerQueue.dequeue()
            // If the player is still waiting for matching (not canceled)
            if(waitingPlayerPool[player]=='Waiting for matching'){
                // Remove the player from the pool
                delete waitingPlayerPool[player]
                if(counter==0){
                    player1=player
                }
                else if(counter==1){
                    player2=player
                }
                counter++
            }
            else{// If the player is canceled, do not count it and remove it from the pool
                delete waitingPlayerPool[player]
            }
        }
        // If counter is 0, no match
        if(counter==0){
            reject("no match")
        }
        else if (counter==1){// If counter is 1, put the player back to the queue
            waitingPlayerQueue.enqueue(player1)
            waitingPlayerPool[player1]='Waiting for matching'
            reject("no match")
        }
        else{// If counter is 2, return the match
            const match={player1:player1,player2:player2}
            // Add the match to the matched player pool 
            matchedPlayerPool[player1+"vs"+player2] = {}
            matchedPlayerPool[player1+"vs"+player2][player1]=false
            matchedPlayerPool[player1+"vs"+player2][player2]=false
            // One possible bug here, the ID of the match is player1+player2, which is not unique
            resolve(match)
        }
    })
}

/* Function to confirm a match
    Input: username of the player and the match (player1 and player2)
    Output: a promise that resolves to the match (player1 and player2) if both players confirm the match
*/
async function confirmMatch(username,match){
    // Return a promise
    return new Promise((resolve,reject)=>{
        const matchId = match.player1+"vs"+match.player2
        // If the match is in the matched player pool
        if(matchedPlayerPool.hasOwnProperty(matchId)){
            // Set the confirmation status of the player
            matchedPlayerPool[matchId][username]=true
            // If both players confirm the match, resolve the promise
            if(matchedPlayerPool[matchId][match.player1] && matchedPlayerPool[matchId][match.player2]){
                delete matchedPlayerPool[matchId]
                resolve(match)
            }
            else{
                reject("Wait for another player confirmation")
            }
        }
        else{
            reject("Unexpected match confirm message from user",username)
        }
    })
}

/* Function to refuse a match
    Input: username of the player and the match (player1 and player2)
*/
async function refuseMatch(username,match){
    const matchId = match.player1+"vs"+match.player2
    // If the match is in the matched player pool
    if(matchedPlayerPool.hasOwnProperty(matchId)){
        // Remove the match from the matched player pool
        delete matchedPlayerPool[matchId]
        // Put the player that does not refuse back to the queue
        if(match.player1==username){
            waitingPlayerQueue.enqueue(match.player2)
            waitingPlayerPool[match.player2] = 'Waiting for matching'
        }
        else if(match.player2==username){
            waitingPlayerQueue.enqueue(match.player1)
            waitingPlayerPool[match.player1] = 'Waiting for matching'
        }
    }
}

module.exports = {startGame,cancelMatch,confirmMatch,refuseMatch};