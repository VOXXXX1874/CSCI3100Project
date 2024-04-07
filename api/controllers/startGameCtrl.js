const {sessions} = require('./loginCtrl')

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

// This controller is called by the router, ask database controller for user information, and send the user information back
async function startGame(req,res){
    try{
        if(sessions[req.cookies.session_id].authenticated){
            console.log('Receive game start from', sessions[req.cookies.session_id].username)
            waitingPlayerQueue.enqueue(sessions[req.cookies.session_id].username)
            waitingPlayerPool[sessions[req.cookies.session_id].username] = 'Waiting for matching'
            //res.status(200).json({ message: 'Successfully start game. We are finding another player for you...' });
        }
        else{
            res.status(401).json({ message: 'Unauthorized' });
        }
    }catch(err){
        console.log(err);
        res.status(401).json({ message: 'Please Login First' });
    }
}

module.exports = startGame;