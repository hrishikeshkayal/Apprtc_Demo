var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var roomName = new Array();

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    console.log('A user connected');
    
    socket.on('connectToRoom', function (data) {
        roomName.push(data.roomName);
        socket.join(data.roomName);
        io.sockets.in(data.roomName).emit('connectStatus',
                                          {message:"You have connected to the " + data.roomName});
        console.log('A user Connected to '+data.roomName);
    });
    
    socket.on('emitToRoom', function (data) {
        console.log('A user emit in the room===>'+data.room);
        socket.broadcast.to(data.room).emit('roomBroadcast',data);
    });
    
    socket.on('leaveFromRoom', function (data) {
        console.log('A user leave the room===>'+data.room);
        io.in(data.room).emit('roomBroadcast',{username:data.username,room:data.room,emitData:"Leaving from the room."});
        socket.leave(data.room);
    });
    
    socket.on('disconnect', function () {
      console.log('A user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});