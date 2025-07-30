import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser";

import connectToDB from "./DB/connectToDB.js";

dotenv.config()

const app=express();


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"]
   }));
   
// routing
app.use("/v1/auth",authRouter)
app.use("/v1/users",userRouter)

connectToDB()

const PORT= process.env.PORT || 5050;

app.get("/",(req,res)=>{
    res.status(200).send({
        message:"connected server"
    })
})



app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`)
})

