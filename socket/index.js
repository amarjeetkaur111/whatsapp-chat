
const { Server } = require("socket.io");

const io = new Server({cors:'http://127.0.0.1:5173/'});

var onlineUsers = [];

io.on("connection", (socket) => {
  console.log('Connected to Socket',socket.id)

  //listen to new connections
  socket.on('addNewUser', (userData) => {
    !onlineUsers.some((user)=>{user.id === userData.userId}) && 
    onlineUsers.push({
        id: userData.userId,
        name: userData.userName,
        socketId : socket.id
    });
    console.log('Online Users',onlineUsers);
    io.emit('getOnlineUsers',onlineUsers);
  });

  //send message 

  socket.on('sendMessage',(message) => {
    const reciver = onlineUsers.find((user) => user.id === message.receiverId);
    if(reciver)
      io.to(reciver.socketId).emit('getMessage',message);
  });

  socket.on('disconnect' , () => {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
    io.emit('getOnlineUsers',onlineUsers);
  })
});

io.listen(3000);