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

// Given the user name, this function will return te user's password
async function getUserInformation(username){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
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

async function modifyUserScore(username,operation){
    console.log(username, " ", operation)
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                connection.query('SELECT score FROM user WHERE Username= ? ;',[username],(err,results)=>{
                    if(err){
                        connection.release();
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
                        const currentScore = results[0]['score']+(operation?1:-1)
                        console.log("Current score is ", currentScore)
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

async function getUserScore(username){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
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

async function getLeaderBoardScore(){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                connection.query('SELECT Username, score FROM user ORDER BY score DESC LIMIT 10;',(err,results)=>{
                    connection.release();
                    if(err){
                        console.log("DATABASE QUERY ERROR:",err);
                        reject(err);
                    }else{
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