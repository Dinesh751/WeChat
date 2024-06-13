import express from "express";
import dotenv from "dotenv";
import http from  "http";
import  {Server} from "socket.io"
import cors from "cors"


dotenv.config();

const app= express();


app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send({
        message:"Welcome... server is running "
    })
})

const server = http.createServer(app)

const io = new Server({
    cors: {
      allowedHeaders:['*'],
      origin: "*"
    }
  });
const socket = io.listen(server);


io.on('connection', (socket) => {
  console.log("a is connected")
    socket.on("chat msg",(msg)=>{
      console.log(msg)
      io.emit('chat msg',msg)
    })
    
  });



const PORT=process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is Listening On Port ${PORT}`);
    });