const mysql = require('mysql2')

/* Settings for the connection pool
    host: the host of the database
    user: the user of the database
    password: the password of the user
    database: the database to connect to
    port: the port of the database
    waitForConnections: determines the behavior when no connections are available and the limit has been reached. If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.
    connectionLimit: the maximum number of connections to create at once.
    queueLimit: the maximum number of connection requests the pool will queue before returning an error from getConnection.
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

/* Function to get the username from the database
   * It is for checking if the username is already in the database
    Input: username
    Output: the username
*/
async function getUsername(username){
    // Return a promise
    return new Promise((resolve,reject) => {
        // Get a connection from the pool
        pool.getConnection((err,connection)=>{
            if(err){
                // If there is an error, release the connection and reject the promise
                connection.release();
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                // If there is no error, query the database
                connection.query('SELECT Username FROM user WHERE Username= ? ;',[username],(err,results)=>{
                    // Release the connection
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

/* Function to create an account in the database
    Input: username, password
    Output: the results of the query
*/
async function createAccount(username,password){
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
                // If there is no error, query the database
                connection.query('insert into user values (?,?,?);',[username,password,0],(err,results)=>{
                    connection.release();
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

module.exports = {getUsername,createAccount};