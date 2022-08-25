const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')
const app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const bodyparser = require('body-parser')
const mysqlCon = require('./conn')
const router = require('./routes')
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(router)
require('./email_cron_job')();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

io.on('connection', (socket) => {
   socket.on('join', (data) => {
       socket.join(data.room);
       socket.broadcast.to(data.room).emit('user joined');
   });

   socket.on('message', (data) => {       
       io.in(data.room).emit('new message', {user: data.user, message: (data.message + "test")});
   });
});

server.listen(process.env.PORT || 3000, (err,msg)=>{
   if(err){
       console.log(err);
   }else{
       console.log("Server Connected",msg);
   }
})


