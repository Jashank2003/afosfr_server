import express from "express";
import paymentRouter from "./routes/payment.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";


dotenv.config();
const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const app = express();
app.use(express.json());
app.use(paymentRouter);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Map to track Flutter client's socket ID with the orderId
const orderTrack = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  // Join room based on shopId (for Next.js clients)
  socket.on("joinRoom", (shopId) => {
    console.log(`Client joined room: ${shopId}`);
    socket.join(shopId);
  });

  // Handle new order from Flutter client
  socket.on("newOrder", (orderJson, callback) => {
    const { shopId, orderId } = orderJson;
    console.log(`New order received for shopId ${shopId}:`, orderJson);
    console.log("order id is : ", orderId, "socket id of flutter client is : ", socket.id);
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
    console.log("Order completed:", orderId, orderTrack.get(orderId));
    const flutterClientSocketId = orderTrack.get(orderId);
    if (flutterClientSocketId) {
      // Notify the specific Flutter client that the order is ready
      io.to(flutterClientSocketId).emit("orderReady", {
        orderId,
        status: "ready",
        message: "Your order is ready for pickup!",
      });

      // Optionally, remove the order from tracking after notifying the client
      orderTrack.delete(orderId);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {  
  console.log(`Express server listening on port ${PORT}`);
});

io.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
});

