const mysql = require('mysql2')

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

function getMinutesDifference(date1, date2) {
    let differenceInMilliseconds = Math.abs(date2 - date1);
    let differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes;
}

function getFinalGoBoard(history){
    let board = Array(361).fill(null)
    const historyLength = history.length
    for(let i=historyLength-1;i>=0;i--){
        if(history[i].hasOwnProperty('retractStep')){
            i-=history[i]['retractStep']
        }
        else{
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

function storeGameRecord(game){
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                const gameDbId = Math.random().toString(36).substring(7);
                const startDate = game.startTime.toISOString().split('T')[0]
                const elapsedMins = getMinutesDifference(game.startTime,game.endTime)
                const finalGoBoard = JSON.stringify(getFinalGoBoard(game.gameHistory))
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