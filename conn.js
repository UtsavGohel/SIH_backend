const mysql = require('mysql2')
const mysqlCon = mysql.createConnection({
    host:'mysql-86392-0.cloudclusters.net',
    port:11038,
    user:'admin',
    password:'CKHPBsDe',
    database:'tempsih'
 })
 
 

mysqlCon.connect((err)=>{
    if(!err){
        console.log('DB Connected');
    }else{
        console.log('Not Connected'+JSON.stringify(err,undefined,2));
    }
})

module.exports = mysqlCon