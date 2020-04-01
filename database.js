var mysql = require('mysql');
const saltRounds = 10;
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'luffy04',
    password : 'Luffy04@',
    database : 'prefer'
});

function connectDB(){
    connection.connect();
}

function getUser(username,cb){
    connection.query(`select * from login where username='${username}'`,function(error,results,fields){
        console.log(username);
        cb(results);
    })
}

function signUp(username,email,password,cb){
    connection.query(`Insert into login(username,email,password) values('${username}','${email}','${password}')`,(err,results,field)=>{
        cb(err,results);
    })
}

module.exports={
    connectDB,
    signUp,
    getUser
}