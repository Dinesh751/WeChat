import express from "express";
import dotenv from "dotenv";
import http from  "http";
import  {Server} from "socket.io"
import cors from "cors"
import connectToMongoDB from "./DB/connectToDB.js";
import { addMsgToConversation } from "./controllers/conversation.controller.js";
import chatRoute from "./router/chat.route.js"


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

const userSockerMap={};


io.on('connection', (socket) => {
  const userName=socket.handshake.query.userName;
  console.log(" connected User :"+userName)
  userSockerMap[userName]=socket;
    socket.on("chat msg",(msg)=>{
      const receiveSocket=userSockerMap[msg.receiver]
      console.log(msg)
      // socket.broadcast.emit('chat msg', msg);
      if(receiveSocket){
        receiveSocket.emit("chat msg",msg.textMessage);
      }
      addMsgToConversation([msg.sender,msg.receiver],{
        text:msg.textMessage,
        sender:msg.sender,
        receiver:msg.receiver
      })
    })
    
  });



const PORT=process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is Listening On Port ${PORT}`);
    });