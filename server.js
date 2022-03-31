//we use the http module to handle the socket.io the socket io
//we want to access it directly to use socket.io
const http = require("http")
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = 'ChatCord bot'

//Events
//run when the client connects
io.on('connection', socket=>{
    //Listens to the event join room
    socket.on('joinRoom',({ username, room})=>{

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //console.log('New Connection');
        //Welcomes Current User (Only the client/user)
        socket.emit('message',formatMessage(botName,'Welcome to chatcord')); //catch on the main.js

        //broadcast when a user connects(does not broadcast to the user)/to.room for the current room
        socket.broadcast
        .to(user.room)
        .emit(
            'message',
            formatMessage(botName,`${user.username} has joined the chat`));

        //Send Users and Room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
    //Listen for ChatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        //console.log(msg) ( back to the client)
        io.to(user.room).emit('message',formatMessage(user.username, msg)) //emitting to everybody
    })
    //broadcast when a user leaves the chat
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
    
        }
        
      
    }); 
})


const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Server is currently running on port ${PORT}`);
});
