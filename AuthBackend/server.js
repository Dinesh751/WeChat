import express from "express"
import dotenv from "dotenv";

import connectToDB from "./DB/connectToDB.js";

dotenv.config()

const app=express();


app.use(express.json());

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

