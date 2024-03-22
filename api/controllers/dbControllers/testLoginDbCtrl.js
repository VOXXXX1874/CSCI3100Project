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

async function getTestUserInformation(){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection)=>{
            if(err){
                console.log("DATABASE CONNECTION ERROR:",err);
                reject(err);
            }
            else{
                connection.query('SELECT * FROM user;',(err,results)=>{
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

module.exports = getTestUserInformation;