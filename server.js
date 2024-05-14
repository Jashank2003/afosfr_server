const io = require("socket.io")(5000,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
  },
});

// console.log("heelo")
const data = "hehe";
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit("newOrder",data);
  // Handle socket events here
  socket.on("newOrder" , (data)=>{
    console.log(data);

  })
  socket.on("disconnect",()=>{
    console.log("user disconnected");
  })

});

console.log("hello");

