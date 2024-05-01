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

/* Function to get the user information from the database
    Input: username
    Output: the password of the user
*/
async function getUserInformation(username){
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
                connection.query('SELECT password FROM user WHERE Username= ? ;',[username],(err,results)=>{
                    connection.release();
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        resolve(results);
                    }
                });
            }
        });
    });
}

/* Function to modify the user score in the database
    Input: username, operation
    Output: the results of the query
*/
async function modifyUserScore(username,operation){
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
                connection.query('SELECT score FROM user WHERE Username= ? ;',[username],(err,results)=>{
                    if(err){
                        // If there is an error, release the connection and reject the promise
                        connection.release();
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        // If there is no error, update the score according to the operation
                        const currentScore = results[0]['score']+(operation?1:-1)
                        console.log("Current score is ", currentScore)

                        // Query the database to update the score
                        connection.query('Update user SET score=? WHERE Username= ? ;',[currentScore,username],(err,results)=>{
                            connection.release();
                            if(err){
                                console.log("DATABASE QUERY ERROR:",err);
                                reject('DB ERROR');
                            }else{
                                console.log("Result is ", results)
                                resolve('SUCCESS');
                            }
                        });
                    }
                });
            }
        })
    });
}

/* Function to get the user score from the database
    Input: username
    Output: the score of the user
*/
async function getUserScore(username){
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
                connection.query('SELECT score FROM user WHERE Username= ? ;',[username],(err,results)=>{
                    connection.release();
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        resolve(results[0]['score'])
                    }
                });
            }
        })
    });
}

/* Function to get the leaderboard score from the database
    Input: none
    Output: the leaderboard
*/
async function getLeaderBoardScore(){
    // Return a promise
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                // If there is an error, release the connection and reject the promise
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{// If there is no error, query the database
                connection.query('SELECT Username, score FROM user ORDER BY score DESC LIMIT 10;',(err,results)=>{
                    connection.release();
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        // If there is no error, format the leaderboard and resolve the promise
                        const leaderboard = results.map((user,index)=>({
                            rank: index + 1,
                            name: user.Username,
                            points: user.score
                        }))
                        resolve(leaderboard)
                    }
                });
            }
        })
    });
}

module.exports = {getUserInformation,modifyUserScore,getUserScore,getLeaderBoardScore};