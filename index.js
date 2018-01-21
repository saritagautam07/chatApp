var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var sockectio = require('socket.io');
var io = sockectio.listen(server);
var userNames = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
   res.render( "index" );
})

io.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if(userNames.indexOf(data) != -1){
            callback(false);
        }
        else{
            callback(true);
            socket.userName = data;
            userNames.push(socket.userName);
            updateNames();
            console.log(userNames);
        }
    });

    function updateNames(){
        io.emit('usernames', userNames);
    }

    socket.on('message',function(msg){
        io.emit('new_message', {data: msg, user: socket.userName});
    });


    socket.on('disconnect', function(data){
        if(!socket.userName) return;
        userNames.splice(userNames.indexOf(socket.userName), 1);
        updateNames();
    });
});

server.listen(3000);
