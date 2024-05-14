const io = require("socket.io")(process.env.PORT || 5000,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
  },
});

// console.log("heelo")
const data = {
  orderId: "123456",
  name: "John Doe",
  order: "1 * Corn Pizza, 2 * Mint Mojito",
  amount: 15.99
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle socket events here
  socket.on("newOrder", (data) => {
    console.log("New order received from Flutter client:", data);
    io.emit("fetchOrder", data); // Emit to all connected clients, including Next.js
  });


  
  socket.on("disconnect",()=>{
    console.log("user disconnected");
  })

});

console.log("hello");

