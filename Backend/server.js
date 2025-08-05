import express from "express";
import dotenv from "dotenv";
import http from  "http";
import  {Server} from "socket.io"
import cors from "cors"
import connectToMongoDB from "./DB/connectToDB.js";
import { addMsgToConversation } from "./controllers/conversation.controller.js";
import chatRoute from "./router/chat.route.js"
import { publish,subscribe } from "./redisPubSub/redisPubSub.js";


dotenv.config();

const app= express();
// connect to db
connectToMongoDB();


app.use(cors({
  credentials: true,
  origin: "*"
 })
 );
 
app.use(express.json())



app.get("/",(req,res)=>{
    res.status(200).send({
        message:"Welcome... server is running "
    })
})
app.use("/v1/chat",chatRoute)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        allowedHeaders: ['*'],
        origin: "*"
    },
    pingTimeout: 60000, // 60 seconds timeout for inactivity
    pingInterval: 25000, // Send a ping every 25 seconds
});
const socket = io.listen(server);

const userSocketMap={};


io.on('connection', (socket) => {
  const userName = socket.handshake.query.userName;
  console.log("Connected User:", userName);

  // Add user to the map
  userSocketMap[userName] = socket;

  const channelName = `chat_${userName}`;
  subscribe(channelName, (msg) => {
    socket.emit("chat msg", JSON.parse(msg));
  });

  socket.on("chat msg", (msg) => {
    const receiverSocket = userSocketMap[msg.receiver];

    if (receiverSocket && receiverSocket.connected) {
        console.log(`Sending message to ${msg.receiver}`);
        receiverSocket.emit('chat msg', msg);
    } else {
        console.log(`Receiver ${msg.receiver} is not connected`);
        const channelName = `chat_${msg.receiver}`;
        publish(channelName, JSON.stringify(msg));
    }
});

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userName}`);
    delete userSocketMap[userName];
  });

  socket.on('heartbeat', () => {
    console.log(`Heartbeat received from ${userName}`);
});
});


const PORT=process.env.PORT || 8001;

server.listen(PORT, () => {
    console.log(`Server is Listening On Port ${PORT}`);
    });