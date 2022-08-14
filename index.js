const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express();

const bodyparser = require('body-parser')
const mysqlCon = require('./conn')
const router = require('./routes')
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(router)
require('./email_cron_job')();


app.listen(3000,(err,msg)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Server Connected",msg);
    }
})