const io = require("socket.io")(process.env.PORT || 5000,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
  },
});

// Map to track Flutter client's socket ID with the orderId
const orderTrack = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');


  // Handle socket events here
  // socket.on("newOrder", (data) => {
  //   console.log("New order received from Flutter client:", data);
  //   io.emit("fetchOrder", data); // Emit to all connected clients, including Next.js
  // });

  // Trying Phase:2

  // Join room based on shopId (for Next.js clients)
  socket.on("joinRoom", (shopId) => {
    console.log(`Client joined room: ${shopId}`);
    socket.join(shopId);
  });

   // Handle new order from Flutter client
   socket.on("newOrder", (orderJson, callback) => {
    const { shopId, orderId } = orderJson; 
    console.log(`New order received for shopId ${shopId}:`, orderJson);

    // Track the Flutter client's socket ID with the orderId
    orderTrack.set(orderId, socket.id);
    if (callback) {
      callback({ status: "received", message: "Order has been received by the server" });
    }

    // Emit to Next.js clients in the shopId room
    io.to(shopId).emit("fetchOrder", orderJson);
  });


   // Handle order completion from Next.js client
   socket.on("orderComplete", (orderId) => {
    
    console.log("Order completed:", orderId , orderTrack.get(orderId));
    const flutterClientSocketId = orderTrack.get(orderId);
    if (flutterClientSocketId) {
      // Notify the specific Flutter client that the order is ready
      io.to(flutterClientSocketId).emit("orderReady", { orderId, status: "ready", message: "Your order is ready for pickup!" });

      // Optionally, remove the order from tracking after notifying the client
      orderTrack.delete(orderId);
    }
  });



  socket.on("disconnect",()=>{
    console.log("user disconnected");
  })

});

console.log("hello I am Node Server");

