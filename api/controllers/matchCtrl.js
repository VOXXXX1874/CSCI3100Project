const {states} = require('./loginCtrl')

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
const waitingPlayerQueue = new Queue();

var waitingPlayerPool = {};

var matchedPlayerPool = {};

// This controller is called by the router, ask database controller for user information, and send the user information back
async function startGame(username){
    console.log('Receive game start from', username)
    return new Promise((resolve,reject)=>{
        if(waitingPlayerPool.hasOwnProperty(username)){
            waitingPlayerPool[username] = 'Waiting for matching'
        }
        else{
            waitingPlayerQueue.enqueue(username)
            waitingPlayerPool[username] = 'Waiting for matching'
        }
        matchTwoPlayers().then((result)=>{
            resolve(result)
        }).catch((err)=>{
            reject(err)
        })
        console.log('(async) Queue:', waitingPlayerQueue)
        console.log('(async) Pool:', waitingPlayerPool)
    })
}

async function cancelMatch(username){
    console.log('Receive cancel match from', username)
    if(waitingPlayerPool.hasOwnProperty(username)){
        waitingPlayerPool[username] = 'Canceled'
    }
    console.log('Queue:', waitingPlayerQueue)
    console.log('Pool:', waitingPlayerPool)
}

async function matchTwoPlayers(){
    return new Promise((resolve,reject)=>{
        let counter = 0
        let player1 = ""
        let player2 = ""
        while(counter<2&&!waitingPlayerQueue.isEmpty()){
            let player = waitingPlayerQueue.dequeue()
            if(waitingPlayerPool[player]=='Waiting for matching'){
                delete waitingPlayerPool[player]
                if(counter==0){
                    player1=player
                }
                else if(counter==1){
                    player2=player
                }
                counter++
            }
            else{
                delete waitingPlayerPool[player]
            }
        }
        if(counter==0){
            reject("no match")
        }
        else if (counter==1){
            waitingPlayerQueue.enqueue(player1)
            waitingPlayerPool[player1]='Waiting for matching'
            reject("no match")
        }
        else{
            const match={player1:player1,player2:player2}
            // One bug here, player1+vs+player2 cannot uniquely identify one match. 
            matchedPlayerPool[player1+"vs"+player2] = {}
            matchedPlayerPool[player1+"vs"+player2][player1]=false
            matchedPlayerPool[player1+"vs"+player2][player2]=false
            resolve(match)
        }
    })
}

async function confirmMatch(username,match){
    return new Promise((resolve,reject)=>{
        const matchId = match.player1+"vs"+match.player2
        if(matchedPlayerPool.hasOwnProperty(matchId)){
            matchedPlayerPool[matchId][username]=true
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

async function refuseMatch(username,match){
    const matchId = match.player1+"vs"+match.player2
    if(matchedPlayerPool.hasOwnProperty(matchId)){
        delete matchedPlayerPool[matchId]
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