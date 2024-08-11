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

const io = new Server({
    cors: {
      allowedHeaders:['*'],
      origin: "*"
    }
  });
const socket = io.listen(server);

const userSocketMap={};


io.on('connection', (socket) => {
  const userName=socket.handshake.query.userName;
  console.log(" connected User :"+userName)
  userSocketMap[userName]=socket;

  const channelName = `chat_${userName}`
 subscribe(channelName, (msg) => {
   socket.emit("chat msg", JSON.parse(msg));
 });

    socket.on("chat msg",(msg)=>{
      const receiverSocket=userSocketMap[msg.receiver]
    
      // socket.broadcast.emit('chat msg', msg);
      if (receiverSocket) {
        receiverSocket.emit('chat msg', msg);
      } else {
        const channelName = `chat_${msg.receiver}`
        publish(channelName, JSON.stringify(msg));
      }
   
      addMsgToConversation([msg.sender,msg.receiver],{
        text:msg.text,
        sender:msg.sender,
        receiver:msg.receiver
      })
    })
    
  });



const PORT=process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is Listening On Port ${PORT}`);
    });