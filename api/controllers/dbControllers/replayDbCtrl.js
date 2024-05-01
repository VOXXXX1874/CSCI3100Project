const mysql = require('mysql2')

/* Settings for the connection pool
 see createAccountDbCtrl.js for more details
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

/* Function to get the user's replays from the database
    Input: username
    Output: replays of the user (an array of objects, each object contains the gameID, playerBlack, playerWhite, winner, startTime, endTime, gameHistory)(see gameCtrl.js for more details)
*/
async function getUserReplays(username){
    // Return a promise
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                // If there is an error, release the connection and reject the promise
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                // If there is no error, query the database
                connection.query("SELECT * FROM gamerecord WHERE playerBlack = ? OR playerWhite = ?",[username,username],(err,results)=>{
                    connection.release();
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        console.log(results)
                        console.log("DATABASE QUERY SUCCESS")
                        resolve(results);
                    }
                });
            }
        });
    });
}

module.exports = getUserReplays;