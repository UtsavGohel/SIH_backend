const mysql = require('mysql2')
const mysqlCon = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
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