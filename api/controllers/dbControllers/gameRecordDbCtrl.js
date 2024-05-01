const mysql = require('mysql2')

/* Settings for the connection pool
 * See createAccountDbCtrl.js for more details
*/
const pool = mysql.createPool({
    host: 'localhost',
    user: 'CSCI3100Project',
    password: 'smgg',
    database: 'gobang',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

/* Calculate the difference in minutes between two dates
    Input: date1, date2
    Output: difference in minutes
*/
function getMinutesDifference(date1, date2) {
    let differenceInMilliseconds = Math.abs(date2 - date1);
    let differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes;
}

/* Function to get the final Go board from the game history
    Input: history containing the game history 
    (An array of objects, each object contains the playerBlack, playerWhite, and retractStep properties) (see gameCtrl.js for more details)
    Output: the final Go board
*/
function getFinalGoBoard(history){
    // Initialize the board with 361 nulls
    let board = Array(361).fill(null)
    const historyLength = history.length

    // Iterate through the history in reverse order
    for(let i=historyLength-1;i>=0;i--){
        // If the history has a retractStep, go back retractStep steps
        if(history[i].hasOwnProperty('retractStep')){
            i-=history[i]['retractStep']
        }
        else{ // Otherwise, update the board
            if(history[i].hasOwnProperty('playerBlack')){
                board[history[i]['playerBlack']]='X'
            }
            else if(history[i].hasOwnProperty('playerWhite')){
                board[history[i]['playerWhite']]='O'
            }
        }
    }
    return board
}

/* Function to store the game record in the database
    Input: game object containing the game information (startTime, endTime, playerBlack, playerWhite, winner, gameHistory) (see gameCtrl.js for more details)
    Output: the results of the query
*/
function storeGameRecord(game){
    // Return a promise
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err){
                // If there is an error, release the connection and reject the promise
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                // Calculate the game ID, start date, elapsed minutes, and final Go board
                const gameDbId = Math.random().toString(36).substring(7);
                const startDate = game.startTime.toISOString().split('T')[0]
                const elapsedMins = getMinutesDifference(game.startTime,game.endTime)
                const finalGoBoard = JSON.stringify(getFinalGoBoard(game.gameHistory))

                // Query the database
                connection.query('insert into gamerecord values (?,?,?,?,?,?,?);',
                [gameDbId,startDate,elapsedMins,game.playerBlack,game.playerWhite,game.winner,finalGoBoard],(err,results)=>{
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        resolve(results);
                    }
                });
            }
        })
    })
}

module.exports = storeGameRecord